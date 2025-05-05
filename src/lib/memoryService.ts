import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { openai } from './gpt';

// Interface for user memory data
export interface UserMemory {
  userId: string;
  summary: string;
  preferences: Record<string, any>;
  lastUpdated: any; // Firestore Timestamp
  createdAt: any; // Firestore Timestamp
}

// Maximum tokens for memory summary
const MAX_SUMMARY_TOKENS = 500;

// Get user memory
export async function getUserMemory(userId: string): Promise<UserMemory | null> {
  try {
    const memoryDoc = await getDoc(doc(db, 'userMemories', userId));
    
    if (!memoryDoc.exists()) {
      return null;
    }
    
    return memoryDoc.data() as UserMemory;
  } catch (error) {
    console.error('Error getting user memory:', error);
    return null;
  }
}

// Create or update user memory
export async function updateUserMemory(userId: string, summary: string, preferences: Record<string, any> = {}): Promise<void> {
  try {
    const memoryRef = doc(db, 'userMemories', userId);
    const memoryDoc = await getDoc(memoryRef);
    
    if (!memoryDoc.exists()) {
      // Create new memory document
      await setDoc(memoryRef, {
        userId,
        summary,
        preferences,
        lastUpdated: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } else {
      // Update existing memory document
      await updateDoc(memoryRef, {
        summary,
        preferences: { ...memoryDoc.data().preferences, ...preferences },
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating user memory:', error);
    throw new Error('Failed to update user memory');
  }
}

// Generate memory summary from chat messages
export async function generateMemorySummary(userId: string, recentMessages: any[]): Promise<string> {
  try {
    // First, get existing memory if available
    const existingMemory = await getUserMemory(userId);
    const existingSummary = existingMemory?.summary || '';
    
    // Filter only valuable messages (exclude greetings, simple acknowledgments, etc.)
    const valuableMessages = recentMessages.filter(msg => {
      // Skip very short messages or common phrases
      const content = msg.content.toLowerCase();
      if (content.length < 10) return false;
      if (content.includes('hello') || content.includes('hi there') || content.includes('thank you')) return false;
      return true;
    });
    
    // If there are no valuable messages, return existing summary
    if (valuableMessages.length === 0) {
      return existingSummary;
    }
    
    // Create prompt for OpenAI to generate summary
    const prompt = `
You are creating a compact memory summary for a food assistant chatbot.
 
Current Memory Summary:
${existingSummary || "No existing memory."}

Recent Chat Messages:
${valuableMessages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n')}

Create an updated memory summary that includes key information from these messages.
Follow these priority rules:
1. HIGHEST PRIORITY: Health and safety information like allergies or dietary restrictions should be listed FIRST and highlighted
2. User's food preferences and taste preferences
3. Favorite cuisines, dishes, or ingredients mentioned
4. Cooking skill level or equipment available 
5. Health goals or nutritional needs
6. Previous recipe recommendations they liked
7. Any persistent context that would be helpful for future conversations

For allergies and dietary restrictions, explicitly indicate "ALLERGY:" or "RESTRICTION:" at the start of those entries.

Keep the summary concise (under ${MAX_SUMMARY_TOKENS} tokens) but include all important details.
Focus only on facts and preferences, not general food knowledge that the assistant already knows.
`;

    // Call OpenAI API to generate summary
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that creates concise user memory summaries.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: MAX_SUMMARY_TOKENS,
      temperature: 0.7,
    });
    
    // Extract and return summary
    return response.choices[0].message.content || existingSummary;
  } catch (error) {
    console.error('Error generating memory summary:', error);
    return ''; // Return empty string on error
  }
}

// Get recent messages for a user across all chats
export async function getRecentUserMessages(userId: string, messageLimit: number = 20): Promise<any[]> {
  try {
    // Get recent chats for this user
    const chatsQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(5) // Limit to last 5 chats
    );
    
    const chatsSnapshot = await getDocs(chatsQuery);
    const recentMessages: any[] = [];
    
    // For each chat, get recent messages
    for (const chatDoc of chatsSnapshot.docs) {
      const chatId = chatDoc.id;
      
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'desc'),
        limit(Math.ceil(messageLimit / chatsSnapshot.size)) // Divide limit between chats
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      
      messagesSnapshot.forEach(msgDoc => {
        const msgData = msgDoc.data();
        recentMessages.push({
          role: msgData.role,
          content: msgData.content,
          timestamp: msgData.timestamp?.toDate?.() || new Date(),
        });
      });
    }
    
    // Sort all messages by timestamp
    recentMessages.sort((a, b) => b.timestamp - a.timestamp);
    
    // Return limited number of messages
    return recentMessages.slice(0, messageLimit);
  } catch (error) {
    console.error('Error getting recent messages:', error);
    return [];
  }
}

// Update user memory based on recent conversations
export async function refreshUserMemory(userId: string): Promise<void> {
  try {
    console.log(`Starting memory refresh for user: ${userId}`);
    
    // Get recent messages
    const recentMessages = await getRecentUserMessages(userId);
    console.log(`Found ${recentMessages.length} recent messages for memory generation`);
    
    if (recentMessages.length === 0) {
      console.log('No messages found for memory generation, skipping update');
      return;
    }
    
    // Generate updated memory summary
    const newSummary = await generateMemorySummary(userId, recentMessages);
    console.log('Generated new memory summary:', newSummary ? 'Success' : 'Failed');
    
    // Update user memory
    if (newSummary) {
      await updateUserMemory(userId, newSummary);
      console.log('User memory updated successfully');
    } else {
      console.log('No summary generated, skipping memory update');
    }
  } catch (error) {
    console.error('Error refreshing user memory:', error);
  }
}

// Force full memory update based on all user chats
export async function forceFullMemoryUpdate(userId: string): Promise<string> {
  try {
    console.log(`Starting force memory update for user: ${userId}`);
    
    // Get all user chats
    const chatsQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId)
    );
    
    const chatsSnapshot = await getDocs(chatsQuery);
    console.log(`Found ${chatsSnapshot.size} chats for user ${userId}`);
    
    if (chatsSnapshot.empty) {
      // If there are no chats, create a placeholder message
      const placeholderSummary = "New user. No chat history yet.";
      await updateUserMemory(userId, placeholderSummary);
      console.log(`No chats found. Created placeholder memory for user ${userId}`);
      return 'Placeholder memory created';
    }
    
    const allMessages: any[] = [];
    
    // For each chat, get all messages
    for (const chatDoc of chatsSnapshot.docs) {
      const chatId = chatDoc.id;
      
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      console.log(`Found ${messagesSnapshot.size} messages in chat ${chatId}`);
      
      messagesSnapshot.forEach(msgDoc => {
        const msgData = msgDoc.data();
        allMessages.push({
          role: msgData.role,
          content: msgData.content,
          timestamp: msgData.timestamp?.toDate?.() || new Date(),
        });
      });
    }
    
    // If no messages found, return message about it
    if (allMessages.length === 0) {
      // Create an empty memory record anyway
      const emptySummary = "User has no message history yet.";
      await updateUserMemory(userId, emptySummary);
      console.log(`No messages found. Created empty memory for user ${userId}`);
      return 'Empty memory created';
    }
    
    console.log(`Generating memory summary from ${allMessages.length} messages`);
    
    // Generate new memory summary
    const newSummary = await generateMemorySummary(userId, allMessages);
    
    // Update user memory
    if (newSummary) {
      await updateUserMemory(userId, newSummary);
      console.log('User memory updated successfully with full memory refresh');
      return 'Memory updated successfully';
    } else {
      console.error('Failed to generate memory summary');
      return 'Failed to generate memory summary';
    }
  } catch (error) {
    console.error('Error updating full memory:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
} 
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { ChatMessage, MessageImage } from './gpt';

// Function to get chat title from the first message
export function getChatTitleFromFirstMessage(message: string): string {
  if (!message) return "New questions";
  
  // Trim to 30 characters if the message is longer
  const titleText = message.trim();
  if (titleText.length <= 30) return titleText;
  
  return titleText.substring(0, 30) + "...";
}

// Type definitions
export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: any; // Using any for Firestore Timestamp
  updatedAt: any;
  messages?: ChatMessage[];
}

// Get all chats for a user
export async function getUserChats(userId: string): Promise<Chat[]> {
  try {
    // This query requires a composite index in Firestore
    // You need to create the index in Firebase Console:
    // Collection: chats
    // Fields to index: userId Ascending, updatedAt Descending
    // Visit the URL in the error message to create it directly
    const chatsQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    try {
      const querySnapshot = await getDocs(chatsQuery);
      const chats: Chat[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chats.push({
          id: doc.id,
          title: data.title || 'Untitled',
          userId: data.userId,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        });
      });
      
      return chats;
    } catch (indexError) {
      // If we get an index error, try a simpler query without sorting
      console.warn('Index not found. Using fallback query without sorting:', indexError);
      
      const simpleQuery = query(
        collection(db, 'chats'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(simpleQuery);
      const chats: Chat[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chats.push({
          id: doc.id,
          title: data.title || 'Untitled',
          userId: data.userId,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        });
      });
      
      // Sort manually in JavaScript since we can't use Firestore's orderBy
      return chats.sort((a, b) => {
        const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
        const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime(); // descending order
      });
    }
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw new Error('Failed to get chats');
  }
}

// Get a specific chat with messages
export async function getChat(chatId: string): Promise<Chat | null> {
  try {
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    
    if (!chatDoc.exists()) {
      return null;
    }
    
    const chatData = chatDoc.data();
    
    // Get messages for this chat
    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    const messages: ChatMessage[] = [];
    
    messagesSnapshot.forEach((doc) => {
      const messageData = doc.data();
      messages.push({
        // Use the id from data directly without trying to convert to number
        id: messageData.id || doc.id,
        role: messageData.role,
        content: messageData.content,
        timestamp: messageData.timestamp?.toDate?.().toISOString() || new Date().toISOString(),
        images: messageData.images || [],
      });
    });
    
    return {
      id: chatDoc.id,
      title: chatData.title || 'Untitled',
      userId: chatData.userId,
      createdAt: chatData.createdAt?.toDate?.() || new Date(),
      updatedAt: chatData.updatedAt?.toDate?.() || new Date(),
      messages,
    };
  } catch (error) {
    console.error('Error getting chat:', error);
    throw new Error('Failed to get chat');
  }
}

// Create a new chat
export async function createChat(userId: string, firstMessage?: ChatMessage): Promise<string> {
  try {
    // Create the chat document
    const chatData = {
      userId,
      title: firstMessage ? getChatTitleFromFirstMessage(firstMessage.content) : 'New Chat',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    
    // If there's a first message, add it to the subcollection
    if (firstMessage) {
      await addMessageToChat(chatRef.id, firstMessage);
    }
    
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw new Error('Failed to create chat');
  }
}

// Update chat title
export async function updateChatTitle(chatId: string, title: string): Promise<void> {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      title,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating chat title:', error);
    throw new Error('Failed to update chat title');
  }
}

// Delete a chat
export async function deleteChat(chatId: string): Promise<void> {
  try {
    // Get all messages to delete any attached images
    const messagesQuery = query(collection(db, 'chats', chatId, 'messages'));
    const messagesSnapshot = await getDocs(messagesQuery);
    
    // Delete each message and its images
    const messageDeletePromises = messagesSnapshot.docs.map(async (messageDoc) => {
      const messageData = messageDoc.data();
      
      // Delete any images associated with this message
      if (messageData.images && messageData.images.length > 0) {
        for (const image of messageData.images) {
          if (image.storagePath) {
            try {
              const imageRef = ref(storage, image.storagePath);
              await deleteObject(imageRef);
            } catch (err) {
              console.warn(`Failed to delete image: ${image.storagePath}`, err);
            }
          }
        }
      }
      
      // Delete the message document
      await deleteDoc(doc(db, 'chats', chatId, 'messages', messageDoc.id));
    });
    
    await Promise.all(messageDeletePromises);
    
    // Delete the chat document
    await deleteDoc(doc(db, 'chats', chatId));
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw new Error('Failed to delete chat');
  }
}

// Add message to a chat
export async function addMessageToChat(chatId: string, message: ChatMessage): Promise<string> {
  try {
    // Prepare the message data for Firestore
    const messageData: any = {
      role: message.role,
      content: message.content,
      timestamp: serverTimestamp(),
    };
    
    // If the message has an ID, include it
    if (message.id) {
      messageData.id = message.id;
    }
    
    // Handle images if present
    if (message.images && message.images.length > 0) {
      // Store the images directly in the message document
      messageData.images = message.images.map(img => ({
        url: img.url,
        alt: img.alt,
        storagePath: img.storagePath || null,
      }));
    }
    
    // Add message to the chat's messages subcollection
    const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);
    
    // Update the chat's updatedAt timestamp
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      updatedAt: serverTimestamp(),
    });
    
    return messageRef.id;
  } catch (error) {
    console.error('Error adding message to chat:', error);
    throw new Error('Failed to add message to chat');
  }
} 
import { NextResponse } from 'next/server';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { forceFullMemoryUpdate, getUserMemory } from '@/lib/memoryService';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { userId, allergyInfo } = await request.json();

    // Check if user ID is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create a test chat for allergy information
    const chatId = `test_allergy_${Date.now()}`;
    
    // Create chat in Firestore
    await setDoc(doc(db, 'chats', chatId), {
      userId: userId,
      title: 'Allergy Test Chat',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Add user message
    const userMessageId = `user_${uuidv4()}`;
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: allergyInfo || 'I have severe allergies to peanuts and shellfish. Please remember this important health information.',
      timestamp: serverTimestamp()
    };
    
    await setDoc(doc(db, 'chats', chatId, 'messages', userMessageId), userMessage);
    
    // Add assistant response
    const assistantMessageId = `assistant_${uuidv4()}`;
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: "I understand that you have severe allergies to peanuts and shellfish. This is important health information that I will remember. I'll make sure to consider these allergies when discussing food with you.",
      timestamp: serverTimestamp()
    };
    
    await setDoc(doc(db, 'chats', chatId, 'messages', assistantMessageId), assistantMessage);
    
    // Update user memory
    const result = await forceFullMemoryUpdate(userId);
    
    // Get updated memory
    const updatedMemory = await getUserMemory(userId);
    
    return NextResponse.json({
      success: true, 
      message: 'Test allergy information added and memory updated',
      memoryResult: result,
      memory: updatedMemory?.summary || null,
      chatId: chatId
    });
    
  } catch (error: any) {
    console.error('Memory force test API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during memory test' },
      { status: 500 }
    );
  }
} 
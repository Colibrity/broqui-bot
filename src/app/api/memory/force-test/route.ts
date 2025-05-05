import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { forceFullMemoryUpdate, getUserMemory } from '@/lib/memoryService';

export async function POST(request: Request) {
  try {
    // Get the userId and optional allergyInfo from the request
    const { userId, chatId, allergyInfo = "I have severe allergies to peanuts and shellfish. Please remember this important health information." } = await request.json();
    
    // Check if we have a userId
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if we have a chatId
    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      );
    }
    
    // Create a special test message for allergies
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      role: 'user',
      content: allergyInfo,
      timestamp: serverTimestamp(),
      images: [],
    });
    
    // Add a simulated response as well
    await addDoc(messagesRef, {
      role: 'assistant',
      content: "I've made a note of your allergies to peanuts and shellfish. I'll be sure to keep this in mind when discussing food-related topics with you. Is there anything specific you'd like to know about safe food choices for people with these allergies?",
      timestamp: serverTimestamp(),
      images: []
    });
    
    // Now force a memory update
    const result = await forceFullMemoryUpdate(userId);
    
    // Get updated memory
    const updatedMemory = await getUserMemory(userId);
    
    // Get the chat title for reference
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    const chatTitle = chatDoc.exists() ? chatDoc.data().title : 'Unknown chat';
    
    // Return success with the updated memory
    return NextResponse.json({
      success: true, 
      message: `Test allergy information added and memory updated for chat: ${chatTitle}`,
      memory: updatedMemory?.summary || null,
    });
    
  } catch (error: any) {
    console.error('Memory force test API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during memory test' },
      { status: 500 }
    );
  }
} 
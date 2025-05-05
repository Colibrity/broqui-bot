import { NextResponse } from 'next/server';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const chatId = params.id;
    
    if (!chatId) {
      return NextResponse.json(
        { success: false, error: 'Chat ID is required' },
        { status: 400 }
      );
    }
    
    // Get userId from request parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Get the chat document
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    
    if (!chatDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    const chatData = chatDoc.data();
    
    // Check if the chat belongs to the authenticated user
    if (chatData.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Get messages for this chat
    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages')
      // Temporarily removing sorting that might require an index
      // orderBy('timestamp', 'asc')
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    
    const messages = messagesSnapshot.docs.map(msgDoc => {
      const msgData = msgDoc.data();
      return {
        id: msgDoc.id,
        role: msgData.role,
        content: msgData.content,
        timestamp: msgData.timestamp?.toDate?.() || null,
        images: msgData.images || []
      };
    });
    
    // Sort messages by timestamp on the client side
    const sortedMessages = [...messages].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateA - dateB; // Sort in ascending order (oldest first)
    });
    
    // Format the chat data
    const chat = {
      id: chatDoc.id,
      title: chatData.title || 'Untitled Chat',
      userId: chatData.userId,
      createdAt: chatData.createdAt?.toDate?.() || null,
      updatedAt: chatData.updatedAt?.toDate?.() || null,
      messages: sortedMessages
    };
    
    return NextResponse.json({
      success: true,
      chat
    });
  } catch (error: any) {
    console.error('Chat detail API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch chat' },
      { status: 500 }
    );
  }
} 
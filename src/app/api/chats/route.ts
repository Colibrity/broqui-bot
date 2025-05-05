import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: Request) {
  try {
    // Получаем userId из параметров запроса
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Query chats for this user
    const chatsQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId)
    );
    
    const chatsSnapshot = await getDocs(chatsQuery);
    
    const chats = chatsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled Chat',
        userId: data.userId,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null
      };
    });
    
    // Сортируем чаты на стороне клиента
    const sortedChats = [...chats].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA; // Сортировка по убыванию (новые сначала)
    });
    
    return NextResponse.json({
      success: true,
      chats: sortedChats
    });
  } catch (error: any) {
    console.error('Chats API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch chats' },
      { status: 500 }
    );
  }
} 
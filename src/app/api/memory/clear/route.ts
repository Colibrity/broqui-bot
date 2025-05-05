import { NextResponse } from 'next/server';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Проверяем наличие ID пользователя
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли память для этого пользователя
    const memoryRef = doc(db, 'userMemories', userId);
    const memoryDoc = await getDoc(memoryRef);
    
    if (!memoryDoc.exists()) {
      // Если памяти нет, сообщаем что очищать нечего
      return NextResponse.json({
        success: true,
        message: 'No memory found for this user'
      });
    }
    
    // Удаляем документ памяти
    await deleteDoc(memoryRef);
    
    return NextResponse.json({
      success: true,
      message: 'Memory cleared successfully'
    });
    
  } catch (error: any) {
    console.error('Memory clear API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while clearing memory' },
      { status: 500 }
    );
  }
} 
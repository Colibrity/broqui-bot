import { NextResponse } from 'next/server';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    // Получаем данные из запроса в формате JSON
    const body = await request.json();
    const { imageData, chatId } = body;

    if (!imageData || !chatId) {
      return NextResponse.json({ error: 'Missing image data or chatId' }, { status: 400 });
    }

    // Проверяем, что imageData - это base64 строка
    if (!imageData.startsWith('data:')) {
      return NextResponse.json({ error: 'Invalid image data format' }, { status: 400 });
    }

    // Создаём путь в Firebase Storage
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const imagePath = `chats/${chatId}/images/${timestamp}-${randomId}`;
    
    // Загружаем в Firebase Storage напрямую как data URL
    const imageRef = ref(storage, imagePath);
    await uploadString(imageRef, imageData, 'data_url');
    
    // Получаем URL загруженного изображения
    const downloadUrl = await getDownloadURL(imageRef);

    // Возвращаем URL и путь для сохранения в сообщении
    return NextResponse.json({
      url: downloadUrl,
      storagePath: imagePath,
      success: true
    });
  } catch (error: any) {
    console.error('Error uploading base64 image:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to upload image',
      success: false 
    }, { status: 500 });
  }
} 
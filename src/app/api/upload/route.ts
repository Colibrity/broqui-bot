import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    // Получаем данные из запроса
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const chatId = formData.get('chatId') as string;
    
    if (!image || !chatId) {
      return NextResponse.json({ error: 'Missing image or chatId' }, { status: 400 });
    }

    // Создаём путь в Firebase Storage
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const imagePath = `chats/${chatId}/images/${timestamp}-${randomId}`;

    // Преобразуем файл в ArrayBuffer
    const bytes = await image.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Загружаем в Firebase Storage через сервер
    const imageRef = ref(storage, imagePath);
    await uploadBytes(imageRef, buffer);
    
    // Получаем URL загруженного изображения
    const downloadUrl = await getDownloadURL(imageRef);

    // Возвращаем URL и путь для сохранения в сообщении
    return NextResponse.json({
      url: downloadUrl,
      storagePath: imagePath,
      success: true
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to upload image',
      success: false 
    }, { status: 500 });
  }
} 
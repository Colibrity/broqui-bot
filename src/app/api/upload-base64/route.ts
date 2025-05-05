import { NextResponse } from 'next/server';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    // Get data from request in JSON format
    const body = await request.json();
    const { imageData, chatId } = body;

    if (!imageData || !chatId) {
      return NextResponse.json({ error: 'Missing image data or chatId' }, { status: 400 });
    }

    // Check that imageData is a base64 string
    if (!imageData.startsWith('data:')) {
      return NextResponse.json({ error: 'Invalid image data format' }, { status: 400 });
    }

    // Create path in Firebase Storage
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const imagePath = `chats/${chatId}/images/${timestamp}-${randomId}`;
    
    // Upload to Firebase Storage directly as data URL
    const imageRef = ref(storage, imagePath);
    await uploadString(imageRef, imageData, 'data_url');
    
    // Get URL of the uploaded image
    const downloadUrl = await getDownloadURL(imageRef);

    // Return URL and path for saving in the message
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
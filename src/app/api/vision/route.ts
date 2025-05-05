import { NextResponse } from 'next/server';
import { openai, SYSTEM_PROMPT } from '@/lib/gpt';
import { getUserMemory, forceFullMemoryUpdate } from '@/lib/memoryService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export async function POST(request: Request) {
  try {
    const { userId, image, prompt, textPrompt, chatId } = await request.json();
    const userPrompt = textPrompt || prompt;

    // Validate request data
    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Check for allergies in the text prompt
    const containsAllergies = userPrompt && 
      (userPrompt.toLowerCase().includes('allerg') || 
       userPrompt.toLowerCase().includes('intoleran') ||
       userPrompt.toLowerCase().includes('cannot eat') ||
       userPrompt.toLowerCase().includes('can\'t eat'));

    // Prepare system message with memory if available
    let systemMessage = SYSTEM_PROMPT;
    
    if (userId) {
      const userMemory = await getUserMemory(userId);
      
      if (userMemory?.summary) {
        // Check if memory contains allergy information
        const allergyInfo = userMemory.summary.includes('allerg') 
          ? `\n\n⚠️ IMPORTANT HEALTH INFORMATION ⚠️\n${userMemory.summary}`
          : `\n\nUSER MEMORY:\n${userMemory.summary}`;
        
        // Append user memory to system prompt
        systemMessage = `${SYSTEM_PROMPT}${allergyInfo}`;
      }
    }

    // Prepare messages for OpenAI API with the image
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemMessage
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: userPrompt || 'What can you tell me about this food?' },
          { 
            type: 'image_url', 
            image_url: { 
              url: image,
              detail: "high" 
            } 
          }
        ]
      }
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // If this request contains allergies, prioritize a memory update immediately
    if (userId) {
      // Use setTimeout to not block the response
      setTimeout(async () => {
        try {
          if (containsAllergies) {
            console.log('Detected allergy information in vision request, triggering full memory update');
            const result = await forceFullMemoryUpdate(userId);
            console.log('Memory update after allergy detection:', result);
          } else {
            console.log('Regular vision update, refreshing memory');
            await forceFullMemoryUpdate(userId);
          }
        } catch (error) {
          console.error('Failed to update memory after vision request:', error);
        }
      }, 100);
    }

    // Return the API response
    return NextResponse.json({
      content: response.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Vision API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the vision request' },
      { status: 500 }
    );
  }
} 
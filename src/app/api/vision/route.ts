import { NextResponse } from 'next/server';
import { openai, SYSTEM_PROMPT } from '@/lib/gpt';
import { getUserMemory, refreshUserMemory } from '@/lib/memoryService';
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
      
      // Schedule memory refresh in the background (don't await)
      refreshUserMemory(userId).catch(error => {
        console.error('Background memory refresh failed:', error);
      });
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

    // Create stream from OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
      stream: true,
    });

    // Transform the response to a ReadableStream
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        // Process each chunk from the OpenAI stream
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    // Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Vision API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred processing the image' },
      { status: 500 }
    );
  }
} 
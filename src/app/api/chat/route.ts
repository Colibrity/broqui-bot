import { NextResponse } from 'next/server';
import { openai, SYSTEM_PROMPT } from '@/lib/gpt';
import { getUserMemory, forceFullMemoryUpdate } from '@/lib/memoryService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { messages, userId, chatId } = await request.json();

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Check for allergies in the latest message
    const latestMessage = messages[messages.length - 1];
    const containsAllergies = latestMessage.role === 'user' && 
      (latestMessage.content.toLowerCase().includes('allerg') || 
       latestMessage.content.toLowerCase().includes('intoleran') ||
       latestMessage.content.toLowerCase().includes('cannot eat') ||
       latestMessage.content.toLowerCase().includes('can\'t eat'));
    
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

    // Prepare messages for OpenAI API
    const apiMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemMessage },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Create stream from OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: apiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // If this message contains allergies, prioritize a memory update immediately after response
    if (containsAllergies && userId) {
      // Schedule memory update after response completes (don't block the response)
      setTimeout(async () => {
        try {
          console.log('Detected allergy information, triggering full memory update');
          const result = await forceFullMemoryUpdate(userId);
          console.log('Memory update after allergy detection:', result);
        } catch (error) {
          console.error('Failed to update memory after allergy detection:', error);
        }
      }, 100);
    } else if (userId) {
      // For regular messages, still refresh memory but with less priority
      setTimeout(async () => {
        try {
          console.log('Regular chat update, refreshing memory');
          await forceFullMemoryUpdate(userId);
        } catch (error) {
          console.error('Background memory refresh failed:', error);
        }
      }, 200);
    }

    // Transform the response to a ReadableStream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
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
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the chat request' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { openai, SYSTEM_PROMPT } from '@/lib/gpt';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export async function POST(request: Request) {
  try {
    const { image, messages, textPrompt } = await request.json();

    // Validate input
    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Add food-specific instruction to analyze the image
    const foodAnalysisPrompt = `
      Analyze this food image and provide detailed information about:
      1. What food items are visible
      2. Approximate nutritional content (calories, protein, carbs, fat)
      3. Key ingredients or components
      4. Any health benefits or concerns
      5. Appropriate time to consume this food (breakfast, lunch, dinner, snack)
      6. Suggestions for improvements or alternatives for a healthier option if applicable
      
      Stick strictly to food-related analysis.
    `;

    // Use user's text prompt if provided, otherwise use default analysis prompt
    const promptText = textPrompt ? 
      `${foodAnalysisPrompt}\n\nUser's question: ${textPrompt}` : 
      foodAnalysisPrompt;

    // Build messages array with the image
    const userMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: [
        { type: 'text', text: promptText },
        { type: 'image_url', image_url: { url: image } }
      ]
    };
    
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: SYSTEM_PROMPT
    };
    
    // Prepare messages for OpenAI API
    const apiMessages: ChatCompletionMessageParam[] = [systemMessage];
    
    // Include previous conversation if provided
    if (messages && messages.length > 0) {
      // Add previous messages except the last user message (replaced with image message)
      const previousMessages: ChatCompletionMessageParam[] = messages
        .slice(0, -1)
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }));
        
      apiMessages.push(...previousMessages);
    }
    
    // Add the current user message with the image
    apiMessages.push(userMessage);

    // Make the request to OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: apiMessages,
      max_tokens: 800,
      temperature: 0.7,
    });

    // Return the response
    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Vision API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during image analysis' },
      { status: 500 }
    );
  }
} 
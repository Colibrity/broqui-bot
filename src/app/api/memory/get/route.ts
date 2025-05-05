import { NextResponse } from 'next/server';
import { getUserMemory } from '@/lib/memoryService';

export async function GET(request: Request) {
  try {
    // Get userId from query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // Check if user ID is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user memory
    const userMemory = await getUserMemory(userId);

    // Return user memory data
    return NextResponse.json({
      success: true,
      hasMemory: !!userMemory,
      memory: userMemory?.summary || null,
      lastUpdated: userMemory?.lastUpdated || null
    });
  } catch (error: any) {
    console.error('Memory get API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving memory' },
      { status: 500 }
    );
  }
} 
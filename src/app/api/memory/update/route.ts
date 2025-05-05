import { NextResponse } from 'next/server';
import { forceFullMemoryUpdate, getUserMemory } from '@/lib/memoryService';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Check if user ID is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Run full memory update for the user
    const result = await forceFullMemoryUpdate(userId);
    
    // Get updated memory to return in response
    const updatedMemory = await getUserMemory(userId);

    // Return operation result
    return NextResponse.json({
      success: result === 'Memory updated successfully',
      message: result,
      memory: updatedMemory?.summary || null
    });
  } catch (error: any) {
    console.error('Memory update API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during memory update' },
      { status: 500 }
    );
  }
} 
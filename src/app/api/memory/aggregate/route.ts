import { NextResponse } from "next/server";
import { forceFullMemoryUpdate } from "@/lib/memoryService";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Process all chats to update memory
    const result = await forceFullMemoryUpdate(userId);

    if (result.includes("Error")) {
      return NextResponse.json(
        { success: false, error: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: result });
  } catch (error) {
    console.error("Error aggregating memory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to aggregate memory" },
      { status: 500 }
    );
  }
} 
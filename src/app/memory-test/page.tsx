"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Chat message type
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  images?: any[];
}

// Chat type
interface Chat {
  id: string;
  title: string;
  userId: string;
  messages?: ChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default function MemoryTestPage() {
  const { user } = useAuth();
  const [memory, setMemory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  // Fetch current memory and chats on page load
  useEffect(() => {
    if (user) {
      fetchMemory();
      fetchChats();
    }
  }, [user]);

  // Fetch user chats
  const fetchChats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/chats?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setChats(data.chats || []);
        if (data.chats?.length === 0) {
          toast.info(
            "No chats found. This may be normal if you haven't chatted with the bot yet or if memory was created through a forced update."
          );
        }
      } else {
        console.error("Failed to fetch chats:", data.error);
        toast.error(`Error fetching chats: ${data.error}`);
        setTestResult(`Error fetching chats: ${data.error}`);
      }
    } catch (error: any) {
      console.error("Error fetching chats:", error);
      toast.error(`Error: ${error.message || "Unknown error"}`);
      setTestResult(
        `Error fetching chats: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Navigate to chat page
  const navigateToChat = (chatId: string) => {
    router.push(`/chat?id=${chatId}`);
  };

  // Fetch current memory
  const fetchMemory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/memory/get?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setMemory(data.memory);
      } else {
        setMemory(null);
        console.error("Failed to fetch memory:", data.error);
      }
    } catch (error) {
      console.error("Error fetching memory:", error);
      toast.error("Failed to fetch memory");
    } finally {
      setLoading(false);
    }
  };

  // Force memory update
  const updateMemory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/memory/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMemory(data.memory);
        toast.success("Memory updated successfully");
      } else {
        setTestResult(data.message);
        toast.error(data.message || "Failed to update memory");
      }
    } catch (error) {
      console.error("Error updating memory:", error);
      toast.error("Failed to update memory");
    } finally {
      setLoading(false);
    }
  };

  // Add test message with allergies
  const addTestAllergy = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // We use a special API to create a test message and update memory
      const response = await fetch("/api/memory/force-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          allergyInfo:
            "I have severe allergies to peanuts and shellfish. Please remember this important health information.",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create test data");
      }

      const data = await response.json();

      // Update memory on the page
      if (data.success) {
        setMemory(data.memory);
        setTestResult(
          `Test completed: ${data.message}. Memory has been updated.`
        );
        toast.success("Test completed successfully");

        // Update chat list
        await fetchChats();
      } else {
        setTestResult(`Test failed: ${data.error || "Unknown error"}`);
        toast.error("Test failed");
      }
    } catch (error) {
      console.error("Error in allergy test:", error);
      toast.error("Test failed");
    } finally {
      setLoading(false);
    }
  };

  // Clear user memory
  const clearMemory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/memory/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMemory(null);
        setTestResult(`Memory cleared: ${data.message}`);
        toast.success("User memory successfully cleared");
      } else {
        setTestResult(
          `Error clearing memory: ${data.error || "Unknown error"}`
        );
        toast.error(data.error || "Error clearing memory");
      }
    } catch (error: any) {
      console.error("Error clearing memory:", error);
      toast.error("Error clearing memory");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Memory Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to test bot memory.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-4 px-3 sm:py-8 sm:px-4">
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl">Bot Memory Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">
            This page allows you to test the bot's memory system. You can view
            current memory, force an update, or run tests.
          </p>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Button
              onClick={fetchMemory}
              disabled={loading}
              className="w-full sm:w-auto">
              Refresh Memory
            </Button>
            <Button
              onClick={updateMemory}
              disabled={loading}
              variant="outline"
              className="w-full sm:w-auto">
              Force Memory Update
            </Button>
            <Button
              onClick={addTestAllergy}
              disabled={loading}
              variant="secondary"
              className="w-full sm:w-auto">
              Add Test Allergy Info
            </Button>
            <Button
              onClick={fetchChats}
              disabled={loading}
              variant="ghost"
              className="w-full sm:w-auto">
              Refresh Chats
            </Button>
            <Button
              onClick={clearMemory}
              disabled={loading}
              variant="destructive"
              className="w-full sm:w-auto">
              Clear Memory
            </Button>
          </div>

          {testResult && (
            <div className="mb-4 p-2 sm:p-3 bg-muted rounded-md text-sm sm:text-base">
              <h3 className="font-medium mb-1">Test Result:</h3>
              <p>{testResult}</p>
            </div>
          )}

          <Separator className="my-3 sm:my-4" />

          <h3 className="font-medium mb-2 text-sm sm:text-base">
            Current Memory:
          </h3>
          {loading ? (
            <p>Loading...</p>
          ) : memory ? (
            <div className="p-2 sm:p-3 bg-muted rounded-md whitespace-pre-wrap mb-4 sm:mb-6 text-sm sm:text-base overflow-x-auto">
              {memory}
            </div>
          ) : (
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              No memory found for this user.
            </p>
          )}

          <Link
            href="/chat"
            className="text-primary hover:underline text-sm sm:text-base">
            Go to chat to continue conversations
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl">User Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">
            These are your chats stored in the system. These chats are used to
            generate memory. Click on a chat to open it.
          </p>

          {chats.length > 0 ? (
            <div className="grid gap-2 sm:gap-4 mb-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-2 sm:p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => navigateToChat(chat.id)}>
                  <h4 className="font-medium text-sm sm:text-base">
                    {chat.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {chat.updatedAt
                      ? new Date(chat.updatedAt).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              No chats found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

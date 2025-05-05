"use client";

import { useState, useEffect, useCallback } from "react";
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
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [memory, setMemory] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [memoryClearLoading, setMemoryClearLoading] = useState(false);
  const [memoryTestLoading, setMemoryTestLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Fetch chats
  const fetchChats = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/chats?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setChats(data.chats);
      } else {
        toast.error(data.error || "Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("An error occurred while fetching chats");
    }
  }, [user]);

  // Fetch memory
  const fetchMemory = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/memory/get?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setMemory(data.memory);
        setLastUpdated(data.lastUpdated);
      } else {
        toast.error(data.error || "Failed to fetch memory");
      }
    } catch (error) {
      console.error("Error fetching memory:", error);
      toast.error("An error occurred while fetching memory");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Clear memory
  const clearMemory = useCallback(async () => {
    if (!user) return;

    try {
      setMemoryClearLoading(true);
      const response = await fetch("/api/memory/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Memory cleared successfully");
        setMemory(null);
        setLastUpdated(null);
      } else {
        toast.error(data.error || "Failed to clear memory");
      }
    } catch (error) {
      console.error("Error clearing memory:", error);
      toast.error("An error occurred while clearing memory");
    } finally {
      setMemoryClearLoading(false);
    }
  }, [user]);

  // Force memory test - add test allergy data
  const forceMemoryTest = useCallback(async () => {
    if (!user || !selectedChat) {
      toast.error("Please select a chat first");
      return;
    }

    try {
      setMemoryTestLoading(true);
      const response = await fetch("/api/memory/force-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          chatId: selectedChat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Test allergy information added to memory");
        fetchMemory();
      } else {
        toast.error(data.error || "Failed to add test allergy information");
      }
    } catch (error) {
      console.error("Error adding test allergy info:", error);
      toast.error("An error occurred while adding test data");
    } finally {
      setMemoryTestLoading(false);
    }
  }, [user, selectedChat, fetchMemory]);

  // Initial data load
  useEffect(() => {
    if (user) {
      fetchChats();
      fetchMemory();
    }
  }, [user, fetchChats, fetchMemory]);

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Memory Testing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat selection */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Choose a chat to use for memory testing.
            </p>

            {chats.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No chats found</p>
                <Link href="/chat">
                  <Button>Start a new chat</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedChat === chat.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}>
                    {chat.title}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Memory display and actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Current Memory State</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchMemory}
                    disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearMemory}
                    disabled={memoryClearLoading || !memory}>
                    {memoryClearLoading ? "Clearing..." : "Clear Memory"}
                  </Button>
                </div>
              </div>

              <Separator />

              {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}

              <div className="p-4 bg-muted rounded-md min-h-[150px]">
                {memory ? (
                  <p className="whitespace-pre-wrap">{memory}</p>
                ) : (
                  <p className="text-muted-foreground text-center">
                    No memory data found. Start chatting to generate memory.
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-md font-medium mb-2">Test Actions</h3>
                <Button
                  onClick={forceMemoryTest}
                  disabled={memoryTestLoading || !selectedChat}>
                  {memoryTestLoading ? "Adding..." : "Add Test Allergy Memory"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will add a synthetic allergy test message to the selected
                  chat and trigger a memory update to show allergy warnings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

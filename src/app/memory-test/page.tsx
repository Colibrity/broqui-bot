"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";

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
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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
            "Чаты не найдены. Это может быть нормально, если вы еще не общались с ботом или если память была создана через принудительное обновление."
          );
        }
      } else {
        console.error("Failed to fetch chats:", data.error);
        toast.error(`Ошибка получения чатов: ${data.error}`);
        setTestResult(`Ошибка получения чатов: ${data.error}`);
      }
    } catch (error: any) {
      console.error("Error fetching chats:", error);
      toast.error(`Ошибка: ${error.message || "Неизвестная ошибка"}`);
      setTestResult(
        `Ошибка получения чатов: ${error.message || "Неизвестная ошибка"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async (chatId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/chats/${chatId}?userId=${user.uid}`);
      const data = await response.json();

      if (data.success && data.chat?.messages) {
        setChatMessages(data.chat.messages);
        setSelectedChat(chatId);
      } else {
        setChatMessages([]);
        console.error("Failed to fetch chat messages:", data.error);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setChatMessages([]);
    }
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
      // Используем специальный API для создания тестового сообщения и обновления памяти
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

      // Обновляем память на странице
      if (data.success) {
        setMemory(data.memory);
        setTestResult(
          `Test completed: ${data.message}. Memory has been updated.`
        );
        toast.success("Test completed successfully");

        // Обновляем список чатов
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
        setTestResult(`Память очищена: ${data.message}`);
        toast.success("Память пользователя успешно очищена");
      } else {
        setTestResult(
          `Ошибка очистки памяти: ${data.error || "Неизвестная ошибка"}`
        );
        toast.error(data.error || "Ошибка очистки памяти");
      }
    } catch (error: any) {
      console.error("Error clearing memory:", error);
      toast.error("Ошибка очистки памяти");
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
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bot Memory Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This page allows you to test the bot's memory system. You can view
            current memory, force an update, or run tests.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={fetchMemory} disabled={loading}>
              Refresh Memory
            </Button>
            <Button onClick={updateMemory} disabled={loading} variant="outline">
              Force Memory Update
            </Button>
            <Button
              onClick={addTestAllergy}
              disabled={loading}
              variant="secondary">
              Add Test Allergy Info
            </Button>
            <Button onClick={fetchChats} disabled={loading} variant="ghost">
              Refresh Chats
            </Button>
            <Button
              onClick={clearMemory}
              disabled={loading}
              variant="destructive">
              Clear Memory
            </Button>
          </div>

          {testResult && (
            <div className="mb-4 p-3 bg-muted rounded-md">
              <h3 className="font-medium mb-1">Test Result:</h3>
              <p>{testResult}</p>
            </div>
          )}

          <Separator className="my-4" />

          <h3 className="font-medium mb-2">Current Memory:</h3>
          {loading ? (
            <p>Loading...</p>
          ) : memory ? (
            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap mb-6">
              {memory}
            </div>
          ) : (
            <p className="text-muted-foreground mb-6">
              No memory found for this user.
            </p>
          )}

          <Link href="/chat" className="text-primary hover:underline">
            Go to chat to continue conversations
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            These are your chats stored in the system. These chats are used to
            generate memory.
          </p>

          {chats.length > 0 ? (
            <div className="grid gap-4 mb-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 border rounded-md cursor-pointer hover:bg-muted ${
                    selectedChat === chat.id ? "bg-muted" : ""
                  }`}
                  onClick={() => fetchChatMessages(chat.id)}>
                  <h4 className="font-medium">{chat.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {chat.updatedAt
                      ? new Date(chat.updatedAt).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mb-4">No chats found.</p>
          )}

          {selectedChat && (
            <>
              <Separator className="my-4" />
              <h3 className="font-medium mb-2">Chat Messages:</h3>

              {chatMessages.length > 0 ? (
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-md ${
                        message.role === "user" ? "bg-muted" : "bg-primary/10"
                      }`}>
                      <div className="text-xs font-medium mb-1">
                        {message.role.toUpperCase()}
                      </div>
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No messages in this chat.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Pencil1Icon,
  ChatBubbleIcon,
  CheckIcon,
  Cross1Icon,
  ClockIcon,
  CalendarIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  getUserChats,
  updateChatTitle,
  deleteChat,
  Chat,
} from "@/lib/chatService";
import { useAuth } from "@/hooks/useAuth";

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  // Loading user chats
  useEffect(() => {
    async function loadChats() {
      if (authLoading) return;

      if (!user) {
        // If user is not authenticated, show empty state
        setChats([]);
        setLoading(false);
        return;
      }

      try {
        const userChats = await getUserChats(user.uid);
        setChats(userChats);
      } catch (error) {
        console.error("Error loading chats:", error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    }

    loadChats();
  }, [user, authLoading]);

  // Start editing title
  const startEditing = (chatId: string, currentTitle: string) => {
    setEditingTitle(chatId);
    setNewTitle(currentTitle);
  };

  // Save new title
  const saveTitle = async (chatId: string) => {
    if (!newTitle.trim()) {
      setNewTitle("Untitled Chat");
    }

    // Update local state
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, title: newTitle.trim() || "Untitled Chat" }
          : chat
      )
    );

    // Update in Firestore if user is authenticated
    if (user) {
      try {
        await updateChatTitle(chatId, newTitle.trim() || "Untitled Chat");
      } catch (error) {
        console.error("Error updating chat title:", error);
      }
    }

    setEditingTitle(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTitle(null);
    setNewTitle("");
  };

  // Delete chat
  const handleDeleteChat = async (chatId: string) => {
    // Remove from local state
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));

    // Delete from Firestore if user is authenticated
    if (user) {
      try {
        await deleteChat(chatId);
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }

    setDeletingChatId(null);
  };

  // Open chat to continue conversation
  const openChat = (chatId: string) => {
    router.push(`/chat?id=${chatId}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP"); // 'April 29, 2023'
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "p"); // '12:00 AM'
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Chat History</h1>
        <Link href="/chat">
          <Button variant="default">
            <ChatBubbleIcon className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No conversations found. Start a new chat to see your history here.
          </p>
          <Link href="/chat">
            <Button>Start a new conversation</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {chats.map((chat) => (
            <Card key={chat.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  {editingTitle === chat.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter chat title"
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => saveTitle(chat.id)}
                        className="h-8 w-8">
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={cancelEditing}
                        className="h-8 w-8">
                        <Cross1Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="flex-1">{chat.title}</CardTitle>
                      <div className="flex space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEditing(chat.id, chat.title)}
                          title="Edit title"
                          className="h-8 w-8">
                          <Pencil1Icon className="h-4 w-4" />
                        </Button>
                        <AlertDialog
                          open={deletingChatId === chat.id}
                          onOpenChange={(open) =>
                            !open && setDeletingChatId(null)
                          }>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeletingChatId(chat.id)}
                              title="Delete chat"
                              className="h-8 w-8 text-destructive hover:text-destructive">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this chat? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteChat(chat.id)}
                                className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{formatDate(chat.updatedAt)}</span>
                  <span className="mx-1">•</span>
                  <ClockIcon className="h-3 w-3" />
                  <span>{formatTime(chat.updatedAt)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openChat(chat.id)}>
                  Continue Conversation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

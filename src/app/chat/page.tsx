"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import {
  MessageSquare,
  SendHorizontal,
  Image as ImageIcon,
  Loader2,
  X,
  PlusCircle,
} from "lucide-react";
import { ChatMessage } from "@/lib/gpt";
import { useAuth } from "@/hooks/useAuth";
import {
  getChat,
  createChat,
  addMessageToChat,
  getChatTitleFromFirstMessage,
} from "@/lib/chatService";

// Тип для выбранного изображения
interface SelectedImage {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
  firebaseUrl?: string;
  storagePath?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Загрузка чата по ID
  useEffect(() => {
    async function loadChat() {
      if (chatId) {
        try {
          if (user) {
            // If authenticated, load from Firestore
            console.log("Loading chat from Firestore with ID:", chatId);
            const chatData = await getChat(chatId);
            if (chatData && chatData.userId === user.uid) {
              console.log("Chat loaded, messages:", chatData.messages?.length);
              // Sort messages by timestamp instead of trying to convert IDs
              const sortedMessages = [...(chatData.messages || [])].sort(
                (a, b) => {
                  const timestampA = a.timestamp
                    ? new Date(a.timestamp).getTime()
                    : 0;
                  const timestampB = b.timestamp
                    ? new Date(b.timestamp).getTime()
                    : 0;
                  return timestampA - timestampB;
                }
              );

              setMessages(sortedMessages);
              setCurrentChatId(chatId);
              return;
            }
          }

          // If not authenticated or chat not found/not owned by user, start a new chat
          setMessages([]);
          setCurrentChatId(null);
          router.push("/chat"); // Redirect to a new chat
        } catch (error) {
          console.error("Error loading chat:", error);
          setMessages([]);
          setCurrentChatId(null);
        }
      } else {
        // If no ID, this is a new chat
        setMessages([]);
        setCurrentChatId(null);
      }
    }

    loadChat();
  }, [chatId, user, router]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Функция для создания нового чата
  const createNewChat = async () => {
    // If there are messages, save the current chat before creating a new one
    if (messages.length > 0) {
      await saveCurrentChat();
    }

    // Clear the current conversation
    setMessages([]);
    setCurrentChatId(null);

    // Update URL without parameters
    router.push("/chat");
  };

  // Функция для сохранения текущего чата
  const saveCurrentChat = async () => {
    if (messages.length === 0) return;

    try {
      // Get the title from the first user message
      const firstUserMessage = messages.find((msg) => msg.role === "user");
      const title = firstUserMessage
        ? getChatTitleFromFirstMessage(firstUserMessage.content)
        : "New Chat";

      if (user) {
        // If user is authenticated, save to Firestore
        if (currentChatId) {
          // If we have a chat ID, just update messages (handled in each message send)
          console.log(`Chat updated with ID: ${currentChatId}`);
          return currentChatId;
        } else {
          // If this is a new chat, create it in Firestore
          const newChatId = await createChat(user.uid, messages[0]);

          // Add all other messages to the chat
          for (let i = 1; i < messages.length; i++) {
            await addMessageToChat(newChatId, messages[i]);
          }

          console.log(`New chat created with ID: ${newChatId}`);
          return newChatId;
        }
      } else {
        // If not authenticated, redirect to login page
        router.push("/auth/login");
        return null;
      }
    } catch (error) {
      console.error("Error saving chat:", error);
      return null;
    }
  };

  const sendChatMessage = async (
    messageContent: string,
    imagesToSend: SelectedImage[] = []
  ) => {
    try {
      setIsLoading(true);

      let userMessageContent = messageContent;

      // If there are images, add them to the user message in a special format
      if (imagesToSend.length > 0) {
        userMessageContent =
          messageContent || "Here are some images to analyze:";
      }

      // Create the user message with a more unique ID
      const timestamp = Date.now();
      const userMessageId = `user_${timestamp}`;

      // Prepare images for the message
      const messageImages = imagesToSend.map((img) => {
        return {
          url: img.preview,
          alt: img.file.name,
        };
      });

      // Create user message
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: userMessageContent,
        images: messageImages,
        timestamp: new Date().toISOString(),
      };

      // Add to local messages state
      setMessages((prev) => [...prev, userMessage]);

      // Clear the input and selected images
      setInputValue("");
      setSelectedImages([]);

      // If this is a new chat, create it
      let actualChatId = currentChatId;
      if (!actualChatId && user) {
        // Create a new chat in Firestore
        actualChatId = await createChat(user.uid, userMessage);
        setCurrentChatId(actualChatId);
        router.push(`/chat?id=${actualChatId}`);
      } else if (actualChatId && user) {
        // Add the message to the existing chat
        await addMessageToChat(actualChatId, userMessage);
      }

      // Process AI response
      if (imagesToSend.length > 0) {
        // If there are images, use the Vision API
        try {
          // Use the first image for Vision API
          const response = await fetch("/api/vision", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: messageImages[0].url,
              textPrompt: messageContent,
              messages: messages,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to analyze image");
          }

          const data = await response.json();

          // Create AI response message with unique ID
          const assistantMessageId = `assistant_${Date.now()}`;
          const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: data.content,
            timestamp: new Date().toISOString(),
          };

          // Add assistant response to UI
          setMessages((prev) => [...prev, assistantMessage]);

          // Save to Firestore if authenticated
          if (actualChatId && user) {
            await addMessageToChat(actualChatId, assistantMessage);
          }
        } catch (error) {
          console.error("Error analyzing image:", error);
          // Show error message in chat with unique ID
          const errorMessageId = `error_${Date.now()}`;
          const errorMessage: ChatMessage = {
            id: errorMessageId,
            role: "assistant",
            content:
              "Sorry, I couldn't analyze the image. Please try again or upload a different image.",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } else {
        // If no images, send a normal text message
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [...messages, userMessage],
            }),
          });

          if (!response.ok) {
            throw new Error("Error sending message to API");
          }

          const reader = response.body?.getReader();
          if (!reader) throw new Error("Response body is null");

          const decoder = new TextDecoder("utf-8");
          let accumulatedContent = "";

          // Create assistant message for streaming with unique ID
          const assistantMessageId = `assistant_${Date.now()}`;
          const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            timestamp: new Date().toISOString(),
          };

          // Add empty assistant message that will be updated with streamed content
          setMessages((prev) => [...prev, assistantMessage]);

          // Stream the response
          let keepReading = true;
          while (keepReading) {
            const { done, value } = await reader.read();

            if (done) {
              keepReading = false;
              break;
            }

            const chunkText = decoder.decode(value);
            accumulatedContent += chunkText;

            // Update UI with new content
            setMessages((prevMessages) => {
              const lastIndex = prevMessages.length - 1;
              const updatedMessages = [...prevMessages];
              updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                content: accumulatedContent,
              };
              return updatedMessages;
            });
          }

          // Save complete assistant response to Firestore
          if (actualChatId && user && accumulatedContent.trim()) {
            const completeAssistantMessage: ChatMessage = {
              id: assistantMessageId,
              role: "assistant",
              content: accumulatedContent,
              timestamp: new Date().toISOString(),
            };
            await addMessageToChat(actualChatId, completeAssistantMessage);
          }
        } catch (error) {
          console.error("Error getting assistant response:", error);
          // Show error message in chat with unique ID
          const errorMessageId = `error_${Date.now()}`;
          const errorMessage: ChatMessage = {
            id: errorMessageId,
            role: "assistant",
            content:
              "Sorry, I couldn't process your message. Please try again.",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // If there is text or images, send the message
    if (inputValue.trim() || selectedImages.length > 0) {
      await sendChatMessage(inputValue.trim(), selectedImages);
    }
  };

  // Open file dialog
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Функция для обработки изменения файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    const newSelectedImages: SelectedImage[] = [];

    // Process each file
    selectedFiles.forEach((file) => {
      // Проверка типа файла (только изображения)
      if (!file.type.startsWith("image/")) {
        console.error("Only image files are allowed");
        return;
      }

      // Проверка размера файла (максимум 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        console.error("File is too large. Maximum size is 5MB");
        return;
      }

      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;

        const id =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);
        const newImage: SelectedImage = {
          id,
          file,
          preview: event.target.result as string,
        };

        setSelectedImages((prev) => [...prev, newImage]);
      };

      reader.readAsDataURL(file);
    });

    // Сбрасываем значение input, чтобы можно было загрузить тот же файл повторно
    e.target.value = "";
  };

  // Удаление выбранного изображения
  const removeSelectedImage = (id: string) => {
    setSelectedImages((prev) => {
      // Просто возвращаем массив без удаленного изображения
      return prev.filter((img) => img.id !== id);
    });
  };

  // Функция для отображения содержимого сообщения
  const renderMessageContent = (message: ChatMessage) => {
    // Handle text content
    const formattedText = message.content
      .split("\n")
      .map((line, i) => <p key={`text_line_${i}`}>{line}</p>);

    // Handle images
    const hasImages = message.images && message.images.length > 0;

    return (
      <div className="space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {formattedText}
        </div>

        {hasImages && (
          <div className="mt-3 space-y-3">
            {message.images?.map((image, index) => (
              <div
                key={`img_${index}_${Date.now()}`}
                className="relative rounded-lg overflow-hidden border border-border">
                <Image
                  src={image.url}
                  alt={image.alt || "Uploaded image"}
                  width={400}
                  height={300}
                  className="object-contain max-h-[300px] w-auto mx-auto"
                  onError={(e) => {
                    // If image fails to load, show fallback
                    e.currentTarget.src = "/image-placeholder.jpg";
                    e.currentTarget.alt = "Image failed to load";
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-sm">Start a conversation about food!</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`msg_${index}_${
                typeof message.id === "string" ? message.id : Date.now() + index
              }`}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}>
              <div
                className={`flex max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                    <div className="bg-primary text-primary-foreground flex items-center justify-center h-full w-full rounded-full">
                      <MessageSquare size={16} />
                    </div>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-2"
                      : "bg-muted"
                  }`}>
                  {renderMessageContent(message)}
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}>
                    {message.timestamp
                      ? new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                  <div className="bg-primary text-primary-foreground flex items-center justify-center h-full w-full rounded-full">
                    <MessageSquare size={16} />
                  </div>
                </Avatar>
                <div className="bg-muted rounded-lg p-4 flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        {/* Предпросмотр выбранных изображений */}
        {selectedImages.length > 0 && (
          <div className="max-w-3xl mx-auto mb-2 flex flex-wrap gap-2">
            {selectedImages.map((image) => (
              <div key={`preview_${image.id}`} className="relative">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={image.preview}
                    alt={image.file.name}
                    width={64}
                    height={64}
                    sizes="64px"
                    className={`object-cover w-full h-full ${
                      image.uploading ? "opacity-50" : ""
                    }`}
                  />
                  {image.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeSelectedImage(image.id)}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-end gap-2">
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={createNewChat}
              disabled={messages.length === 0}
              title="New chat">
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleFileUpload}
              title="Add image">
              <ImageIcon className="h-5 w-5" />
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Textarea
            placeholder="Ask me about food..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="min-h-[80px] flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0"
            disabled={
              (!inputValue.trim() && selectedImages.length === 0) || isLoading
            }>
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function MemoryTestLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // В production всегда перенаправляем на /chat
    if (process.env.NODE_ENV === "production") {
      router.replace("/chat");
      return;
    }

    // Перенаправляем на логин, если пользователь не авторизован
    if (!loading && !user && isClient) {
      router.replace("/auth/login");
    }
  }, [user, loading, router, isClient]);

  // Показываем индикатор загрузки, пока проверяем авторизацию
  if (loading || !isClient) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Если в production, не отображаем страницу
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // Показываем страницу только для авторизованных пользователей
  if (user) {
    return <>{children}</>;
  }

  // Возвращаем пустой div при перенаправлении
  return <div></div>;
}

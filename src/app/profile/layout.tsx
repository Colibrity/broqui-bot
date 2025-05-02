"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect to login if user is not authenticated
    if (!loading && !user && isClient) {
      router.push("/auth/login");
    }
  }, [user, loading, router, isClient]);

  // Show loading state while checking authentication
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

  // If authenticated, show the profile page with footer
  if (user) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    );
  }

  // Return empty div while redirecting
  return <div></div>;
}

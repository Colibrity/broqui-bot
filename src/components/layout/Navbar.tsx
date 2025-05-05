"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, History, Brain } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Skip rendering the navbar on the auth pages
  if (pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <header className="border-b py-4">
      <div className="container max-w-5xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-2xl font-bold">
          Broqui
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/chat"
                className={`text-sm ${
                  pathname === "/chat"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                Chat
              </Link>
              <Link
                href="/history"
                className={`text-sm ${
                  pathname === "/history"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                <History className="h-4 w-4 mr-1 inline-block" />
                History
              </Link>
              <Link
                href="/memory-test"
                className={`text-sm ${
                  pathname === "/memory-test"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                <Brain className="h-4 w-4 mr-1 inline-block" />
                Memory Test
              </Link>
              <Link
                href="/profile"
                className={`flex items-center text-sm ${
                  pathname === "/profile"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                <User className="h-4 w-4 mr-1" />
                Profile
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={signOut}
                title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

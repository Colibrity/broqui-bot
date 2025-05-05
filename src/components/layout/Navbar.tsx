"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  LogOut,
  User,
  History,
  Brain,
  Menu,
  X,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Skip rendering the navbar on the auth pages
  if (pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <>
      <header className="border-b py-4">
        <div className="container max-w-5xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold mr-6">
              Broqui
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {user && (
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
                  <Link
                    href="/pricing"
                    className={`text-sm ${
                      pathname === "/pricing"
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}>
                    <DollarSign className="h-4 w-4 mr-1 inline-block" />
                    Pricing
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <>
                  <span className="text-sm font-medium">
                    Hello,{" "}
                    {user.displayName || user.email?.split("@")[0] || "User"}
                  </span>
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
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="fixed left-0 top-0 h-full w-4/5 max-w-xs bg-background shadow-xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                Broqui
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {user ? (
              <div className="flex flex-col">
                <Link
                  href="/chat"
                  className={`p-4 border-b ${
                    pathname === "/chat" ? "text-primary font-medium" : ""
                  }`}>
                  Chat
                </Link>
                <Link
                  href="/history"
                  className={`p-4 border-b ${
                    pathname === "/history" ? "text-primary font-medium" : ""
                  }`}>
                  <History className="h-4 w-4 mr-2 inline-block" />
                  History
                </Link>
                <Link
                  href="/memory-test"
                  className={`p-4 border-b ${
                    pathname === "/memory-test"
                      ? "text-primary font-medium"
                      : ""
                  }`}>
                  <Brain className="h-4 w-4 mr-2 inline-block" />
                  Memory Test
                </Link>
                <Link
                  href="/profile"
                  className={`p-4 border-b ${
                    pathname === "/profile" ? "text-primary font-medium" : ""
                  }`}>
                  <User className="h-4 w-4 mr-2 inline-block" />
                  Profile
                </Link>
                <Link
                  href="/pricing"
                  className={`p-4 border-b ${
                    pathname === "/pricing" ? "text-primary font-medium" : ""
                  }`}>
                  <DollarSign className="h-4 w-4 mr-2 inline-block" />
                  Pricing
                </Link>
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="flex items-center">Theme</span>
                  <ThemeToggle />
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center p-4 text-left text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

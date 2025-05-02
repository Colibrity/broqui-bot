import Link from "next/link";
import { ReactNode } from "react";
import Footer from "./Footer";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container max-w-5xl flex justify-center">
          <Link href="/" className="text-2xl font-bold">
            Broqui Food Assistant
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}

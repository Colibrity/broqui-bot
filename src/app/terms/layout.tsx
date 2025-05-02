import { ReactNode } from "react";
import Footer from "@/components/layout/Footer";

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Update the year when the component mounts (for client-side rendering)
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 border-t mt-auto">
      <div className="container max-w-5xl flex flex-col sm:flex-row justify-between items-center mx-auto px-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          © {currentYear} Broqui Food Assistant. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 sm:mt-0 justify-center w-full sm:w-auto">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

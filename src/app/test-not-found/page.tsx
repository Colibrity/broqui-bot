import { notFound } from "next/navigation";

export default function TestNotFoundPage() {
  // This will trigger the not-found.tsx component
  notFound();
}

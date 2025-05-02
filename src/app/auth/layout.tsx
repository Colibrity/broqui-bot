import AuthLayout from "@/components/layout/AuthLayout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

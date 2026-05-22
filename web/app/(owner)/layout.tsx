import type { Metadata } from "next";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata("센터관리", "/owner");

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="business">{children}</AuthGuard>;
}

import type { Metadata } from "next";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata: Metadata = createNoIndexMetadata("내 활동 관리", "/trainer");

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="trainer">{children}</AuthGuard>;
}

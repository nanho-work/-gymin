import { AuthGuard } from "@/features/auth/components/AuthGuard";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="business">{children}</AuthGuard>;
}

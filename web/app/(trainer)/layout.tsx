import { AuthGuard } from "@/features/auth/components/AuthGuard";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="trainer">{children}</AuthGuard>;
}

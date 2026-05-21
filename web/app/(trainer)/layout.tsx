import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="trainer">
      <DashboardLayout role="trainer">{children}</DashboardLayout>
    </AuthGuard>
  );
}

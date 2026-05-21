import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="business">
      <DashboardLayout role="owner">{children}</DashboardLayout>
    </AuthGuard>
  );
}

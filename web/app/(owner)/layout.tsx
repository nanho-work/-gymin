import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="owner">{children}</DashboardLayout>;
}

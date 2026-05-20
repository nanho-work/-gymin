import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="trainer">{children}</DashboardLayout>;
}

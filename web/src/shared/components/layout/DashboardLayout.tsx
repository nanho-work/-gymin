import { DashboardSidebar } from "@/shared/components/layout/DashboardSidebar";

type DashboardRole = "trainer";

export function DashboardLayout({
  children,
  role
}: {
  children: React.ReactNode;
  role: DashboardRole;
}) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="pt-8">
        <DashboardSidebar role={role} />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

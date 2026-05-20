import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarRole = "trainer";

const menuItems: Record<SidebarRole, Array<{ to: string; label: string; description: string }>> = {
  trainer: [
    { to: "/trainer", label: "내 활동 관리", description: "프로필과 지원 현황" },
    { to: "/trainers/new", label: "내 프로필", description: "프로필 저장/수정" }
  ]
};

const roleTitle: Record<SidebarRole, string> = {
  trainer: "내 활동 관리"
};

export function DashboardSidebar({ role }: { role: SidebarRole }) {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-20 lg:h-fit">
      <div className="border-t border-line pt-4">
        <p className="px-1 pb-3 text-xs font-black text-muted">{roleTitle[role]}</p>
        <nav className="flex gap-2 overflow-x-auto lg:block lg:overflow-visible">
          {menuItems[role].map((item) => (
            <Link
              className={`block min-w-40 shrink-0 border-b border-line px-1 py-3 transition lg:min-w-0 ${
                pathname === item.to ? "text-ink" : "text-muted hover:text-ink"
              }`}
              href={item.to}
              key={item.to}
            >
              <span className="block text-sm font-black">{item.label}</span>
              <span className="mt-1 block text-xs font-bold opacity-70">{item.description}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

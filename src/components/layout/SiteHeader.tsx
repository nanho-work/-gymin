import { NavLink, useLocation } from "react-router-dom";
import { PrimaryLink } from "@/components/common/PrimaryLink";

const navItems = [
  { to: "/jobs/hiring", label: "구인글" }
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const isOwnerArea =
    pathname === "/owner" ||
    pathname.startsWith("/owner/jobs/") ||
    pathname === "/gyms/new" ||
    pathname === "/jobs/hiring/new";
  const isSignedInArea = isOwnerArea || pathname === "/trainer" || pathname === "/trainers/new";
  const visibleNavItems = isOwnerArea ? [] : navItems;
  const headerAction = pathname === "/login" ? { to: "/", label: "홈으로" } : isSignedInArea ? { to: "/", label: "로그아웃" } : { to: "/login", label: "로그인" };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <NavLink className="flex items-center gap-3" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm font-black text-mint">G</span>
          <span className="text-lg font-black tracking-tight text-ink">GymIn</span>
        </NavLink>
        <nav className="hidden items-center gap-1 lg:flex">
          {visibleNavItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-bold transition ${
                  isActive ? "bg-paper text-ink" : "text-muted hover:bg-paper hover:text-ink"
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <PrimaryLink to={headerAction.to} variant="light">
          {headerAction.label}
        </PrimaryLink>
      </div>
      {visibleNavItems.length > 0 ? (
        <nav className="flex gap-2 overflow-x-auto border-t border-line px-5 py-2 sm:px-8 lg:hidden">
          {visibleNavItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `shrink-0 rounded-md px-3 py-2 text-sm font-bold ${
                  isActive ? "bg-ink text-white" : "bg-paper text-muted"
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

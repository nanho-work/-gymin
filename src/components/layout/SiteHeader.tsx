import { NavLink } from "react-router-dom";
import { PrimaryLink } from "@/components/common/PrimaryLink";

const navItems = [
  { to: "/gyms", label: "헬스장 목록" },
  { to: "/jobs/hiring", label: "구인글" },
  { to: "/jobs/seeking", label: "구직글" },
  { to: "/boards/trainers", label: "트레이너 게시판" },
  { to: "/boards/owners", label: "사장님 게시판" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <NavLink className="flex items-center gap-3" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm font-black text-mint">G</span>
          <span className="text-lg font-black tracking-tight text-ink">gymin</span>
        </NavLink>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
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
        <div className="hidden gap-2 sm:flex">
          <PrimaryLink to="/trainers/new" variant="light">
            트레이너 등록
          </PrimaryLink>
          <PrimaryLink to="/gyms/new">헬스장 등록</PrimaryLink>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-line px-5 py-2 sm:px-8 lg:hidden">
        {navItems.map((item) => (
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
    </header>
  );
}

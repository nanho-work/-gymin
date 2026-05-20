"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getPlatformStats } from "@/shared/api/platformClient";
import type { PlatformStats } from "@/shared/api/types";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";

export function SiteHeader() {
  const pathname = usePathname();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const isOwnerArea =
    pathname === "/owner" ||
    pathname.startsWith("/owner/jobs/") ||
    pathname === "/gyms/new" ||
    pathname === "/jobs/hiring/new";
  const isSignedInArea = isOwnerArea || pathname === "/trainer" || pathname === "/trainers/new";
  const headerAction = pathname === "/login" ? { to: "/", label: "홈으로" } : isSignedInArea ? { to: "/", label: "로그아웃" } : { to: "/login", label: "로그인" };

  useEffect(() => {
    let isMounted = true;

    getPlatformStats()
      .then((nextStats) => {
        if (isMounted) {
          setStats(nextStats);
        }
      })
      .catch(() => {
        if (isMounted) {
          setStats(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm font-black text-mint">G</span>
            <span className="text-lg font-black tracking-tight text-ink">GymIn</span>
          </Link>
          {stats ? (
            <div className="hidden items-center gap-3 border-l border-line pl-5 text-xs font-black text-muted md:flex">
              <span>회원 {stats.total_members.toLocaleString("ko-KR")}명</span>
              <span>구인글 {stats.open_job_posts.toLocaleString("ko-KR")}개</span>
            </div>
          ) : null}
        </div>
        <PrimaryLink to={headerAction.to} variant="light">
          {headerAction.label}
        </PrimaryLink>
      </div>
    </header>
  );
}

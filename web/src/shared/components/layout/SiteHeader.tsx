"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getPlatformStats } from "@/shared/api/platformClient";
import type { PlatformStats } from "@/shared/api/types";
import { BrandMark } from "@/shared/components/layout/BrandMark";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";

export function SiteHeader() {
  const pathname = usePathname();
  const { logout, status, user } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const headerAction = pathname === "/login" ? { to: "/", label: "홈으로" } : { to: "/login", label: "로그인" };
  const dashboardHref = user?.role === "business" ? "/owner" : "/trainer";
  const dashboardLabel = user?.role === "business" ? "센터관리" : "내 활동 관리";

  async function handleLogout() {
    try {
      await logout();
    } finally {
      window.location.href = "/";
    }
  }

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
            <BrandMark />
            <span className="text-lg font-black tracking-tight text-ink">GymIn</span>
          </Link>
          <nav className="flex items-center gap-1 border-l border-line pl-4">
            <Link
              className={`rounded-md px-3 py-2 text-sm font-black transition ${
                pathname.startsWith("/jobs/hiring") ? "bg-paper text-ink" : "text-muted hover:bg-paper hover:text-ink"
              }`}
              href="/jobs/hiring"
            >
              구인글
            </Link>
            <Link
              className={`rounded-md px-3 py-2 text-sm font-black transition ${
                pathname.startsWith("/insights") ? "bg-paper text-ink" : "text-muted hover:bg-paper hover:text-ink"
              }`}
              href="/insights"
            >
              인사이트
            </Link>
          </nav>
          {stats ? (
            <div className="hidden items-center gap-3 border-l border-line pl-5 text-xs font-black text-muted lg:flex">
              <span>회원 {stats.total_members.toLocaleString("ko-KR")}명</span>
              <span>구인글 {stats.open_job_posts.toLocaleString("ko-KR")}개</span>
            </div>
          ) : null}
        </div>
        {user ? (
          <div className="flex items-center gap-2">
            <PrimaryLink to={dashboardHref} variant="light">
              {dashboardLabel}
            </PrimaryLink>
            <button
              className="inline-flex items-center justify-center border border-line bg-white px-4 py-2 text-sm font-black text-ink transition hover:border-neutral-400"
              onClick={handleLogout}
              type="button"
            >
              로그아웃
            </button>
          </div>
        ) : status === "loading" ? (
          <span className="text-sm font-black text-muted">확인 중</span>
        ) : (
          <PrimaryLink to={headerAction.to} variant="light">
            {headerAction.label}
          </PrimaryLink>
        )}
      </div>
    </header>
  );
}

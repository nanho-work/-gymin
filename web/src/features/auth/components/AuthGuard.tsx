"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { AuthRole } from "@/shared/api/authClient";

const dashboardPathByRole: Record<AuthRole, string> = {
  business: "/owner",
  trainer: "/trainer"
};

export function AuthGuard({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole: AuthRole;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== requiredRole) {
      router.replace(dashboardPathByRole[user.role]);
    }
  }, [pathname, requiredRole, router, status, user]);

  if (status === "loading") {
    return <AuthStatusNotice message="로그인 상태를 확인하고 있습니다." />;
  }

  if (!user || user.role !== requiredRole) {
    return <AuthStatusNotice message="권한을 확인하고 있습니다." />;
  }

  return <>{children}</>;
}

function AuthStatusNotice({ message }: { message: string }) {
  return (
    <div className="mx-auto min-h-[360px] w-full max-w-7xl px-5 py-16 sm:px-8">
      <div className="border-t border-line pt-6">
        <p className="text-sm font-black text-ink">{message}</p>
        <p className="mt-2 text-sm font-bold text-muted">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

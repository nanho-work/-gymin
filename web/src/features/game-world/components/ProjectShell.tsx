"use client";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { SiteLayout } from "@/shared/components/layout/SiteLayout";
export function ProjectShell({ children }: {
    children: React.ReactNode;
}) {
    const path = usePathname();
    if (["/", "/world", "/story", "/characters", "/items", "/history"].includes(path))
        return <>{children}</>;
    return <AuthProvider><SiteLayout>{children}</SiteLayout></AuthProvider>;
}

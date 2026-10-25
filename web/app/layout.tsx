import type { Metadata } from "next";
import { ProjectShell } from "@/features/game-world/components/ProjectShell";
import "@/styles/global.css";
export const metadata: Metadata = { title: "산하의 맹약 · 세계관 기록실", description: "한국풍 전술 RPG의 세계관, 인물, 이야기와 변경 기록. 작업 중인 기획 보드.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="ko"><body><ProjectShell>{children}</ProjectShell></body></html>; }

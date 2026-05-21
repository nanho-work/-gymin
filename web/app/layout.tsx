import type { Metadata } from "next";
import { SiteLayout } from "@/shared/components/layout/SiteLayout";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    default: "GymIn | 트레이너를 위한 피트니스 구인 게시판",
    template: "%s | GymIn"
  },
  description: "GymIn은 트레이너를 위한 피트니스 구인 게시판 목업 웹 서비스입니다."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <SiteLayout>{children}</SiteLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

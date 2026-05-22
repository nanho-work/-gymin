import { AuthPage } from "@/features/auth/pages/AuthPage";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = createNoIndexMetadata("로그인", "/login");

export default function Page() {
  return <AuthPage />;
}

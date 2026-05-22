import { GeneralSignupPage } from "@/features/auth/pages/GeneralSignupPage";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = createNoIndexMetadata("일반 회원가입", "/signup/general");

export default function Page() {
  return <GeneralSignupPage />;
}

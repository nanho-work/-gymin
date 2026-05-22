import { BusinessSignupPage } from "@/features/auth/pages/BusinessSignupPage";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = createNoIndexMetadata("사업자 회원가입", "/signup/business");

export default function Page() {
  return <BusinessSignupPage />;
}

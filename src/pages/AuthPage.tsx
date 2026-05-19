import { Container } from "@/components/common/Container";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useState } from "react";
import { Link } from "react-router-dom";

type LoginRole = "general" | "business";

const roleContent: Record<
  LoginRole,
  {
    label: string;
    description: string;
    continueTo: string;
  }
> = {
  general: {
    label: "일반 로그인",
    description: "트레이너 프로필 등록과 구인글 지원을 위한 계정입니다.",
    continueTo: "/trainer"
  },
  business: {
    label: "사업자 로그인",
    description: "센터 등록과 구인글 작성을 위한 사장님 계정입니다.",
    continueTo: "/owner"
  }
};

export function AuthPage() {
  useDocumentTitle("로그인");
  const [selectedRole, setSelectedRole] = useState<LoginRole>("general");
  const selectedContent = roleContent[selectedRole];

  return (
    <Container className="grid min-h-[calc(100vh-96px)] place-items-center py-10">
      <section className="w-full max-w-[420px] rounded-lg border border-line bg-white p-7 shadow-sm sm:p-8">
        <div>
          <div className="flex items-center justify-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-md bg-ink text-base font-black text-mint">G</span>
            <h1 className="text-3xl font-black tracking-tight text-ink">GymIn</h1>
          </div>
          <p className="mt-5 text-center text-sm leading-6 text-muted">{selectedContent.description}</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 rounded-md bg-paper p-1">
            {(Object.keys(roleContent) as LoginRole[]).map((role) => (
              <button
                className={`rounded-md px-3 py-2.5 text-sm font-black transition ${
                  selectedRole === role ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
                key={role}
                onClick={() => setSelectedRole(role)}
                type="button"
              >
                {roleContent[role].label}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <SocialLoginButton icon={<KakaoIcon />} label="카카오로 계속하기" to={selectedContent.continueTo} tone="kakao" />
            <SocialLoginButton icon={<GoogleIcon />} label="Google로 계속하기" to={selectedContent.continueTo} tone="google" />
          </div>
          <p className="text-center text-xs font-bold leading-5 text-muted">
            첫 로그인 후 필요한 기본 정보를 이어서 입력합니다.
          </p>
        </div>
      </section>
    </Container>
  );
}

function SocialLoginButton({
  icon,
  label,
  to,
  tone
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  tone: "google" | "kakao";
}) {
  const toneClassName =
    tone === "kakao"
      ? "border-[#FEE500] bg-[#FEE500] text-[#191919] hover:bg-[#f4dc00]"
      : "border-line bg-white text-ink hover:border-neutral-400";

  return (
    <Link
      className={`flex w-full items-center justify-center gap-3 rounded-md border px-5 py-3 text-sm font-black transition ${toneClassName}`}
      to={to}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function KakaoIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4.25c-4.42 0-8 2.73-8 6.1 0 2.13 1.43 4 3.59 5.09l-.61 2.55a.45.45 0 0 0 .68.49l3.07-2.05c.41.04.83.06 1.27.06 4.42 0 8-2.73 8-6.14s-3.58-6.1-8-6.1Z"
        fill="#191919"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.43Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.89 6.61-2.34l-3.22-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.75-5.6-4.12H3.08v2.59A9.99 9.99 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.4 13.98A6 6 0 0 1 6.08 12c0-.69.12-1.36.32-1.98V7.43H3.08A9.95 9.95 0 0 0 2 12c0 1.61.39 3.13 1.08 4.57l3.32-2.59Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.9c1.47 0 2.79.5 3.83 1.49l2.86-2.86C16.96 2.91 14.7 2 12 2a9.99 9.99 0 0 0-8.92 5.43l3.32 2.59C7.19 7.65 9.4 5.9 12 5.9Z"
        fill="#EA4335"
      />
    </svg>
  );
}

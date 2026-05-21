"use client";

import { Container } from "@/shared/components/ui/Container";
import { loginWithFirebaseToken, type AuthRole } from "@/shared/api/authClient";
import { getFirebaseAuth, googleProvider } from "@/shared/lib/firebase";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginRole = "general" | "business";

const roleContent: Record<
  LoginRole,
  {
    label: string;
    description: string;
  }
> = {
  general: {
    label: "트레이너 계정",
    description: "트레이너 프로필 등록과 구인글 지원을 위한 계정입니다."
  },
  business: {
    label: "센터 사장님 계정",
    description: "센터 등록과 구인글 작성을 위한 사장님 계정입니다."
  }
};

export function AuthPage() {
  useDocumentTitle("로그인");
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<LoginRole>("general");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const selectedContent = roleContent[selectedRole];
  const authRole: AuthRole = selectedRole === "business" ? "business" : "trainer";

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    setLoginError(null);

    try {
      const auth = getFirebaseAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const session = await loginWithFirebaseToken({
        idToken,
        role: authRole
      });
      router.push(session.user.role === "business" ? "/owner" : "/trainer");
      router.refresh();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Google 로그인에 실패했습니다.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Container className="min-h-[calc(100vh-132px)] py-14 sm:py-20">
      <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-ink text-base font-black text-mint">G</span>
            <h1 className="text-3xl font-black tracking-tight text-ink">GymIn</h1>
          </div>
          <p className="mt-10 text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            트레이너와 센터가 빠르게 만나는 피트니스 구인 플랫폼
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">
            구인글 확인, 트레이너 프로필 등록, 센터 공고 관리를 역할에 맞게 이어서 사용할 수 있습니다.
            현재는 실제 인증과 서버 저장 없이 화면 흐름만 확인하는 목업입니다.
          </p>
          <div className="mt-10 grid max-w-xl gap-4 border-y border-line py-6 sm:grid-cols-3">
            <LoginStat label="구인글" value="센터 공고" />
            <LoginStat label="지원" value="프로필 기반" />
            <LoginStat label="계정" value="역할 분리" />
          </div>
        </div>

        <div className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-sm font-black text-green">로그인 유형 선택</p>
          <h2 className="mt-3 text-2xl font-black text-ink">간편 로그인</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{selectedContent.description}</p>

          <div className="mt-8 grid grid-cols-2 border border-line bg-white">
            {(Object.keys(roleContent) as LoginRole[]).map((role) => (
              <button
                className={`border-r border-line px-3 py-3 text-sm font-black transition last:border-r-0 ${
                  selectedRole === role ? "bg-ink text-white" : "text-muted hover:bg-paper hover:text-ink"
                }`}
                key={role}
                onClick={() => setSelectedRole(role)}
                type="button"
              >
                {roleContent[role].label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <SocialLoginButton
              icon={<KakaoIcon />}
              disabled
              label={`${selectedContent.label}으로 카카오 로그인`}
              tone="kakao"
            />
            <SocialLoginButton
              icon={<GoogleIcon />}
              disabled={isGoogleLoading}
              label={
                isGoogleLoading ? "Google 로그인 처리 중" : `${selectedContent.label}으로 Google 로그인`
              }
              onClick={handleGoogleLogin}
              tone="google"
            />
          </div>

          {loginError ? (
            <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-700">
              {loginError}
            </p>
          ) : null}

          <p className="mt-5 border-t border-line pt-5 text-xs font-bold leading-5 text-muted">
            첫 로그인 후 필요한 기본 정보를 이어서 입력합니다.
          </p>
        </div>
      </section>
    </Container>
  );
}

function LoginStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black text-muted">{label}</p>
      <p className="mt-2 text-base font-black text-ink">{value}</p>
    </div>
  );
}

function SocialLoginButton({
  disabled = false,
  icon,
  label,
  onClick,
  tone
}: {
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  tone: "google" | "kakao";
}) {
  const toneClassName =
    tone === "kakao"
      ? "border-[#FEE500] bg-[#FEE500] text-[#191919] hover:bg-[#f4dc00]"
      : "border-line bg-white text-ink hover:border-neutral-400";

  if (onClick) {
    return (
      <button
        className={`flex w-full items-center justify-center gap-3 border px-5 py-3.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName}`}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      className={`flex w-full cursor-not-allowed items-center justify-center gap-3 border px-5 py-3.5 text-sm font-black opacity-50 transition ${toneClassName}`}
      disabled
      type="button"
    >
      {icon}
      <span>{label} 준비 중</span>
    </button>
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

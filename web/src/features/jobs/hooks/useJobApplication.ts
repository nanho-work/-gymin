"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { createJobApplication } from "@/shared/api/applicationsClient";

export type JobApplicationState = "idle" | "submitting" | "submitted" | "error";

export function useJobApplication({
  canApply,
  jobId
}: {
  canApply: boolean;
  jobId: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status: authStatus, user } = useAuth();
  const [applicationState, setApplicationState] = useState<JobApplicationState>("idle");
  const [applicationMessage, setApplicationMessage] = useState("");

  const handleApply = async () => {
    if (!jobId || !canApply || applicationState === "submitting" || applicationState === "submitted") {
      return;
    }

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== "trainer") {
      setApplicationState("error");
      setApplicationMessage("트레이너 계정으로 로그인하면 지원할 수 있습니다.");
      return;
    }

    setApplicationState("submitting");
    setApplicationMessage("");

    try {
      await createJobApplication({
        job_post_id: jobId,
        message: null
      });
      setApplicationState("submitted");
      setApplicationMessage("지원이 완료되었습니다.");
    } catch (error) {
      setApplicationState("error");
      setApplicationMessage(error instanceof Error ? error.message : "지원에 실패했습니다.");
    }
  };

  return {
    applicationMessage,
    applicationState,
    canShowApply: !user || user.role === "trainer",
    handleApply,
    isApplyDisabled:
      !canApply ||
      authStatus === "loading" ||
      applicationState === "submitting" ||
      applicationState === "submitted"
  };
}

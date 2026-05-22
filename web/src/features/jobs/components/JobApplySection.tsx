import Link from "next/link";

import type { JobApplicationState } from "@/features/jobs/hooks/useJobApplication";

export function JobApplySection({
  applicationMessage,
  applicationState,
  disabled,
  onApply
}: {
  applicationMessage: string;
  applicationState: JobApplicationState;
  disabled: boolean;
  onApply: () => void;
}) {
  return (
    <section className="border-b border-line py-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black text-ink">지원</h2>
        <button
          className="rounded-md bg-ink px-7 py-3 text-sm font-black text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={onApply}
          type="button"
        >
          {applicationState === "submitting" ? "지원 중" : applicationState === "submitted" ? "지원 완료" : "지원하기"}
        </button>
      </div>
      {applicationMessage ? (
        <p className={`mt-3 text-sm font-bold ${applicationState === "error" ? "text-amber-800" : "text-forest"}`}>
          {applicationMessage}
          {applicationState === "error" && applicationMessage.includes("프로필") ? (
            <Link className="ml-2 underline" href="/trainers/new">
              프로필 작성
            </Link>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}

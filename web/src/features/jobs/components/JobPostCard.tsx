"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import type { JobPost } from "@/shared/types/domain";
import { createJobApplication } from "@/shared/api/applicationsClient";

export function JobPostCard({ enableApplication = true, post }: { enableApplication?: boolean; post: JobPost }) {
  const profileHref = post.gymId ? `/gyms/${post.gymId}` : "#";
  const secondaryLabel = "업장 상세";
  const [applicationState, setApplicationState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [applicationMessage, setApplicationMessage] = useState("");
  const canApply = enableApplication && post.status === "지원 가능";

  const handleApply = async () => {
    if (!canApply || applicationState === "submitting" || applicationState === "submitted") {
      return;
    }

    setApplicationState("submitting");
    setApplicationMessage("");

    try {
      await createJobApplication({
        job_post_id: post.id,
        message: null
      });
      setApplicationState("submitted");
      setApplicationMessage("지원이 완료되었습니다.");
    } catch (error) {
      setApplicationState("error");
      setApplicationMessage(error instanceof Error ? error.message : "지원에 실패했습니다.");
    }
  };

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">구인</Badge>
            <Badge>{post.status}</Badge>
          </div>
          <h2 className="mt-4 text-xl font-black text-ink">{post.title}</h2>
          <p className="mt-2 text-sm font-bold text-muted">
            {post.authorName} · {post.area}
          </p>
        </div>
        <p className="text-sm font-bold text-muted">{post.postedAt}</p>
      </div>
      <p className="mt-4 leading-7 text-muted">{post.summary}</p>
      <dl className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-black uppercase text-muted">형태</dt>
          <dd className="mt-1 font-black text-ink">{post.employmentType}</dd>
        </div>
        <div>
          <dt className="text-xs font-black uppercase text-muted">정산</dt>
          <dd className="mt-1 font-black text-ink">{post.compensation}</dd>
        </div>
        <div>
          <dt className="text-xs font-black uppercase text-muted">시간</dt>
          <dd className="mt-1 font-black text-ink">{post.schedule}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
        <button
          className="rounded-md bg-ink px-4 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canApply || applicationState === "submitting" || applicationState === "submitted"}
          onClick={handleApply}
          type="button"
        >
          {applicationState === "submitting" ? "지원 중" : applicationState === "submitted" ? "지원 완료" : "내 프로필로 지원"}
        </button>
        {post.gymId ? (
          <Link className="rounded-md border border-line px-4 py-2.5 text-sm font-black text-ink hover:border-green" href={profileHref}>
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
      {!enableApplication ? (
        <p className="mt-3 text-sm font-bold text-muted">서버 공고를 불러온 뒤 지원할 수 있습니다.</p>
      ) : null}
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
    </article>
  );
}

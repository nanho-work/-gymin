"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createJobApplication } from "@/shared/api/applicationsClient";
import { getJobPost, toDomainJobPost } from "@/shared/api/jobsClient";
import type { JobPostRead } from "@/shared/api/serverTypes";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { formatCenterIndustry, getCenterAddress, getCenterArea } from "@/shared/utils/center";
import {
  formatEmploymentType,
  formatInsuranceType,
  formatJobRole,
  formatJobStatus,
  formatMemberHandover,
  formatSalesPressure
} from "@/shared/utils/job";

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { status: authStatus, user } = useAuth();
  const [job, setJob] = useState<JobPostRead | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [applicationState, setApplicationState] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [applicationMessage, setApplicationMessage] = useState("");

  useDocumentTitle(job ? `${job.title} 구인글` : "구인글 상세");

  useEffect(() => {
    let isMounted = true;

    getJobPost(jobId)
      .then((nextJob) => {
        if (!isMounted) {
          return;
        }

        setJob(nextJob);
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error.message);
        setStatus(error.message.includes("찾을 수 없습니다") ? "missing" : "error");
      });

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const domainJob = useMemo(() => (job ? toDomainJobPost(job) : null), [job]);
  const center = job?.center ?? null;
  const canApply = job?.status === "open";

  const handleApply = async () => {
    if (!job || !canApply || applicationState === "submitting" || applicationState === "submitted") {
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
        job_post_id: job.id,
        message: null
      });
      setApplicationState("submitted");
      setApplicationMessage("지원이 완료되었습니다.");
    } catch (error) {
      setApplicationState("error");
      setApplicationMessage(error instanceof Error ? error.message : "지원에 실패했습니다.");
    }
  };

  if (status === "loading") {
    return (
      <Container className="py-16">
        <Badge tone="green">구인글</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">구인글을 불러오는 중입니다</h1>
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container className="py-16">
        <Badge tone="amber">확인 필요</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">구인글을 불러오지 못했습니다</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{errorMessage || "잠시 후 다시 시도해 주세요."}</p>
      </Container>
    );
  }

  if (status === "missing" || !job || !domainJob) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-black text-ink">구인글을 찾을 수 없습니다</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{errorMessage}</p>
        <Link className="mt-5 inline-block rounded-md bg-ink px-4 py-3 text-sm font-black text-white" href="/jobs/hiring">
          구인글 목록으로
        </Link>
      </Container>
    );
  }

  return (
    <Container className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <main className="space-y-6">
        <section className="border-b border-line pb-7">
          <div className="flex flex-wrap gap-2">
            <Badge tone={canApply ? "green" : "neutral"}>{formatJobStatus(job.status)}</Badge>
            <Badge>{formatJobRole(job.job_role)}</Badge>
            <Badge>{formatEmploymentType(job.employment_type)}</Badge>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-ink sm:text-4xl">{job.title}</h1>
          <p className="mt-3 text-sm font-bold text-muted">
            {domainJob.authorName} · {domainJob.area} · {domainJob.postedAt}
          </p>
          <p className="mt-5 max-w-3xl leading-8 text-muted">
            {job.description || job.support_detail || "상세 설명이 아직 등록되지 않았습니다."}
          </p>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">근무 조건</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoBlock label="근무 시작" value={job.start_date_text || "협의"} />
            <InfoBlock label="근무 요일" value={job.work_days || "협의"} />
            <InfoBlock label="근무 시간" value={job.work_hours || "협의"} />
            <InfoBlock label="휴게 시간" value={job.rest_time || "협의"} />
            <InfoBlock label="기본급" value={job.base_pay || "협의"} />
            <InfoBlock label="수업료/인센티브" value={job.incentive || "협의"} />
            <InfoBlock label="정산 방식" value={job.settlement_type || "협의"} />
            <InfoBlock label="4대보험" value={formatInsuranceType(job.insurance_type)} />
            <InfoBlock label="영업 압박" value={formatSalesPressure(job.sales_pressure)} />
            <InfoBlock label="회원 인계" value={formatMemberHandover(job.member_handover)} />
            <InfoBlock label="휴가/월차" value={job.vacation || "협의"} />
            <InfoBlock label="추가 지원" value={job.support_detail || "미입력"} />
          </div>
        </section>

        {center ? (
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">업장 정보</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBlock label="센터명" value={center.name} />
              <InfoBlock label="지역" value={getCenterArea(center)} />
              <InfoBlock label="주소" value={getCenterAddress(center)} />
              <InfoBlock label="업종" value={formatCenterIndustry(center.industry)} />
            </div>
          </section>
        ) : null}
      </main>

      <aside className="h-fit space-y-4 border-t border-line pt-5 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <section>
          <h2 className="text-sm font-black text-ink">지원</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-muted">
            저장된 트레이너 프로필로 지원합니다. 지원 후 사업자가 공개 프로필과 연락처를 확인할 수 있습니다.
          </p>
          <button
            className="mt-4 w-full rounded-md bg-ink px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canApply || authStatus === "loading" || applicationState === "submitting" || applicationState === "submitted"}
            onClick={handleApply}
            type="button"
          >
            {applicationState === "submitting" ? "지원 중" : applicationState === "submitted" ? "지원 완료" : "내 프로필로 지원"}
          </button>
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

        <div className="space-y-2 border-t border-line pt-4">
          {job.center_id ? (
            <PrimaryLink to={`/gyms/${job.center_id}`} variant="light">
              업장 정보 보기
            </PrimaryLink>
          ) : null}
          <PrimaryLink to="/jobs/hiring" variant="light">
            목록으로 돌아가기
          </PrimaryLink>
        </div>
      </aside>
    </Container>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-4">
      <p className="text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-2 font-bold leading-6 text-ink">{value}</p>
    </div>
  );
}

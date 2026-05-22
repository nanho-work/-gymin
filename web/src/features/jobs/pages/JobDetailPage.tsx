"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { createJobApplication } from "@/shared/api/applicationsClient";
import { getJobPost, toDomainJobPost } from "@/shared/api/jobsClient";
import { getMediaDisplayUrl } from "@/shared/api/mediaClient";
import type { JobPostRead } from "@/shared/api/serverTypes";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
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
import { formatWorkDays, parseWorkDayCodes, weekdayOptions } from "@/shared/utils/weekdays";

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
  const centerImageUrl = useMemo(() => {
    const centerMedia = center?.media ?? [];
    const representativeImage =
      centerMedia.find((item) => item.purpose === "representative") ??
      centerMedia.find((item) => item.purpose === "gallery");
    return getMediaDisplayUrl(representativeImage);
  }, [center]);
  const contentImages = useMemo(
    () =>
      (job?.media ?? [])
        .filter((item) => item.purpose === "content")
        .map((item) => ({ id: item.id, url: getMediaDisplayUrl(item) }))
        .filter((item) => item.url),
    [job]
  );

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
    <Container className="py-8">
      <article className="mx-auto max-w-4xl">
        <Link className="mb-5 inline-block text-sm font-black text-muted hover:text-ink" href="/jobs/hiring">
          ← 구인글 목록
        </Link>

        {centerImageUrl ? (
          <img alt={`${domainJob.authorName} 대표 이미지`} className="mb-7 h-72 w-full rounded-lg bg-paper object-cover sm:h-96" src={centerImageUrl} />
        ) : null}

        <header className="border-b border-line pb-7">
          <div className="flex flex-wrap gap-2">
            <Badge tone={canApply ? "green" : "neutral"}>{formatJobStatus(job.status)}</Badge>
            <Badge>{formatJobRole(job.job_role)}</Badge>
            <Badge>{formatEmploymentType(job.employment_type)}</Badge>
          </div>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">{job.title}</h1>
              <p className="mt-3 text-sm font-bold text-muted">
                {domainJob.authorName} · {domainJob.area} · {domainJob.postedAt}
              </p>
            </div>
            {job.center_id ? (
              <Link
                className="shrink-0 text-sm font-black text-forest underline-offset-4 hover:underline"
                href={`/gyms/${job.center_id}`}
                rel="noreferrer"
                target="_blank"
              >
                센터 보기 ↗
              </Link>
            ) : null}
          </div>
        </header>

        <section className="border-b border-line py-8">
          <h2 className="text-xl font-black text-ink">공고 내용</h2>
          <p className="mt-4 whitespace-pre-line leading-8 text-muted">
            {job.description || job.support_detail || "상세 설명이 아직 등록되지 않았습니다."}
          </p>
        </section>

        {contentImages.length > 0 ? (
          <section className="border-b border-line py-8">
            <h2 className="text-xl font-black text-ink">현장 이미지</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {contentImages.map((image) => (
                <img alt="구인글 본문 이미지" className="h-64 w-full rounded-md bg-paper object-cover" key={image.id} src={image.url} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="border-b border-line py-8">
          <h2 className="text-xl font-black text-ink">근무 조건</h2>
          <WeekdaySummary value={job.work_days} />
          <InfoGrid
            variant="compact"
            items={[
              { label: "근무 시작", value: job.start_date_text || "협의" },
              { label: "근무 시간", value: job.work_hours || "협의" },
              { label: "휴게 시간", value: job.rest_time || "협의" },
              { label: "기본급", value: job.base_pay || "협의" },
              { label: "수업료/인센티브", value: job.incentive || "협의" },
              { label: "정산 방식", value: job.settlement_type || "협의" },
              { label: "4대보험", value: formatInsuranceType(job.insurance_type) },
              { label: "영업 압박", value: formatSalesPressure(job.sales_pressure) },
              { label: "회원 인계", value: formatMemberHandover(job.member_handover) },
              { label: "휴가/월차", value: job.vacation || "협의" },
              { label: "추가 지원", value: job.support_detail || "미입력" }
            ]}
          />
        </section>

        <section className="border-b border-line py-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black text-ink">지원</h2>
            <button
              className="rounded-md bg-ink px-7 py-3 text-sm font-black text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canApply || authStatus === "loading" || applicationState === "submitting" || applicationState === "submitted"}
              onClick={handleApply}
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

        {center ? (
          <section className="py-8">
            <h2 className="text-xl font-black text-ink">업장 정보</h2>
            <InfoGrid
              variant="spacious"
              items={[
                { label: "센터명", value: center.name },
                { label: "지역", value: getCenterArea(center) },
                { label: "주소", value: getCenterAddress(center) },
                { label: "업종", value: formatCenterIndustry(center.industry) }
              ]}
            />
          </section>
        ) : null}
      </article>
    </Container>
  );
}

function WeekdaySummary({ value }: { value: string | null }) {
  const selectedCodes = parseWorkDayCodes(value);

  return (
    <div className="mt-5">
      <p className="text-sm font-black text-ink">근무 요일</p>
      <div className="mt-2 grid grid-cols-7 gap-1.5 sm:max-w-lg">
        {weekdayOptions.map((day) => {
          const isSelected = selectedCodes.includes(day.value);

          return (
            <span
              className={`grid h-10 place-items-center border text-sm font-black ${
                isSelected ? "border-green bg-green text-white" : "border-line bg-paper text-muted"
              }`}
              key={day.value}
            >
              {day.label}
            </span>
          );
        })}
      </div>
      {selectedCodes.length === 0 ? <p className="mt-2 text-sm font-bold text-muted">{formatWorkDays(value)}</p> : null}
    </div>
  );
}

function InfoGrid({
  items,
  variant = "compact"
}: {
  items: Array<{ label: string; value: string }>;
  variant?: "compact" | "spacious";
}) {
  const gridClassName = variant === "compact" ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <dl className={`mt-5 grid gap-2 ${gridClassName}`}>
      {items.map((item) => (
        <div className="rounded-md border border-line bg-white px-3 py-2.5" key={item.label}>
          <dt className="text-xs font-black uppercase text-muted">{item.label}</dt>
          <dd className="mt-1 break-words text-sm font-bold leading-6 text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

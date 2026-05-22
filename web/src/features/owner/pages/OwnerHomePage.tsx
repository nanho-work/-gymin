"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { getMyBusinessProfile } from "@/shared/api/businessClient";
import { listMyCenters } from "@/shared/api/centersClient";
import { closeJobPost, listMyJobPosts } from "@/shared/api/jobsClient";
import { getMediaDisplayUrl, listMediaFiles } from "@/shared/api/mediaClient";
import type { BusinessProfileRead, CenterRead, OwnerJobPostRead } from "@/shared/api/serverTypes";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import {
  formatCenterIndustry,
  formatCenterStatus,
  formatCenterVerificationStatus,
  getCenterArea
} from "@/shared/utils/center";
import { formatJobStatus } from "@/shared/utils/job";
import { formatWorkDays } from "@/shared/utils/weekdays";

type OwnerHomeStatus = "loading" | "ready" | "error";

export function OwnerHomePage() {
  useDocumentTitle("센터관리");
  const [businessProfile, setBusinessProfile] = useState<BusinessProfileRead | null>(null);
  const [centers, setCenters] = useState<CenterRead[]>([]);
  const [jobs, setJobs] = useState<OwnerJobPostRead[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [status, setStatus] = useState<OwnerHomeStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [closingJobId, setClosingJobId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOwnerHome() {
      try {
        const [profile, centersPage, jobsPage] = await Promise.all([
          getMyBusinessProfile(),
          listMyCenters({ page: 1, size: 20 }),
          listMyJobPosts({ page: 1, size: 100 })
        ]);

        if (!isMounted) {
          return;
        }

        setBusinessProfile(profile);
        setCenters(centersPage.items);
        setJobs(jobsPage.items);
        setStatus("ready");

        const primaryCenter = centersPage.items[0];
        if (!primaryCenter) {
          setHeroImageUrl("");
          return;
        }

        try {
          const mediaFiles = await listMediaFiles({
            entity_type: "center",
            entity_id: primaryCenter.id,
            purpose: "representative"
          });
          if (isMounted) {
            setHeroImageUrl(getMediaDisplayUrl(mediaFiles[0]));
          }
        } catch {
          if (isMounted) {
            setHeroImageUrl("");
          }
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "사업장 정보를 불러오지 못했습니다.");
        setStatus("error");
      }
    }

    void loadOwnerHome();

    return () => {
      isMounted = false;
    };
  }, []);

  const centerById = useMemo(() => new Map(centers.map((center) => [center.id, center])), [centers]);
  const primaryCenter = centers[0] ?? null;
  const openJobCount = jobs.filter((job) => job.status === "open").length;
  const applicantCount = jobs.reduce((total, job) => total + job.applicant_count, 0);
  const pendingApplicantCount = jobs.reduce(
    (total, job) => total + Math.max(job.applicant_count - job.reviewed_applicant_count, 0),
    0
  );

  const handleCloseJob = async (jobId: string) => {
    setClosingJobId(jobId);
    setErrorMessage("");

    try {
      const closedJob = await closeJobPost(jobId);
      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                ...closedJob
              }
            : job
        )
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "구인글을 마감하지 못했습니다.");
    } finally {
      setClosingJobId("");
    }
  };

  if (status === "loading") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <Badge tone="green">센터관리</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">센터 정보를 불러오는 중입니다</h1>
        </section>
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <Badge tone="amber">확인 필요</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">센터관리를 불러오지 못했습니다</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">{errorMessage || "잠시 후 다시 시도해 주세요."}</p>
        </section>
      </Container>
    );
  }

  if (!primaryCenter) {
    return (
      <Container className="space-y-8 py-8">
        <section className="border-y border-line py-10">
          <Badge tone="amber">센터 등록 필요</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">등록된 센터가 없습니다</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            센터 정보를 먼저 저장하면 이 화면에서 센터 상태와 등록한 구인글, 지원자 현황을 한 번에 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryLink to="/gyms/new">센터 등록하기</PrimaryLink>
          </div>
        </section>
        <section className="border-t border-line pt-5">
          <h2 className="text-lg font-black text-ink">사업자 프로필</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            <SummaryRow label="담당자" value={businessProfile?.owner_name || "이름 미등록"} />
            <SummaryRow label="인증 상태" value={formatCenterVerificationStatus(businessProfile?.verification_status)} />
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container className="space-y-12 py-8">
      <section className="border-b border-line pb-10">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_260px]">
          {heroImageUrl ? (
            <img alt={`${primaryCenter.name} 대표 이미지`} className="h-52 w-full bg-paper object-cover lg:h-full" src={heroImageUrl} />
          ) : (
            <div className="grid h-52 w-full place-items-center border border-line bg-paper text-sm font-black text-muted lg:h-full">
              대표 사진 없음
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={primaryCenter.status === "active" ? "green" : "amber"}>{formatCenterStatus(primaryCenter.status)}</Badge>
              <Badge tone={primaryCenter.verification_status === "verified" ? "green" : "neutral"}>
                {formatCenterVerificationStatus(primaryCenter.verification_status)}
              </Badge>
              <span className="text-xs font-black text-muted">내 센터 정보</span>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{primaryCenter.name}</h1>
            <p className="mt-3 text-sm font-bold text-muted">
              {getCenterArea(primaryCenter)} · {formatCenterIndustry(primaryCenter.industry)}
            </p>
            <p className="mt-2 text-sm font-bold text-muted">{primaryCenter.detail_address}</p>
            <p className="mt-4 max-w-3xl leading-7 text-muted">
              {primaryCenter.introduction || "센터 소개를 저장하면 공개 센터 화면과 구인글에 함께 활용됩니다."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[formatCenterIndustry(primaryCenter.industry), primaryCenter.operation_type, primaryCenter.homepage_url ? "홈페이지 등록" : ""]
                .filter(Boolean)
                .map((tag) => (
                  <span className="border-b border-line pb-1 text-xs font-black text-muted" key={tag}>
                    {tag}
                  </span>
                ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryLink to="/gyms/new" variant="light">
                센터 정보 수정
              </PrimaryLink>
              <PrimaryLink to={`/gyms/${primaryCenter.id}`} variant="light">
                공개 화면 보기
              </PrimaryLink>
            </div>
          </div>
          <aside className="h-fit border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <h2 className="text-sm font-black text-ink">운영 요약</h2>
            <div className="mt-4 divide-y divide-line">
              <SummaryRow label="센터 상태" value={formatCenterStatus(primaryCenter.status)} />
              <SummaryRow label="진행 중인 구인글" value={`${openJobCount}건`} />
              <SummaryRow label="전체 지원자" value={`${applicantCount}명`} />
              <SummaryRow label="미확인 지원자" value={`${pendingApplicantCount}명`} />
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="green">구인글 관리</Badge>
            <h2 className="mt-3 text-xl font-black text-ink">등록한 구인글</h2>
          </div>
          <PrimaryLink to="/jobs/hiring/new">구인글 등록</PrimaryLink>
        </div>
        {errorMessage ? <p className="mt-4 text-sm font-bold text-amber-800">{errorMessage}</p> : null}
        <div className="mt-6 divide-y divide-line border-y border-line">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const center = centerById.get(job.center_id);
              return (
                <div className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto]" key={job.id}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        className="font-black text-ink transition hover:text-forest"
                        href={`/jobs/hiring/${job.id}`}
                      >
                        {job.title}
                      </Link>
                      <Badge tone={job.status === "open" ? "green" : "neutral"}>{formatJobStatus(job.status)}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-bold text-muted">
                      {center ? getCenterArea(center) : "센터 정보 없음"} · {job.employment_type} · {formatJobSchedule(job)}
                    </p>
                    <p className="mt-1 text-sm font-bold text-muted">{job.base_pay || job.incentive || "급여 협의"}</p>
                    <p className="mt-2 text-xs font-black text-muted">
                      지원자 {job.applicant_count}명 · 미확인 {Math.max(job.applicant_count - job.reviewed_applicant_count, 0)}명
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Link
                      className="border border-line bg-white px-3 py-2 text-xs font-black text-ink transition hover:border-green"
                      href={`/owner/jobs/${job.id}/applicants`}
                    >
                      지원자
                    </Link>
                    {job.status === "open" ? (
                      <button
                        className="border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-black text-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={closingJobId === job.id}
                        onClick={() => void handleCloseJob(job.id)}
                        type="button"
                      >
                        {closingJobId === job.id ? "마감 중" : "마감"}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10">
              <h3 className="text-xl font-black text-ink">등록한 구인글이 없습니다</h3>
              <p className="mt-3 text-sm font-bold text-muted">센터 등록 후 구인글을 올리면 지원자 현황이 이곳에 표시됩니다.</p>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm font-bold text-muted">{label}</span>
      <span className="text-sm font-black text-ink">{value}</span>
    </div>
  );
}

function formatJobSchedule(job: OwnerJobPostRead) {
  const workDays = formatWorkDays(job.work_days);
  return [workDays === "협의" ? "" : workDays, job.work_hours].filter(Boolean).join(" · ") || "협의";
}

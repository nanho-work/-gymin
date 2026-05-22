"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { listMyJobApplications } from "@/shared/api/applicationsClient";
import { toDomainJobPost } from "@/shared/api/jobsClient";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getGymById, jobs } from "@/shared/api/mockRepository";
import { getMyTrainerProfile, getTrainerReadiness, toDomainTrainer } from "@/shared/api/trainersClient";
import type { JobPost, Trainer } from "@/shared/types/domain";

const latestJobs = jobs.slice(0, 3);

export function TrainerHomePage() {
  useDocumentTitle("트레이너 홈");
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [myApplications, setMyApplications] = useState<Array<{ id: string; job: JobPost; status: string; appliedAt: string }>>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    getMyTrainerProfile()
      .then(async (profile) => {
        if (!isMounted) {
          return;
        }

        setTrainer(toDomainTrainer(profile));
        const applicationsPage = await listMyJobApplications({ page: 1, size: 20 });
        if (!isMounted) {
          return;
        }

        setMyApplications(
          applicationsPage.items.map((application) => ({
            id: application.id,
            job: toDomainJobPost(application.job_post),
            status: formatApplicationStatus(application.status),
            appliedAt: formatDate(application.applied_at)
          }))
        );
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }

        setTrainer(null);
        setErrorMessage(error.message);
        setStatus(error.message.includes("찾을 수 없습니다") ? "missing" : "error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <Badge tone="green">내 프로필</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">프로필을 불러오는 중입니다</h1>
        </section>
      </Container>
    );
  }

  if (status === "missing") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <Badge tone="amber">작성 필요</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">아직 등록된 트레이너 프로필이 없습니다</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            프로필을 저장하면 이 화면에서 대표 사진, 기본 정보, 지원 가능 조건을 바로 확인할 수 있습니다.
          </p>
          <div className="mt-6">
            <PrimaryLink to="/trainers/new">프로필 등록하기</PrimaryLink>
          </div>
        </section>
      </Container>
    );
  }

  if (status === "error" || !trainer) {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <Badge tone="amber">확인 필요</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">트레이너 홈을 불러오지 못했습니다</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">{errorMessage || "잠시 후 다시 시도해 주세요."}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryLink to="/login">로그인</PrimaryLink>
            <PrimaryLink to="/jobs/hiring" variant="light">
              구인글 보기
            </PrimaryLink>
          </div>
        </section>
      </Container>
    );
  }

  const readiness = getTrainerReadiness(trainer);

  return (
    <Container className="space-y-12 py-8">
      <section className="border-b border-line pb-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            {trainer.profileImage ? (
              <img alt={`${trainer.name} 프로필`} className="h-32 w-32 object-cover" src={trainer.profileImage} />
            ) : (
              <div className="grid h-32 w-32 shrink-0 place-items-center border border-line bg-paper text-sm font-black text-muted">
                사진 없음
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="green">내 프로필</Badge>
                <Badge tone={readiness.canApply ? "green" : "amber"}>{readiness.canApply ? "지원 가능" : "작성 중"}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{trainer.name}</h1>
              <p className="mt-2 text-sm font-bold text-muted">
                {trainer.age ? `${trainer.age}세` : "나이 미입력"} · {trainer.gender || "성별 미입력"} ·{" "}
                {trainer.residenceRegion || "거주지역 미입력"}
              </p>
              <p className="mt-4 max-w-3xl leading-7 text-muted">{trainer.headline}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <PrimaryLink to="/trainers/new" variant="light">
                  프로필 수정
                </PrimaryLink>
                <PrimaryLink to={`/trainers/${trainer.id}`} variant="light">
                  공개 화면 보기
                </PrimaryLink>
                <PrimaryLink to="/jobs/hiring">구인글 보기</PrimaryLink>
              </div>
            </div>
          </div>
          <aside className="h-fit border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <h2 className="text-sm font-black text-ink">지원 가능 조건</h2>
            <div className="mt-4 divide-y divide-line">
              {readiness.checks.map((check) => (
                <StatusRow key={check.label} label={check.label} ready={check.ready} />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="green">추천 구인글</Badge>
            <h2 className="mt-3 text-xl font-black text-ink">내 지역과 가까운 최신 공고</h2>
          </div>
          <PrimaryLink to="/jobs/hiring" variant="light">
            전체 보기
          </PrimaryLink>
        </div>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {latestJobs.map((job) => {
            const gym = getGymById(job.gymId);

            return (
              <Link
                className="grid gap-4 py-5 transition hover:bg-paper md:grid-cols-[112px_minmax(0,1fr)_auto]"
                key={job.id} href={gym ? `/gyms/${gym.id}` : "/jobs/hiring"}
              >
                {gym ? (
                  <img alt={`${gym.name} 대표 사진`} className="h-20 w-full object-cover md:w-28" src={gym.heroImage} />
                ) : null}
                <div>
                  <p className="font-black text-ink">{job.title}</p>
                  <p className="mt-2 text-sm font-bold text-muted">
                    {job.authorName} · {job.area}
                  </p>
                  <p className="mt-1 text-sm font-bold text-muted">
                    {job.employmentType} · {job.schedule}
                  </p>
                </div>
                <span className="h-fit text-xs font-black text-muted">{job.status}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="green">지원 현황</Badge>
            <h2 className="mt-3 text-xl font-black text-ink">내가 지원한 구인글</h2>
          </div>
          <span className="text-sm font-black text-muted">{myApplications.length}건</span>
        </div>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {myApplications.length > 0 ? (
            myApplications.map((application) => (
              <div className="py-5" key={application.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-ink">{application.job.title}</p>
                  <span className="text-xs font-black text-muted">{application.status}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-muted">
                  {application.job.authorName} · 지원일 {application.appliedAt}
                </p>
              </div>
            ))
          ) : (
            <p className="py-8 text-sm font-bold leading-6 text-muted">아직 지원한 구인글이 없습니다.</p>
          )}
        </div>
      </section>
    </Container>
  );
}

function formatApplicationStatus(status: string) {
  const statusLabel: Record<string, string> = {
    submitted: "지원 완료",
    reviewing: "검토 중",
    accepted: "합격",
    rejected: "불합격",
    cancelled: "취소"
  };

  return statusLabel[status] ?? status;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function StatusRow({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm font-bold text-muted">{label}</span>
      <span className={`text-xs font-black ${ready ? "text-forest" : "text-amber-800"}`}>
        {ready ? "완료" : "필요"}
      </span>
    </div>
  );
}

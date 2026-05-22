"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { getCenter } from "@/shared/api/centersClient";
import { listJobPosts, toDomainJobPost } from "@/shared/api/jobsClient";
import { getMediaDisplayUrl } from "@/shared/api/mediaClient";
import type { CenterRead } from "@/shared/api/serverTypes";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { JobPost } from "@/shared/types/domain";
import {
  formatCenterIndustry,
  formatCenterVerificationStatus,
  getCenterAddress
} from "@/shared/utils/center";

export function GymDetailPage() {
  const { gymId } = useParams<{ gymId: string }>();
  const [center, setCenter] = useState<CenterRead | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [hiringJobs, setHiringJobs] = useState<JobPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useDocumentTitle(center ? `${center.name} 상세보기` : "헬스장 상세보기");

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCenter(gymId),
      listJobPosts({ page: 1, size: 50 })
    ])
      .then(([nextCenter, jobsPage]) => {
        if (!isMounted) {
          return;
        }

        const representativeImage =
          nextCenter.media.find((item) => item.purpose === "representative") ??
          nextCenter.media.find((item) => item.purpose === "gallery");

        setCenter(nextCenter);
        setHeroImageUrl(getMediaDisplayUrl(representativeImage));
        setHiringJobs(
          jobsPage.items
            .filter((job) => job.center_id === nextCenter.id)
            .map(toDomainJobPost)
        );
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
  }, [gymId]);

  if (status === "loading") {
    return (
      <Container className="py-16">
        <Badge tone="green">센터 상세</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">센터 정보를 불러오는 중입니다</h1>
      </Container>
    );
  }

  if (status === "missing" || !center) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-black text-ink">헬스장 정보를 찾을 수 없습니다</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{errorMessage}</p>
        <Link className="mt-5 inline-block rounded-md bg-ink px-4 py-3 text-sm font-black text-white" href="/jobs/hiring">
          구인글로 돌아가기
        </Link>
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container className="py-16">
        <Badge tone="amber">확인 필요</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">센터 정보를 불러오지 못했습니다</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{errorMessage || "잠시 후 다시 시도해 주세요."}</p>
      </Container>
    );
  }

  const address = getCenterAddress(center);
  const industryLabel = formatCenterIndustry(center.industry);
  const centerGalleryImages = center.media
    .filter((item) => item.purpose === "gallery")
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((item) => ({ id: item.id, url: getMediaDisplayUrl(item) }))
    .filter((item) => item.url);

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {heroImageUrl ? (
            <img alt={`${center.name} 시설`} className="h-80 w-full rounded-lg bg-paper object-cover shadow-soft" src={heroImageUrl} />
          ) : (
            <div className="grid h-80 place-items-center rounded-lg border border-line bg-paper text-sm font-black text-muted shadow-soft">
              대표 사진 없음
            </div>
          )}
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={center.verification_status === "verified" ? "green" : "amber"}>
                {formatCenterVerificationStatus(center.verification_status)}
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink sm:text-5xl">{center.name}</h1>
            <div className="mt-4 space-y-2 text-base font-bold leading-7 text-muted">
              <p>{address}</p>
              <p>{[industryLabel, center.operation_type].filter(Boolean).join(" · ")}</p>
            </div>
            <p className="mt-5 leading-8 text-muted">{center.introduction || "센터 소개가 아직 등록되지 않았습니다."}</p>
          </div>
        </Container>
      </section>

      <Container className="detail-grid grid gap-6 py-8">
        <div className="space-y-6">
          {centerGalleryImages.length > 0 ? (
            <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-ink">센터 사진</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {centerGalleryImages.map((image) => (
                  <img
                    alt={`${center.name} 등록 사진`}
                    className="h-56 w-full rounded-md bg-paper object-contain"
                    key={image.id}
                    src={image.url}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-ink">이 업장의 구인 연결</h2>
              <span className="text-xs font-black text-muted">{hiringJobs.length}건</span>
            </div>
            <div className="mt-4 space-y-3">
              {hiringJobs.length > 0 ? (
                hiringJobs.map((job) => (
                  <Link
                    className="block rounded-md border border-line bg-paper p-4 transition hover:border-green hover:bg-white"
                    href={`/jobs/hiring/${job.id}`}
                    key={job.id}
                  >
                    <p className="font-black text-ink">{job.title}</p>
                    <p className="mt-2 text-sm font-bold text-muted">
                      {job.employmentType} · {job.schedule} · {job.status}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="rounded-md border border-line bg-paper p-4 text-sm font-bold text-muted">
                  현재 이 센터에 연결된 구인글이 없습니다.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">외부 채널</h2>
            <div className="mt-4 space-y-2">
              <ExternalLink href={center.homepage_url} label="홈페이지" />
              <ExternalLink href={center.instagram_url} label="인스타그램" />
              <ExternalLink href={center.youtube_url} label="유튜브" />
            </div>
          </section>
        </aside>
      </Container>
    </>
  );
}

function ExternalLink({ href, label }: { href: string | null; label: string }) {
  if (!href) {
    return <p className="text-sm font-bold text-muted">{label} 미등록</p>;
  }

  return (
    <a className="block text-sm font-black text-ink underline" href={href} rel="noreferrer" target="_blank">
      {label}
    </a>
  );
}

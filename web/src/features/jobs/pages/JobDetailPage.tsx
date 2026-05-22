"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { JobApplySection } from "@/features/jobs/components/JobApplySection";
import { JobCenterInfo } from "@/features/jobs/components/JobCenterInfo";
import { JobConditionGrid } from "@/features/jobs/components/JobConditionGrid";
import { JobContentImages } from "@/features/jobs/components/JobContentImages";
import { JobDescriptionSection } from "@/features/jobs/components/JobDescriptionSection";
import { JobDetailHeader } from "@/features/jobs/components/JobDetailHeader";
import { JobDetailHero } from "@/features/jobs/components/JobDetailHero";
import { useJobApplication } from "@/features/jobs/hooks/useJobApplication";
import { useJobDetail } from "@/features/jobs/hooks/useJobDetail";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const {
    canApply,
    center,
    centerImageUrl,
    contentImages,
    domainJob,
    errorMessage,
    job,
    status
  } = useJobDetail(jobId);
  const {
    applicationMessage,
    applicationState,
    canShowApply,
    handleApply,
    isApplyDisabled
  } = useJobApplication({
    canApply,
    jobId: job?.id ?? null
  });

  useDocumentTitle(job ? `${job.title} 구인글` : "구인글 상세");

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
        <JobDetailHero imageAlt={`${domainJob.authorName} 대표 이미지`} imageUrl={centerImageUrl} />
        <JobDetailHeader canApply={canApply} domainJob={domainJob} job={job} />
        <JobDescriptionSection description={job.description} supportDetail={job.support_detail} />
        <JobContentImages images={contentImages} />
        <JobConditionGrid job={job} />
        {canShowApply ? (
          <JobApplySection
            applicationMessage={applicationMessage}
            applicationState={applicationState}
            disabled={isApplyDisabled}
            onApply={handleApply}
          />
        ) : null}
        <JobCenterInfo center={center} />
      </article>
    </Container>
  );
}

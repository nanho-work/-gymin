"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { listJobApplications, markJobApplicationViewed } from "@/shared/api/applicationsClient";
import { getJobPost, toDomainJobPost } from "@/shared/api/jobsClient";
import type { JobApplicationWithTrainerRead } from "@/shared/api/serverTypes";
import { toDomainTrainer } from "@/shared/api/trainersClient";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { JobPost, Trainer } from "@/shared/types/domain";

type ApplicantItem = {
  application: JobApplicationWithTrainerRead;
  appliedAt: string;
  reviewedAt: string;
  trainer: Trainer;
};

export function OwnerJobApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobPost | null>(null);
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [visibleContactIds, setVisibleContactIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useDocumentTitle(job ? `${job.title} 지원자` : "지원자 목록");

  useEffect(() => {
    let isMounted = true;

    Promise.all([getJobPost(jobId), listJobApplications(jobId, { page: 1, size: 50 })])
      .then(([jobPost, applicationsPage]) => {
        if (!isMounted) {
          return;
        }

        const nextApplicants = applicationsPage.items.map((application) => ({
          application,
          appliedAt: formatDate(application.applied_at),
          reviewedAt: application.reviewed_at ? formatDateTime(application.reviewed_at) : "",
          trainer: toDomainTrainer(application.trainer_profile)
        }));

        setJob(toDomainJobPost(jobPost));
        setApplicants(nextApplicants);
        setSelectedApplicantId(nextApplicants[0]?.application.id ?? null);
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

  const selectedApplicant = useMemo(
    () => applicants.find((item) => item.application.id === selectedApplicantId) ?? applicants[0],
    [applicants, selectedApplicantId]
  );

  const markApplicantViewed = async (applicationId: string) => {
    const updatedApplication = await markJobApplicationViewed(applicationId);
    setApplicants((current) =>
      current.map((item) =>
        item.application.id === applicationId
          ? {
              ...item,
              application: {
                ...item.application,
                reviewed_at: updatedApplication.reviewed_at
              },
              reviewedAt: updatedApplication.reviewed_at ? formatDateTime(updatedApplication.reviewed_at) : item.reviewedAt
            }
          : item
      )
    );
  };

  const revealContact = async (applicationId: string) => {
    setVisibleContactIds((current) => new Set(current).add(applicationId));
    try {
      await markApplicantViewed(applicationId);
    } catch {
      // 연락처 확인 자체는 막지 않고, 확인 신호 저장 실패만 조용히 넘긴다.
    }
  };

  const markPublicProfileClick = (applicationId: string) => {
    void markApplicantViewed(applicationId);
  };

  if (status === "loading") {
    return (
      <Container className="py-16">
        <Badge tone="green">지원자 목록</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">지원자 정보를 불러오는 중입니다</h1>
      </Container>
    );
  }

  if (status === "missing" || !job) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-black text-ink">구인글을 찾을 수 없습니다</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{errorMessage}</p>
        <Link className="mt-5 inline-block bg-ink px-4 py-3 text-sm font-black text-white" href="/owner">
          사장님 홈으로
        </Link>
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container className="py-16">
        <Badge tone="amber">확인 필요</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">지원자 목록을 불러오지 못했습니다</h1>
        <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{errorMessage}</p>
        <Link className="mt-5 inline-block bg-ink px-4 py-3 text-sm font-black text-white" href="/owner">
          사장님 홈으로
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <section className="border-y border-line">
        <header className="border-b border-line py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge tone="green">지원자 목록</Badge>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-ink sm:text-3xl">{job.title}</h1>
              <p className="mt-3 text-sm font-bold text-muted">
                {job.area} · {job.employmentType} · {job.schedule}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="border border-line bg-white px-4 py-2.5 text-sm font-black text-ink" href="/owner">
                구인글 관리
              </Link>
              <Link className="border border-ink bg-ink px-4 py-2.5 text-sm font-black text-white" href="/jobs/hiring/new">
                공고 수정
              </Link>
            </div>
          </div>
        </header>

        <div className="grid min-h-[560px] lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-b border-line lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3 border-b border-line py-4 pr-4">
              <h2 className="text-sm font-black text-ink">지원자</h2>
              <span className="text-xs font-black text-muted">{applicants.length}명</span>
            </div>
            <div className="flex gap-2 overflow-x-auto py-3 pr-4 lg:block lg:overflow-visible">
              {applicants.map((item) => (
                <button
                  className={`min-w-40 border-b px-1 py-3 text-left transition lg:w-full ${
                    item.application.id === selectedApplicant?.application.id ? "border-green" : "border-line hover:border-ink"
                  }`}
                  key={item.application.id}
                  onClick={() => setSelectedApplicantId(item.application.id)}
                  type="button"
                >
                  <span className="block text-sm font-black text-ink">{item.trainer.name}</span>
                  <span className="mt-1 block text-xs font-bold text-muted">
                    {item.reviewedAt ? "확인함" : "새 지원"}
                  </span>
                  <span className="mt-1 block text-xs font-bold text-muted">{item.appliedAt}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="py-6 lg:pl-6">
            {selectedApplicant ? (
              <ApplicantDetail
                isContactVisible={visibleContactIds.has(selectedApplicant.application.id)}
                item={selectedApplicant}
                onPublicProfileClick={markPublicProfileClick}
                onRevealContact={revealContact}
              />
            ) : (
              <div className="grid min-h-80 place-items-center border border-line p-8 text-center">
                <div>
                  <h2 className="text-xl font-black text-ink">아직 지원자가 없습니다</h2>
                  <p className="mt-3 text-sm font-bold text-muted">지원자가 생기면 이 영역에서 프로필을 확인합니다.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>
    </Container>
  );
}

function ApplicantDetail({
  isContactVisible,
  item,
  onPublicProfileClick,
  onRevealContact
}: {
  isContactVisible: boolean;
  item: ApplicantItem;
  onPublicProfileClick: (applicationId: string) => void;
  onRevealContact: (applicationId: string) => void;
}) {
  const { application, appliedAt, reviewedAt, trainer } = item;
  const profileImages = trainer.profileImage ? [{ label: "프로필 사진", url: trainer.profileImage }] : [];
  const mediaImages = [...profileImages, ...trainer.mediaImages];

  return (
    <div className="space-y-5">
      <section className="border-b border-line pb-6">
        <div className="grid gap-5 md:grid-cols-[160px_minmax(0,1fr)]">
          {trainer.profileImage ? (
            <img alt={`${trainer.name} 프로필`} className="h-48 w-full object-cover" src={trainer.profileImage} />
          ) : (
            <div className="grid h-48 place-items-center border border-line bg-paper text-sm font-black text-muted">
              사진 없음
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-ink">{trainer.name}</h2>
              <Badge tone={trainer.verifiedProfile ? "green" : "amber"}>
                {trainer.verifiedProfile ? "지원 가능 프로필" : "작성 중 프로필"}
              </Badge>
              <span className="text-xs font-black text-muted">{reviewedAt ? `확인 ${reviewedAt}` : "새 지원"}</span>
            </div>
            <p className="mt-3 text-lg font-black text-ink">{trainer.headline}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ProfileField label="나이" value={trainer.age ? `${trainer.age}세` : "미입력"} />
              <ProfileField label="출생년도" value={trainer.birthYear ? `${trainer.birthYear}년생` : "미입력"} />
              <ProfileField label="성별" value={trainer.gender || "미입력"} />
              <ProfileField label="연락처" value={isContactVisible ? trainer.contact || "미입력" : "확인 버튼을 눌러 표시"} />
              <ProfileField label="거주지역" value={trainer.residenceRegion || "미입력"} />
              <ProfileField label="희망 활동 지역" value={trainer.area} />
              <ProfileField label="경력" value={`${trainer.experienceYears}년차`} />
              <ProfileField label="근무 형태" value={trainer.workType} />
              <ProfileField label="가능 시간" value={trainer.availability} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="border border-ink bg-ink px-3 py-2 text-xs font-black text-white"
                onClick={() => onRevealContact(application.id)}
                type="button"
              >
                전화번호 확인
              </button>
              <Link
                className="border border-line bg-white px-3 py-2 text-xs font-black text-ink"
                href={`/trainers/${trainer.id}`}
                onClick={() => onPublicProfileClick(application.id)}
              >
                공개 프로필 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BadgePanel title="전문 분야" values={trainer.specialties} emptyLabel="등록된 전문 분야가 없습니다." />

      <section className="border-b border-line pb-6">
        <h3 className="text-lg font-black text-ink">경력 정보</h3>
        <div className="mt-4 border-y border-line">
          <div className="hidden grid-cols-[1fr_160px_1.6fr] border-b border-line py-3 text-xs font-black text-muted md:grid">
            <span>근무처</span>
            <span>근무 기간</span>
            <span>담당 업무</span>
          </div>
          <div className="divide-y divide-line bg-white">
            {trainer.workHistory.length > 0 ? (
              trainer.workHistory.map((history) => (
                <div
                  className="grid gap-2 py-4 text-sm font-bold text-muted md:grid-cols-[1fr_160px_1.6fr]"
                  key={`${history.gymName}-${history.period}`}
                >
                  <span className="font-black text-ink">{history.gymName}</span>
                  <span>{history.period}</span>
                  <span className="leading-6">{history.role}</span>
                </div>
              ))
            ) : (
              <p className="py-5 text-sm font-bold text-muted">등록된 경력 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      <TextListPanel title="자격증 또는 수상경력" values={trainer.certifications} emptyLabel="등록된 자격/수상 정보가 없습니다." />

      <section className="border-b border-line pb-6">
        <h3 className="text-lg font-black text-ink">포트폴리오 링크</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {trainer.portfolioLinks.length > 0 ? (
            trainer.portfolioLinks.map((link) => (
              <div className="border-b border-line pb-3" key={link.url}>
                <p className="text-sm font-black text-ink">{link.label}</p>
                <p className="mt-2 break-all text-sm font-bold text-muted">{link.url}</p>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-muted">등록된 포트폴리오 링크가 없습니다.</p>
          )}
        </div>
      </section>

      <MediaPanel images={mediaImages} title="프로필/운동 사진" values={mediaImages.map((image) => image.label)} />

      <section className="border-b border-line pb-6">
        <h3 className="text-lg font-black text-ink">자기소개</h3>
        <p className="mt-4 text-sm font-bold leading-7 text-muted">{trainer.summary}</p>
      </section>

      <section className="border-b border-line pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-black text-ink">지원 시 남긴 내용</h3>
          <span className="text-xs font-bold text-muted">지원일 {appliedAt}</span>
        </div>
        <p className="mt-4 border-l-2 border-line pl-4 text-sm font-bold leading-6 text-muted">
          {application.message || "지원 메시지가 없습니다."}
        </p>
      </section>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line pb-3">
      <p className="text-xs font-black text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function BadgePanel({ title, values, emptyLabel }: { title: string; values: string[]; emptyLabel: string }) {
  return (
    <section className="border-b border-line pb-6">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {values.length > 0 ? values.map((value) => <Badge key={value}>{value}</Badge>) : <p className="text-sm font-bold text-muted">{emptyLabel}</p>}
      </div>
    </section>
  );
}

function TextListPanel({ title, values, emptyLabel }: { title: string; values: string[]; emptyLabel: string }) {
  return (
    <section className="border-b border-line pb-6">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <span className="border-b border-line pb-1 text-sm font-bold text-muted" key={value}>
              {value}
            </span>
          ))
        ) : (
          <p className="text-sm font-bold text-muted">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}

function MediaPanel({
  title,
  values,
  images
}: {
  title: string;
  values: string[];
  images: Array<{ label: string; url: string }>;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const validImages = images.filter((image) => image.url);
  const selectedImage = validImages[selectedIndex] ?? validImages[0];

  return (
    <section className="border-b border-line pb-6">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      {selectedImage ? (
        <>
          <figure className="mt-4 overflow-hidden border border-line bg-white">
            <img alt={selectedImage.label} className="h-[520px] w-full object-contain" src={selectedImage.url} />
            <figcaption className="border-t border-line px-4 py-3 text-sm font-bold text-muted">{selectedImage.label}</figcaption>
          </figure>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {validImages.map((image, index) => (
              <button
                className={`h-20 w-28 shrink-0 overflow-hidden border bg-white ${
                  index === selectedIndex ? "border-green" : "border-line"
                }`}
                key={image.url}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <img alt={image.label} className="h-full w-full object-cover" src={image.url} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm font-bold text-muted">등록된 이미지가 없습니다.</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {values.map((value) => (
          <span className="border-b border-line pb-1 text-sm font-bold text-muted" key={value}>
            {value}
          </span>
        ))}
      </div>
    </section>
  );
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

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

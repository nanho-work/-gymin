"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getApplicationsByJobId, getJobById, getTrainerById } from "@/shared/api/mockRepository";
import { useState } from "react";

export function OwnerJobApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const job = getJobById(jobId);
  const applications = getApplicationsByJobId(jobId);

  useDocumentTitle(job ? `${job.title} 지원자` : "지원자 목록");

  if (!job) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-black text-ink">구인글을 찾을 수 없습니다</h1>
        <Link className="mt-5 inline-block bg-ink px-4 py-3 text-sm font-black text-white" href="/owner">
          사장님 홈으로
        </Link>
      </Container>
    );
  }

  const applicantItems = applications
    .map((application) => ({
      application,
      trainer: getTrainerById(application.trainerId)
    }))
    .filter((item) => item.trainer);
  const selectedApplicant = applicantItems[0];

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
                공고 수정 목업
              </Link>
            </div>
          </div>
        </header>

        <div className="grid min-h-[560px] lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="border-b border-line lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3 border-b border-line py-4 pr-4">
              <h2 className="text-sm font-black text-ink">지원자</h2>
              <span className="text-xs font-black text-muted">
                {applicantItems.length}명
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto py-3 pr-4 lg:block lg:overflow-visible">
              {applicantItems.map(({ application, trainer }, index) => (
                <button
                  className={`min-w-36 border-b px-1 py-3 text-left transition lg:w-full ${
                    index === 0 ? "border-green" : "border-line hover:border-ink"
                  }`}
                  key={application.id}
                  type="button"
                >
                  <span className="block text-sm font-black text-ink">{trainer?.name}</span>
                  <span className="mt-1 block text-xs font-bold text-muted">{application.status}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="py-6 lg:pl-6">
            {selectedApplicant?.trainer ? (
              <ApplicantDetail
                appliedAt={selectedApplicant.application.appliedAt}
                message={selectedApplicant.application.message}
                status={selectedApplicant.application.status}
                trainer={selectedApplicant.trainer}
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
  trainer,
  status,
  appliedAt,
  message
}: {
  trainer: NonNullable<ReturnType<typeof getTrainerById>>;
  status: string;
  appliedAt: string;
  message: string;
}) {
  return (
    <div className="space-y-5">
      <section className="border-b border-line pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black text-ink">{trainer.name}</h2>
            <Badge tone={trainer.verifiedProfile ? "green" : "amber"}>
              {trainer.verifiedProfile ? "프로필 확인" : "확인 대기"}
            </Badge>
            <span className="text-xs font-black text-muted">{status}</span>
          </div>
          <p className="mt-3 text-lg font-black text-ink">{trainer.headline}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <ProfileField label="나이" value={`${trainer.age}세`} />
            <ProfileField label="생년월일" value={trainer.birthDate} />
            <ProfileField label="성별" value={trainer.gender} />
            <ProfileField label="연락처" value={trainer.contact} />
            <ProfileField label="거주지역" value={trainer.residenceRegion} />
            <ProfileField label="희망 활동 지역" value={trainer.area} />
            <ProfileField label="경력" value={`${trainer.experienceYears}년차`} />
            <ProfileField label="근무 형태" value={trainer.workType} />
            <ProfileField label="가능 시간" value={trainer.availability} />
          </div>
        </div>
      </section>

      <section className="border-b border-line pb-6">
        <h3 className="text-lg font-black text-ink">전문 분야</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {trainer.specialties.map((specialty) => (
            <Badge key={specialty}>{specialty}</Badge>
          ))}
        </div>
      </section>

      <section className="border-b border-line pb-6">
        <h3 className="text-lg font-black text-ink">경력 정보</h3>
        <div className="mt-4 border-y border-line">
          <div className="hidden grid-cols-[1fr_160px_1.6fr] border-b border-line py-3 text-xs font-black text-muted md:grid">
            <span>근무처</span>
            <span>근무 기간</span>
            <span>담당 업무</span>
          </div>
          <div className="divide-y divide-line bg-white">
            {trainer.workHistory.map((history) => (
              <div
                className="grid gap-2 py-4 text-sm font-bold text-muted md:grid-cols-[1fr_160px_1.6fr]"
                key={`${history.gymName}-${history.period}`}
              >
                <span className="font-black text-ink">{history.gymName}</span>
                <span>{history.period}</span>
                <span className="leading-6">{history.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InfoPanel title="자격증 또는 수상경력" values={trainer.certifications} />

      <section className="border-b border-line pb-6">
        <h3 className="text-lg font-black text-ink">포트폴리오 링크</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {trainer.portfolioLinks.map((link) => (
            <div className="border-b border-line pb-3" key={link.url}>
              <p className="text-sm font-black text-ink">{link.label}</p>
              <p className="mt-2 text-sm font-bold text-muted">{link.url}</p>
            </div>
          ))}
        </div>
      </section>

      <MediaPanel
        images={[{ label: "프로필 사진", url: trainer.profileImage }, ...trainer.mediaImages]}
        title="프로필/운동 사진"
        values={["프로필 사진", ...trainer.mediaItems]}
      />

      <section className="border-b border-line pb-6">
        <h3 className="text-lg font-black text-ink">자기소개</h3>
        <p className="mt-4 text-sm font-bold leading-7 text-muted">{trainer.summary}</p>
      </section>

      <section className="border-b border-line pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-black text-ink">지원 시 남긴 내용</h3>
          <span className="text-xs font-bold text-muted">지원일 {appliedAt}</span>
        </div>
        <p className="mt-4 border-l-2 border-line pl-4 text-sm font-bold leading-6 text-muted">{message}</p>
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

function InfoPanel({ title, values }: { title: string; values: string[] }) {
  return (
    <section className="border-b border-line pb-6">
      <h3 className="text-lg font-black text-ink">{title}</h3>
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
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <section className="border-b border-line pb-6">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      {selectedImage ? (
        <figure className="mt-4 overflow-hidden border border-line bg-white">
          <img alt={selectedImage.label} className="h-[520px] w-full object-contain" src={selectedImage.url} />
          <figcaption className="border-t border-line px-4 py-3 text-sm font-bold text-muted">{selectedImage.label}</figcaption>
        </figure>
      ) : null}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => (
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

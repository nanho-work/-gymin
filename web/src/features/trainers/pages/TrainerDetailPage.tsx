"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getTrainerProfile, getTrainerReadiness, toDomainTrainer } from "@/shared/api/trainersClient";
import type { Trainer } from "@/shared/types/domain";

export function TrainerDetailPage() {
  const { trainerId } = useParams<{ trainerId: string }>();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    getTrainerProfile(trainerId)
      .then((profile) => {
        if (!isMounted) {
          return;
        }

        setTrainer(toDomainTrainer(profile));
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
  }, [trainerId]);

  useDocumentTitle(trainer ? `${trainer.name} 상세보기` : "트레이너 상세보기");

  if (status === "loading") {
    return (
      <Container className="py-16">
        <Badge tone="green">트레이너 프로필</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">트레이너 정보를 불러오는 중입니다</h1>
      </Container>
    );
  }

  if (status === "missing") {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-black text-ink">트레이너 정보를 찾을 수 없습니다</h1>
        <Link className="mt-5 inline-block rounded-md bg-ink px-4 py-3 text-sm font-black text-white" href="/jobs/hiring">
          구인글로 돌아가기
        </Link>
      </Container>
    );
  }

  if (status === "error" || !trainer) {
    return (
      <Container className="py-16">
        <Badge tone="amber">확인 필요</Badge>
        <h1 className="mt-4 text-3xl font-black text-ink">트레이너 정보를 불러오지 못했습니다</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted">{errorMessage || "잠시 후 다시 시도해 주세요."}</p>
        <Link className="mt-5 inline-block rounded-md bg-ink px-4 py-3 text-sm font-black text-white" href="/jobs/hiring">
          구인글로 돌아가기
        </Link>
      </Container>
    );
  }

  const readiness = getTrainerReadiness(trainer);
  const profileImages = trainer.profileImage ? [{ label: "프로필 사진", url: trainer.profileImage }] : [];

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="max-w-4xl">
              <Badge tone={readiness.canApply ? "green" : "amber"}>
                {readiness.canApply ? "지원 가능 프로필" : "작성 중 프로필"}
              </Badge>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-ink sm:text-5xl">{trainer.name}</h1>
              <p className="mt-3 text-lg font-bold text-muted">{trainer.headline}</p>
              <p className="mt-5 max-w-3xl leading-8 text-muted">{trainer.summary}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <PrimaryLink to="/jobs/hiring">구인글 보기</PrimaryLink>
                <PrimaryLink to="/trainers/new" variant="light">
                  트레이너 등록
                </PrimaryLink>
              </div>
            </div>
            {trainer.profileImage ? (
              <img alt={`${trainer.name} 프로필`} className="h-64 w-full border border-line object-cover" src={trainer.profileImage} />
            ) : (
              <div className="grid h-64 place-items-center border border-line bg-paper text-sm font-black text-muted">대표 사진 없음</div>
            )}
          </div>
        </Container>
      </section>

      <Container className="detail-grid grid gap-6 py-8">
        <div className="space-y-6">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">프로필 정보</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBlock title="나이/생년월일" value={`${trainer.age}세 · ${trainer.birthDate}`} />
              <InfoBlock title="성별" value={trainer.gender} />
              <InfoBlock title="연락처" value={trainer.contact} />
              <InfoBlock title="거주지역" value={trainer.residenceRegion} />
              <InfoBlock title="희망 활동 지역" value={trainer.area} />
              <InfoBlock title="경력" value={`${trainer.experienceYears}년차`} />
              <InfoBlock title="근무 형태" value={trainer.workType} />
              <InfoBlock title="가능 시간" value={trainer.availability} />
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">경력 정보</h2>
            <div className="mt-4 overflow-hidden rounded-md border border-line">
              <div className="hidden grid-cols-[1fr_150px_1.5fr] bg-paper px-4 py-3 text-xs font-black text-muted md:grid">
                <span>근무처</span>
                <span>근무 기간</span>
                <span>담당 업무</span>
              </div>
              <div className="divide-y divide-line bg-white">
                {trainer.workHistory.length > 0 ? (
                  trainer.workHistory.map((history) => (
                    <div
                      className="grid gap-2 px-4 py-4 text-sm font-bold text-muted md:grid-cols-[1fr_150px_1.5fr]"
                      key={`${history.gymName}-${history.period}`}
                    >
                      <span className="font-black text-ink">{history.gymName}</span>
                      <span>{history.period}</span>
                      <span className="leading-6">{history.role}</span>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-5 text-sm font-bold text-muted">등록된 경력 정보가 없습니다.</p>
                )}
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">자기소개</h2>
            <p className="mt-4 text-sm font-bold leading-7 text-muted">{trainer.summary}</p>
          </section>
        </div>
        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">전문 분야</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {trainer.specialties.length > 0 ? (
                trainer.specialties.map((specialty) => <Badge key={specialty}>{specialty}</Badge>)
              ) : (
                <p className="text-sm font-bold text-muted">등록된 전문 분야가 없습니다.</p>
              )}
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">자격증 또는 수상경력</h2>
            <div className="mt-4 space-y-3">
              {trainer.certifications.length > 0 ? (
                trainer.certifications.map((certification) => (
                  <p className="rounded-md bg-paper p-3 text-sm font-bold text-muted" key={certification}>
                    {certification}
                  </p>
                ))
              ) : (
                <p className="text-sm font-bold text-muted">등록된 자격/수상 정보가 없습니다.</p>
              )}
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">포트폴리오 링크</h2>
            <div className="mt-4 space-y-3">
              {trainer.portfolioLinks.length > 0 ? (
                trainer.portfolioLinks.map((link) => (
                  <p className="rounded-md bg-paper p-3 text-sm font-bold text-muted" key={link.url}>
                    <span className="block font-black text-ink">{link.label}</span>
                    <span className="mt-1 block">{link.url}</span>
                  </p>
                ))
              ) : (
                <p className="text-sm font-bold text-muted">등록된 포트폴리오 링크가 없습니다.</p>
              )}
            </div>
          </section>
          <TrainerMediaGallery
            images={[...profileImages, ...trainer.mediaImages]}
            values={[...profileImages.map((image) => image.label), ...trainer.mediaItems]}
          />
        </aside>
      </Container>
    </>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-4">
      <p className="text-xs font-black uppercase text-muted">{title}</p>
      <p className="mt-2 font-bold leading-6 text-ink">{value}</p>
    </div>
  );
}

function TrainerMediaGallery({
  images,
  values
}: {
  images: Array<{ label: string; url: string }>;
  values: string[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-ink">운동 사진</h2>
      {selectedImage ? (
        <figure className="mt-4 overflow-hidden rounded-md border border-line bg-paper">
          <img alt={selectedImage.label} className="h-96 w-full object-contain" src={selectedImage.url} />
          <figcaption className="border-t border-line px-3 py-2 text-sm font-bold text-muted">
            {selectedImage.label}
          </figcaption>
        </figure>
      ) : null}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border bg-paper ${
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
      <div className="mt-4 space-y-3">
        {values.map((item) => (
          <p className="rounded-md bg-paper p-3 text-sm font-bold text-muted" key={item}>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

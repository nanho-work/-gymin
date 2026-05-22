"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { JobPost } from "@/shared/types/domain";
import { listJobPosts, toDomainJobPost } from "@/shared/api/jobsClient";
import { getPlatformStats } from "@/shared/api/platformClient";
import type { PlatformStats } from "@/shared/api/types";

const notices = [
  "허위 구인글, 과장 급여, 타인 비방 글은 운영자가 숨김 처리할 수 있습니다.",
  "연락처 공개 전에는 개인정보와 계약 조건을 꼭 직접 확인해 주세요.",
  "트레이너는 내 프로필을 등록해두면 구인글에 지원할 때 그대로 사용할 수 있습니다."
];

export function HomePage() {
  useDocumentTitle("피트니스 무료 구인 게시판");
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [hiringPosts, setHiringPosts] = useState<JobPost[]>([]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getPlatformStats(), listJobPosts({ page: 1, size: 8 })])
      .then(([nextStats, jobsPage]) => {
        if (!isMounted) {
          return;
        }

        setStats(nextStats);
        setHiringPosts(jobsPage.items.map(toDomainJobPost));
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setStats(null);
        setHiringPosts([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="grid gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
          <div>
            <Badge tone="green">무료 피트니스 구인</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-tight text-ink sm:text-6xl">
              트레이너가 구인글을 보고 프로필로 지원하는 게시판
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              GymIn은 센터 사장님이 구인글을 올리고, 트레이너가 미리 등록한 프로필로 지원하는 무료 웹 서비스입니다.
              구인글과 트레이너 프로필 기반 지원 흐름에 집중합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink to="/jobs/hiring">구인글 보기</PrimaryLink>
              <PrimaryLink to="/trainer" variant="light">
                내 프로필 등록
              </PrimaryLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
            <img
              alt="트레이너가 이용할 수 있는 헬스장 시설"
              className="h-72 w-full object-cover sm:h-96"
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="grid grid-cols-3 border-t border-line bg-white">
              <Stat label="등록 센터" value={stats ? `${stats.centers}` : "-"} />
              <Stat label="구인글" value={stats ? `${stats.open_job_posts}` : "-"} />
              <Stat label="트레이너" value={stats ? `${stats.trainer_profiles}` : "-"} />
            </div>
          </div>
        </Container>
      </section>

      <Container className="space-y-10 py-12">
        <HomeRail actionLabel="전체 보기" actionTo="/jobs/hiring" items={hiringPosts} title="최신 구인글" type="hiring" />
      </Container>

      <section className="border-y border-line bg-white">
        <Container className="grid gap-6 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <Badge tone="dark">공지사항</Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink">무료 게시판 이용 안내</h2>
            <p className="mt-4 max-w-3xl leading-8 text-muted">
              구인글을 편하게 올리고 트레이너가 프로필로 지원합니다. 로그인, 지원자 열람 권한,
              신고/숨김 처리를 최소한의 운영 장치로 둡니다.
            </p>
          </div>
          <aside className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-lg font-black text-ink">운영 공지</h3>
            <ul className="mt-4 space-y-3">
              {notices.map((notice) => (
                <li className="rounded-md border border-line bg-white p-3 text-sm font-bold leading-6 text-muted" key={notice}>
                  {notice}
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-line p-5 last:border-r-0">
      <p className="text-3xl font-black text-ink">{value}</p>
      <p className="mt-1 text-sm font-bold text-muted">{label}</p>
    </div>
  );
}

function HomeRail({
  title,
  items,
  type,
  actionLabel,
  actionTo
}: {
  title: string;
  items: JobPost[];
  type: "hiring";
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black tracking-tight text-ink">{title}</h2>
        <PrimaryLink to={actionTo} variant="light">
          {actionLabel}
        </PrimaryLink>
      </div>
      <div className="mt-5 flex gap-4 overflow-x-auto pb-3">
        {items.length > 0 ? (
          items.map((item) => (
            <HomePostCard item={item} key={item.id} type={type} />
          ))
        ) : (
          <p className="border-y border-line py-8 text-sm font-bold leading-6 text-muted">
            현재 표시할 구인글이 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}

function HomePostCard({ item, type }: { item: JobPost; type: "hiring" }) {
  const detailTo = item.gymId ? `/gyms/${item.gymId}` : "/jobs/hiring";
  const meta = `${item.area} · ${item.employmentType}`;

  return (
    <Link className="w-[280px] shrink-0 overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:border-green" href={detailTo}>
      <div className="p-4">
        <Badge tone={type === "hiring" ? "green" : "neutral"}>구인</Badge>
        <h3 className="mt-3 line-clamp-2 text-lg font-black leading-6 text-ink">{item.title}</h3>
        <p className="mt-2 text-sm font-bold text-muted">{item.authorName}</p>
        <p className="mt-1 text-sm font-bold text-muted">{meta}</p>
      </div>
    </Link>
  );
}

"use client";

import { useMemo, useState } from "react";

import { InsightCard } from "@/features/insights/components/InsightCard";
import { InsightCategoryTabs } from "@/features/insights/components/InsightCategoryTabs";
import { INSIGHT_ARTICLES, INSIGHT_CATEGORIES } from "@/features/insights/constants";
import type { InsightCategoryId } from "@/features/insights/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export function InsightsPage() {
  useDocumentTitle("피트니스 업계소식");
  const [activeCategory, setActiveCategory] = useState<InsightCategoryId>("all");
  const visibleArticles = useMemo(() => {
    if (activeCategory === "all") {
      return INSIGHT_ARTICLES;
    }

    return INSIGHT_ARTICLES.filter((article) => article.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <Container className="grid gap-8 py-12 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <Badge tone="dark">인사이트</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
              피트니스 업계 사람이 자주 확인할 소식
            </h1>
            <p className="mt-5 max-w-3xl text-base font-bold leading-8 text-muted">
              채용, 센터 운영, 트레이너 커리어, 교육/대회 흐름을 GymIn 관점으로 짧게 정리합니다.
              처음 방문한 비회원도 둘러볼 이유가 생기도록 공개 정보로 운영합니다.
            </p>
          </div>
          <aside className="rounded-lg border border-line bg-white p-5">
            <p className="text-sm font-black text-muted">현재 운영 방식</p>
            <p className="mt-3 text-2xl font-black tracking-tight text-ink">수동 큐레이션</p>
            <p className="mt-3 text-sm font-bold leading-7 text-muted">
              외부 글을 그대로 복사하지 않고, GymIn에서 직접 요약한 메모와 관련 화면을 연결합니다.
            </p>
          </aside>
        </Container>
      </section>

      <Container className="space-y-6 py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <InsightCategoryTabs
            activeCategory={activeCategory}
            categories={INSIGHT_CATEGORIES}
            onCategoryChange={setActiveCategory}
          />
          <PrimaryLink to="/jobs/hiring/new" variant="light">
            구인글 등록
          </PrimaryLink>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article) => (
            <InsightCard article={article} key={article.id} />
          ))}
        </section>
      </Container>
    </>
  );
}

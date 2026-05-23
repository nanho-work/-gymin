"use client";

import { useCallback, useEffect, useRef } from "react";

import { HomeJobCard } from "@/features/home/components/HomeJobCard";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import type { JobPost } from "@/shared/types/domain";

const AUTO_SCROLL_INTERVAL_MS = 3600;
const FALLBACK_CARD_SCROLL_STEP_PX = 336;

export function LatestJobsRail({ items }: { items: JobPost[] }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef(false);
  const canMove = items.length > 1;

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const card = rail.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card ? card.offsetWidth + 16 : FALLBACK_CARD_SCROLL_STEP_PX;
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!canMove) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail || isPausedRef.current) {
        return;
      }

      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      if (maxScrollLeft <= 0) {
        return;
      }

      if (rail.scrollLeft >= maxScrollLeft - 24) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      scrollByCard(1);
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [canMove, scrollByCard]);

  return (
    <section aria-label="최신 구인글 캐러셀">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-black tracking-tight text-ink">최신 구인글</h2>
        <div className="flex items-center gap-2">
          <button
            aria-label="이전 구인글 보기"
            className="h-10 rounded-md border border-line bg-white px-4 text-sm font-black text-ink transition hover:border-green disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canMove}
            onClick={() => scrollByCard(-1)}
            type="button"
          >
            이전
          </button>
          <button
            aria-label="다음 구인글 보기"
            className="h-10 rounded-md border border-line bg-white px-4 text-sm font-black text-ink transition hover:border-green disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canMove}
            onClick={() => scrollByCard(1)}
            type="button"
          >
            다음
          </button>
          <PrimaryLink to="/jobs/hiring" variant="light">
            전체 보기
          </PrimaryLink>
        </div>
      </div>
      <div
        className="mt-5 flex snap-x gap-4 overflow-x-auto scroll-smooth pb-3"
        onFocus={() => {
          isPausedRef.current = true;
        }}
        onBlur={() => {
          isPausedRef.current = false;
        }}
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
        ref={railRef}
      >
        {items.length > 0 ? (
          items.map((item) => <HomeJobCard item={item} key={item.id} />)
        ) : (
          <p className="border-y border-line py-8 text-sm font-bold leading-6 text-muted">
            현재 표시할 구인글이 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}

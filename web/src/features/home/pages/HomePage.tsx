"use client";

import { useEffect, useState } from "react";

import { HomeHeroSection } from "@/features/home/components/HomeHeroSection";
import { HomeNoticeSection } from "@/features/home/components/HomeNoticeSection";
import { LatestJobsRail } from "@/features/home/components/LatestJobsRail";
import { listJobPosts, toDomainJobPost } from "@/shared/api/jobsClient";
import { getPlatformStats } from "@/shared/api/platformClient";
import type { PlatformStats } from "@/shared/api/types";
import { Container } from "@/shared/components/ui/Container";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { JobPost } from "@/shared/types/domain";

export function HomePage() {
  useDocumentTitle("피트니스 구인구직 플랫폼");
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
      <HomeHeroSection stats={stats} />

      <Container className="space-y-10 py-12">
        <LatestJobsRail items={hiringPosts} />
      </Container>

      <HomeNoticeSection />
    </>
  );
}

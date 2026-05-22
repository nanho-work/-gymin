"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { JobPostCard } from "@/features/jobs/components/JobPostCard";
import { SearchPanel } from "@/shared/components/ui/SearchPanel";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useTextFilter } from "@/shared/hooks/useTextFilter";
import type { JobPost } from "@/shared/types/domain";
import { listJobPosts, toDomainJobPost } from "@/shared/api/jobsClient";

export function HiringJobsPage() {
  useDocumentTitle("구인글");
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [dataState, setDataState] = useState<"loading" | "connected" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const { query, setQuery, filteredItems } = useTextFilter<JobPost>(
    posts,
    (post) => `${post.title} ${post.authorName} ${post.area} ${post.tags.join(" ")}`
  );

  useEffect(() => {
    let isMounted = true;

    listJobPosts({ page: 1, size: 50 })
      .then((page) => {
        if (!isMounted) {
          return;
        }

        setPosts(page.items.map(toDomainJobPost));
        setDataState("connected");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setPosts([]);
        setErrorMessage("구인글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        setDataState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Container className="space-y-6 py-8">
      <SearchPanel
        onQueryChange={setQuery}
        placeholder="지역, 업장명, 직무 조건으로 검색"
        query={query}
        rightSlot={
          <>
            <Badge tone={dataState === "connected" ? "green" : "amber"}>
              {dataState === "connected" ? "서버 연결" : dataState === "loading" ? "불러오는 중" : "확인 필요"}
            </Badge>
            <Badge tone="green">무료 등록</Badge>
            <Badge>{filteredItems.length}개 공고</Badge>
            <PrimaryLink to="/jobs/hiring/new" variant="light">
              구인글 등록
            </PrimaryLink>
          </>
        }
      />
        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">무료 구인글 안내</h2>
          <p className="mt-3 leading-7 text-muted">
            센터 사장님이 트레이너를 찾는 글을 올리는 공간입니다. 트레이너는 저장된 프로필로 지원하고,
            사장님은 지원자 목록에서 공개 프로필과 연락처를 확인합니다.
          </p>
        </section>
        <div className="space-y-4">
          {dataState === "error" ? (
            <section className="border-y border-line py-12 text-center">
              <h2 className="text-xl font-black text-ink">구인글을 불러오지 못했습니다</h2>
              <p className="mt-3 text-sm font-bold text-muted">{errorMessage}</p>
            </section>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((post) => (
              <JobPostCard enableApplication={dataState === "connected"} key={post.id} post={post} />
            ))
          ) : (
            <section className="border-y border-line py-12 text-center">
              <h2 className="text-xl font-black text-ink">등록된 구인글이 없습니다</h2>
              <p className="mt-3 text-sm font-bold text-muted">센터 사장님이 구인글을 등록하면 이 목록에 표시됩니다.</p>
            </section>
          )}
        </div>
    </Container>
  );
}

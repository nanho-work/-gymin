"use client";

import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PaginationControls } from "@/shared/components/ui/PaginationControls";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { JobPostCard } from "@/features/jobs/components/JobPostCard";
import { useJobSearchList } from "@/features/jobs/hooks/useJobSearchList";
import { SearchPanel } from "@/shared/components/ui/SearchPanel";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export function HiringJobsPage() {
  useDocumentTitle("구인글");
  const {
    dataState,
    errorMessage,
    pageData,
    posts,
    query,
    setPage,
    setQuery
  } = useJobSearchList();

  return (
    <Container className="space-y-6 py-8">
      <SearchPanel
        onQueryChange={setQuery}
        placeholder="지역, 업장명, 업종, 공고 제목으로 검색"
        query={query}
        rightSlot={
          <>
            <Badge tone={dataState === "connected" ? "green" : "amber"}>
              {dataState === "connected" ? "서버 검색" : dataState === "loading" ? "불러오는 중" : "확인 필요"}
            </Badge>
            <Badge>{(pageData?.total ?? 0).toLocaleString("ko-KR")}개 공고</Badge>
            <PrimaryLink to="/jobs/hiring/new" variant="light">
              구인글 등록
            </PrimaryLink>
          </>
        }
      />

      <div className="space-y-4">
        {dataState === "error" ? (
          <section className="border-y border-line py-12 text-center">
            <h2 className="text-xl font-black text-ink">구인글을 불러오지 못했습니다</h2>
            <p className="mt-3 text-sm font-bold text-muted">{errorMessage}</p>
          </section>
        ) : dataState === "loading" && posts.length === 0 ? (
          <section className="border-y border-line py-12 text-center">
            <h2 className="text-xl font-black text-ink">구인글을 불러오는 중입니다</h2>
          </section>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <JobPostCard key={post.id} post={post} />
          ))
        ) : (
          <section className="border-y border-line py-12 text-center">
            <h2 className="text-xl font-black text-ink">검색 결과가 없습니다</h2>
            <p className="mt-3 text-sm font-bold text-muted">다른 지역, 업장명, 업종, 공고 제목으로 검색해 주세요.</p>
          </section>
        )}
      </div>

      {pageData ? (
        <PaginationControls
          hasNext={pageData.has_next}
          hasPrev={pageData.has_prev}
          onPageChange={setPage}
          page={pageData.page}
          total={pageData.total}
          totalPages={pageData.total_pages}
        />
      ) : null}
    </Container>
  );
}

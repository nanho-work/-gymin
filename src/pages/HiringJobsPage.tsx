import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { SearchPanel } from "@/components/domain/SearchPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTextFilter } from "@/hooks/useTextFilter";
import type { JobPost } from "@/types/domain";
import { getJobsByType } from "@/utils/mockRepository";

const hiringPosts = getJobsByType("hiring");

export function HiringJobsPage() {
  useDocumentTitle("구인글");
  const { query, setQuery, filteredItems } = useTextFilter<JobPost>(
    hiringPosts,
    (post) => `${post.title} ${post.authorName} ${post.area} ${post.tags.join(" ")}`
  );

  return (
    <Container className="space-y-6 py-8">
      <SearchPanel
        onQueryChange={setQuery}
        placeholder="지역, 업장명, 직무 조건으로 검색"
        query={query}
        rightSlot={
          <>
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
            센터 사장님이 트레이너를 찾는 글을 올리는 공간입니다. 지금은 목업이라 실제 지원 관리 없이,
            글 내용과 연락 방법을 확인하는 카페형 흐름으로 구성합니다.
          </p>
        </section>
        <div className="space-y-4">
          {filteredItems.map((post) => (
            <JobPostCard key={post.id} post={post} />
          ))}
        </div>
    </Container>
  );
}

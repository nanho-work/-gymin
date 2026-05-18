import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
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
    <>
      <PageHeader
        actions={<PrimaryLink to="/gyms/new">헬스장 등록 후 구인 작성</PrimaryLink>}
        description="헬스장 사장님이 트레이너를 찾는 게시판입니다. 목업에서는 작성 권한을 사업자 인증 완료 업장으로 표현합니다."
        eyebrow="헬스장 사장님 작성"
        title="구인글 페이지"
      />
      <Container className="space-y-6 py-8">
        <SearchPanel
          onQueryChange={setQuery}
          placeholder="지역, 업장명, 직무 조건으로 검색"
          query={query}
          rightSlot={
            <>
              <Badge tone="green">사업자 인증 작성</Badge>
              <Badge>{filteredItems.length}개 공고</Badge>
            </>
          }
        />
        <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">작성 권한 안내</h2>
          <p className="mt-3 leading-7 text-muted">
            구인글 작성은 헬스장 정보 등록과 사업자등록 인증을 마친 사장님만 가능하도록 설계합니다. 지금은
            실제 인증 없이 화면 흐름만 보여줍니다.
          </p>
        </section>
        <div className="space-y-4">
          {filteredItems.map((post) => (
            <JobPostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </>
  );
}

import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { JobPostCard } from "@/components/cards/JobPostCard";
import { TrainerCard } from "@/components/cards/TrainerCard";
import { SearchPanel } from "@/components/domain/SearchPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTextFilter } from "@/hooks/useTextFilter";
import type { JobPost } from "@/types/domain";
import { getJobsByType, trainers } from "@/utils/mockRepository";

const seekingPosts = getJobsByType("seeking");

export function SeekingJobsPage() {
  useDocumentTitle("구직글");
  const { query, setQuery, filteredItems } = useTextFilter<JobPost>(
    seekingPosts,
    (post) => `${post.title} ${post.authorName} ${post.area} ${post.tags.join(" ")}`
  );

  return (
    <>
      <PageHeader
        actions={<PrimaryLink to="/trainers/new">트레이너 정보 등록</PrimaryLink>}
        description="트레이너가 희망 지역, 근무 형태, 정산 조건을 공개해 업장과 연결되는 구직 게시판입니다."
        eyebrow="트레이너 중심"
        title="구직글 페이지"
      />
      <Container className="space-y-6 py-8">
        <SearchPanel
          onQueryChange={setQuery}
          placeholder="지역, 전문 분야, 희망 조건으로 검색"
          query={query}
          rightSlot={
            <>
              <Badge tone="green">전체 이용 가능</Badge>
              <Badge>{filteredItems.length}개 구직글</Badge>
            </>
          }
        />
        <div className="space-y-4">
          {filteredItems.map((post) => (
            <JobPostCard key={post.id} post={post} />
          ))}
        </div>
        <section className="space-y-4 pt-4">
          <div>
            <h2 className="text-2xl font-black text-ink">트레이너 상세보기</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              구직글과 연결될 트레이너 프로필 상세 페이지 예시입니다.
            </p>
          </div>
          <div className="content-grid grid gap-5">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

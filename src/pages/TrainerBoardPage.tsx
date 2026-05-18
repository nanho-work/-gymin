import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { BoardPostCard } from "@/components/cards/BoardPostCard";
import { AccessPolicyPanel } from "@/components/domain/AccessPolicyPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getBoardPostsByAudience } from "@/utils/mockRepository";

const trainerPosts = getBoardPostsByAudience("trainers");

export function TrainerBoardPage() {
  useDocumentTitle("트레이너 게시판");

  return (
    <>
      <PageHeader
        actions={<PrimaryLink to="/trainers/new">트레이너 정보 등록</PrimaryLink>}
        description="트레이너가 근무 조건, 업장 탐색, 면접 질문, 정산 경험을 공유하는 공개 게시판입니다."
        eyebrow="전체 이용 가능"
        title="트레이너 전용 게시판"
      />
      <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge tone="green">오픈 게시판</Badge>
                <h2 className="mt-4 text-xl font-black text-ink">최근 이야기</h2>
              </div>
              <button className="rounded-md border border-line px-4 py-2.5 text-sm font-black text-ink" type="button">
                글쓰기 UI
              </button>
            </div>
            <p className="mt-3 leading-7 text-muted">
              실제 글 작성과 로그인은 연결하지 않고, 누구나 접근 가능한 게시판이라는 구조만 표현합니다.
            </p>
          </section>
          {trainerPosts.map((post) => (
            <BoardPostCard key={post.id} post={post} />
          ))}
        </div>
        <AccessPolicyPanel />
      </Container>
    </>
  );
}

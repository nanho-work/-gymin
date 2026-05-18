import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { BoardPostCard } from "@/components/cards/BoardPostCard";
import { AccessPolicyPanel } from "@/components/domain/AccessPolicyPanel";
import { BusinessVerificationPanel } from "@/components/domain/BusinessVerificationPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getBoardPostsByAudience } from "@/utils/mockRepository";

const ownerPosts = getBoardPostsByAudience("owners");

export function OwnerBoardPage() {
  useDocumentTitle("사장님 게시판");

  return (
    <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-ink">헬스장 사장님 게시판</h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                사업자등록 인증 완료 사장님만 이용 가능한 운영자 전용 게시판입니다.
              </p>
            </div>
            <PrimaryLink to="/gyms/new">사업자 인증 UI 보기</PrimaryLink>
          </div>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge tone="amber">열람 제한 목업</Badge>
                <h2 className="mt-4 text-xl font-black text-ink">인증 전 미리보기</h2>
              </div>
              <span className="rounded-md bg-paper px-3 py-2 text-sm font-black text-muted">2개 게시글</span>
            </div>
            <p className="mt-3 leading-7 text-muted">
              게시글 목록의 존재는 보여주되, 상세 내용은 사업자 인증 완료 후 열람되는 UX로 잡았습니다.
            </p>
          </section>
          {ownerPosts.map((post) => (
            <BoardPostCard key={post.id} locked post={post} />
          ))}
        </div>
        <div className="space-y-5">
          <BusinessVerificationPanel />
          <AccessPolicyPanel />
        </div>
    </Container>
  );
}

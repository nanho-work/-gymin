import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
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

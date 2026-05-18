import { Badge } from "@/components/common/Badge";
import type { BoardPost } from "@/types/domain";

export function BoardPostCard({ post, locked = false }: { post: BoardPost; locked?: boolean }) {
  return (
    <article className={`rounded-lg border border-line bg-white p-5 shadow-sm ${locked ? "relative overflow-hidden" : ""}`}>
      <div className={locked ? "select-none blur-[1.5px]" : ""}>
        <div className="flex flex-wrap gap-2">
          <Badge tone={post.audience === "owners" ? "dark" : "green"}>
            {post.audience === "owners" ? "사장님 전용" : "트레이너 오픈"}
          </Badge>
          <Badge>{post.category}</Badge>
        </div>
        <h2 className="mt-4 text-xl font-black text-ink">{post.title}</h2>
        <p className="mt-3 leading-7 text-muted">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4 text-sm font-bold text-muted">
          <span>{post.author}</span>
          <span>{post.createdAt}</span>
          <span>댓글 {post.comments}</span>
        </div>
      </div>
      {locked ? (
        <div className="absolute inset-0 grid place-items-center bg-white/78 px-5 text-center">
          <div>
            <Badge tone="amber">사업자 인증 필요</Badge>
            <p className="mt-3 text-sm font-black text-ink">사장님 게시판은 인증 완료 후 열람됩니다.</p>
          </div>
        </div>
      ) : null}
    </article>
  );
}

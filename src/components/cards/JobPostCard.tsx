import { Badge } from "@/components/common/Badge";
import type { JobPost } from "@/types/domain";

export function JobPostCard({ post }: { post: JobPost }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={post.type === "hiring" ? "green" : "neutral"}>
              {post.type === "hiring" ? "구인" : "구직"}
            </Badge>
            <Badge>{post.status}</Badge>
          </div>
          <h2 className="mt-4 text-xl font-black text-ink">{post.title}</h2>
          <p className="mt-2 text-sm font-bold text-muted">
            {post.authorName} · {post.area}
          </p>
        </div>
        <p className="text-sm font-bold text-muted">{post.postedAt}</p>
      </div>
      <p className="mt-4 leading-7 text-muted">{post.summary}</p>
      <dl className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-black uppercase text-muted">형태</dt>
          <dd className="mt-1 font-black text-ink">{post.employmentType}</dd>
        </div>
        <div>
          <dt className="text-xs font-black uppercase text-muted">정산</dt>
          <dd className="mt-1 font-black text-ink">{post.compensation}</dd>
        </div>
        <div>
          <dt className="text-xs font-black uppercase text-muted">시간</dt>
          <dd className="mt-1 font-black text-ink">{post.schedule}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </article>
  );
}

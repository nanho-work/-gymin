import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import type { JobPost } from "@/types/domain";
import { getGymById } from "@/utils/mockRepository";

export function JobPostCard({ post }: { post: JobPost }) {
  const profileHref = post.gymId ? `/gyms/${post.gymId}` : "#";
  const primaryLabel = "연락 방법 확인 UI";
  const secondaryLabel = "업장 상세";
  const gym = post.gymId ? getGymById(post.gymId) : undefined;

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">구인</Badge>
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
      {gym ? (
        <section className="mt-5 flex flex-col gap-4 rounded-md border border-line bg-paper p-4 sm:flex-row sm:items-center">
          <img alt={`${gym.name} 대표 사진`} className="h-20 w-full rounded-md object-cover sm:w-28" src={gym.heroImage} />
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge tone={gym.verified ? "green" : "amber"}>{gym.registrationStatus}</Badge>
              <Badge>{gym.category}</Badge>
            </div>
            <p className="mt-2 font-black text-ink">{gym.name}</p>
            <p className="mt-1 text-sm font-bold text-muted">{gym.area}</p>
          </div>
        </section>
      ) : null}
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
      <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
        <button className="rounded-md bg-ink px-4 py-2.5 text-sm font-black text-white" type="button">
          {primaryLabel}
        </button>
        <Link className="rounded-md border border-line px-4 py-2.5 text-sm font-black text-ink hover:border-green" to={profileHref}>
          {secondaryLabel}
        </Link>
      </div>
    </article>
  );
}

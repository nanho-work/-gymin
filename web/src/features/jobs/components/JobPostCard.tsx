"use client";

import Link from "next/link";

import { Badge } from "@/shared/components/ui/Badge";
import type { JobPost } from "@/shared/types/domain";

export function JobPostCard({ post }: { post: JobPost }) {
  return (
    <Link
      className="block overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:border-green hover:bg-paper"
      href={`/jobs/hiring/${post.id}`}
    >
      <article className="grid gap-0 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="p-5">
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
            <div className="text-sm font-bold text-muted md:text-right">
              <p>{post.postedAt}</p>
              <p className="mt-2 text-xs font-black text-forest">상세 보기</p>
            </div>
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
        </div>
        <div className="aspect-square border-t border-line bg-paper p-3 md:border-l md:border-t-0">
          {post.imageUrl ? (
            <img alt={`${post.authorName} 대표 이미지`} className="h-full w-full object-contain" src={post.imageUrl} />
          ) : (
            <div className="grid h-full w-full place-items-center px-4 text-center text-sm font-black text-muted">
              대표 이미지 없음
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

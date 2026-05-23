import Link from "next/link";

import type { JobPost } from "@/shared/types/domain";

export function HomeJobCard({ item }: { item: JobPost }) {
  const detailTo = `/jobs/hiring/${item.id}`;

  return (
    <Link
      className="w-[296px] shrink-0 snap-start overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:border-green sm:w-[320px]"
      data-carousel-card
      href={detailTo}
    >
      <figure className="aspect-[4/3] w-full overflow-hidden bg-paper">
        {item.imageUrl ? (
          <img alt={`${item.authorName} 대표 이미지`} className="h-full w-full object-cover" src={item.imageUrl} />
        ) : (
          <div className="grid h-full place-items-center px-5 text-center text-sm font-black text-muted">
            대표 이미지 없음
          </div>
        )}
      </figure>
      <div className="min-h-[132px] p-4">
        <h3 className="line-clamp-2 text-lg font-black leading-6 text-ink">{item.title}</h3>
        <p className="mt-3 text-sm font-bold text-muted">{item.authorName}</p>
        <p className="mt-1 text-sm font-bold text-muted">{item.area}</p>
      </div>
    </Link>
  );
}

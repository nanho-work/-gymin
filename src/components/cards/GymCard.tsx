import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import type { Gym } from "@/types/domain";
import { getAverageRating } from "@/utils/rating";

export function GymCard({ gym }: { gym: Gym }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link to={`/gyms/${gym.id}`}>
        <img alt={`${gym.name} 시설 이미지`} className="h-44 w-full object-cover" src={gym.heroImage} />
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone={gym.verified ? "green" : "amber"}>{gym.registrationStatus}</Badge>
          <Badge>{gym.hiringStatus}</Badge>
        </div>
        <Link to={`/gyms/${gym.id}`}>
          <h2 className="mt-4 text-xl font-black text-ink">{gym.name}</h2>
        </Link>
        <p className="mt-1 text-sm font-bold text-muted">{gym.area}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{gym.summary}</p>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <div>
            <p className="text-xs font-black uppercase text-muted">평균 신뢰 점수</p>
            <p className="mt-1 text-2xl font-black text-ink">{getAverageRating(gym.ratings)}</p>
          </div>
          <Link className="rounded-md border border-line px-3 py-2 text-sm font-black text-ink hover:border-green" to={`/gyms/${gym.id}`}>
            상세보기
          </Link>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import type { Trainer } from "@/shared/types/domain";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-ink">{trainer.name}</h2>
          <p className="mt-1 text-sm font-bold text-muted">{trainer.area}</p>
        </div>
        <Badge tone={trainer.verifiedProfile ? "green" : "amber"}>
          {trainer.verifiedProfile ? "프로필 확인" : "확인 대기"}
        </Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{trainer.headline}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {trainer.specialties.map((specialty) => (
          <Badge key={specialty}>{specialty}</Badge>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <p className="text-sm font-bold text-muted">{trainer.experienceYears}년차</p>
        <Link
          className="rounded-md border border-line px-3 py-2 text-sm font-black text-ink hover:border-green" href={`/trainers/${trainer.id}`}
        >
          상세보기
        </Link>
      </div>
    </article>
  );
}

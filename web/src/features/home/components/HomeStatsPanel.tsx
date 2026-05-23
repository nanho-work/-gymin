import type { PlatformStats } from "@/shared/api/types";

export function HomeStatsPanel({ stats }: { stats: PlatformStats | null }) {
  return (
    <div className="grid grid-cols-3 border-t border-line bg-white">
      <Stat label="등록 센터" value={stats ? `${stats.centers}` : "-"} />
      <Stat label="구인글" value={stats ? `${stats.open_job_posts}` : "-"} />
      <Stat label="등록 프로필" value={stats ? `${stats.trainer_profiles}` : "-"} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-line p-5 last:border-r-0">
      <p className="text-3xl font-black text-ink">{value}</p>
      <p className="mt-1 text-sm font-bold text-muted">{label}</p>
    </div>
  );
}

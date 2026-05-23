import { HomeStatsPanel } from "@/features/home/components/HomeStatsPanel";
import type { PlatformStats } from "@/shared/api/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";

export function HomeHeroSection({ stats }: { stats: PlatformStats | null }) {
  return (
    <section className="border-b border-line bg-white">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
        <div>
          <Badge tone="green">피트니스 구인구직</Badge>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-tight text-ink sm:text-6xl">
            피트니스 시설과 운동 지도자를 연결하는 구인구직 플랫폼
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            헬스장, 필라테스 스튜디오, 요가원, 크로스핏 박스가 공고를 올리고
            강사와 트레이너는 등록한 프로필로 지원합니다. 업종별 공고, 시설 정보, 지원자 확인 흐름을 한곳에서 이어갑니다.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
          <img
            alt="운동 지도자가 이용할 수 있는 피트니스 시설"
            className="h-72 w-full object-cover sm:h-96"
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
          />
          <HomeStatsPanel stats={stats} />
        </div>
      </Container>
    </section>
  );
}

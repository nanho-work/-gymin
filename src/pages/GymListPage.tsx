import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { GymCard } from "@/components/cards/GymCard";
import { SearchPanel } from "@/components/domain/SearchPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTextFilter } from "@/hooks/useTextFilter";
import type { Gym } from "@/types/domain";
import { gyms } from "@/utils/mockRepository";

export function GymListPage() {
  useDocumentTitle("헬스장 목록");
  const { query, setQuery, filteredItems } = useTextFilter<Gym>(
    gyms,
    (gym) => `${gym.name} ${gym.area} ${gym.category} ${gym.tags.join(" ")}`
  );

  return (
    <Container className="space-y-6 py-8">
      <SearchPanel
        onQueryChange={setQuery}
        placeholder="지역, 업장명, 수업 형태로 검색"
        query={query}
        rightSlot={
          <>
            <Badge tone="green">사업자 인증 우선</Badge>
            <Badge>목업 데이터 {filteredItems.length}개</Badge>
            <PrimaryLink to="/gyms/new" variant="light">
              헬스장 정보 등록
            </PrimaryLink>
          </>
        }
      />
        <div className="content-grid grid gap-5">
          {filteredItems.map((gym) => (
            <GymCard gym={gym} key={gym.id} />
          ))}
        </div>
    </Container>
  );
}

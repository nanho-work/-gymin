import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { AccessPolicyPanel } from "@/components/domain/AccessPolicyPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { gyms, jobs, trainers } from "@/utils/mockRepository";

export function HomePage() {
  useDocumentTitle("트레이너를 위한 헬스장 정보 플랫폼");

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="grid gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
          <div>
            <Badge tone="green">Trainer first web platform</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-tight text-ink sm:text-6xl">
              트레이너가 일할 헬스장을 더 정확히 고르는 웹
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              gymin은 헬스장 정보, 구인글, 구직글, 트레이너 프로필을 한 곳에서 확인하는 목업 웹 서비스입니다.
              서버는 나중에 FastAPI로 붙이고, 지금은 구조와 UX 흐름을 먼저 잡습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink to="/gyms">헬스장 목록 보기</PrimaryLink>
              <PrimaryLink to="/jobs/hiring" variant="light">
                구인글 확인
              </PrimaryLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
            <img
              alt="트레이너가 이용할 수 있는 헬스장 시설"
              className="h-72 w-full object-cover sm:h-96"
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="grid grid-cols-3 border-t border-line bg-white">
              <Stat label="등록 헬스장" value={`${gyms.length}`} />
              <Stat label="구인/구직" value={`${jobs.length}`} />
              <Stat label="트레이너" value={`${trainers.length}`} />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-5 md:grid-cols-3">
          <FlowCard
            title="헬스장 정보 등록"
            description="사장님은 사업자 인증 UI와 함께 기본 정보, 시설, 채용 조건을 등록합니다."
            to="/gyms/new"
          />
          <FlowCard
            title="트레이너 정보 등록"
            description="트레이너는 경력, 희망 조건, 전문 분야를 등록해 구직글과 상세 페이지로 연결합니다."
            to="/trainers/new"
          />
          <FlowCard
            title="구인구직 게시 흐름"
            description="구인글은 업장이, 구직글은 트레이너가 작성하는 웹 게시판형 구조로 설계합니다."
            to="/jobs/seeking"
          />
        </div>
      </Container>

      <section className="border-y border-line bg-white">
        <Container className="grid gap-6 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <Badge tone="dark">웹 구조</Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink">앱이 아니라 웹서비스처럼 탐색합니다</h2>
            <p className="mt-4 max-w-3xl leading-8 text-muted">
              상단 내비게이션, 목록 검색, 상세 페이지, 게시판형 콘텐츠를 중심으로 구성했습니다. 모바일에서도
              대응하지만 기본 인상은 데스크톱 웹 플랫폼입니다.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Link className="rounded-lg border border-line bg-paper p-5 hover:border-green" to="/boards/trainers">
                <p className="text-sm font-black text-forest">트레이너 게시판</p>
                <h3 className="mt-2 text-xl font-black text-ink">모든 사용자 접근 가능</h3>
              </Link>
              <Link className="rounded-lg border border-line bg-paper p-5 hover:border-green" to="/boards/owners">
                <p className="text-sm font-black text-forest">사장님 게시판</p>
                <h3 className="mt-2 text-xl font-black text-ink">사업자 인증 후 접근</h3>
              </Link>
            </div>
          </div>
          <AccessPolicyPanel />
        </Container>
      </section>
    </>
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

function FlowCard({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link className="rounded-lg border border-line bg-white p-6 shadow-sm transition hover:border-green" to={to}>
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-3 leading-7 text-muted">{description}</p>
      <p className="mt-5 text-sm font-black text-forest">페이지 이동</p>
    </Link>
  );
}

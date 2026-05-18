import { Container } from "@/components/common/Container";
import { MockField } from "@/components/common/MockField";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function TrainerRegisterPage() {
  useDocumentTitle("트레이너 정보 등록");

  return (
    <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form className="space-y-6 rounded-lg border border-line bg-white p-6 shadow-sm">
          <SectionTitle title="기본 프로필" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="이름" placeholder="예: 김민준" />
            <MockField label="활동 지역" placeholder="예: 서울 강남 · 서초" />
            <MockField label="경력" placeholder="예: 5년차" />
            <MockField label="전문 분야" placeholder="예: 재활 PT, 바디프로필" />
          </div>

          <SectionTitle title="구직 조건" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="희망 근무 형태" placeholder="예: 파트타임, 프리랜서" />
            <MockField label="가능 시간" placeholder="예: 평일 오전/오후 협의" />
            <MockField label="희망 정산 방식" placeholder="예: 회당 정산, 월말 지급" />
            <MockField label="선호 업장 조건" placeholder="예: 계약서 제공, 정산일 명시" />
          </div>
          <MockField
            label="자기소개"
            placeholder="수업 스타일, 회원 관리 방식, 원하는 근무 환경을 간단히 적어주세요."
            textarea
          />

          <button className="rounded-md bg-ink px-5 py-3 text-sm font-black text-white" type="button">
            목업 등록하기
          </button>
        </form>

        <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">트레이너 상세보기 연결</h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            이 정보는 나중에 트레이너 상세 페이지, 구직글, 헬스장 사장님의 검색 화면과 연결될 수 있습니다.
            서버 연동 시 FastAPI의 프로필 API 응답 구조와 맞춰가기 쉽게 JSON mock data로 분리했습니다.
          </p>
        </aside>
    </Container>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

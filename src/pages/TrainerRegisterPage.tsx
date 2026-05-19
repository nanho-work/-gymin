import { Container } from "@/components/common/Container";
import { MockField } from "@/components/common/MockField";
import { PhotoUploadMock } from "@/components/domain/PhotoUploadMock";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function TrainerRegisterPage() {
  useDocumentTitle("트레이너 정보 등록");

  return (
    <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form className="space-y-6 rounded-lg border border-line bg-white p-6 shadow-sm">
          <section className="rounded-md border border-line bg-paper p-4">
            <h2 className="text-lg font-black text-ink">프로필은 언제든 임시 저장할 수 있습니다</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-muted">
              아래 지원 필수 정보가 부족해도 프로필 저장은 가능합니다. 다만 구인글에 지원할 때는 대표 사진,
              이름, 나이, 성별, 연락처, 거주지역이 필요합니다.
            </p>
          </section>
          <PhotoUploadMock
            description="지원자 목록과 상세 화면에 노출될 대표 프로필 사진입니다. 프로필 저장은 사진 없이도 가능하지만, 구인글 지원 시에는 필요합니다."
            requiredFirst
            requiredLabel="지원 필수"
            slots={["프로필 사진"]}
            title="대표 프로필 사진"
          />
          <PhotoUploadMock
            description="전신, 운동 사진, 바디프로필, 회원 수업 장면 등 포트폴리오 사진을 선택 등록하는 목업 UI입니다."
            optional
            slots={["전신 사진", "운동 사진", "바디프로필", "수업 장면", "추가 사진"]}
            title="운동 사진"
          />
          <SectionTitle title="지원 시 필요한 기본 정보" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="이름 (지원 필수)" placeholder="예: 김민준" />
            <MockField label="나이 (지원 필수)" placeholder="예: 29세" />
            <MockField label="성별 (지원 필수)" placeholder="예: 남성, 여성" />
            <MockField label="연락처 (지원 필수)" placeholder="예: 010-1234-5678" />
            <MockField label="거주지역 (지원 필수)" placeholder="예: 서울 서초구" />
          </div>

          <SectionTitle title="추가 프로필 정보" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="생년월일" placeholder="예: 1997.03.12" />
            <MockField label="희망 활동 지역" placeholder="예: 서울 강남 · 서초" />
            <MockField label="총 경력" placeholder="예: 5년차" />
            <MockField label="전문 분야" placeholder="예: 재활 PT, 바디프로필" />
            <MockField label="근무 형태" placeholder="예: 프리랜서, 파트타임, 정규직" />
          </div>

          <SectionTitle title="경력 및 이력" />
          <div className="space-y-3">
            <CareerRow index={1} />
            <CareerRow index={2} />
            <CareerRow index={3} />
          </div>
          <button className="rounded-md border border-line bg-paper px-4 py-2.5 text-sm font-black text-ink" type="button">
            경력 항목 추가 UI
          </button>

          <SectionTitle title="자격증 또는 수상경력" />
          <div className="space-y-3">
            <SimpleRow index={1} placeholder="예: 생활스포츠지도사 2급" title="자격/수상" />
            <SimpleRow index={2} placeholder="예: CPR/AED, 재활/교정 관련 자격" title="자격/수상" />
            <SimpleRow index={3} placeholder="예: 스포츠모델 대회 입상" title="자격/수상" />
          </div>
          <button className="rounded-md border border-line bg-paper px-4 py-2.5 text-sm font-black text-ink" type="button">
            자격/수상 항목 추가 UI
          </button>

          <SectionTitle title="포트폴리오 링크" />
          <div className="space-y-3">
            <PortfolioRow index={1} />
            <PortfolioRow index={2} />
          </div>

          <SectionTitle title="자기소개" />
          <MockField
            label="자기소개"
            placeholder="수업 스타일, 회원 관리 방식, 본인의 강점과 일하는 방식을 자유롭게 적어주세요."
            textarea
          />

          <div className="flex flex-wrap gap-2">
            <button className="rounded-md bg-ink px-5 py-3 text-sm font-black text-white" type="button">
              임시 저장 목업
            </button>
            <button className="rounded-md border border-line bg-paper px-5 py-3 text-sm font-black text-ink" type="button">
              지원 가능 여부 확인
            </button>
          </div>
        </form>

        <div className="space-y-5">
          <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">지원 가능 조건</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              프로필 작성 중에는 언제든 저장할 수 있고, 구인글 지원 버튼을 누를 때만 아래 항목을 확인합니다.
            </p>
            <div className="mt-5 space-y-2">
              {["대표 프로필 사진", "이름", "나이", "성별", "연락처", "거주지역"].map((item) => (
                <div className="flex items-center justify-between rounded-md bg-paper px-3 py-2" key={item}>
                  <span className="text-sm font-bold text-muted">{item}</span>
                  <span className="text-xs font-black text-forest">지원 필수</span>
                </div>
              ))}
            </div>
          </aside>
          <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">트레이너 상세보기 연결</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              입력한 정보는 사장님 지원자 상세 화면과 트레이너 상세 페이지에 연결됩니다. 서버 연동 시 FastAPI의
              프로필 API 응답 구조와 맞춰가기 쉽게 JSON mock data로 분리했습니다.
            </p>
          </aside>
        </div>
    </Container>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

function CareerRow({ index }: { index: number }) {
  return (
    <div className="grid gap-3 rounded-md border border-line bg-paper p-3 md:grid-cols-[80px_1fr_1fr_1.4fr] md:items-center">
      <span className="text-sm font-black text-muted">이력 {index}</span>
      <input
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
        placeholder="근무했던 헬스장/센터"
      />
      <input
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
        placeholder="근무 기간"
      />
      <input
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
        placeholder="담당 업무"
      />
    </div>
  );
}

function SimpleRow({ index, title, placeholder }: { index: number; title: string; placeholder: string }) {
  return (
    <div className="grid gap-3 rounded-md border border-line bg-paper p-3 md:grid-cols-[110px_1fr] md:items-center">
      <span className="text-sm font-black text-muted">
        {title} {index}
      </span>
      <input
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
        placeholder={placeholder}
      />
    </div>
  );
}

function PortfolioRow({ index }: { index: number }) {
  return (
    <div className="grid gap-3 rounded-md border border-line bg-paper p-3 md:grid-cols-[110px_180px_1fr] md:items-center">
      <span className="text-sm font-black text-muted">링크 {index}</span>
      <input
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
        placeholder="예: Instagram"
      />
      <input
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
        placeholder="예: instagram.com/trainer"
      />
    </div>
  );
}

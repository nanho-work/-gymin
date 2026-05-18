import { Container } from "@/components/common/Container";
import { MockField } from "@/components/common/MockField";
import { PageHeader } from "@/components/common/PageHeader";
import { BusinessVerificationPanel } from "@/components/domain/BusinessVerificationPanel";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function GymRegisterPage() {
  useDocumentTitle("헬스장 정보 등록");

  return (
    <>
      <PageHeader
        description="헬스장 사장님이 업장 정보를 등록하는 목업 화면입니다. 실제 저장, 인증, 파일 업로드는 연결하지 않습니다."
        eyebrow="사장님용 등록"
        title="헬스장 정보 등록"
      />
      <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form className="space-y-6 rounded-lg border border-line bg-white p-6 shadow-sm">
          <SectionTitle title="기본 정보" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="헬스장명" placeholder="예: 피크바디짐 강남점" />
            <MockField label="지역" placeholder="예: 서울 강남" />
            <MockField label="주소" placeholder="예: 서울 강남구 테헤란로 118" />
            <MockField label="운영 형태" placeholder="예: PT, 그룹수업, 재활운동" />
          </div>

          <SectionTitle title="트레이너에게 공개할 근무 정보" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="정산 방식" placeholder="예: 월말 정산, 수업료 55%" />
            <MockField label="계약 형태" placeholder="예: 정규직, 프리랜서, 파트타임" />
            <MockField label="채용 상태" placeholder="예: 상시 채용 중" />
            <MockField label="주요 복지" placeholder="예: 교육 지원, 상담실 제공" />
          </div>
          <MockField
            label="업장 소개"
            placeholder="트레이너가 근무 조건을 이해할 수 있게 운영 방식과 수업 환경을 적어주세요."
            textarea
          />

          <button className="rounded-md bg-ink px-5 py-3 text-sm font-black text-white" type="button">
            목업 저장하기
          </button>
        </form>
        <div className="space-y-5">
          <BusinessVerificationPanel />
          <aside className="rounded-lg border border-line bg-white p-5 text-sm leading-6 text-muted shadow-sm">
            <h2 className="text-lg font-black text-ink">사장님 게시판 권한</h2>
            <p className="mt-3">
              사업자등록 인증이 완료된 업장 운영자만 사장님 게시판에 접근할 수 있도록 설계합니다. 현재는 UI
              표현만 포함합니다.
            </p>
          </aside>
        </div>
      </Container>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

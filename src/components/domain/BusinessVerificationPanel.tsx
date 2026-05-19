import { Badge } from "@/components/common/Badge";
import { MockField } from "@/components/common/MockField";

export function BusinessVerificationPanel() {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="amber">선택 인증</Badge>
          <h2 className="mt-4 text-xl font-black text-ink">인증 배지 신청</h2>
        </div>
        <span className="rounded-md bg-paper px-3 py-2 text-sm font-black text-muted">필수 아님</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">
        구인글 등록에 필수는 아닙니다. 나중에 운영자가 확인한 센터에는 인증 배지를 표시하는 선택 기능으로
        연결할 수 있게 UI 위치만 잡아 둡니다.
      </p>
      <div className="mt-5 space-y-3">
        <MockField label="대표자명 선택" placeholder="예: 홍길동" />
        <MockField label="사업자등록번호 선택" placeholder="예: 123-45-67890" />
      </div>
      <button className="mt-5 w-full rounded-md border border-dashed border-green bg-paper px-4 py-4 text-sm font-black text-forest">
        인증 자료 선택 업로드 UI
      </button>
    </section>
  );
}

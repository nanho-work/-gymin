import { Badge } from "@/components/common/Badge";

export function BusinessVerificationPanel() {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone="amber">목업 UI</Badge>
          <h2 className="mt-4 text-xl font-black text-ink">사업자등록 인증</h2>
        </div>
        <span className="rounded-md bg-paper px-3 py-2 text-sm font-black text-muted">파일 저장 없음</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">
        지금은 실제 업로드나 검증을 수행하지 않습니다. 추후 FastAPI 서버에서 파일 업로드, 사업자 인증 상태,
        사장님 게시판 권한을 연결할 수 있게 UI 위치만 잡아 둡니다.
      </p>
      <button className="mt-5 w-full rounded-md border border-dashed border-green bg-paper px-4 py-4 text-sm font-black text-forest">
        사업자등록증 업로드 영역
      </button>
    </section>
  );
}

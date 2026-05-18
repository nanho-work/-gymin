import { Badge } from "@/components/common/Badge";

export function AccessPolicyPanel() {
  return (
    <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <Badge tone="green">권한 정책</Badge>
      <h2 className="mt-4 text-xl font-black text-ink">게시판 이용 기준</h2>
      <div className="mt-4 space-y-4 text-sm leading-6 text-muted">
        <p>
          트레이너 게시판은 모든 사용자가 볼 수 있는 공개 게시판으로 구성합니다. 초기 목업에서는 별도 로그인
          없이 이용 흐름만 보여줍니다.
        </p>
        <p>
          사장님 게시판은 사업자등록 인증을 마친 업장 운영자만 이용 가능한 공간으로 표현합니다. 실제 인증
          로직은 서버 연동 단계에서 FastAPI로 붙입니다.
        </p>
      </div>
    </aside>
  );
}

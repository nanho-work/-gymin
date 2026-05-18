import { Container } from "@/components/common/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <Container className="flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-ink">gymin</p>
        <p>React 목업 · 서버/API/인증/업로드 미연동 · FastAPI 연동 예정 구조</p>
      </Container>
    </footer>
  );
}

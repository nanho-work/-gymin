import { Container } from "@/shared/components/ui/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <Container className="flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-ink">GymIn</p>
        <p>트레이너와 센터를 연결하는 피트니스 구인 플랫폼</p>
      </Container>
    </footer>
  );
}

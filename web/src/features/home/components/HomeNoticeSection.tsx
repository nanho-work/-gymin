import { HOME_NOTICES } from "@/features/home/constants";
import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";

export function HomeNoticeSection() {
  return (
    <section className="border-y border-line bg-white">
      <Container className="grid gap-6 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <Badge tone="dark">공지사항</Badge>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink">피트니스 구인구직 이용 안내</h2>
          <p className="mt-4 max-w-3xl leading-8 text-muted">
            시설은 공고를 올리고 강사와 트레이너는 프로필로 지원합니다. 로그인, 지원자 열람 권한,
            신고/숨김 처리를 기본 운영 장치로 둡니다.
          </p>
        </div>
        <aside className="rounded-lg border border-line bg-paper p-5">
          <h3 className="text-lg font-black text-ink">운영 공지</h3>
          <ul className="mt-4 space-y-3">
            {HOME_NOTICES.map((notice) => (
              <li className="rounded-md border border-line bg-white p-3 text-sm font-bold leading-6 text-muted" key={notice}>
                {notice}
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </section>
  );
}

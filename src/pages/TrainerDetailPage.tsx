import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getTrainerById } from "@/utils/mockRepository";

export function TrainerDetailPage() {
  const { trainerId } = useParams();
  const trainer = getTrainerById(trainerId);
  useDocumentTitle(trainer ? `${trainer.name} 상세보기` : "트레이너 상세보기");

  if (!trainer) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-black text-ink">트레이너 정보를 찾을 수 없습니다</h1>
        <Link className="mt-5 inline-block rounded-md bg-ink px-4 py-3 text-sm font-black text-white" to="/jobs/seeking">
          구직글로 돌아가기
        </Link>
      </Container>
    );
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-10">
          <div className="max-w-4xl">
            <Badge tone={trainer.verifiedProfile ? "green" : "amber"}>
              {trainer.verifiedProfile ? "프로필 확인" : "확인 대기"}
            </Badge>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink sm:text-5xl">{trainer.name}</h1>
            <p className="mt-3 text-lg font-bold text-muted">{trainer.headline}</p>
            <p className="mt-5 max-w-3xl leading-8 text-muted">{trainer.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryLink to="/jobs/seeking">구직글 보기</PrimaryLink>
              <PrimaryLink to="/trainers/new" variant="light">
                트레이너 등록
              </PrimaryLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="detail-grid grid gap-6 py-8">
        <div className="space-y-6">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">프로필 정보</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBlock title="활동 지역" value={trainer.area} />
              <InfoBlock title="경력" value={`${trainer.experienceYears}년차`} />
              <InfoBlock title="희망 형태" value={trainer.desiredRoles.join(", ")} />
              <InfoBlock title="가능 시간" value={trainer.availability} />
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">포트폴리오 메모</h2>
            <ul className="mt-4 space-y-3">
              {trainer.portfolioNotes.map((note) => (
                <li className="rounded-md border border-line bg-paper p-3 text-sm font-bold text-muted" key={note}>
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">전문 분야</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {trainer.specialties.map((specialty) => (
                <Badge key={specialty}>{specialty}</Badge>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">선호 조건</h2>
            <div className="mt-4 space-y-3">
              {trainer.preferredConditions.map((condition) => (
                <p className="rounded-md bg-paper p-3 text-sm font-bold text-muted" key={condition}>
                  {condition}
                </p>
              ))}
            </div>
          </section>
        </aside>
      </Container>
    </>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-4">
      <p className="text-xs font-black uppercase text-muted">{title}</p>
      <p className="mt-2 font-bold leading-6 text-ink">{value}</p>
    </div>
  );
}

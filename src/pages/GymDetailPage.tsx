import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { RatingBreakdown } from "@/components/domain/RatingBreakdown";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getAverageRating } from "@/utils/rating";
import { getGymById, getJobsByGymId } from "@/utils/mockRepository";

export function GymDetailPage() {
  const { gymId } = useParams();
  const gym = getGymById(gymId);
  useDocumentTitle(gym ? `${gym.name} 상세보기` : "헬스장 상세보기");

  if (!gym) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl font-black text-ink">헬스장 정보를 찾을 수 없습니다</h1>
        <Link className="mt-5 inline-block rounded-md bg-ink px-4 py-3 text-sm font-black text-white" to="/jobs/hiring">
          구인글로 돌아가기
        </Link>
      </Container>
    );
  }

  const hiringJobs = getJobsByGymId(gym.id);

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <img alt={`${gym.name} 시설`} className="h-80 w-full rounded-lg object-cover shadow-soft" src={gym.heroImage} />
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={gym.verified ? "green" : "amber"}>{gym.registrationStatus}</Badge>
              <Badge>{gym.hiringStatus}</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink sm:text-5xl">{gym.name}</h1>
            <p className="mt-3 text-lg font-bold text-muted">{gym.area}</p>
            <p className="mt-5 leading-8 text-muted">{gym.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryLink to="/jobs/hiring">구인글 보기</PrimaryLink>
              <PrimaryLink to="/jobs/hiring/new" variant="light">
                구인글 등록
              </PrimaryLink>
              <PrimaryLink to="/jobs/hiring" variant="light">
                구인글 목록
              </PrimaryLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="detail-grid grid gap-6 py-8">
        <div className="space-y-6">
          <RatingBreakdown ratings={gym.ratings} />
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">공개 정보</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBlock title="주소" value={gym.address} />
              <InfoBlock title="운영 형태" value={gym.category} />
              <InfoBlock title="시설" value={gym.facilities.join(", ")} />
              <InfoBlock title="복지/지원" value={gym.benefits.join(", ")} />
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">제한 노출 리뷰</h2>
            <p className="mt-3 leading-7 text-muted">
              {gym.reviewPolicy} 현재 목업에서는 감정적인 서술보다 정산, 계약, 휴무, 영업 압박 같은 항목
              중심으로만 표시합니다.
            </p>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">이 업장의 구인 연결</h2>
            <div className="mt-4 space-y-3">
              {hiringJobs.map((job) => (
                <div className="rounded-md border border-line bg-paper p-4" key={job.id}>
                  <p className="font-black text-ink">{job.title}</p>
                  <p className="mt-2 text-sm font-bold text-muted">
                    {job.employmentType} · {job.schedule} · {job.status}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase text-muted">평균 신뢰 점수</p>
            <p className="mt-2 text-5xl font-black text-ink">{getAverageRating(gym.ratings)}</p>
            <p className="mt-3 leading-6 text-muted">{gym.contactNote}</p>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-ink">태그</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {gym.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
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

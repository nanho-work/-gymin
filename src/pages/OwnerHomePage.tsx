import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import { getJobsByGymId, gyms } from "@/utils/mockRepository";

export function OwnerHomePage() {
  useDocumentTitle("사장님 전용");
  const myCenter = gyms[0];
  const myJobs = getJobsByGymId(myCenter.id);

  return (
    <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <img
            alt={`${myCenter.name} 대표 이미지`}
            className="h-44 w-full rounded-md object-cover lg:h-full"
            src={myCenter.heroImage}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={myCenter.ownerVerified ? "green" : "amber"}>{myCenter.registrationStatus}</Badge>
              <span className="rounded-md bg-paper px-2.5 py-1 text-xs font-black text-muted">
                내 센터 정보
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{myCenter.name}</h1>
            <p className="mt-3 text-sm font-bold text-muted">
              {myCenter.area} · {myCenter.category}
            </p>
            <p className="mt-2 text-sm font-bold text-muted">{myCenter.address}</p>
            <p className="mt-4 max-w-3xl leading-7 text-muted">{myCenter.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {myCenter.tags.map((tag) => (
                <span className="rounded-md bg-paper px-3 py-2 text-xs font-black text-muted" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryLink to="/gyms/new" variant="light">
                센터 정보 수정
              </PrimaryLink>
            </div>
          </div>
        </div>
      </section>
      <aside className="h-fit rounded-lg border border-line bg-paper p-5">
        <h2 className="text-xl font-black text-ink">운영 요약</h2>
        <div className="mt-4 grid gap-3">
          <SummaryRow label="센터 상태" value={myCenter.registrationStatus} />
          <SummaryRow label="채용 상태" value={myCenter.hiringStatus} />
          <SummaryRow label="구인글" value={`${myJobs.length}건`} />
          <SummaryRow label="지원자 확인" value="다음 단계 예정" />
        </div>
      </aside>
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="green">구인글 관리</Badge>
            <h2 className="mt-3 text-xl font-black text-ink">등록한 구인글</h2>
          </div>
          <PrimaryLink to="/jobs/hiring/new">구인글 등록</PrimaryLink>
        </div>
        <div className="mt-5 grid gap-3">
          {myJobs.map((job) => (
            <div
              className="grid gap-4 rounded-md border border-line bg-paper p-4 md:grid-cols-[minmax(0,1fr)_auto]"
              key={job.id}
            >
              <div>
                <p className="font-black text-ink">{job.title}</p>
                <p className="mt-2 text-sm font-bold text-muted">
                  {job.area} · {job.employmentType} · {job.schedule}
                </p>
                <p className="mt-1 text-sm font-bold text-muted">{job.compensation}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <span className="rounded-md bg-white px-3 py-2 text-xs font-black text-muted">{job.status}</span>
                <button className="rounded-md border border-line bg-white px-3 py-2 text-xs font-black text-ink" type="button">
                  수정
                </button>
                <Link
                  className="rounded-md border border-line bg-white px-3 py-2 text-xs font-black text-ink"
                  to={`/owner/jobs/${job.id}/applicants`}
                >
                  지원자
                </Link>
                <button className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-black text-amber-800" type="button">
                  마감
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-white px-4 py-3">
      <span className="text-sm font-bold text-muted">{label}</span>
      <span className="text-sm font-black text-ink">{value}</span>
    </div>
  );
}

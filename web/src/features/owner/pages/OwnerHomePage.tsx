"use client";

import { Badge } from "@/shared/components/ui/Badge";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import Link from "next/link";
import { getJobsByGymId, gyms } from "@/shared/api/mockRepository";

export function OwnerHomePage() {
  useDocumentTitle("사장님 전용");
  const myCenter = gyms[0];
  const myJobs = getJobsByGymId(myCenter.id);

  return (
    <Container className="space-y-12 py-8">
      <section className="border-b border-line pb-10">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_260px]">
          <img
            alt={`${myCenter.name} 대표 이미지`}
            className="h-52 w-full object-cover lg:h-full"
            src={myCenter.heroImage}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={myCenter.ownerVerified ? "green" : "amber"}>{myCenter.registrationStatus}</Badge>
              <span className="text-xs font-black text-muted">내 센터 정보</span>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{myCenter.name}</h1>
            <p className="mt-3 text-sm font-bold text-muted">
              {myCenter.area} · {myCenter.category}
            </p>
            <p className="mt-2 text-sm font-bold text-muted">{myCenter.address}</p>
            <p className="mt-4 max-w-3xl leading-7 text-muted">{myCenter.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {myCenter.tags.map((tag) => (
                <span className="border-b border-line pb-1 text-xs font-black text-muted" key={tag}>
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
          <aside className="h-fit border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <h2 className="text-sm font-black text-ink">운영 요약</h2>
            <div className="mt-4 divide-y divide-line">
              <SummaryRow label="센터 상태" value={myCenter.registrationStatus} />
              <SummaryRow label="채용 상태" value={myCenter.hiringStatus} />
              <SummaryRow label="구인글" value={`${myJobs.length}건`} />
              <SummaryRow label="지원자 확인" value="다음 단계 예정" />
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="green">구인글 관리</Badge>
            <h2 className="mt-3 text-xl font-black text-ink">등록한 구인글</h2>
          </div>
            <PrimaryLink to="/jobs/hiring/new">구인글 등록</PrimaryLink>
        </div>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {myJobs.map((job) => (
            <div
              className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto]"
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
                <span className="px-1 text-xs font-black text-muted">{job.status}</span>
                <button className="border border-line bg-white px-3 py-2 text-xs font-black text-ink" type="button">
                  수정
                </button>
                <Link
                  className="border border-line bg-white px-3 py-2 text-xs font-black text-ink" href={`/owner/jobs/${job.id}/applicants`}
                >
                  지원자
                </Link>
                <button className="border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-black text-amber-800" type="button">
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
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm font-bold text-muted">{label}</span>
      <span className="text-sm font-black text-ink">{value}</span>
    </div>
  );
}

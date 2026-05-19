import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { Container } from "@/components/common/Container";
import { PrimaryLink } from "@/components/common/PrimaryLink";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { applications, getGymById, jobs, trainers } from "@/utils/mockRepository";

const myTrainer = trainers[0];
const latestJobs = jobs.slice(0, 3);
const myApplications = applications.filter((application) => application.trainerId === myTrainer.id);

export function TrainerHomePage() {
  useDocumentTitle("트레이너 홈");

  return (
    <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          <img
            alt={`${myTrainer.name} 프로필`}
            className="h-28 w-28 rounded-md object-cover"
            src={myTrainer.profileImage}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="green">내 프로필</Badge>
              <Badge tone={myTrainer.verifiedProfile ? "green" : "amber"}>
                {myTrainer.verifiedProfile ? "지원 가능" : "작성 중"}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">{myTrainer.name}</h1>
            <p className="mt-2 text-sm font-bold text-muted">
              {myTrainer.age}세 · {myTrainer.gender} · {myTrainer.residenceRegion}
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-muted">{myTrainer.headline}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <PrimaryLink to="/trainers/new" variant="light">
                프로필 수정
              </PrimaryLink>
              <PrimaryLink to="/jobs/hiring">구인글 보기</PrimaryLink>
            </div>
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-line bg-paper p-5">
        <h2 className="text-xl font-black text-ink">지원 가능 조건</h2>
        <div className="mt-4 grid gap-3">
          <StatusRow label="대표 사진" ready />
          <StatusRow label="이름" ready />
          <StatusRow label="나이/성별" ready />
          <StatusRow label="연락처" ready />
          <StatusRow label="거주지역" ready />
        </div>
      </aside>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="green">추천 구인글</Badge>
            <h2 className="mt-3 text-xl font-black text-ink">내 지역과 가까운 최신 공고</h2>
          </div>
          <PrimaryLink to="/jobs/hiring" variant="light">
            전체 보기
          </PrimaryLink>
        </div>
        <div className="mt-5 grid gap-3">
          {latestJobs.map((job) => {
            const gym = getGymById(job.gymId);

            return (
              <Link
                className="grid gap-4 rounded-md border border-line bg-paper p-4 transition hover:border-green md:grid-cols-[96px_minmax(0,1fr)_auto]"
                key={job.id}
                to={gym ? `/gyms/${gym.id}` : "/jobs/hiring"}
              >
                {gym ? (
                  <img alt={`${gym.name} 대표 사진`} className="h-20 w-full rounded-md object-cover md:w-24" src={gym.heroImage} />
                ) : null}
                <div>
                  <p className="font-black text-ink">{job.title}</p>
                  <p className="mt-2 text-sm font-bold text-muted">
                    {job.authorName} · {job.area}
                  </p>
                  <p className="mt-1 text-sm font-bold text-muted">
                    {job.employmentType} · {job.schedule}
                  </p>
                </div>
                <span className="h-fit rounded-md bg-white px-3 py-2 text-xs font-black text-muted">{job.status}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone="green">지원 현황</Badge>
            <h2 className="mt-3 text-xl font-black text-ink">내가 지원한 구인글</h2>
          </div>
          <span className="rounded-md bg-paper px-3 py-2 text-sm font-black text-muted">{myApplications.length}건</span>
        </div>
        <div className="mt-5 grid gap-3">
          {myApplications.map((application) => {
            const job = jobs.find((item) => item.id === application.jobId);

            if (!job) {
              return null;
            }

            return (
              <div className="rounded-md border border-line bg-paper p-4" key={application.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-ink">{job.title}</p>
                  <span className="rounded-md bg-white px-3 py-2 text-xs font-black text-muted">{application.status}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-muted">
                  {job.authorName} · 지원일 {application.appliedAt}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
}

function StatusRow({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-white px-4 py-3">
      <span className="text-sm font-bold text-muted">{label}</span>
      <span className={`text-xs font-black ${ready ? "text-forest" : "text-amber-800"}`}>
        {ready ? "완료" : "필요"}
      </span>
    </div>
  );
}

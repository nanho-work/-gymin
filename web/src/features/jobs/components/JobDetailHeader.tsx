import Link from "next/link";

import { Badge } from "@/shared/components/ui/Badge";
import type { JobPost } from "@/shared/types/domain";
import { formatEmploymentType, formatJobRole, formatJobStatus } from "@/shared/utils/job";
import type { JobPostRead } from "@/shared/api/serverTypes";

export function JobDetailHeader({
  canApply,
  domainJob,
  job
}: {
  canApply: boolean;
  domainJob: JobPost;
  job: JobPostRead;
}) {
  return (
    <header className="border-b border-line pb-7">
      <div className="flex flex-wrap gap-2">
        <Badge tone={canApply ? "green" : "neutral"}>{formatJobStatus(job.status)}</Badge>
        <Badge>{formatJobRole(job.job_role)}</Badge>
        <Badge>{formatEmploymentType(job.employment_type)}</Badge>
      </div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">{job.title}</h1>
          <p className="mt-3 text-sm font-bold text-muted">
            {domainJob.authorName} · {domainJob.area} · {domainJob.postedAt}
          </p>
        </div>
        {job.center_id ? (
          <Link
            className="shrink-0 text-sm font-black text-forest underline-offset-4 hover:underline"
            href={`/gyms/${job.center_id}`}
            rel="noreferrer"
            target="_blank"
          >
            센터 보기 ↗
          </Link>
        ) : null}
      </div>
    </header>
  );
}

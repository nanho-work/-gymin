import type { MetadataRoute } from "next";

import type { CenterRead, JobPostRead } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";
import { fetchPublicApi } from "@/shared/seo/serverApi";
import { getCanonicalUrl } from "@/shared/seo/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl("/"),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: getCanonicalUrl("/jobs/hiring"),
      changeFrequency: "hourly",
      priority: 0.9
    }
  ];

  const [jobsResult, centersResult] = await Promise.allSettled([
    fetchPublicApi<Page<JobPostRead>>("/jobs", {
      query: {
        page: 1,
        size: 100
      },
      revalidate: 1800
    }),
    fetchPublicApi<Page<CenterRead>>("/centers", {
      query: {
        page: 1,
        size: 100
      },
      revalidate: 3600
    })
  ]);

  const jobRoutes =
    jobsResult.status === "fulfilled"
      ? jobsResult.value.items.map((job) => ({
          url: getCanonicalUrl(`/jobs/hiring/${job.id}`),
          lastModified: new Date(job.updated_at),
          changeFrequency: "daily" as const,
          priority: job.status === "open" ? 0.8 : 0.4
        }))
      : [];

  const centerRoutes =
    centersResult.status === "fulfilled"
      ? centersResult.value.items.map((center) => ({
          url: getCanonicalUrl(`/gyms/${center.id}`),
          lastModified: new Date(center.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.7
        }))
      : [];

  return [
    ...staticRoutes,
    ...jobRoutes,
    ...centerRoutes
  ];
}

import type { CenterRead, JobPostRead } from "@/shared/api/serverTypes";
import { formatCenterIndustry, getCenterAddress } from "@/shared/utils/center";
import { formatEmploymentType, formatJobRole } from "@/shared/utils/job";
import { formatWorkDays } from "@/shared/utils/weekdays";
import { getCanonicalUrl, getSiteOrigin, siteName, truncateMetaDescription } from "@/shared/seo/site";

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: getSiteOrigin()
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: getSiteOrigin(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${getCanonicalUrl("/jobs/hiring")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function createJobPostingJsonLd(job: JobPostRead) {
  const center = job.center;
  const description = [job.description, job.support_detail, job.work_days ? `근무요일: ${formatWorkDays(job.work_days)}` : ""]
    .filter(Boolean)
    .join("\n\n");

  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: truncateMetaDescription(description, `${formatJobRole(job.job_role)} 구인글입니다.`, 5000),
    datePosted: job.published_at ?? job.created_at,
    employmentType: mapEmploymentType(job.employment_type),
    industry: center?.industry ? formatCenterIndustry(center.industry) : undefined,
    occupationalCategory: formatJobRole(job.job_role),
    hiringOrganization: {
      "@type": "Organization",
      name: center?.name ?? "GymIn 등록 시설"
    },
    jobLocation: center
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "KR",
            addressLocality: center.sigungu,
            addressRegion: center.sido,
            streetAddress: center.detail_address
          }
        }
      : undefined,
    url: getCanonicalUrl(`/jobs/hiring/${job.id}`)
  });
}

export function createCenterJsonLd(center: CenterRead) {
  const sameAs = [center.homepage_url, center.instagram_url, center.youtube_url].filter(Boolean);

  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    name: center.name,
    description: truncateMetaDescription(center.introduction, `${getCenterAddress(center)}에 위치한 ${formatCenterIndustry(center.industry)}입니다.`, 5000),
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: center.sigungu,
      addressRegion: center.sido,
      streetAddress: center.detail_address
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    url: getCanonicalUrl(`/gyms/${center.id}`)
  });
}

function mapEmploymentType(value: string) {
  if (value === "full_time") {
    return "FULL_TIME";
  }
  if (value === "part_time") {
    return "PART_TIME";
  }
  if (value === "contract") {
    return "CONTRACTOR";
  }
  if (value === "freelance") {
    return "CONTRACTOR";
  }
  return formatEmploymentType(value);
}

function removeEmptyValues<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== "")) as T;
}

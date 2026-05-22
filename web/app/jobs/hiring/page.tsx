import { HiringJobsPage } from "@/features/jobs/pages/HiringJobsPage";
import { createSeoMetadata } from "@/shared/seo/metadata";

export const metadata = createSeoMetadata({
  title: "피트니스 구인글",
  description: "지역, 업종, 센터명, 공고 제목으로 헬스·필라테스·요가·크로스핏 구인글을 검색합니다.",
  path: "/jobs/hiring"
});

export default function Page() {
  return <HiringJobsPage />;
}

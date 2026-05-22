import type { Metadata } from "next";

import { GymDetailPage } from "@/features/centers/pages/GymDetailPage";
import type { CenterRead } from "@/shared/api/serverTypes";
import { fetchPublicApi } from "@/shared/seo/serverApi";
import { createSeoMetadata } from "@/shared/seo/metadata";
import { truncateMetaDescription } from "@/shared/seo/site";
import { formatCenterIndustry, getCenterAddress } from "@/shared/utils/center";

type PageProps = {
  params: Promise<{
    gymId: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gymId } = await params;

  try {
    const center = await fetchPublicApi<CenterRead>(`/centers/${gymId}`);
    const industry = formatCenterIndustry(center.industry);

    return createSeoMetadata({
      title: `${center.name} - ${industry}`,
      description: truncateMetaDescription(
        center.introduction,
        `${getCenterAddress(center)}에 위치한 ${industry} 시설 정보와 연결된 구인글을 확인합니다.`
      ),
      path: `/gyms/${center.id}`
    });
  } catch {
    return createSeoMetadata({
      title: "피트니스 시설 상세",
      description: "피트니스 시설 정보와 연결된 구인글을 확인합니다.",
      path: `/gyms/${gymId}`
    });
  }
}

export default function Page() {
  return <GymDetailPage />;
}

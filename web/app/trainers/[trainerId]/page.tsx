import type { Metadata } from "next";

import { TrainerDetailPage } from "@/features/trainers/pages/TrainerDetailPage";
import { createNoIndexMetadata } from "@/shared/seo/metadata";

type PageProps = {
  params: Promise<{
    trainerId: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trainerId } = await params;

  return createNoIndexMetadata("트레이너 프로필", `/trainers/${trainerId}`);
}

export default function Page() {
  return <TrainerDetailPage />;
}

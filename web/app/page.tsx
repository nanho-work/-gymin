import { HomePage } from "@/features/home/pages/HomePage";
import { createSeoMetadata } from "@/shared/seo/metadata";

export const metadata = createSeoMetadata({
  title: "피트니스 구인구직 플랫폼",
  description:
    "헬스장, 필라테스 스튜디오, 요가원, 크로스핏 박스와 강사·트레이너를 연결하는 피트니스 구인구직 플랫폼입니다.",
  path: "/"
});

export default function Page() {
  return <HomePage />;
}

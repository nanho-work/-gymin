"use client";

import { Container } from "@/shared/components/ui/Container";
import { MockField } from "@/shared/components/ui/MockField";
import { BusinessVerificationPanel } from "@/features/centers/components/BusinessVerificationPanel";
import { PhotoUploadMock } from "@/features/uploads/components/PhotoUploadMock";
import regionData from "@/data/mock/regions.json";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useMemo, useState } from "react";

type Region = {
  name: string;
  children: string[];
};

const regions = regionData as Region[];
const industryCategories = ["헬스/PT", "필라테스", "요가", "크로스핏", "재활/교정", "복합 센터", "기타"];

export function GymRegisterPage() {
  useDocumentTitle("센터 등록");
  const [selectedRegion, setSelectedRegion] = useState(regions[0]?.name ?? "");
  const selectedSubRegions = useMemo(
    () => regions.find((region) => region.name === selectedRegion)?.children ?? [],
    [selectedRegion]
  );

  return (
    <Container className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form className="space-y-8">
          <PhotoUploadMock
            description="대표 사진 1장은 필수이고, 나머지 사진은 센터 상세에서 보여줄 이미지를 선택으로 등록하는 목업 UI입니다."
            optional
            requiredFirst
            slots={["대표 사진", "운동 공간", "상담 공간", "샤워/탈의실", "추가 이미지"]}
            title="센터 사진"
          />
          <SectionTitle title="기본 정보" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="센터명" placeholder="예: 피크바디짐 강남점" />
            <MockSelect
              label="시/도"
              onChange={(value) => setSelectedRegion(value)}
              options={regions.map((region) => region.name)}
              value={selectedRegion}
            />
            <MockSelect
              label={selectedRegion.includes("특별시") || selectedRegion.includes("광역시") ? "구/군" : "시/군"}
              options={selectedSubRegions}
            />
            <MockField label="상세주소" placeholder="예: 테헤란로 118, 지하 1층" />
            <MockSelect label="업종" options={industryCategories} />
            <MockField label="운영형태" placeholder="예: 1:1 PT 중심, 기구 필라테스 6:1 그룹수업, 재활운동 병행" />
          </div>

          <SectionTitle title="외부 채널" />
          <div className="grid gap-4 md:grid-cols-2">
            <MockField label="홈페이지" placeholder="예: https://peakbody.kr" />
            <MockField label="인스타그램" placeholder="예: @peakbody_gangnam" />
            <MockField label="유튜브 채널" placeholder="예: youtube.com/@peakbody" />
          </div>

          <SectionTitle title="업장 소개" />
          <MockField
            label="업장 소개"
            placeholder="센터의 분위기, 주요 수업, 공간 특징처럼 자주 바뀌지 않는 기본 소개를 적어주세요."
            textarea
          />

          <button className="bg-ink px-5 py-3 text-sm font-black text-white" type="button">
            목업 저장하기
          </button>
        </form>
        <div className="space-y-8 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <BusinessVerificationPanel />
          <aside className="border-t border-line pt-5 text-sm leading-6 text-muted">
            <h2 className="text-lg font-black text-ink">센터 정보 안내</h2>
            <p className="mt-3">
              센터 등록은 구인글에 함께 노출될 기본 정보를 준비하는 과정입니다. 사진과 인증 배지는 모두 선택
              항목입니다.
            </p>
          </aside>
        </div>
    </Container>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

function MockSelect({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      <select
        className="mt-2 h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green"
        onChange={(event) => onChange?.(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

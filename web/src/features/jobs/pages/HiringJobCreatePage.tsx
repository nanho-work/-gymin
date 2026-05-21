"use client";

import { Container } from "@/shared/components/ui/Container";
import { ImageUploadSection } from "@/features/uploads/components/ImageUploadSection";
import { useDraftUploadEntityId } from "@/features/uploads/hooks/useDraftUploadEntityId";
import { MockField } from "@/shared/components/ui/MockField";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useState } from "react";

export function HiringJobCreatePage() {
  useDocumentTitle("구인글 등록");
  const draftJobPostId = useDraftUploadEntityId();
  const [description, setDescription] = useState("");

  return (
    <Container className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form className="space-y-8">
        <SectionTitle title="구인 기본 정보" />
        <div className="grid gap-4 md:grid-cols-2">
          <MockField label="공고 제목" placeholder="예: 오픈 멤버 PT 트레이너 구인" />
          <MockSelect label="등록 센터" options={["피크바디짐 강남점", "새 센터 등록 후 선택"]} />
          <MockSelect label="모집 직무" options={["PT 트레이너", "필라테스 강사", "요가 강사", "GX 강사", "재활/교정 트레이너", "기타"]} />
          <MockSelect label="근무 형태" options={["정규직", "파트타임", "프리랜서", "스케줄 근무", "협의"]} />
        </div>
        <section className="border-y border-line py-4">
          <p className="text-sm font-black text-ink">구인글에 자동 노출되는 센터 정보</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            센터명, 지역, 대표 사진, 인증 배지 여부, 운영 형태, 센터 상세보기 링크가 함께 표시되는 구조입니다.
          </p>
        </section>

        <SectionTitle title="근무 시간" />
        <div className="grid gap-4 md:grid-cols-2">
          <MockField label="근무 시작일" placeholder="예: 2026년 6월 1일부터 / 협의 가능" />
          <MockField label="근무 요일" placeholder="예: 주 5일 스케줄 근무, 월수금, 주말 파트" />
          <MockField label="근무 시간" placeholder="예: 12:00 ~ 21:00, 면접 시 협의 가능" />
          <MockField label="휴게 시간" placeholder="예: 일 2시간 제공, 수업 사이 자유 휴게" />
        </div>

        <SectionTitle title="급여/정산" />
        <div className="grid gap-4 md:grid-cols-2">
          <MockField label="기본급" placeholder="예: 200만 원, 기본급 없음, 협의" />
          <MockSelect label="4대보험" options={["가입", "협의", "미가입", "해당 없음"]} />
          <MockField label="수업료/인센티브" placeholder="예: 의무 수업 50개 이후 재등록 60%, 워크인 50%" />
          <MockField label="정산 방식" placeholder="예: 매월 10일 정산, 고정 요율, 구간제 없음" />
        </div>

        <SectionTitle title="근무 메리트" />
        <div className="grid gap-4 md:grid-cols-2">
          <MockSelect label="매출 압박/구간제" options={["없음", "낮음", "있음", "협의/면접 안내"]} />
          <MockSelect label="회원 인계" options={["있음", "없음", "협의", "오픈 센터라 신규 배정"]} />
          <MockField label="휴가/월차" placeholder="예: 월차 1일, 1년 이상 연차 15일" />
          <MockField label="추가 지원" placeholder="예: 기존 회원 20명 인계, 교육 지원, 운동 가능" />
        </div>

        <SectionTitle title="트레이너에게 보여줄 내용" />
        <label className="block">
          <span className="text-sm font-black text-ink">상세 설명</span>
          <textarea
            className="mt-2 min-h-44 w-full border border-line bg-white px-3 py-3 text-sm outline-none transition focus:border-green"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="센터 분위기, 회원층, 수업 방식, 함께 일할 선생님에게 전하고 싶은 내용을 자유롭게 적어주세요."
            value={description}
          />
        </label>

        <ImageUploadSection
          defaultPurpose="content"
          description="공고 본문 중간에 넣을 공간 사진, 근무 환경 이미지 등을 업로드합니다. 저장 로직을 붙일 때 이 object key를 본문 이미지로 연결합니다."
          entityId={draftJobPostId}
          entityType="job_post"
          onUploaded={(image) => {
            const imageMarkdown = `![${image.slotLabel}](s3://${image.bucket}/${image.objectKey})`;
            setDescription((current) => `${current}${current.trim() ? "\n\n" : ""}${imageMarkdown}`);
          }}
          optional
          slots={["본문 이미지 1", "본문 이미지 2", "본문 이미지 3", "본문 이미지 4", "본문 이미지 5"]}
          title="본문 이미지"
        />

        <div className="flex flex-wrap gap-2">
          <button className="bg-ink px-5 py-3 text-sm font-black text-white" type="button">
            구인글 목업 등록
          </button>
          <PrimaryLink to="/jobs/hiring" variant="light">
            구인글 목록
          </PrimaryLink>
        </div>
      </form>

      <div className="space-y-8 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
        <aside className="border-t border-line pt-5">
          <h2 className="text-xl font-black text-ink">작성 흐름</h2>
          <ol className="mt-4 space-y-3 text-sm font-bold text-muted">
            <li>1. 센터 등록</li>
            <li>2. 채용 조건 작성</li>
            <li>3. 구인글 등록</li>
            <li>4. 지원자 프로필 확인</li>
          </ol>
        </aside>
        <aside className="border-t border-line pt-5 text-sm leading-6 text-muted">
          <h2 className="text-xl font-black text-ink">구조화 필드 기준</h2>
          <p className="mt-3">
            지역, 업종, 대표 사진은 센터 정보에서 자동 연결됩니다. 공고에서는 근무 시간, 급여/정산처럼 검색과
            비교에 필요한 조건을 따로 입력합니다.
          </p>
        </aside>
        <aside className="border-t border-line pt-5 text-sm leading-6 text-muted">
          <h2 className="text-xl font-black text-ink">지원은 플랫폼 안에서 처리</h2>
          <p className="mt-3">
            트레이너는 구인글 상세의 지원 버튼으로 본인 프로필을 제출합니다. 사장님은 지원자 목록에서 프로필을
            확인하는 흐름으로 연결됩니다.
          </p>
        </aside>
      </div>
    </Container>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

function MockSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      <select className="mt-2 h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

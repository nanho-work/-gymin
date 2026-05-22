"use client";

import { Container } from "@/shared/components/ui/Container";
import { MockField } from "@/shared/components/ui/MockField";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export function BusinessSignupPage() {
  useDocumentTitle("사업자 회원가입");

  return (
    <Container className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form className="space-y-6 rounded-lg border border-line bg-white p-6 shadow-sm">
        <SectionTitle title="사업자 회원가입" />
        <div className="grid gap-4 md:grid-cols-2">
          <MockField label="이름" placeholder="예: 홍길동" />
          <MockField label="연락처" placeholder="예: 010-1234-5678" />
          <MockField label="이메일" placeholder="예: owner@center.com" />
          <MockField label="비밀번호" placeholder="비밀번호 입력" type="password" />
        </div>
        <SectionTitle title="센터 기본 정보" />
        <div className="grid gap-4 md:grid-cols-2">
          <MockField label="센터명" placeholder="예: 피크바디짐 강남점" />
          <MockField label="지역" placeholder="예: 서울 강남구 역삼동" />
        </div>
        <button className="rounded-md bg-ink px-5 py-3 text-sm font-black text-white" type="button">
          사업자 회원가입
        </button>
      </form>
      <aside className="h-fit rounded-lg border border-line bg-paper p-5">
        <h2 className="text-xl font-black text-ink">가입 후 흐름</h2>
        <div className="mt-5 space-y-3">
          <PrimaryLink to="/gyms/new" variant="light">
            센터 등록
          </PrimaryLink>
        </div>
      </aside>
    </Container>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

export function JobDescriptionSection({
  description,
  supportDetail
}: {
  description: string | null;
  supportDetail: string | null;
}) {
  return (
    <section className="border-b border-line py-8">
      <h2 className="text-xl font-black text-ink">공고 내용</h2>
      <p className="mt-4 whitespace-pre-line leading-8 text-muted">
        {description || supportDetail || "상세 설명이 아직 등록되지 않았습니다."}
      </p>
    </section>
  );
}

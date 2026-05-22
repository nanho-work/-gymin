export function PaginationControls({
  hasNext,
  hasPrev,
  onPageChange,
  page,
  total,
  totalPages
}: {
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  page: number;
  total: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return (
      <p className="text-center text-sm font-bold text-muted">
        총 {total.toLocaleString("ko-KR")}개 공고
      </p>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="페이지 이동">
      <button
        className="rounded-md border border-line px-4 py-2 text-sm font-black text-ink disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        이전
      </button>
      <span className="text-sm font-black text-muted">
        {page.toLocaleString("ko-KR")} / {totalPages.toLocaleString("ko-KR")}
      </span>
      <button
        className="rounded-md border border-line px-4 py-2 text-sm font-black text-ink disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        다음
      </button>
      <span className="basis-full text-center text-xs font-bold text-muted">
        총 {total.toLocaleString("ko-KR")}개 공고
      </span>
    </nav>
  );
}

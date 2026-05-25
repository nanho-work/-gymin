import Link from "next/link";

import { INSIGHT_CATEGORIES } from "@/features/insights/constants";
import type { InsightArticle } from "@/features/insights/types";

const categoryLabels = new Map(INSIGHT_CATEGORIES.map((category) => [category.id, category.label]));

export function InsightCard({ article }: { article: InsightArticle }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs font-black text-muted">
        <span className="rounded-full bg-paper px-3 py-1 text-ink">{categoryLabels.get(article.category)}</span>
        <span>{article.sourceName}</span>
        <span>{formatDate(article.publishedAt)}</span>
        <span>{article.readTime}</span>
      </div>
      <h2 className="mt-4 text-xl font-black leading-snug tracking-tight text-ink">{article.title}</h2>
      <p className="mt-3 flex-1 text-sm font-bold leading-7 text-muted">{article.summary}</p>
      <Link className="mt-5 text-sm font-black text-ink underline-offset-4 hover:underline" href={article.href}>
        관련 화면 보기
      </Link>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00+09:00`));
}

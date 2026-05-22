export type JobInfoGridItem = {
  label: string;
  value: string;
};

export function JobInfoGrid({
  items,
  variant = "compact"
}: {
  items: JobInfoGridItem[];
  variant?: "compact" | "spacious";
}) {
  const gridClassName = variant === "compact" ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <dl className={`mt-5 grid gap-2 ${gridClassName}`}>
      {items.map((item) => (
        <div className="rounded-md border border-line bg-white px-3 py-2.5" key={item.label}>
          <dt className="text-xs font-black uppercase text-muted">{item.label}</dt>
          <dd className="mt-1 break-words text-sm font-bold leading-6 text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

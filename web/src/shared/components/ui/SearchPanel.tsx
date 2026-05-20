export function SearchPanel({
  query,
  onQueryChange,
  placeholder,
  rightSlot
}: {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          className="h-11 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-sm font-semibold outline-none transition focus:border-green"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          value={query}
        />
        {rightSlot ? <div className="flex flex-wrap gap-2">{rightSlot}</div> : null}
      </div>
    </section>
  );
}

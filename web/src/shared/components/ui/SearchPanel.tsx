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
        <label className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <SearchIcon />
          </span>
          <input
            aria-label="구인글 검색"
            autoComplete="off"
            className="h-11 w-full rounded-md border border-line bg-paper pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-green"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            type="search"
            value={query}
          />
        </label>
        {rightSlot ? <div className="flex flex-wrap gap-2">{rightSlot}</div> : null}
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`inline-grid place-items-center overflow-hidden rounded-md bg-ink ${className}`} aria-hidden="true">
      <svg className="h-full w-full" role="img" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#121514" height="64" rx="12" width="64" />
        <text
          dominantBaseline="middle"
          fill="#43d28c"
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          fontSize="29"
          fontWeight="900"
          letterSpacing="0"
          textAnchor="middle"
          x="32"
          y="34"
        >
          GI
        </text>
      </svg>
    </span>
  );
}

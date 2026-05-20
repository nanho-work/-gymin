type BadgeTone = "green" | "neutral" | "amber" | "dark";

const toneClassName: Record<BadgeTone, string> = {
  green: "border-green/20 bg-green/10 text-forest",
  neutral: "border-line bg-white text-muted",
  amber: "border-amber-300 bg-amber-50 text-amber-800",
  dark: "border-ink bg-ink text-white"
};

export function Badge({
  children,
  tone = "neutral",
  className = ""
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold ${toneClassName[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

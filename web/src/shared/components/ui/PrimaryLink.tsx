import Link from "next/link";

export function PrimaryLink({
  to,
  children,
  variant = "dark"
}: {
  to: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) {
  const className =
    variant === "dark"
      ? "border-ink bg-ink text-white hover:bg-forest"
      : "border-line bg-white text-ink hover:border-green";

  return (
    <Link className={`rounded-md border px-4 py-2.5 text-sm font-black transition ${className}`} href={to}>
      {children}
    </Link>
  );
}

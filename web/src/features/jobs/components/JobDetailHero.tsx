import Link from "next/link";

export function JobDetailHero({
  imageAlt,
  imageUrl
}: {
  imageAlt: string;
  imageUrl: string;
}) {
  return (
    <>
      <Link className="mb-5 inline-block text-sm font-black text-muted hover:text-ink" href="/jobs/hiring">
        ← 구인글 목록
      </Link>

      {imageUrl ? (
        <img alt={imageAlt} className="mb-7 h-72 w-full rounded-lg bg-paper object-cover sm:h-96" src={imageUrl} />
      ) : null}
    </>
  );
}

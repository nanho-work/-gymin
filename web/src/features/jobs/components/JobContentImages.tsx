import type { JobContentImage } from "@/features/jobs/hooks/useJobDetail";

export function JobContentImages({ images }: { images: JobContentImage[] }) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-line py-8">
      <h2 className="text-xl font-black text-ink">현장 이미지</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {images.map((image) => (
          <img alt="구인글 본문 이미지" className="h-64 w-full rounded-md bg-paper object-cover" key={image.id} src={image.url} />
        ))}
      </div>
    </section>
  );
}

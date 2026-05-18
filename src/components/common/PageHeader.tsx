import { Badge } from "@/components/common/Badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="mb-4">
              <Badge tone="green">{eyebrow}</Badge>
            </div>
          ) : null}
          <h1 className="text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-8 text-muted">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

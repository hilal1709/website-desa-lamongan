import Link from "next/link"

interface SectionHeadingProps { id?: string; eyebrow: string; title: string; description?: string; href?: string; action?: string }
export function SectionHeading({ id, eyebrow, title, description, href, action = "Lihat semua" }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
        <h2 id={id} className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>}
      </div>

      {href && (
        <Link href={href} className="inline-flex min-h-11 items-center text-sm font-bold text-emerald-700 transition hover:text-emerald-800">
          {action} <span className="ml-1">→</span>
        </Link>
      )}
    </div>
  )
}

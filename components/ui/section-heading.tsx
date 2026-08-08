import Link from "next/link"

interface SectionHeadingProps { eyebrow: string; title: string; description?: string; href?: string; action?: string }
export function SectionHeading({ eyebrow, title, description, href, action = "Lihat semua" }: SectionHeadingProps) {
  return <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-emerald-600">{eyebrow}</p><h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>{description && <p className="mt-3 text-slate-500">{description}</p>}</div>{href && <Link href={href} className="inline-flex min-h-11 items-center text-sm font-bold text-blue-600 transition hover:gap-2">{action} <span className="ml-1">→</span></Link>}</div>
}

import type { ReactNode } from "react"

type DashboardSectionHeadingProps = { eyebrow: string; title: string; description?: string; titleId: string; trailing?: ReactNode }

/** Consistent heading hierarchy for dashboard sections. */
export function DashboardSectionHeading({ eyebrow, title, description, titleId, trailing }: DashboardSectionHeadingProps) {
  return <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">{eyebrow}</p><h2 id={titleId} className="mt-1 text-xl font-black text-slate-950">{title}</h2>{description ? <p className="mt-1 text-sm font-medium text-slate-500">{description}</p> : null}</div>{trailing}</div>
}

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type AdminPageHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  backHref?: string
  backLabel?: string
  action?: React.ReactNode
}

export function AdminPageHeader({ eyebrow, title, description, backHref, backLabel = "Kembali ke dashboard", action }: AdminPageHeaderProps) {
  const titleId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-title`

  return <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {backHref ? <nav aria-label="Breadcrumb" className="mb-3"><Link href={backHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"><ArrowLeft className="size-4" aria-hidden="true" />{backLabel}</Link></nav> : null}
      <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">{eyebrow}</p>
      <h1 id={titleId} className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </header>
}

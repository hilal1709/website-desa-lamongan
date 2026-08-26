import type { ComponentType } from "react"

type ProfileSectionHeadingProps = {
  eyebrow?: string
  title: string
  icon: ComponentType<{ className?: string }>
  titleId: string
  dark?: boolean
}

export function ProfileSectionHeading({ eyebrow, title, icon: Icon, titleId, dark = false }: ProfileSectionHeadingProps) {
  const color = dark ? "text-emerald-200" : "text-emerald-700"
  return (
    <header>
      {eyebrow ? <div className={`flex min-w-0 items-center gap-3 ${color}`}><span className={`grid size-10 shrink-0 place-items-center rounded-2xl ${dark ? "bg-white/10" : "bg-emerald-100"}`}><Icon className="size-5" /></span><p className="break-words text-xs font-bold uppercase tracking-[0.14em] min-[390px]:tracking-[0.16em] sm:text-sm sm:tracking-[0.18em]">{eyebrow}</p></div> : null}
      <h2 id={titleId} className={`mt-5 break-words text-[clamp(1.75rem,8vw,2.25rem)] font-black leading-[1.08] tracking-tight ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>
    </header>
  )
}

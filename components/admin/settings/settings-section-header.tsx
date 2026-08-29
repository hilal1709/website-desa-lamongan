import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { CardDescription, CardHeader } from "@/components/ui/card"

type Tone = "emerald" | "amber" | "violet" | "sky" | "rose"

const toneClasses: Record<Tone, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  sky: "bg-sky-100 text-sky-700",
  rose: "bg-rose-100 text-rose-700",
}

export function SettingsSectionHeader({ id, icon, title, description, tone = "emerald" }: { id?: string; icon: IconSvgElement; title: string; description: string; tone?: Tone }) {
  return <CardHeader className="flex-row items-start gap-3 space-y-0 pb-5 sm:gap-4"><span data-settings-icon className={`grid size-10 shrink-0 place-items-center rounded-2xl sm:size-11 ${toneClasses[tone]}`}><HugeiconsIcon icon={icon} strokeWidth={1.8} className="size-5" aria-hidden="true" /></span><div className="min-w-0"><h2 id={id} className="break-words text-base font-black leading-none tracking-tight text-slate-950">{title}</h2><CardDescription className="mt-1.5 break-words leading-6">{description}</CardDescription></div></CardHeader>
}

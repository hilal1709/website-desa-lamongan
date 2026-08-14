import { BriefcaseBusiness, GraduationCap, Sprout, Store } from "lucide-react"

const formatter = new Intl.NumberFormat("id-ID")

export function EconomicCards({ values }: { values: { umkm: number; farmers: number; formal: number; educators: number } }) {
  const cards = [
    {
      label: "Petani & Peternak",
      value: values.farmers,
      icon: Sprout,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      badge: "Pertanian & Pangan"
    },
    {
      label: "UMKM & Wirausaha",
      value: values.umkm,
      icon: Store,
      color: "bg-amber-50 text-amber-800 border-amber-200",
      badge: "Perdagangan & Usaha"
    },
    {
      label: "Pekerja Formal / Swasta",
      value: values.formal,
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-800 border-blue-200",
      badge: "Sektor Industri & Jasa"
    },
    {
      label: "Tenaga Pendidik / Guru",
      value: values.educators,
      icon: GraduationCap,
      color: "bg-purple-50 text-purple-800 border-purple-200",
      badge: "Pendidikan Desa"
    }
  ] as const

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, badge }) => (
        <div
          key={label}
          className={`rounded-3xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${color}`}
        >
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
              <Icon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
              {badge}
            </span>
          </div>

          <p className="mt-5 text-3xl font-black tracking-tight">
            {formatter.format(value)} <span className="text-sm font-bold opacity-80">Warga</span>
          </p>
          <p className="mt-1 text-sm font-extrabold">{label}</p>
        </div>
      ))}
    </section>
  )
}

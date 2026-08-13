import { PageHero } from "@/components/ui/page-hero"

const leadership = {
  kepalaDesa: {
    name: "Ketut Priyambodo",
    title: "Kepala Desa",
    nip: "NIP. 19650812 199103 1 005",
    initials: "BS",
  },
  sekdes: {
    name: "Puguh Santoso",
    title: "Sekretaris Desa",
    nip: "NIP. 19711020 200301 2 008",
    initials: "SA",
  },
  staff: [
    { name: "Markamah", title: "Kaur Keuangan", nip: "NIP. 19820315 201001 1 012", initials: "AR" },
    { name: "Zainal Abidin", title: "Kaur Tata Usaha", nip: "NIP. 19840922 201403 2 019", initials: "NU" },
    { name: "Septi", title: "Kasi Pelayanan", nip: "NIP. 19870215 201812 2 010", initials: "DS" },
  ],
  dusun: [
    { name: "Tommy Chandra", title: "Kepala Dusun Karangpilang", initials: "KP" },
    { name: "Budi Wardoyo", title: "Kepala Dusun Dopok Sambi", initials: "SR" },
    { name: "Gatot Suparna", title: "Kepala Dusun Topang", initials: "MW" },
    { name: "Sukamto", title: "Kepala Dusun Gabang", initials: "AS" },
  ],
}

function PersonCard({
  name,
  title,
  nip,
  initials,
}: {
  name: string
  title: string
  nip?: string
  initials: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white shadow-lg shadow-emerald-600/20">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">{name}</p>
          <p className="text-sm font-medium text-emerald-700">{title}</p>
          {nip ? <p className="mt-1 text-xs text-slate-500">{nip}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default function StrukturPerangkatDesaPage() {
  return (
    <>
      <PageHero
        eyebrow="Pemerintahan"
        title="Struktur Perangkat Desa"
        description="Susunan perangkat dan pemangku jabatan desa yang menjalankan roda pemerintahan Desa Kedungrejo."
      />

      <div className="mx-auto max-w-7xl px-5 py-20">
        <div className="space-y-8">
          <div className="mx-auto max-w-xl">
            <PersonCard
              name={leadership.kepalaDesa.name}
              title={leadership.kepalaDesa.title}
              nip={leadership.kepalaDesa.nip}
              initials={leadership.kepalaDesa.initials}
            />
          </div>

          <div className="mx-auto max-w-xl">
            <PersonCard
              name={leadership.sekdes.name}
              title={leadership.sekdes.title}
              nip={leadership.sekdes.nip}
              initials={leadership.sekdes.initials}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {leadership.staff.map((person) => (
              <PersonCard
                key={person.name}
                name={person.name}
                title={person.title}
                nip={person.nip}
                initials={person.initials}
              />
            ))}
          </div>

          <div>
            <p className="mb-4 text-lg font-bold text-slate-900">Kepala Dusun</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {leadership.dusun.map((person) => (
                <PersonCard
                  key={person.name}
                  name={person.name}
                  title={person.title}
                  initials={person.initials}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

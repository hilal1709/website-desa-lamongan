import { BriefcaseBusiness, GraduationCap } from "./infographic-icons"
import { ChartCard } from "./infographic-dashboard-ui"
import { EducationChart } from "./EducationChart"
import { OccupationChart } from "./OccupationChart"

export type ResidentProfile = { educations: { label: string; total: number }[]; occupations: { label: string; total: number }[] }

export function ResidentDashboard({ profile }: { profile: ResidentProfile }) {
  const data = profile
  const educations = data.educations.map(({ label, total }) => ({ name: label, total }))
  const occupations = data.occupations.map(({ label, total }) => ({ name: label, total }))
  return <section data-infographic-motion className="mt-6" aria-labelledby="resident-dashboard-title"><header><h3 id="resident-dashboard-title" className="text-xl font-black text-slate-900">Pendidikan & Mata Pencaharian</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">Gambaran dari profil warga yang terdaftar. Total penduduk resmi tetap mengikuti data dasar dan peristiwa kependudukan.</p></header><div className="mt-5 grid gap-5 xl:grid-cols-2"><ChartCard title="Pendidikan terakhir" description="Sebaran tingkat pendidikan warga terdaftar"><GraduationCap className="mb-3 size-5 text-emerald-700" /><EducationChart data={educations} /></ChartCard><ChartCard title="Mata pencaharian" description="Distribusi sektor pekerjaan warga terdaftar"><BriefcaseBusiness className="mb-3 size-5 text-emerald-700" /><OccupationChart data={occupations} /></ChartCard></div></section>
}

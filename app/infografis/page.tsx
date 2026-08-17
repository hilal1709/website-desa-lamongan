import { Hero } from "@/components/infografis/Hero"
import { InfographicDashboard } from "@/components/infografis/infographic-dashboard"
import { supabase } from "@/lib/supabase/client"
import type { AgeGroupStat, EducationStat, InfographicStat, OccupationStat, PopulationTrend } from "@/types"

export const metadata = { title: "Infografis Desa | Kedungrejo", description: "Data kependudukan Desa Kedungrejo dalam bentuk infografis." }
export const dynamic = "force-dynamic"

export default async function InfografisPage() {
  if (!supabase) {
    return (
      <>
        <Hero />
        <main className="bg-slate-50 px-5 py-10 sm:py-14" suppressHydrationWarning>
          <div className="mx-auto max-w-7xl">
            <InfographicDashboard
              records={[]}
              ages={[]}
              education={[]}
              occupations={[]}
              trends={[]}
            />
          </div>
        </main>
      </>
    )
  }

  const [statsResult, ageResult, educationResult, occupationResult, trendResult] = await Promise.all([
    supabase.from("infographic_stats").select("*").order("year", { ascending: false }),
    supabase.from("age_group_stats").select("*"),
    supabase.from("education_stats").select("*"),
    supabase.from("occupation_stats").select("*"),
    supabase.from("population_trends").select("*").order("year", { ascending: true }),
  ])

  return (
    <>
      <Hero />
      <main className="bg-slate-50 px-5 py-10 sm:py-14" suppressHydrationWarning>
        <div className="mx-auto max-w-7xl">
          <InfographicDashboard
            records={(statsResult.data ?? []) as InfographicStat[]}
            ages={(ageResult.data ?? []) as AgeGroupStat[]}
            education={(educationResult.data ?? []) as EducationStat[]}
            occupations={(occupationResult.data ?? []) as OccupationStat[]}
            trends={(trendResult.data ?? []) as PopulationTrend[]}
          />
        </div>
      </main>
    </>
  )
}

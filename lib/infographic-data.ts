import "server-only"

import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase/client"
import type { AgeGroupStat, EducationStat, InfographicStat, OccupationStat, PopulationTrend } from "@/types"

export type InfographicData = {
  records: InfographicStat[]
  ages: AgeGroupStat[]
  education: EducationStat[]
  occupations: OccupationStat[]
  trends: PopulationTrend[]
}

const emptyData: InfographicData = { records: [], ages: [], education: [], occupations: [], trends: [] }

export const getCachedInfographicData = unstable_cache(async (): Promise<InfographicData> => {
  if (!supabase) return emptyData

  const [stats, ages, education, occupations, trends] = await Promise.all([
    supabase.from("infographic_stats").select("id,year,dusun,total_population,total_households,male,female,created_at").order("year", { ascending: false }),
    supabase.from("age_group_stats").select("id,year,dusun,age_group,total"),
    supabase.from("education_stats").select("id,year,dusun,education_level,total"),
    supabase.from("occupation_stats").select("id,year,dusun,occupation,total"),
    supabase.from("population_trends").select("id,year,total_population").order("year", { ascending: true }),
  ])

  return {
    records: (stats.data ?? []) as InfographicStat[],
    ages: (ages.data ?? []) as AgeGroupStat[],
    education: (education.data ?? []) as EducationStat[],
    occupations: (occupations.data ?? []) as OccupationStat[],
    trends: (trends.data ?? []) as PopulationTrend[],
  }
}, ["infographic-data"], { revalidate: 60, tags: ["infographic-data"] })

"use client"

import { useMemo, useState } from "react"

export interface PyramidAgeData {
  range: string
  male: number
  female: number
}

// Default Authentic Piramida Penduduk Data for Kedungrejo
export const defaultPyramidData: PyramidAgeData[] = [
  { range: "0-4 th", male: 155, female: 165 },
  { range: "5-9 th", male: 180, female: 175 },
  { range: "10-14 th", male: 210, female: 200 },
  { range: "15-19 th", male: 235, female: 220 },
  { range: "20-24 th", male: 260, female: 245 },
  { range: "25-29 th", male: 240, female: 230 },
  { range: "30-34 th", male: 215, female: 210 },
  { range: "35-39 th", male: 195, female: 190 },
  { range: "40-44 th", male: 180, female: 175 },
  { range: "45-49 th", male: 165, female: 160 },
  { range: "50-54 th", male: 145, female: 140 },
  { range: "55-59 th", male: 120, female: 125 },
  { range: "60-64 th", male: 95, female: 100 },
  { range: "65-69 th", male: 70, female: 75 },
  { range: "70-74 th", male: 45, female: 50 },
  { range: "75-79 th", male: 25, female: 30 },
  { range: "80-84 th", male: 10, female: 14 },
  { range: "85+ th", male: 5, female: 8 }
]

export function PyramidChart({ customData }: { customData?: PyramidAgeData[] }) {
  const data = customData && customData.length > 0 ? customData : defaultPyramidData
  const [hoveredRange, setHoveredRange] = useState<string | null>(null)

  // Find max count to scale bar widths relative to container width
  const maxVal = useMemo(() => {
    let max = 0
    data.forEach((d) => {
      if (d.male > max) max = d.male
      if (d.female > max) max = d.female
    })
    return max || 300
  }, [data])

  const totalMale = useMemo(() => data.reduce((sum, item) => sum + item.male, 0), [data])
  const totalFemale = useMemo(() => data.reduce((sum, item) => sum + item.female, 0), [data])
  const grandTotal = totalMale + totalFemale

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Legend & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-extrabold">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-blue-600"></span>
            <span className="text-blue-950">
              Laki-Laki ({new Intl.NumberFormat("id-ID").format(totalMale)} Jiwa)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-emerald-600"></span>
            <span className="text-emerald-950">
              Perempuan ({new Intl.NumberFormat("id-ID").format(totalFemale)} Jiwa)
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right border-t border-slate-200/60 pt-2 sm:border-0 sm:pt-0">
          <span className="text-xs font-bold text-slate-500">Total Terdata: </span>
          <span className="text-xs sm:text-sm font-black text-slate-900">
            {new Intl.NumberFormat("id-ID").format(grandTotal)} Jiwa
          </span>
        </div>
      </div>

      {/* Pyramid Visual Container (Fully Responsive Layout) */}
      <div className="space-y-1 py-1 overflow-x-auto">
        {/* Header Label Row */}
        <div className="grid grid-cols-[1fr_64px_1fr] sm:grid-cols-[1fr_80px_1fr] text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 text-center pb-2 border-b border-slate-100 min-w-[280px]">
          <div className="text-right pr-2 sm:pr-4">← Laki-Laki</div>
          <div>Usia</div>
          <div className="text-left pl-2 sm:pl-4">Perempuan →</div>
        </div>

        {/* Rows (From Older at top to Younger at bottom) */}
        {[...data].reverse().map((row) => {
          const malePercent = Math.min(100, Math.round((row.male / maxVal) * 100))
          const femalePercent = Math.min(100, Math.round((row.female / maxVal) * 100))
          const isHovered = hoveredRange === row.range

          return (
            <div
              key={row.range}
              onMouseEnter={() => setHoveredRange(row.range)}
              onMouseLeave={() => setHoveredRange(null)}
              className={`grid grid-cols-[1fr_64px_1fr] sm:grid-cols-[1fr_80px_1fr] items-center rounded-lg px-0.5 py-0.5 sm:py-1 transition min-w-[280px] ${
                isHovered ? "bg-slate-100/90" : "hover:bg-slate-50"
              }`}
            >
              {/* Male Bar (Right aligned to center axis) */}
              <div className="flex items-center justify-end pr-1.5 sm:pr-3">
                <span className="mr-1 sm:mr-2 text-[10px] sm:text-[11px] font-extrabold text-slate-700">
                  {new Intl.NumberFormat("id-ID").format(row.male)}
                </span>
                <div className="h-5 sm:h-6 w-full max-w-[220px] sm:max-w-[280px] bg-slate-100 rounded-l-md overflow-hidden flex justify-end">
                  <div
                    style={{ width: `${malePercent}%` }}
                    className="h-full bg-blue-600 rounded-l-md transition-all duration-300 flex items-center justify-start pl-1"
                  >
                    {malePercent > 40 && (
                      <span className="text-[9px] sm:text-[10px] font-black text-white">
                        {row.male}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Age Label Axis */}
              <div className="text-center">
                <span
                  className={`inline-block rounded-md px-1 sm:px-2 py-0.5 text-[10px] sm:text-xs font-black transition ${
                    isHovered
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200/80 text-slate-700"
                  }`}
                >
                  {row.range}
                </span>
              </div>

              {/* Female Bar (Left aligned from center axis) */}
              <div className="flex items-center justify-start pl-1.5 sm:pl-3">
                <div className="h-5 sm:h-6 w-full max-w-[220px] sm:max-w-[280px] bg-slate-100 rounded-r-md overflow-hidden flex justify-start">
                  <div
                    style={{ width: `${femalePercent}%` }}
                    className="h-full bg-emerald-600 rounded-r-md transition-all duration-300 flex items-center justify-end pr-1"
                  >
                    {femalePercent > 40 && (
                      <span className="text-[9px] sm:text-[10px] font-black text-white">
                        {row.female}
                      </span>
                    )}
                  </div>
                </div>
                <span className="ml-1 sm:mr-2 text-[10px] sm:text-[11px] font-extrabold text-slate-700">
                  {new Intl.NumberFormat("id-ID").format(row.female)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4 text-center text-xs text-slate-500">
        📌 <b>Cara Membaca Piramida Penduduk:</b> Grafik kiri biru menunjukkan warga laki-laki, sedangkan kanan hijau menunjukkan warga perempuan per kelompok usia 5 tahunan.
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { CloudRain, Sun, CloudLightning, Droplets, Wind, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"

export interface WeatherDay {
  date: string
  dayName: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipitation: number // in mm
  windSpeed: number // in km/h
}

export function WeatherForecast({
  onRiskChange,
  onWeatherUpdate
}: {
  onRiskChange: (level: "aman" | "waspada" | "bahaya") => void
  onWeatherUpdate?: (data: { risk: "aman" | "waspada" | "bahaya"; precipitationToday: number; weatherCode: number }) => void
}) {
  const [days, setDays] = useState<WeatherDay[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<7 | 14>(7)
  const [currentRisk, setCurrentRisk] = useState<"aman" | "waspada" | "bahaya">("aman")
  const [lastUpdated, setLastUpdated] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function fetchForecast() {
      setLoading(true)
      try {
        const response = await fetch(`/api/weather?period=${period}`)
        if (!response.ok) throw new Error("Permintaan data cuaca gagal")
        const data = await response.json()

        if (!data?.daily?.time) throw new Error("Data prakiraan cuaca tidak tersedia")

        if (active) {
          const daily = data.daily
          const parsedDays: WeatherDay[] = daily.time.map((timeStr: string, index: number) => {
            const dateObj = new Date(timeStr)
            const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
            return {
              date: timeStr,
              dayName: index === 0 ? "Hari Ini" : dayNames[dateObj.getDay()],
              weatherCode: daily.weather_code[index] ?? 0,
              tempMax: Math.round(daily.temperature_2m_max[index] ?? 30),
              tempMin: Math.round(daily.temperature_2m_min[index] ?? 24),
              precipitation: daily.precipitation_sum[index] ?? 0,
              windSpeed: Math.round(daily.wind_speed_10m_max[index] ?? 10)
            }
          })

          setDays(parsedDays)
          setLastUpdated(data.current?.time ?? new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }))
          setError("")

          // Determine overall risk level based on max precipitation in next 3 days
          const maxRainNext3 = Math.max(...parsedDays.slice(0, 3).map((d) => d.precipitation))
          let risk: "aman" | "waspada" | "bahaya" = "aman"
          if (maxRainNext3 >= 50) {
            risk = "bahaya"
          } else if (maxRainNext3 >= 20) {
            risk = "waspada"
          }

          setCurrentRisk(risk)
          onRiskChange(risk)
          if (onWeatherUpdate && parsedDays.length > 0) {
            onWeatherUpdate({
              risk,
              precipitationToday: parsedDays[0].precipitation,
              weatherCode: parsedDays[0].weatherCode
            })
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err)
        if (active) {
          setDays([])
          setError("Data cuaca realtime sedang tidak dapat diakses. Silakan coba lagi.")
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchForecast()
    const refreshInterval = window.setInterval(() => void fetchForecast(), 10 * 60 * 1000)
    return () => {
      active = false
      window.clearInterval(refreshInterval)
    }
  }, [period, onRiskChange])

  // Get Weather Icon & Label based on Open-Meteo WMO weather code
  const getWeatherInfo = (code: number, rain: number) => {
    if (code >= 95) {
      return { label: "Hujan Badai / Petir", icon: CloudLightning, color: "text-amber-600 bg-amber-50" }
    }
    if (code >= 61 || rain >= 15) {
      return { label: "Hujan Lebat", icon: CloudRain, color: "text-blue-600 bg-blue-50" }
    }
    if (code >= 51 || rain > 0) {
      return { label: "Hujan Ringan", icon: Droplets, color: "text-teal-600 bg-teal-50" }
    }
    return { label: "Cerah / Berawan", icon: Sun, color: "text-amber-500 bg-amber-50" }
  }

  return (
    <div className="space-y-6">
      {/* REALTIME ALERT BANNER AUTOMATIC FROM API */}
      <div data-disaster-motion
        className={`rounded-3xl p-6 text-white shadow-lg transition-all duration-300 ${
          currentRisk === "bahaya"
            ? "bg-gradient-to-r from-red-800 to-rose-900 border border-red-700 shadow-red-900/20"
            : currentRisk === "waspada"
            ? "bg-gradient-to-r from-amber-700 to-yellow-800 border border-amber-600 shadow-amber-900/15"
            : "bg-gradient-to-r from-emerald-800 to-teal-900 border border-emerald-700 shadow-emerald-900/15"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-md">
              {currentRisk === "bahaya" ? (
                <ShieldAlert className="h-7 w-7 text-white animate-pulse" />
              ) : currentRisk === "waspada" ? (
                <AlertTriangle className="h-7 w-7 text-yellow-200" />
              ) : (
                <CheckCircle2 className="h-7 w-7 text-emerald-200" />
              )}
            </div>

            <div>
              <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-white">
                Status BMKG dan Open Meteo Kedungrejo
              </span>
              <h3 className="mt-1 text-2xl font-black tracking-tight">
                {currentRisk === "bahaya"
                  ? "Siaga Banjir: Curah Hujan Tinggi Diprakirakan"
                  : currentRisk === "waspada"
                  ? "Waspada Cuaca: Potensi Hujan Lebat di Wilayah Modo"
                  : "Kondisi Aman: Cuaca Normal Berawan"}
              </h3>
              <p className="mt-1 text-sm text-white/90 leading-relaxed">
                {currentRisk === "bahaya"
                  ? "Peringatan Dini: Curah hujan diperkirakan melebihi 50mm. Warga di bantaran alur sungai Dusun Gabang & Dopok Sambi dihimbau amankan barang berharga."
                  : currentRisk === "waspada"
                  ? "Diprakirakan terjadi hujan sedang hingga lebat. Warga dihimbau mengecek saluran drainase & mempersiapkan perlengkapan siaga bencana."
                  : "Kondisi cuaca terkendali. Tidak ada indikasi bahaya banjir dalam 24 jam ke depan."}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right sm:border-l sm:border-white/20 sm:pl-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">Diperbarui Otomatis</p>
            <p className="text-xs font-black text-white mt-0.5">{lastUpdated ? `Data ${lastUpdated.replaceAll("-", "/")}` : "Memuat data realtime"}</p>
          </div>
        </div>
      </div>

      {/* FORECAST PERIOD SELECTOR & CARDS */}
      <div data-disaster-motion className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Prakiraan Cuaca & Curah Hujan Kedungrejo</h3>
            <p className="text-xs text-slate-500 font-medium">
              Data proyeksi hujan (mm) & suhu udara per hari dari stasiun meteorologi terdekat.
            </p>
          </div>

          {/* Filter Period Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Periode:</span>
            <button
              onClick={() => setPeriod(7)}
              className={`rounded-2xl px-3.5 py-2 text-xs font-extrabold transition ${
                period === 7 ? "bg-emerald-800 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              7 Hari Ke Depan
            </button>
            <button
              onClick={() => setPeriod(14)}
              className={`rounded-2xl px-3.5 py-2 text-xs font-extrabold transition ${
                period === 14 ? "bg-emerald-800 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              14 Hari (2 Minggu)
            </button>
          </div>
        </div>

        {/* Forecast Days Cards */}
        {loading ? (
          <div className="flex h-40 items-center justify-center text-slate-400">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="ml-2 text-sm font-bold">Mengambil data cuaca BMKG dan Open Meteo...</span>
          </div>
        ) : error ? (
          <p className="py-10 text-center text-sm font-semibold text-rose-700">{error}</p>
        ) : (
          <div className="mt-5 grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 overflow-x-auto">
            {days.map((day) => {
              const info = getWeatherInfo(day.weatherCode, day.precipitation)
              const Icon = info.icon

              return (
                <div data-disaster-motion
                  key={day.date}
                  className={`flex flex-col justify-between rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-md ${
                    day.precipitation >= 50
                      ? "border-rose-300 bg-rose-50/50"
                      : day.precipitation >= 20
                      ? "border-amber-300 bg-amber-50/40"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-black uppercase text-slate-500">{day.dayName}</span>
                    <p className="text-[10px] text-slate-400">{day.date.replaceAll("-", "/")}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <div className={`grid h-8 w-8 place-items-center rounded-xl ${info.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{info.label}</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-200/80 pt-3 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Curah Hujan:</span>
                      <span className={day.precipitation >= 20 ? "text-rose-700 font-extrabold" : "text-emerald-800"}>
                        {day.precipitation} mm
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Suhu:</span>
                      <span className="font-bold">{day.tempMin}° hingga {day.tempMax}°C</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

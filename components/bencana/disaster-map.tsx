"use client"

import { useEffect, useState } from "react"
import { DisasterMapPinIcon } from "@/components/bencana/disaster-icons"
import { Button } from "@/components/ui/button"
import type { DisasterLocation, DisasterRiskLevel } from "@/components/bencana/disaster-types"

export function DisasterMap({ riskLevel }: { riskLevel: DisasterRiskLevel }) {
  const [isClient, setIsClient] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "evakuasi" | "rawan" | "posko">("all")
  const [tileType, setTileType] = useState<"street" | "satellite">("street")
  const [locations, setLocations] = useState<DisasterLocation[]>([])
  const [locationsError, setLocationsError] = useState("")

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadLocations = async () => {
      try {
        const response = await fetch("/api/bencana", { cache: "no-store" })
        if (!response.ok) throw new Error("Gagal memuat titik peta")
        const data = await response.json() as { locations?: DisasterLocation[] }
        if (!cancelled) {
          setLocations(data.locations ?? [])
          setLocationsError("")
        }
      } catch {
        if (!cancelled) setLocationsError("Titik peta belum tersedia.")
      }
    }

    void loadLocations()
    const refreshFromRealtimeEvent = (event: Event) => {
      if ((event as CustomEvent<{ topic?: string }>).detail?.topic === "disaster") void loadLocations()
    }
    window.addEventListener("cms-content-updated", refreshFromRealtimeEvent)
    const refresh = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadLocations()
    }, 5 * 60_000)
    return () => { cancelled = true; window.removeEventListener("cms-content-updated", refreshFromRealtimeEvent); window.clearInterval(refresh) }
  }, [])

  if (!isClient) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/70 p-4 text-slate-500 sm:h-[480px] sm:rounded-3xl sm:p-6">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-3 text-xs sm:text-sm font-semibold">Memuat Peta Interaktif Bencana Kedungrejo...</p>
        </div>
      </div>
    )
  }

  // Load Leaflet dynamically on client side
  const L = require("leaflet")
  import("leaflet/dist/leaflet.css")

  return (
    <LeafletMapContainer
      riskLevel={riskLevel}
      filterType={filterType}
      setFilterType={setFilterType}
      tileType={tileType}
      setTileType={setTileType}
      locations={locations}
      locationsError={locationsError}
      L={L}
    />
  )
}

function LeafletMapContainer({
  riskLevel,
  filterType,
  setFilterType,
  tileType,
  setTileType,
  locations,
  locationsError,
  L
}: {
  riskLevel: DisasterRiskLevel
  filterType: "all" | "evakuasi" | "rawan" | "posko"
  setFilterType: (val: "all" | "evakuasi" | "rawan" | "posko") => void
  tileType: "street" | "satellite"
  setTileType: (val: "street" | "satellite") => void
  locations: DisasterLocation[]
  locationsError: string
  L: any
}) {
  useEffect(() => {
    // Fix default marker icon assets in Leaflet Next.js
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
    })

    const mapElement = document.getElementById("kedungrejo-disaster-map")
    if (!mapElement) return

    // Avoid double initialization
    if ((mapElement as any)._leaflet_id) {
      return
    }

    // Exact Coordinates matching village profile: Desa Kedungrejo, Kec. Modo, Kab. Lamongan (-7.1571, 112.1593)
    const kedungrejoCenter: [number, number] = [-7.1571, 112.1593]
    const map = L.map("kedungrejo-disaster-map", {
      center: kedungrejoCenter,
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false
    })

    if (tileType === "satellite") {
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri"
      }).addTo(map)
    } else {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
    }

    const locationType = { EVAKUASI: { filter: "evakuasi", color: "#2563eb" }, RAWAN: { filter: "rawan", color: "#dc2626" }, POSKO: { filter: "posko", color: "#059669" } } as const

    // Custom Icon Generator
    const createCustomIcon = (color: string) =>
      L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })

    // Add flood risk circle layer over Kedungrejo area
    const riskCircleColor = riskLevel === "bahaya" ? "#ef4444" : riskLevel === "waspada" ? "#f59e0b" : "#10b981"
    L.circle(kedungrejoCenter, {
      color: riskCircleColor,
      fillColor: riskCircleColor,
      fillOpacity: 0.18,
      radius: 900
    }).addTo(map).bindPopup(`<b>Zona Pemantauan Desa Kedungrejo</b><br>Kecamatan Modo, Kabupaten Lamongan<br>Status: <span style="text-transform: uppercase; font-weight: bold; color: ${riskCircleColor}">${riskLevel}</span>`)

    // Filter & Add Markers
    locations.forEach((loc) => {
      const details = locationType[loc.type]
      if (filterType !== "all" && details.filter !== filterType) return

      const marker = L.marker([loc.latitude, loc.longitude] as [number, number], {
        icon: createCustomIcon(details.color)
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 2px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0f172a;">${loc.name}</h4>
          ${loc.description ? `<p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.4;">${loc.description}</p>` : ""}
        </div>
      `)
    })

    return () => {
      map.remove()
    }
  }, [riskLevel, filterType, tileType, locations, L])

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Desa+Kedungrejo+Kecamatan+Modo+Kabupaten+Lamongan"

  return (
    <section className="space-y-3 sm:space-y-4" aria-label="Peta interaktif lokasi bencana">
      <nav data-disaster-motion data-motion-kind="map" aria-label="Filter titik peta" className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between sm:p-3.5">
        <div className="min-w-0">
          <span className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-500 sm:mb-0 sm:inline sm:text-xs">Filter Marker:</span>
          <div className="grid grid-cols-2 gap-1 sm:mt-2 sm:flex sm:flex-wrap sm:gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={filterType === "all" ? "default" : "secondary"}
              onClick={() => setFilterType("all")}
              aria-pressed={filterType === "all"}
              className={filterType === "all" ? "w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto" : "w-full text-[11px] sm:w-auto sm:text-xs"}
            >
              Semua
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filterType === "evakuasi" ? "default" : "outline"}
              onClick={() => setFilterType("evakuasi")}
              aria-pressed={filterType === "evakuasi"}
              className={filterType === "evakuasi" ? "w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto" : "w-full border-blue-100 bg-blue-50 text-[11px] text-blue-800 hover:bg-blue-100 sm:w-auto sm:text-xs"}
            >
              Evakuasi
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filterType === "rawan" ? "default" : "outline"}
              onClick={() => setFilterType("rawan")}
              aria-pressed={filterType === "rawan"}
              className={filterType === "rawan" ? "w-full bg-rose-600 text-white hover:bg-rose-700 sm:w-auto" : "w-full border-rose-100 bg-rose-50 text-[11px] text-rose-800 hover:bg-rose-100 sm:w-auto sm:text-xs"}
            >
              Zona Rawan
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filterType === "posko" ? "default" : "outline"}
              onClick={() => setFilterType("posko")}
              aria-pressed={filterType === "posko"}
              className={filterType === "posko" ? "w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto" : "w-full text-[11px] sm:w-auto sm:text-xs"}
            >
              Posko Desa
            </Button>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 border-t border-slate-100 pt-2 lg:w-auto lg:border-0 lg:pt-0">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setTileType(tileType === "street" ? "satellite" : "street")}
            aria-label={tileType === "street" ? "Ubah ke tampilan satelit" : "Ubah ke tampilan peta jalan"}
            className="w-full border border-slate-200 bg-slate-50 text-[11px] text-slate-700 hover:bg-slate-100 sm:text-xs"
          >
            {tileType === "street" ? "Satelit" : "Peta Jalan"}
          </Button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-xl bg-emerald-600 px-2 py-1.5 text-[11px] font-extrabold text-white shadow-sm transition hover:bg-emerald-700 sm:px-3 sm:text-xs"
          >
            <DisasterMapPinIcon className="h-3.5 w-3.5" />
            <span>Google Maps</span>
          </a>
        </div>
      </nav>

      <figure data-disaster-motion data-motion-kind="map" className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-md sm:rounded-3xl">
        <div id="kedungrejo-disaster-map" role="application" aria-label="Peta lokasi bencana Desa Kedungrejo" className="z-0 h-[320px] w-full sm:h-[440px] lg:h-[480px]" />

        <figcaption data-disaster-float className="absolute bottom-2 left-2 z-[400] max-w-[calc(100%-1rem)] rounded-xl border border-slate-200/90 bg-white/95 p-2.5 shadow-lg backdrop-blur-md sm:bottom-3 sm:left-3 sm:max-w-xs sm:rounded-2xl sm:p-3">
          <div className="space-y-1 text-[11px] sm:text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="truncate">Balai Desa / Posko</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0"></span>
              <span className="truncate">Jalur Evakuasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600 shrink-0"></span>
              <span className="truncate">Zona Rawan Genangan</span>
            </div>
          </div>
        </figcaption>
      </figure>
      {locationsError ? <p className="text-sm font-medium text-slate-500" role="status">{locationsError}</p> : null}
    </section>
  )
}

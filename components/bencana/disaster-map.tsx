"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

export function DisasterMap({ riskLevel }: { riskLevel: "aman" | "waspada" | "bahaya" }) {
  const [isClient, setIsClient] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "evakuasi" | "rawan" | "posko">("all")
  const [tileType, setTileType] = useState<"street" | "satellite">("street")

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex h-[360px] sm:h-[480px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-100/70 p-6 text-slate-500">
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
  L
}: {
  riskLevel: "aman" | "waspada" | "bahaya"
  filterType: "all" | "evakuasi" | "rawan" | "posko"
  setFilterType: (val: "all" | "evakuasi" | "rawan" | "posko") => void
  tileType: "street" | "satellite"
  setTileType: (val: "street" | "satellite") => void
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

    // Disaster points & Locations in Kedungrejo Modo Lamongan
    const locations = [
      {
        name: "Balai Desa Kedungrejo (Posko Utama)",
        coords: [-7.1571, 112.1593],
        type: "posko",
        desc: "Pusat Koordinasi Penanggulangan Bencana & Pengungsian Utama Desa Kedungrejo",
        color: "#059669"
      },
      {
        name: "Titik Evakuasi 1 - SDN Kedungrejo",
        coords: [-7.1555, 112.1575],
        type: "evakuasi",
        desc: "Lokasi Pengungsian Sementara & Dapur Umum Warga Dusun Topang",
        color: "#2563eb"
      },
      {
        name: "Titik Evakuasi 2 - Lapangan Desa Kedungrejo",
        coords: [-7.1585, 112.1610],
        type: "evakuasi",
        desc: "Posko Darurat & Penampungan Logistik Dusun Karangpilang",
        color: "#2563eb"
      },
      {
        name: "Zona Rawan Genangan Dusun Gabang",
        coords: [-7.1600, 112.1550],
        type: "rawan",
        desc: "Wilayah dataran rendah persawahan — Rawan genangan air hujan lebat",
        color: "#dc2626"
      },
      {
        name: "Zona Rawan Genangan Dusun Dopok Sambi",
        coords: [-7.1530, 112.1620],
        type: "rawan",
        desc: "Area alur anak sungai — Waspada luapan saat hujan deras berturut-turut",
        color: "#d97706"
      },
      {
        name: "Poskesdes Kedungrejo / Pustu Modo",
        coords: [-7.1565, 112.1600],
        type: "posko",
        desc: "Layanan Pertolongan Pertama & Kesehatan Darurat Bencana Desa",
        color: "#16a34a"
      }
    ]

    // Custom Icon Generator
    const createCustomIcon = (color: string) =>
      L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">📍</div>`,
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
      if (filterType !== "all" && loc.type !== filterType) return

      const marker = L.marker(loc.coords as [number, number], {
        icon: createCustomIcon(loc.color)
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 2px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0f172a;">${loc.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.4;">${loc.desc}</p>
          <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: ${loc.color};">
            Kedungrejo, Modo (-7.1571, 112.1593)
          </div>
        </div>
      `)
    })

    return () => {
      map.remove()
    }
  }, [riskLevel, filterType, tileType, L])

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Desa+Kedungrejo+Kecamatan+Modo+Kabupaten+Lamongan"

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Map Filter Controls (Fully Responsive for Mobile) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-3 sm:p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 w-full sm:w-auto">Filter Marker:</span>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold transition ${
                filterType === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType("evakuasi")}
              className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold transition ${
                filterType === "evakuasi" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              🛡️ Evakuasi
            </button>
            <button
              onClick={() => setFilterType("rawan")}
              className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold transition ${
                filterType === "rawan" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              ⚠️ Zona Rawan
            </button>
            <button
              onClick={() => setFilterType("posko")}
              className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold transition ${
                filterType === "posko" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              🏢 Posko Desa
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
          <button
            onClick={() => setTileType(tileType === "street" ? "satellite" : "street")}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            {tileType === "street" ? "🛰️ Satelit" : "🗺️ Peta Jalan"}
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] sm:text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-md">
        <div id="kedungrejo-disaster-map" className="h-[360px] sm:h-[480px] w-full z-0" />

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] max-w-[220px] sm:max-w-xs rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-lg backdrop-blur-md">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">Peta Kedungrejo (Modo)</p>
          <div className="mt-1.5 space-y-1 text-[11px] sm:text-xs font-bold text-slate-700">
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
        </div>
      </div>
    </div>
  )
}

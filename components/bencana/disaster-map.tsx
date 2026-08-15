"use client"

import { useEffect, useState } from "react"
import { MapPin, AlertTriangle, ShieldCheck, Info, Navigation, Building2, Home } from "lucide-react"

// Dynamic import for Leaflet to avoid SSR issues in Next.js
export function DisasterMap({ riskLevel }: { riskLevel: "aman" | "waspada" | "bahaya" }) {
  const [isClient, setIsClient] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "evakuasi" | "rawan" | "posko">("all")

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex h-[480px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-100/70 p-6 text-slate-500">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-3 text-sm font-semibold">Memuat Peta Interaktif Bencana Kedungrejo...</p>
        </div>
      </div>
    )
  }

  // Load Leaflet dynamically on client side
  const L = require("leaflet")
  import("leaflet/dist/leaflet.css")

  return <LeafletMapContainer riskLevel={riskLevel} filterType={filterType} setFilterType={setFilterType} L={L} />
}

function LeafletMapContainer({
  riskLevel,
  filterType,
  setFilterType,
  L
}: {
  riskLevel: "aman" | "waspada" | "bahaya"
  filterType: "all" | "evakuasi" | "rawan" | "posko"
  setFilterType: (val: "all" | "evakuasi" | "rawan" | "posko") => void
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

    const kedungrejoCenter: [number, number] = [-7.1705, 111.9742]
    const map = L.map("kedungrejo-disaster-map", {
      center: kedungrejoCenter,
      zoom: 14,
      zoomControl: true
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Disaster points & Locations
    const locations = [
      {
        name: "Balai Desa Kedungrejo (Posko Utama)",
        coords: [-7.1705, 111.9742],
        type: "posko",
        desc: "Pusat Koordinasi Penanggulangan Bencana & Pengungsian Utama Desa",
        color: "#059669"
      },
      {
        name: "Titik Evakuasi 1 - SDN Kedungrejo",
        coords: [-7.168, 111.972],
        type: "evakuasi",
        desc: "Lokasi Pengungsian Sementara & Dapur Umum Warga Dusun Topang",
        color: "#2563eb"
      },
      {
        name: "Titik Evakuasi 2 - Lapangan Karangpilang",
        coords: [-7.173, 111.978],
        type: "evakuasi",
        desc: "Posko Darurat & Penampungan Logistik Dusun Karangpilang",
        color: "#2563eb"
      },
      {
        name: "Zona Rawan Genangan Dusun Gabang",
        coords: [-7.176, 111.97],
        type: "rawan",
        desc: "Wilayah dataran rendah dekat persawahan — Rawan genangan luapan air hujan lebat",
        color: "#dc2626"
      },
      {
        name: "Zona Rawan Genangan Dusun Dopok Sambi",
        coords: [-7.165, 111.977],
        type: "rawan",
        desc: "Area alur anak sungai — Waspada luapan saat hujan deras berturut-turut",
        color: "#d97706"
      },
      {
        name: "Puskesmas Pembantu / Poskesdes Modo",
        coords: [-7.171, 111.976],
        type: "posko",
        desc: "Layanan Pertolongan Pertama & Kesehatan Darurat Bencana",
        color: "#16a34a"
      }
    ]

    // Custom Icon Generator
    const createCustomIcon = (color: string, label: string) =>
      L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; items-center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })

    // Add flood risk circle layer over Kedungrejo area
    const riskCircleColor = riskLevel === "bahaya" ? "#ef4444" : riskLevel === "waspada" ? "#f59e0b" : "#10b981"
    L.circle(kedungrejoCenter, {
      color: riskCircleColor,
      fillColor: riskCircleColor,
      fillOpacity: 0.18,
      radius: 1200
    }).addTo(map).bindPopup(`<b>Zona Pemantauan Bencana Kedungrejo</b><br>Status Wilayah: <span style="text-transform: uppercase; font-weight: bold; color: ${riskCircleColor}">${riskLevel}</span>`)

    // Filter & Add Markers
    locations.forEach((loc) => {
      if (filterType !== "all" && loc.type !== filterType) return

      const marker = L.marker(loc.coords as [number, number], {
        icon: createCustomIcon(loc.color, loc.name)
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #0f172a;">${loc.name}</h4>
          <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.4;">${loc.desc}</p>
          <div style="margin-top: 8px; font-size: 11px; font-weight: 700; color: ${loc.color};">
            Koordinat: ${loc.coords[0]}, ${loc.coords[1]}
          </div>
        </div>
      `)
    })

    return () => {
      map.remove()
    }
  }, [riskLevel, filterType, L])

  return (
    <div className="space-y-4">
      {/* Map Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Filter Marker:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filterType === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Semua Titik
            </button>
            <button
              onClick={() => setFilterType("evakuasi")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filterType === "evakuasi" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              🛡️ Evakuasi / Shelter
            </button>
            <button
              onClick={() => setFilterType("rawan")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filterType === "rawan" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              ⚠️ Zona Rawan Genangan
            </button>
            <button
              onClick={() => setFilterType("posko")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filterType === "posko" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              🏢 Posko & Kesehatan
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span>Kecamatan Modo, Kab. Lamongan</span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-md">
        <div id="kedungrejo-disaster-map" className="h-[460px] w-full z-0" />

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] max-w-xs rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Keterangan Peta</p>
          <div className="mt-2 space-y-1.5 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-600"></span>
              <span>Posko Utama Balai Desa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600"></span>
              <span>Jalur & Titik Evakuasi</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-600"></span>
              <span>Wilayah Rawan Luapan Air</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

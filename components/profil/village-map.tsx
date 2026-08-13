"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"

declare global { interface Window { L?: any } }

export function VillageMap() {
  const mapElement = useRef<HTMLDivElement>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Desa+Kedungrejo+Kecamatan+Modo+Kabupaten+Lamongan"

  useEffect(() => {
    if (!leafletLoaded || !mapElement.current || !window.L) return

    const leaflet = window.L
    const map = leaflet.map(mapElement.current, { scrollWheelZoom: false, zoomControl: true })
    leaflet.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" }).addTo(map)
    map.setView([-7.1571, 112.1593], 16)
    return () => map.remove()
  }, [leafletLoaded])

  return <section className="relative z-0 mt-12 pt-2">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Peta wilayah</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">Peta satelit Desa Kedungrejo</h2>
        <p className="mt-3 max-w-2xl text-slate-600">Tampilan satelit area Desa Kedungrejo, Kecamatan Modo, Kabupaten Lamongan.</p>
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
      >
        Buka di Google Maps
      </a>
    </div>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="afterInteractive" onLoad={() => setLeafletLoaded(true)}/>
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-900/20"><div ref={mapElement} className="h-[500px] w-full sm:h-[620px]"/></div>
  </section>
}

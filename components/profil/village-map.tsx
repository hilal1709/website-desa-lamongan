"use client"

import { useEffect, useRef, useState } from "react"
import villageBoundary from "@/data/kedungrejo-boundary.json"

declare global { interface Window { L?: any } }

const leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
const leafletScriptUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
let leafletLoader: Promise<void> | undefined

function loadLeaflet() {
  if (window.L) return Promise.resolve()
  if (leafletLoader) return leafletLoader

  leafletLoader = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-leaflet-css="true"]')) {
      const stylesheet = document.createElement("link")
      stylesheet.rel = "stylesheet"
      stylesheet.href = leafletCssUrl
      stylesheet.dataset.leafletCss = "true"
      document.head.appendChild(stylesheet)
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-leaflet-script="true"]')
    const script = existingScript ?? document.createElement("script")
    const onLoad = () => window.L ? resolve() : reject(new Error("Leaflet tidak tersedia."))
    const onError = () => reject(new Error("Gagal memuat Leaflet."))

    script.addEventListener("load", onLoad, { once: true })
    script.addEventListener("error", onError, { once: true })

    if (!existingScript) {
      script.src = leafletScriptUrl
      script.async = true
      script.dataset.leafletScript = "true"
      document.body.appendChild(script)
    }
  })

  return leafletLoader
}

const hamletReferences = [
  { name: "Dusun Gabang", coordinates: [-7.1546075, 112.1528825] as [number, number], color: "#d97706" },
  { name: "Dusun Topang", coordinates: [-7.1595375, 112.1525675] as [number, number], color: "#7c3aed" },
  { name: "Dusun Dopok Sambi", coordinates: [-7.1597625, 112.1579375] as [number, number], color: "#059669" },
  { name: "Dusun Karangpilang", coordinates: [-7.1620325, 112.1651925] as [number, number], color: "#2563eb" },
]

interface VillageMapProps {
  eyebrow: string
  title: string
  description: string
  action: string
  href: string
}

export function VillageMap({ eyebrow, title, description, action, href }: VillageMapProps) {
  const sectionElement = useRef<HTMLElement>(null)
  const mapElement = useRef<HTMLDivElement>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [shouldLoadMap, setShouldLoadMap] = useState(false)
  const [mapLoadError, setMapLoadError] = useState(false)

  useEffect(() => {
    const section = sectionElement.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoadMap(true)
        observer.disconnect()
      },
      { rootMargin: "360px 0px" },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoadMap) return

    let cancelled = false
    void loadLeaflet()
      .then(() => { if (!cancelled) setLeafletLoaded(true) })
      .catch(() => { if (!cancelled) setMapLoadError(true) })

    return () => { cancelled = true }
  }, [shouldLoadMap])

  useEffect(() => {
    if (!leafletLoaded || !mapElement.current || !window.L) return

    const leaflet = window.L
    const map = leaflet.map(mapElement.current, { scrollWheelZoom: false, zoomControl: true })
    const tiles = leaflet.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri" }).addTo(map)
    const boundary = leaflet.geoJSON(villageBoundary, {
      style: {
        color: "#facc15",
        weight: 3,
        opacity: 1,
        fillColor: "#22c55e",
        fillOpacity: 0.14,
      },
    }).addTo(map)
    boundary.bindTooltip("Batas Desa Kedungrejo", { sticky: true, direction: "center", className: "font-semibold" })
    boundary.bindPopup("<strong>Batas Desa Kedungrejo</strong><br/>Kecamatan Modo, Kabupaten Lamongan<br/><small>Dataset BIG edisi September 2023</small>")
    map.fitBounds(boundary.getBounds(), { padding: [32, 32], maxZoom: 15 })

    hamletReferences.forEach((hamlet) => {
      leaflet.circleMarker(hamlet.coordinates, {
        radius: 8,
        color: "#ffffff",
        weight: 2,
        fillColor: hamlet.color,
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip(hamlet.name, { permanent: true, direction: "top", offset: [0, -8], className: "village-map-hamlet-label" })
        .bindPopup(`<strong>${hamlet.name}</strong><br/><small>Titik referensi berdasarkan lokasi Google Maps yang diberikan Pemerintah Desa.</small>`)
    })

    const invalidateSize = () => map.invalidateSize({ pan: false })
    const animationFrame = requestAnimationFrame(invalidateSize)
    const delayedInvalidation = window.setTimeout(invalidateSize, 250)
    const resizeObserver = new ResizeObserver(invalidateSize)
    resizeObserver.observe(mapElement.current)
    window.addEventListener("resize", invalidateSize)
    tiles.on("load", invalidateSize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.clearTimeout(delayedInvalidation)
      resizeObserver.disconnect()
      window.removeEventListener("resize", invalidateSize)
      tiles.off("load", invalidateSize)
      map.remove()
    }
  }, [leafletLoaded])

  return <section ref={sectionElement} className="relative z-0 mt-10 pt-2 sm:mt-12">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 sm:text-sm sm:tracking-wider">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 sm:w-auto"
      >
        {action}
      </a>
    </div>
    <div className="mt-5 flex flex-wrap gap-2" aria-label="Keterangan peta">
      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">Garis kuning: batas Desa Kedungrejo (BIG, September 2023)</span>
      {hamletReferences.map((hamlet) => (
        <span key={hamlet.name} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hamlet.color }} />
          {hamlet.name.replace("Dusun ", "")}
        </span>
      ))}
    </div>
    <style>{`.village-map-hamlet-label { border: 0; border-radius: 9999px; background: rgba(15, 23, 42, 0.88); color: white; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.24); font-weight: 700; padding: 5px 8px; } .village-map-hamlet-label::before { display: none; }`}</style>
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-900/20">
      {shouldLoadMap && !mapLoadError ? <div ref={mapElement} aria-label="Peta satelit Desa Kedungrejo" className="h-[340px] w-full sm:h-[500px] lg:h-[620px]"/> : <div className="flex h-[340px] w-full items-center justify-center bg-[linear-gradient(120deg,#e2e8f0,#f8fafc,#d1fae5)] p-6 text-center text-sm font-semibold text-slate-500 sm:h-[500px] lg:h-[620px]" aria-label={mapLoadError ? "Peta tidak dapat dimuat" : "Memuat peta desa"}>{mapLoadError ? "Peta belum dapat dimuat. Periksa koneksi internet Anda." : <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />}</div>}
    </div>
  </section>
}

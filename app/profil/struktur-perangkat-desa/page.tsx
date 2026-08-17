"use client"

import { useState } from "react"
import { PageHero } from "@/components/ui/page-hero"
import {
  ImageIcon,
  Maximize2,
  Download,
  X
} from "lucide-react"

export default function StrukturPerangkatDesaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <PageHero
        eyebrow="Profil Desa"
        title="Struktur Perangkat Desa"
        description="Bagan resmi Pemerintah Desa Kedungrejo."
      />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            {/* Card Header Bar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900">Bagan Struktur Organisasi</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-emerald-800"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span>Perbesar Gambar</span>
                </button>
                <a
                  href="/images/struktur-organisasi.png"
                  download="Struktur-Organisasi-Desa-Kedungrejo.png"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh Gambar</span>
                </a>
              </div>
            </div>

            {/* Card Body - Clean Static Image Display (No Blur/Hover Overlay) */}
            <div className="p-4 sm:p-8 bg-slate-50/50">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img
                  src="/images/struktur-organisasi.png"
                  alt="Struktur Organisasi dan Tata Kerja Pemerintah Desa Kedungrejo"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FULLSCREEN MODAL FOR DIAGRAM IMAGE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-h-[95vh] max-w-[95vw] overflow-auto rounded-3xl border border-white/20 bg-slate-900 p-2 sm:p-4 shadow-2xl">
            {/* Modal Close & Download Buttons */}
            <div className="sticky top-2 right-2 z-10 flex items-center justify-end gap-2 pb-2">
              <a
                href="/images/struktur-organisasi.png"
                download="Struktur-Organisasi-Desa-Kedungrejo.png"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-500"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Gambar</span>
              </a>
              <button
                onClick={() => setIsModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/struktur-organisasi.png"
                alt="Bagan Struktur Organisasi Desa Kedungrejo Full"
                className="w-full h-auto max-h-[85vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

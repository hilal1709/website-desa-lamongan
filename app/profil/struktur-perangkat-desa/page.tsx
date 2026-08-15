"use client"

import { useState } from "react"
import { PageHero } from "@/components/ui/page-hero"
import {
  Building2,
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
        eyebrow="Pemerintahan Desa Kedungrejo"
        title="Struktur Organisasi & Perangkat Desa"
        description="Bagan resmi susunan tata kerja Pemerintah Desa Kedungrejo, Kecamatan Modo, Kabupaten Lamongan."
      />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        {/* Ringkasan Informasi Header Card */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-8 text-white shadow-xl shadow-emerald-900/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                <Building2 className="h-3.5 w-3.5" />
                <span>Kecamatan Modo • Kabupaten Lamongan</span>
              </div>
              <h2 className="text-2xl font-black sm:text-3xl">Tata Kerja Pemerintahan Desa Kedungrejo</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-emerald-100/90 sm:text-base">
                Bagan foto resmi yang mengabdi untuk mewujudkan pelayanan publik yang responsif, transparan, dan sejahtera bagi seluruh warga.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-md">
                <p className="text-xs font-medium text-emerald-200">Total Posisi</p>
                <p className="mt-1 text-2xl font-black">13</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-md">
                <p className="text-xs font-medium text-emerald-200">Terisi</p>
                <p className="mt-1 text-2xl font-black text-emerald-300">12</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-md sm:col-span-1">
                <p className="text-xs font-medium text-emerald-200">Wilayah Dusun</p>
                <p className="mt-1 text-2xl font-black text-amber-300">4 Dusun</p>
              </div>
            </div>
          </div>
        </div>

        {/* BAGAN GAMBAR FOTO RESMI (TAMPILAN TUNGGAL RESMI) */}
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            {/* Card Header Bar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">Bagan Foto Resmi Perangkat Desa</h3>
                  <p className="text-xs font-medium text-slate-500">Pemerintah Desa Kedungrejo, Kec. Modo, Kab. Lamongan</p>
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

            {/* Card Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-5 text-center text-xs text-slate-500">
              Dokumen visual bagan SOTK Pemerintah Desa Kedungrejo resmi sesuai penetapan struktur kepemimpinan desa.
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

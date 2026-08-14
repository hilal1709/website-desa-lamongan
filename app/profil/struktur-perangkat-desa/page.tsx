"use client"

import { useState } from "react"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import {
  Users,
  Building2,
  ShieldCheck,
  FileText,
  Coins,
  Search,
  MapPin,
  GitFork,
  LayoutGrid,
  Award,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ImageIcon,
  Maximize2,
  Download,
  X,
  Eye
} from "lucide-react"

interface Official {
  id: string
  name: string
  title: string
  roleGroup: "pimpinan" | "bpd" | "kaur" | "kasi" | "kasun"
  nip?: string
  initials: string
  description: string
  icon: any
  badgeColor: string
  isVacant?: boolean
}

const officialsData: Official[] = [
  {
    id: "kades",
    name: "Ketut Priyambodo",
    title: "Kepala Desa",
    roleGroup: "pimpinan",
    initials: "KP",
    description: "Pemegang kekuasaan pengelolaan keuangan dan penanggung jawab tertinggi penyelenggaraan Pemerintahan Desa Kedungrejo.",
    icon: Award,
    badgeColor: "bg-amber-500/10 text-amber-700 border-amber-300"
  },
  {
    id: "bpd",
    name: "BPD Kedungrejo",
    title: "Badan Permusyawaratan Desa",
    roleGroup: "bpd",
    initials: "BPD",
    description: "Lembaga penyalur aspirasi masyarakat desa dan pengawas jalannya tata kelola pemerintahan desa.",
    icon: Building2,
    badgeColor: "bg-indigo-500/10 text-indigo-700 border-indigo-300"
  },
  {
    id: "sekdes",
    name: "Puguh Santoso",
    title: "Sekretaris Desa",
    roleGroup: "pimpinan",
    initials: "PS",
    description: "Pimpinan sekretariat desa yang membantu Kepala Desa dalam bidang administrasi dan tata kelola pemerintah desa.",
    icon: Briefcase,
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-300"
  },
  {
    id: "kaur-perencanaan",
    name: "Suyitno",
    title: "Kaur Perencanaan",
    roleGroup: "kaur",
    initials: "SY",
    description: "Menyusun Rencana Kerja Pemerintah Desa (RKPDes), APBDes, dan mengkoordinasikan evaluasi pembangunan.",
    icon: GitFork,
    badgeColor: "bg-teal-500/10 text-teal-700 border-teal-300"
  },
  {
    id: "kaur-keuangan",
    name: "Muksam",
    title: "Kaur Keuangan",
    roleGroup: "kaur",
    initials: "MK",
    description: "Mengelola pengeluaran, penerimaan, SPJ, dan pencatatan akuntansi keuangan APBDes Kedungrejo.",
    icon: Coins,
    badgeColor: "bg-cyan-500/10 text-cyan-700 border-cyan-300"
  },
  {
    id: "kaur-tu-umum",
    name: "Septian Putri D.K",
    title: "Kaur TU & Umum",
    roleGroup: "kaur",
    initials: "SP",
    description: "Mengendalikan administrasi naskah dinas, kearsipan, serta pengelolaan barang inventaris aset desa.",
    icon: FileText,
    badgeColor: "bg-blue-500/10 text-blue-700 border-blue-300"
  },
  {
    id: "kasi-pemerintahan",
    name: "M. Zainal Abidin",
    title: "Kasi Pemerintahan",
    roleGroup: "kasi",
    initials: "ZA",
    description: "Melaksanakan manajemen pertanahan, ketertiban masyarakat, kepemilikan administrasi kependudukan.",
    icon: ShieldCheck,
    badgeColor: "bg-indigo-500/10 text-indigo-700 border-indigo-300"
  },
  {
    id: "kasi-pelayanan",
    name: "Markamah Rochani",
    title: "Kasi Pelayanan",
    roleGroup: "kasi",
    initials: "MR",
    description: "Mengelola loket pelayanan surat-menyurat warga, sosial perizinan, dan pendampingan kesejahteraan.",
    icon: Users,
    badgeColor: "bg-purple-500/10 text-purple-700 border-purple-300"
  },
  {
    id: "kasi-kesejahteraan",
    name: "Belum Terisi",
    title: "Kasi Kesejahteraan",
    roleGroup: "kasi",
    initials: "KK",
    description: "Bertanggung jawab atas pembangunan sarana prasarana, pemberdayaan ekonomi, dan kebudayaan desa.",
    icon: Sparkles,
    badgeColor: "bg-rose-500/10 text-rose-700 border-rose-300",
    isVacant: true
  },
  {
    id: "kasun-topang",
    name: "Gatot Supanardi",
    title: "Kasun Topang",
    roleGroup: "kasun",
    initials: "GS",
    description: "Kepala Kewilayahan Dusun Topang, memimpin kegiatan kemasyarakatan dan pelayanan tingkat dusun.",
    icon: MapPin,
    badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-300"
  },
  {
    id: "kasun-karangpilang",
    name: "Tommy Candra",
    title: "Kasun Karangpilang",
    roleGroup: "kasun",
    initials: "TC",
    description: "Kepala Kewilayahan Dusun Karangpilang, memimpin pelaksanaan pembangunan dan pembinaan warga.",
    icon: MapPin,
    badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-300"
  },
  {
    id: "kasun-dopok-sambi",
    name: "Budi Wardoyo",
    title: "Kasun Dopok Sambi",
    roleGroup: "kasun",
    initials: "BW",
    description: "Kepala Kewilayahan Dusun Dopok Sambi, membina keharmonisan, keamanan, dan ketertiban lingkungan dusun.",
    icon: MapPin,
    badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-300"
  },
  {
    id: "kasun-gabang",
    name: "Sukamto",
    title: "Kasun Gabang",
    roleGroup: "kasun",
    initials: "SK",
    description: "Kepala Kewilayahan Dusun Gabang, mengkoordinasikan aspirasi warga dan kegiatan gotong royong dusun.",
    icon: MapPin,
    badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-300"
  }
]

export default function StrukturPerangkatDesaPage() {
  const [viewMode, setViewMode] = useState<"tree" | "image" | "grid">("tree")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredOfficials = officialsData.filter((official) => {
    const matchesGroup = selectedGroup === "all" || official.roleGroup === selectedGroup
    const matchesSearch =
      official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      official.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      official.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGroup && matchesSearch
  })

  return (
    <>
      <PageHero
        eyebrow="Pemerintahan Desa Kedungrejo"
        title="Struktur Organisasi & Perangkat Desa"
        description="Susunan resmi tata kerja Pemerintah Desa Kedungrejo, Kecamatan Modo, Kabupaten Lamongan."
      />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        {/* Ringkasan Informasi Header Card */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-8 text-white shadow-xl shadow-emerald-900/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                <Building2 className="h-3.5 w-3.5" />
                <span>Kecamatan Modo • Kabupaten Lamongan</span>
              </div>
              <h2 className="text-2xl font-black sm:text-3xl">Tata Kerja Pemerintahan Desa Kedungrejo</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-emerald-100/90 sm:text-base">
                Struktur resmi yang mengabdi untuk mewujudkan pelayanan publik yang responsif, transparan, dan sejahtera bagi seluruh warga.
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

        {/* Navigation & Controls */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
          {/* View Mode Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-inner">
            <button
              onClick={() => setViewMode("tree")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                viewMode === "tree"
                  ? "bg-white text-emerald-800 shadow-md shadow-slate-900/5"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GitFork className="h-4 w-4" />
              <span>Bagan Hirarki</span>
            </button>
            <button
              onClick={() => setViewMode("image")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                viewMode === "image"
                  ? "bg-white text-emerald-800 shadow-md shadow-slate-900/5"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Bagan Foto Resmi</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-emerald-800 shadow-md shadow-slate-900/5"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Daftar Kartu</span>
            </button>
          </div>

          {/* Search Box (Active in Grid mode or all) */}
          {viewMode === "grid" && (
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama / jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          )}
        </div>

        {/* VIEW 1: ORGANIZATIONAL TREE DIAGRAM */}
        {viewMode === "tree" && (
          <div className="space-y-12 py-4">
            {/* Level 1: Kades & BPD */}
            <div className="relative flex flex-col items-center">
              <div className="grid gap-6 md:grid-cols-2 lg:gap-12 max-w-3xl w-full items-stretch">
                {/* Kepala Desa Card */}
                <div className="relative group rounded-3xl border-2 border-amber-300/80 bg-gradient-to-b from-white to-amber-50/30 p-6 shadow-xl shadow-amber-900/5 transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    <Award className="h-3.5 w-3.5" />
                    <span>Pimpinan Tertinggi</span>
                  </div>
                  <div className="mt-2 flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-xl font-extrabold text-white shadow-md shadow-amber-600/30">
                      KP
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-700 transition">Ketut Priyambodo</h3>
                      <p className="text-sm font-bold text-amber-600">Kepala Desa Kedungrejo</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        Penanggung jawab tertinggi penyelenggaraan pemerintahan, pembangunan, dan pembinaan warga desa.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BPD Card */}
                <div className="relative group rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-white to-indigo-50/30 p-6 shadow-xl shadow-indigo-900/5 transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Mitra Pengawasan</span>
                  </div>
                  <div className="mt-2 flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-xl font-extrabold text-white shadow-md shadow-indigo-600/30">
                      BPD
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-700 transition">BPD Kedungrejo</h3>
                      <p className="text-sm font-bold text-indigo-600">Badan Permusyawaratan Desa</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        Mitra strategis dalam pembahasan Perdes, penampung aspirasi warga, serta pengawasan kinerja desa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Line Down */}
              <div className="h-10 w-0.5 bg-gradient-to-b from-amber-400 via-emerald-400 to-emerald-600 my-2"></div>
            </div>

            {/* Level 2: Sekretaris Desa */}
            <div className="relative flex flex-col items-center">
              <div className="max-w-xl w-full">
                <div className="relative group rounded-3xl border-2 border-emerald-300 bg-gradient-to-b from-white to-emerald-50/40 p-6 shadow-xl shadow-emerald-900/5 transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Sekretariat Desa</span>
                  </div>
                  <div className="mt-2 flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xl font-extrabold text-white shadow-md shadow-emerald-600/30">
                      PS
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition">Puguh Santoso</h3>
                      <p className="text-sm font-bold text-emerald-600">Sekretaris Desa</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        Koordinator staf operasional administrasi, pengelolaan keuangan, dan pendukung pelayanan umum desa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Line Down & Horizontal Split */}
              <div className="h-8 w-0.5 bg-emerald-500"></div>
              <div className="w-full max-w-5xl h-0.5 bg-emerald-300 hidden md:block"></div>
            </div>

            {/* Level 3: Unsur Staf (Kaur & Kasi) */}
            <div>
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="h-px w-12 bg-slate-300"></span>
                <h4 className="text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                  Pelaksana Teknis & Administrasi (Kaur & Kasi)
                </h4>
                <span className="h-px w-12 bg-slate-300"></span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {/* Kaur Perencanaan */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500 font-bold text-white shadow-md shadow-teal-500/20">
                      SY
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Suyitno</h5>
                      <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700">
                        Kaur Perencanaan
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Perencanaan pembangunan desa, penyusunan RKPDes, APBDes, dan evaluasi capaian kinerja.
                  </p>
                </div>

                {/* Kaur Keuangan */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 font-bold text-white shadow-md shadow-cyan-600/20">
                      MK
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Muksam</h5>
                      <span className="inline-block rounded-md bg-cyan-50 px-2 py-0.5 text-xs font-bold text-cyan-700">
                        Kaur Keuangan
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Pengelolaan kas desa, verifikasi bukti belanja, SPJ keuangan, dan pelaporan APBDes.
                  </p>
                </div>

                {/* Kaur TU & Umum */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20">
                      SP
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Septian Putri D.K</h5>
                      <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                        Kaur TU & Umum
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Urusan tata usaha naskah surat dinas, kearsipan, serta pengelolaan aset dan perlengkapan kantor.
                  </p>
                </div>

                {/* Kasi Pemerintahan */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/20">
                      ZA
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">M. Zainal Abidin</h5>
                      <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                        Kasi Pemerintahan
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Manajemen ketertiban, keagrariaan pertanahan, kependudukan, serta ketentraman warga desa.
                  </p>
                </div>

                {/* Kasi Pelayanan */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 font-bold text-white shadow-md shadow-purple-600/20">
                      MR
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Markamah Rochani</h5>
                      <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">
                        Kasi Pelayanan
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Pelayanan administrasi publik, pengurusan surat perizinan warga, dan bantuan sosial kependudukan.
                  </p>
                </div>

                {/* Kasi Kesejahteraan (Vacant) */}
                <div className="rounded-3xl border border-dashed border-rose-300 bg-rose-50/30 p-5 shadow-sm transition hover:-translate-y-1">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-300 bg-rose-100 font-bold text-rose-600">
                      -
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-rose-700">
                        <AlertCircle className="h-4 w-4" />
                        <h5 className="font-extrabold italic">Jabatan Kosong</h5>
                      </div>
                      <span className="inline-block rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                        Kasi Kesejahteraan
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-rose-800/80 border-t border-rose-200/60 pt-3">
                    Posisi ini bertanggung jawab atas pembangunan fisik, pemberdayaan masyarakat, dan kebudayaan desa.
                  </p>
                </div>
              </div>
            </div>

            {/* Level 4: Unsur Kewilayahan (Kepala Dusun) */}
            <div className="pt-6">
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="h-px w-12 bg-slate-300"></span>
                <h4 className="text-sm font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
                  Kepala Kewilayahan (Kepala Dusun)
                </h4>
                <span className="h-px w-12 bg-slate-300"></span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {/* Kasun Topang */}
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-amber-50/20 p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600 font-bold text-white shadow-md shadow-amber-600/20">
                      GS
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Gatot Supanardi</h5>
                      <p className="text-xs font-bold text-amber-700">Kasun Topang</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Pemimpin kewilayahan Dusun Topang, mengkoordinasikan kegiatan kemasyarakatan dan lingkungan.
                  </p>
                </div>

                {/* Kasun Karangpilang */}
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-amber-50/20 p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600 font-bold text-white shadow-md shadow-amber-600/20">
                      TC
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Tommy Candra</h5>
                      <p className="text-xs font-bold text-amber-700">Kasun Karangpilang</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Pemimpin kewilayahan Dusun Karangpilang, mengawal aspirasi dan pembangunan warga dusun.
                  </p>
                </div>

                {/* Kasun Dopok Sambi */}
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-amber-50/20 p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600 font-bold text-white shadow-md shadow-amber-600/20">
                      BW
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Budi Wardoyo</h5>
                      <p className="text-xs font-bold text-amber-700">Kasun Dopok Sambi</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Pemimpin kewilayahan Dusun Dopok Sambi, menjaga stabilitas, keamanan, dan kebersihan dusun.
                  </p>
                </div>

                {/* Kasun Gabang */}
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-amber-50/20 p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-600 font-bold text-white shadow-md shadow-amber-600/20">
                      SK
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900">Sukamto</h5>
                      <p className="text-xs font-bold text-amber-700">Kasun Gabang</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                    Pemimpin kewilayahan Dusun Gabang, membina gotong royong dan pelayanan warga tingkat dusun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: BAGAN GAMBAR FOTO RESMI (OFFICIAL DIAGRAM CARD) */}
        {viewMode === "image" && (
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              {/* Card Header Bar */}
              <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">Bagan Dokumen Resmi SOTK</h3>
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

              {/* Card Body - Image Display */}
              <div className="relative group cursor-pointer bg-slate-900/5 p-4 sm:p-8" onClick={() => setIsModalOpen(true)}>
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                  <img
                    src="/images/struktur-organisasi.png"
                    alt="Struktur Organisasi dan Tata Kerja Pemerintah Desa Kedungrejo"
                    className="w-full h-auto object-contain transition duration-300 group-hover:scale-[1.01]"
                  />
                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-xl">
                      <Eye className="h-4 w-4 text-emerald-600" />
                      <span>Klik untuk memperbesar tampilan full</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-5 text-center text-xs text-slate-500">
                Dokumen visual bagan SOTK Pemerintah Desa Kedungrejo resmi sesuai penetapan struktur kepemimpinan desa.
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FILTERABLE GRID CARD VIEW */}
        {viewMode === "grid" && (
          <div>
            {/* Group Filter Buttons */}
            <div className="mb-8 flex flex-wrap gap-2">
              {[
                { id: "all", label: "Semua Perangkat (13)" },
                { id: "pimpinan", label: "Kades & Sekdes" },
                { id: "bpd", label: "BPD" },
                { id: "kaur", label: "Kaur (3)" },
                { id: "kasi", label: "Kasi (3)" },
                { id: "kasun", label: "Kepala Dusun (4)" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGroup(tab.id)}
                  className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition ${
                    selectedGroup === tab.id
                      ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Officials Grid */}
            {filteredOfficials.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredOfficials.map((official) => {
                  const Icon = official.icon
                  return (
                    <div
                      key={official.id}
                      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                        official.isVacant ? "border-dashed border-rose-300 bg-rose-50/20" : "border-slate-200"
                      }`}
                    >
                      <div>
                        {/* Top Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${official.badgeColor}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{official.title}</span>
                          </span>
                          {official.isVacant ? (
                            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-700">
                              Vacant
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                            </span>
                          )}
                        </div>

                        {/* Avatar & Name */}
                        <div className="mt-6 flex items-center gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white shadow-md ${
                              official.isVacant
                                ? "border border-rose-300 bg-rose-100 text-rose-600 shadow-none"
                                : official.roleGroup === "pimpinan"
                                ? "bg-gradient-to-br from-amber-500 to-emerald-700 shadow-amber-600/20"
                                : official.roleGroup === "bpd"
                                ? "bg-gradient-to-br from-indigo-500 to-purple-700 shadow-indigo-600/20"
                                : official.roleGroup === "kasun"
                                ? "bg-gradient-to-br from-amber-600 to-amber-800 shadow-amber-600/20"
                                : "bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-600/20"
                            }`}
                          >
                            {official.initials}
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-slate-900">{official.name}</h4>
                            <p className="text-xs font-semibold text-slate-500">{official.title}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-4 text-xs leading-relaxed text-slate-600">{official.description}</p>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          Pemerintah Desa Kedungrejo
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
                <Search className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 font-bold text-slate-700">Tidak ada perangkat desa yang cocok</p>
                <p className="text-xs">Coba kata kunci pencarian lain atau pilih kategori kelompok berbeda.</p>
              </div>
            )}
          </div>
        )}
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

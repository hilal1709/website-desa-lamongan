import { prisma } from "@/app/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export interface CmsPageContent {
  [key: string]: unknown
  slug: string
  label: string
  eyebrow: string
  title: string
  description: string
  image: string
  imagePosition: string
  sections: CmsSection[]
}

export interface CmsSection {
  [key: string]: unknown
  key: string
  label: string
  eyebrow?: string
  title?: string
  description?: string
  action?: string
  href?: string
  image?: string
  items?: CmsSectionItem[]
}

export interface CmsSectionItem {
  title: string
  icon?: string
  description?: string
  value?: string
  detail?: string
  meta?: string
  href?: string
  category?: string
  date?: string
  image?: string
}

export const defaultCmsPages: CmsPageContent[] = [
  {
    slug: "home",
    label: "Beranda",
    eyebrow: "Desa Pintar Kedungrejo",
    title: "Desa bertumbuh, warga terhubung.",
    description: "Portal digital Desa Kedungrejo untuk pelayanan yang mudah, informasi yang terbuka, dan masa depan yang lebih baik.",
    image: "/images/dorr.jpg",
    imagePosition: "center",
    sections: [
      {
        key: "stats",
        label: "Statistik ringkas",
        items: [
          { title: "Penduduk", value: "4.862", detail: "Jiwa terdata" },
          { title: "Kepala Keluarga", value: "1.548", detail: "Keluarga" },
          { title: "Layanan bulan ini", value: "248", detail: "Pengajuan" },
          { title: "Dusun", value: "5", detail: "Wilayah" },
        ],
      },
      {
        key: "services",
        label: "Layanan beranda",
        eyebrow: "Layanan",
        title: "Akses layanan desa yang cepat dan jelas",
        description: "Berbagai kebutuhan warga dapat diselesaikan dengan proses yang lebih ringkas dan transparan.",
        action: "Lihat semua layanan",
        href: "/layanan",
        items: [
          { title: "Surat Keterangan", description: "Pengantar, domisili, dan kebutuhan administrasi lainnya.", href: "/layanan" },
          { title: "Layanan Kependudukan", description: "Informasi KTP, KK, akta kelahiran, dan pindah datang.", href: "/layanan" },
          { title: "Aduan Warga", description: "Sampaikan masalah lingkungan dan pelayanan.", href: "/aduan" },
          { title: "Data & Infografis Desa", description: "Akses data terbuka dan potensi wilayah desa.", href: "/infografis" },
        ],
      },
      {
        key: "digital",
        label: "Desa digital",
        eyebrow: "Desa digital",
        title: "Potensi, inovasi, dan kesejahteraan",
        description: "Informasi desa yang dibangun untuk menampilkan sisi sosial, ekonomi, dan layanan warga secara lebih akrab.",
        action: "Tentang Desa",
        href: "/profil",
        items: [
          { title: "Akses data dan potensi desa yang referensial", description: "Setiap informasi tersedia dengan format yang jelas dan mudah dipahami." },
          { title: "Program pemberdayaan berbasis kebutuhan warga", description: "Kegiatan desa didorong berdasarkan kebutuhan pengguna langsung di lapangan." },
          { title: "Pelayanan yang lebih dekat dengan komunitas", description: "Semua proses dibuat agar lebih responsif dan mudah diakses oleh masyarakat." },
        ],
      },
      {
        key: "news",
        label: "Berita beranda",
        eyebrow: "Berita",
        title: "Kabar terbaru dari Desa Kedungrejo",
        description: "Update kegiatan, program, dan momentum positif yang tengah berlangsung di desa.",
        action: "Baca semua berita",
        href: "/berita",
        items: [],
      },
      {
        key: "cta",
        label: "CTA bawah",
        eyebrow: "Siap berdaya",
        title: "Mari wujudkan desa yang lebih maju dan terbuka.",
      },
    ],
  },
  {
    slug: "profil",
    label: "Profil Desa",
    eyebrow: "Tentang kami",
    title: "Desa Sejahtera, Mandiri, dan Berbudaya.",
    description: "Kedungrejo adalah desa yang tumbuh dengan semangat gotong royong, berakar pada pertanian dan terbuka terhadap inovasi.",
    image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 48%",
    sections: [
      {
        key: "history",
        label: "Sejarah desa",
        eyebrow: "Sejarah Desa",
        title: "Tumbuh bersama sejak 1928.",
        description: "Desa Kedungrejo berkembang dari permukiman agraris yang dikelilingi persawahan subur. Hari ini, desa kami memadukan kearifan lokal dengan tata kelola digital untuk memberikan hidup yang lebih baik bagi setiap keluarga.",
        image: "/images/pesona-potensi-desa-poster.jpg",
        items: [
          { title: "4.862", description: "Warga bertetangga" },
          { title: "72 ha", description: "Lahan produktif" },
        ],
      },
      {
        key: "vision-mission",
        label: "Visi & misi",
        eyebrow: "Arah Desa Kedungrejo",
        title: "Visi & Misi Desa",
        description: "Terwujudnya Desa Kedungrejo yang maju, mandiri, sejahtera, dan berbudaya melalui pelayanan yang inklusif serta pembangunan berkelanjutan.",
        items: [
          { title: "Pelayanan publik yang cepat, mudah, dan transparan." },
          { title: "Pemberdayaan ekonomi warga melalui potensi pertanian, UMKM, dan inovasi desa." },
          { title: "Pembangunan infrastruktur yang merata, aman, dan berwawasan lingkungan." },
          { title: "Penguatan gotong royong, budaya lokal, serta kualitas sumber daya manusia." },
        ],
      },
      {
        key: "government-cta",
        label: "CTA perangkat desa",
        eyebrow: "Pemerintahan Desa",
        title: "Struktur Organisasi & Perangkat Desa",
        description: "Lihat susunan perangkat Pemerintah Desa Kedungrejo.",
        action: "Lihat Struktur Perangkat",
        href: "/profil/struktur-perangkat-desa",
      },
      {
        key: "village-map",
        label: "Peta wilayah",
        eyebrow: "Peta wilayah",
        title: "Peta satelit Desa Kedungrejo",
        description: "Tampilan satelit dengan batas Desa Kedungrejo dan titik referensi empat dusun.",
        action: "Buka di Google Maps",
        href: "https://www.google.com/maps/search/?api=1&query=Desa+Kedungrejo+Kecamatan+Modo+Kabupaten+Lamongan",
      },
    ],
  },
  {
    slug: "struktur-perangkat-desa",
    label: "Struktur Perangkat Desa",
    eyebrow: "Profil Desa",
    title: "Struktur Perangkat Desa",
    description: "Bagan resmi Pemerintah Desa Kedungrejo.",
    image: "/images/dorr.jpg",
    imagePosition: "center",
    sections: [
      {
        key: "organization-chart",
        label: "Bagan organisasi",
        title: "Bagan Struktur Organisasi",
        description: "Gunakan bagan berikut untuk melihat susunan organisasi Pemerintah Desa Kedungrejo.",
        image: "/images/struktur-organisasi.png",
        items: [{ title: "Perbesar Gambar" }, { title: "Unduh Gambar" }],
      },
    ],
  },
  {
    slug: "layanan",
    label: "Layanan",
    eyebrow: "Layanan publik",
    title: "Pilih layanan administrasi desa.",
    description: "Lengkapi kebutuhan administrasi Anda dengan jelas, mudah, dan terarah.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 42%",
    sections: [
      {
        key: "service-cards",
        label: "Kartu layanan",
        items: [
          { title: "Surat Keterangan", description: "Domisili, usaha, tidak mampu, dan surat pengantar.", href: "/layanan-digital", icon: "description" },
          { title: "Kependudukan", description: "Administrasi KTP, KK, kelahiran, dan pindah datang.", href: "/layanan-digital", icon: "badge" },
          { title: "Kesehatan Warga", description: "Pendaftaran posyandu dan informasi layanan kesehatan.", href: "/stunting", icon: "favorite" },
          { title: "Izin Usaha Mikro", description: "Konsultasi dan surat keterangan usaha desa.", href: "/layanan-digital", icon: "storefront" },
        ],
      },
      {
        key: "flow",
        label: "Alur layanan",
        title: "Alur layanan yang mudah",
        items: [
          { title: "Pilih jenis layanan yang diperlukan" },
          { title: "Siapkan dan unggah persyaratan" },
          { title: "Petugas memverifikasi pengajuan" },
          { title: "Ambil dokumen di balai desa" },
        ],
      },
    ],
  },
  {
    slug: "layanan-digital",
    label: "Layanan Digital",
    eyebrow: "Layanan Digital",
    title: "Ajukan surat dari mana saja.",
    description: "Layanan simulasi ini menunjukkan alur pengajuan surat yang akan terhubung ke sistem desa pada tahap berikutnya.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 40%",
    sections: [
      {
        key: "form",
        label: "Form pengajuan",
        title: "Form Pengajuan Surat",
        items: [
          { title: "Nama lengkap" },
          { title: "NIK" },
          { title: "Nomor WhatsApp" },
          { title: "Jenis surat" },
          { title: "Keperluan" },
        ],
      },
      {
        key: "requirements",
        label: "Persyaratan",
        title: "Sebelum mengajukan",
        items: [
          { title: "Data diri sesuai KTP" },
          { title: "Dokumen pendukung siap" },
          { title: "Nomor kontak aktif" },
        ],
      },
    ],
  },
  {
    slug: "aduan",
    label: "Aduan",
    eyebrow: "Portal Aduan Masyarakat",
    title: "Suara warga, tindakan nyata.",
    description: "Identitas pelapor dijaga dan setiap aduan ditindaklanjuti.",
    image: "https://images.unsplash.com/photo-1573496130141-209d200cebd8?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 38%",
    sections: [
      {
        key: "complaint-form",
        label: "Form aduan",
        title: "Buat aduan",
        items: [
          { title: "Judul laporan" },
          { title: "Kategori" },
          { title: "Lokasi kejadian" },
          { title: "Nomor kontak" },
          { title: "Ceritakan laporan Anda" },
        ],
      },
      {
        key: "complaint-history",
        label: "Riwayat",
        title: "Aduan terbaru",
      },
    ],
  },
  {
    slug: "arsip",
    label: "Arsip",
    eyebrow: "Keterbukaan Informasi",
    title: "Arsip digital desa.",
    description: "Dokumen publik dan informasi pemerintahan yang dapat diakses warga dengan mudah.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 44%",
    sections: [
      {
        key: "documents",
        label: "Dokumen publik",
        title: "Daftar arsip digital",
      },
      {
        key: "notice",
        label: "Catatan arsip",
        title: "Arsip diperbarui secara berkala oleh operator Pemerintah Desa Kedungrejo.",
      },
    ],
  },
  {
    slug: "berita",
    label: "Berita",
    eyebrow: "Informasi publik",
    title: "Berita Desa Kedungrejo",
    description: "Kabar pembangunan, pelayanan, dan kegiatan warga yang disampaikan langsung oleh Pemerintah Desa Kedungrejo.",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 42%",
    sections: [],
  },
  {
    slug: "data-desa",
    label: "Data Desa",
    eyebrow: "Data Terbuka",
    title: "Statistik Desa Kedungrejo.",
    description: "Ringkasan data demografi dan potensi desa untuk perencanaan pembangunan yang lebih tepat.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 45%",
    sections: [
      {
        key: "stats",
        label: "Statistik data",
        items: [
          { title: "Jumlah Penduduk", value: "4.862", description: "2.471 Laki-laki - 2.391 Perempuan" },
          { title: "Dusun", value: "5", description: "18 RT - 7 RW" },
          { title: "Pendidikan", value: "68%", description: "Lulusan SMA sederajat" },
          { title: "Mata pencaharian", value: "42%", description: "Pertanian & perkebunan" },
        ],
      },
      {
        key: "age",
        label: "Komposisi usia",
        title: "Komposisi usia",
        items: [
          { title: "0-14 tahun", value: "24" },
          { title: "15-59 tahun", value: "65" },
          { title: "60+ tahun", value: "11" },
        ],
      },
      {
        key: "idm",
        label: "Status pembangunan",
        eyebrow: "Status pembangunan",
        title: "Indeks Desa Membangun",
        description: "Kategori Desa Mandiri",
        items: [{ title: "Skor IDM", value: "0.812" }],
      },
    ],
  },
  {
    slug: "infografis",
    label: "Infografis",
    eyebrow: "Data terbuka desa",
    title: "Infografis Desa Kedungrejo",
    description: "Gambaran kependudukan dan potensi desa yang ringkas, transparan, dan mudah dipahami.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 48%",
    sections: [
      {
        key: "banner",
        label: "Banner informasi",
        title: "Data kependudukan desa",
        description: "Gunakan filter tahun dan dusun untuk membaca kondisi warga secara lebih detail.",
      },
      {
        key: "dashboard",
        label: "Dashboard infografis",
        title: "Ringkasan visual",
        items: [
          { title: "Total penduduk", value: "4.862" },
          { title: "Kepala keluarga", value: "1.548" },
          { title: "Dusun", value: "5" },
        ],
      },
    ],
  },
  {
    slug: "peta-bencana",
    label: "Peta Lokasi Bencana",
    eyebrow: "Informasi Digital Desa",
    title: "Peta Bencana dan Kalender Iklim Kedungrejo",
    description: "Pantau prakiraan cuaca realtime, titik evakuasi, serta informasi kesiapsiagaan warga dalam satu halaman.",
    image: "/images/peta-bencana-hero.png",
    imagePosition: "center",
    sections: [
      {
        key: "emergency-assistance",
        label: "Banner bantuan darurat",
        eyebrow: "Bantuan Khusus Sektor Pertanian & Petani",
        title: "Sawah Terendam & Butuh Bantuan Bibit Padi?",
        description: "Jika lahan pertanian warga Desa Kedungrejo terdampak luapan banjir dan membutuhkan pasokan bibit padi pengganti, Pemerintah Desa berkoordinasi langsung dengan Dinas Ketahanan Pangan dan Pertanian (Dinkpp) Kabupaten Lamongan.",
        items: [
          { title: "Kontak Dinkpp Lamongan", href: "https://dinkpp.lamongankab.go.id" },
          { title: "Call Center BPBD / Posko (0322) 321 123", href: "tel:0322321123" },
        ],
      },
    ],
  },
  {
    slug: "stunting",
    label: "Stunting",
    eyebrow: "Dashboard Kesehatan",
    title: "Pantau tumbuh kembang anak.",
    description: "Ringkasan program percepatan penurunan stunting Desa Kedungrejo periode Agustus 2025.",
    image: "https://images.unsplash.com/photo-1576765608622-067973a79f53?auto=format&fit=crop&w=1800&q=85",
    imagePosition: "center 36%",
    sections: [
      {
        key: "health-stats",
        label: "Statistik kesehatan",
        items: [
          { title: "Balita terpantau", value: "186" },
          { title: "Risiko stunting", value: "7" },
          { title: "Kehadiran posyandu", value: "94%" },
          { title: "Prevalensi stunting", value: "3,8%" },
        ],
      },
      {
        key: "visits",
        label: "Kunjungan posyandu",
        title: "Capaian kunjungan posyandu",
        items: [
          { title: "M1", value: "54" },
          { title: "M2", value: "74" },
          { title: "M3", value: "63" },
          { title: "M4", value: "84" },
          { title: "M5", value: "71" },
          { title: "M6", value: "92" },
          { title: "M7", value: "94" },
        ],
      },
      {
        key: "program",
        label: "Program bulan ini",
        eyebrow: "Program bulan ini",
        title: "Kelas ibu balita & PMT",
        description: "Jadwal berikutnya: 28 Agustus 2025 di Balai Desa, pukul 08.00 WIB.",
      },
    ],
  },
]

async function readCmsPages() {
  try {
    const store = await prisma.cmsPageStore.findUnique({ where: { id: 1 } })
    const pages = Array.isArray(store?.data) ? store.data as unknown as CmsPageContent[] : defaultCmsPages
    if (!store) await prisma.cmsPageStore.create({ data: { id: 1, data: defaultCmsPages as unknown as Prisma.InputJsonValue } })
    return defaultCmsPages.map((page) => {
      const saved = pages.find((item) => item.slug === page.slug)
      if (!saved) return page

      return {
        ...page,
        ...saved,
        sections: page.sections.map((section) => ({
          ...section,
          ...saved.sections?.find((item) => item.key === section.key),
        })),
      }
    })
  } catch {
    return defaultCmsPages
  }
}

export async function getCmsPages() {
  return readCmsPages()
}

// The editor must always receive the current list, including pages added after
// an older cached CMS response was created.
export async function getFreshCmsPages() {
  return readCmsPages()
}

export async function getCmsPage(slug: string) {
  const pages = await getCmsPages()
  return pages.find((page) => page.slug === slug) ?? defaultCmsPages[0]
}

export async function saveCmsPages(pages: CmsPageContent[]) {
  await prisma.cmsPageStore.upsert({ where: { id: 1 }, create: { id: 1, data: pages as unknown as Prisma.InputJsonValue }, update: { data: pages as unknown as Prisma.InputJsonValue } })
}

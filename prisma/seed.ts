import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Seed Announcement
    await prisma.announcement.create({
        data: {
            title: "Pemberitahuan Penting: Penyaluran BLT Dana Desa Tahap 3",
            content:
                "Diberitahukan kepada seluruh warga, penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap 3 akan dilaksanakan pada hari Jumat, 25 Agustus 2024 di Balai Desa. Harap membawa KTP dan KK asli.",
            isActive: true,
        },
    });

    // 2. Seed QuickService
    const services = [
        { icon: "description", title: "Surat Pengantar RT/RW", bgColor: "bg-secondary-container text-on-secondary-container", link: "/layanan/surat-pengantar-rt-rw", order: 1 },
        { icon: "badge", title: "Pembuatan KTP/KK", bgColor: "bg-tertiary-container text-on-tertiary-container", link: "/layanan/pembuatan-ktp-kk", order: 2 },
        { icon: "favorite", title: "Surat Keterangan Lahir/Mati", bgColor: "bg-error-container text-on-error-container", link: "/layanan/surat-keterangan", order: 3 },
        { icon: "storefront", title: "Izin Usaha Mikro", bgColor: "bg-primary-container text-on-primary-container", link: "/layanan/izin-usaha", order: 4 },
        { icon: "report", title: "Lapor Aduan Warga", bgColor: "bg-secondary-container text-on-secondary-container", link: "/aduan", order: 5 },
        { icon: "more_horiz", title: "Layanan Lainnya", bgColor: "bg-surface-variant text-on-surface-variant", link: "/layanan", order: 6 },
    ];
    for (const s of services) {
        await prisma.quickService.create({ data: s });
    }

    // 3. Seed News
    const newsItems = [
        {
            category: "Pembangunan",
            categoryBg: "bg-secondary-container text-on-secondary-container",
            title: "Musyawarah Rencana Pembangunan Desa (Musrenbangdes) Tahun Anggaran 2025 Sukses Digelar",
            slug: "musrenbangdes-2025",
            summary: "Pemerintah Desa telah melaksanakan Musrenbangdes untuk menyepakati RKPDes tahun 2025. Fokus utama pada peningkatan infrastruktur jalan tani dan pemberdayaan ekonomi masyarakat berbasis potensi lokal.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCvQtVt4p7FZGN1vHGGGyFh_04YktvytLZt1_PaJdWGlJCmTx6wWFFpJ8EIsdAEEEDkT_iQfdcYeR2afUaDjLNdlnj19F2wyvjQBw0HXe5FQRAqywObamgYdS0-dWQdXjlAxbmd2Y-lo94h-rTn0pWk8OCXCmIcq5hblggPIWGaKjlsI_Dqj82_57fZcuV-lGvKXUMWBt4PgL4BtUaG2fG3_IWPhNXmdU-Wk76F1E1W8GEHxCUQ98cAA",
            isHeadline: true,
        },
        {
            category: "Pertanian",
            categoryBg: "bg-tertiary-container text-on-tertiary-container",
            title: "Pelatihan Pembuatan Pupuk Organik Cair bagi Kelompok Tani \"Tani Maju\"",
            slug: "pelatihan-pupuk-organik-cair",
            summary: "Dinas Pertanian memberikan pelatihan kepada puluhan petani untuk menekan biaya produksi dan menjaga kelestarian tanah.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsyVV9X1PCnltR8JjBkrcGAdVPuSbDn9Wcrl0ifeKAt9A9utJL_hrrnsJR3PPaKYT9Pn6FOsnOer9EDta4WFszr0l_SrnbOr9ndarS8L06w7VCQhXAKHfSOsqNuebpkh8sa7CsAOL-jwPqj_tGLpmV73bfhF5xIYSBxmHx9y3S9ru-vfzwgkB2oFCVDQ8rRiVAn1-bfKNk-eH_HQE7fqRjZgIq8lrR0XpnfyIF3gLC3ll1GjgVwepYIw",
            isHeadline: false,
        },
        {
            category: "Kesehatan",
            categoryBg: "bg-primary-container text-on-primary-container",
            title: "Kegiatan Posyandu Balita dan Lansia Serentak di 5 Dusun",
            slug: "posyandu-balita-dan-lansia",
            summary: "Pemantauan gizi dan kesehatan rutin untuk balita dan lansia berjalan lancar dengan tingkat partisipasi 90%.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJmjX6HWTI-mHf_dDMIsaeKAgzxqjpF7YWnvXpvFc7Opi0kE0y3_m5LDLoni5Xge_rnsSDOF-YMx2_LGj36A3PnNrDWnbbOuvXDDx1w97qvNZ7l3n2gcAeMpP7cmL6_QJ-32XLzfboB9iPpu_KoX1xMWu58LpFPT9NUerbhP-56oFxVfaEqwXksBywTcADc-yAzJxUVMRMfmZaE-9G5XaW3fU_D-FlYRM6Ejh6BeOiNwDoK_u-eePLCQ",
            isHeadline: false,
        },
    ];
    for (const n of newsItems) {
        await prisma.news.create({ data: n });
    }

    // 4. Seed Document
    const documents = [
        { title: "Laporan Realisasi APBDes Semester 1 2024", type: "PDF", size: "2.4 MB", icon: "picture_as_pdf", fileUrl: "#" },
        { title: "Peraturan Desa No. 3 Tahun 2024 tentang Pengelolaan Sampah", type: "PDF", size: "1.1 MB", icon: "picture_as_pdf", fileUrl: "#" },
        { title: "Data Profil Desa Semester 1 2024", type: "Excel", size: "0.8 MB", icon: "table", fileUrl: "#" },
    ];
    for (const d of documents) {
        await prisma.document.create({ data: d });
    }

    // 5. Seed Statistic
    const stats = [
        { label: "Jiwa", value: "3,452", icon: "group", color: "text-primary", order: 1 },
        { label: "Kepala Keluarga", value: "984", icon: "family_home", color: "text-secondary", order: 2 },
        { label: "Laki-laki", value: "1,780", icon: "male", color: "text-tertiary", order: 3 },
        { label: "Perempuan", value: "1,672", icon: "female", color: "text-tertiary-fixed-dim", order: 4 },
    ];
    for (const s of stats) {
        await prisma.statistic.create({ data: s });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

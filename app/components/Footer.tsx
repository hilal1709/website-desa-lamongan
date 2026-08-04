import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-surface-container py-xl">
            <div className="max-w-container-max mx-auto px-lg grid grid-cols-1 md:grid-cols-3 gap-xl">
                <div className="flex flex-col gap-sm">
                    <div className="flex items-center gap-sm">
                        <div className="relative h-10 w-10">
                            <Image
                                alt="Logo Pemerintah Desa"
                                fill
                                className="object-contain"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3FEEQtX8xPcctZToJc9wl2eZp93jm24pkBS_k6KgmtLj9b6zZLksW_dMmo1yDMWGzjHUzZzW9pql10091GqErgpLTIlGHifvmWaZgrJtAzmqQ2xCTDPtHfh9qZAt0m5qg471YU8sI5EmhfiRSB2SP-tYfEWf3-UPf9z1y4Vdcu1qXdM2crBynEjREDOshDfj1C4u4p0ERSlmBPtsCE769JWkUKlv9_JHZLT8LDDtMfHCoMr4wpnCqtA"
                                unoptimized
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-headline-md text-primary">Pemerintah Desa</span>
                            <span className="text-label-sm text-on-surface-variant">Sistem Informasi Digital Terpadu</span>
                        </div>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-sm">
                        Mewujudkan tata kelola desa yang transparan, akuntabel, dan melayani masyarakat dengan sepenuh hati melalui teknologi informasi.
                    </p>
                </div>

                <div className="flex flex-col gap-sm">
                    <span className="font-label-md text-on-surface">Navigasi Cepat</span>
                    <div className="grid grid-cols-2 gap-xs">
                        <Link href="/" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Beranda</Link>
                        <Link href="/layanan" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Layanan Publik</Link>
                        <Link href="/data" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Statistik Desa</Link>
                        <Link href="/berita" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Kabar Desa</Link>
                        <Link href="/aduan" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Lapor Aduan</Link>
                        <Link href="/admin" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Panel Admin</Link>
                    </div>
                </div>

                <div className="flex flex-col gap-sm">
                    <span className="font-label-md text-on-surface">Kontak Kami</span>
                    <div className="flex items-start gap-sm text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>Jl. Raya Desa No. 01, Kecamatan Sejahtera, Kabupaten Makmur</span>
                    </div>
                    <div className="flex items-center gap-sm text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        <span>admin@desa-digital.go.id</span>
                    </div>
                </div>
            </div>

            <div className="max-w-container-max mx-auto px-lg mt-xl pt-lg border-t border-outline-variant text-center text-label-sm text-on-surface-variant">
                © {new Date().getFullYear()} Pemerintah Desa. All rights reserved. Dikembangkan untuk transparansi publik.
            </div>
        </footer>
    );
}

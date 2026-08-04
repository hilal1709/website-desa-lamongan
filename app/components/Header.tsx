import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="h-16 max-w-container-max mx-auto px-md lg:px-lg flex items-center justify-between gap-md">
                <Link href="/" className="flex items-center gap-sm">
                    <div className="relative h-8 w-8">
                        <Image
                            alt="Logo Pemerintah Desa"
                            fill
                            className="object-contain"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3FEEQtX8xPcctZToJc9wl2eZp93jm24pkBS_k6KgmtLj9b6zZLksW_dMmo1yDMWGzjHUzZzW9pql10091GqErgpLTIlGHifvmWaZgrJtAzmqQ2xCTDPtHfh9qZAt0m5qg471YU8sI5EmhfiRSB2SP-tYfEWf3-UPf9z1y4Vdcu1qXdM2crBynEjREDOshDfj1C4u4p0ERSlmBPtsCE769JWkUKlv9_JHZLT8LDDtMfHCoMr4wpnCqtA"
                            unoptimized
                        />
                    </div>
                    <span className="hidden lg:block font-headline-md text-primary leading-tight">Sistem Informasi Desa</span>
                </Link>

                <nav className="hidden xl:flex items-center gap-md h-full">
                    <Link aria-current="page" href="/" className="transition-colors py-1 text-primary font-label-md border-b-2 border-primary">
                        Home
                    </Link>
                    <Link href="/profile" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Profile
                    </Link>
                    <Link href="/data" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Data
                    </Link>
                    <Link href="/berita" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Berita
                    </Link>
                    <Link href="/arsip" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Arsip
                    </Link>
                    <Link href="/layanan" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Layanan
                    </Link>
                    <Link href="/aduan" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Aduan
                    </Link>
                    <Link href="/stunting" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Stunting
                    </Link>
                    <Link href="/kontak" className="text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        Kontak
                    </Link>
                </nav>

                <div className="flex items-center gap-sm">
                    <button aria-label="Search" className="p-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined">search</span>
                    </button>

                    <div className="flex items-center gap-xs pl-sm border-l border-outline-variant">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                                alt="Profile"
                                fill
                                className="object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX_YReUu9Lswa_eeLupOzBuhUKP78XAFk6WuIN5FBaygxnCC9ft6yngdNZFSbqHjOhpB8dqk6Zcz1z_JsttVHR32MsR7DqWYOZgcxTgD3-ypAWhB15cCb67sPc1yBfBNOnrgXr2INZkWMo_5SfolRAtG8xCptNAkodtO8WXjm_3bKe3BzKbSkhKlj-sVB3iGgpOtCevBGdFJQ73TfGqg5XfUZrTMDMRbevkWKTBlhRxkJp5A1ryGuz-A"
                                unoptimized
                            />
                        </div>
                        <span className="hidden sm:block text-label-sm text-on-surface">Pengunjung</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

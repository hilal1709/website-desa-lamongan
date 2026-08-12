import Link from "next/link";
import type { QuickService } from "@/generated/prisma/client";

type Props = {
    services: QuickService[];
};

export default function QuickServices({ services }: Props) {
    if (services.length === 0) return null;

    return (
        <section className="max-w-container-max mx-auto px-md lg:px-lg mb-xl">
            <div className="flex items-end justify-between mb-md">
                <div>
                    <h2 className="font-headline-lg text-on-surface">Layanan Cepat</h2>
                    <p className="font-body-md text-on-surface-variant mt-xs">Akses layanan administrasi desa dengan mudah.</p>
                </div>
                <Link href="/layanan" className="hidden sm:flex font-label-md text-primary items-center gap-xs hover:text-primary-container transition-colors">
                    Lihat Semua <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
                {services.map((service) => (
                    <Link
                        key={service.id}
                        href={service.link}
                        className="group bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all rounded-lg p-md flex flex-col items-center text-center gap-sm h-full"
                    >
                        <div className={`w-12 h-12 rounded-full ${service.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {service.icon}
                            </span>
                        </div>
                        <span className="font-label-md text-on-surface">{service.title}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

import Link from "next/link";
import type { Statistic } from "@/generated/prisma/client";

type Props = {
    stats: Statistic[];
};

export default function SidebarStats({ stats }: Props) {
    if (stats.length === 0) return null;

    return (
        <div className="bg-surface-container-low rounded-xl p-md shadow-sm">
            <h3 className="font-headline-md text-on-surface mb-md">Statistik Singkat</h3>
            <div className="grid grid-cols-2 gap-sm">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-surface rounded-lg p-sm flex flex-col items-center text-center">
                        <span className={`material-symbols-outlined ${stat.color} mb-xs`} style={{ fontVariationSettings: "'FILL' 1" }}>
                            {stat.icon}
                        </span>
                        <span className="font-headline-lg text-on-surface leading-none">{stat.value}</span>
                        <span className="font-label-sm text-on-surface-variant mt-xs">{stat.label}</span>
                    </div>
                ))}
            </div>
            <Link href="/data" className="block text-center w-full mt-md font-label-sm text-primary hover:underline">
                Lihat Data Lengkap
            </Link>
        </div>
    );
}

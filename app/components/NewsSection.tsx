import Image from "next/image";
import Link from "next/link";
import type { News } from "@prisma/client";
import { formatDateId } from "../lib/format";

type Props = {
    news: News[];
};

export default function NewsSection({ news }: Props) {
    if (news.length === 0) return null;

    return (
        <section>
            <div className="flex items-end justify-between mb-md border-b-2 border-primary pb-sm">
                <h2 className="font-headline-md text-on-surface">Kabar Desa Terkini</h2>
                <Link href="/berita" className="font-label-sm text-primary hover:underline">
                    Indeks Berita
                </Link>
            </div>

            <div className="flex flex-col gap-md">
                {news.map((item) => (
                    <article key={item.id} className="group flex flex-col sm:flex-row gap-md items-start">
                        {item.image && (
                            <div className={`w-full ${item.isHeadline ? "sm:w-1/3 aspect-[4/3]" : "sm:w-1/4 aspect-square"} rounded-lg overflow-hidden bg-surface-container flex-shrink-0 relative`}>
                                <Image
                                    alt={item.title}
                                    src={item.image}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />
                            </div>
                        )}

                        <div className="flex-1 flex flex-col gap-xs py-xs">
                            <div className="flex items-center gap-sm text-on-surface-variant font-label-sm">
                                <span className={`${item.categoryBg ?? "bg-surface-variant text-on-surface-variant"} px-2 py-1 rounded-sm uppercase tracking-wider text-[10px]`}>
                                    {item.category}
                                </span>
                                <span>{formatDateId(item.createdAt)}</span>
                            </div>

                            <h3 className={`${item.isHeadline ? "font-headline-md" : "font-label-md text-lg"} text-on-surface group-hover:text-primary transition-colors line-clamp-2 mt-xs`}>
                                <Link href={`/berita/${item.slug}`}>{item.title}</Link>
                            </h3>

                            {item.summary && (
                                <p className="font-body-sm text-on-surface-variant line-clamp-2 mt-sm">
                                    {item.summary}
                                </p>
                            )}

                            {item.isHeadline && (
                                <div className="mt-auto pt-sm flex items-center gap-xs font-label-sm text-primary">
                                    <Link href={`/berita/${item.slug}`} className="flex items-center gap-xs">
                                        Baca selengkapnya <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

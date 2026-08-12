import type { Document } from "@/generated/prisma/client";
import { formatDateId } from "../lib/format";

type Props = {
    documents: Document[];
};

export default function DocumentList({ documents }: Props) {
    if (documents.length === 0) return null;

    return (
        <section className="mt-lg">
            <h2 className="font-headline-md text-on-surface mb-md">Dokumen Publik Terbaru</h2>
            <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
                <ul className="flex flex-col">
                    {documents.map((doc) => (
                        <li key={doc.id} className="flex items-center gap-sm p-sm hover:bg-surface-container transition-colors cursor-pointer border-b border-outline-variant last:border-0">
                            <span className="material-symbols-outlined text-secondary font-[300]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {doc.icon}
                            </span>
                            <div className="flex-1 flex flex-col">
                                <span className="font-label-md text-on-surface">{doc.title}</span>
                                <span className="font-label-sm text-on-surface-variant">
                                    {doc.type} &bull; {doc.size} &bull; Diunggah {formatDateId(doc.uploadedAt)}
                                </span>
                            </div>
                            {doc.fileUrl && (
                                <a
                                    href={doc.fileUrl}
                                    download
                                    aria-label="Download"
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

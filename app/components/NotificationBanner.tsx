import type { Announcement } from "@prisma/client";

type Props = {
    announcement: Announcement | null;
};

export default function NotificationBanner({ announcement }: Props) {
    if (!announcement) return null;

    return (
        <section className="max-w-container-max mx-auto px-md lg:px-lg mt-md mb-lg">
            <div className="bg-primary-container text-on-primary-container p-md rounded-lg flex items-start sm:items-center gap-md shadow-sm">
                <span className="material-symbols-outlined text-headline-md flex-shrink-0">campaign</span>
                <div className="flex-1">
                    <h3 className="font-label-md">{announcement.title}</h3>
                    <p className="font-body-sm mt-xs sm:mt-0">{announcement.content}</p>
                </div>
                <button className="hidden sm:block font-label-sm text-primary bg-on-primary px-sm py-xs rounded-sm hover:bg-surface-container-high transition-colors">
                    Tutup
                </button>
            </div>
        </section>
    );
}

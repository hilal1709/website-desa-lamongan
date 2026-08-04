import NotificationBanner from "./components/NotificationBanner";
import QuickServices from "./components/QuickServices";
import NewsSection from "./components/NewsSection";
import DocumentList from "./components/DocumentList";
import SidebarStats from "./components/SidebarStats";
import WeatherWidget from "./components/WeatherWidget";
import MapWidget from "./components/MapWidget";
import { prisma } from "./lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
    const [announcement, services, news, documents, stats] = await Promise.all([
        prisma.announcement.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        }),
        prisma.quickService.findMany({ orderBy: { order: "asc" } }),
        prisma.news.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.document.findMany({ orderBy: { uploadedAt: "desc" }, take: 5 }),
        prisma.statistic.findMany({ orderBy: { order: "asc" } }),
    ]);

    return (
        <div className="flex flex-col w-full">
            <NotificationBanner announcement={announcement} />
            <QuickServices services={services} />

            <div className="max-w-container-max mx-auto px-md lg:px-lg grid grid-cols-1 lg:grid-cols-12 gap-lg mb-xl w-full">
                <div className="lg:col-span-8 flex flex-col gap-lg">
                    <NewsSection news={news} />
                    <DocumentList documents={documents} />
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-lg">
                    <SidebarStats stats={stats} />
                    <WeatherWidget />
                    <MapWidget />
                </aside>
            </div>
        </div>
    );
}

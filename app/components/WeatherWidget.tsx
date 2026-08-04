export default function WeatherWidget() {
    return (
        <div className="bg-primary text-on-primary rounded-xl p-md shadow-sm relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-md">
                    <div>
                        <h3 className="font-headline-md">Cuaca Hari Ini</h3>
                        <span className="font-label-sm text-on-primary/80">Desa Makmur Jaya</span>
                    </div>
                    <span className="material-symbols-outlined text-[40px]">partly_cloudy_day</span>
                </div>
                <div className="flex items-end gap-xs">
                    <span className="font-headline-xl text-5xl leading-none">28&deg;</span>
                    <span className="font-label-md text-on-primary/80 pb-1">C</span>
                </div>
                <p className="font-body-sm mt-xs">Cerah berawan. Kemungkinan hujan 10%.</p>
            </div>
            <svg className="absolute bottom-0 right-0 w-32 h-32 text-on-primary/10 -mb-8 -mr-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.36 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z"></path>
            </svg>
        </div>
    );
}

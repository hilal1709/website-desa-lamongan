export default function MapWidget() {
    return (
        <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm flex flex-col h-64">
            <div className="p-sm bg-surface-container-high border-b border-outline-variant z-10 shadow-sm flex justify-between items-center">
                <h3 className="font-label-md text-on-surface">Peta Wilayah</h3>
                <button aria-label="Fullscreen map" className="text-primary hover:bg-primary/10 p-1 rounded-sm transition-colors">
                    <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                </button>
            </div>
            <div
                title="Map of Desa"
                aria-label="Map of Desa"
                className="w-full flex-1 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDrMmDVHoxmEyF5PV8xdFUpweDPGXoEOAjlMTPsQ4Z1U5fhf8-ZoyK9rxElnGcRXNZVWRo0Wk5pmjGXycm47EIxVPPvf5OY9vM5MG33Z464UWmzJ5AKb907RaQrLXkVXxA7FH5CLvMRAzw9O_nGGFXERFGmH0M_Nd3XRszf8B5T6D_FjFtE-tNX-aHNflpB2aJcWx2W32kKp_s7J1lQrn_JQvR4oCUoVjD-Tk9SgKCEEC5xWS2kOLz0zg')"
                }}
            ></div>
        </div>
    );
}

"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Download, Save, Trash2, Upload, UserPlus, X } from "./infographic-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CmsNoticeDialog } from "@/components/infografis/cms-notice-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
const educationOptions = ["Tidak/Belum Sekolah", "SD/MI", "SMP/MTs", "SMA/SMK/MA", "Diploma", "S1", "S2/S3"];
const occupationOptions = ["Belum/Tidak Bekerja", "Petani", "Buruh", "Wiraswasta", "Karyawan", "PNS/TNI/Polri", "Pelajar/Mahasiswa", "Ibu Rumah Tangga", "Lainnya"];
const hamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"];
const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600";
type Resident = {
    id: string;
    nationalId: string;
    fullName: string;
    familyCardNumber: string;
    gender: string;
    birthDate: string;
    dusun: string;
    education: string;
    occupation: string;
    isActive: boolean;
};
const blank = () => ({ nationalId: "", fullName: "", familyCardNumber: "", gender: "Laki-laki", birthDate: "", dusun: "", education: "SMA/SMK/MA", occupation: "Petani", isActive: true });
export function ResidentManager() {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [form, setForm] = useState(blank);
    const [query, setQuery] = useState("");
    const [editing, setEditing] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [page, setPage] = useState(1);
    const perPage = 10;
    const totalPages = Math.max(1, Math.ceil(residents.length / perPage));
    const visibleResidents = residents.slice((Math.min(page, totalPages) - 1) * perPage, Math.min(page, totalPages) * perPage);
    const notice = message ? { message, variant: /(gagal|belum dapat|tidak dapat|tidak valid|error)/i.test(message) ? "error" as const : "success" as const } : null;
    const [pendingDelete, setPendingDelete] = useState<Resident | null>(null);
    const deleteDialog = useRef<HTMLDivElement>(null);
    const load = async () => { const response = await fetch(`/api/admin/infografis/penduduk?q=${encodeURIComponent(query)}`); const data = await response.json().catch(() => ({})); if (response.ok) { setResidents(data.residents ?? []); setPage(1); } else setMessage(data.message ?? "Profil warga belum dapat dimuat."); };
    useEffect(() => { const timer = window.setTimeout(() => { void fetch("/api/admin/infografis/penduduk").then((response) => response.json().then((data) => response.ok ? setResidents(data.residents ?? []) : setMessage(data.message ?? "Profil warga belum dapat dimuat."))).catch(() => setMessage("Profil warga belum dapat dimuat.")); }, 0); return () => window.clearTimeout(timer); }, []);
    const field = (key: keyof ReturnType<typeof blank>, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
    const edit = (resident: Resident) => { setEditing(resident.id); setForm({ ...resident, birthDate: resident.birthDate.slice(0, 10) }); };
    const save = async () => { setMessage(""); const response = await fetch(editing ? `/api/admin/infografis/penduduk/${editing}` : "/api/admin/infografis/penduduk", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); setMessage(response.ok ? "Profil warga tersimpan." : data.message ?? "Profil warga gagal disimpan."); if (response.ok) {
        setForm(blank());
        setEditing(null);
        void load();
    } };
    const upload = async () => { if (!file)
        return; const body = new FormData(); body.set("file", file); const response = await fetch("/api/admin/infografis/penduduk/impor", { method: "POST", body }); const data = await response.json(); setMessage(response.ok ? `${data.created} profil warga berhasil diimpor.` : data.message ?? "Impor gagal."); if (response.ok) {
        setFile(null);
        void load();
    } };
    const remove = async () => { if (!pendingDelete)
        return; const resident = pendingDelete; setPendingDelete(null); setMessage(""); const response = await fetch(`/api/admin/infografis/penduduk/${resident.id}`, { method: "DELETE" }); const data = response.status === 204 ? null : await response.json().catch(() => ({})); setMessage(response.ok ? "Profil warga berhasil dihapus." : data.message ?? "Profil warga gagal dihapus."); if (response.ok) {
        if (editing === resident.id) {
            setEditing(null);
            setForm(blank());
        }
        ;
        void load();
    } };
    useEffect(() => {
        if (!pendingDelete || !deleteDialog.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        let context: ReturnType<typeof import("gsap").default.context> | undefined;
        let cancelled = false;
        void import("gsap").then(({ default: gsap }) => {
            if (cancelled || !deleteDialog.current)
                return;
            context = gsap.context(() => {
                gsap.timeline({ defaults: { ease: "power3.out" } })
                    .fromTo("[data-resident-delete-icon]", { autoAlpha: 0, scale: 0.7, rotate: -10 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.3 })
                    .fromTo("[data-resident-delete-copy]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.32 }, "-=0.13")
                    .fromTo("[data-resident-delete-actions]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.28 }, "-=0.16");
            }, deleteDialog);
        });
        return () => { cancelled = true; context?.revert(); };
    }, [pendingDelete]);
    return <section className="space-y-5 border-t border-slate-200 pt-8 sm:pt-10"><header><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Profil warga</p><h2 className="mt-1 text-2xl font-black text-slate-900">Pendidikan & mata pencaharian</h2><p className="mt-2 text-sm text-slate-600">Data ini menyusun grafik pendidikan dan pekerjaan publik; jumlah penduduk resmi tidak dihitung dari daftar profil ini.</p></header><div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-slate-900">Impor profil warga</h3><p className="mt-1 text-sm text-slate-600">Gunakan CSV dari template agar formatnya konsisten.</p></div><Link href="/api/admin/infografis/penduduk/template" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800"><Download className="size-4"/>Unduh template</Link></div><div className="mt-4 flex flex-wrap gap-3"><input type="file" accept=".csv,text/csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="text-sm"/><Button type="button" onClick={upload} disabled={!file}><Upload />Impor CSV</Button></div></div><section className="rounded-3xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-black text-slate-900">{editing ? "Ubah profil warga" : "Tambah profil warga"}</h3>{editing ? <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(blank()); }}>Batal</Button> : null}</div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{([['nationalId', 'NIK', 'text'], ['fullName', 'Nama lengkap', 'text'], ['familyCardNumber', 'Nomor KK', 'text'], ['birthDate', 'Tanggal lahir', 'date']] as const).map(([key, label, type]) => <label key={key} className="text-xs font-bold text-slate-700">{label}<input required type={type} value={form[key]} onChange={(event) => field(key, event.target.value)} className={inputClass}/></label>)}<label className="text-xs font-bold text-slate-700">Dusun<select required value={form.dusun} onChange={(event) => field("dusun", event.target.value)} className={inputClass}><option value="" disabled>Pilih dusun</option>{hamlets.map((hamlet) => <option key={hamlet} value={hamlet}>{hamlet}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Jenis kelamin<select value={form.gender} onChange={(event) => field("gender", event.target.value)} className={inputClass}><option>Laki-laki</option><option>Perempuan</option></select></label><label className="text-xs font-bold text-slate-700">Pendidikan<select value={form.education} onChange={(event) => field("education", event.target.value)} className={inputClass}>{educationOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Pekerjaan<select value={form.occupation} onChange={(event) => field("occupation", event.target.value)} className={inputClass}>{occupationOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div><label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.isActive} onChange={(event) => field("isActive", event.target.checked)}/>Profil aktif</label><Button type="button" onClick={save} className="mt-4"><Save />Simpan profil</Button></section><section className="overflow-hidden rounded-3xl border border-slate-200 bg-white"><header className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><h3 className="font-black text-slate-900">Profil aktif</h3><form onSubmit={(event) => { event.preventDefault(); void load(); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, NIK, atau KK" className="rounded-xl border px-3 py-2 text-sm"/></form></header><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Nama", "Dusun", "Pendidikan", "Pekerjaan", "Aksi"].map((title) => <th key={title} className="px-4 py-3">{title}</th>)}</tr></thead><tbody>{visibleResidents.map((resident) => <tr key={resident.id} className="border-t"><td className="px-4 py-3 font-semibold text-slate-900">{resident.fullName}</td><td className="px-4 py-3">{resident.dusun}</td><td className="px-4 py-3">{resident.education}</td><td className="px-4 py-3">{resident.occupation}</td><td className="px-4 py-3"><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => edit(resident)}><UserPlus />Ubah</Button><Button type="button" size="sm" variant="ghost" onClick={() => setPendingDelete(resident)} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus</Button></div></td></tr>)}{!residents.length ? <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Belum ada profil warga.</td></tr> : null}</tbody></table></div><PaginationControls page={page} totalPages={totalPages} totalItems={residents.length} pageSize={perPage} onPageChange={setPage} itemLabel="profil warga" /></section><Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open)
        setPendingDelete(null); }}><DialogContent ref={deleteDialog} className="w-[calc(100%-2rem)] max-w-md rounded-3xl border border-red-100 bg-white p-0 shadow-2xl"><div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><span data-resident-delete-icon className="grid size-12 place-items-center rounded-2xl bg-red-100 text-red-700"><AlertTriangle className="size-6"/></span><DialogClose asChild><Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-2 rounded-full" aria-label="Tutup konfirmasi hapus"><X className="size-5"/></Button></DialogClose></div><div data-resident-delete-copy className="mt-5"><p className="text-xs font-black uppercase tracking-[.16em] text-red-700">Konfirmasi penghapusan</p><DialogTitle className="mt-2 text-2xl font-black text-slate-950">Hapus profil warga?</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">Profil {pendingDelete?.fullName} akan dihapus dan tidak dapat dipulihkan.</DialogDescription></div><div data-resident-delete-actions className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose><Button type="button" onClick={remove} className="bg-red-700 text-white hover:bg-red-800"><Trash2 />Hapus data</Button></div></div></DialogContent></Dialog><CmsNoticeDialog notice={notice} onClose={() => setMessage("")}/></section>;
}

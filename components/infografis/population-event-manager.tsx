"use client"
import { BrowserlessSelect } from "@/components/ui/select"
import { LegacyDatePicker } from "@/components/ui/date-picker"
;
import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertTriangle, Pencil, Plus, Save, Trash2, X } from "./infographic-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CmsNoticeDialog } from "@/components/infografis/cms-notice-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
const hamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"];
const types = [
    { value: "KELAHIRAN", label: "Kelahiran" },
    { value: "KEMATIAN", label: "Kematian" },
    { value: "PINDAH_MASUK", label: "Pindah masuk" },
    { value: "PINDAH_KELUAR", label: "Pindah keluar" },
];
const ageGroups = ["0–5", "6–17", "18–35", "36–59", "60+"];
const genders = ["Laki-laki", "Perempuan"] as const;
export type EventRecord = {
    id: string;
    eventDate: string;
    type: string;
    dusun: string;
    fullName: string;
    nationalId: string;
    familyCardNumber: string;
    gender: string;
    birthDate: string;
    residenceAddress: string;
    originAddress: string | null;
    destinationAddress: string | null;
    notes: string | null;
};
export type BalanceRecord = {
    id: string;
    dusun: string;
    effectiveDate: string;
    totalPopulation: number;
    // Catatan yang sudah termuat sebelum migrasi belum memiliki properti ini.
    totalHouseholds?: number | null;
    demographics: unknown;
};
const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";
const blank = () => ({ eventDate: new Date().toISOString().slice(0, 10), type: "KELAHIRAN", dusun: "", fullName: "", nationalId: "", familyCardNumber: "", gender: "Laki-laki", birthDate: "", residenceAddress: "", originAddress: "", destinationAddress: "", notes: "" });
const blankDemographics = () => Object.fromEntries(ageGroups.flatMap((ageGroup) => genders.map((gender) => [`${ageGroup}:${gender}`, ""]))) as Record<string, string>;
function demographicInputs(value: unknown) {
    const inputs = blankDemographics();
    if (!Array.isArray(value))
        return inputs;
    for (const cell of value) {
        if (!cell || typeof cell !== "object")
            continue;
        const item = cell as {
            ageGroup?: unknown;
            gender?: unknown;
            total?: unknown;
        };
        if (typeof item.ageGroup === "string" && typeof item.gender === "string" && ageGroups.includes(item.ageGroup) && genders.includes(item.gender as (typeof genders)[number]))
            inputs[`${item.ageGroup}:${item.gender}`] = String(item.total ?? 0);
    }
    return inputs;
}
export function PopulationEventManager({ initialEvents, initialBalances }: { initialEvents: EventRecord[]; initialBalances: BalanceRecord[] }) {
    const [events, setEvents] = useState<EventRecord[]>(initialEvents);
    const [balances, setBalances] = useState<BalanceRecord[]>(initialBalances);
    const [balancePage, setBalancePage] = useState(1);
    const [eventPage, setEventPage] = useState(1);
    const perPage = 10;
    const totalBalancePages = Math.max(1, Math.ceil(balances.length / perPage));
    const totalEventPages = Math.max(1, Math.ceil(events.length / perPage));
    const visibleBalances = balances.slice((Math.min(balancePage, totalBalancePages) - 1) * perPage, Math.min(balancePage, totalBalancePages) * perPage);
    const visibleEvents = events.slice((Math.min(eventPage, totalEventPages) - 1) * perPage, Math.min(eventPage, totalEventPages) * perPage);
    const [form, setForm] = useState(blank);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingBalanceId, setEditingBalanceId] = useState<string | null>(null);
    const [balance, setBalance] = useState({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", totalHouseholds: "", demographics: blankDemographics() });
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        variant: "success" | "error";
    } | null>(null);
    const [pendingDelete, setPendingDelete] = useState<{
        id: string;
        type: "balance" | "event";
        title: string;
        description: string;
    } | null>(null);
    const deleteDialog = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (initialEvents.length || initialBalances.length)
            return;
        if (!pendingDelete || !deleteDialog.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        let context: ReturnType<typeof import("gsap").default.context> | undefined;
        let cancelled = false;
        void import("gsap").then(({ default: gsap }) => {
            if (cancelled || !deleteDialog.current)
                return;
            context = gsap.context(() => {
                gsap.timeline({ defaults: { ease: "power3.out" } })
                    .fromTo("[data-delete-icon]", { autoAlpha: 0, scale: 0.7, rotate: -10 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.3 })
                    .fromTo("[data-delete-copy]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.32 }, "-=0.13")
                    .fromTo("[data-delete-actions]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.28 }, "-=0.16");
            }, deleteDialog);
        });
        return () => { cancelled = true; context?.revert(); };
    }, [pendingDelete]);
    const load = async () => {
        const response = await fetch("/api/admin/infografis/kependudukan", { cache: "no-store" });
        if (!response.ok)
            throw new Error("Data peristiwa belum dapat dimuat.");
        const data = await response.json();
        setEvents(data.events);
        setBalances(data.balances);
        setBalancePage(1);
        setEventPage(1);
    };
    useEffect(() => {
        const timer = window.setTimeout(() => {
            void load().catch((error: unknown) => setToast({ message: error instanceof Error ? error.message : "Data belum dapat dimuat.", variant: "error" }));
        }, 0);
        return () => window.clearTimeout(timer);
    }, [initialBalances.length, initialEvents.length]);
    const setField = (key: keyof ReturnType<typeof blank>, value: string) => setForm((current) => ({ ...current, [key]: value }));
    const moving = form.type === "PINDAH_MASUK" || form.type === "PINDAH_KELUAR";
    async function request(url: string, method: string, body?: unknown) {
        const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
        const data = response.status === 204 ? null : await response.json();
        if (!response.ok)
            throw new Error(data?.error ?? "Permintaan tidak dapat diproses.");
        return data;
    }
    async function saveBalance(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        try {
            await request("/api/admin/infografis/saldo-awal", "POST", {
                ...balance,
                totalPopulation: Number(balance.totalPopulation),
                totalHouseholds: Number(balance.totalHouseholds),
                demographics: ageGroups.flatMap((ageGroup) => genders.map((gender) => ({ ageGroup, gender, total: Number(balance.demographics[`${ageGroup}:${gender}`]) }))),
            });
            await load();
            setEditingBalanceId(null);
            setBalance({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", totalHouseholds: "", demographics: blankDemographics() });
            setToast({ message: "Data dasar penduduk dan KK berhasil disimpan.", variant: "success" });
        }
        catch (error) {
            setToast({ message: error instanceof Error ? error.message : "Data dasar tidak dapat disimpan.", variant: "error" });
        }
        finally {
            setBusy(false);
        }
    }
    async function saveEvent(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        try {
            await request(editingId ? `/api/admin/infografis/kependudukan/${editingId}` : "/api/admin/infografis/kependudukan", editingId ? "PATCH" : "POST", form);
            await load();
            setForm(blank());
            setEditingId(null);
            setToast({ message: "Catatan peristiwa berhasil disimpan.", variant: "success" });
        }
        catch (error) {
            setToast({ message: error instanceof Error ? error.message : "Catatan tidak dapat disimpan.", variant: "error" });
        }
        finally {
            setBusy(false);
        }
    }
    function edit(record: EventRecord) {
        setEditingId(record.id);
        setForm({ eventDate: record.eventDate.slice(0, 10), type: record.type, dusun: record.dusun, fullName: record.fullName, nationalId: record.nationalId, familyCardNumber: record.familyCardNumber, gender: record.gender, birthDate: record.birthDate.slice(0, 10), residenceAddress: record.residenceAddress, originAddress: record.originAddress ?? "", destinationAddress: record.destinationAddress ?? "", notes: record.notes ?? "" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function editBalance(record: BalanceRecord) {
        setEditingBalanceId(record.id);
        setBalance({ dusun: record.dusun, effectiveDate: record.effectiveDate.slice(0, 10), totalPopulation: String(record.totalPopulation), totalHouseholds: record.totalHouseholds == null ? "" : String(record.totalHouseholds), demographics: demographicInputs(record.demographics) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    async function removeBalance(record: BalanceRecord) {
        setBusy(true);
        try {
            await request(`/api/admin/infografis/saldo-awal?id=${encodeURIComponent(record.id)}`, "DELETE");
            await load();
            if (editingBalanceId === record.id) {
                setEditingBalanceId(null);
                setBalance({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", totalHouseholds: "", demographics: blankDemographics() });
            }
            setToast({ message: "Data dasar dihapus.", variant: "success" });
        }
        catch (error) {
            setToast({ message: error instanceof Error ? error.message : "Data dasar tidak dapat dihapus.", variant: "error" });
        }
        finally {
            setBusy(false);
        }
    }
    async function remove(id: string) {
        setBusy(true);
        try {
            await request(`/api/admin/infografis/kependudukan/${id}`, "DELETE");
            await load();
            setToast({ message: "Catatan peristiwa dihapus.", variant: "success" });
        }
        catch (error) {
            setToast({ message: error instanceof Error ? error.message : "Catatan tidak dapat dihapus.", variant: "error" });
        }
        finally {
            setBusy(false);
        }
    }
    function confirmDelete() {
        if (!pendingDelete)
            return;
        const target = pendingDelete;
        setPendingDelete(null);
        if (target.type === "balance") {
            const record = balances.find((item) => item.id === target.id);
            if (record)
                void removeBalance(record);
            return;
        }
        void remove(target.id);
    }
    return <section className="space-y-6" aria-labelledby="population-event-manager-title">
    <header><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Dinamika kependudukan</p><h2 id="population-event-manager-title" className="mt-1 text-2xl font-black text-slate-900">Data dasar & peristiwa penduduk</h2><p className="mt-2 text-sm text-slate-600">Masukkan data dasar sekaligus komposisi usia dan jenis kelamin agar piramida penduduk dapat dihitung. Semua data sensitif di bawah ini hanya dapat diakses admin.</p></header>
    <form onSubmit={saveBalance} className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-black text-slate-900">{editingBalanceId ? "Ubah data dasar & komposisi" : "Atur data dasar & komposisi penduduk"}</h3>{editingBalanceId ? <Button type="button" variant="outline" onClick={() => { setEditingBalanceId(null); setBalance({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", totalHouseholds: "", demographics: blankDemographics() }); }}>Batal ubah</Button> : null}</div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-bold text-slate-700">Dusun<BrowserlessSelect required disabled={Boolean(editingBalanceId)} value={balance.dusun} onChange={(event) => setBalance((current) => ({ ...current, dusun: event.target.value }))} className={inputClass}><option value="">Pilih dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</BrowserlessSelect></label><label className="text-xs font-bold text-slate-700">Tanggal efektif<LegacyDatePicker required value={balance.effectiveDate} onChange={(event) => setBalance((current) => ({ ...current, effectiveDate: event.target.value }))} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Jumlah jiwa<input required min="0" type="number" value={balance.totalPopulation} onChange={(event) => setBalance((current) => ({ ...current, totalPopulation: event.target.value }))} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Jumlah KK<input required min="0" type="number" value={balance.totalHouseholds} onChange={(event) => setBalance((current) => ({ ...current, totalHouseholds: event.target.value }))} className={inputClass}/></label></div><div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-200 bg-white"><table className="min-w-full text-sm"><thead className="bg-emerald-100/70 text-left text-xs uppercase tracking-wide text-emerald-900"><tr><th className="px-4 py-3">Kelompok usia</th>{genders.map((gender) => <th key={gender} className="px-4 py-3">{gender}</th>)}</tr></thead><tbody>{ageGroups.map((ageGroup) => <tr key={ageGroup} className="border-t border-emerald-100"><td className="px-4 py-3 font-bold text-slate-700">{ageGroup} tahun</td>{genders.map((gender) => <td key={gender} className="px-4 py-2"><input required min="0" type="number" value={balance.demographics[`${ageGroup}:${gender}`]} onChange={(event) => setBalance((current) => ({ ...current, demographics: { ...current.demographics, [`${ageGroup}:${gender}`]: event.target.value } }))} className="h-10 w-32 rounded-lg border border-slate-200 px-3"/></td>)}</tr>)}</tbody></table></div><p className="mt-3 text-xs text-emerald-900">Jumlah KK adalah angka resmi per dusun dan tidak dihitung dari profil warga. Total 10 kolom komposisi harus sama dengan jumlah jiwa di atas.</p><div className="mt-4 flex flex-wrap items-center gap-3"><Button type="submit" disabled={busy}><Save />{editingBalanceId ? "Simpan perubahan" : "Simpan data dasar"}</Button></div></form>
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><header className="border-b border-slate-100 p-5"><h3 className="font-black text-slate-900">Data dasar per dusun</h3></header><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Dusun", "Tanggal efektif", "Jumlah jiwa", "Jumlah KK", "Aksi"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleBalances.map((record) => <tr key={record.id}><td className="px-4 py-3 font-semibold text-slate-900">{record.dusun}</td><td className="whitespace-nowrap px-4 py-3">{record.effectiveDate.slice(0, 10)}</td><td className="px-4 py-3">{record.totalPopulation.toLocaleString("id-ID")} jiwa</td><td className="px-4 py-3">{record.totalHouseholds == null ? "Belum diisi" : `${record.totalHouseholds.toLocaleString("id-ID")} KK`}</td><td className="whitespace-nowrap px-4 py-3"><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => editBalance(record)}><Pencil />Ubah</Button><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => setPendingDelete({ id: record.id, type: "balance", title: "Hapus data dasar?", description: `Data dasar ${record.dusun} akan dihapus dan tidak dapat dipulihkan.` })} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus</Button></div></td></tr>)}{!balances.length ? <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Belum ada data dasar.</td></tr> : null}</tbody></table></div><PaginationControls page={balancePage} totalPages={totalBalancePages} totalItems={balances.length} pageSize={perPage} onPageChange={setBalancePage} itemLabel="data dasar" /></article>
    <form onSubmit={saveEvent} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-black text-slate-900">{editingId ? "Ubah peristiwa penduduk" : "Input peristiwa penduduk"}</h3><p className="mt-1 text-sm text-slate-500">Biodata lengkap diwajibkan. NIK, KK, alamat, dan catatan tidak dipublikasikan.</p></div>{editingId ? <Button type="button" variant="outline" onClick={() => { setForm(blank()); setEditingId(null); }}>Batal ubah</Button> : null}</div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><label className="text-xs font-bold text-slate-700">Tanggal peristiwa<LegacyDatePicker required value={form.eventDate} onChange={(event) => setField("eventDate", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Jenis peristiwa<BrowserlessSelect value={form.type} onChange={(event) => setField("type", event.target.value)} className={inputClass}>{types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</BrowserlessSelect></label><label className="text-xs font-bold text-slate-700">Dusun<BrowserlessSelect required value={form.dusun} onChange={(event) => setField("dusun", event.target.value)} className={inputClass}><option value="">Pilih dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</BrowserlessSelect></label><label className="text-xs font-bold text-slate-700">Nama lengkap<input required value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">NIK<input required inputMode="numeric" value={form.nationalId} onChange={(event) => setField("nationalId", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Nomor KK<input required inputMode="numeric" value={form.familyCardNumber} onChange={(event) => setField("familyCardNumber", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Jenis kelamin<BrowserlessSelect value={form.gender} onChange={(event) => setField("gender", event.target.value)} className={inputClass}><option>Laki-laki</option><option>Perempuan</option></BrowserlessSelect></label><label className="text-xs font-bold text-slate-700">Tanggal lahir<LegacyDatePicker required value={form.birthDate} onChange={(event) => setField("birthDate", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Alamat domisili<input required value={form.residenceAddress} onChange={(event) => setField("residenceAddress", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Alamat asal<input required={moving} value={form.originAddress} onChange={(event) => setField("originAddress", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Alamat tujuan<input required={moving} value={form.destinationAddress} onChange={(event) => setField("destinationAddress", event.target.value)} className={inputClass}/></label><label className="text-xs font-bold text-slate-700">Catatan<textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"/></label></div><div className="mt-5"><Button type="submit" disabled={busy}>{editingId ? <Pencil /> : <Plus />}{editingId ? "Simpan perubahan" : "Tambah peristiwa"}</Button></div></form>
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><header className="border-b border-slate-100 p-5"><h3 className="font-black text-slate-900">Catatan terbaru</h3></header><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Tanggal", "Peristiwa", "Nama", "NIK", "Dusun", "Aksi"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleEvents.map((record) => <tr key={record.id}><td className="whitespace-nowrap px-4 py-3">{record.eventDate.slice(0, 10)}</td><td className="whitespace-nowrap px-4 py-3">{types.find((item) => item.value === record.type)?.label}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{record.fullName}</td><td className="whitespace-nowrap px-4 py-3">{record.nationalId}</td><td className="whitespace-nowrap px-4 py-3">{record.dusun}</td><td className="whitespace-nowrap px-4 py-3"><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => edit(record)}><Pencil />Ubah</Button><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => setPendingDelete({ id: record.id, type: "event", title: "Hapus catatan peristiwa?", description: `Catatan ${record.fullName} akan dihapus dan tidak dapat dipulihkan.` })} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus</Button></div></td></tr>)}{!events.length ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Belum ada catatan peristiwa.</td></tr> : null}</tbody></table></div><PaginationControls page={eventPage} totalPages={totalEventPages} totalItems={events.length} pageSize={perPage} onPageChange={setEventPage} itemLabel="catatan peristiwa" /></article>
    <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open)
        setPendingDelete(null); }}><DialogContent ref={deleteDialog} className="w-[calc(100%-2rem)] max-w-md rounded-3xl border border-red-100 bg-white p-0 shadow-2xl"><div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><span data-delete-icon className="grid size-12 place-items-center rounded-2xl bg-red-100 text-red-700"><AlertTriangle className="size-6"/></span><DialogClose asChild><Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-2 rounded-full" aria-label="Tutup konfirmasi hapus"><X className="size-5"/></Button></DialogClose></div><div data-delete-copy className="mt-5"><p className="text-xs font-black uppercase tracking-[.16em] text-red-700">Konfirmasi penghapusan</p><DialogTitle className="mt-2 text-2xl font-black text-slate-950">{pendingDelete?.title}</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">{pendingDelete?.description}</DialogDescription></div><div data-delete-actions className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose><Button type="button" onClick={confirmDelete} className="bg-red-700 text-white hover:bg-red-800"><Trash2 />Hapus data</Button></div></div></DialogContent></Dialog>
    <CmsNoticeDialog notice={toast} onClose={() => setToast(null)}/>
  </section>;
}




# Laporan Security Audit — 29 Agustus 2026

## Ringkasan

Proyek menggunakan Next.js 16, PostgreSQL melalui Prisma, dan autentikasi admin berbasis sesi. Kata sandi menggunakan `scrypt`; token sesi dihasilkan secara acak, disimpan sebagai hash SHA-256, dan cookie telah memakai `HttpOnly`, `SameSite=Lax`, serta `Secure` pada produksi. Query data memakai Prisma tanpa SQL mentah yang ditemukan.

Perbaikan defensif telah diterapkan untuk kontrol akses, CSRF berbasis origin, pembatasan laju, dan header keamanan. Data kependudukan serta kesehatan tetap membutuhkan kebijakan publikasi yang lebih ketat sebelum produksi.

## Temuan dan tindakan

| Severity | Komponen | Risiko | Tindakan |
| --- | --- | --- | --- |
| High | Endpoint CMS unggahan, produk UMKM, arsip, dan pengajuan layanan | Pengguna yang sudah login tetapi tidak memiliki izin modul dapat membaca atau mengubah data tertentu. | Diperbaiki: semua endpoint tersebut kini memverifikasi izin RBAC per modul dan aksi (`view`, `create`, `update`, atau `delete`). |
| High | Mutasi dengan cookie sesi | Tanpa verifikasi origin menyeluruh, permintaan lintas situs berpotensi memicu CSRF pada browser tertentu/konfigurasi mendatang. | Diperbaiki: `proxy.ts` menolak seluruh mutasi yang membawa header `Origin` berbeda dari origin aplikasi. |
| Medium | Endpoint publik dan administratif | Percobaan login, spam, atau automasi dapat bertambah pada deployment multi-instance bila pembatasan hanya tersimpan di proses lokal. | Diperbaiki: limiter Upstash terpusat diterapkan dari proxy untuk API publik, CMS, admin, dan kesehatan; fallback lokal hanya dipakai bila Upstash tidak tersedia. |
| Medium | Header respons | Tidak ada CSP, anti-clickjacking, atau pembatasan browser capability yang terpusat. | Diperbaiki di `next.config.ts`, termasuk CSP yang mengizinkan hanya dependensi eksternal yang digunakan aplikasi. |
| Medium | `/api/infografis/kependudukan/export` | Endpoint publik mengekspor nama warga, jenis kelamin, tahun lahir, dusun, dan peristiwa kependudukan. Ini dapat menjadi pengungkapan data pribadi berlebihan. | Belum diubah agar tidak menghapus/merombak fitur publik tanpa keputusan pemilik data. Lihat rekomendasi prioritas. |
| Low | Unggahan file | Validasi saat ini mengandalkan MIME type dari browser; ini mengurangi risiko tetapi belum melakukan inspeksi signature/antivirus. | Belum diubah: rekomendasi verifikasi magic bytes dan malware scanning pada storage gateway. |
| Low | Audit log | Perubahan administratif tanpa jejak permanen mengurangi kemampuan investigasi insiden. | Diperbaiki: AuditLog menyimpan aktivitas login, mutasi CMS/kesehatan yang terotorisasi, pengelolaan akun/role, data warga, arsip, dan unduhan privat; kredensial serta data warga tidak dicatat. |

## Cakupan audit

- Autentikasi/sesi/RBAC: ditinjau di `lib/admin-auth.ts`, `lib/access-control.ts`, Server Action login, layout admin, serta seluruh route handler.
- Database: Prisma digunakan secara terparameterisasi; tidak ditemukan penggunaan `$queryRaw`, `$executeRaw`, shell command, atau kredensial tertanam dalam source aplikasi.
- Input/XSS: input utama dibatasi dan dirender React; penggunaan `dangerouslySetInnerHTML` adalah JSON-LD. Beberapa JSON-LD sudah meng-escape karakter `<`; semua yang baru harus mengikuti pola itu.
- Unggahan: nama penyimpanan memakai UUID dan lampiran privat disimpan di `storage/` atau signed URL, bukan direktori publik. Gambar CMS adalah aset publik sesuai fungsinya.
- Konfigurasi: `.env*` diabaikan Git; secret service role hanya dibaca server-side.

## Verifikasi

- TypeScript: lulus (`tsc --noEmit`).
- ESLint: lulus.
- Production build Next.js: lulus.
- `git diff --check`: lulus.
- `npm audit` belum dapat dijalankan karena instalasi executable npm global pada host rusak (module `npm-cli.js` tidak ditemukan). Jalankan kembali di CI/host yang memiliki npm sehat.

## Rekomendasi produksi

1. Jadikan ekspor detail peristiwa kependudukan sebagai endpoint admin saja, atau hilangkan identitas individu dan hanya sediakan agregat publik.
2. Gunakan Redis/Upstash atau WAF/CDN rate limiting untuk menggantikan limiter proses-lokal pada deployment multi-instance.
3. Aktifkan `ENABLE_HSTS=true` hanya setelah seluruh domain/subdomain benar-benar HTTPS.
4. Simpan `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dan `PUSHER_SECRET` di secret manager; rotasi segera bila pernah bocor. Bucket lampiran layanan dan arsip harus privat dengan signed URL singkat.
5. Tambahkan audit log permanen untuk login berhasil/gagal, perubahan role, perubahan akun, penghapusan data, dan unduhan dokumen privat; jangan pernah mencatat password/token/NIK penuh.
6. Pastikan backup terenkripsi, diuji pemulihannya, dan disimpan di luar web root dengan akses least-privilege.

## Checklist rilis

- [x] Password di-hash dan sesi memakai cookie aman.
- [x] Otorisasi backend untuk endpoint yang diperbaiki.
- [x] Mutasi lintas-origin ditolak.
- [x] Input utama dan upload memiliki batas tipe/ukuran.
- [x] Header keamanan diterapkan dan CSP disesuaikan dengan dependensi aplikasi.
- [x] Rate limit terdistribusi Upstash untuk API publik dan administratif.
- [ ] Keputusan kebijakan untuk data kependudukan publik dan ekspornya.
- [x] Audit log terstruktur untuk aktivitas administratif utama.
- [ ] Backup terenkripsi dan dependency audit di CI.

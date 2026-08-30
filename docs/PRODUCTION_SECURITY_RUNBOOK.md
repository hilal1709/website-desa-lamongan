# Runbook Keamanan Produksi

## Verifikasi RLS sebelum deploy

Jalankan dari lingkungan yang memiliki `DATABASE_URL` produksi atau staging:

```powershell
node scripts/verify-rls.mjs
```

Skrip tidak mencetak data. Tabel sensitif wajib bertuliskan `PASS (denied)`. Tabel statistik agregat legacy hanya boleh bertuliskan `PASS (public aggregate)` bila memang ada dan disetujui untuk publik.

## WAF/CDN edge

Konfigurasikan pada CDN/WAF di depan domain produksi:

- Aktifkan mitigasi bot dan managed OWASP ruleset.
- Terapkan challenge atau block untuk pola scanning, SQL injection, dan XSS.
- Buat rate limit edge untuk `/login`, `/api/layanan/pengajuan`, `/api/aduan`, `/api/layanan/lacak`, dan `/api/*` administratif. Gunakan batas yang sama atau lebih ketat dari limiter Upstash aplikasi.
- Bypass cache untuk `/admin/*`, `/login`, dan `/api/*`; jangan cache respons yang membawa cookie atau data pribadi.
- Aktifkan HSTS hanya setelah seluruh domain dan subdomain memakai HTTPS.

## Backup dan pemulihan

- Aktifkan backup harian terenkripsi pada proyek Supabase dan tetapkan retensi sesuai kebijakan desa.
- Simpan salinan backup di lokasi terpisah dengan akses least-privilege.
- Setiap tiga bulan, restore backup ke database staging kosong, jalankan smoke test login serta data agregat, lalu catat waktu pemulihan dan hasilnya.
- Jangan melakukan uji restore pada produksi.

## Rotasi secret

Lakukan melalui dashboard penyedia masing-masing, bukan dengan menaruh secret baru di source code:

1. Buat service-role key Supabase baru atau rotate key sesuai prosedur proyek.
2. Buat password database baru dan perbarui `DATABASE_URL` serta `DIRECT_URL` di secret manager deployment.
3. Rotate `PUSHER_SECRET` di Pusher dan perbarui deployment.
4. Deploy satu instance baru, jalankan smoke test upload CMS dan lampiran privat, lalu cabut secret lama.
5. Restart/redeploy seluruh instance agar koneksi lama tidak tertinggal.

Jika secret pernah terlihat di chat, commit, log, atau screenshot, perlakukan sebagai bocor dan lakukan rotasi segera.

## Monitoring dan alert

- Kirim log aplikasi ke penyedia observability yang memiliki retensi dan kontrol akses.
- Buat alert lima-menit untuk: login gagal berulang, respons `403`/`429` meningkat, error `5xx`, dan kegagalan koneksi Upstash/Supabase.
- Arahkan alert kritis ke kanal on-call administrator, bukan ke channel publik.
- Tinjau halaman CMS **Audit Log** setiap minggu dan simpan prosedur respons insiden.

## Kepemilikan

WAF/CDN, backup Supabase, rotasi key, dan kanal alert harus dijalankan oleh pemilik akun layanan terkait. Project ini tidak menyimpan kredensial dashboard tersebut.

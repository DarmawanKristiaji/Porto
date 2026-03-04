# Portfolio Website (Ready to Use)

Website portfolio statis dengan panel admin CRUD berbasis `localStorage`.

## Fitur

- CRUD untuk:
  - Profil
  - Tentang
  - Kontak
  - Project
- Media embed per project:
  - YouTube
  - Google Drive Video
  - Google Drive PDF/Slide/File
  - Embed URL langsung
- Export data ke JSON
- Import data dari JSON
- Reset data ke default

## Cara Pakai

1. Buka `index.html` untuk halaman viewer.
2. Buka `admin.html` untuk halaman admin CRUD.
3. Edit data pada tiap form admin lalu klik simpan.
4. Data otomatis tersimpan di browser (localStorage) dan langsung tampil di viewer.

## Format Link Media

### YouTube
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

### Google Drive File / Video / PDF
- `https://drive.google.com/file/d/FILE_ID/view?...`

### Google Slides
- `https://docs.google.com/presentation/d/SLIDE_ID/edit?...`

### Google Docs / Sheets
- `https://docs.google.com/document/d/DOC_ID/edit?...`
- `https://docs.google.com/spreadsheets/d/SHEET_ID/edit?...`

> Pastikan file/link Google Drive dan Google Docs diset ke **Anyone with the link can view** agar bisa tampil dalam embed.

## Backup dan Pindah Device

- Klik **Export JSON** untuk backup data.
- Klik **Import JSON** untuk restore data di browser/device lain.

## Deploy Cepat

Bisa di-deploy sebagai static site ke:
- Netlify
- Vercel
- GitHub Pages

Cukup upload semua file dalam folder ini.

## Deploy ke GitHub

1. Inisialisasi git dan push ke repo GitHub:

```bash
git init
git branch -M main
git add .
git commit -m "Initial portfolio deployment"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

2. Aktifkan GitHub Pages:
  - Repository `Settings` → `Pages`
  - Source: `GitHub Actions`
3. Workflow [deploy-pages.yml](.github/workflows/deploy-pages.yml) akan auto-deploy setiap push ke branch `main`.

## Deploy ke Railway

Project ini sudah siap Railway dengan:
- [railway.json](railway.json)
- [Dockerfile](Dockerfile)
- [nginx.conf.template](nginx.conf.template)

Langkah deploy:
1. Login ke Railway
2. Klik `New Project` → `Deploy from GitHub repo`
3. Pilih repo portfolio Anda
4. Railway akan build otomatis dari `Dockerfile`
5. Setelah live, set custom domain (opsional)

Jika ingin stream log deployment/runtime:
- Buka service di Railway → tab `Deployments` / `Logs`
- Atau gunakan Railway CLI (`railway logs`) setelah login

## Alternatif selain Railway

### Opsi 1 — Vercel (paling cepat)

File konfigurasi sudah tersedia: [vercel.json](vercel.json)

Langkah:
1. Login ke Vercel
2. Klik `Add New...` → `Project`
3. Import repo GitHub `DarmawanKristiaji/Porto`
4. Framework: `Other` (static), lalu `Deploy`

### Opsi 2 — Render

File konfigurasi sudah tersedia: [render.yaml](render.yaml)

Langkah:
1. Login ke Render
2. Klik `New +` → `Blueprint`
3. Pilih repo GitHub `DarmawanKristiaji/Porto`
4. Render akan membaca `render.yaml` dan deploy static site otomatis

Kedua opsi di atas tetap mendukung:
- Viewer: `index.html`
- Admin: `admin.html`
- Data CRUD via localStorage browser

## Production Checklist

1. Ganti semua `https://your-domain.com` di:
  - `index.html`
  - `admin.html`
  - `robots.txt`
  - `sitemap.xml`
2. Jika pakai domain Railway/GitHub Pages, isi URL final domain tersebut pada file di atas.
3. Buka `admin.html` dan buat PIN admin saat pertama kali akses.
4. Pastikan semua link Google Drive/Docs media bersifat **Anyone with the link can view**.
5. Verifikasi:
  - Viewer: `index.html`
  - Admin: `admin.html` (minta PIN)
  - Robots dan sitemap dapat diakses.

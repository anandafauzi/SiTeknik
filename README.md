# SiTeknik — Website Bisnis Jasa Teknik & Perawatan Rumah Tangerang Selatan

Website bisnis profesional untuk usaha jasa teknik dan perawatan rumah yang melayani seluruh wilayah Kota Tangerang Selatan (Tangsel) dan sekitarnya. 

Website ini dibangun menggunakan arsitektur modern full-stack **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, database terkelola mandiri dengan persistensi data real-time, integrasi pemesanan langsung ke **WhatsApp Admin (wa.me)**, **Kalkulator Prakiraan Biaya Interaktif**, dan **Chatbot AI Virtual Assistant dengan sistem Retrieval-Augmented Generation (RAG)**.

---

## 🌟 3 Layanan Utama

1. **Jasa Instalasi Listrik Bergaransi**
   - Instalasi baru rumah & ruko, penambahan titik lampu (outbow/inbow), penambahan stop kontak/saklar, perapian kabel standar SNI, penggantian MCB & box panel pembagian fasa, investigasi korsleting listrik, dan instalasi grounding arde.
   - Dilengkapi garansi pekerjaan resmi 30 hingga 90 hari.

2. **Jasa Instalasi & Cuci AC**
   - Cuci AC bersih menyeluruh (0.5 PK s/d 2.5 PK), pasang AC baru/lama wajib vakum mesin, bongkar pasang relokasi, tambah/isi ulang freon (R32, R410A, R22), dan perbaikan keluhan AC tidak dingin atau bocor air netes indoor.
   - Dilengkapi garansi cuci AC 30 hari.

3. **Jasa Pengeboran Sumur Tangsel**
   - Pembuatan sumur bor dangkal Jet Pump (20-30 meter), sumur dalam Submersible (30-45 meter), dan deep well (50-60+ meter) yang disesuaikan dengan lapisan geologi tanah Tangerang Selatan (lempung merah Ciputat/Pamulang vs pasir berbatu Serpong/BSD).
   - Dilengkapi garansi debit air 90 hari & garansi instalasi pipa AW 6 bulan.

---

## 🚀 Fitur Unggulan

### 1. Desain Modern, Responsif & Mobile-First
- Menggunakan identitas warna **Navy Blue** (`#0B192C`), dasar **Putih Bersih**, dan aksen **Oranye Energik** (`#F97316`).
- Tipografi modern dan mudah dibaca oleh semua kalangan.
- Navigasi responsif dengan hamburger drawer untuk smartphone dan dropdown menu di desktop.

### 2. Kalkulator Prakiraan Biaya Interaktif (`/kalkulator`)
- Menghitung estimasi biaya berdasarkan data harga aktif dari database.
- Terbagi menjadi 3 tab: Listrik, AC, dan Bor Sumur.
- Menampilkan rincian transparan per komponen, subtotal, biaya tambahan, dan total estimasi.
- Dilengkapi disclaimer resmi dan tombol **"Pesan Berdasarkan Estimasi"** yang otomatis menghasilkan pesan WhatsApp berformat lengkap.

### 3. Chatbot AI — Virtual Assistant Bisnis (RAG System)
- Floating widget interaktif di pojok kanan bawah yang tidak menutupi tombol WhatsApp.
- Terhubung langsung dengan basis pengetahuan bisnis (RAG) yang mencakup layanan, harga, garansi, SOP kerja, estimasi waktu, wilayah pelayanan, dan tips persiapan pelanggan.
- **Aturan Jawaban Ketat**: AI tidak mengarang harga atau mendiagnosis kerusakan mutlak sebelum pemeriksaan teknisi di lapangan.
- Dilengkapi integrasi **Google Gemini API** (`gemini-1.5-flash`) dengan fallback otomatis ke smart RAG engine bawaan jika API Key belum dipasang.
- Tombol **"Hubungi Admin via WhatsApp"** otomatis menyertakan ringkasan percakapan pelanggan.

### 4. Galeri & Bukti Dokumentasi Pekerjaan Asli (`/galeri`)
- Foto asli dokumentasi pekerjaan teknisi di wilayah Tangsel (BSD City, Bintaro, Pamulang, Ciputat, Serpong).
- Fitur filter kategori dan modal perbesar foto (lightbox) dengan toggle perbandingan **Sebelum (Before) & Hasil Akhir (After)**.
- Seluruh dokumentasi dapat ditambah, diedit, dan dihapus oleh admin.

### 5. Integrasi Pemesanan WhatsApp (wa.me)
- Seluruh alur konversi (Navbar, Hero, Kartu Layanan, Halaman Detail, Hasil Kalkulator, Chatbot, dan Floating Button) terhubung langsung ke WhatsApp Admin.
- Format pesan pesanan otomatis terisi: Nama, Kategori Layanan, Detail Pekerjaan, Lokasi, Estimasi Biaya, dan Catatan Tambahan.
- Nomor WhatsApp admin dapat diubah sewaktu-waktu melalui dashboard admin tanpa mengubah kode program.

### 6. Dashboard Admin Lengkap & Aman (`/admin`)
- Dilindungi autentikasi login sesi JWT (`/admin/login`).
  - **Username Default**: `admin`
  - **Password Default**: `admin123`
- **Manajemen Layanan**: Ubah judul, deskripsi, foto, cakupan pekerjaan, SOP, dan harga awal.
- **Manajemen Harga**: Tambah/edit/hapus tarif jasa, satuan kerja, dan parameter kalkulator.
- **Manajemen Galeri**: Unggah foto baru, tentukan lokasi di Tangsel, tanggal pengerjaan, dan foto before/after.
- **Manajemen Garansi**: Atur durasi garansi, butir cakupan, syarat klaim, dan pengecualian.
- **Manajemen Chatbot & RAG**: Tambah/edit/hapus dokumen pengetahuan, FAQ, pesan sapaan, daftar quick questions, dan pengaturan Gemini API Key.
- **Pengaturan Website**: Ubah nama bisnis, tagline, nomor WhatsApp, alamat kantor di Tangsel, dan daftar kecamatan yang dilayani.

### 7. Optimasi SEO & Schema LocalBusiness
- Meta tags terstruktur (Title, Description, OpenGraph, Twitter Card).
- Schema JSON-LD `LocalBusiness` / `HomeAndConstructionBusiness` mencakup nama usaha, nomor telepon, alamat Tangsel, jam operasional, dan wilayah jangkauan kecamatan.
- Dynamic `sitemap.xml` dan `robots.txt`.

---

## 🛠️ Panduan Menjalankan Proyek

### 1. Menjalankan Mode Pengembangan (Dev Server)
```bash
npm run dev
```
Akses di browser: `http://localhost:3000`

### 2. Membangun & Menjalankan Versi Produksi
```bash
npm run build
npm run start
```

### 3. Akses Panel Admin
1. Buka browser di: `http://localhost:3000/admin/login`
2. Masukkan kredensial:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Anda dapat langsung mengelola layanan, harga, galeri, chatbot, dan nomor WhatsApp admin.

---

## 📁 Struktur Direktori Proyek

```text
SiTeknik-app/
├── data/
│   └── siteknik_db.json         # Database utama (Layanan, Harga, Galeri, Garansi, RAG, Pengaturan)
├── src/
│   ├── app/
│   │   ├── page.tsx             # Homepage utama
│   │   ├── layout.tsx           # Root layout + Schema LocalBusiness
│   │   ├── globals.css          # Styling & Tailwind directives
│   │   ├── sitemap.ts           # Dynamic SEO Sitemap
│   │   ├── robots.ts            # Dynamic Robots.txt
│   │   ├── layanan/             # Halaman detail layanan
│   │   │   ├── listrik/page.tsx
│   │   │   ├── ac/page.tsx
│   │   │   └── bor-sumur/page.tsx
│   │   ├── galeri/page.tsx      # Galeri dokumentasi kerja
│   │   ├── kalkulator/page.tsx  # Kalkulator estimasi biaya
│   │   ├── tentang-kami/page.tsx# Profil & ketentuan garansi
│   │   ├── kontak/page.tsx      # Kontak & form booking
│   │   ├── admin/               # Dashboard admin terproteksi
│   │   │   ├── page.tsx         # Overview statistik
│   │   │   ├── login/page.tsx   # Login admin
│   │   │   ├── layanan/page.tsx # Manajemen layanan
│   │   │   ├── harga/page.tsx   # Manajemen harga & kalkulator
│   │   │   ├── galeri/page.tsx  # Manajemen galeri
│   │   │   ├── garansi/page.tsx # Manajemen garansi
│   │   │   ├── chatbot/page.tsx # Manajemen RAG chatbot & FAQ
│   │   │   └── pengaturan/page.tsx # Pengaturan website & WA
│   │   └── api/                 # Endpoint backend & REST API
│   │       ├── auth/            # Auth login / logout / me
│   │       ├── services/        # Public services list
│   │       ├── gallery/         # Public gallery list
│   │       ├── calculator/      # Calculation engine
│   │       ├── chat/            # RAG Chatbot API
│   │       └── admin/           # Admin CRUD APIs
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, Floating Buttons, AppShell
│   │   ├── home/                # Hero, Keunggulan, Ringkasan, Wilayah, Ulasan
│   │   ├── calculator/          # Interactive calculator components
│   │   ├── chatbot/             # AI Chatbot floating widget
│   │   ├── gallery/             # Gallery grid & Before/After modal
│   │   └── admin/               # Admin sidebar & UI
│   └── lib/
│       ├── db.ts                # Database engine & default seed data
│       ├── types.ts             # TypeScript definitions
│       ├── auth.ts              # JWT & bcrypt password handler
│       ├── rag.ts               # RAG retriever & Gemini AI integration
│       └── whatsapp.ts          # WhatsApp URL generator with templates
└── package.json
```


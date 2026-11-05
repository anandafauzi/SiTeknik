-- ============================================================
-- SiTeknik — Supabase Database Schema
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kpcbgqrzyxzjrdzskpdq/sql/new
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: services
-- ============================================================
create table if not exists services (
  id text primary key,
  slug text unique not null,
  title text not null,
  category text not null check (category in ('listrik', 'ac', 'bor-sumur')),
  short_description text not null,
  full_description text not null,
  icon text not null default 'Wrench',
  image text not null default '',
  features jsonb not null default '[]',
  job_types jsonb not null default '[]',
  process_steps jsonb not null default '[]',
  warranty_info text not null default '',
  estimated_time text not null default '',
  starting_price integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: pricing
-- ============================================================
create table if not exists pricing (
  id text primary key,
  category text not null check (category in ('listrik', 'ac', 'bor-sumur')),
  code text unique not null,
  name text not null,
  unit text not null,
  base_price integer not null default 0,
  description text not null default '',
  is_addon boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: gallery
-- ============================================================
create table if not exists gallery (
  id text primary key,
  title text not null,
  category text not null,
  image_url text not null,
  before_image_url text,
  after_image_url text,
  job_type text not null,
  location text not null,
  date text not null,
  description text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: warranties
-- ============================================================
create table if not exists warranties (
  id text primary key,
  service_category text not null check (service_category in ('listrik', 'ac', 'bor-sumur')),
  title text not null,
  duration text not null,
  coverage jsonb not null default '[]',
  claim_terms jsonb not null default '[]',
  exclusions jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: knowledge
-- ============================================================
create table if not exists knowledge (
  id text primary key,
  category text not null,
  topic text not null,
  content text not null,
  keywords jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- TABLE: chatbot_config (single row)
-- ============================================================
create table if not exists chatbot_config (
  id integer primary key default 1 check (id = 1),
  greeting text not null,
  quick_questions jsonb not null default '[]',
  disclaimer text not null default '',
  fallback_message text not null default ''
);

-- ============================================================
-- TABLE: site_settings (single row)
-- ============================================================
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'SiTeknik Tangerang Selatan',
  tagline text not null default '',
  whatsapp_number text not null default '6281234567890',
  phone_display text not null default '0812-3456-7890',
  email text not null default '',
  address text not null default '',
  city text not null default 'Tangerang Selatan',
  operating_hours text not null default '',
  hero_headline text not null default '',
  hero_subheadline text not null default '',
  service_areas jsonb not null default '[]',
  gemini_api_key text not null default ''
);

-- ============================================================
-- TABLE: admin_users
-- ============================================================
create table if not exists admin_users (
  id text primary key,
  username text unique not null,
  password_hash text not null,
  name text not null default 'Admin',
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY — Disable for server-side only access
-- (we use service_role key on server, anon key blocked by RLS)
-- ============================================================
alter table services enable row level security;
alter table pricing enable row level security;
alter table gallery enable row level security;
alter table warranties enable row level security;
alter table knowledge enable row level security;
alter table chatbot_config enable row level security;
alter table site_settings enable row level security;
alter table admin_users enable row level security;

-- Public read policies (anon can read public data)
create policy "public_read_services" on services for select using (true);
create policy "public_read_pricing" on pricing for select using (true);
create policy "public_read_gallery" on gallery for select using (true);
create policy "public_read_warranties" on warranties for select using (true);
create policy "public_read_knowledge" on knowledge for select using (true);
create policy "public_read_chatbot_config" on chatbot_config for select using (true);
create policy "public_read_site_settings" on site_settings for select using (true);

-- Admin writes use service_role key (bypasses RLS entirely)
-- No need for write policies with service_role

-- ============================================================
-- SEED DATA — Initial Records
-- ============================================================

-- Site Settings
insert into site_settings (id, business_name, tagline, whatsapp_number, phone_display, email, address, city, operating_hours, hero_headline, hero_subheadline, service_areas, gemini_api_key)
values (
  1,
  'SiTeknik Tangerang Selatan',
  'Solusi Instalasi & Perawatan Rumah Aman, Profesional, dan Bergaransi',
  '6281234567890',
  '0812-3456-7890',
  'layanan@siteknik.com',
  'Jl. Raya Serpong No. 88, Tangerang Selatan, Banten 15310',
  'Tangerang Selatan',
  'Senin - Minggu: 07.30 - 20.00 WIB (Layanan Darurat Siaga)',
  'Solusi Instalasi dan Perawatan Rumah yang Aman, Profesional, dan Bergaransi.',
  'Melayani instalasi listrik, pemasangan dan perawatan AC, serta pengeboran sumur untuk kebutuhan rumah dan bangunan di Tangerang Selatan dan sekitarnya.',
  '["Ciputat","Ciputat Timur","Pamulang","Pondok Aren","Serpong","Serpong Utara","Setu","Pondok Cabe","Bintaro","BSD City"]',
  ''
) on conflict (id) do nothing;

-- Chatbot Config
insert into chatbot_config (id, greeting, quick_questions, disclaimer, fallback_message)
values (
  1,
  'Halo! Saya Asisten Virtual SiTeknik. Ada yang bisa saya bantu terkait jasa instalasi listrik, AC, atau bor sumur di Tangerang Selatan?',
  '["Berapa harga cuci AC 1 PK?","Apakah instalasi listrik bergaransi?","Berapa estimasi biaya bor sumur 30 meter?","Area mana saja di Tangsel yang dijangkau?","AC saya tidak dingin, apa penyebabnya?"]',
  'Informasi harga dan layanan mengacu pada database resmi SiTeknik. Untuk kepastian kondisi lapangan dan pemesanan, silakan lanjutkan via WhatsApp Admin.',
  'Untuk pertanyaan dengan spesifikasi khusus tersebut, saya sarankan untuk mengonfirmasi langsung dengan Admin teknisi kami agar mendapatkan pengecekan yang lebih akurat. Apakah Anda ingin saya hubungkan ke WhatsApp Admin?'
) on conflict (id) do nothing;

-- Admin User (password: admin123)
insert into admin_users (id, username, password_hash, name)
values (
  'adm-01',
  'admin',
  '$2a$10$n4j7tLhF0YQhWvM5Z0vBTeNn5qQo3l3gK0YgK9u7WnL6U2f3C6Qh6',
  'Admin SiTeknik'
) on conflict (id) do nothing;

-- Services
insert into services (id, slug, title, category, short_description, full_description, icon, image, features, job_types, process_steps, warranty_info, estimated_time, starting_price) values
('srv-listrik', 'listrik', 'Jasa Instalasi Listrik Bergaransi', 'listrik',
  'Instalasi listrik baru, penambahan titik lampu, stop kontak, panel MCB, dan perbaikan gangguan korsleting berstandar SNI & bergaransi.',
  'Layanan jasa instalasi dan perbaikan listrik profesional untuk rumah tinggal, ruko, kantor, dan bangunan di Tangerang Selatan. Dikerjakan oleh teknisi bersertifikat dengan standar keselamatan kerja ketat (K3), penggunaan material berkualitas standar SNI, serta jaminan garansi pekerjaan untuk kenyamanan dan keamanan hunian Anda.',
  'Zap',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
  '["Teknisi listrik berpengalaman & bersertifikat","Pengerjaan rapi mengacu standar SNI & PUIL","Pemeriksaan beban listrik menyeluruh","Garansi pekerjaan hingga 90 hari","Peralatan pengujian digital modern","Konsultasi & estimasi biaya transparan"]',
  '["Instalasi listrik rumah baru & renovasi","Penambahan titik lampu (inbow / outbow / downlight)","Penambahan stop kontak & saklar","Perbaikan instalasi listrik & pelacakan korsleting","Penggantian kabel listrik aus / lapuk standar SNI","Pemasangan MCB, ELCB/RCBO, dan Box Panel Listrik","Pemeriksaan dan perbaikan gangguan lonjakan listrik","Instalasi grounding / arde penangkal petir"]',
  '[{"step":1,"title":"Konsultasi & Jadwal","description":"Sampaikan kebutuhan dan lokasi di Tangerang Selatan via WhatsApp untuk estimasi awal dan jadwal survei/eksekusi."},{"step":2,"title":"Pemeriksaan Lapangan","description":"Teknisi melakukan inspeksi fisik jalur kelistrikan, pengukuran beban, dan konfirmasi rincian pekerjaan serta material."},{"step":3,"title":"Pengerjaan Sesuai SOP","description":"Instalasi atau perbaikan dikerjakan dengan mematikan arus utama sementara dan mengutamakan keselamatan kerja (K3)."},{"step":4,"title":"Pengujian & Sertifikasi Garansi","description":"Pengujian fungsionalitas dan beban listrik, pembersihan area kerja, dan penerbitan nota bergaransi resmi."}]',
  'Garansi instalasi listrik 30 hingga 90 hari tergantung jenis pekerjaan.',
  '2 - 6 jam tergantung jumlah titik dan kompleksitas jalur kabel.',
  65000
),
('srv-ac', 'ac', 'Jasa Instalasi dan Cuci AC', 'ac',
  'Cuci AC menyeluruh, pemasangan unit AC baru/bekas, bongkar pasang, tambah/isi freon, dan perbaikan AC tidak dingin atau bocor air.',
  'Solusi lengkap perawatan dan pemasangan pendingin ruangan (AC Split 0.5 PK s/d 2.5 PK, Inverter & Non-Inverter) di seluruh kawasan Tangerang Selatan.',
  'Wind',
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop',
  '["Pembersihan indoor & outdoor unit menyeluruh","Vakum pipa wajib saat pasang AC baru","Peralatan cuci bersih dengan cover pelindung dinding","Pengecekan tekanan freon & arus ampere","Garansi cuci AC (kebocoran/kurang dingin) 30 hari","Melayani AC Split standar, inverter, hingga kaset/standing"]',
  '["Cuci AC berkala (0.5 PK - 1 PK)","Cuci AC berkala (1.5 PK - 2 PK)","Pemasangan unit AC baru / bekas","Bongkar pasang unit AC relokasi","Pemeriksaan AC tidak dingin / berisik","Pemeriksaan & perbaikan kebocoran air indoor","Pengisian / penambahan freon R32, R410A, R22","Pergantian kapasitor, sensor suhu, atau modul PCB"]',
  '[{"step":1,"title":"Pemesanan & Diagnosa","description":"Pilih layanan AC (cuci/pasang/perbaikan) dan pilih kapasitas unit PK Anda."},{"step":2,"title":"Pemasangan Proteksi","description":"Teknisi memasang plastik cover pelindung dinding & perabotan agar lantai dan tembok tetap bersih."},{"step":3,"title":"Pembersihan / Instalasi","description":"Penyemprotan evaporator, blower, filter, dan kondensor outdoor dengan water jet bertekanan pas."},{"step":4,"title":"Tes Suhu & Tekanan","description":"Pengukuran hembusan udara dingin, cek arus listrik, dan perapian selang drainase."}]',
  'Garansi cuci AC 30 hari terhadap keluhan tetesan air (bocor indoor) dan garansi instalasi pipa 30 hari.',
  'Cuci AC 45-60 menit/unit. Instalasi baru 2-3 jam.',
  75000
),
('srv-bor-sumur', 'bor-sumur', 'Jasa Pengeboran Sumur Tangsel', 'bor-sumur',
  'Pembuatan sumur bor jet pump & submersible kedalaman 20 - 60+ meter, instalasi pompa air, torn, dan perbaikan sumur kering atau keruh.',
  'Penyedia jasa bor sumur air bersih terpercaya untuk rumah tinggal dan komersial di Tangerang Selatan.',
  'Drill',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
  '["Peralatan mesin bor hidrolik & manual sesuai akses lokasi","Paham karakteristik lapisan tanah Tangerang Selatan","Pipa casing tebal standar AW tahan tekanan tanah","Garansi debit air & kejernihan air (syarat ketentuan)","Pilihan paket komplit (pengeboran + pompa + pemasangan)","Solusi untuk air bau besi, keruh, atau sumur kering saat kemarau"]',
  '["Pengeboran sumur dangkal Jet Pump (20 - 30 meter)","Pengeboran sumur dalam Submersible (30 - 45 meter)","Pengeboran sumur industri / komersial (50 - 60+ meter)","Pemasangan pompa air baru (Jet Pump / Submersible / Booster)","Instalasi pipa hisap, pipa dorong, dan toren air otomatis","Servis sumur bor (kuras sumur, ganti pipa jebol, angkat pompa macet)","Pemasangan filter penjernih air & karbon aktif"]',
  '[{"step":1,"title":"Survei Titik & Karakteristik Tanah","description":"Penentuan titik bor bebas kontaminasi septictank (jarak aman >10m) dan analisis kedalaman mata air lokal."},{"step":2,"title":"Mobilisasi Alat & Pengeboran","description":"Pengeboran dengan mata bor baja hingga menembus lapisan pasir air tawar bersih (akuifer bebas zat besi)."},{"step":3,"title":"Pemasangan Casing & Gravel Pack","description":"Pemasangan pipa cashing PVC AW dan batu gravel untuk menyaring pasir halus agar air tetap jernih."},{"step":4,"title":"Kuras (Spooling) & Pasang Pompa","description":"Pembersihan sisa lumpur hingga air keluar bening, dilanjutkan instalasi pompa dan tes debit air."}]',
  'Garansi debit air hingga 90 hari dan garansi instalasi pipa sumur selama 6 bulan.',
  '1 - 3 hari kerja tergantung kedalaman dan lapisan bebatuan tanah.',
  3500000
)
on conflict (id) do nothing;

-- Pricing (Listrik)
insert into pricing (id, category, code, name, unit, base_price, description, is_addon) values
('prc-el-01','listrik','EL_TITIK_LAMPU','Jasa Pasang Titik Lampu Baru (tanpa bobok/outbow)','titik',65000,'Jasa penarikan kabel dan fitting lampu jalur outbow',false),
('prc-el-02','listrik','EL_TITIK_LAMPU_BOBOK','Jasa Pasang Titik Lampu Baru (bobok tembok/inbow)','titik',95000,'Penarikan kabel dengan bobok dinding rapi dan plester ulang',false),
('prc-el-03','listrik','EL_STOP_KONTAK','Jasa Pasang / Tambah Stop Kontak / Saklar','titik',75000,'Pemasangan unit stop kontak baru termasuk sambungan kabel',false),
('prc-el-04','listrik','EL_KABEL_METER','Kabel Listrik NYM 3x2.5mm SNI (Supreme/Eterna)','meter',18000,'Kabel tembaga tunggal berisolasi tebal standar PLN',false),
('prc-el-05','listrik','EL_PASANG_MCB','Jasa Penggantian / Pasang MCB Box Panel','unit',120000,'Pemasangan unit MCB baru dan perapian jalur pembagian fasa',false),
('prc-el-06','listrik','EL_CEK_KORSLET','Jasa Pelacakan & Perbaikan Korsleting Listrik','titik/kasus',150000,'Investigasi jalur kabel korslet dengan multimeter digital',false),
('prc-el-07','listrik','EL_GROUNDING','Instalasi Grounding / Arde Pengaman','titik',250000,'Penanaman rod tembaga pengaman lonjakan petir dan kebocoran arus',true),
-- Pricing (AC)
('prc-ac-01','ac','AC_CUCI_05_10','Cuci AC Split (0.5 PK - 1 PK)','unit',75000,'Pembersihan total indoor + outdoor, blower, cek tekanan freon',false),
('prc-ac-02','ac','AC_CUCI_15_20','Cuci AC Split (1.5 PK - 2 PK)','unit',90000,'Pembersihan total kapasitas besar indoor + outdoor',false),
('prc-ac-03','ac','AC_PASANG_05_10','Jasa Pasang AC Baru/Lama (0.5 PK - 1 PK)','unit',250000,'Termasuk jasa pasang bracket, sambung pipa, dan vakum mesin',false),
('prc-ac-04','ac','AC_PASANG_15_20','Jasa Pasang AC Baru/Lama (1.5 PK - 2 PK)','unit',320000,'Jasa pasang unit kapasitas besar termasuk proses vakum instalasi',false),
('prc-ac-05','ac','AC_BONGKAR_PASANG','Bongkar Pasang AC (Relokasi Ruangan/Rumah)','unit',375000,'Pelepasan unit lama, simpan freon (pump down), pasang di lokasi baru',false),
('prc-ac-06','ac','AC_TAMBAH_FREON_R32','Tambah Freon R32 / R410A (0.5 - 1 PK)','unit',150000,'Penambahan tekanan freon sampai standar dingin optimal',false),
('prc-ac-07','ac','AC_ISI_FULL_FREON','Isi Ulang Full Freon R32 / R410A (karena bocor habis)','unit',275000,'Pengisian penuh setelah perbaikan titik kebocoran',false),
('prc-ac-08','ac','AC_PIPA_TEMBAGA','Pipa Tembaga AC Berkualitas (Tateyama / Hoda)','meter',95000,'Pipa tembaga tebal anti korosi & anti bocor per meter',true),
-- Pricing (Bor Sumur)
('prc-sm-01','bor-sumur','SM_BOR_20_30M','Pengeboran Sumur Jet Pump (Kedalaman 20 - 30 Meter)','paket',3500000,'Cocok untuk kawasan air dangkal bersih',false),
('prc-sm-02','bor-sumur','SM_BOR_30_45M','Pengeboran Sumur Dalam Submersible (Kedalaman 30 - 45 Meter)','paket',6500000,'Sumber air lebih jernih dan bebas bau besi',false),
('prc-sm-03','bor-sumur','SM_BOR_50_60M','Pengeboran Sumur Dalam Submersible (Kedalaman 50 - 60+ Meter)','paket',9500000,'Solusi kawasan tanah berbatu / bukit kering di Tangerang Selatan',false),
('prc-sm-04','bor-sumur','SM_PASANG_POMPA_JET','Jasa Pemasangan Pompa Air Jet Pump','unit',350000,'Pemasangan mata jet, pipa hisap, kabel, dan penyetelan otomatis',false),
('prc-sm-05','bor-sumur','SM_PASANG_SUBMERSIBLE','Jasa Pemasangan Pompa Celup Submersible','unit',500000,'Pemasangan kabel kedap air, tali pengaman baja, control box, dan pipa dorong',false),
('prc-sm-06','bor-sumur','SM_PIPA_INSTALASI','Instalasi Jalur Pipa PVC ke Toren / Rumah','meter',25000,'Pipa PVC Rucika AW + sambungan lem kuat',true),
('prc-sm-07','bor-sumur','SM_KURAS_SUMUR','Jasa Kuras Sumur / Cuci Sumur Bor Macet','pekerjaan',750000,'Pembersihan endapan pasir dan lumpur dasar sumur menggunakan kompresor',true)
on conflict (id) do nothing;

-- Gallery
insert into gallery (id, title, category, image_url, before_image_url, after_image_url, job_type, location, date, description) values
('gal-01','Perapian Panel MCB & Instalasi Rumah 2 Lantai','listrik','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop','Penggantian Box Panel MCB Schneider & Jalur Grounding','Cluster Foresta, BSD City, Serpong','2026-10-18','Perapian jalur kelistrikan rumah 2 lantai yang sering trip akibat kelebihan beban tidak seimbang.'),
('gal-02','Cuci AC & Servis Kebocoran Indoor Split 1 PK','cuci-ac','https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop',null,null,'Cuci AC Berkala + Pembersihan Saluran Drainase','Bintaro Sektor 7, Pondok Aren','2026-10-24','Keluhan AC netes air di kamar utama dan hembusan berbau apak.'),
('gal-03','Pengeboran Sumur Dalam 42 Meter Pompa Submersible','bor-sumur','https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',null,null,'Pembuatan Sumur Bor Baru & Pemasangan Pompa Submersible 0.5 HP','Pamulang Permai 1, Pamulang','2026-10-12','Pembuatan sumur baru di area padat penduduk.'),
('gal-04','Pemasangan 12 Titik Lampu Downlight LED & Saklar','listrik','https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',null,null,'Instalasi Titik Lampu Plafon Baru','Perumahan Puri Serpong, Setu','2026-10-29','Instalasi titik lampu warm white estetis dengan kabel NYM 3x1.5mm berpipa konduit pelindung plafon.'),
('gal-05','Instalasi Unit Baru AC Daikin Inverter 1.5 PK','ac','https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',null,null,'Pemasangan AC Baru Lengkap Vakum Mesin','Ciputat Timur, Tangerang Selatan','2026-11-01','Pemasangan AC Inverter baru dengan pipa tembaga tebal 0.7mm.'),
('gal-06','Perbaikan Sumur Keruh & Penggantian Pipa Hisap Jet Pump','bor-sumur','https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',null,null,'Kuras Sumur & Ganti Mata Jet','Pondok Cabe Ilir, Pamulang','2026-10-05','Sumur lama usia 7 tahun mengalami hisapan pasir dan air menguning.')
on conflict (id) do nothing;

-- Warranties
insert into warranties (id, service_category, title, duration, coverage, claim_terms, exclusions) values
('war-listrik','listrik','Ketentuan Garansi Instalasi Listrik','30 hingga 90 Hari Kalender',
  '["Kerapian dan kekuatan sambungan kabel pada titik lampu/saklar/stop kontak baru.","Kinerja fungsional MCB dan box panel yang dipasang oleh teknisi kami.","Koreksi bebas biaya jika titik yang dikerjakan mengalami putus kontak atau longgar."]',
  '["Menunjukkan bukti foto/invoice digital pemesanan via WhatsApp SiTeknik.","Klaim dilaporkan dalam kurun waktu masa aktif garansi.","Teknisi akan dikirimkan maksimal 1x24 jam setelah laporan klaim diterima."]',
  '["Gangguan yang diakibatkan oleh korsleting dari perangkat elektronik eksternal pelanggan yang rusak.","Sambungan kabel yang telah dibongkar atau diubah sendiri oleh pihak lain tanpa persetujuan SiTeknik.","Bencana alam, sambaran petir langsung, atau banjir yang merendam instalasi."]'),
('war-ac','ac','Ketentuan Garansi Servis & Cuci AC','30 Hari Kalender',
  '["Bocor air (netes) pada unit indoor setelah pencucian atau relokasi.","Kekencangan sambungan nepel pipa freon dari kebocoran yang dipasang teknisi.","Kinerja fungsi hembusan pendinginan pasca pemasangan unit."]',
  '["Melampirkan nomor handphone yang terdaftar saat pemesanan.","Garansi berlaku untuk unit AC yang sama yang tercatat di nota pekerjaan."]',
  '["Kerusakan kompresor aus akibat usia pemakaian unit yang sudah lebih dari 7 tahun.","Kebocoran pada pipa lama yang tidak diganti dan sudah lapuk/korosi sebelumnya.","Tegangan listrik rumah pelanggan yang tidak stabil (drop di bawah 190V) yang merusak PCB."]'),
('war-bor','bor-sumur','Ketentuan Garansi Pengeboran Sumur','Garansi Debit Air 90 Hari & Garansi Instalasi 6 Bulan',
  '["Jaminan ketersediaan debit sumber air tawar bersih pada kedalaman yang disepakati.","Kekuatan instalasi pipa casing dari risiko amblas atau pecah sambungan pipa dorong.","Garansi instalasi pompa air tidak bocor pada drat sambungan."]',
  '["Pengujian debit air dilakukan bersama pelanggan saat serah terima pekerjaan.","Jika terjadi penurunan debit drastis dalam masa garansi, kami lakukan pengeboran ulang atau pendalaman tanpa biaya jasa tambahan."]',
  '["Kekeringan ekstrem skala regional yang menurunkan permukaan air tanah secara luas.","Kerusakan mesin pompa akibat pemakaian saat tidak ada aliran air (dry run) oleh pengguna.","Penurunan kualitas air akibat pencemaran limbah lingkungan eksternal di kemudian hari."]')
on conflict (id) do nothing;

-- Knowledge Base
insert into knowledge (id, category, topic, content, keywords) values
('kn-01','wilayah','Wilayah Pelayanan SiTeknik','SiTeknik melayani seluruh wilayah Kota Tangerang Selatan dan area perbatasan sekitarnya, meliputi: Kecamatan Ciputat, Ciputat Timur, Pamulang, Pondok Aren, Serpong, Serpong Utara, Setu, kawasan Bintaro Jaya (Sektor 1 s/d 9), BSD City, Alam Sutera, dan Pondok Cabe.','["wilayah","area","lokasi","tangsel","tangerang selatan","ciputat","pamulang","bsd","bintaro","serpong","setu","pondok aren","pondok cabe"]'),
('kn-02','ac','Harga Cuci AC dan Jenis Kapasitas PK','Biaya jasa cuci AC SiTeknik adalah Rp75.000 per unit untuk AC kapasitas 0.5 PK hingga 1 PK, dan Rp90.000 per unit untuk AC kapasitas 1.5 PK hingga 2 PK.','["harga cuci ac","biaya cuci ac","cuci ac 1 pk","cuci ac 0.5 pk","cuci ac 2 pk","tarif cuci ac"]'),
('kn-03','ac','Pemasangan dan Bongkar Pasang AC','Jasa pasang AC baru/lama kapasitas 0.5 PK - 1 PK adalah Rp250.000, sedangkan untuk 1.5 PK - 2 PK adalah Rp320.000. Jasa bongkar pasang (relokasi) adalah Rp375.000 per unit.','["pasang ac","bongkar pasang ac","biaya pasang ac","relokasi ac","pasang ac baru","tarif pasang ac"]'),
('kn-04','ac','AC Tidak Dingin Penyebab dan Solusi','AC yang tidak dingin umumnya dapat disebabkan oleh beberapa kemungkinan: 1) Filter atau evaporator tertutup debu tebal sehingga perlu dicuci; 2) Tekanan freon berkurang akibat adanya kebocoran nepel/pipa; 3) Kerusakan komponen kapasitor atau kompresor tidak berputar.','["ac tidak dingin","ac kurang dingin","kenapa ac tidak dingin","ac bau","penyebab ac tidak dingin"]'),
('kn-05','listrik','Daftar Harga Jasa Instalasi Listrik','Harga jasa pasang titik lampu baru tanpa bobok (outbow) adalah Rp65.000 per titik. Jika dengan bobokan tembok (inbow) adalah Rp95.000 per titik. Jasa tambah stop kontak / saklar Rp75.000 per titik.','["harga listrik","biaya pasang stop kontak","biaya pasang lampu","korsleting","biaya ganti mcb","tarif teknisi listrik"]'),
('kn-06','listrik','Garansi Pekerjaan Instalasi Listrik','Setiap pekerjaan instalasi listrik di SiTeknik dilengkapi garansi resmi selama 30 hingga 90 hari kalender tergantung jenis pekerjaan.','["garansi listrik","apakah bergaransi","berapa lama garansi listrik","klaim garansi"]'),
('kn-07','bor-sumur','Pengeboran Sumur dan Estimasi Biaya','Biaya pengeboran sumur SiTeknik: 1) Sumur dangkal Jet Pump (20-30 meter) mulai dari Rp3.500.000; 2) Sumur dalam Submersible (30-45 meter) mulai dari Rp6.500.000; 3) Sumur dalam kawasan berbatu (50-60+ meter) mulai dari Rp9.500.000.','["biaya bor sumur","harga bor sumur","sumur jet pump","sumur submersible","bor sumur pamulang","bor sumur bsd","bor sumur ciputat"]'),
('kn-08','bor-sumur','Kondisi Tanah Tangerang Selatan & Kebutuhan Sumur','Di kawasan Tangerang Selatan seperti Pamulang, Ciputat, dan Pondok Aren umumnya memiliki lapisan tanah lempung merah, dengan kedalaman mata air bersih berkisar 24 - 36 meter.','["tanah tangsel","kedalaman sumur tangsel","air bau besi","air kuning","sumur submersible vs jet pump"]'),
('kn-09','umum','Cara Pemesanan dan Konsultasi Teknisi','Pemesanan layanan SiTeknik sangat mudah: pilih layanan atau gunakan kalkulator estimasi di website, lalu tekan tombol Pesan via WhatsApp untuk terhubung langsung dengan Admin.','["cara pesan","cara booking","nomor wa","whatsapp","kontak","hubungi"]'),
('kn-10','umum','Persiapan Pelanggan Sebelum Teknisi Datang','Sebelum teknisi datang ke lokasi Anda: 1) Pastikan akses menuju titik kerja tidak terhalang barang berat; 2) Sediakan sumber air dan colokan listrik jika memerlukan pengetesan alat.','["persiapan","sebelum teknisi datang","tips","panduan"]')
on conflict (id) do nothing;


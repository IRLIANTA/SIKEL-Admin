-- SIKEL Admin: skema database Supabase
-- Jalankan di Supabase > SQL Editor > New query > Run

create table if not exists public.keluarga (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kec text not null,
  desa text not null,
  anggota int not null default 0 check (anggota >= 0),
  balita int not null default 0 check (balita >= 0),
  remaja int not null default 0 check (remaja >= 0),
  lansia int not null default 0 check (lansia >= 0),
  kb_aktif boolean not null default false,
  metode text not null default '',
  ikut_bkb boolean not null default false,
  ikut_bkr boolean not null default false,
  ikut_bkl boolean not null default false,
  rumah_layak boolean not null default false,
  air_bersih boolean not null default false,
  sanitasi boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.kelompok (
  id uuid primary key default gen_random_uuid(),
  jenis text not null check (jenis in ('BKB','BKR','BKL','UPPKA','PIK-R','Kampung KB','Rumah Data','PPKS')),
  nama text not null,
  kec text not null,
  desa text not null,
  anggota int not null default 0 check (anggota >= 0),
  aktif int not null default 0 check (aktif >= 0),
  pertemuan int not null default 0 check (pertemuan >= 0),
  pengurus boolean not null default false,
  pencatatan boolean not null default false,
  kegiatan boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.layanan_kb (
  id uuid primary key default gen_random_uuid(),
  bulan text not null check (bulan ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  kec text not null,
  desa text not null,
  fasilitas text not null,
  metode text not null check (metode in ('Suntik','Pil','Kondom')),
  pelayanan int not null default 0 check (pelayanan >= 0),
  efek int not null default 0 check (efek >= 0),
  gagal int not null default 0 check (gagal >= 0),
  dirujuk int not null default 0 check (dirujuk >= 0),
  tuntas int not null default 0 check (tuntas >= 0),
  created_at timestamptz not null default now(),
  check (efek + gagal <= pelayanan),
  check (dirujuk <= efek + gagal),
  check (tuntas <= dirujuk)
);

create table if not exists public.target_instrumen (
  id uuid primary key default gen_random_uuid(),
  kec text not null,
  desa text not null,
  indikator text not null,
  nilai numeric not null check (nilai >= 0),
  updated_at timestamptz not null default now(),
  unique (kec, desa, indikator)
);

create index if not exists keluarga_wil on public.keluarga (kec, desa);
create index if not exists kelompok_wil on public.kelompok (kec, desa);
create index if not exists layanan_wil on public.layanan_kb (kec, desa, bulan);

-- Keamanan: hanya pengguna yang sudah login (admin) yang boleh membaca dan mengubah data
alter table public.keluarga enable row level security;
alter table public.kelompok enable row level security;
alter table public.layanan_kb enable row level security;
alter table public.target_instrumen enable row level security;

do $$
declare t text;
begin
  foreach t in array array['keluarga','kelompok','layanan_kb','target_instrumen'] loop
    execute format('drop policy if exists "admin penuh" on public.%I', t);
    execute format('create policy "admin penuh" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

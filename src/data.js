import { WILAYAH, KECAMATAN, TOTAL_DESA } from "./wilayah.js";
import { NAMA_BULAN } from "./shared.jsx";

export const METODE = ["Suntik", "Pil", "Kondom", "IUD", "Implan"];
export const JENIS_POKTAN = ["BKB", "BKR", "BKL", "UPPKA", "PIK-R", "Kampung KB", "Rumah Data", "PPKS"];
export const BULAN = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
export const BIAYA = { Suntik: 18000, Pil: 12000, Kondom: 6000 };

export const hitungKeluarga = (k) => {
  let s = k.kbAktif ? 25 : 0;
  s += (+k.balita > 0 ? (k.ikutBKB ? 15 : 0) : 15) + (+k.remaja > 0 ? (k.ikutBKR ? 15 : 0) : 15) + (+k.lansia > 0 ? (k.ikutBKL ? 15 : 0) : 15);
  s += (k.rumahLayak ? 10 : 0) + (k.airBersih ? 10 : 0) + (k.sanitasi ? 10 : 0);
  return s;
};
export const klasKeluarga = (s) => (s >= 75 ? "Mandiri" : s >= 50 ? "Berkembang" : "Rentan");
export const hitungPoktan = (p) => {
  const aktif = +p.anggota ? Math.min(+p.aktif / +p.anggota, 1) : 0;
  return Math.round(aktif * 20 + Math.min(+p.pertemuan, 2) * 10 + (p.pengurus ? 20 : 0) + (p.pencatatan ? 20 : 0) + (p.kegiatan ? 20 : 0));
};
export const klasPoktan = (s) => (s >= 80 ? "Berkembang" : s >= 60 ? "Tumbuh" : "Dasar");

// pembangkit angka acak tetap (seed) agar data demo konsisten
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

const NAMA = ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Gunawan", "Hana", "Irwan", "Jamilah", "Kiki", "Lukman", "Maya", "Nando", "Omar", "Putri", "Rudi", "Siti", "Tono", "Wati"];
const pilih = (r, arr) => arr[Math.floor(r() * arr.length)];

export const bangkitkanData = () => {
  const r = mulberry(2026);
  const keluarga = [], poktan = [];
  let id = 1;
  KECAMATAN.forEach((kec) => {
    const desaList = WILAYAH[kec];
    const n = 4 + Math.floor(r() * 7);
    for (let i = 0; i < n; i++) {
      const m = r(), kb = r() < 0.62;
      keluarga.push({
        id: id++, nama: pilih(r, NAMA), kec, desa: pilih(r, desaList),
        anggota: 2 + Math.floor(r() * 6), balita: r() < 0.4 ? 1 : 0, remaja: r() < 0.35 ? 1 : 0, lansia: r() < 0.25 ? 1 : 0,
        kbAktif: kb, metode: kb ? (m < 0.5 ? "Suntik" : m < 0.75 ? "Pil" : m < 0.85 ? "Kondom" : m < 0.93 ? "IUD" : "Implan") : "",
        ikutBKB: r() < 0.45, ikutBKR: r() < 0.4, ikutBKL: r() < 0.4,
        rumahLayak: r() < 0.7, airBersih: r() < 0.75, sanitasi: r() < 0.65,
      });
    }
    const np = 1 + Math.floor(r() * 2);
    for (let i = 0; i < np; i++) {
      const jenis = pilih(r, JENIS_POKTAN), desa = pilih(r, desaList), anggota = 15 + Math.floor(r() * 30);
      poktan.push({ id: id++, jenis, nama: `${jenis} ${desa}`, kec, desa, anggota, aktif: Math.floor(anggota * (0.5 + r() * 0.5)), pertemuan: Math.floor(r() * 3), pengurus: r() < 0.7, pencatatan: r() < 0.55, kegiatan: r() < 0.65 });
    }
  });
  const layanan = [];
  const rate = { Suntik: [0.08, 0.03], Pil: [0.1, 0.05], Kondom: [0.01, 0.04] };
  const base = { Suntik: 20, Pil: 11, Kondom: 6 };
  KECAMATAN.forEach((kec) => {
    const dl = WILAYAH[kec];
    [...new Set([pilih(r, dl), pilih(r, dl)])].forEach((desa) => {
      ["Suntik", "Pil", "Kondom"].forEach((metode) => {
        BULAN.forEach((bulan, i) => {
          const pelayanan = Math.round(base[metode] * (0.8 + i * 0.05) * (0.7 + r() * 0.6));
          const efek = Math.round(pelayanan * rate[metode][0] * (0.5 + r())), gagal = Math.round(pelayanan * rate[metode][1] * (0.5 + r()));
          const dirujuk = Math.round((efek + gagal) * 0.5), tuntas = Math.max(0, dirujuk - (r() < 0.2 ? 1 : 0));
          layanan.push({ id: id++, bulan, kec, desa, fasilitas: "Pustu " + desa, metode, pelayanan, efek, gagal, dirujuk, tuntas });
        });
      });
    });
  });
  return { keluarga, poktan, layanan };
};

export const ringkasWilayah = (keluarga, poktan) => {
  const kb = keluarga.filter((k) => k.kbAktif).length;
  const kls = keluarga.map((k) => klasKeluarga(hitungKeluarga(k)));
  return { keluarga: keluarga.length, kb, pctKb: keluarga.length ? Math.round((kb / keluarga.length) * 100) : 0, rentan: kls.filter((x) => x === "Rentan").length, mandiri: kls.filter((x) => x === "Mandiri").length, poktan: poktan.length };
};

export const jumlahDesa = (w) => (w.desa !== "Semua" ? 1 : w.kec !== "Semua" ? WILAYAH[w.kec].length : TOTAL_DESA);

const jum = (arr, k) => arr.reduce((a, x) => a + (+x[k] || 0), 0);
const persen = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);

export const hitungMonev = (keluarga, poktan, layanan, wil, bulanList, bulanAkhir) => {
  const akhir = layanan.filter((l) => l.bulan === bulanAkhir);
  const per = (m, b) => jum(layanan.filter((l) => l.metode === m && l.bulan === b), "pelayanan");
  const cakupan = bulanList.map((b) => ({ bulan: NAMA_BULAN[+b.slice(5) - 1], Suntik: per("Suntik", b), Pil: per("Pil", b), Kondom: per("Kondom", b) }));
  const mutu = ["Suntik", "Pil", "Kondom"].map((j) => { const x = layanan.filter((l) => l.metode === j); return { jenis: j, peserta: jum(akhir.filter((l) => l.metode === j), "pelayanan"), efek: jum(x, "efek"), gagal: jum(x, "gagal"), biaya: BIAYA[j] }; });
  const pel = jum(layanan, "pelayanan"), efek = jum(layanan, "efek"), gagal = jum(layanan, "gagal"), dirujuk = jum(layanan, "dirujuk"), tuntas = jum(layanan, "tuntas");
  const pelAkhir = jum(akhir, "pelayanan");
  const nd = jumlahDesa(wil), rs = ringkasWilayah(keluarga, poktan);
  const fas = new Set(layanan.map((l) => l.fasilitas + "|" + l.desa + "|" + l.kec)).size;
  const desaLayan = new Set(layanan.map((l) => l.desa + "|" + l.kec)).size;
  const ikut = keluarga.filter((k) => k.ikutBKB || k.ikutBKR || k.ikutBKL).length;
  const biaya = mutu.reduce((a, m) => a + m.biaya * m.peserta, 0);
  const pk = (a, b) => persen(a, b) + "%";
  const bc = poktan.filter((p) => p.pencatatan).length, rutin = poktan.filter((p) => +p.pertemuan >= 1).length;
  const tingkat = {
    Input: { tanya: "Sumber daya yang tersedia", item: [["Fasilitas pelayanan aktif", fas + " unit"], ["Desa terlayani", desaLayan + " dari " + nd + " desa"], ["Keluarga terdata", rs.keluarga], ["Perkiraan biaya layanan bulan terakhir", "Rp " + biaya.toLocaleString("id-ID")]] },
    Proses: { tanya: "Kegiatan yang dijalankan", item: [["Total pelayanan KB non-MKJP", pel], ["Rata-rata pelayanan per bulan", bulanList.length ? Math.round(pel / bulanList.length) : 0], ["Kelompok dengan pencatatan", pk(bc, poktan.length)], ["Kelompok bertemu rutin", pk(rutin, poktan.length)]] },
    Output: { tanya: "Hasil langsung layanan (bulan terakhir)", item: mutu.map((m) => ["Pelayanan " + m.jenis.toLowerCase(), m.peserta]).concat([["Total pelayanan", pelAkhir]]) },
    Outcome: { tanya: "Mutu pelayanan", item: [["Kejadian efek samping", efek + " kasus (" + pk(efek, pel) + ")"], ["Kasus kegagalan", gagal + " kasus (" + pk(gagal, pel) + ")"], ["Kasus dirujuk", dirujuk], ["Rujukan tuntas", tuntas + " dari " + dirujuk]] },
    Impact: { tanya: "Kondisi keluarga di wilayah", item: [["Peserta KB aktif", pk(rs.kb, rs.keluarga) + " keluarga"], ["Keluarga berkategori Mandiri", pk(rs.mandiri, rs.keluarga)], ["Keluarga berkategori Rentan", rs.rentan + " keluarga"], ["Keluarga ikut kelompok kegiatan", pk(ikut, rs.keluarga)]] },
  };
  return { cakupan, mutu, tingkat };
};

// Instrumen monitoring: target vs realisasi
export const hitungInstrumen = (keluarga, poktan, layanan, wil, bulanAkhir, ubah) => {
  const akhir = layanan.filter((l) => l.bulan === bulanAkhir);
  const nd = jumlahDesa(wil), rs = ringkasWilayah(keluarga, poktan);
  const pel = jum(layanan, "pelayanan"), pelAkhir = jum(akhir, "pelayanan");
  const efek = jum(layanan, "efek"), gagal = jum(layanan, "gagal"), dirujuk = jum(layanan, "dirujuk"), tuntas = jum(layanan, "tuntas");
  const fas = new Set(layanan.map((l) => l.fasilitas + "|" + l.desa + "|" + l.kec)).size;
  const ikut = keluarga.filter((k) => k.ikutBKB || k.ikutBKR || k.ikutBKL).length;
  const bc = poktan.filter((p) => p.pencatatan).length, rutin = poktan.filter((p) => +p.pertemuan >= 1).length;
  const bk = poktan.filter((p) => klasPoktan(hitungPoktan(p)) === "Berkembang").length;
  const seed = (id) => 0.9 + mulberry(hash(wil.kec + wil.desa + id))() * 0.4;
  const I = (id, nama, satuan, realisasi, target, arah = "naik") => ({ id, nama, satuan, realisasi, target: ubah[id] ?? target, targetAwal: target, arah });
  return {
    Input: [I("fas", "Fasilitas pelayanan KB aktif", "unit", fas, Math.max(1, Math.ceil(nd / 4))), I("kel", "Keluarga terdata", "keluarga", rs.keluarga, Math.max(1, Math.ceil(nd * 0.7)))],
    Proses: [I("pel", "Pelayanan KB non-MKJP (seluruh bulan)", "pelayanan", pel, Math.max(10, Math.round(pel * seed("pel")))), I("cat", "Kelompok dengan pencatatan kegiatan", "%", persen(bc, poktan.length), 80), I("rut", "Kelompok bertemu rutin (minimal 1 kali per bulan)", "%", persen(rutin, poktan.length), 80)],
    Output: [I("pelA", "Pelayanan KB non-MKJP bulan terakhir", "pelayanan", pelAkhir, Math.max(5, Math.round(pelAkhir * seed("pelA")))), I("kb", "Keluarga menjadi peserta KB aktif", "%", persen(rs.kb, rs.keluarga), 70), I("ikut", "Keluarga ikut kelompok kegiatan", "%", persen(ikut, rs.keluarga), 60)],
    Outcome: [I("efek", "Kejadian efek samping", "% dari pelayanan", persen(efek, pel), 6, "turun"), I("gagal", "Kasus kegagalan", "% dari pelayanan", persen(gagal, pel), 3, "turun"), I("tuntas", "Rujukan komplikasi dan kegagalan tuntas", "%", dirujuk ? persen(tuntas, dirujuk) : 100, 90)],
    Impact: [I("mand", "Keluarga berkategori Mandiri", "%", persen(rs.mandiri, rs.keluarga), 40), I("rent", "Keluarga berkategori Rentan", "%", persen(rs.rentan, rs.keluarga), 20, "turun"), I("berk", "Kelompok kegiatan berklasifikasi Berkembang", "%", persen(bk, poktan.length), 40)],
  };
};
export const capaian = (i) => {
  const t = +i.target, r = +i.realisasi;
  if (i.arah === "turun") return r <= t ? 100 : r > 0 ? Math.round((t / r) * 100) : 100;
  return t > 0 ? Math.min(100, Math.round((r / t) * 100)) : 0;
};
export const statusCapaian = (c) => (c >= 90 ? ["Tercapai", ""] : c >= 60 ? ["Sebagian", "mid"] : ["Perlu perhatian", "low"]);

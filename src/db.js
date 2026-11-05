import { supabase } from "./supabase.js";

const num = (v) => Math.max(0, Number(v) || 0);

export const MAP = {
  keluarga: {
    to: (k) => ({ nama: k.nama, kec: k.kec, desa: k.desa, anggota: num(k.anggota), balita: num(k.balita), remaja: num(k.remaja), lansia: num(k.lansia), kb_aktif: !!k.kbAktif, metode: k.kbAktif ? k.metode : "", ikut_bkb: !!k.ikutBKB, ikut_bkr: !!k.ikutBKR, ikut_bkl: !!k.ikutBKL, rumah_layak: !!k.rumahLayak, air_bersih: !!k.airBersih, sanitasi: !!k.sanitasi }),
    from: (r) => ({ id: r.id, nama: r.nama, kec: r.kec, desa: r.desa, anggota: r.anggota, balita: r.balita, remaja: r.remaja, lansia: r.lansia, kbAktif: r.kb_aktif, metode: r.metode, ikutBKB: r.ikut_bkb, ikutBKR: r.ikut_bkr, ikutBKL: r.ikut_bkl, rumahLayak: r.rumah_layak, airBersih: r.air_bersih, sanitasi: r.sanitasi }),
  },
  kelompok: {
    to: (p) => ({ jenis: p.jenis, nama: p.nama, kec: p.kec, desa: p.desa, anggota: num(p.anggota), aktif: num(p.aktif), pertemuan: num(p.pertemuan), pengurus: !!p.pengurus, pencatatan: !!p.pencatatan, kegiatan: !!p.kegiatan }),
    from: (r) => ({ id: r.id, jenis: r.jenis, nama: r.nama, kec: r.kec, desa: r.desa, anggota: r.anggota, aktif: r.aktif, pertemuan: r.pertemuan, pengurus: r.pengurus, pencatatan: r.pencatatan, kegiatan: r.kegiatan }),
  },
  layanan_kb: {
    to: (l) => ({ bulan: l.bulan, kec: l.kec, desa: l.desa, fasilitas: l.fasilitas, metode: l.metode, pelayanan: num(l.pelayanan), efek: num(l.efek), gagal: num(l.gagal), dirujuk: num(l.dirujuk), tuntas: num(l.tuntas) }),
    from: (r) => ({ id: r.id, bulan: r.bulan, kec: r.kec, desa: r.desa, fasilitas: r.fasilitas, metode: r.metode, pelayanan: r.pelayanan, efek: r.efek, gagal: r.gagal, dirujuk: r.dirujuk, tuntas: r.tuntas }),
  },
};

// Supabase membatasi 1000 baris per permintaan, jadi diambil bertahap
export async function ambilSemua(tabel) {
  const hasil = [];
  for (let dari = 0; ; dari += 1000) {
    const { data, error } = await supabase.from(tabel).select("*").order("created_at").order("id").range(dari, dari + 999);
    if (error) throw error;
    hasil.push(...data);
    if (data.length < 1000) break;
  }
  return hasil.map(MAP[tabel].from);
}

import { useState } from "react";
import * as D from "./data.js";
import { PilihWilayah, awalWil, fmtBulan } from "./shared.jsx";

const ANGKA = ["pelayanan", "efek", "gagal", "dirujuk", "tuntas"];

export default function Layanan({ data, wil, bulanAkhir, onSave, onDelete }) {
  const [form, setForm] = useState(null);
  const [err, setErr] = useState("");
  const [maks, setMaks] = useState(30);
  const upd = (o) => setForm({ ...form, ...o });
  const baru = () => { const w = awalWil(wil); setErr(""); setForm({ bulan: bulanAkhir || "2026-10", ...w, fasilitas: "Pustu " + w.desa, metode: "Suntik", pelayanan: 0, efek: 0, gagal: 0, dirujuk: 0, tuntas: 0 }); };
  const simpan = async (e) => {
    e.preventDefault();
    const n = Object.fromEntries(ANGKA.map((k) => [k, Math.max(0, +form[k] || 0)]));
    if (n.efek + n.gagal > n.pelayanan) return setErr("Efek samping ditambah kegagalan tidak boleh melebihi jumlah pelayanan.");
    if (n.dirujuk > n.efek + n.gagal) return setErr("Kasus dirujuk tidak boleh melebihi jumlah efek samping ditambah kegagalan.");
    if (n.tuntas > n.dirujuk) return setErr("Rujukan tuntas tidak boleh melebihi kasus dirujuk.");
    if (await onSave({ ...form, ...n })) setForm(null);
  };
  const urut = [...data].sort((a, b) => b.bulan.localeCompare(a.bulan) || a.kec.localeCompare(b.kec));
  const tot = (k) => data.reduce((a, x) => a + x[k], 0);

  if (form) return (
    <>
      <div className="head"><h1>{form.id ? "Ubah" : "Tambah"} data layanan KB</h1></div>
      <div className="notice">Satu baris mewakili satu fasilitas, satu bulan, dan satu jenis kontrasepsi. Data ini menjadi sumber seluruh grafik di Monitoring dan Instrumen.</div>
      <form className="card" onSubmit={simpan}>
        <div className="row3">
          <label>Bulan pelaporan<input type="month" required value={form.bulan} onChange={(e) => upd({ bulan: e.target.value })} /></label>
          <label>Jenis kontrasepsi<select value={form.metode} onChange={(e) => upd({ metode: e.target.value })}>{["Suntik", "Pil", "Kondom"].map((m) => <option key={m}>{m}</option>)}</select></label>
          <label>Nama fasilitas<input required value={form.fasilitas} onChange={(e) => upd({ fasilitas: e.target.value })} /></label>
        </div>
        <PilihWilayah form={form} set={upd} />
        <fieldset><legend>Hasil pelayanan</legend>
          <div className="row3">
            {[["pelayanan", "Jumlah pelayanan"], ["efek", "Kejadian efek samping"], ["gagal", "Kasus kegagalan"], ["dirujuk", "Kasus dirujuk"], ["tuntas", "Rujukan tuntas"]].map(([k, n]) => <label key={k}>{n}<input type="number" min="0" value={form[k]} onChange={(e) => upd({ [k]: e.target.value })} /></label>)}
          </div>
        </fieldset>
        {err && <div className="notice" role="alert" style={{ background: "#F3F4F6", borderColor: "#D1D5DB", color: "#111827" }}>{err}</div>}
        <div className="actions"><button className="btn">Simpan</button><button type="button" className="btn ghost" onClick={() => setForm(null)}>Batal</button></div>
      </form>
    </>
  );

  return (
    <>
      <div className="head"><div><h1>Input data layanan KB</h1><p className="muted">Pencatatan bulanan pelayanan non-MKJP per fasilitas.</p></div><button className="btn" onClick={baru}>Tambah data layanan</button></div>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <div className="card"><div className="stat">{tot("pelayanan")}</div><div className="muted">total pelayanan</div></div>
        <div className="card"><div className="stat">{tot("efek")}</div><div className="muted">efek samping</div></div>
        <div className="card"><div className="stat">{tot("gagal")}</div><div className="muted">kegagalan</div></div>
        <div className="card"><div className="stat">{tot("tuntas")}/{tot("dirujuk")}</div><div className="muted">rujukan tuntas</div></div>
      </div>
      <div className="card scroll"><table>
        <thead><tr><th>Bulan</th><th>Fasilitas</th><th>Desa</th><th>Kecamatan</th><th>Jenis</th><th>Layanan</th><th>Efek</th><th>Gagal</th><th>Rujuk</th><th>Tuntas</th><th>Aksi</th></tr></thead>
        <tbody>{urut.slice(0, maks).map((l) => (
          <tr key={l.id}><td>{fmtBulan(l.bulan)}</td><td>{l.fasilitas}</td><td>{l.desa}</td><td>{l.kec}</td><td>{l.metode}</td><td>{l.pelayanan}</td><td>{l.efek}</td><td>{l.gagal}</td><td>{l.dirujuk}</td><td>{l.tuntas}</td>
            <td><div className="actions"><button className="btn sm ghost" onClick={() => { setErr(""); setForm(l); }}>Ubah</button><button className="btn sm del" onClick={() => confirm("Hapus data ini?") && onDelete(l.id)}>Hapus</button></div></td></tr>))}
          {!urut.length && <tr><td colSpan="11" className="muted">Belum ada data layanan pada wilayah ini. Pilih wilayah yang memiliki fasilitas, atau tambahkan data baru.</td></tr>}</tbody>
      </table></div>
      {urut.length > maks && <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => setMaks(maks + 30)}>Tampilkan lebih banyak</button>}
    </>
  );
}

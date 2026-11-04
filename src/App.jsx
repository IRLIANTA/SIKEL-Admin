import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import * as D from "./data.js";
import { WILAYAH, KECAMATAN } from "./wilayah.js";
import { SEMUA, label, klasClass, PilihWilayah, awalWil } from "./shared.jsx";
import Beranda from "./Beranda.jsx";
import HakCipta from "./HakCipta.jsx";
import Layanan from "./Layanan.jsx";
import Instrumen from "./Instrumen.jsx";
import Monev from "./Monev.jsx";

const MENU = [["beranda", "Beranda"], ["dashboard", "Dashboard"], ["wilayah", "Per Wilayah"], ["keluarga", "Profil Keluarga"], ["kelompok", "Kelompok Kegiatan"], ["layanan", "Input Layanan KB"], ["instrumen", "Instrumen Monitoring"], ["monev", "Monitoring & Evaluasi"], ["hak-cipta", "Hak Cipta"]];
const DASH = MENU.map((m) => m[0]);

export default function App() {
  const [masuk, setMasuk] = useState(false);
  const baca = () => location.hash.replace("#", "");
  const [hash, setHash] = useState(baca());
  const awal = useMemo(() => D.bangkitkanData(), []);
  const [keluarga, setKeluarga] = useState(awal.keluarga);
  const [poktan, setPoktan] = useState(awal.poktan);
  const [layanan, setLayanan] = useState(awal.layanan);
  const [wil, setWil] = useState(SEMUA);
  const [targets, setTargets] = useState({});
  useEffect(() => { const f = () => { setHash(baca()); window.scrollTo(0, 0); }; window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);

  const dalam = (x) => (wil.kec === "Semua" || x.kec === wil.kec) && (wil.desa === "Semua" || x.desa === wil.desa);
  const kF = keluarga.filter(dalam), pF = poktan.filter(dalam), lF = layanan.filter(dalam);
  const bulanList = useMemo(() => [...new Set(layanan.map((l) => l.bulan))].sort().slice(-6), [layanan]);
  const bulanAkhir = bulanList[bulanList.length - 1] || "";
  const simpan = (set) => (item) => set((d) => (item.id ? d.map((x) => (x.id === item.id ? item : x)) : [...d, { ...item, id: Date.now() }]));
  const hapus = (set) => (id) => set((d) => d.filter((x) => x.id !== id));
  const bukaMonev = (w) => { setWil(w); location.hash = "monev"; };
  const pergi = (h) => { location.hash = h; };

  const hal = DASH.includes(hash) ? hash : "beranda";

  if (!masuk) return <Login onMasuk={() => { setMasuk(true); pergi("beranda"); }} />;

  const pakaiFilter = ["dashboard", "keluarga", "kelompok", "layanan", "instrumen", "monev"].includes(hal);
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">SIKEL Admin</div>
        <div className="sub">Kabupaten Kapuas Hulu</div>
        {MENU.map(([k, n]) => <button key={k} onClick={() => pergi(k)} aria-current={hal === k ? "page" : undefined}>{n}</button>)}
        <button className="out" onClick={() => { setMasuk(false); location.hash = ""; }}>Keluar</button>
      </aside>
      <main className="content">
        {pakaiFilter && <Filter wil={wil} setWil={setWil} />}
        {hal === "wilayah" ? <Wilayah keluarga={keluarga} poktan={poktan} onMonev={bukaMonev} /> :
         hal === "keluarga" ? <Keluarga data={kF} wil={wil} onSave={simpan(setKeluarga)} onDelete={hapus(setKeluarga)} /> :
         hal === "kelompok" ? <Kelompok data={pF} wil={wil} onSave={simpan(setPoktan)} onDelete={hapus(setPoktan)} /> :
         hal === "layanan" ? <Layanan data={lF} wil={wil} bulanAkhir={bulanAkhir} onSave={simpan(setLayanan)} onDelete={hapus(setLayanan)} /> :
         hal === "instrumen" ? <Instrumen keluarga={kF} poktan={pF} layanan={lF} wil={wil} bulanAkhir={bulanAkhir} targets={targets} setTargets={setTargets} /> :
         hal === "monev" ? <Monev kF={kF} pF={pF} lF={lF} wil={wil} bulanList={bulanList} bulanAkhir={bulanAkhir} /> :
         hal === "hak-cipta" ? <HakCipta /> : hal === "dashboard" ? <Ringkasan keluarga={kF} poktan={pF} wil={wil} /> : <Beranda pergi={pergi} />}
      </main>
    </div>
  );
}

function Login({ onMasuk }) {
  return (
    <div className="login">
      <form className="card" onSubmit={(e) => { e.preventDefault(); onMasuk(); }}>
        <h1>SIKEL Admin</h1>
        <p className="muted">Masuk untuk mengelola data keluarga dan layanan KB di Kabupaten Kapuas Hulu.</p>
        <label>Email<input type="email" required defaultValue="admin@contoh.id" /></label>
        <label>Kata sandi<input type="password" required defaultValue="demo1234" /></label>
        <button className="btn" style={{ width: "100%" }}>Masuk</button>
        <p className="muted" style={{ marginTop: 12, fontSize: ".85rem" }}>Mode demo: tombol Masuk langsung membuka dashboard. Login sungguhan akan memakai Supabase Auth.</p>
      </form>
    </div>
  );
}

function Filter({ wil, setWil }) {
  return (
    <div className="filter" role="group" aria-label="Filter wilayah">
      <label>Kecamatan
        <select value={wil.kec} onChange={(e) => setWil({ kec: e.target.value, desa: "Semua" })}>
          <option>Semua</option>{KECAMATAN.map((k) => <option key={k}>{k}</option>)}
        </select></label>
      <label>Desa
        <select value={wil.desa} disabled={wil.kec === "Semua"} onChange={(e) => setWil({ ...wil, desa: e.target.value })}>
          <option>Semua</option>{wil.kec !== "Semua" && WILAYAH[wil.kec].map((d) => <option key={d}>{d}</option>)}
        </select></label>
      <span className="info">Menampilkan: {label(wil)}</span>
      {wil.kec !== "Semua" && <button className="btn ghost sm" onClick={() => setWil(SEMUA)}>Reset</button>}
    </div>
  );
}

function Ringkasan({ keluarga, poktan, wil }) {
  const rs = D.ringkasWilayah(keluarga, poktan);
  const kls = keluarga.map((k) => D.klasKeluarga(D.hitungKeluarga(k)));
  const dataKlas = ["Rentan", "Berkembang", "Mandiri"].map((n) => ({ nama: n, jumlah: kls.filter((x) => x === n).length }));
  const dataPok = ["Dasar", "Tumbuh", "Berkembang"].map((n) => ({ nama: n, jumlah: poktan.filter((p) => D.klasPoktan(D.hitungPoktan(p)) === n).length }));
  return (
    <>
      <div className="head"><div><h1>Dashboard</h1><p className="muted">{label(wil)}</p></div></div>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <div className="card"><div className="stat">{rs.keluarga}</div><div className="muted">keluarga terdata</div></div>
        <div className="card"><div className="stat">{rs.kb}</div><div className="muted">peserta KB aktif ({rs.pctKb}%)</div></div>
        <div className="card"><div className="stat">{rs.poktan}</div><div className="muted">kelompok kegiatan</div></div>
        <div className="card"><div className="stat">{rs.rentan}</div><div className="muted">keluarga perlu pendampingan</div></div>
      </div>
      <div className="grid g2">
        {[["Klasifikasi keluarga", dataKlas], ["Klasifikasi kelompok kegiatan", dataPok]].map(([j, d]) => (
          <div className="card" key={j}><h3>{j}</h3>
            <div style={{ height: 220 }}><ResponsiveContainer><BarChart data={d}><CartesianGrid stroke="#E5E7EB" vertical={false} /><XAxis dataKey="nama" stroke="#6B7280" /><YAxis allowDecimals={false} stroke="#6B7280" /><Tooltip /><Bar dataKey="jumlah" fill="#1D4ED8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
        ))}
      </div>
    </>
  );
}

function Wilayah({ keluarga, poktan, onMonev }) {
  const [kec, setKec] = useState(null);
  const baris = (kec ? WILAYAH[kec] : KECAMATAN).map((n) => {
    const f = (x) => (kec ? x.kec === kec && x.desa === n : x.kec === n);
    const r = D.ringkasWilayah(keluarga.filter(f), poktan.filter(f));
    return { nama: n, desaCount: kec ? 0 : WILAYAH[n].length, ...r };
  });
  const urut = [...baris].sort((a, b) => b.keluarga - a.keluarga);
  return (
    <>
      <div className="head"><div><h1>{kec ? `Desa di Kecamatan ${kec}` : "Monitoring per kecamatan"}</h1>
        <p className="muted">{kec ? "Perbandingan antar desa." : "Perbandingan antar kecamatan. Pilih satu kecamatan untuk melihat desanya."}</p></div>
        {kec && <div className="actions"><button className="btn ghost" onClick={() => setKec(null)}>Kembali ke kecamatan</button><button className="btn" onClick={() => onMonev({ kec, desa: "Semua" })}>Monitoring KB kecamatan ini</button></div>}
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Jumlah keluarga terdata</h3>
        <div style={{ height: Math.max(220, urut.length * 26) }}>
          <ResponsiveContainer><BarChart data={urut} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid stroke="#E5E7EB" horizontal={false} /><XAxis type="number" allowDecimals={false} stroke="#6B7280" /><YAxis type="category" dataKey="nama" width={130} interval={0} stroke="#6B7280" fontSize={12} />
            <Tooltip /><Bar dataKey="keluarga" name="Keluarga" fill="#1D4ED8" radius={[0, 6, 6, 0]} /><Bar dataKey="kb" name="Peserta KB" fill="#6B7280" radius={[0, 6, 6, 0]} />
            <Legend /></BarChart></ResponsiveContainer>
        </div>
      </div>
      <div className="card scroll"><table>
        <thead><tr><th>{kec ? "Desa" : "Kecamatan"}</th>{!kec && <th>Desa</th>}<th>Keluarga</th><th>Peserta KB</th><th>Keluarga rentan</th><th>Kelompok</th><th>Aksi</th></tr></thead>
        <tbody>{baris.map((b) => (
          <tr key={b.nama}><td>{kec ? b.nama : <button className="link" onClick={() => setKec(b.nama)}>{b.nama}</button>}</td>{!kec && <td>{b.desaCount}</td>}
            <td>{b.keluarga}</td><td>{b.kb} ({b.pctKb}%)</td><td>{b.rentan > 0 ? <span className="pill low">{b.rentan}</span> : 0}</td><td>{b.poktan}</td>
            <td><button className="btn sm ghost" onClick={() => onMonev(kec ? { kec, desa: b.nama } : { kec: b.nama, desa: "Semua" })}>Monitoring</button></td></tr>))}</tbody>
      </table></div>
    </>
  );
}

const MAKS = 30;

function Keluarga({ data, wil, onSave, onDelete }) {
  const [form, setForm] = useState(null);
  const [lihat, setLihat] = useState(null);
  const [cari, setCari] = useState("");
  const [maks, setMaks] = useState(MAKS);
  const upd = (o) => setForm({ ...form, ...o });
  const set = (k, v) => upd({ [k]: v });
  const baru = () => setForm({ nama: "", ...awalWil(wil), anggota: 4, balita: 0, remaja: 0, lansia: 0, kbAktif: false, metode: "Suntik", ikutBKB: false, ikutBKR: false, ikutBKL: false, rumahLayak: false, airBersih: false, sanitasi: false });
  const cb = (k, n) => <label><input type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} />{n}</label>;
  const simpan = (e) => { e.preventDefault(); onSave(form); setForm(null); };
  const daftar = data.filter((k) => (k.nama + k.desa + k.kec).toLowerCase().includes(cari.toLowerCase()));
  const p = lihat && data.find((x) => x.id === lihat);

  if (form) return (
    <>
      <div className="head"><h1>{form.id ? "Ubah" : "Tambah"} profil keluarga</h1></div>
      <div className="notice">Gunakan data fiktif untuk demo. Jangan masukkan data keluarga sungguhan.</div>
      <form className="card" onSubmit={simpan}>
        <fieldset><legend>Aspek kependudukan</legend>
          <label>Nama kepala keluarga<input required value={form.nama} onChange={(e) => set("nama", e.target.value)} /></label>
          <PilihWilayah form={form} set={upd} />
          <div className="row2" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {[["anggota", "Anggota"], ["balita", "Balita"], ["remaja", "Remaja"], ["lansia", "Lansia"]].map(([k, n]) => <label key={k}>{n}<input type="number" min="0" max="20" value={form[k]} onChange={(e) => set(k, e.target.value)} /></label>)}
          </div>
        </fieldset>
        <fieldset><legend>Keluarga berencana</legend>
          <div className="row2"><label>Peserta KB aktif<select value={form.kbAktif ? "Ya" : "Tidak"} onChange={(e) => set("kbAktif", e.target.value === "Ya")}><option>Ya</option><option>Tidak</option></select></label>
            {form.kbAktif && <label>Metode<select value={form.metode} onChange={(e) => set("metode", e.target.value)}>{D.METODE.map((m) => <option key={m}>{m}</option>)}</select></label>}</div>
        </fieldset>
        <fieldset><legend>Pembangunan keluarga</legend>
          <div className="checks">{cb("ikutBKB", "Ikut BKB")}{cb("ikutBKR", "Ikut BKR")}{cb("ikutBKL", "Ikut BKL")}</div>
          <div className="checks">{cb("rumahLayak", "Rumah layak huni")}{cb("airBersih", "Air bersih")}{cb("sanitasi", "Sanitasi layak")}</div>
        </fieldset>
        <div className="actions"><button className="btn">Simpan</button><button type="button" className="btn ghost" onClick={() => setForm(null)}>Batal</button></div>
      </form>
    </>
  );

  if (p) {
    const s = D.hitungKeluarga(p), kl = D.klasKeluarga(s), rek = [];
    if (!p.kbAktif) rek.push("Tawarkan konseling KB untuk membahas pilihan metode.");
    if (+p.balita > 0 && !p.ikutBKB) rek.push("Ajak ikut kelas BKB dan pantau tumbuh kembang balita.");
    if (+p.remaja > 0 && !p.ikutBKR) rek.push("Libatkan remaja dalam BKR atau PIK-R.");
    if (+p.lansia > 0 && !p.ikutBKL) rek.push("Hubungkan dengan BKL untuk kegiatan lansia.");
    if (!p.rumahLayak || !p.airBersih || !p.sanitasi) rek.push("Koordinasikan dengan desa untuk perbaikan rumah, air bersih, atau sanitasi.");
    if (!rek.length) rek.push("Pertahankan kondisi keluarga dan lakukan pemantauan berkala.");
    return (
      <>
        <div className="head noprint"><button className="btn ghost" onClick={() => setLihat(null)}>Kembali ke daftar</button><button className="btn" onClick={() => window.print()}>Cetak / simpan PDF</button></div>
        <div className="card">
          <h1>Profil Keluarga {p.nama}</h1><p className="muted">Desa {p.desa}, Kec. {p.kec} · skor {s}/100 · <span className={"pill " + klasClass(kl)}>{kl}</span></p>
          <div className="grid g2">
            <div><h3>Kependudukan</h3><dl className="kv"><dt>Anggota</dt><dd>{p.anggota}</dd><dt>Balita</dt><dd>{p.balita}</dd><dt>Remaja</dt><dd>{p.remaja}</dd><dt>Lansia</dt><dd>{p.lansia}</dd></dl></div>
            <div><h3>KB dan pembangunan keluarga</h3><dl className="kv"><dt>Peserta KB</dt><dd>{p.kbAktif ? p.metode : "Belum"}</dd><dt>Kelompok</dt><dd>{[p.ikutBKB && "BKB", p.ikutBKR && "BKR", p.ikutBKL && "BKL"].filter(Boolean).join(", ") || "Belum ikut"}</dd><dt>Rumah layak</dt><dd>{p.rumahLayak ? "Ya" : "Tidak"}</dd><dt>Air bersih</dt><dd>{p.airBersih ? "Ya" : "Tidak"}</dd><dt>Sanitasi</dt><dd>{p.sanitasi ? "Ya" : "Tidak"}</dd></dl></div>
          </div>
          <h3 style={{ marginTop: 16 }}>Rekomendasi</h3><ul className="plain">{rek.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="head"><div><h1>Profil keluarga</h1><p className="muted">{daftar.length} keluarga · input data, lalu buka profil otomatis tiap keluarga.</p></div><button className="btn" onClick={baru}>Tambah keluarga</button></div>
      <label style={{ maxWidth: 320 }}>Cari nama, desa, atau kecamatan<input value={cari} onChange={(e) => setCari(e.target.value)} /></label>
      <div className="card scroll"><table>
        <thead><tr><th>Kepala keluarga</th><th>Desa</th><th>Kecamatan</th><th>KB</th><th>Skor</th><th>Klasifikasi</th><th>Aksi</th></tr></thead>
        <tbody>{daftar.slice(0, maks).map((k) => { const s = D.hitungKeluarga(k), kl = D.klasKeluarga(s); return (
          <tr key={k.id}><td>{k.nama}</td><td>{k.desa}</td><td>{k.kec}</td><td>{k.kbAktif ? k.metode : "Belum"}</td><td>{s}</td><td><span className={"pill " + klasClass(kl)}>{kl}</span></td>
            <td><div className="actions"><button className="btn sm ghost" onClick={() => setLihat(k.id)}>Profil</button><button className="btn sm ghost" onClick={() => setForm(k)}>Ubah</button><button className="btn sm del" onClick={() => confirm("Hapus data ini?") && onDelete(k.id)}>Hapus</button></div></td></tr>); })}
          {!daftar.length && <tr><td colSpan="7" className="muted">Belum ada data pada wilayah ini. Pilih Tambah keluarga untuk memulai.</td></tr>}</tbody>
      </table></div>
      {daftar.length > maks && <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => setMaks(maks + MAKS)}>Tampilkan lebih banyak</button>}
    </>
  );
}

function Kelompok({ data, wil, onSave, onDelete }) {
  const [form, setForm] = useState(null);
  const [filter, setFilter] = useState("Semua");
  const upd = (o) => setForm({ ...form, ...o });
  const set = (k, v) => upd({ [k]: v });
  const simpan = (e) => { e.preventDefault(); onSave(form); setForm(null); };
  const daftar = data.filter((p) => filter === "Semua" || p.jenis === filter);

  if (form) {
    const s = D.hitungPoktan(form);
    return (
      <>
        <div className="head"><h1>{form.id ? "Ubah" : "Tambah"} kelompok kegiatan</h1></div>
        <form className="card" onSubmit={simpan}>
          <div className="row2"><label>Jenis<select value={form.jenis} onChange={(e) => set("jenis", e.target.value)}>{D.JENIS_POKTAN.map((j) => <option key={j}>{j}</option>)}</select></label>
            <label>Nama kelompok<input required value={form.nama} onChange={(e) => set("nama", e.target.value)} /></label></div>
          <PilihWilayah form={form} set={upd} />
          <div className="row3"><label>Jumlah anggota<input type="number" min="1" value={form.anggota} onChange={(e) => set("anggota", e.target.value)} /></label>
            <label>Anggota aktif<input type="number" min="0" value={form.aktif} onChange={(e) => set("aktif", e.target.value)} /></label>
            <label>Pertemuan per bulan<input type="number" min="0" max="8" value={form.pertemuan} onChange={(e) => set("pertemuan", e.target.value)} /></label></div>
          <div className="checks">
            {[["pengurus", "Pengurus lengkap"], ["pencatatan", "Ada pencatatan kegiatan"], ["kegiatan", "Kegiatan rutin berjalan"]].map(([k, n]) => <label key={k}><input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />{n}</label>)}
          </div>
          <p className="muted">Perkiraan skor: <b>{s}</b> · klasifikasi <b>{D.klasPoktan(s)}</b></p>
          <div className="actions"><button className="btn">Simpan</button><button type="button" className="btn ghost" onClick={() => setForm(null)}>Batal</button></div>
        </form>
      </>
    );
  }
  return (
    <>
      <div className="head"><div><h1>Kelompok kegiatan</h1><p className="muted">Profil Poktan dan setara Poktan beserta klasifikasinya.</p></div>
        <button className="btn" onClick={() => setForm({ jenis: "BKB", nama: "", ...awalWil(wil), anggota: 20, aktif: 15, pertemuan: 1, pengurus: false, pencatatan: false, kegiatan: false })}>Tambah kelompok</button></div>
      <div className="tabs">{["Semua", ...D.JENIS_POKTAN].map((j) => <button key={j} className="tab" aria-pressed={filter === j} onClick={() => setFilter(j)}>{j}</button>)}</div>
      <div className="card scroll"><table>
        <thead><tr><th>Kelompok</th><th>Jenis</th><th>Desa</th><th>Kecamatan</th><th>Aktif</th><th>Skor</th><th>Klasifikasi</th><th>Aksi</th></tr></thead>
        <tbody>{daftar.map((p) => { const s = D.hitungPoktan(p), kl = D.klasPoktan(s); return (
          <tr key={p.id}><td>{p.nama}</td><td>{p.jenis}</td><td>{p.desa}</td><td>{p.kec}</td><td>{p.aktif}/{p.anggota}</td>
            <td><div style={{ display: "flex", gap: 8, alignItems: "center" }}>{s}<div className="bar"><i style={{ width: s + "%" }} /></div></div></td>
            <td><span className={"pill " + klasClass(kl)}>{kl}</span></td>
            <td><div className="actions"><button className="btn sm ghost" onClick={() => setForm(p)}>Ubah</button><button className="btn sm del" onClick={() => confirm("Hapus data ini?") && onDelete(p.id)}>Hapus</button></div></td></tr>); })}
          {!daftar.length && <tr><td colSpan="8" className="muted">Belum ada kelompok pada wilayah atau kategori ini.</td></tr>}</tbody>
      </table></div>
    </>
  );
}


import { useState } from "react";
import * as D from "./data.js";
import { label } from "./shared.jsx";

const GRUP = [["Monitoring", ["Input", "Proses", "Output"]], ["Evaluasi", ["Outcome", "Impact"]]];

export default function Instrumen({ keluarga, poktan, layanan, wil, bulanAkhir, targets, setTargets }) {
  const [t, setT] = useState("Input");
  const kunci = wil.kec + "/" + wil.desa;
  const ubah = Object.fromEntries(Object.entries(targets).filter(([k]) => k.startsWith(kunci + "|")).map(([k, v]) => [k.split("|")[1], v]));
  const data = D.hitungInstrumen(keluarga, poktan, layanan, wil, bulanAkhir, ubah);
  const semua = Object.values(data).flat();
  const tercapai = semua.filter((i) => D.capaian(i) >= 90).length;
  const setTarget = (id, v) => setTargets({ ...targets, [kunci + "|" + id]: v === "" ? "" : +v });
  const reset = () => setTargets(Object.fromEntries(Object.entries(targets).filter(([k]) => !k.startsWith(kunci + "|"))));

  return (
    <>
      <div className="head"><div><h1>Instrumen monitoring dan evaluasi</h1><p className="muted">{label(wil)}. Realisasi dihitung otomatis dari data, target dapat diubah.</p></div>
        <div className="actions noprint"><button className="btn ghost" onClick={reset}>Kembalikan target awal</button><button className="btn" onClick={() => window.print()}>Cetak / simpan PDF</button></div></div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="stat">{tercapai} dari {semua.length}</div><div className="muted">indikator sudah tercapai (capaian 90% atau lebih)</div>
      </div>
      <div className="grupTab noprint">
        {GRUP.map(([g, ls]) => (
          <div key={g}><div className="muted" style={{ fontSize: ".85rem", marginBottom: 4 }}>{g}</div>
            <div className="tabs">{ls.map((k) => <button key={k} className="tab" aria-pressed={t === k} onClick={() => setT(k)}>{k}</button>)}</div></div>
        ))}
      </div>
      <div className="card scroll"><h2 style={{ marginBottom: 10 }}>{t}</h2><table>
        <thead><tr><th>Indikator</th><th>Satuan</th><th>Target</th><th>Realisasi</th><th>Capaian</th><th>Status</th></tr></thead>
        <tbody>{data[t].map((i) => { const c = D.capaian(i), [st, kl] = D.statusCapaian(c); return (
          <tr key={i.id}><td>{i.nama}{i.arah === "turun" && <div className="muted" style={{ fontSize: ".82rem" }}>semakin rendah semakin baik</div>}</td><td>{i.satuan}</td>
            <td style={{ width: 120 }}><input type="number" step="any" min="0" aria-label={"Target " + i.nama} value={i.target} onChange={(e) => setTarget(i.id, e.target.value)} style={{ marginTop: 0 }} /></td>
            <td><b>{i.realisasi}</b></td>
            <td><div style={{ display: "flex", gap: 8, alignItems: "center" }}>{c}%<div className="bar"><i style={{ width: c + "%" }} /></div></div></td>
            <td><span className={"pill " + kl}>{st}</span></td></tr>); })}</tbody>
      </table>
        <p className="muted" style={{ margin: "12px 0 0", fontSize: ".85rem" }}>Nilai target awal adalah contoh untuk demo, bukan target resmi. Admin dapat menyesuaikan dengan target program yang berlaku.</p>
      </div>
    </>
  );
}

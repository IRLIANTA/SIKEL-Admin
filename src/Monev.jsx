import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import * as D from "./data.js";
import { label, fmtBulan } from "./shared.jsx";

export default function Monev({ kF, pF, lF, wil, bulanList, bulanAkhir }) {
  const [t, setT] = useState("Input");
  const m = useMemo(() => D.hitungMonev(kF, pF, lF, wil, bulanList, bulanAkhir), [kF, pF, lF, wil, bulanList, bulanAkhir]);
  const info = m.tingkat[t];
  return (
    <>
      <div className="head"><div><h1>Monitoring dan evaluasi layanan KB</h1><p className="muted">{label(wil)} · pelayanan non-MKJP: suntik, pil, dan kondom · bulan terakhir {fmtBulan(bulanAkhir)}</p></div></div>
      <div className="tabs" role="group" aria-label="Tingkat">{Object.keys(m.tingkat).map((k) => <button key={k} className="tab" aria-pressed={t === k} onClick={() => setT(k)}>{k}</button>)}</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h2>{t}: {info.tanya}</h2>
        <div className="grid g4" style={{ marginTop: 10 }}>{info.item.map(([n, v]) => <div key={n} style={{ borderLeft: "4px solid var(--blue)", paddingLeft: 12 }}><div className="muted">{n}</div><div style={{ fontWeight: 800, fontSize: "1.15rem" }}>{v}</div></div>)}</div>
      </div>
      {(t === "Output" || t === "Outcome") && (
        <div className="grid g2">
          <div className="card"><h3>Cakupan pelayanan per bulan</h3>
            <div style={{ height: 260 }}><ResponsiveContainer><LineChart data={m.cakupan}><CartesianGrid stroke="#E5E7EB" /><XAxis dataKey="bulan" stroke="#6B7280" /><YAxis allowDecimals={false} stroke="#6B7280" /><Tooltip /><Legend />
              <Line dataKey="Suntik" stroke="#1D4ED8" strokeWidth={3} /><Line dataKey="Pil" stroke="#111827" strokeWidth={2} /><Line dataKey="Kondom" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 4" /></LineChart></ResponsiveContainer></div></div>
          <div className="card"><h3>Efek samping dan kegagalan</h3>
            <div style={{ height: 260 }}><ResponsiveContainer><BarChart data={m.mutu}><CartesianGrid stroke="#E5E7EB" vertical={false} /><XAxis dataKey="jenis" stroke="#6B7280" /><YAxis allowDecimals={false} stroke="#6B7280" /><Tooltip /><Legend />
              <Bar dataKey="efek" name="Efek samping" fill="#1D4ED8" radius={[6, 6, 0, 0]} /><Bar dataKey="gagal" name="Kegagalan" fill="#6B7280" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        </div>
      )}
      {t === "Input" && (
        <div className="card scroll"><h3>Pembiayaan per layanan (bulan terakhir)</h3><table><thead><tr><th>Jenis</th><th>Biaya per layanan</th><th>Jumlah pelayanan</th><th>Perkiraan biaya</th></tr></thead>
          <tbody>{m.mutu.map((x) => <tr key={x.jenis}><td>{x.jenis}</td><td>Rp {x.biaya.toLocaleString("id-ID")}</td><td>{x.peserta}</td><td>Rp {(x.biaya * x.peserta).toLocaleString("id-ID")}</td></tr>)}</tbody></table></div>
      )}
    </>
  );
}

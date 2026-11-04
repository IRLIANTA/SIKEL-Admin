import { WILAYAH, KECAMATAN } from "./wilayah.js";

export const SEMUA = { kec: "Semua", desa: "Semua" };
export const label = (w) => (w.desa !== "Semua" ? `Desa ${w.desa}, Kec. ${w.kec}` : w.kec !== "Semua" ? `Kecamatan ${w.kec}` : "Seluruh Kabupaten Kapuas Hulu");
export const klasClass = (k) => (k === "Rentan" || k === "Dasar" ? "low" : k === "Berkembang" || k === "Tumbuh" ? "mid" : "");
export const NAMA_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const fmtBulan = (b) => (b ? `${NAMA_BULAN[+b.slice(5) - 1]} ${b.slice(0, 4)}` : "-");
export const awalWil = (wil) => { const kec = wil.kec !== "Semua" ? wil.kec : KECAMATAN[0]; return { kec, desa: wil.desa !== "Semua" ? wil.desa : WILAYAH[kec][0] }; };

export function PilihWilayah({ form, set }) {
  return (
    <div className="row2">
      <label>Kecamatan<select value={form.kec} onChange={(e) => set({ kec: e.target.value, desa: WILAYAH[e.target.value][0] })}>{KECAMATAN.map((k) => <option key={k}>{k}</option>)}</select></label>
      <label>Desa<select value={form.desa} onChange={(e) => set({ desa: e.target.value })}>{WILAYAH[form.kec].map((d) => <option key={d}>{d}</option>)}</select></label>
    </div>
  );
}

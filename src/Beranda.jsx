import { Ico } from "./Icons.jsx";

const LAYANAN = [
  ["users", "Pendataan profil keluarga", "Mencatat aspek kependudukan, keluarga berencana, dan pembangunan keluarga, lalu menyusun profil dan rekomendasi otomatis."],
  ["groups", "Profil kelompok kegiatan", "Mengelola BKB, BKR, BKL, UPPKA, PIK-R, Kampung KB, Rumah Data, dan PPKS beserta klasifikasinya."],
  ["clipboard", "Pencatatan layanan KB", "Input bulanan pelayanan suntik, pil, dan kondom per fasilitas: efek samping, kegagalan, dan rujukan."],
  ["chart", "Monitoring dan evaluasi", "Instrumen target dan realisasi untuk tingkat input, proses, output, outcome, dan impact."],
  ["map", "Pemantauan per wilayah", "Membandingkan 23 kecamatan dan 277 desa di Kabupaten Kapuas Hulu dalam satu tempat."],
];
const KEGUNAAN = [
  ["Penyuluh dan konselor keluarga", "Mengetahui keluarga yang perlu didampingi, menyusun profil, dan menyiapkan bahan konseling lebih cepat."],
  ["Koordinator kecamatan", "Membandingkan kondisi antar desa untuk menentukan wilayah yang perlu diprioritaskan."],
  ["Pimpinan dan pengelola program", "Melihat capaian terhadap target dan mencetak laporan tanpa menyusun ulang data secara manual."],
];
const FUNGSI = [
  ["Skor dan klasifikasi otomatis", "Keluarga dan kelompok langsung terklasifikasi saat data disimpan."],
  ["Filter kecamatan dan desa", "Satu pilihan wilayah berlaku di semua halaman."],
  ["Grafik dan tabel", "Tren cakupan, efek samping, kegagalan, dan pembiayaan."],
  ["Target dan realisasi", "Status capaian tiap indikator dengan penanda warna."],
  ["Cetak laporan", "Profil keluarga dan instrumen dapat disimpan sebagai PDF."],
  ["Login admin", "Hanya petugas terdaftar yang dapat mengelola data."],
];
const ALUR = [
  ["clipboard", "Input", "Petugas mencatat data keluarga, kelompok, dan layanan."],
  ["grid", "Olah", "Sistem menghitung skor, klasifikasi, dan realisasi."],
  ["map", "Pantau", "Admin membandingkan wilayah dan capaian terhadap target."],
  ["check", "Tindak lanjut", "Hasilnya dipakai untuk pendampingan dan laporan."],
];
const ANGKA = [["23", "kecamatan"], ["277", "desa"], ["5", "tingkat monitoring"], ["3", "jenis kontrasepsi dipantau"]];

export default function Beranda({ pergi }) {
  const gulir = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="beranda">
      <section className="hero2">
        <div className="hero2-text">
          <span className="badge">Demo portofolio · data fiktif</span>
          <h1>Pantau keluarga dan layanan KB dari satu tempat</h1>
          <p>SIKEL membantu penyuluh mendata keluarga dan kelompok kegiatan, mencatat layanan KB, serta memantau capaian program di tingkat kecamatan dan desa di Kabupaten Kapuas Hulu.</p>
          <div className="actions">
            <button className="btn light" onClick={() => pergi("dashboard")}>Buka dashboard</button>
            <button className="btn outline-light" onClick={() => gulir("layanan")}>Pelajari lebih lanjut</button>
          </div>
        </div>
        <div className="hero2-stats" aria-label="Cakupan sistem">
          {ANGKA.map(([a, b]) => <div className="tile" key={b}><b>{a}</b><span>{b}</span></div>)}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><h2>Apa itu SIKEL?</h2></div>
        <div className="about">
          <p>SIKEL adalah singkatan dari Sistem Informasi Keluarga. Website ini dibuat sebagai contoh bagaimana pencatatan, pelaporan, dan pemantauan program kependudukan, keluarga berencana, dan pembangunan keluarga dapat dibantu teknologi informasi.</p>
          <p>Data semacam itu sering tersebar di buku catatan dan berkas terpisah. SIKEL mengumpulkannya dalam satu sistem sehingga profil keluarga, kondisi kelompok kegiatan, dan hasil layanan KB dapat dilihat bersama.</p>
        </div>
      </section>

      <section className="sec" id="layanan">
        <div className="sec-head"><h2>Layanan yang tersedia</h2><p className="muted">Lima layanan utama yang dapat dikelola dari dashboard.</p></div>
        <div className="grid g3">
          {LAYANAN.map(([i, j, d]) => (
            <div className="card feat" key={j}><span className="ico-badge"><Ico n={i} /></span><h3>{j}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><h2>Kegunaan untuk siapa</h2><p className="muted">Setiap peran melihat data yang sama dengan kebutuhan berbeda.</p></div>
        <div className="grid g3">
          {KEGUNAAN.map(([j, d]) => <div className="card accent" key={j}><h3>{j}</h3><p className="muted">{d}</p></div>)}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><h2>Fungsi sistem</h2></div>
        <div className="fungsi">
          {FUNGSI.map(([j, d]) => (
            <div className="fitem" key={j}><span className="tick"><Ico n="check" size={16} /></span><div><h3>{j}</h3><p className="muted">{d}</p></div></div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head"><h2>Alur kerja</h2><p className="muted">Dari pencatatan di lapangan sampai tindak lanjut.</p></div>
        <div className="steps">
          {ALUR.map(([i, j, d]) => (
            <div className="step" key={j}><span className="ico-circle"><Ico n={i} /></span><h3>{j}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="notice">Seluruh data pada website ini adalah data fiktif untuk keperluan demo, dan website ini bukan situs resmi BKKBN. Versi untuk masyarakat (edukasi dan alur konseling) dibuat sebagai website terpisah.</div>
      </section>
    </div>
  );
}

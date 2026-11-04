const LAYANAN = [
  ["Pendataan profil keluarga", "Mencatat aspek kependudukan, keluarga berencana, dan pembangunan keluarga, lalu menyusun profil serta rekomendasi secara otomatis."],
  ["Profil kelompok kegiatan", "Mengelola BKB, BKR, BKL, UPPKA, PIK-R, Kampung KB, Rumah Data, dan PPKS lengkap dengan klasifikasinya."],
  ["Pencatatan layanan KB", "Input bulanan pelayanan suntik, pil, dan kondom per fasilitas: jumlah pelayanan, efek samping, kegagalan, dan rujukan."],
  ["Monitoring dan evaluasi", "Instrumen berisi target dan realisasi untuk tingkat input, proses, output, outcome, dan impact."],
  ["Pemantauan per wilayah", "Membandingkan 23 kecamatan dan 277 desa di Kabupaten Kapuas Hulu dalam satu tempat."],
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
  ["Login admin", "Hanya petugas yang dapat mengelola data."],
];
const ALUR = ["Input data keluarga, kelompok, dan layanan", "Sistem menghitung skor dan realisasi", "Admin memantau per wilayah dan membandingkan dengan target", "Hasilnya dipakai untuk tindak lanjut dan laporan"];

export default function Beranda({ pergi }) {
  const gulir = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <>
      <section className="hero wrap">
        <div>
          <h1>SIKEL: sistem informasi untuk membantu kerja penyuluh keluarga</h1>
          <p className="muted lead">Website admin untuk mendata keluarga dan kelompok kegiatan, mencatat layanan KB, serta memantau capaian program di tingkat kecamatan dan desa di Kabupaten Kapuas Hulu.</p>
          <div className="actions" style={{ marginTop: 8 }}>
            <button className="btn" onClick={() => pergi("dashboard")}>Buka dashboard</button>
            <button className="btn ghost" onClick={() => gulir("layanan")}>Pelajari lebih lanjut</button>
          </div>
        </div>
        <aside className="hero-card" aria-label="Ringkasan sistem">
          <dl>
            <dt>Cakupan wilayah</dt><dd>23 kecamatan, 277 desa</dd>
            <dt>Data utama</dt><dd>Keluarga, kelompok, layanan KB</dd>
            <dt>Pengguna</dt><dd>Admin dan petugas</dd>
            <dt>Status</dt><dd>Demo portofolio, data fiktif</dd>
          </dl>
        </aside>
      </section>

      <section className="wrap sect">
        <h2>Apa itu SIKEL?</h2>
        <p>SIKEL adalah singkatan dari Sistem Informasi Keluarga. Website ini dibuat sebagai contoh bagaimana pekerjaan pencatatan, pelaporan, dan pemantauan program kependudukan, keluarga berencana, dan pembangunan keluarga dapat dibantu teknologi informasi.</p>
        <p>Selama ini data semacam itu sering tersebar di buku catatan dan berkas terpisah. SIKEL mengumpulkannya dalam satu sistem sehingga profil keluarga, kondisi kelompok kegiatan, dan hasil layanan KB dapat dilihat bersama.</p>
      </section>

      <section className="wrap sect" id="layanan">
        <h2>Layanan yang tersedia</h2>
        <div className="grid g3">{LAYANAN.map(([j, d]) => <div className="card" key={j}><h3>{j}</h3><p className="muted" style={{ margin: 0 }}>{d}</p></div>)}</div>
      </section>

      <section className="wrap sect">
        <h2>Kegunaan untuk siapa</h2>
        <div className="grid g3">{KEGUNAAN.map(([j, d]) => <div className="card" key={j}><h3>{j}</h3><p className="muted" style={{ margin: 0 }}>{d}</p></div>)}</div>
      </section>

      <section className="wrap sect">
        <h2>Fungsi sistem</h2>
        <div className="grid g3">{FUNGSI.map(([j, d]) => <div key={j} style={{ borderLeft: "4px solid var(--blue)", paddingLeft: 14 }}><h3>{j}</h3><p className="muted" style={{ margin: 0 }}>{d}</p></div>)}</div>
      </section>

      <section className="wrap sect">
        <h2>Alur kerja</h2>
        <div className="alur">{ALUR.map((a, i) => <div className="card" key={a}>{a}</div>)}</div>
      </section>

      <section className="wrap sect">
        <div className="notice" style={{ margin: 0 }}>
          Seluruh data pada website ini adalah data fiktif untuk keperluan demo, dan website ini bukan situs resmi BKKBN. Versi untuk masyarakat (edukasi dan alur konseling) dibuat sebagai website terpisah.
        </div>
      </section>
    </>
  );
}

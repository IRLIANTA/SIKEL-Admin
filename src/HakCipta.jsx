export default function HakCipta() {
  return (
    <div className="wrap sect" style={{ paddingTop: 8 }}>
      <h1 style={{ marginBottom: 16 }}>Hak cipta</h1>
      <div className="grid g2">
        <div className="card" style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <img className="foto" src="/irlianta.jpg" alt="Foto Irlianta" width="140" height="140" />
          <div>
            <h2 style={{ marginBottom: 4 }}>Irlianta</h2>
            <p className="muted" style={{ margin: 0 }}>Mahasiswa Teknik Informatika, Universitas Muhammadiyah Pontianak.</p>
          </div>
        </div>
        <div className="card">
          <h3>Tentang pembuat</h3>
          <p>Saya mengembangkan website ini sebagai portofolio untuk seleksi Konselor Keluarga BKKBN Kalimantan Barat di Kabupaten Kapuas Hulu. Tujuannya menunjukkan bahwa kemampuan Informatika dapat membantu pekerjaan pendataan, pemantauan, dan pelaporan program keluarga.</p>
        </div>
        <div className="card">
          <h3>Tujuan website</h3>
          <ul className="plain"><li>Mendemokan sistem pencatatan dan pemantauan yang dapat dipakai penyuluh.</li><li>Menunjukkan pemahaman alur monitoring dan evaluasi dari input sampai impact.</li><li>Menunjukkan kepedulian terhadap data keluarga: semua data pada demo ini fiktif.</li></ul>
        </div>
        <div className="card">
          <h3>Teknologi</h3>
          <ul className="plain"><li>React dan Vite</li><li>Supabase untuk database dan autentikasi (tahap berikutnya)</li><li>GitHub dan Vercel untuk kode dan hosting</li></ul>
        </div>
        <div className="card">
          <h3>Kontak</h3>
          <ul className="plain">
            <li><a href="https://linkedin.com/in/irliantarizkiawan">LinkedIn</a></li>
            <li>Instagram @irrzkiwnn</li>
            <li><a href="mailto:irliantar@gmail.com">irliantar@gmail.com</a></li>
          </ul>
        </div>
        <div className="card">
          <h3>Ketentuan penggunaan</h3>
          <p style={{ margin: 0 }}>© 2026 Irlianta. Seluruh hak cipta atas tampilan dan kode website ini dimiliki pembuat. Website ini bukan produk atau situs resmi BKKBN, dan tidak boleh dipakai untuk menyimpan data keluarga sungguhan.</p>
        </div>
      </div>
    </div>
  );
}

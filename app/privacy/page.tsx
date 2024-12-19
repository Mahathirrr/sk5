export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-heading font-bold">
        Kebijakan Privasi
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          Terakhir diperbarui: 1 Januari 2024
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>Kami mengumpulkan beberapa jenis informasi dari pengguna kami:</p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Informasi Akun (nama, email, foto profil)</li>
            <li>Data Pembelajaran (progress kursus, nilai quiz)</li>
            <li>
              Informasi Pembayaran (diproses melalui penyedia layanan pembayaran
              pihak ketiga)
            </li>
            <li>Data Penggunaan (interaksi dengan platform, log aktivitas)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            2. Penggunaan Informasi
          </h2>
          <p className="text-muted-foreground">
            Informasi yang kami kumpulkan digunakan untuk:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Menyediakan dan meningkatkan layanan pembelajaran</li>
            <li>Personalisasi pengalaman belajar</li>
            <li>Komunikasi terkait layanan dan pembaruan</li>
            <li>Analisis dan pengembangan platform</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            3. Keamanan Data
          </h2>
          <p className="text-muted-foreground">
            Kami menerapkan langkah-langkah keamanan yang ketat untuk melindungi
            data pengguna, termasuk enkripsi data, akses terbatas, dan
            pemantauan keamanan berkelanjutan.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            4. Hak Pengguna
          </h2>
          <p className="text-muted-foreground">Pengguna memiliki hak untuk:</p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Mengakses data pribadi mereka</li>
            <li>Meminta koreksi data yang tidak akurat</li>
            <li>Meminta penghapusan data</li>
            <li>Menolak penggunaan data untuk tujuan tertentu</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">5. Kontak</h2>
          <p className="text-muted-foreground">
            Untuk pertanyaan tentang kebijakan privasi ini, silakan hubungi kami
            melalui:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>WhatsApp: +6281397181617</li>
            <li>Discord: Muhammad Mahathir</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

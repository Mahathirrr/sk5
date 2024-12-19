export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-heading font-bold">
        Syarat & Ketentuan
      </h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          Terakhir diperbarui: 1 Januari 2024
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            1. Ketentuan Umum
          </h2>
          <p className="text-muted-foreground">
            Dengan menggunakan platform Skillopa, Anda menyetujui untuk terikat
            oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian
            apapun dari ketentuan ini, Anda tidak diperkenankan menggunakan
            layanan kami.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            2. Penggunaan Layanan
          </h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Pengguna wajib berusia minimal 13 tahun</li>
            <li>Akun harus menggunakan informasi yang akurat</li>
            <li>Dilarang membagikan akses akun kepada pihak lain</li>
            <li>Konten pembelajaran hanya untuk penggunaan pribadi</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            3. Pembayaran dan Refund
          </h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Pembayaran diproses melalui gateway pembayaran resmi</li>
            <li>Refund dapat diajukan dalam 7 hari setelah pembelian</li>
            <li>Kursus gratis tidak dapat direfund</li>
            <li>
              Pembatalan langganan harus dilakukan 24 jam sebelum periode
              berikutnya
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            4. Hak Kekayaan Intelektual
          </h2>
          <p className="text-muted-foreground">
            Seluruh konten di platform Skillopa dilindungi hak cipta. Pengguna
            dilarang:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Mendistribusikan ulang konten pembelajaran</li>
            <li>Merekam atau mengunduh video pembelajaran</li>
            <li>Menggunakan materi untuk tujuan komersial</li>
            <li>Melanggar hak kekayaan intelektual instruktur</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            5. Penangguhan dan Penghentian
          </h2>
          <p className="text-muted-foreground">
            Skillopa berhak untuk menangguhkan atau menghentikan akun pengguna
            yang:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Melanggar syarat dan ketentuan</li>
            <li>Melakukan tindakan yang merugikan platform</li>
            <li>Menyalahgunakan akses atau fitur platform</li>
            <li>Terlibat dalam aktivitas ilegal</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold">
            6. Perubahan Ketentuan
          </h2>
          <p className="text-muted-foreground">
            Skillopa berhak mengubah syarat dan ketentuan ini sewaktu-waktu.
            Perubahan akan diumumkan melalui platform dan berlaku sejak tanggal
            publikasi.
          </p>
        </section>
      </div>
    </div>
  );
}

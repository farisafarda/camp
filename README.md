# Camping Rental System

Aplikasi Penyewaan Perlengkapan Camping berbasis web ini adalah platform digital yang dirancang untuk mempermudah proses transaksi sewa-menyewa alat outdoor antara pihak penyedia (Admin) dan penyewa (Customer). Dibangun menggunakan ekosistem Node.js dan Express.js untuk sisi backend yang cepat dan scalable, serta MySQL sebagai sistem manajemen basis data yang handal untuk menjamin konsistensi data transaksi.

Sistem ini berfokus pada kemudahan akses bagi pelanggan (user-friendly) dan efisiensi manajemen operasional bagi pengelola melalui pembagian dua hak akses utama: Customer dan Admin.

👥 Hak Akses & Alur Kerja Sistem (Role)
1. Sisi Customer (Landing Page & Form Pemesanan)
Sisi pelanggan dirancang secara ringkas dan informatif dalam bentuk Single Page Application atau Landing Page interaktif. Pelanggan tidak perlu melewati proses registrasi yang rumit untuk melakukan pemesanan, melainkan dapat langsung berinteraksi di halaman utama yang memuat:

Informasi & Deskripsi: Penjelasan umum mengenai layanan penyewaan perlengkapan camping.

Keunggulan Layanan: Poin-poin plus mengapa pelanggan harus menyewa di platform ini (misalnya: alat berkualitas, harga terjangkau, proses cepat).

Katalog Produk Terintegrasi: Tampilan visual produk camping yang tersedia beserta detail harga.

Form Pemesanan Langsung: Formulir intuitif di mana customer dapat langsung mengisi data diri, memilih alat yang ingin disewa, menentukan durasi/tanggal sewa, hingga mengirimkan pesanan. Data dari form ini memanfaatkan API untuk langsung dikirimkan ke basis data secara real-time.

2. Sisi Admin (Dashboard Manajemen)
Sisi pengelola berupa halaman Dashboard privat yang memerlukan otentikasi (login). Admin memiliki kendali penuh untuk memantau bisnis dan memproses transaksi yang masuk melalui fitur:

Manajemen Pesanan Masuk (Incoming Orders): Menampilkan data pesanan terbaru yang dikirim oleh customer melalui landing page. Admin dapat melihat detail sewa dan mengubah status pesanan (misal: Pending, Disetujui, Selesai).

Riwayat Pemesanan (Order History): Catatan menyeluruh dari semua transaksi yang telah selesai atau dibatalkan untuk kebutuhan pembukuan dan evaluasi.

Manajemen Katalog Produk (Aksi CRUD): Admin memiliki otoritas penuh untuk memodifikasi isi katalog yang tampil di landing page, meliputi aksi menambah produk baru, mengubah detail/harga, memperbarui stok, atau menghapus produk yang sudah tidak disewakan.

🛠️ Arsitektur Teknologi (Tech Stack)
Backend: Node.js & Express.js (Menangani routing, logika bisnis, dan API endpoints).

Database: MySQL (Menyimpan data produk, data pelanggan, dan log transaksi penyewaan).

Frontend: HTML5, CSS3, dan JavaScript (Manipulasi DOM untuk form pemesanan dan integrasi Fetch API ke backend).
## Fitur

- landing page : Mila Safira Maulida (202451216)
- Katalog dan login admin: Oky Liyanti Fadila (202451213)
- Manajemen data penyewaan: Farisa Farda Laviani (202451192)
- Riwayat peminjaman: Shasha Bella Aryana (202451176)

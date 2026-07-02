**SISTEM CAMP RENTAL**  
**Destripsi sitem**: Aplikasi Penyewaan Perlengkapan Camping berbasis web ini adalah platform digital menggunakan Node.js, Express, dan MySQL yang mempermudah transaksi sewa-menyewa alat outdoor antara Admin dan Customer melalui landing page informatif yang terintegrasi langsung dengan katalog produk dinamis, fitur Google Maps, serta formulir pemesanan instan. Setiap pesanan yang dikirimkan pelanggan akan langsung masuk secara real-time ke halaman dashboard khusus admin untuk diproses, dipantau status transaksinya, diarsipkan ke dalam riwayat peminjaman, sekaligus otomatis memperbarui manajemen stok pada katalog produk.

### 👤 1. Mila Safira Maulida (202451216)
**Bagian: Tampilan Utama Halaman Depan (*Front-End Landing Page*)**
* **Informasi & Keunggulan:** Menyusun tata letak teks, visual, deskripsi toko, dan poin-poin plus layanan penyewaan perlengkapan camping agar menarik bagi pelanggan.
* **Integrasi Tampilan Halaman:** Menghubungkan seluruh komponen halaman depan  agar menyatu menjadi satu kesatuan *landing page* yang utuh dan rapi.

### 👤 2. Farisa Farda Laviani (202451192)
**Bagian: Form Pemesanan, Lokasi Maps, & Pengiriman Transaksi**
* **Formulir Pemesanan Interaktif:** Membuat form input di halaman depan agar pelanggan dapat mengisi data diri, memilih alat camping, menentukan tanggal sewa, serta durasi peminjaman.
* **Integrasi Google Maps:** Menambahkan fitur peta (Maps) pada halaman pemesanan untuk memudahkan pelanggan menentukan lokasi pengiriman
* **Pengiriman Data Transaksi:** Mengatur logika program agar ketika pelanggan menekan tombol kirim, seluruh data dari form dan koordinat lokasi dari peta langsung terkirim secara instan masuk ke database dashboard admin.

### 👤 3. Oky Liyanti Fadila (202451213)
**Bagian: Hak Akses Admin & Manajemen Katalog Produk**
* **Login Admin (Keamanan):** Membuat sistem verifikasi akses (login) menggunakan akun admin agar halaman *dashboard* pengelolaan aman dari pihak luar.
* **Manajemen Data Produk (CRUD):** Menyediakan fitur di *dashboard* agar admin bisa mengatur produk yang tampil di halaman depan, seperti menambah alat baru, melihat daftar barang, mengedit harga/stok, atau menghapus produk.

### 👤 4. Shasha Bella Aryana (202451176)
**Bagian: Dashboard Pesanan Masuk, Riwayat, & Otomatisasi Stok**
* **Dashboard Pesanan Masuk & Riwayat:** Membuat panel pemantauan untuk admin yang menampilkan daftar pesanan baru yang dikirim (pesanan aktif), sekaligus halaman arsip untuk melihat transaksi masa lalu yang sudah selesai.
* **Tombol Aksi:** Menyediakan tombol bagi admin untuk mengubah status pesanan. Ketika pesanan ditandai *"Selesai"* maka akan masuk ke riwayat pemesanan

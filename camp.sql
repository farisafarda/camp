CREATE DATABASE IF NOT EXISTS db_camping;

USE db_camping;

DROP TABLE IF EXISTS history_peminjaman;
DROP TABLE IF EXISTS pinjam;
DROP TABLE IF EXISTS alat;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer'
);

CREATE TABLE alat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  harga INT NOT NULL,
  tersedia BOOLEAN NOT NULL DEFAULT TRUE,
  img TEXT
);

CREATE TABLE pinjam (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanggal_ambil DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  nama_penyewa VARCHAR(150) NOT NULL,
  nomor_wa VARCHAR(30) NOT NULL,
  alat_dipinjam TEXT NOT NULL,
  link_maps TEXT NOT NULL
);

CREATE TABLE history_peminjaman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pinjam_id INT NOT NULL,
  tanggal_ambil DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  nama_penyewa VARCHAR(150) NOT NULL,
  nomor_wa VARCHAR(30) NOT NULL,
  alat_dipinjam TEXT NOT NULL,
  link_maps TEXT NOT NULL,
  tanggal_selesai DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin');

INSERT INTO alat (nama, harga, tersedia, img) VALUES
('Tenda Dome 2 Orang', 50000, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'),
('Sleeping Bag', 25000, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80'),
('Kompor Portable', 30000, TRUE, 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=800&q=80'),
('Matras Camping', 20000, TRUE, 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80');

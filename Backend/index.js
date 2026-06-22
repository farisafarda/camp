const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_camping',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const ensureHistoryTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS history_peminjaman (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pinjam_id INT NOT NULL,
      tanggal_ambil DATE NOT NULL,
      tanggal_kembali DATE NOT NULL,
      nama_penyewa VARCHAR(150) NOT NULL,
      nomor_wa VARCHAR(30) NOT NULL,
      alat_dipinjam TEXT NOT NULL,
      link_maps TEXT NOT NULL,
      tanggal_selesai DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const normalizeDateTime = (value) => {
  if (!value) {
    return null;
  }

  return value.replace('T', ' ').slice(0, 19);
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi'
      });
    }

    const [rows] = await pool.query(
      'SELECT id, username, role FROM users WHERE username = ? AND password = ? LIMIT 1',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
});

app.get('/api/alat', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nama, harga, tersedia, img FROM alat ORDER BY id ASC');
    const data = rows.map((item) => ({
      ...item,
      tersedia: Boolean(item.tersedia)
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat data alat'
    });
  }
});

app.put('/api/alat/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const [rows] = await pool.query('SELECT id, tersedia FROM alat WHERE id = ? LIMIT 1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alat tidak ditemukan'
      });
    }

    const tersediaBaru = !Boolean(rows[0].tersedia);
    await pool.query('UPDATE alat SET tersedia = ? WHERE id = ?', [tersediaBaru, id]);

    const [updatedRows] = await pool.query('SELECT id, nama, harga, tersedia, img FROM alat WHERE id = ? LIMIT 1', [id]);
    const data = {
      ...updatedRows[0],
      tersedia: Boolean(updatedRows[0].tersedia)
    };

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengubah status alat'
    });
  }
});

app.post('/api/pinjam', async (req, res) => {
  try {
    const {
      nama,
      tanggal_ambil,
      tanggal_kembali,
      nomor_wa,
      alatDipinjam,
      mapsLink
    } = req.body;

    if (!nama || !tanggal_ambil || !tanggal_kembali || !nomor_wa || !Array.isArray(alatDipinjam) || alatDipinjam.length === 0 || !mapsLink) {
      return res.status(400).json({
        success: false,
        message: 'Nama, nomor WhatsApp, tanggal ambil, tanggal kembali, daftar alat, dan lokasi wajib diisi'
      });
    }

    const alat_dipinjam = alatDipinjam
      .map((item) => {
        if (typeof item === 'string') {
          return item.trim();
        }

        if (item && typeof item.nama === 'string') {
          return `${item.nama.trim()} x${Number(item.jumlah) || 1}`;
        }

        return '';
      })
      .filter(Boolean)
      .join(', ');

    if (!alat_dipinjam) {
      return res.status(400).json({
        success: false,
        message: 'Data alat yang dipinjam tidak valid'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO pinjam
        (tanggal_ambil, tanggal_kembali, nama_penyewa, nomor_wa, alat_dipinjam, link_maps)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tanggal_ambil, tanggal_kembali, nama, nomor_wa, alat_dipinjam, mapsLink]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        tanggal_ambil,
        tanggal_kembali,
        nama_penyewa: nama,
        nomor_wa,
        alat_dipinjam,
        link_maps: mapsLink
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat pesanan'
    });
  }
});

app.get('/api/pinjam', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        id,
        DATE_FORMAT(tanggal_ambil, '%Y-%m-%d') AS tanggal_ambil,
        DATE_FORMAT(tanggal_kembali, '%Y-%m-%d') AS tanggal_kembali,
        nama_penyewa,
        nomor_wa,
        alat_dipinjam,
        link_maps
       FROM pinjam
       ORDER BY id DESC`
    );

    const data = rows.map((item) => ({
      ...item,
      nama: item.nama_penyewa,
      alatDipinjam: item.alat_dipinjam,
      mapsLink: item.link_maps,
      status: 'Menunggu'
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat data pesanan'
    });
  }
});

app.get('/api/history-peminjaman', async (req, res) => {
  try {
    await ensureHistoryTable();

    const [rows] = await pool.query(
      `SELECT
        id,
        pinjam_id,
        DATE_FORMAT(tanggal_ambil, '%Y-%m-%d') AS tanggal_ambil,
        DATE_FORMAT(tanggal_kembali, '%Y-%m-%d') AS tanggal_kembali,
        nama_penyewa,
        nomor_wa,
        alat_dipinjam,
        link_maps,
        DATE_FORMAT(tanggal_selesai, '%Y-%m-%d %H:%i:%s') AS tanggal_selesai
       FROM history_peminjaman
       ORDER BY tanggal_selesai DESC, id DESC`
    );

    return res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat history peminjaman'
    });
  }
});

app.put('/api/history-peminjaman/:id', async (req, res) => {
  try {
    await ensureHistoryTable();

    const id = Number(req.params.id);
    const {
      tanggal_ambil,
      tanggal_kembali,
      nama_penyewa,
      nomor_wa,
      alat_dipinjam,
      link_maps,
      tanggal_selesai
    } = req.body;

    if (!tanggal_ambil || !tanggal_kembali || !nama_penyewa || !nomor_wa || !alat_dipinjam || !link_maps || !tanggal_selesai) {
      return res.status(400).json({
        success: false,
        message: 'Semua field history wajib diisi'
      });
    }

    const [result] = await pool.query(
      `UPDATE history_peminjaman
       SET tanggal_ambil = ?,
           tanggal_kembali = ?,
           nama_penyewa = ?,
           nomor_wa = ?,
           alat_dipinjam = ?,
           link_maps = ?,
           tanggal_selesai = ?
       WHERE id = ?`,
      [
        tanggal_ambil,
        tanggal_kembali,
        nama_penyewa,
        nomor_wa,
        alat_dipinjam,
        link_maps,
        normalizeDateTime(tanggal_selesai),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'History tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'History berhasil diperbarui'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui history peminjaman'
    });
  }
});

app.delete('/api/history-peminjaman/:id', async (req, res) => {
  try {
    await ensureHistoryTable();

    const id = Number(req.params.id);
    const [result] = await pool.query('DELETE FROM history_peminjaman WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'History tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'History berhasil dihapus'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus history peminjaman'
    });
  }
});

app.delete('/api/pinjam/:id', async (req, res) => {
  let connection;

  try {
    const id = Number(req.params.id);
    connection = await pool.getConnection();

    await connection.beginTransaction();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS history_peminjaman (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pinjam_id INT NOT NULL,
        tanggal_ambil DATE NOT NULL,
        tanggal_kembali DATE NOT NULL,
        nama_penyewa VARCHAR(150) NOT NULL,
        nomor_wa VARCHAR(30) NOT NULL,
        alat_dipinjam TEXT NOT NULL,
        link_maps TEXT NOT NULL,
        tanggal_selesai DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query(
      `SELECT
        id,
        tanggal_ambil,
        tanggal_kembali,
        nama_penyewa,
        nomor_wa,
        alat_dipinjam,
        link_maps
       FROM pinjam
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    const pesanan = rows[0];

    await connection.query(
      `INSERT INTO history_peminjaman
        (pinjam_id, tanggal_ambil, tanggal_kembali, nama_penyewa, nomor_wa, alat_dipinjam, link_maps)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        pesanan.id,
        pesanan.tanggal_ambil,
        pesanan.tanggal_kembali,
        pesanan.nama_penyewa,
        pesanan.nomor_wa,
        pesanan.alat_dipinjam,
        pesanan.link_maps
      ]
    );

    await connection.query('DELETE FROM pinjam WHERE id = ?', [id]);
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Pesanan selesai'
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus pesanan'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.use('/api', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`
  });
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} sudah dipakai, mencoba port ${port + 1}...`);
      server.close(() => {
        startServer(port + 1);
      });
      return;
    }

    console.error(error);
  });
};

ensureHistoryTable()
  .then(() => {
    startServer(PORT);
  })
  .catch((error) => {
    console.error('Gagal memastikan tabel history_peminjaman:', error);
    startServer(PORT);
  });

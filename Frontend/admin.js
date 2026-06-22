document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://camp-u0as.onrender.com';
  const pesananBody = document.getElementById('pesanan-body');
  const alatBody = document.getElementById('alat-body');
  const historyBody = document.getElementById('history-body');
  const historyForm = document.getElementById('history-form');
  const historyIdInput = document.getElementById('history-id');
  const historyNamaInput = document.getElementById('history-nama');
  const historyWaInput = document.getElementById('history-wa');
  const historyTanggalAmbilInput = document.getElementById('history-tanggal-ambil');
  const historyTanggalKembaliInput = document.getElementById('history-tanggal-kembali');
  const historyAlatInput = document.getElementById('history-alat');
  const historyMapsInput = document.getElementById('history-maps');
  const historySelesaiInput = document.getElementById('history-selesai');
  const historySubmitButton = document.getElementById('history-submit');
  const historyResetButton = document.getElementById('history-reset');
  const historyMessage = document.getElementById('history-message');

  if (
    !pesananBody ||
    !alatBody ||
    !historyBody ||
    !historyForm ||
    !historyIdInput ||
    !historyNamaInput ||
    !historyWaInput ||
    !historyTanggalAmbilInput ||
    !historyTanggalKembaliInput ||
    !historyAlatInput ||
    !historyMapsInput ||
    !historySelesaiInput ||
    !historySubmitButton ||
    !historyResetButton ||
    !historyMessage
  ) {
    return;
  }

  const createMapsUrl = (lokasi) => {
    if (!lokasi) {
      return '#';
    }

    return lokasi.startsWith('http')
      ? lokasi
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lokasi)}`;
  };

  const toDateTimeLocal = (value) => {
    if (!value) {
      return '';
    }

    return value.replace(' ', 'T').slice(0, 16);
  };

  const resetHistoryForm = () => {
    historyForm.reset();
    historyIdInput.value = '';
    historySubmitButton.textContent = 'Update History';
    historyForm.classList.add('hidden');
    historyMessage.textContent = '';
    historyMessage.style.color = '';
  };

  const setHistoryMessage = (message, isError = false) => {
    historyMessage.textContent = message;
    historyMessage.style.color = isError ? '#dc2626' : '#10b981';
  };

  const readJsonResponse = async (response) => {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch (error) {
      throw new Error(`Server mengirim response non-JSON untuk ${response.url}. Pastikan server sudah direstart dan endpoint API tersedia.`);
    }
  };

  const renderPesanan = (pesananArray) => {
    pesananBody.innerHTML = '';

    if (!pesananArray.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 7;
      cell.textContent = 'Belum ada pesanan masuk.';
      row.appendChild(cell);
      pesananBody.appendChild(row);
      return;
    }

    pesananArray.forEach((pesanan) => {
      const row = document.createElement('tr');

      const namaCell = document.createElement('td');
      namaCell.textContent = pesanan.nama_penyewa || pesanan.nama;

      const nomorWaCell = document.createElement('td');
      nomorWaCell.textContent = pesanan.nomor_wa || '-';

      const tanggalKembaliCell = document.createElement('td');
      tanggalKembaliCell.textContent = pesanan.tanggal_kembali || '-';

      const alatCell = document.createElement('td');
      const alatText = Array.isArray(pesanan.alatDipinjam)
        ? pesanan.alatDipinjam
            .map((item) =>
              typeof item === 'string'
                ? item
                : `${item.nama} x${item.jumlah || 1}`
            )
            .join(', ')
        : pesanan.alat_dipinjam || pesanan.alatDipinjam || pesanan.alat || '-';
      alatCell.textContent = alatText;

      const mapsCell = document.createElement('td');
      const mapsLink = document.createElement('a');
      const lokasi = pesanan.link_maps || pesanan.mapsLink || '';
      mapsLink.href = createMapsUrl(lokasi);
      mapsLink.target = '_blank';
      mapsLink.rel = 'noopener noreferrer';
      mapsLink.textContent = 'Buka Maps';
      mapsCell.appendChild(mapsLink);

      const statusCell = document.createElement('td');
      statusCell.textContent = pesanan.status;

      const actionCell = document.createElement('td');
      const completeButton = document.createElement('button');
      completeButton.type = 'button';
      completeButton.className = 'btn-primary';
      completeButton.dataset.id = pesanan.id;
      completeButton.textContent = 'Selesaikan';
      actionCell.appendChild(completeButton);

      row.appendChild(namaCell);
      row.appendChild(nomorWaCell);
      row.appendChild(tanggalKembaliCell);
      row.appendChild(alatCell);
      row.appendChild(mapsCell);
      row.appendChild(statusCell);
      row.appendChild(actionCell);
      pesananBody.appendChild(row);
    });
  };

  const renderHistory = (historyArray) => {
    historyBody.innerHTML = '';

    if (!historyArray.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 8;
      cell.textContent = 'Belum ada history peminjaman.';
      row.appendChild(cell);
      historyBody.appendChild(row);
      return;
    }

    historyArray.forEach((history) => {
      const row = document.createElement('tr');

      const namaCell = document.createElement('td');
      namaCell.textContent = history.nama_penyewa || '-';

      const nomorWaCell = document.createElement('td');
      nomorWaCell.textContent = history.nomor_wa || '-';

      const tanggalAmbilCell = document.createElement('td');
      tanggalAmbilCell.textContent = history.tanggal_ambil || '-';

      const tanggalKembaliCell = document.createElement('td');
      tanggalKembaliCell.textContent = history.tanggal_kembali || '-';

      const alatCell = document.createElement('td');
      alatCell.textContent = history.alat_dipinjam || '-';

      const mapsCell = document.createElement('td');
      const mapsLink = document.createElement('a');
      mapsLink.href = createMapsUrl(history.link_maps || '');
      mapsLink.target = '_blank';
      mapsLink.rel = 'noopener noreferrer';
      mapsLink.textContent = 'Buka Maps';
      mapsCell.appendChild(mapsLink);

      const tanggalSelesaiCell = document.createElement('td');
      tanggalSelesaiCell.textContent = history.tanggal_selesai || '-';

      const actionCell = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn-primary';
      editButton.dataset.action = 'edit';
      editButton.dataset.id = history.id;
      editButton.textContent = 'Edit';

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'secondary-btn';
      deleteButton.dataset.action = 'delete';
      deleteButton.dataset.id = history.id;
      deleteButton.textContent = 'Hapus';

      actionCell.append(editButton, deleteButton);

      row.dataset.history = JSON.stringify(history);

      row.appendChild(namaCell);
      row.appendChild(nomorWaCell);
      row.appendChild(tanggalAmbilCell);
      row.appendChild(tanggalKembaliCell);
      row.appendChild(alatCell);
      row.appendChild(mapsCell);
      row.appendChild(tanggalSelesaiCell);
      row.appendChild(actionCell);
      historyBody.appendChild(row);
    });
  };

  const renderAlat = (alatArray) => {
    alatBody.innerHTML = '';

    if (!alatArray.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.textContent = 'Belum ada data alat.';
      row.appendChild(cell);
      alatBody.appendChild(row);
      return;
    }

    alatArray.forEach((alat) => {
      const row = document.createElement('tr');

      const namaCell = document.createElement('td');
      namaCell.textContent = alat.nama;

      const hargaCell = document.createElement('td');
      hargaCell.textContent = `Rp${Number(alat.harga || 0).toLocaleString('id-ID')}`;

      const statusCell = document.createElement('td');
      statusCell.textContent = alat.tersedia ? 'Tersedia' : 'Habis';

      const actionCell = document.createElement('td');
      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'btn-primary';
      toggleButton.dataset.id = alat.id;
      toggleButton.textContent = alat.tersedia ? 'Set Habis' : 'Set Tersedia';
      actionCell.appendChild(toggleButton);

      row.appendChild(namaCell);
      row.appendChild(hargaCell);
      row.appendChild(statusCell);
      row.appendChild(actionCell);
      alatBody.appendChild(row);
    });
  };

  const fetchData = async () => {
  try {
  const [alatRes, pesananRes] = await Promise.all([
  fetch(`${API_URL}/api/alat`),
  fetch(`${API_URL}/api/pinjam`)
  ]);

      const alatResult = await alatRes.json();
      const pesananResult = await pesananRes.json();

      if (!alatRes.ok || !pesananRes.ok) {
        throw new Error('Gagal memuat data admin');
      }

      renderAlat(alatResult.data);
      renderPesanan(pesananResult.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const historyRes = await fetch(`${API_URL}/api/history-peminjaman`);
      const historyResult = await historyRes.json();

      if (!historyRes.ok) {
        throw new Error(historyResult.message || 'Gagal memuat history peminjaman');
      }

      renderHistory(historyResult.data);
    } catch (error) {
      console.error(error);
      renderHistory([]);
    }
  };

  pesananBody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-id]');

    if (!button) {
      return;
    }

    const id = Number(button.dataset.id);

    try {
      const response = await fetch(`${API_URL}/api/pinjam/${id}`, {
  method: 'DELETE'
});

      if (!response.ok) {
        throw new Error('Gagal menyelesaikan pesanan');
      }

      await fetchData();
    } catch (error) {
      console.error(error);
    }
  });

  alatBody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-id]');

    if (!button) {
      return;
    }

    const id = Number(button.dataset.id);

    try {
      const response = await fetch(`${API_URL}/api/alat/${id}`, {
  method: 'PUT'
});

      if (!response.ok) {
        throw new Error('Gagal mengubah status alat');
      }

      await fetchData();
    } catch (error) {
      console.error(error);
    }
  });

  historyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = historyIdInput.value;
    const payload = {
      nama_penyewa: historyNamaInput.value.trim(),
      nomor_wa: historyWaInput.value.trim(),
      tanggal_ambil: historyTanggalAmbilInput.value,
      tanggal_kembali: historyTanggalKembaliInput.value,
      alat_dipinjam: historyAlatInput.value.trim(),
      link_maps: historyMapsInput.value.trim(),
      tanggal_selesai: historySelesaiInput.value
    };

    if (
      !payload.nama_penyewa ||
      !payload.nomor_wa ||
      !payload.tanggal_ambil ||
      !payload.tanggal_kembali ||
      !payload.alat_dipinjam ||
      !payload.link_maps ||
      !payload.tanggal_selesai
    ) {
      setHistoryMessage('Lengkapi semua field history terlebih dahulu.', true);
      return;
    }

    if (!id) {
      setHistoryMessage('Pilih data history yang ingin diedit terlebih dahulu.', true);
      return;
    }

    if (payload.tanggal_kembali < payload.tanggal_ambil) {
      setHistoryMessage('Tanggal kembali tidak boleh lebih awal dari tanggal ambil.', true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/history-peminjaman/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan history');
      }

      resetHistoryForm();
      setHistoryMessage('History berhasil diperbarui.');
      await fetchData();
    } catch (error) {
      setHistoryMessage(error.message, true);
    }
  });

  historyResetButton.addEventListener('click', () => {
    resetHistoryForm();
  });

  historyBody.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action][data-id]');

    if (!button) {
      return;
    }

    const row = button.closest('tr');
    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'edit') {
      const history = JSON.parse(row.dataset.history || '{}');
      historyIdInput.value = history.id || '';
      historyNamaInput.value = history.nama_penyewa || '';
      historyWaInput.value = history.nomor_wa || '';
      historyTanggalAmbilInput.value = history.tanggal_ambil || '';
      historyTanggalKembaliInput.value = history.tanggal_kembali || '';
      historyAlatInput.value = history.alat_dipinjam || '';
      historyMapsInput.value = history.link_maps || '';
      historySelesaiInput.value = toDateTimeLocal(history.tanggal_selesai || '');
      historySubmitButton.textContent = 'Update History';
      historyForm.classList.remove('hidden');
      historyMessage.textContent = '';
      historyForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (action === 'delete') {
      const yakin = window.confirm('Hapus history peminjaman ini?');

      if (!yakin) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/history-peminjaman/${encodeURIComponent(id)}`, {
  method: 'DELETE'
});

        const result = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(result.message || 'Gagal menghapus history');
        }

        resetHistoryForm();
        setHistoryMessage('History berhasil dihapus.');
        await fetchData();
      } catch (error) {
        setHistoryMessage(error.message, true);
      }
    }
  });

  fetchData();
});

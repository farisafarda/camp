document.addEventListener('DOMContentLoaded', () => {
  const alatList = document.getElementById('alat-list');
  const alatCheckboxes = document.getElementById('alat-checkboxes');
  const rentalForm = document.getElementById('rental-form');
  const formMessage = document.getElementById('form-message');
  const nomorWaInput = document.getElementById('nomor-wa');
  const tanggalAmbilInput = document.getElementById('tanggal-ambil');
  const tanggalKembaliInput = document.getElementById('tanggal-kembali');
  const alamatInput = document.getElementById('alamat');
  const mapsInput = document.getElementById('maps-link');
  const ctaButton = document.querySelector('.cta-button');
  const bookingSection = document.getElementById('booking');

  if (!alatList || !alatCheckboxes || !rentalForm || !formMessage || !nomorWaInput || !tanggalAmbilInput || !tanggalKembaliInput || !alamatInput || !mapsInput || !bookingSection) {
    return;
  }

  if (ctaButton) {
    ctaButton.addEventListener('click', (event) => {
      event.preventDefault();
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  tanggalAmbilInput.min = today;
  tanggalAmbilInput.value = today;
  tanggalKembaliInput.min = today;

  tanggalAmbilInput.addEventListener('change', () => {
    tanggalKembaliInput.min = tanggalAmbilInput.value || today;

    if (tanggalKembaliInput.value && tanggalKembaliInput.value < tanggalKembaliInput.min) {
      tanggalKembaliInput.value = '';
    }
  });

  const mapContainer = document.getElementById('map');
  let map;
  let marker;
  const defaultPosition = [-6.8048, 110.8440];

  if (window.L && mapContainer) {
    map = window.L.map('map').setView(defaultPosition, 13);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = window.L.marker(defaultPosition, { draggable: true }).addTo(map);
    marker.bindPopup('Lokasi penyewaan');
    mapsInput.value = `${defaultPosition[0]}, ${defaultPosition[1]}`;

    const updateLocation = (lat, lng) => {
      mapsInput.value = `${lat}, ${lng}`;
    };

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      updateLocation(position.lat, position.lng);
    });

    map.on('click', (event) => {
      marker.setLatLng(event.latlng);
      updateLocation(event.latlng.lat, event.latlng.lng);
    });
  }

    const createStatusIcon = (tersedia) => {
      const icon = document.createElement('img');
      icon.className = 'status-icon';
      icon.alt = tersedia ? 'Tersedia' : 'Tidak tersedia';
      icon.src = tersedia
        ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="%2310b981"/><path d="M7 12l3 3 7-7" fill="none" stroke="%23fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="%23ef4444"/><path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="%23fff" stroke-width="2" stroke-linecap="round"/></svg>';
      return icon;
    };

    const setSelectedAlat = (alatName, jumlah = 1) => {
      const checkbox = Array.from(alatCheckboxes.querySelectorAll('input[name="alatDipinjam"]'))
        .find((item) => item.value === alatName);

      const jumlahInput = rentalForm.querySelector(`input[name="jumlah"][data-alat-name="${alatName}"]`);

      if (checkbox) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
      }

      if (jumlahInput) {
        jumlahInput.value = jumlah;
        jumlahInput.disabled = false;
      }
    };

    const renderCheckboxes = (alatArray) => {
      alatCheckboxes.innerHTML = '';

      alatArray.forEach((alat) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'alatDipinjam';
        checkbox.value = alat.nama;
        checkbox.id = `alat-${alat.id}`;
        checkbox.disabled = !alat.tersedia;
        checkbox.dataset.alatName = alat.nama;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = `${alat.nama} - Rp${Number(alat.harga || 0).toLocaleString('id-ID')}`;

        const jumlahInput = document.createElement('input');
        jumlahInput.type = 'number';
        jumlahInput.name = 'jumlah';
        jumlahInput.min = '1';
        jumlahInput.value = '1';
        jumlahInput.className = 'item-quantity';
        jumlahInput.dataset.alatName = alat.nama;
        jumlahInput.disabled = true;

        checkbox.addEventListener('change', () => {
          jumlahInput.disabled = !checkbox.checked;
          if (!checkbox.checked) {
            jumlahInput.value = '1';
          }
        });

        wrapper.append(checkbox, label, jumlahInput);
        alatCheckboxes.appendChild(wrapper);
      });
    };

    const renderAlat = (alatArray) => {
      alatList.innerHTML = '';

      alatArray.forEach((alat) => {
        const card = document.createElement('article');
        card.className = 'alat-card';

        const header = document.createElement('div');
        header.className = 'alat-card-header';
        const icon = createStatusIcon(alat.tersedia);
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = alat.tersedia ? 'Tersedia' : 'Tidak Tersedia';
        header.append(icon, badge);

        const title = document.createElement('h3');
        title.textContent = alat.nama;

        const price = document.createElement('p');
        price.className = 'muted';
        price.textContent = `Rp${Number(alat.harga || 0).toLocaleString('id-ID')} / hari`;

        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'card-quantity';

        const quantityLabel = document.createElement('label');
        quantityLabel.textContent = 'Jumlah:';
        quantityLabel.className = 'quantity-label';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.max = '10';
        quantityInput.value = '1';
        quantityInput.className = 'card-quantity-input';
        quantityInput.disabled = !alat.tersedia;

        quantityWrapper.append(quantityLabel, quantityInput);

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Sewa';
        button.disabled = !alat.tersedia;
        button.className = alat.tersedia ? 'btn-primary' : 'btn-disabled';

        button.addEventListener('click', () => {
          if (!alat.tersedia) {
            return;
          }

          setSelectedAlat(alat.nama, Number(quantityInput.value) || 1);
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        card.append(header, title, price, quantityWrapper, button);
        alatList.appendChild(card);
      });
    };

  const fetchAlat = async () => {
    try {
      const response = await fetch('/api/alat');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memuat data alat');
      }

      renderAlat(result.data);
      renderCheckboxes(result.data);
      formMessage.textContent = '';
      formMessage.style.color = '';
    } catch (error) {
      formMessage.textContent = error.message;
      formMessage.style.color = '#dc2626';
    }
  };

  rentalForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const nomor_wa = nomorWaInput.value.trim();
    const tanggal_ambil = tanggalAmbilInput.value;
    const tanggal_kembali = tanggalKembaliInput.value;
    const alamat = alamatInput.value.trim();
    const selectedAlat = Array.from(
      rentalForm.querySelectorAll('input[name="alatDipinjam"]:checked')
    ).map((checkbox) => {
      const jumlahInput = rentalForm.querySelector(
        `input[name="jumlah"][data-alat-name="${checkbox.value}"]`
      );

      return {
        nama: checkbox.value,
        jumlah: Number(jumlahInput?.value) || 1
      };
    });
    const mapsLink = mapsInput.value.trim();

    if (!nama || !nomor_wa || !tanggal_ambil || !tanggal_kembali || !alamat || selectedAlat.length === 0 || !mapsLink) {
      formMessage.textContent = 'Nama, nomor WhatsApp, tanggal ambil, tanggal kembali, alamat lengkap, minimal satu alat, dan lokasi wajib diisi.';
      formMessage.style.color = '#dc2626';
      return;
    }

    if (tanggal_kembali < tanggal_ambil) {
      formMessage.textContent = 'Tanggal kembali tidak boleh lebih awal dari tanggal ambil.';
      formMessage.style.color = '#dc2626';
      return;
    }

    try {
      const response = await fetch('/api/pinjam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nama,
          nomor_wa,
          tanggal_ambil,
          tanggal_kembali,
          alamat,
          alatDipinjam: selectedAlat,
          mapsLink
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal membuat pesanan');
      }

      formMessage.textContent = 'Pesanan berhasil dikirim.';
      formMessage.style.color = '#10b981';
      rentalForm.reset();
      tanggalAmbilInput.value = today;
      tanggalKembaliInput.min = today;
      if (map && marker) {
        marker.setLatLng(defaultPosition);
        map.setView(defaultPosition, 13);
        mapsInput.value = `${defaultPosition[0]}, ${defaultPosition[1]}`;
      }
      await fetchAlat();
    } catch (error) {
      formMessage.textContent = error.message;
      formMessage.style.color = '#dc2626';
    }
  });

  fetchAlat();
});

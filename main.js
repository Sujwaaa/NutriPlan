import './style.css';
import { hitungBMR, hitungTDEE, hitungKebutuhanKalori, distribusiKalori } from './calculator.js';
import { foodDatabase, healthTips } from './foodData.js';

let userData = null;

const sections = {
  hero: document.getElementById('hero'),
  form: document.getElementById('formSection'),
  result: document.getElementById('resultSection')
};

function showSection(sectionName) {
  Object.keys(sections).forEach(key => {
    sections[key].classList.add('hidden');
  });
  sections[sectionName].classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pilihMenuRandom(kategori, targetKalori) {
  const makananKategori = foodDatabase[kategori];
  const menuTerpilih = [];
  let totalKalori = 0;

  const makananAcak = [...makananKategori].sort(() => 0.5 - Math.random());

  for (const makanan of makananAcak) {
    if (totalKalori + makanan.kalori <= targetKalori + 50) {
      menuTerpilih.push(makanan);
      totalKalori += makanan.kalori;
    }

    if (totalKalori >= targetKalori - 50) {
      break;
    }
  }

  if (menuTerpilih.length === 0 && makananAcak.length > 0) {
    menuTerpilih.push(makananAcak[0]);
    totalKalori = makananAcak[0].kalori;
  }

  return { menu: menuTerpilih, totalKalori };
}

function tampilkanRekomendasi(data) {
  const bmr = hitungBMR(data.jenisKelamin, data.beratBadan, data.tinggiBadan, data.umur);
  const tdee = hitungTDEE(bmr, data.aktivitas);
  const kaloriTarget = hitungKebutuhanKalori(tdee, data.target);
  const distribusi = distribusiKalori(kaloriTarget);

  document.getElementById('calorieValue').textContent = kaloriTarget.toLocaleString('id-ID');
  document.getElementById('bmrValue').textContent = `${bmr.toLocaleString('id-ID')} kkal`;

  const targetText = {
    turun: 'Turun Berat Badan',
    naik: 'Naik Berat Badan',
    jaga: 'Jaga Berat Badan'
  };
  document.getElementById('targetValue').textContent = targetText[data.target];

  const sarapan = pilihMenuRandom('sarapan', distribusi.sarapan);
  const siang = pilihMenuRandom('siang', distribusi.siang);
  const malam = pilihMenuRandom('malam', distribusi.malam);
  const snack = pilihMenuRandom('snack', distribusi.snack);

  tampilkanMenu('sarapanMenu', 'sarapanKalori', sarapan);
  tampilkanMenu('siangMenu', 'siangKalori', siang);
  tampilkanMenu('malamMenu', 'malamKalori', malam);
  tampilkanMenu('snackMenu', 'snackKalori', snack);

  const tips = healthTips[data.target];
  const tipsList = document.getElementById('tipsList');
  tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');

  showSection('result');
}

function tampilkanMenu(menuId, kaloriId, data) {
  const menuContainer = document.getElementById(menuId);
  const kaloriElement = document.getElementById(kaloriId);

  kaloriElement.textContent = `${data.totalKalori} kkal`;

  menuContainer.innerHTML = data.menu.map(item => `
    <div class="meal-item">
      <span class="meal-item-name">${item.nama}</span>
      <span class="meal-item-portion">${item.porsi} - ${item.kalori} kkal</span>
    </div>
  `).join('');
}

document.getElementById('btnMulai').addEventListener('click', () => {
  showSection('form');
});

document.getElementById('btnKembali').addEventListener('click', () => {
  showSection('hero');
});

document.getElementById('btnUlang').addEventListener('click', () => {
  showSection('form');
});

document.getElementById('userForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  userData = {
    nama: formData.get('nama'),
    umur: parseInt(formData.get('umur')),
    jenisKelamin: formData.get('jenisKelamin'),
    beratBadan: parseFloat(formData.get('beratBadan')),
    tinggiBadan: parseFloat(formData.get('tinggiBadan')),
    aktivitas: formData.get('aktivitas'),
    target: formData.get('target')
  };

  tampilkanRekomendasi(userData);
});

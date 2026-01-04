export function hitungBMR(jenisKelamin, beratBadan, tinggiBadan, umur) {
  let bmr;

  if (jenisKelamin === 'pria') {
    bmr = 88.362 + (13.397 * beratBadan) + (4.799 * tinggiBadan) - (5.677 * umur);
  } else {
    bmr = 447.593 + (9.247 * beratBadan) + (3.098 * tinggiBadan) - (4.330 * umur);
  }

  return Math.round(bmr);
}

export function hitungTDEE(bmr, aktivitas) {
  return Math.round(bmr * parseFloat(aktivitas));
}

export function hitungKebutuhanKalori(tdee, target) {
  let kaloriTarget;

  switch(target) {
    case 'turun':
      kaloriTarget = tdee - 500;
      break;
    case 'naik':
      kaloriTarget = tdee + 500;
      break;
    case 'jaga':
    default:
      kaloriTarget = tdee;
      break;
  }

  return Math.round(kaloriTarget);
}

export function distribusiKalori(totalKalori) {
  return {
    sarapan: Math.round(totalKalori * 0.30),
    siang: Math.round(totalKalori * 0.40),
    malam: Math.round(totalKalori * 0.20),
    snack: Math.round(totalKalori * 0.10)
  };
}

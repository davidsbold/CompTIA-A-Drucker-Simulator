import * as THREE from 'three';

export function createPlasticRoughnessTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const val = 175 + Math.floor(Math.random() * 48);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export function createPrinterLcdTexture(
  headline = 'BEREIT · A4',
  subline = 'Laserdrucker · Fach 1 OK'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Deep crisp backlit LCD blue
    const grad = ctx.createLinearGradient(0, 0, 0, 192);
    grad.addColorStop(0, '#0c4a6e');
    grad.addColorStop(1, '#082f49');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 192);

    // Subtle LCD border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 176);

    // Text
    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(headline, 28, 82);

    ctx.fillStyle = '#7dd3fc';
    ctx.font = '500 26px sans-serif';
    ctx.fillText(subline, 28, 136);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createFuserWarningTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, 512, 128);

    // Hazard diagonal stripes on edges
    ctx.fillStyle = '#1e293b';
    for (let x = -64; x < 96; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 14, 0);
      ctx.lineTo(x - 18, 128);
      ctx.lineTo(x - 32, 128);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('VORSICHT HEISS · 180 °C', 110, 76);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPaperTexture(printed: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 680);

    // Fine border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 508, 676);

    if (printed) {
      // Header bar
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(42, 48, 428, 46);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('CompTIA A+ · LASERDRUCK', 58, 79);

      // Headline
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('Prüfblatt: 7 Schritte OK', 42, 142);

      // Simulated crisp text paragraphs
      ctx.fillStyle = '#334155';
      const widths = [390, 415, 340, 405, 370, 290];
      widths.forEach((w, idx) => {
        ctx.fillRect(42, 180 + idx * 34, w, 14);
      });

      // Small diagram box
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(42, 405, 428, 145);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.strokeRect(42, 405, 428, 145);

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('P · C · E · D · T · F · C', 120, 468);
      ctx.font = '500 18px sans-serif';
      ctx.fillText('Fixierung erfolgreich abgeschlossen', 95, 506);

      // Footer line
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(42, 600, 220, 10);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDeskSurfaceTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#e8edf3';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#d7e0ea';
    ctx.lineWidth = 1;
    const step = 64;
    for (let i = 0; i <= size; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.1,
      size / 2,
      size / 2,
      size * 0.5
    );
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.42)');
    grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.18)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createNfcBadgePadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#312e81';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, 232, 232);

    ctx.strokeStyle = '#e0e7ff';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    for (const r of [24, 44, 64]) {
      ctx.beginPath();
      ctx.arc(105, 118, r, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }

    ctx.fillStyle = '#e0e7ff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('NFC', 88, 212);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}


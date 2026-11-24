/* Fondos de la marca (copiados de la demo de gestión, src/js/07b-fondos.js): amanecer en el campo y curvas de nivel. */
function azar(semilla){ let a = semilla >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
/* ---------- 1. Amanecer: cielo azul que aclara, sol suave y surcos verdes en perspectiva ---------- */
function fondoAmanecer(){
  const W = 1600, H = 1000, hz = 560, vx = 820, r = azar(11);
  const surcos = Array.from({ length:46 }, (_, i) => { const x = -2400 + i * 140; return `<line x1="${vx}" y1="${hz}" x2="${x}" y2="${H}" stroke="${i % 2 ? '#2F6E1A' : '#5FA82A'}" stroke-width="${i % 2 ? 26 : 30}" stroke-opacity="${i % 2 ? .55 : .35}"/>`; }).join('');
  const nubes = Array.from({ length:6 }, () => { const x = r() * W, y = 90 + r() * 280, w = 160 + r() * 260; return `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${w.toFixed(0)}" ry="${(w * .16).toFixed(0)}" fill="#fff" opacity="${(.10 + r() * .14).toFixed(2)}" filter="url(#am-b)"/>`; }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>
      <linearGradient id="am-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#082F82"/><stop offset=".35" stop-color="#0B3D9E"/><stop offset=".62" stop-color="#3C82CF"/><stop offset=".82" stop-color="#A9CFEF"/><stop offset="1" stop-color="#F7E1B5"/></linearGradient>
      <radialGradient id="am-sol" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF6DA"/><stop offset=".35" stop-color="#FFE3A3" stop-opacity=".85"/><stop offset="1" stop-color="#FFD38A" stop-opacity="0"/></radialGradient>
      <linearGradient id="am-tierra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6DB72E"/><stop offset=".4" stop-color="#3F8A1F"/><stop offset="1" stop-color="#1F4E12"/></linearGradient>
      <filter id="am-b"><feGaussianBlur stdDeviation="18"/></filter>
      <clipPath id="am-c"><rect y="${hz}" width="${W}" height="${H - hz}"/></clipPath></defs>
    <rect width="${W}" height="${hz + 2}" fill="url(#am-cielo)"/>
    <circle cx="1180" cy="${hz - 10}" r="260" fill="url(#am-sol)"/><circle cx="1180" cy="${hz - 10}" r="46" fill="#FFF3CF" opacity=".9"/>
    ${nubes}
    <path d="M0 ${hz} C 220 ${hz - 60} 420 ${hz - 30} 620 ${hz - 55} S 1000 ${hz - 25} 1240 ${hz - 70} S 1500 ${hz - 30} 1600 ${hz - 45} V ${hz + 6} H0 Z" fill="#2E6A1C" opacity=".55"/>
    <path d="M0 ${hz} C 300 ${hz - 25} 520 ${hz - 10} 820 ${hz - 28} S 1300 ${hz - 6} 1600 ${hz - 20} V ${hz + 6} H0 Z" fill="#3F8A1F" opacity=".8"/>
    <rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#am-tierra)"/>
    <g clip-path="url(#am-c)">${surcos}</g>
    <rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#am-cielo)" opacity=".08"/>
    <g transform="translate(470 250) scale(.11)" fill="#0B2E73" opacity=".55">${dpDronSilueta()}</g>
    <path d="M520 278 C 600 330 690 360 780 420" stroke="#9BDB63" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round" fill="none" opacity=".6"/>
  </svg>`;
}
// Silueta simple del dron del logo (para los fondos)
function dpDronSilueta(){ return '<rect x="0" y="40" width="760" height="22" rx="4"/><ellipse cx="120" cy="10" rx="120" ry="10"/><ellipse cx="640" cy="10" rx="120" ry="10"/><rect x="110" y="10" width="18" height="40"/><rect x="630" y="10" width="18" height="40"/><path d="M290 70 C290 10 330 -20 380 -20 C430 -20 470 10 470 70 Z"/>'; }

/* ---------- 2. Blanco con curvas de nivel y la ruta de un vuelo ---------- */
function fondoTopo(){
  const W = 1600, H = 1000, r = azar(23), centros = [[260, 240, 9], [1300, 760, 11], [1220, 170, 6], [420, 860, 7]];
  let lineas = '';
  centros.forEach(([cx, cy, n], k) => {
    const fases = Array.from({ length:5 }, () => r() * 6.28), amps = Array.from({ length:5 }, () => .05 + r() * .09);
    for (let i = 1; i <= n; i++){
      const rad = 34 * i + 10, pts = [];
      for (let a = 0; a <= 64; a++){ const t = a / 64 * Math.PI * 2; const d = rad * (1 + amps.reduce((s, am, j) => s + am * Math.sin(t * (j + 2) + fases[j] + i * .15), 0)); pts.push([cx + Math.cos(t) * d * 1.25, cy + Math.sin(t) * d]); }
      const verde = (i + k) % 4 === 0;
      lineas += `<path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L')} Z" fill="none" stroke="${verde ? '#6DB72E' : '#0B3D9E'}" stroke-opacity="${verde ? .28 : (i % 5 === 0 ? .2 : .1)}" stroke-width="${i % 5 === 0 ? 2.2 : 1.3}"/>`;
    }
  });
  const ruta = [[120, 520], [430, 380], [700, 470], [900, 300], [1180, 420], [1480, 330]];
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><rect width="${W}" height="${H}" fill="#F4F7FB"/>
    <g opacity=".9">${lineas}</g>
    <path d="M${ruta.map(p => p.join(' ')).join(' L')}" fill="none" stroke="#3F8A1F" stroke-width="2.5" stroke-dasharray="3 10" stroke-linecap="round" opacity=".55"/>
    ${ruta.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i ? 6 : 9}" fill="#fff" stroke="${i ? '#6DB72E' : '#0B3D9E'}" stroke-width="2.5" opacity=".8"/>`).join('')}
    <g transform="translate(1440 300) scale(.09)" fill="#0B3D9E" opacity=".35">${dpDronSilueta()}</g>
  </svg>`;
}

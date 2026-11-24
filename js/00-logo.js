/* Logo de Drones del Pampa en SVG con capas (copiado de la demo de gestión, src/js/00-logos.js).
   Agregado: logoDP({blanco:true}) para fondos oscuros (letras blancas). */
const DP = {
  vbCompleto: '188 178 1572 712',   // recorte del logo entero
  vbIcono: '440 182 790 392'        // solo el dron con la espiga (íconos)
};
let _dpN = 0;

// Letras: [letra, x, ancho (escala horizontal)] sobre cada línea de base, Poppins 700.
const DP_LETRAS = [
  { t:'Drones', y:556, f:413, l:[['D',182.2,1.115],['r',522.4,.993],['n',972.3,.994],['e',1254.6,.993],['s',1514.8,1.02]] },
  { t:'Pampa',  y:806, f:310, l:[['P',525.7,1.15],['a',758.2,1],['m',977.5,1.005],['p',1314.2,1.021],['a',1537.2,1]] },
  { t:'del',    y:700, f:155, l:[['d',248,.989],['e',355,.989],['l',452.1,1.1]], verde:true }
];

// Hojas de la espiga: [x, y, giro, escala ancho, escala alto]. El orden es el orden en que
// «crecen» en la animación (de abajo hacia arriba).
const HOJA = 'M0 -40 C 24 -18 24 18 0 40 C -24 18 -24 -18 0 -40 Z';
const DP_HOJAS = [
  [833.5, 519, 0, 1.3, 1.05],                         // la de abajo, colgando
  [806, 462, 32, 1, 1], [861, 462, -32, 1, 1],        // par de abajo
  [806, 396, 32, 1, 1], [861, 396, -32, 1, 1]         // par de arriba
];

function dpDefs(id){
  return `<defs>
    <linearGradient id="${id}-az" gradientUnits="userSpaceOnUse" x1="200" y1="260" x2="1760" y2="860"><stop offset="0" stop-color="#0A3896"/><stop offset=".5" stop-color="#1D60B8"/><stop offset="1" stop-color="#0B3D9E"/></linearGradient>
    <linearGradient id="${id}-ve" gradientUnits="userSpaceOnUse" x1="560" y1="560" x2="1110" y2="190"><stop offset="0" stop-color="#3F8A1F"/><stop offset=".55" stop-color="#5CA829"/><stop offset="1" stop-color="#78C437"/></linearGradient>
    <radialGradient id="${id}-cu" gradientUnits="userSpaceOnUse" cx="862" cy="235" r="120"><stop offset="0" stop-color="#8ED64C"/><stop offset="1" stop-color="#55A126"/></radialGradient>
    <linearGradient id="${id}-de" gradientUnits="userSpaceOnUse" x1="250" y1="700" x2="505" y2="585"><stop offset="0" stop-color="#3F8A1F"/><stop offset="1" stop-color="#6DB72E"/></linearGradient>
    <filter id="${id}-bl" x="-10%" y="-400%" width="120%" height="900%"><feGaussianBlur stdDeviation="5 2.5"/></filter>
  </defs>`;
}

// El dron (lo que despega): hélices, postes, brazo y cuerpo. Cada hélice tiene su «disco»
// difuminado (oculto) que aparece cuando gira.
function dpDron(id){
  const helice = (cx, mitad, lado) => `<g class="dp-helice dp-helice-${lado}" style="transform-box:view-box;transform-origin:${cx}px 215px">
      <ellipse class="dp-disco" cx="${cx}" cy="215" rx="${mitad + 8}" ry="12" fill="#6DB72E" opacity="0" filter="url(#${id}-bl)"/>
      <path class="dp-pala" d="M${cx - mitad} 215 Q${cx} 199 ${cx + mitad} 215 Q${cx} 231 ${cx - mitad} 215 Z"/>
    </g>`;
  return `<g class="dp-dron" fill="url(#${id}-ve)">
    ${helice(572.5, 117.5, 'izq')}${helice(1095.5, 119.5, 'der')}
    <rect x="561" y="201" width="18" height="60" rx="3"/>
    <rect x="1087" y="201" width="18" height="60" rx="3"/>
    <rect x="547" y="254" width="571" height="24" rx="3"/>
    <path class="dp-cuerpo" fill="url(#${id}-cu)" d="M736 300 C736 236 776 201 834 201 C892 201 932 236 932 300 L921 318 Q834 342 747 318 Z"/>
  </g>`;
}

// La «o»: el anillo verde (grueso arriba, se afina hacia abajo y queda abierto) y la espiga adentro.
function dpO(id){
  return `<g class="dp-o" fill="url(#${id}-ve)">
    <path class="dp-anillo" d="M760.3 512 A121.5 121.5 0 1 1 906.7 512 L893.1 512 A93.5 93.5 0 1 0 773.9 512 Z"/>
    <g class="dp-espiga">
      ${DP_HOJAS.map(([x, y, g, sx, sy], i) => `<g transform="translate(${x} ${y}) rotate(${g})"><g class="dp-hoja" data-i="${i}"><path d="${HOJA}" transform="scale(${sx} ${sy})"/></g></g>`).join('')}
    </g>
  </g>`;
}

function dpLetras(id, blanco){
  return `<g class="dp-letras" font-family="Poppins, 'Segoe UI', sans-serif" font-weight="700">` +
    DP_LETRAS.map(p => `<g class="dp-${p.t.toLowerCase()}" fill="${blanco && !p.verde ? '#ffffff' : 'url(#' + id + '-' + (p.verde ? 'de' : 'az') + ')'}" font-size="${p.f}">` +
      p.l.map(([c, x, s]) => `<text transform="translate(${x} ${p.y}) scale(${s} 1)">${c}</text>`).join('') + '</g>').join('') +
    '</g>';
}

// Logo completo. o.vb: viewBox (por defecto, el recorte del logo); o.cls: clases extra.
function logoDP(o){
  o = o || {}; const id = 'dp' + (++_dpN);
  return `<svg class="logo-dp ${o.cls || ''}" viewBox="${o.vb || DP.vbCompleto}" role="img" aria-label="Drones del Pampa" xmlns="http://www.w3.org/2000/svg">
    ${dpDefs(id)}${dpLetras(id, o.blanco)}${dpO(id)}${dpDron(id)}</svg>`;
}

// Solo el ícono (el dron con la espiga): barra de navegación chica, tarjetas, favicon.
function iconoDP(o){
  o = o || {}; const id = 'dpi' + (++_dpN);
  return `<svg class="icono-dp ${o.cls || ''}" viewBox="${DP.vbIcono}" role="img" aria-label="Drones del Pampa" xmlns="http://www.w3.org/2000/svg">
    ${dpDefs(id)}${dpO(id)}${dpDron(id)}</svg>`;
}

// Favicon e ícono de la pantalla de inicio del celular: el ícono sobre un cuadrado blanco redondeado.
function faviconDP(tam){
  tam = tam || 64;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#fff"/>`
    + `<svg x="6" y="20" width="88" height="60" viewBox="${DP.vbIcono}">${dpDefs('f')}${dpO('f')}${dpDron('f')}</svg></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/* =====================================================================
   HERRAMIENTAS COMUNES: atajos, precios en dólares, íconos, ventanas,
   avisos, WhatsApp y achicar fotos subidas.
   ===================================================================== */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// USD 37.900 (punto de miles, como en Uruguay)
function usd(n, conDecimales){
  const v = Number(n) || 0;
  const s = v.toLocaleString('es-UY', { minimumFractionDigits: conDecimales ? 2 : 0, maximumFractionDigits: conDecimales ? 2 : 0 });
  return s;
}
const precioHTML = (n, antes) => n > 0
  ? `<span class="precio"><small>USD</small>${usd(n)}</span>${antes > n ? `<span class="precio-antes">USD ${usd(antes)}</span>` : ''}`
  : `<span class="precio precio-consulta">${t('consultar_precio')}</span>`;

function fechaLarga(iso){
  if (!iso) return '';
  const [a, m, d] = iso.split('-').map(Number);
  const f = new Date(a, m - 1, d);
  return f.toLocaleDateString(IDIOMA === 'pt' ? 'pt-BR' : 'es-UY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function fechaCorta(iso){
  if (!iso) return { d: '', m: '' };
  const [a, m, d] = iso.split('-').map(Number);
  const mes = new Date(a, m - 1, d).toLocaleDateString(IDIOMA === 'pt' ? 'pt-BR' : 'es-UY', { month: 'short' }).replace('.', '');
  return { d, m: mes };
}

// WhatsApp del local con un mensaje armado
function waLink(texto){
  const n = String(Datos.get().config.whatsapp || '').replace(/\D/g, '');
  return 'https://wa.me/' + n + (texto ? '?text=' + encodeURIComponent(texto) : '');
}

/* --- Íconos (trazos simples, heredan el color) --- */
const ICONOS = {
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  abajo: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  carrito: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/>',
  wa: '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 20.5 11.6z"/><path d="M8.8 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.8 1.9c.1.2 0 .5-.1.6l-.6.7c-.1.2-.2.4 0 .6.6 1 1.6 2 2.7 2.6.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .5-.2 1.2-.7 1.5-.5.4-1.4.6-2.6.2a9.6 9.6 0 0 1-5.4-5.1c-.4-1-.4-2 .1-3.2z" fill="currentColor" stroke="none"/>',
  telefono: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ubicacion: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
  play: '<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  usuarios: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  escudo: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  mas: '<path d="M12 5v14M5 12h14"/>', menos: '<path d="M5 12h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  lapiz: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  basura: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  subir: '<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
  ojo: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  casa: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
  filtro: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  comparar: '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>',
  sonido: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  estrella: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  /* categorías de la tienda */
  dron: '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7 8l3 3M17 8l-3 3M7 16l3-3M17 16l-3-3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/>',
  kit: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  bateria: '<rect x="4" y="6" width="14" height="13" rx="2"/><path d="M8 3.5h6M8 11h6M11 8v6"/>',
  helice: '<circle cx="12" cy="12" r="2"/><path d="M12 10C9 6 4 5 3 7s4 4 7 5M12 14c3 4 8 5 9 3s-4-4-7-5"/>',
  motor: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',
  gota: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  granos: '<ellipse cx="7" cy="8" rx="2" ry="3" transform="rotate(-20 7 8)"/><ellipse cx="15" cy="7" rx="2" ry="3" transform="rotate(20 15 7)"/><ellipse cx="11" cy="15" rx="2" ry="3"/><ellipse cx="18" cy="15" rx="2" ry="3" transform="rotate(25 18 15)"/>',
  brazo: '<path d="M3 17l7-7 4 4 7-7"/><circle cx="3" cy="17" r="1.6"/><circle cx="21" cy="7" r="1.6"/>',
  radar: '<path d="M12 12L19 5"/><path d="M5 19a10 10 0 0 1 0-14M8 16a6 6 0 0 1 0-8M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/>',
  generador: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M13 8l-3 4h4l-3 4M6 18v2M18 18v2"/>',
  control: '<rect x="3" y="8" width="18" height="10" rx="3"/><circle cx="8" cy="13" r="1.6"/><circle cx="16" cy="13" r="1.6"/><path d="M8 8V4M16 8V4"/>'
};
const icono = (n, cls) => `<svg class="ico ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[n] || ''}</svg>`;

/* --- Ventanas --- */
let _modalAbierto = null;
function abrirModal(html, opc){
  opc = opc || {};
  cerrarModal(true);
  const velo = $('#velo'), m = $('#modal');
  m.className = 'modal ' + (opc.cls || '');
  m.innerHTML = `<button class="modal-cerrar" aria-label="${t('cerrar')}">${icono('cerrar')}</button>` + html;
  $('.modal-cerrar', m).onclick = () => cerrarModal();
  document.body.classList.add('bloqueado');
  if (window.lenis) window.lenis.stop();
  requestAnimationFrame(() => { velo.classList.add('abierto'); m.classList.add('abierto'); });
  m.scrollTop = 0;
  _modalAbierto = opc;
  if (opc.alAbrir) opc.alAbrir(m);
  return m;
}
function cerrarModal(rapido){
  const m = $('#modal');
  if (!m.classList.contains('abierto')) return;
  m.classList.remove('abierto'); $('#velo').classList.remove('abierto');
  document.body.classList.remove('bloqueado');
  if (window.lenis) window.lenis.start();
  $$('video', m).forEach(v => v.pause());
  if (_modalAbierto && _modalAbierto.alCerrar) _modalAbierto.alCerrar();
  _modalAbierto = null;
  if (!rapido) setTimeout(() => { if (!m.classList.contains('abierto')) m.innerHTML = ''; }, 500);
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrarModal(); if (typeof cerrarCarrito === 'function') cerrarCarrito(); } });

/* --- Avisos chiquitos abajo --- */
function aviso(txt, tipo){
  const c = $('#avisos'); const a = document.createElement('div');
  a.className = 'aviso ' + (tipo || '');
  a.innerHTML = icono(tipo === 'error' ? 'cerrar' : 'check') + `<span>${esc(txt)}</span>`;
  c.appendChild(a);
  setTimeout(() => { a.style.transition = 'opacity .4s, transform .4s'; a.style.opacity = '0'; a.style.transform = 'translateY(10px)'; }, 2800);
  setTimeout(() => a.remove(), 3300);
}

/* --- Fotos subidas desde el panel: se achican antes de guardarlas --- */
function achicarFoto(archivo, max){
  max = max || 1100;
  return new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onerror = mal;
    lector.onload = () => {
      const img = new Image();
      img.onerror = mal;
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const g = c.getContext('2d'); g.drawImage(img, 0, 0, c.width, c.height);
        const png = /png|svg/.test(archivo.type);
        ok(c.toDataURL(png ? 'image/png' : 'image/jpeg', .82));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

// Validación simple de formularios (marca en rojo lo que falta)
function validar(form){
  let ok = true, primero = null;
  $$('[data-obl]', form).forEach(inp => {
    const c = inp.closest('.campo'); let mal = !String(inp.value).trim();
    if (!mal && inp.type === 'email') mal = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim());
    c.classList.toggle('mal', mal);
    if (mal) { ok = false; primero = primero || inp; }
  });
  if (primero) primero.focus();
  return ok;
}

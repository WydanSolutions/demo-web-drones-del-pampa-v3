/* =====================================================================
   MOTOR DE BLOQUES (versión 3, 24/11/2026)
   Cada página es una lista de bloques: { id, tipo, d (los datos),
   fondo, espacio, oculto }. Los tipos se registran con registrarBloque()
   (16b y 16c) y el Estudio los arma, ordena y edita (17-…).
   - Páginas del sistema (Inicio, Drones…): sus partes fijas son bloques
     «sis» que se pueden mover u ocultar, y se les pueden sumar bloques.
   - Páginas propias: solo bloques, con su propia dirección (#/mi-pagina).
   - El menú se arma solo con las páginas marcadas para el menú.
   ===================================================================== */
const BLOQUES = {};
function registrarBloque(tipo, def){ BLOQUES[tipo] = { tipo, grupo: 'Contenido', icono: 'kit', campos: [], ...def }; }

const FONDOS_BLOQUE = [['claro', 'Claro (el de la página)'], ['blanco', 'Blanco'], ['niebla', 'Celeste muy suave'], ['noche', 'Azul noche'], ['verde', 'Verde campo'], ['amanecer', 'Amanecer en el campo'], ['topo', 'Curvas de nivel']];
const ESPACIOS_BLOQUE = [['chico', 'Poco espacio'], ['normal', 'Normal'], ['grande', 'Mucho espacio']];
const OSCUROS = ['noche', 'verde', 'amanecer'];
const EN_EDITOR = /[?&]vista=1\b/.test(location.search);   // la página dentro del Estudio

/* --- Ayudas para los bloques --- */
const T = v => esc(tx(v));
// Texto con formato simple: **negrita**, *cursiva*, [texto](link), renglones con «- » = lista, línea en blanco = párrafo
function md(v){
  const s = tx(v); if (!s.trim()) return '';
  const linea = l => esc(l).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t2, u) => { const h = urlDe(u.replace(/&amp;/g, '&')); return `<a href="${esc(h)}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ''}>${t2}</a>`; });
  return s.split(/\n\s*\n/).map(p => {
    const ls = p.split('\n');
    if (ls.every(l => /^\s*[-•]\s+/.test(l))) return `<ul>${ls.map(l => `<li>${linea(l.replace(/^\s*[-•]\s+/, ''))}</li>`).join('')}</ul>`;
    return `<p>${ls.map(linea).join('<br>')}</p>`;
  }).join('');
}
// Links especiales: «wa:mensaje» = WhatsApp del local · «#/pagina» = página de acá · el resto, tal cual
function urlDe(u){
  u = String(u || '').trim();
  if (/^wa:/i.test(u)) return waLink(u.slice(3).trim() || msjClaudio());
  if (/^tel:|^mailto:|^https?:|^#/.test(u)) return u;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return 'https://' + u;
  return u ? '#/' + u.replace(/^\/+/, '') : '#';
}
const externo = u => /^https?:|^tel:|^mailto:/.test(u) && !/^#/.test(u);
function botonB(b, cls){
  if (!b || !tx(b.txt)) return '';
  const h = urlDe(b.url), wa = /wa\.me/.test(h);
  return `<a class="btn ${wa ? 'btn-wa' : (cls || 'btn-azul')} magnetico" href="${esc(h)}"${externo(h) ? ' target="_blank" rel="noopener"' : ''}>${wa ? icono('wa') : ''}${T(b.txt)}${!wa && !externo(h) ? ' ' + icono('flecha') : ''}</a>`;
}
function cabeceraB(d, centro){
  if (!tx(d.etiqueta) && !tx(d.titulo) && !tx(d.texto)) return '';
  return `<div class="b-cab ${centro ? 'centro' : ''}">${tx(d.etiqueta) ? `<span class="etiqueta"><i></i>${T(d.etiqueta)}</span>` : ''}
    ${tx(d.titulo) ? `<h2 class="titulo chico" data-dividir>${T(d.titulo)}</h2>` : ''}${tx(d.texto) ? `<div class="sub b-md">${md(d.texto)}</div>` : ''}</div>`;
}
// Video: YouTube, Instagram (publicación o reel), o un archivo (.mp4 / del Drive)
function videoHTML(url, opc){
  opc = opc || {}; url = String(url || '').trim(); if (!url) return '';
  let m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  if (m) return `<div class="b-marco ${opc.vertical ? 'vertical' : ''}"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?rel=0" title="Video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
  m = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
  if (m) return `<div class="b-marco ig"><iframe src="https://www.instagram.com/${m[1] === 'tv' ? 'p' : m[1]}/${m[2]}/embed" title="Instagram" loading="lazy" allowtransparency="true" scrolling="no"></iframe></div>`;
  const poster = /\.mp4$/i.test(url) ? url.replace(/\.mp4$/i, '.jpg') : '';
  return `<div class="b-marco ${opc.vertical ? 'vertical' : ''} archivo"><video src="${esc(url)}" ${poster && /^media\//.test(poster) ? `poster="${esc(poster)}"` : ''} ${opc.auto ? 'muted loop autoplay playsinline data-auto' : 'controls playsinline preload="metadata"'}></video></div>`;
}

/* --- Páginas --- */
const paginaDe = id => (Datos.get().paginas || []).find(p => p.id === id);
function tituloPagina(p){
  if (!p) return '';
  if (p.sistema) return t((PAGINAS_SISTEMA.find(x => x[0] === p.id) || [])[1] || p.id);
  return tx(p.titulo) || p.id;
}
const _PAG_BASE = {};

// Envuelve las páginas del sistema y registra las propias (se llama al cargar y cada vez que cambia algo)
function prepararPaginas(){
  for (const [pid] of PAGINAS_SISTEMA) if (PAGINAS[pid] && !_PAG_BASE[pid]) { _PAG_BASE[pid] = PAGINAS[pid]; PAGINAS[pid] = envolverPagina(pid); }
  for (const k of Object.keys(PAGINAS)) if (PAGINAS[k].propia) delete PAGINAS[k];
  for (const p of (Datos.get().paginas || []).filter(x => !x.sistema && x.id && !PAGINAS[x.id])) PAGINAS[p.id] = paginaPropia(p.id);
  armarMenu();
}
function envolverPagina(pid){
  const B = _PAG_BASE[pid];
  return { ...B,
    html(id, q){ const pag = paginaDe(pid); if (id || !pag) return B.html(id, q); return renderBloques(pag, () => B.html(id, q)); },
    alMostrar(v, id, q){ if (B.alMostrar) B.alMostrar(v, id, q); if (!id) iniciarBloques(v); } };
}
function paginaPropia(pid){
  return { propia: true,
    titulo: () => { const p = paginaDe(pid); return p ? (tx((p.seo || {}).titulo) || tituloPagina(p)).replace(/ · Drones del Pampa.*$/, '') : ''; },
    html(){ const p = paginaDe(pid); if (!p) return ''; return renderBloques(p) || `<section class="bloque"><div class="contenedor b-vacia">${icono('mas')}<p>Esta página todavía no tiene bloques.</p></div></section>`; },
    alMostrar(v){ iniciarBloques(v); } };
}

// Menú: [id, clave del texto, ícono, grupo] — lo usan el menú de arriba, la barra del celular y el pie
function armarMenu(){
  const ps = Datos.get().paginas || [];
  MENU.length = 0;
  for (const p of ps) {
    if (!p.menu || p.menu === 'no' || !PAGINAS[p.id]) continue;
    let clave = (PAGINAS_SISTEMA.find(x => x[0] === p.id) || [])[1];
    if (!p.sistema) { clave = 'pg_' + p.id; IDIOMAS.es[clave] = tx(p.titulo) || p.id; IDIOMAS.pt[clave] = (p.titulo || {}).pt || IDIOMAS.es[clave]; }
    MENU.push([p.id, clave, p.icono || 'kit', p.menu]);
  }
  if (!MENU.some(m => m[0] === 'inicio')) MENU.unshift(['inicio', 'p_inicio', 'casa', 'arriba']);
}

/* --- Dibujar bloques --- */
function renderBloques(pag, contenido){
  return (pag.bloques || []).filter(b => !b.oculto || EN_EDITOR).map(b => {
    let h = '';
    try { h = b.tipo === 'sis' ? parteSistema(pag, b, contenido) : bloqueHTML(b); }
    catch (e) { console.warn('Bloque con problemas', b, e); h = EN_EDITOR ? `<section class="bloque"><div class="contenedor b-vacia">No se pudo mostrar este bloque.</div></section>` : ''; }
    const nombre = b.tipo === 'sis' ? nombreParte(pag, b) : (BLOQUES[b.tipo] || {}).nombre || b.tipo;
    return `<div class="bq ${b.oculto ? 'bq-oculto' : ''}" data-bq="${esc(b.id)}" data-nombre="${esc(nombre)}">${h}</div>`;
  }).join('');
}
function nombreParte(pag, b){
  if (b.clave === 'contenido') return 'Contenido de «' + tituloPagina(pag) + '»';
  return ((PARTES_INICIO.find(x => x[0] === b.clave) || [])[1]) || b.clave;
}
function parteSistema(pag, b, contenido){
  if (b.clave === 'contenido') return contenido ? contenido() : '';
  return typeof SIS_INICIO !== 'undefined' && SIS_INICIO[b.clave] ? SIS_INICIO[b.clave]() : '';
}
function bloqueHTML(b){
  const def = BLOQUES[b.tipo]; if (!def) return '';
  const d = b.d || {}, fondo = b.fondo || def.fondo || 'claro', oscuro = OSCUROS.includes(fondo);
  const interior = def.render(d, b, oscuro);
  if (def.completo) return interior;
  const arte = fondo === 'amanecer' ? `<div class="b-fondo-arte">${fondoAmanecer()}</div>` : fondo === 'topo' ? `<div class="b-fondo-arte topo">${fondoTopo()}</div>` : '';
  return `<section class="bloque b-sec bt-${b.tipo} f-${fondo} e-${b.espacio || 'normal'} ${oscuro ? 'noche b-oscuro' : ''}">${arte}<div class="contenedor ${def.angosto ? 'b-angosto' : ''}">${interior}</div></section>`;
}
function iniciarBloques(v){
  $$('.bq[data-bq]', v).forEach(el => {
    const b = buscarBloque(el.dataset.bq); if (!b || b.tipo === 'sis') return;
    const def = BLOQUES[b.tipo]; if (def && def.alMostrar) try { def.alMostrar(el, b.d || {}, b); } catch (e) { console.warn(e); }
  });
}
function buscarBloque(id){
  for (const p of Datos.get().paginas || []) { const b = (p.bloques || []).find(x => x.id === id); if (b) return b; }
  return null;
}

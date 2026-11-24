/* =====================================================================
   APP: cada sección es su propia PÁGINA (#/drones, #/tienda/…),
   con una transición de marca al cambiar (telón azul con el dron del
   logo que cruza). También: menú de arriba, barra de abajo en el
   celular (como una app), hoja «Más», pie con Claudio y carga inicial.
   ===================================================================== */
const PAGINAS = {};             // cada archivo de página se registra acá
const MENU = [];               // [id, clave del texto, ícono, 'arriba' | 'mas'] — lo arma armarMenu() con las páginas (16-bloques.js)

function leerRuta(){
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  const [camino, query] = h.split('?');
  const partes = camino.split('/').filter(Boolean);
  const seccion = PAGINAS[partes[0]] ? partes[0] : 'inicio';
  return { seccion, id: partes[1] || '', q: new URLSearchParams(query || '') };
}
function irA(ruta){ const nueva = '#/' + ruta.replace(/^#?\/?/, ''); if (location.hash === nueva) mostrarRuta(true); else location.hash = nueva; }
let _rutaActual = null;

window.addEventListener('hashchange', () => transicion(() => mostrarRuta(), etiquetaRuta()));
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#/"], a[href="#"]'); if (!a) return;
  if (a.getAttribute('href') === '#') { e.preventDefault(); return; }
  cerrarMas(); cerrarModal(true); if (typeof cerrarCarrito === 'function') cerrarCarrito();
  if (a.getAttribute('href') === location.hash) { e.preventDefault(); subirArriba(); }
});
function etiquetaRuta(){ const r = leerRuta(), m = MENU.find(x => x[0] === r.seccion); return m ? t(m[1]) : ''; }

/* --- Dibuja la página que corresponde a la dirección --- */
function mostrarRuta(mantenerScroll){
  const r = leerRuta(), P = PAGINAS[r.seccion];
  cerrarModal(true);                       // una ventana abierta (ej. el festejo) no queda encima de otra página
  const v = $('#vista');
  if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(s => s.kill());
  document.body.classList.toggle('sin-marco', !!P.sinMarco);
  v.innerHTML = `<div class="pagina pagina-${r.seccion}">${P.html(r.id, r.q)}</div>${P.sinMarco ? '' : pieHTML()}`;
  document.title = (P.titulo ? P.titulo(r.id) + ' · ' : '') + 'Drones del Pampa · Rivera';
  marcarMenu(r.seccion);
  if (!mantenerScroll) subirArriba(true);
  if (P.alMostrar) P.alMostrar(v, r.id, r.q);
  activarPie(v);
  refrescarAnimaciones(v);
  _rutaActual = r;
  if (typeof Estadisticas !== 'undefined') Estadisticas.visita(r);
}
function subirArriba(inmediato){ if (window.lenis) window.lenis.scrollTo(0, { immediate: !!inmediato, duration: 1.2 }); else window.scrollTo({ top: 0, behavior: inmediato ? 'auto' : 'smooth' }); }

// Vuelve a dibujar todo (al cambiar el idioma o guardar en el panel)
function dibujarTodo(desdePanel){
  dibujarMarco();
  const y = window.scrollY;
  mostrarRuta(true);
  if (desdePanel) window.scrollTo(0, y);
}

/* --- Telón entre páginas --- */
let _enTransicion = false;
function transicion(cambiar, texto){
  const tel = $('#telon');
  if (!window.gsap || QUIETO || _enTransicion || EN_EDITOR) { cambiar(); return; }
  _enTransicion = true;
  $('.telon-txt', tel).textContent = texto || '';
  const tl = gsap.timeline({ onComplete: () => { _enTransicion = false; gsap.set(tel, { visibility: 'hidden' }); } });
  tl.set(tel, { visibility: 'visible' })
    .fromTo(tel, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .5, ease: 'expo.inOut' })
    .fromTo('.telon-dron', { xPercent: -60, x: '-30vw', rotate: -8 }, { xPercent: -50, x: 0, rotate: 0, duration: .5, ease: 'expo.out' }, .15)
    .fromTo('.telon-txt', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .4, ease: 'expo.out' }, .25)
    .add(() => cambiar())
    .to('.telon-dron', { x: '40vw', y: '-30vh', rotate: 10, duration: .55, ease: 'power3.in' }, '+=.05')
    .to('.telon-txt', { yPercent: -100, opacity: 0, duration: .3 }, '<')
    .to(tel, { clipPath: 'inset(0 0 100% 0)', duration: .6, ease: 'expo.inOut' }, '-=.3')
    .add(() => entradaPagina(), '-=.45');
}

/* --- Marco fijo: menú de arriba, barra de abajo y hoja «Más» --- */
function dibujarMarco(){
  const cl = Datos.get().claudio;
  $('#nav').innerHTML = `
    <div class="nav-in contenedor">
      <a href="#/" class="nav-logo" aria-label="Drones del Pampa · Inicio">${logoDP({ cls: 'logo-nav' })}</a>
      <nav class="nav-enlaces"><span class="nav-luz"></span>${menuArriba().map(([id, k]) => `<a href="#/${id === 'inicio' ? '' : id}" data-sec="${id}">${esc(t(k))}</a>`).join('')}
        ${menuMas().length ? `<div class="nav-mas"><button class="nav-mas-btn" data-sec="masnav">${t('p_mas')} ${icono('abajo')}</button><div class="nav-mas-lista">${menuMas().map(([id, k, ic]) => `<a href="#/${id}" data-sec="${id}">${icono(ic)}${esc(t(k))}</a>`).join('')}</div></div>` : ''}</nav>
      <div class="nav-acciones">
        ${selectorIdioma()}
        <button class="nav-carrito" aria-label="${t('carrito')}" onclick="abrirCarrito()">${icono('carrito')}<b class="burbuja" id="burbuja">0</b></button>
        <a class="nav-claudio" href="${waLink(msjClaudio())}" target="_blank" rel="noopener">${icono('wa')}<span>${t('escribinos')}</span></a>
      </div>
    </div>`;
  $('#barra').innerHTML = [...menuArriba().slice(0, 4), ['mas', 'p_mas', 'menu']].map(([id, k, ic]) =>
    id === 'mas' ? `<button class="barra-item" data-sec="mas" onclick="abrirMas()">${icono(ic)}<span>${t(k)}</span></button>`
      : `<a class="barra-item" href="#/${id === 'inicio' ? '' : id}" data-sec="${id}">${icono(ic)}<span>${t(k)}</span></a>`).join('');
  $('#mas').innerHTML = `<div class="mas-asa"></div>
    ${[...menuArriba().slice(4), ...menuMas()].map(([id, k, ic]) => `<a href="#/${id}" class="mas-item">${icono(ic)}<span>${t(k)}</span>${icono('flecha')}</a>`).join('')}
    <div class="mas-idioma"><span>${t('idioma')}</span>${selectorIdioma()}</div>
    <a class="btn btn-wa" href="${waLink(msjClaudio())}" target="_blank" rel="noopener">${icono('wa')} ${t('hablar_claudio')}</a>`;
  $('#wa-flotante').href = waLink(msjClaudio()); $('#wa-flotante').innerHTML = `<span class="wa-logo">${iconoDP({ cls: 'wa-logo-dp' })}</span>${icono('wa')}`; $('#wa-flotante').setAttribute('aria-label', t('hablar_claudio'));
  $$('[data-idioma]').forEach(b => b.onclick = () => { cerrarMas(); cambiarIdioma(b.dataset.idioma); });
  actualizarBurbuja();
  if (_rutaActual) marcarMenu(_rutaActual.seccion);
}
const selectorIdioma = () => `<div class="idioma" role="group" aria-label="${t('idioma')}"><span class="idioma-luz ${IDIOMA}"></span>
  <button data-idioma="es" class="${IDIOMA === 'es' ? 'act' : ''}">ES</button><button data-idioma="pt" class="${IDIOMA === 'pt' ? 'act' : ''}">PT</button></div>`;
// Los mensajes van a Drones del Pampa (responde el equipo, no siempre Claudio) — pedido del 12/11/2026
const msjClaudio = () => IDIOMA === 'pt' ? 'Olá, Drones del Pampa! Vi o site e quero fazer uma consulta.' : '¡Hola, Drones del Pampa! Vi la página y quiero hacer una consulta.';

const menuArriba = () => MENU.filter(m => m[3] !== 'mas');
const menuMas = () => MENU.filter(m => m[3] === 'mas');
function marcarMenu(sec){
  $$('[data-sec]').forEach(a => a.classList.toggle('act', a.dataset.sec === sec || (sec !== 'inicio' && !menuArriba().slice(0, 4).some(m => m[0] === sec) && a.dataset.sec === 'mas' && a.classList.contains('barra-item'))));
  const act = $(`.nav-enlaces a[data-sec="${sec}"]`), luz = $('.nav-luz');
  if (act && luz) { luz.style.width = act.offsetWidth + 'px'; luz.style.transform = `translateX(${act.offsetLeft}px)`; luz.style.opacity = 1; }
}
function abrirMas(){ $('#mas').classList.add('abierto'); $('#velo-mas').classList.add('abierto'); }
function cerrarMas(){ const m = $('#mas'); if (m) { m.classList.remove('abierto'); $('#velo-mas').classList.remove('abierto'); } }

/* --- Pie de cada página: franja con Claudio + datos --- */
function pieHTML(){
  const c = Datos.get().config, cl = Datos.get().claudio;
  return `<footer class="pie">
    <div class="contenedor"><div class="pie-cta" data-aparece>
      <span class="pie-cta-foto pie-cta-logo">${iconoDP({ cls: 'pie-cta-dp' })}</span>
      <div><h3>${t('cta_titulo')}</h3><p>${t('cta_txt')}</p></div>
      <a class="btn btn-wa" href="${waLink(msjClaudio())}" target="_blank" rel="noopener">${icono('wa')} ${t('hablar_claudio')}</a>
      <svg class="pie-cta-dron" viewBox="${DP.vbIcono}">${dpDefs('pc')}${dpDron('pc')}</svg>
    </div></div>
    <div class="contenedor pie-in">
      <div class="pie-marca">${logoDP({ cls: 'logo-pie' })}<p>${t('pie_txt')}</p>
        <div class="pie-sello"><img src="media/marca/dragur-dji-color.svg" alt="Dragur · DJI Agriculture"></div></div>
      <div class="pie-col"><b>${IDIOMA === 'pt' ? 'Páginas' : 'Páginas'}</b>${MENU.map(([id, k]) => `<a href="#/${id === 'inicio' ? '' : id}">${t(k)}</a>`).join('')}</div>
      <div class="pie-col"><b>${t('p_contacto')}</b>${c.telefonos.filter(Boolean).map(n => `<a href="tel:${n.replace(/\D/g, '')}">${icono('telefono')}${esc(n)}</a>`).join('')}
        <a href="${esc(c.instagram)}" target="_blank" rel="noopener">${icono('instagram')}Instagram</a><span>${icono('ubicacion')}${esc(tx(c.direccion))}</span><span>${icono('reloj')}${esc(tx(c.horarios))}</span></div>
    </div>
    <div class="contenedor pie-legal"><span>© ${new Date().getFullYear()} Drones del Pampa · Rivera, Uruguay. ${t('derechos')} DJI y Agras son marcas de SZ DJI Technology Co., Ltd.</span>
      <span><button class="pie-admin" onclick="abrirAdmin()">${t('administrar')}</button> · ${t('hecho')} <b>Wydan Solutions</b></span></div>
  </footer>`;
}
function activarPie(v){ const d = $('.pie-cta-dron', v); if (d) d.classList.add('vuela'); }

/* --- Pantalla de carga: el logo se arma y el dron despega --- */
function pantallaDeCarga(){
  const c = $('#cargador');
  c.innerHTML = `<div class="carga-fondo">${fondoTopo()}</div><div class="carga-logo">${logoDP({ cls: 'logo-carga' })}</div><div class="carga-barra"><i></i></div>`;
  return new Promise(ok => {
    if (!window.gsap || QUIETO) { c.remove(); return ok(); }
    const tl = gsap.timeline({ onComplete: () => { c.remove(); ok(); } });
    tl.from('.logo-carga .dp-letras text', { opacity: 0, y: 50, duration: .55, stagger: .03, ease: 'expo.out' })
      .from('.logo-carga .dp-anillo', { scale: 0, transformOrigin: '833px 430px', duration: .6, ease: 'back.out(1.8)' }, '-=.35')
      .from('.logo-carga .dp-hoja', { scale: 0, transformOrigin: '50% 100%', duration: .35, stagger: .06 }, '-=.25')
      .from('.logo-carga .dp-dron', { y: 60, opacity: 0, duration: .5, ease: 'expo.out' }, '-=.2')
      .to('.carga-barra i', { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
      .to('.logo-carga .dp-dron', { y: -340, duration: .9, ease: 'power2.in' }, '+=.2')
      .to(c, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' }, '-=.3');
  });
}

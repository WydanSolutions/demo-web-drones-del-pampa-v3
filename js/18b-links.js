/* =====================================================================
   LINK EN LA BIO (versión 3): la página para poner en la biografía de
   Instagram (#/links). Pantalla completa, como una app: logo, frase y
   botones grandes (WhatsApp, tienda, preventa, cómo llegar…).
   Cuenta cuántos tocan cada botón (Estadísticas) y tiene QR para imprimir.
   ===================================================================== */
const FONDOS_LINKS = [['amanecer', 'Amanecer en el campo'], ['azul', 'Azul noche'], ['topo', 'Curvas de nivel'], ['blanco', 'Blanco']];
const linkDeLaBio = () => location.href.split('#')[0].split('?')[0] + '#/links';

function linksHTML(L){
  L = L || Datos.get().links || { items: [] };
  const fondo = L.fondo || 'amanecer', ig = Datos.get().config.instagram;
  return `<div class="lk lk-${fondo}"><div class="lk-fondo">${fondo === 'amanecer' ? fondoAmanecer() : fondo === 'topo' ? fondoTopo() : ''}</div>
    <div class="lk-in">
      <div class="lk-avatar">${L.foto ? `<img src="${esc(L.foto)}" alt="">` : iconoDP({ cls: 'lk-dp' })}</div>
      <h1>${esc(L.titulo || 'Drones del Pampa')}</h1><p>${T(L.bajada)}</p>
      <div class="lk-idioma">${selectorIdioma()}</div>
      <nav class="lk-botones">${(L.items || []).filter(x => x.visible !== false).map(x => { const h = urlDe(x.url);
        return `<a class="lk-btn ${x.destacado ? 'dest' : ''} ${/wa\.me/.test(h) ? 'wa' : ''}" href="${esc(h)}" data-lk="${esc(x.id)}"${externo(h) ? ' target="_blank" rel="noopener"' : ''}>
          <span class="lk-ico">${icono(x.icono || 'enlace')}</span><span>${T(x.texto)}</span>${icono(externo(h) ? 'externo' : 'flecha')}</a>`; }).join('')}</nav>
      <div class="lk-redes"><a href="${esc(ig)}" target="_blank" rel="noopener" aria-label="Instagram">${icono('instagram')}</a><a href="${esc(waLink(msjClaudio()))}" target="_blank" rel="noopener" aria-label="WhatsApp">${icono('wa')}</a>
        <a href="#/" aria-label="${t('lk_web')}">${icono('mundo')}</a></div>
      <small class="lk-pie">Drones del Pampa · Rivera · Sucursal oficial Dragur</small></div></div>`;
}

PAGINAS.links = { sinMarco: true, titulo: () => 'Links',
  html(){ return linksHTML(); },
  alMostrar(v){
    $$('[data-idioma]', v).forEach(b => b.onclick = () => cambiarIdioma(b.dataset.idioma));
    $$('[data-lk]', v).forEach(a => a.addEventListener('click', () => { if (typeof Estadisticas !== 'undefined') Estadisticas.clicLink(a.dataset.lk); }));
    if (window.gsap && !QUIETO && !EN_EDITOR) gsap.from($$('.lk-avatar, .lk-in h1, .lk-in p, .lk-btn, .lk-redes', v), { y: 24, opacity: 0, duration: .8, stagger: .06, ease: 'expo.out', clearProps: 'all' });
  } };

/* ---------- En el Estudio ---------- */
const CAMPOS_LINKS = [['titulo', 'Nombre', 'texto'], ['bajada', 'Frase debajo del nombre', 'i18n'], ['foto', 'Foto o logo redondo (vacío = el logo)', 'img'],
  ['fondo', 'Fondo', 'select', FONDOS_LINKS],
  ['items', 'Botones', 'items', [['texto', 'Texto', 'i18n'], ['url', 'A dónde lleva', 'url'], ['icono', 'Ícono', 'icono'], ['destacado', 'Destacado (más grande, en verde)', 'check'], ['visible', 'Se ve', 'check']]]];

seccionEstudio({ id: 'links', nombre: 'Link en la bio', icono: 'enlace', grupo: 'Diseño',
  render(){
    const clics = typeof Estadisticas !== 'undefined' ? Estadisticas.clicsLinks() : {};
    return `<div class="ad-cab"><div><h2>Link en la bio</h2><p>Una página hecha para poner en la biografía de Instagram: todos sus enlaces en un solo lugar. Los cambios se ven en vivo en el celular de la derecha.</p></div>
        <div class="es-cab-acc"><button class="btn btn-borde btn-chico" onclick="copiarLinkBio()">${icono('copiar')} Copiar el link</button><button class="btn btn-azul btn-chico" onclick="qrLinkBio()">${icono('qr')} Código QR</button></div></div>
      <div class="lk-editor"><div class="lk-form ae-form" id="lk-form"></div>
        <div class="lk-prev"><div class="lk-cel"><div class="lk-cel-pantalla" id="lk-prev"></div></div>
          <div class="lk-url">${icono('enlace')}<span>${esc(linkDeLaBio())}</span></div>
          <div class="lk-clics"><b>Toques en los últimos 30 días</b>${(Datos.get().links.items || []).map(x => `<div><span>${T(x.texto)}</span><b>${clics[x.id] || 0}</b></div>`).join('')}</div></div></div>`;
  },
  alMostrar(c){
    const L = Datos.get().links;
    const prev = () => { $('#lk-prev').innerHTML = linksHTML(L); };
    const pintar = () => { $('#lk-form').innerHTML = camposEs(CAMPOS_LINKS, L); activarCamposEs($('#lk-form'), L, (estr) => { clearTimeout(window._lkG); window._lkG = setTimeout(() => { Datos.guardar(); prev(); }, estr ? 0 : 250); }, () => { pintar(); prev(); }); };
    pintar(); prev();
  } });

function copiarLinkBio(){ navigator.clipboard && navigator.clipboard.writeText(linkDeLaBio()).then(() => aviso('Link copiado. Pegalo en la biografía de Instagram.')); }
async function qrLinkBio(){
  abrirModal(`<div class="es-modal centro"><h3>${icono('qr')} Código QR del link</h3><p>Para imprimir en el mostrador, en folletos o en las cajas: al escanearlo se abre la página de links.</p>
    <div class="es-qr" id="es-qr">Armando el código…</div><p class="es-qr-url">${esc(linkDeLaBio())}</p>
    <div class="es-modal-pie"><button class="btn btn-verde btn-chico" id="qr-bajar">${icono('descargar')} Descargar (PNG)</button></div></div>`, { cls: 'chico' });
  try {
    await cargarScript('https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js');
    const q = qrcode(0, 'M'); q.addData(linkDeLaBio()); q.make();
    $('#es-qr').innerHTML = q.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
    $('#qr-bajar').onclick = () => {
      const n = q.getModuleCount(), k = 16, m = 4, cv = document.createElement('canvas'); cv.width = cv.height = (n + m * 2) * k;
      const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#0b3d9e';
      for (let r = 0; r < n; r++) for (let c2 = 0; c2 < n; c2++) if (q.isDark(r, c2)) g.fillRect((c2 + m) * k, (r + m) * k, k, k);
      const a = document.createElement('a'); a.download = 'qr-link-drones-del-pampa.png'; a.href = cv.toDataURL('image/png'); a.click();
    };
  } catch (e) { $('#es-qr').textContent = 'No se pudo armar el código (¿sin internet?).'; }
}

/* =====================================================================
   NOVEDADES (versión 3): publicaciones tipo blog con portada, texto con
   formato, fotos, video y enlaces. Se pueden dejar en borrador o
   PROGRAMAR (salen solas el día y la hora elegidos).
   Página pública: #/novedades (lista con temas) y #/novedades/<id>.
   En el Estudio: lista, editor y «Armar imagen para Instagram».
   ===================================================================== */
const catNov = id => CATS_NOVEDADES.find(c => c[0] === id) || [id, id, id, 'azul'];
const nombreCat = id => { const c = catNov(id); return IDIOMA === 'pt' ? c[2] : c[1]; };
function novedadesVisibles(){
  const ahora = new Date();
  return (Datos.get().novedades || []).filter(n => n.estado === 'publicada' && (EN_EDITOR || new Date(n.fecha) <= ahora)).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
}
const fechaNov = iso => { const f = new Date(iso); return isNaN(f) ? '' : f.toLocaleDateString(IDIOMA === 'pt' ? 'pt-BR' : 'es-UY', { day: 'numeric', month: 'long', year: 'numeric' }); };

function tarjetaNovedad(n){
  return `<a class="nv-card foco" href="#/novedades/${n.id}" data-aparece>
    <div class="nv-img">${n.portada ? `<img src="${esc(n.portada)}" alt="" loading="lazy">` : `<span class="nv-sin">${iconoDP({ cls: 'nv-dp' })}</span>`}<span class="chip ${catNov(n.cat)[3]}">${esc(nombreCat(n.cat))}</span>${n.video ? `<span class="nv-play">${icono('play')}</span>` : ''}</div>
    <div class="nv-txt"><small>${esc(fechaNov(n.fecha))}</small><h3>${T(n.titulo)}</h3><p>${T(n.bajada)}</p><span class="enlace">${t('nv_leer')} ${icono('flecha')}</span></div></a>`;
}

PAGINAS.novedades = {
  titulo: id => { const n = id && (Datos.get().novedades || []).find(x => x.id === id); return n ? tx(n.titulo) : t('p_novedades'); },
  html(id, q){
    const n = id && novedadesVisibles().find(x => x.id === id);
    if (n) return novedadHTML(n);
    const cat = q && q.get('tema') || '', l = novedadesVisibles(), f = l.filter(x => !cat || x.cat === cat), dest = !cat && (l.find(x => x.destacada) || l[0]);
    const temas = CATS_NOVEDADES.filter(c => l.some(x => x.cat === c[0]));
    return `<section class="cabeza-pag nv-cabeza"><div class="cabeza-topo">${fondoTopo()}</div><div class="contenedor cabeza-in"><div><span class="etiqueta"><i></i>Drones del Pampa</span>
        <h1 class="titulo" data-dividir>${t('p_novedades')}</h1><p class="sub">${IDIOMA === 'pt' ? 'Lançamentos, dicas da oficina, cursos e o que acontece na loja.' : 'Lanzamientos, consejos del taller, cursos y lo que pasa en el local.'}</p></div></div></section>
      <section class="bloque pegado"><div class="contenedor">
        <div class="nv-temas"><a class="${!cat ? 'act' : ''}" href="#/novedades">${t('nv_todas')}</a>${temas.map(c => `<a class="${cat === c[0] ? 'act' : ''}" href="#/novedades?tema=${c[0]}">${esc(nombreCat(c[0]))}</a>`).join('')}</div>
        ${dest ? `<a class="nv-dest foco" href="#/novedades/${dest.id}" data-aparece><div class="nv-dest-img">${dest.portada ? `<img src="${esc(dest.portada)}" alt="">` : ''}</div>
          <div class="nv-dest-txt"><span class="chip ${catNov(dest.cat)[3]}">${esc(nombreCat(dest.cat))}</span><small>${esc(fechaNov(dest.fecha))}</small><h2>${T(dest.titulo)}</h2><p>${T(dest.bajada)}</p><span class="btn btn-azul btn-chico">${t('nv_leer')} ${icono('flecha')}</span></div></a>` : ''}
        <div class="nv-grilla">${f.filter(x => x !== dest).map(tarjetaNovedad).join('') || (dest ? '' : `<p class="b-vacia">${t('nv_vacio')}</p>`)}</div></div></section>`;
  },
  alMostrar(v, id){ if (id) $$('.nv-galeria button', v).forEach(b => b.onclick = () => verFoto(b.dataset.src)); }
};

function novedadHTML(n){
  const otras = novedadesVisibles().filter(x => x.id !== n.id).slice(0, 3), link = location.href.split('#')[0] + '#/novedades/' + n.id;
  const wa = 'https://wa.me/?text=' + encodeURIComponent(tx(n.titulo) + ' · ' + link);
  return `<article class="nv-art"><header class="nv-art-cab">${n.portada ? `<img class="nv-art-fondo" src="${esc(n.portada)}" alt="">` : ''}<div class="nv-art-velo"></div>
      <div class="contenedor b-angosto"><a class="fd-volver" href="#/novedades">${icono('flecha')} ${t('p_novedades')}</a><span class="chip ${catNov(n.cat)[3]}">${esc(nombreCat(n.cat))}</span>
        <h1 class="titulo" data-dividir>${T(n.titulo)}</h1><p class="sub">${T(n.bajada)}</p><small class="nv-art-fecha">${esc(fechaNov(n.fecha))}</small></div></header>
    <section class="bloque"><div class="contenedor b-angosto nv-art-cuerpo">
      <div class="b-md nv-md">${md(n.cuerpo)}</div>
      ${n.video ? `<div class="nv-art-video">${videoHTML(n.video, { vertical: /instagram|ig-/.test(n.video) })}</div>` : ''}
      ${(n.fotos || []).length ? `<div class="nv-galeria">${n.fotos.map(s => `<button data-src="${esc(s)}"><img src="${esc(s)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
      ${(n.enlaces || []).filter(e => tx(e.texto)).length ? `<div class="nv-enlaces">${n.enlaces.filter(e => tx(e.texto)).map(e => { const h = urlDe(e.url); return `<a class="btn btn-borde" href="${esc(h)}"${externo(h) ? ' target="_blank" rel="noopener"' : ''}>${T(e.texto)} ${icono(externo(h) ? 'externo' : 'flecha')}</a>`; }).join('')}</div>` : ''}
      <div class="nv-compartir"><b>${t('nv_compartir')}</b><a class="btn btn-wa btn-chico" href="${esc(wa)}" target="_blank" rel="noopener">${icono('wa')} WhatsApp</a>
        <button class="btn btn-borde btn-chico" onclick="navigator.clipboard&&navigator.clipboard.writeText('${esc(link)}').then(()=>aviso(t('nv_copiado')))">${icono('copiar')} ${t('nv_copiar')}</button></div>
    </div></section>
    ${otras.length ? `<section class="bloque niebla"><div class="contenedor"><div class="cabecera"><h2 class="titulo chico">${t('nv_mas')}</h2></div><div class="nv-grilla">${otras.map(tarjetaNovedad).join('')}</div></div></section>` : ''}</article>`;
}

/* ---------- En el Estudio ---------- */
const CAMPOS_NOVEDAD = [['titulo', 'Título', 'i18n'], ['bajada', 'Bajada (una frase que resume)', 'i18n'], ['portada', 'Foto de portada', 'img'],
  ['cuerpo', 'Texto completo', 'md'], ['fotos', 'Más fotos (galería)', 'imgs'], ['video', 'Video (YouTube, Instagram o del Drive)', 'video'],
  ['enlaces', 'Botones con enlaces', 'items', [['texto', 'Texto del botón', 'i18n'], ['url', 'Link', 'url']]],
  ['cat', 'Tema', 'select', CATS_NOVEDADES.map(c => [c[0], c[1]])], ['destacada', 'Destacada (sale grande arriba)', 'check']];
// La hora de acá (Uruguay), como la escribe el campo de fecha y hora: 2026-11-24T15:30
const ahoraLocal = () => { const f = new Date(); f.setMinutes(f.getMinutes() - f.getTimezoneOffset()); return f.toISOString().slice(0, 16); };
const estadoNov = n => n.estado !== 'publicada' ? ['Borrador', 'gris'] : new Date(n.fecha) > new Date() ? ['Programada · ' + fechaHoraCorta(n.fecha), 'ambar'] : ['Publicada', ''];

seccionEstudio({ id: 'novedades', nombre: 'Novedades', icono: 'diario', grupo: 'Diseño',
  badge: () => (Datos.get().novedades || []).filter(n => n.estado !== 'publicada').length,
  render(){ const l = (Datos.get().novedades || []).slice().sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
    return `<div class="ad-cab"><div><h2>Novedades</h2><p>Publicaciones con fotos, video y enlaces. Podés dejarlas en borrador o programarlas para que salgan solas.</p></div>
        <div class="es-cab-acc"><a class="btn btn-borde btn-chico" href="./?borrador=1#/novedades" target="_blank" rel="noopener">${icono('ojo')} Ver la página</a><button class="btn btn-verde btn-chico" onclick="nuevaNovedad()">${icono('mas')} Nueva novedad</button></div></div>
      <div class="es-novs">${l.map(n => { const [e, c] = estadoNov(n); return `<div class="es-nov"><button class="es-nov-main" onclick="editarNovedad('${n.id}')">
          <span class="es-nov-img">${n.portada ? `<img src="${esc(n.portada)}" alt="">` : icono('diario')}</span>
          <span class="es-nov-txt"><b>${T(n.titulo) || '(sin título)'}</b><small>${esc(nombreCat(n.cat))} · ${esc(fechaHoraCorta(n.fecha))}</small></span></button>
        <span class="chip ${c}">${esc(e)}</span>${n.destacada ? '<span class="chip azul">Destacada</span>' : ''}
        <div class="ad-fila-acc"><button title="Imagen para Instagram" onclick="imagenParaRedes('${n.id}')">${icono('instagram')}</button><button title="Duplicar" onclick="duplicarNovedad('${n.id}')">${icono('duplicar')}</button>
          <button title="Borrar" class="rojo" onclick="borrarNovedad('${n.id}')">${icono('basura')}</button></div></div>`; }).join('') || '<p class="ad-vacio">Todavía no hay novedades. Tocá «Nueva novedad».</p>'}</div>`; } });

function nuevaNovedad(){
  const n = { id: Datos.nuevoId('nov'), titulo: { es: '', pt: '' }, bajada: {}, cuerpo: {}, portada: '', fotos: [], video: '', enlaces: [], cat: 'lanzamiento', fecha: ahoraLocal(), estado: 'borrador', destacada: false };
  Datos.get().novedades = Datos.get().novedades || []; Datos.get().novedades.unshift(n); Datos.guardar(); editarNovedad(n.id, true);
}
function duplicarNovedad(id){ const a = Datos.get().novedades, i = a.findIndex(x => x.id === id); const c = JSON.parse(JSON.stringify(a[i])); c.id = Datos.nuevoId('nov'); c.estado = 'borrador'; c.titulo.es = (c.titulo.es || '') + ' (copia)'; a.splice(i, 0, c); Datos.guardar(); adminIr('novedades'); }
function borrarNovedad(id){ if (!confirm('¿Borrar esta novedad? (Podés deshacerlo.)')) return; Datos.get().novedades = Datos.get().novedades.filter(x => x.id !== id); Datos.guardar(); adminCerrarEditor(); adminIr('novedades'); }

function editarNovedad(id, nueva){
  const n = Datos.get().novedades.find(x => x.id === id); if (!n) return;
  const p = $('#ad-editor');
  const pintar = () => {
    const [e] = estadoNov(n);
    p.innerHTML = `<div class="ae-cab"><h3>${nueva ? 'Nueva novedad' : 'Editar novedad'} <span class="chip gris">${esc(e)}</span></h3><button class="ae-x" onclick="adminCerrarEditor();adminIr('novedades')">${icono('cerrar')}</button></div>
      <div class="ae-form">${camposEs(CAMPOS_NOVEDAD, n)}
        <div class="ae-campo ce es-publicacion"><label>Publicación</label><div class="opciones">${[['borrador', 'Borrador (no se ve)'], ['publicada', 'Publicada']].map(([v, t2]) => `<label class="opcion"><input type="radio" name="nv-est" value="${v}" ${n.estado === v ? 'checked' : ''}><span>${t2}</span></label>`).join('')}</div>
          ${campoEs('fecha', 'Fecha y hora (si es futura, sale sola ese día)', 'fechahora', null, (n.fecha || '').slice(0, 16))}</div></div>
      <div class="ae-pie"><button class="btn btn-borde btn-chico" onclick="imagenParaRedes('${n.id}')">${icono('instagram')} Imagen para Instagram</button>
        <a class="btn btn-borde btn-chico" href="./?borrador=1#/novedades/${n.id}" target="_blank" rel="noopener">${icono('ojo')} Vista previa</a>
        <button class="btn btn-verde btn-chico" onclick="adminCerrarEditor();adminIr('novedades');aviso('Guardada en el borrador. Tocá Publicar para que la vea la gente.')">${icono('check')} Listo</button></div>`;
    p.classList.add('abierto');
    activarCamposEs(p, n, (estr) => { clearTimeout(window._nvG); window._nvG = setTimeout(() => Datos.guardar(), estr ? 0 : 300); }, pintar);
    $$('[name=nv-est]', p).forEach(r => r.onchange = () => { n.estado = r.value; Datos.guardar(); pintar(); });
  };
  pintar();
}

/* ---------- Imagen para Instagram y WhatsApp (cuadrada o historia) ---------- */
async function imagenParaRedes(id){
  const n = Datos.get().novedades.find(x => x.id === id); if (!n) return;
  let formato = 'cuadrada';
  const m = abrirModal(`<div class="es-modal"><h3>${icono('instagram')} Imagen para Instagram y WhatsApp</h3><p>Se arma sola con la portada, el título y el logo. Descargala y subila a Instagram; abajo tenés el texto listo para copiar.</p>
    <div class="opciones"><label class="opcion"><input type="radio" name="rf" value="cuadrada" checked><span>Publicación (1080 × 1080)</span></label><label class="opcion"><input type="radio" name="rf" value="historia"><span>Historia (1080 × 1920)</span></label></div>
    <div class="es-redes-prev"><canvas id="rd-canvas"></canvas></div>
    <div class="campo"><label>Texto para la publicación</label><textarea id="rd-texto" rows="5">${esc(tx(n.titulo) + '\n\n' + tx(n.bajada) + '\n\n📍 Drones del Pampa · Rivera\n💬 Escribinos por WhatsApp\n\n#DronesDelPampa #DJIAgras #Dragur #Rivera #AgriculturaDePrecision')}</textarea></div>
    <div class="es-modal-pie"><button class="btn btn-borde btn-chico" id="rd-copiar">${icono('copiar')} Copiar el texto</button><button class="btn btn-verde btn-chico" id="rd-bajar">${icono('descargar')} Descargar la imagen</button></div></div>`, { cls: 'chico' });
  const dibujar = async () => {
    const cv = $('#rd-canvas', m), W = 1080, H = formato === 'historia' ? 1920 : 1080, g = cv.getContext('2d'); cv.width = W; cv.height = H;
    const cargar = src => new Promise(ok => { if (!src) return ok(null); const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src.startsWith('drive:') ? Drive.url(src) : src; });
    const foto = await cargar(n.portada), logo = await cargar('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(logoDP({ blanco: true })));
    g.fillStyle = '#05153a'; g.fillRect(0, 0, W, H);
    if (foto) { const k = Math.max(W / foto.width, H / foto.height); g.drawImage(foto, (W - foto.width * k) / 2, (H - foto.height * k) / 2, foto.width * k, foto.height * k); }
    const gr = g.createLinearGradient(0, H * .3, 0, H); gr.addColorStop(0, 'rgba(5,21,58,0)'); gr.addColorStop(.55, 'rgba(5,21,58,.82)'); gr.addColorStop(1, 'rgba(5,21,58,.97)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#6db72e'; const chip = nombreCat(n.cat).toUpperCase(); g.font = '700 30px Inter, sans-serif'; const cw = g.measureText(chip).width + 48;
    const y0 = H - (formato === 'historia' ? 640 : 470); g.beginPath(); g.roundRect(70, y0, cw, 56, 28); g.fill(); g.fillStyle = '#fff'; g.fillText(chip, 94, y0 + 39);
    g.font = '800 72px Poppins, sans-serif'; const pal = tx(n.titulo).split(/\s+/); let lin = '', y = y0 + 140; const lineas = [];
    for (const w of pal) { const p2 = lin ? lin + ' ' + w : w; if (g.measureText(p2).width > W - 140) { lineas.push(lin); lin = w; } else lin = p2; } lineas.push(lin);
    lineas.slice(0, 4).forEach((l, i) => g.fillText(l, 70, y + i * 84));
    if (logo) { const lw = 300, lh = lw * logo.height / logo.width; g.drawImage(logo, 70, 64, lw, lh); }
    g.font = '500 30px Inter, sans-serif'; g.fillStyle = 'rgba(255,255,255,.85)'; g.fillText('Rivera · Sucursal oficial Dragur', 70, H - 70);
  };
  $$('[name=rf]', m).forEach(r => r.onchange = () => { formato = r.value; dibujar(); });
  $('#rd-bajar', m).onclick = () => { const a = document.createElement('a'); a.download = 'novedad-' + (slugDe ? slugDe(tx(n.titulo)) : n.id) + '-' + formato + '.png'; a.href = $('#rd-canvas', m).toDataURL('image/png'); a.click(); };
  $('#rd-copiar', m).onclick = () => { navigator.clipboard && navigator.clipboard.writeText($('#rd-texto', m).value).then(() => aviso('Texto copiado.')); };
  await document.fonts.ready; dibujar();
}

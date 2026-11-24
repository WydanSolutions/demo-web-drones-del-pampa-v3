/* =====================================================================
   ESTUDIO · PÁGINAS (versión 3): la lista de páginas (con el lugar en el
   menú) y el EDITOR de una página: bloques a la izquierda, la página en
   vivo al medio (compu o celular) y el bloque elegido a la derecha.
   En el celular el editor tiene tres pestañas: Bloques · Ver · Editar.
   ===================================================================== */
const _pg = { id: (() => { try { return sessionStorage.getItem('dp_es_pag'); } catch (e) { return null; } })(), sel: null, disp: 'compu', tab: 'bloques', aGuardar: null };
const recordarPagina = id => { try { id ? sessionStorage.setItem('dp_es_pag', id) : sessionStorage.removeItem('dp_es_pag'); } catch (e) {} };
const RESERVADAS = ['p', 'admin', 'estudio', 'media', 'css', 'js'];
const LUGAR_MENU = [['arriba', 'En el menú principal'], ['mas', 'En «Más»'], ['no', 'Fuera del menú (solo con el link)']];
const slugDe = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

seccionEstudio({ id: 'paginas', nombre: 'Páginas y bloques', icono: 'capas', grupo: 'Diseño',
  render(){ return _pg.id && paginaDe(_pg.id) ? editorPaginaHTML() : listaPaginasHTML(); },
  alMostrar(c){ if (_pg.id && paginaDe(_pg.id)) iniciarEditorPagina(c); },
  refrescar(){ if (_pg.id && paginaDe(_pg.id)) { peListaBloques(); peInspector(); pePrevia(); } else adminIr('paginas'); } });

/* ---------- Lista de páginas ---------- */
function listaPaginasHTML(){
  const ps = Datos.get().paginas || [];
  return `<div class="ad-cab"><div><h2>Páginas</h2><p>Cada página se arma con <b>bloques</b>. Las del sistema traen sus partes fijas (que también podés mover u ocultar) y les podés sumar bloques. Las propias las armás de cero o desde una plantilla.</p></div>
      <button class="btn btn-verde btn-chico" onclick="nuevaPagina()">${icono('mas')} Nueva página</button></div>
    <div class="es-paginas">${ps.map((p, i) => { const sist = p.sistema, nb = (p.bloques || []).filter(b => b.tipo !== 'sis').length;
      return `<div class="es-pag ${p.menu === 'no' ? 'fuera' : ''}">
        <button class="es-pag-main" onclick="editarPagina('${p.id}')"><span class="es-pag-ico">${icono(p.icono || 'capas')}</span>
          <span class="es-pag-txt"><b>${esc(tituloPagina(p))}</b><small>#/${p.id === 'inicio' ? '' : esc(p.id)}</small></span></button>
        <div class="es-pag-chips"><span class="chip ${sist ? 'gris' : 'azul'}">${sist ? 'Del sistema' : 'Propia'}</span>
          <span class="chip ${p.menu === 'arriba' ? '' : 'gris'}">${{ arriba: 'Menú principal', mas: 'En «Más»', no: 'Fuera del menú' }[p.menu] || 'Fuera del menú'}</span>
          ${nb ? `<span class="chip gris">${nb} ${nb === 1 ? 'bloque' : 'bloques'}</span>` : ''}</div>
        <div class="ad-fila-acc">
          <button title="Subir en el menú" onclick="moverPagina(${i},-1)">↑</button><button title="Bajar en el menú" onclick="moverPagina(${i},1)">↓</button>
          <button title="Ajustes de la página" onclick="ajustesPagina('${p.id}')">${icono('ajustes')}</button>
          ${sist ? '' : `<button title="Duplicar" onclick="duplicarPagina('${p.id}')">${icono('duplicar')}</button><button title="Borrar" class="rojo" onclick="borrarPagina('${p.id}')">${icono('basura')}</button>`}
          <button class="btn btn-azul btn-chico" onclick="editarPagina('${p.id}')">${icono('editar')} Editar</button></div></div>`; }).join('')}</div>
    <div class="ad-nota"><b>El menú</b><p>El orden de esta lista es el orden del menú. «Menú principal» se ve arriba (y en la barra de abajo del celular, las primeras cuatro); «En “Más”» queda en el botón Más; «Fuera del menú» solo se abre con su link (ideal para promos o campañas).</p></div>`;
}
function moverPagina(i, d){ const a = Datos.get().paginas, j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; Datos.guardar(); esTrasCambio(true); }
function editarPagina(id){ _pg.id = id; recordarPagina(id); _pg.sel = null; _pg.tab = 'bloques'; adminIr('paginas'); }
function borrarPagina(id){
  const p = paginaDe(id); if (!p || p.sistema) return;
  if (!confirm(`¿Borrar la página «${tituloPagina(p)}»? Si te arrepentís, usá Deshacer o volvé a una versión anterior.`)) return;
  Datos.get().paginas = Datos.get().paginas.filter(x => x.id !== id); if (_pg.id === id) _pg.id = null;
  Datos.guardar(); esTrasCambio(true); aviso('Página borrada (del borrador).');
}
function duplicarPagina(id){
  const p = paginaDe(id); if (!p) return;
  const c = JSON.parse(JSON.stringify(p)); c.id = slugUnico(p.id + '-copia'); c.titulo = { es: tituloPagina(p) + ' (copia)', pt: '' }; c.menu = 'no';
  c.bloques.forEach(b => b.id = Datos.nuevoId('bq'));
  const a = Datos.get().paginas; a.splice(a.indexOf(p) + 1, 0, c); Datos.guardar(); esTrasCambio(true); aviso('Página duplicada. Queda fuera del menú hasta que la ubiques.');
}
function slugUnico(base){
  let s = slugDe(base) || 'pagina', n = 1, prueba = s;
  const usado = x => RESERVADAS.includes(x) || PAGINAS_SISTEMA.some(p => p[0] === x) || (Datos.get().paginas || []).some(p => p.id === x) || (PAGINAS[x] && !PAGINAS[x].propia);
  while (usado(prueba)) prueba = s + '-' + (++n);
  return prueba;
}

/* ---------- Nueva página desde una plantilla ---------- */
function nuevaPagina(){
  abrirModal(`<div class="es-modal ancho"><h3>${icono('plantilla')} Nueva página</h3><p>Elegí una plantilla para arrancar. Después cambiás todo: textos, fotos, colores y bloques.</p>
    <div class="es-plantillas">${PLANTILLAS.map(([id, n, d, ic, ps]) => `<button class="es-plantilla" data-pl="${id}"><span class="es-pl-ico">${icono(ic)}</span><b>${esc(n)}</b><span>${esc(d)}</span>
      <small>${ps.length ? ps.length + ' bloques' : 'Vacía'}</small></button>`).join('')}</div>
    <div class="es-nueva-datos" hidden><div class="grilla-form"><div class="campo"><label>Nombre de la página</label><input id="np-nombre" placeholder="Ej.: Promo de diciembre"></div>
      <div class="campo"><label>Dónde va en el menú</label><select id="np-menu">${LUGAR_MENU.map(([v, n]) => `<option value="${v}" ${v === 'mas' ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>
      <div class="campo es-np-ig" hidden><label>Link del post o reel de Instagram (en Instagram: ⋯ → Copiar enlace)</label><input id="np-ig" placeholder="https://www.instagram.com/reel/…"><span class="error">Pegá un link de Instagram</span></div>
      <p class="es-np-link">La dirección va a ser: <b id="np-link">#/…</b></p>
      <div class="es-modal-pie"><button class="btn btn-borde btn-chico" onclick="nuevaPagina()">← Otra plantilla</button><button class="btn btn-verde btn-chico" id="np-crear">${icono('check')} Crear la página</button></div></div></div>`, { cls: 'grande' });
  $$('[data-pl]').forEach(b => b.onclick = () => {
    const pl = PLANTILLAS.find(x => x[0] === b.dataset.pl);
    $$('.es-plantilla').forEach(x => x.classList.toggle('act', x === b)); $('.es-plantillas').classList.add('elegida'); $('.es-nueva-datos').hidden = false;
    const nom = $('#np-nombre'); if (!nom.value) nom.value = pl[0] === 'pl-blanco' ? '' : pl[1]; nom.focus();
    const upd = () => $('#np-link').textContent = '#/' + slugUnico(nom.value || 'pagina'); nom.oninput = upd; upd();
    const conIG = pl[0] === 'pl-instagram'; $('.es-np-ig').hidden = !conIG;
    $('#np-crear').onclick = () => {
      const n = nom.value.trim(); if (!n) { nom.closest('.campo').classList.add('mal'); return; }
      const ig = conIG ? $('#np-ig').value.trim().split('?')[0] : '';
      if (conIG && ig && !/instagram\.com\//.test(ig)) { $('#np-ig').closest('.campo').classList.add('mal'); return; }
      const p = { id: slugUnico(n), sistema: false, titulo: { es: n, pt: '' }, icono: pl[3], menu: $('#np-menu').value, seo: {}, bloques: pl[4].map(bloqueDesdeProto).filter(Boolean) };
      if (ig) { const b = p.bloques.find(x => x.tipo === 'igpost'); if (b) b.d.url = ig; if (!Datos.get().instagram.some(x => x.url === ig)) Datos.get().instagram.unshift({ img: '', url: ig, video: '' }); }
      Datos.get().paginas.push(p); Datos.guardar(); cerrarModal(); editarPagina(p.id); aviso('Página creada. Tocá un bloque para editarlo.');
    };
  });
}

/* ---------- Ajustes de una página (nombre, link, menú, ícono, al compartir) ---------- */
function ajustesPagina(id){
  const p = paginaDe(id); if (!p) return; p.seo = p.seo || {};
  const b = { titulo: p.titulo || { es: tituloPagina(p) }, id: p.id, menu: p.menu || 'no', icono: p.icono, seo: JSON.parse(JSON.stringify(p.seo)) };
  const pintar = () => {
    const m = abrirModal(`<div class="es-modal ancho"><h3>${icono('ajustes')} Ajustes de «${esc(tituloPagina(p))}»</h3>
      <div class="es-ajustes">${p.sistema ? '' : campoEs('titulo', 'Nombre (aparece en el menú)', 'i18n', null, b.titulo)}
        ${p.sistema ? '' : `<div class="ae-campo ce"><label>Dirección</label><div class="ce-url"><span class="ce-pre">#/</span><input id="aj-slug" value="${esc(b.id)}"></div><small class="ce-ayuda">Solo letras, números y guiones. Si la cambiás, los links viejos dejan de andar.</small></div>`}
        ${campoEs('menu', 'Dónde va en el menú', 'select', LUGAR_MENU, b.menu)}${campoEs('icono', 'Ícono (barra del celular y menú «Más»)', 'icono', null, b.icono)}
        <h4>Cuando comparten el link (WhatsApp, Facebook)</h4>
        ${campoEs('seo.titulo', 'Título', 'i18n', null, b.seo.titulo)}${campoEs('seo.desc', 'Descripción', 'i18n', null, b.seo.desc)}${campoEs('seo.img', 'Imagen', 'img', null, b.seo.img)}
        <div class="es-wa-prev"><small>Así se ve en WhatsApp</small><div class="es-wa-card">${b.seo.img ? `<img src="${esc(b.seo.img)}" alt="">` : `<div class="es-wa-sin">${iconoDP({ cls: 'es-wa-dp' })}</div>`}
          <div><b>${esc(tx(b.seo.titulo) || tituloPagina(p) + ' · Drones del Pampa')}</b><span>${esc(tx(b.seo.desc) || tx(Datos.get().config.compartir))}</span><small>wydansolutions.github.io</small></div></div></div></div>
      <div class="es-modal-pie">${p.sistema ? '' : `<button class="btn btn-borde btn-chico rojo-txt" onclick="cerrarModal();borrarPagina('${p.id}')">${icono('basura')} Borrar la página</button>`}
        <button class="btn btn-verde btn-chico" id="aj-ok">${icono('check')} Guardar</button></div></div>`, { cls: 'grande' });
    activarCamposEs(m, b, () => {}, pintar);
    $('#aj-ok').onclick = () => {
      if (!p.sistema) { const s = slugDe($('#aj-slug').value); if (s !== p.id) { if (!s || s !== slugUnico(s)) { aviso('Esa dirección ya se usa o no es válida.', 'error'); return; } if (_pg.id === p.id) _pg.id = s; p.id = s; } p.titulo = b.titulo; }
      p.menu = b.menu; p.icono = b.icono; p.seo = b.seo; Datos.guardar(); cerrarModal(); esTrasCambio(true); aviso('Ajustes guardados en el borrador.');
    };
  };
  pintar();
}

/* ---------- Editor de una página ---------- */
function editorPaginaHTML(){
  const p = paginaDe(_pg.id);
  return `<div class="pe pe-tab-${_pg.tab} ${_pg.lista ? '' : 'sin-lista'}">
    <div class="pe-barra">
      <button class="btn btn-borde btn-chico" onclick="_pg.id=null;recordarPagina(null);adminIr('paginas')">${icono('flecha')}<span>Páginas</span></button>
      <button class="pe-lista-btn ${_pg.lista ? 'act' : ''}" id="pe-btn-lista" onclick="peAlternarLista()" title="Mostrar u ocultar la lista de bloques">${icono('capas')}</button>
      <select class="pe-pagina" onchange="editarPagina(this.value)" aria-label="Página">${Datos.get().paginas.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${esc(tituloPagina(x))}</option>`).join('')}</select>
      <div class="pe-tabs">${[['bloques', 'capas', 'Bloques'], ['vista', 'ojo', 'Ver'], ['editar', 'editar', 'Editar']].map(([k, ic, n]) => `<button data-petab="${k}" class="${_pg.tab === k ? 'act' : ''}">${icono(ic)}${n}</button>`).join('')}</div>
      <div class="pe-disp"><button data-disp="compu" class="${_pg.disp === 'compu' ? 'act' : ''}" title="Ver como en la compu">${icono('compu')}</button><button data-disp="celular" class="${_pg.disp === 'celular' ? 'act' : ''}" title="Ver como en el celular">${icono('celular')}</button></div>
      <button class="btn btn-borde btn-chico" onclick="ajustesPagina('${p.id}')">${icono('ajustes')}<span>Ajustes</span></button>
    </div>
    <div class="pe-cols">
      <aside class="pe-bloques"><div class="pe-bloques-lista" id="pe-lista"></div>
        <button class="btn btn-verde pe-agregar" onclick="bibliotecaBloques()">${icono('mas')} Agregar bloque</button></aside>
      <div class="pe-vista" id="pe-vista"><div class="pe-marco ${_pg.disp}" id="pe-marco"><iframe id="pe-iframe" title="Vista previa" src="./?borrador=1&vista=1#/${p.id === 'inicio' ? '' : p.id}"></iframe></div>
        <span class="pe-cargando" id="pe-cargando">Cargando la vista previa…</span></div>
      <aside class="pe-insp" id="pe-insp"></aside>
    </div></div>`;
}
function iniciarEditorPagina(c){
  c.classList.add('editando'); $('#admin').classList.add('enfoque');
  peListaBloques(); peInspector(); requestAnimationFrame(peEscalar);
  $$('[data-petab]', c).forEach(b => b.onclick = () => { _pg.tab = b.dataset.petab; $('.pe').className = 'pe pe-tab-' + _pg.tab + (_pg.lista ? '' : ' sin-lista'); $$('[data-petab]').forEach(x => x.classList.toggle('act', x === b)); peEscalar(); });
  $$('[data-disp]', c).forEach(b => b.onclick = () => { _pg.disp = b.dataset.disp; $('#pe-marco').className = 'pe-marco ' + _pg.disp; $$('[data-disp]').forEach(x => x.classList.toggle('act', x === b)); peEscalar(); });
  const fr = $('#pe-iframe'); fr.onload = () => { $('#pe-cargando').hidden = true; peEscalar(); if (_pg.sel) peMarcar(_pg.sel); };
  if (!window._peRO) { window._peRO = new ResizeObserver(() => peEscalar()); }
  window._peRO.disconnect(); window._peRO.observe($('#pe-vista'));
}
// La vista previa: en la compu se dibuja a 1280 px y se achica para que entre; en el celular, a 390 px
function peEscalar(){
  const v = $('#pe-vista'), m = $('#pe-marco'), fr = $('#pe-iframe'); if (!v || !fr) return;
  const W = _pg.disp === 'compu' ? 1280 : 390, H = _pg.disp === 'compu' ? 800 : 844;
  const k = Math.min(1, (v.clientWidth - 24) / W, _pg.disp === 'celular' ? (v.clientHeight - 24) / H : 9);
  fr.style.width = W + 'px'; fr.style.height = (_pg.disp === 'compu' ? Math.max(H, (v.clientHeight - 24) / k) : H) + 'px';
  fr.style.transform = `scale(${k})`; m.style.width = W * k + 'px'; m.style.height = parseFloat(fr.style.height) * k + 'px';
}
function pePrevia(){ const fr = $('#pe-iframe'); if (fr && fr.contentWindow) fr.contentWindow.postMessage({ dp: 'recargar' }, '*'); }
function peMarcar(id){ const fr = $('#pe-iframe'); if (fr && fr.contentWindow) fr.contentWindow.postMessage({ dp: 'marcar', id }, '*'); }
Datos.alCambiar(() => { if (_esAbierto && _esSec === 'paginas' && _pg.id) { clearTimeout(window._pePrev); window._pePrev = setTimeout(() => { prepararPaginas(); pePrevia(); }, 140); } });
// Lo que llega de la vista previa: elegir, escribir directo, cambiar foto, barra del bloque, agregar acá
window.addEventListener('message', async e => {
  const m = e.data || {}; if (!_esAbierto || !m.dp || !_pg.id) return;
  if (m.dp === 'elegir') { if (_pg.sel !== m.id) peElegir(m.id, true); }
  else if (m.dp === 'campo') { if (_pg.sel !== m.id) peElegir(m.id, true); peResaltarCampo(m.ed); }
  else if (m.dp === 'texto') peTextoDesdeVista(m);
  else if (m.dp === 'fin') { clearTimeout(_pg.aGuardar); Datos.guardar(); pePrevia(); peListaBloques(); }
  else if (m.dp === 'imagen') await peFotoDesdeVista(m.id, m.ed);
  else if (m.dp === 'accion') {
    if (m.acc === 'foto') { const b = buscarBloque(m.id), f = b && BLOQUES[b.tipo] && BLOQUES[b.tipo].campos.find(c => c[2] === 'img'); if (f) await peFotoDesdeVista(m.id, 'd:' + f[0]); }
    else peAccion(m.id, m.acc);
  }
  else if (m.dp === 'agregar') { _pg.sel = m.despues; peListaBloques(); bibliotecaBloques(); }
});
// «g:textos.heroTitulo» = desde la raíz de los datos · «d:titulo» = dentro del bloque
function peRaiz(id, ed){ return ed.startsWith('g:') ? [Datos.get(), ed.slice(2)] : [(buscarBloque(id) || {}).d || {}, ed.slice(2)]; }
function peTextoDesdeVista(m){
  const [raiz, ruta] = peRaiz(m.id, m.ed), actual = leerEn(raiz, ruta);
  const r2 = typeof actual === 'string' && actual !== '' ? ruta : ruta + '.' + IDIOMA;
  ponerEn(raiz, r2, m.valor);
  const inp = $(`#pe-insp [data-r="${CSS.escape(r2)}"]`); if (inp && document.activeElement !== inp) inp.value = m.valor;
  clearTimeout(_pg.aGuardar); _pg.aGuardar = setTimeout(() => Datos.guardar(), 300);
}
async function peFotoDesdeVista(id, ed){
  const [raiz, ruta] = peRaiz(id, ed); const r = await elegirArchivo({ tipo: 'imagen' }); if (!r) return;
  ponerEn(raiz, ruta, r); Datos.guardar(); peInspector(); aviso('Foto cambiada.');
}
// Marca en el panel el campo del texto que se tocó en la página
function peResaltarCampo(ed){
  const ruta = ed.slice(2), c = $(`#pe-insp [data-campo="${CSS.escape(ruta)}"]`); if (!c) return;
  const det = c.closest('details'); if (det) det.open = true;
  c.scrollIntoView({ block: 'center', behavior: 'smooth' }); c.classList.remove('ce-flash'); void c.offsetWidth; c.classList.add('ce-flash');
}
function peAlternarLista(){ _pg.lista = !_pg.lista; try { localStorage.setItem('dp_es_lista', _pg.lista ? '1' : '0'); } catch (er) {} const pe = $('.pe'); if (pe) pe.classList.toggle('sin-lista', !_pg.lista); $('#pe-btn-lista').classList.toggle('act', _pg.lista); setTimeout(peEscalar, 50); }
_pg.lista = (() => { try { return localStorage.getItem('dp_es_lista') !== '0'; } catch (e) { return true; } })();

function peListaBloques(){
  const l = $('#pe-lista'); if (!l) return; const p = paginaDe(_pg.id);
  l.innerHTML = `<small class="pe-ayuda">Tocá un bloque para editarlo. Arrastralo (o usá las flechas) para cambiar el orden.</small>` + ((p.bloques || []).map((b, i) => {
    const def = BLOQUES[b.tipo] || {}, nombre = b.tipo === 'sis' ? nombreParte(p, b) : def.nombre, sub = b.tipo === 'sis' ? 'Parte fija' : tx((b.d || {}).titulo) || tx((b.d || {}).texto).slice(0, 40);
    return `<div class="pe-bq ${b.id === _pg.sel ? 'act' : ''} ${b.oculto ? 'oculto' : ''} ${b.tipo === 'sis' ? 'sis' : ''}" draggable="true" data-i="${i}" data-id="${b.id}">
      <span class="pe-arr">${icono('arrastrar')}</span><span class="pe-bq-ico">${icono(b.tipo === 'sis' ? 'candado' : def.icono || 'kit')}</span>
      <button class="pe-bq-txt" data-sel="${b.id}"><b>${esc(nombre)}</b><small>${esc(sub || '')}</small></button>
      <div class="pe-bq-acc"><button data-acc="sub" title="Subir">↑</button><button data-acc="baj" title="Bajar">↓</button>
        <button data-acc="ver" title="${b.oculto ? 'Mostrar' : 'Ocultar'}">${icono(b.oculto ? 'ojono' : 'ojo')}</button>
        ${b.tipo === 'sis' ? '' : `<button data-acc="dup" title="Duplicar">${icono('duplicar')}</button><button data-acc="borrar" class="rojo" title="Borrar">${icono('basura')}</button>`}</div></div>`;
  }).join('') || '<p class="ad-vacio">Esta página está vacía. Tocá «Agregar bloque».</p>');
  $$('.pe-bq', l).forEach(el => el.addEventListener('click', e => { if (!e.target.closest('[data-acc]')) peElegir(el.dataset.id); }));
  $$('[data-acc]', l).forEach(b => b.onclick = e => { e.stopPropagation(); peAccion(b.closest('.pe-bq').dataset.id, b.dataset.acc); });
  // Arrastrar para ordenar
  let desde = null;
  $$('.pe-bq', l).forEach(el => {
    el.addEventListener('dragstart', e => { desde = +el.dataset.i; el.classList.add('arrastra'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', el.dataset.id); } catch (er) {} });
    el.addEventListener('dragend', () => { el.classList.remove('arrastra'); $$('.pe-bq', l).forEach(x => x.classList.remove('sobre')); });
    el.addEventListener('dragover', e => { e.preventDefault(); $$('.pe-bq', l).forEach(x => x.classList.toggle('sobre', x === el)); });
    el.addEventListener('drop', e => { e.preventDefault(); const a = paginaDe(_pg.id).bloques, hasta = +el.dataset.i; if (desde === null || desde === hasta) return;
      const [b] = a.splice(desde, 1); a.splice(hasta, 0, b); desde = null; Datos.guardar(); peListaBloques(); });
  });
}
function peAccion(id, acc){
  const a = paginaDe(_pg.id).bloques, i = a.findIndex(b => b.id === id); if (i < 0) return;
  if (acc === 'sub' || acc === 'baj') { const j = i + (acc === 'sub' ? -1 : 1); if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; }
  else if (acc === 'ver') { a[i].oculto = !a[i].oculto; aviso(a[i].oculto ? 'Bloque oculto: no se ve en la página (podés volver a mostrarlo).' : 'Bloque visible otra vez.'); }
  else if (acc === 'dup') { const c = JSON.parse(JSON.stringify(a[i])); c.id = Datos.nuevoId('bq'); a.splice(i + 1, 0, c); _pg.sel = c.id; }
  else if (acc === 'borrar') { if (!confirm('¿Borrar este bloque? (Podés deshacerlo con la flecha de arriba.)')) return; a.splice(i, 1); if (_pg.sel === id) _pg.sel = null; }
  Datos.guardar(); peListaBloques(); peInspector(); if (_pg.sel) setTimeout(() => peMarcar(_pg.sel), 300);
}
function peElegir(id, desdeVista){
  _pg.sel = id; $$('.pe-bq').forEach(x => x.classList.toggle('act', x.dataset.id === id));
  peInspector(); if (!desdeVista) peMarcar(id);
  const el = $(`.pe-bq[data-id="${id}"]`); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  if (MOVIL() && !desdeVista) { _pg.tab = 'editar'; const pe = $('.pe'); if (pe) pe.className = 'pe pe-tab-editar' + (_pg.lista ? '' : ' sin-lista'); $$('[data-petab]').forEach(x => x.classList.toggle('act', x.dataset.petab === 'editar')); }
}

// Dónde se edita cada parte fija
const EDITA_PARTE = { portada: ['config', 'Marca y datos (la portada) y Textos fijos'], cinta: [null, 'Es fija'], accesos: ['textos', 'Textos fijos'], claudio: ['claudio', 'Claudio (el dueño)'],
  campo: [null, 'Es un juego fijo'], destacados: ['drones', 'Drones'], explorar: ['drones', 'Drones'], curso: ['cursos', 'Cursos'], promos: ['promos', 'Promociones'], instagram: ['instagram', 'Instagram'] };
// Lo que se edita directo de cada parte fija (rutas desde la raíz de los datos)
const CAMPOS_PARTE = {
  portada: [['config.portada', 'Fondo de la portada', 'select', PORTADAS], ['textos.heroEtiqueta', 'Etiqueta de arriba', 'i18n'], ['textos.heroTitulo', 'Título grande', 'i18n'],
    ['textos.heroSub', 'Texto', 'i18narea'], ['textos.heroBtn1', 'Botón blanco · texto (vacío = «Ver los drones»)', 'i18n'], ['textos.heroBtn1Url', 'Botón blanco · a dónde lleva', 'url'],
    ['textos.heroBtn2', 'Segundo botón · texto (vacío = «Ir a la tienda»)', 'i18n'], ['textos.heroBtn2Url', 'Segundo botón · a dónde lleva', 'url'], ['claudio.foto', 'Foto de Claudio (tarjeta de abajo)', 'img']],
  accesos: [['textos.buscasTitulo', 'Título', 'i18n']],
  claudio: [['textos.claudioTitulo', 'Título', 'i18n'], ['claudio.frase', 'Frase de Claudio', 'i18narea'], ['claudio.foto2', 'Foto grande', 'img'], ['claudio.video', 'Video del celular', 'video']],
  destacados: [['textos.destacadosTitulo', 'Título (vacío = «Drones destacados»)', 'i18n']],
  promos: [['textos.promosTitulo', 'Título (vacío = «Oportunidades de este mes»)', 'i18n']]
};
const CAMPOS_PAGINA = {
  drones: [['textos.dronesTitulo', 'Título de la página', 'i18n'], ['textos.dronesSub', 'Texto de la página', 'i18narea']],
  tienda: [['textos.tiendaTitulo', 'Título de la página', 'i18n'], ['textos.tiendaSub', 'Texto de la página', 'i18narea']],
  cursos: [['textos.cursosTitulo', 'Título de la página', 'i18n'], ['textos.cursosSub', 'Texto de la página', 'i18narea']],
  servicio: [['textos.servTitulo', 'Título de la página', 'i18n'], ['textos.servSub', 'Texto de la página', 'i18narea']],
  nosotros: [['textos.nosTitulo', 'Título de la página', 'i18n'], ['claudio.historia', 'Historia de la empresa', 'i18narea'], ['claudio.frase', 'Frase de Claudio', 'i18narea']],
  contacto: [['textos.contactoTitulo', 'Título de la página', 'i18n'], ['textos.contactoSub', 'Texto de la página', 'i18narea']]
};
const EDITA_PAGINA = { drones: 'drones', tienda: 'productos', cursos: 'cursos', dinacia: 'dinacia', servicio: 'portada', nosotros: 'claudio', contacto: 'config', novedades: 'novedades' };

function peInspector(){
  const c = $('#pe-insp'); if (!c) return; const p = paginaDe(_pg.id), b = (p.bloques || []).find(x => x.id === _pg.sel);
  if (!b) { c.innerHTML = `<div class="pe-insp-vacio">${icono('editar')}<b>Elegí un bloque</b><p>Tocalo en la lista o directamente sobre la página para editarlo.</p>
    <button class="btn btn-verde btn-chico" onclick="bibliotecaBloques()">${icono('mas')} Agregar un bloque</button></div>`; return; }
  if (b.tipo === 'sis') {
    const [ir, n] = b.clave === 'contenido' ? [EDITA_PAGINA[p.id], ({ drones: 'Drones', tienda: 'Productos', cursos: 'Cursos', dinacia: 'Inscripciones DINACIA', servicio: 'Más contenido', nosotros: 'Claudio y Más contenido', contacto: 'Marca y datos', novedades: 'Novedades' })[p.id]] : (EDITA_PARTE[b.clave] || [null, '']);
    const campos = b.clave === 'contenido' ? CAMPOS_PAGINA[p.id] : CAMPOS_PARTE[b.clave];
    const pintarSis = () => {
      c.innerHTML = `<div class="pe-insp-cab"><span>${icono('candado')}</span><div><b>${esc(nombreParte(p, b))}</b><small>Parte fija de la página</small></div>
          <button class="pe-insp-x" onclick="_pg.sel=null;peInspector();peListaBloques()" title="Cerrar">${icono('cerrar')}</button></div>
        <div class="pe-insp-cuerpo ae-form">${campos ? `<p class="pe-tip">${icono('editar')} También podés tocar los textos en la página y escribir ahí mismo.</p>${camposEs(campos, Datos.get())}` : ''}
          <p class="pe-fijo">${campos ? 'El resto de esta parte' : 'Esta parte'} la arma la página sola. Podés <b>moverla</b> u <b>ocultarla</b>.${ir ? ` Lo demás se cambia en <b>${esc(n)}</b>.` : ''}</p>
          <div class="pe-fijo-acc">${ir ? `<button class="btn btn-borde btn-chico" onclick="adminIr('${ir}')">${icono('editar')} Ir a ${esc(n.split(' y ')[0])}</button>` : ''}
          <button class="btn btn-borde btn-chico" onclick="peAccion('${b.id}','ver')">${icono(b.oculto ? 'ojo' : 'ojono')} ${b.oculto ? 'Mostrar' : 'Ocultar'} esta parte</button></div></div>`;
      if (campos) activarCamposEs(c, Datos.get(), estr => { clearTimeout(_pg.aGuardar); _pg.aGuardar = setTimeout(() => Datos.guardar(), estr ? 0 : 160); }, pintarSis);
    };
    pintarSis();
    return;
  }
  const def = BLOQUES[b.tipo]; b.d = b.d || {};
  const pintar = () => {
    c.innerHTML = `<div class="pe-insp-cab"><span>${icono(def.icono)}</span><div><b>${esc(def.nombre)}</b><small>${esc(def.grupo)}</small></div>
        <button class="pe-insp-x" onclick="_pg.sel=null;peInspector();peListaBloques()" title="Cerrar">${icono('cerrar')}</button></div>
      <div class="pe-insp-tabs"><button data-it="cont" class="${_pg.itab !== 'estilo' ? 'act' : ''}">Contenido</button><button data-it="estilo" class="${_pg.itab === 'estilo' ? 'act' : ''}">Estilo</button></div>
      <div class="pe-insp-cuerpo ae-form">${_pg.itab === 'estilo' ? `
        <div class="ae-campo"><label>Fondo</label><div class="pe-fondos">${FONDOS_BLOQUE.map(([v, n]) => `<button type="button" class="pe-fondo f-${v} ${(b.fondo || def.fondo || 'claro') === v ? 'act' : ''}" data-fondo="${v}" title="${n}"><i></i><span>${n}</span></button>`).join('')}</div></div>
        <div class="ae-campo"><label>Espacio arriba y abajo</label><div class="opciones">${ESPACIOS_BLOQUE.map(([v, n]) => `<label class="opcion"><input type="radio" name="esp" value="${v}" ${(b.espacio || 'normal') === v ? 'checked' : ''}><span>${n}</span></label>`).join('')}</div></div>
        <label class="ae-check"><input type="checkbox" id="pe-oculto" ${b.oculto ? 'checked' : ''}><span></span>Ocultar este bloque (no se ve en la página)</label>`
        : camposEs(def.campos, b.d)}</div>
      <div class="pe-insp-pie"><button class="btn btn-borde btn-chico" onclick="peAccion('${b.id}','dup')">${icono('duplicar')} Duplicar</button><button class="btn btn-borde btn-chico rojo-txt" onclick="peAccion('${b.id}','borrar')">${icono('basura')} Borrar</button></div>`;
    $$('[data-it]', c).forEach(x => x.onclick = () => { _pg.itab = x.dataset.it; pintar(); });
    if (_pg.itab === 'estilo') {
      $$('[data-fondo]', c).forEach(x => x.onclick = () => { b.fondo = x.dataset.fondo; Datos.guardar(); pintar(); });
      $$('[name=esp]', c).forEach(x => x.onchange = () => { b.espacio = x.value; Datos.guardar(); });
      $('#pe-oculto', c).onchange = e => { b.oculto = e.target.checked; Datos.guardar(); peListaBloques(); };
    } else activarCamposEs(c, b.d, (estr) => { clearTimeout(_pg.aGuardar); _pg.aGuardar = setTimeout(() => { Datos.guardar(); if (estr) peListaBloques(); else { const s = $(`.pe-bq[data-id="${b.id}"] small`); if (s) s.textContent = tx(b.d.titulo) || tx(b.d.texto).slice(0, 40); } }, estr ? 0 : 150); }, pintar);
  };
  pintar();
}

/* ---------- Biblioteca de bloques ---------- */
function bibliotecaBloques(){
  let grupo = 'Todos', q = '';
  const m = abrirModal(`<div class="es-modal biblio"><div class="bib-cab"><h3>${icono('capas')} Agregar un bloque</h3><p>${PROTOTIPOS.length} prototipos listos. Elegí uno y después lo editás al 100 %.</p>
      <label class="ad-buscar">${icono('buscar')}<input id="bib-q" placeholder="Buscar: video, precios, testimonios…"></label></div>
    <div class="bib-cuerpo"><nav class="bib-grupos">${['Todos', ...GRUPOS_PROTO].map(g => `<button data-g="${g}" class="${g === grupo ? 'act' : ''}">${g}<small>${g === 'Todos' ? PROTOTIPOS.length : PROTOTIPOS.filter(p => p[2] === g).length}</small></button>`).join('')}</nav>
      <div class="bib-grilla" id="bib-grilla"></div></div></div>`, { cls: 'grande bib-modal' });
  const pintar = () => {
    const l = PROTOTIPOS.filter(p => (grupo === 'Todos' || p[2] === grupo) && (!q || (p[1] + ' ' + p[3] + ' ' + p[2]).toLowerCase().includes(q)));
    $('#bib-grilla').innerHTML = l.map(p => `<button class="bib-proto" data-p="${p[0]}"><div class="bib-mini"><div class="bib-mini-in">${miniBloque(p)}</div></div><b>${esc(p[1])}</b><span>${esc(p[3])}</span></button>`).join('') || '<p class="ad-vacio">No hay prototipos con esa búsqueda.</p>';
    $$('.bib-mini video', m).forEach(v => { v.removeAttribute('autoplay'); v.preload = 'none'; try { v.pause(); } catch (e) {} });
    requestAnimationFrame(() => $$('.bib-mini', m).forEach(x => { x.firstElementChild.style.transform = `scale(${x.clientWidth / 1200})`; }));   // la miniatura llena la tarjeta
    $$('[data-p]', m).forEach(b => b.onclick = () => agregarBloque(b.dataset.p));
  };
  $$('[data-g]', m).forEach(b => b.onclick = () => { grupo = b.dataset.g; $$('[data-g]', m).forEach(x => x.classList.toggle('act', x === b)); pintar(); });
  $('#bib-q').oninput = e => { q = e.target.value.trim().toLowerCase(); pintar(); };
  pintar();
}
// Miniatura real del prototipo (la misma página, achicada)
function miniBloque(p){
  const b = { id: 'mini', tipo: p[4], fondo: p[5], d: JSON.parse(JSON.stringify(p[6])) };
  try { return bloqueHTML(b).replace(/<iframe[^>]*><\/iframe>/g, '<div class="bib-iframe">▶</div>').replace(/\sautoplay/g, ''); } catch (e) { return ''; }
}
function agregarBloque(pid){
  const p = paginaDe(_pg.id), b = bloqueDesdeProto(pid); if (!p || !b) return;
  const i = p.bloques.findIndex(x => x.id === _pg.sel);
  p.bloques.splice(i >= 0 ? i + 1 : p.bloques.length, 0, b);
  _pg.sel = b.id; _pg.itab = 'cont'; Datos.guardar(); cerrarModal(); peListaBloques(); peInspector();
  setTimeout(() => peMarcar(b.id), 450); aviso('Bloque agregado. Editalo a la derecha.');
}

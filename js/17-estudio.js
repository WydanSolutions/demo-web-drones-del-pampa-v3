/* =====================================================================
   ESTUDIO (versión 3, 24/11/2026): el panel nuevo para administrar la
   página. Reemplaza al «Administrar» de la v2 pero usa sus formularios
   (13-admin y 14-admin-editor) para el catálogo y los datos fijos.
   - Barra de arriba: deshacer / rehacer, estado (publicado o con cambios),
     ver la página y PUBLICAR.
   - Menú de la izquierda por grupos. Cada módulo se suma con
     seccionEstudio({ id, nombre, icono, grupo, render, badge }).
   - Trabaja sobre el BORRADOR: la gente ve lo publicado hasta tocar Publicar.
   ===================================================================== */
const SECCIONES_ESTUDIO = [];
function seccionEstudio(s){ const i = SECCIONES_ESTUDIO.findIndex(x => x.id === s.id); if (i >= 0) SECCIONES_ESTUDIO[i] = s; else SECCIONES_ESTUDIO.push(s); }
const GRUPOS_ESTUDIO = ['', 'Diseño', 'Catálogo', 'Contenido fijo', 'Clientes', 'Ajustes'];
let _esSec = 'resumen', _esAbierto = false;
const ORDEN_ESTUDIO = ['resumen', 'paginas', 'novedades', 'links', 'instagram', 'drones', 'productos', 'categorias', 'cursos', 'promos', 'claudio', 'textos', 'portada', 'bandeja', 'estadisticas', 'config', 'archivos', 'versiones', 'respaldo'];

// Las secciones de la v2 que siguen igual (listas y formularios)
[['drones', 'Drones', 'dron', 'Catálogo'], ['productos', 'Productos', 'carrito', 'Catálogo'], ['categorias', 'Categorías', 'kit', 'Catálogo'], ['cursos', 'Cursos', 'calendario', 'Catálogo'],
  ['promos', 'Promociones', 'estrella', 'Catálogo'], ['claudio', 'Claudio (el dueño)', 'usuarios', 'Contenido fijo'], ['textos', 'Textos fijos', 'lapiz', 'Contenido fijo'],
  ['portada', 'Más contenido', 'mas', 'Contenido fijo'], ['config', 'Marca y datos', 'ajustes', 'Ajustes'], ['respaldo', 'Respaldo', 'descargar', 'Ajustes']]
  .forEach(([id, nombre, icono, grupo]) => seccionEstudio({ id, nombre, icono, grupo, v2: true }));
// Listas de «Más contenido» (se abren desde ahí, no van al menú)
['valores', 'equipo', 'servicio', 'faq', 'tiposService', 'instagram'].forEach(id => seccionEstudio({ id, nombre: (ESQUEMAS[id] || {}).titulo || id, icono: 'mas', grupo: null, v2: true }));
seccionEstudio({ id: 'inscriptos', nombre: 'Inscriptos a cursos', icono: 'usuarios', grupo: null, v2: true });
seccionEstudio({ id: 'dinacia', nombre: 'Inscripciones DINACIA', icono: 'escudo', grupo: null, v2: true });

/* --- Abrir y cerrar --- */
function abrirAdmin(){
  const a = $('#admin'); a.classList.add('abierto', 'estudio'); document.body.classList.add('bloqueado'); if (window.lenis) window.lenis.stop();
  let entro = false; try { entro = sessionStorage.getItem('dp_admin') === '1'; } catch (e) {}
  entro ? entrarEstudio() : pintarLogin();
}
function entrarEstudio(){
  Datos.usarBorrador(); prepararPaginas(); _esAbierto = true;
  try { const s = sessionStorage.getItem('dp_es_sec'); if (s && SECCIONES_ESTUDIO.some(x => x.id === s)) _esSec = s; } catch (e) {}
  pintarAdmin();
}
function cerrarAdmin(){
  $('#admin').classList.remove('abierto'); document.body.classList.remove('bloqueado'); if (window.lenis) window.lenis.start();
  if (_esAbierto) { _esAbierto = false; Datos.usarPublicado(); prepararPaginas(); dibujarTodo(); }
}
// El login de la v2 llama a pintarAdmin(): ahí se entra al borrador
const _pintarLoginV2 = pintarLogin;
pintarLogin = function(){
  _pintarLoginV2();
  $('.ad-login-caja h2').textContent = 'Estudio de la página';
  const f = $('#ad-login'); const viejo = f.onsubmit;
  f.onsubmit = e => { e.preventDefault(); if ($('#ad-clave').value === String(Datos.get().config.clave || '1234')) { try { sessionStorage.setItem('dp_admin', '1'); } catch (er) {} entrarEstudio(); } else $('#ad-clave').closest('.campo').classList.add('mal'); };
  void viejo;
};

/* --- El marco del Estudio --- */
function pintarAdmin(){
  if (!_esAbierto) { entrarEstudio(); return; }
  $('#admin').innerHTML = `
    <header class="es-top">
      <button class="es-hamb" onclick="document.body.classList.toggle('es-menu-abierto')" aria-label="Menú">${icono('menu')}</button>
      <div class="es-marca">${iconoDP({ cls: 'es-logo' })}<div><b>Estudio</b><small>Drones del Pampa</small></div></div>
      <div class="es-top-acc">
        <div class="es-deshacer"><button id="es-undo" title="Deshacer (Ctrl+Z)" onclick="esDeshacer()">${icono('deshacer')}</button><button id="es-redo" title="Rehacer (Ctrl+Y)" onclick="esRehacer()">${icono('rehacer')}</button></div>
        <button class="es-estado" id="es-estado" onclick="esVerCambios()"></button>
        <a class="btn btn-borde btn-chico es-ver" href="./?borrador=1${location.hash}" target="_blank" rel="noopener" title="Ver el borrador en otra pestaña">${icono('ojo')}<span>Vista previa</span></a>
        <button class="btn btn-verde btn-chico" id="es-publicar" onclick="esPublicar()">${icono('publicar')}<span>Publicar</span></button>
      </div>
    </header>
    <aside class="es-menu ad-menu">
      <nav>${GRUPOS_ESTUDIO.map(g => { const ss = SECCIONES_ESTUDIO.filter(s => s.grupo === g).sort((a, b) => ORDEN_ESTUDIO.indexOf(a.id) - ORDEN_ESTUDIO.indexOf(b.id)); if (!ss.length) return '';
        return `${g ? `<small class="es-grupo">${g}</small>` : ''}${ss.map(s => `<button data-es="${s.id}" onclick="adminIr('${s.id}')">${icono(s.icono)}<span>${esc(s.nombre)}</span><b class="ad-badge" data-badge="${s.id}" hidden></b></button>`).join('')}`; }).join('')}</nav>
      <div class="ad-menu-pie"><button onclick="cerrarAdmin()">${icono('externo')} Volver a la página</button>
        <button onclick="try{sessionStorage.removeItem('dp_admin')}catch(e){};cerrarAdmin()">${icono('candado')} Salir</button></div>
    </aside>
    <div class="es-velo-menu" onclick="document.body.classList.remove('es-menu-abierto')"></div>
    <main class="ad-cuerpo es-cuerpo" id="ad-cuerpo"></main>
    <section class="ad-editor" id="ad-editor"></section>`;
  adminIr(_esSec);
  esRefrescarBarra();
}

// Va a una sección (las nuevas tienen render; las de la v2 usan sus funciones de siempre)
const _adminIrV2 = adminIr;
adminIr = function(id){
  const s = SECCIONES_ESTUDIO.find(x => x.id === id) || SECCIONES_ESTUDIO.find(x => x.id === 'resumen');
  _esSec = s.id; try { sessionStorage.setItem('dp_es_sec', s.id); } catch (e) {}
  document.body.classList.remove('es-menu-abierto');
  $$('.es-menu [data-es]').forEach(b => b.classList.toggle('act', b.dataset.es === s.id || (s.grupo === null && b.dataset.es === 'portada' && ['valores', 'equipo', 'servicio', 'faq', 'tiposService'].includes(s.id))));
  $('#admin').dataset.sec = s.id; $('#admin').classList.remove('enfoque');
  if ($('#ad-editor')) adminCerrarEditor();
  const c = $('#ad-cuerpo'); if (!c) return; c.scrollTop = 0; c.className = 'ad-cuerpo es-cuerpo es-sec-' + s.id;
  if (s.v2) { _adminIrV2(s.id); }
  else { c.innerHTML = s.render ? s.render() : ''; if (s.alMostrar) s.alMostrar(c); }
  esRefrescarBarra();
};

/* --- Barra de arriba: deshacer, estado y publicar --- */
function esRefrescarBarra(){
  const u = $('#es-undo'); if (!u) return;
  u.disabled = !Datos.puedeDeshacer(); $('#es-redo').disabled = !Datos.puedeRehacer();
  const cambios = Datos.hayCambios(), e = $('#es-estado');
  e.className = 'es-estado ' + (cambios ? 'cambios' : 'ok');
  e.innerHTML = cambios ? `<i></i><span>Cambios sin publicar</span>` : `<i></i><span>Todo publicado</span>`;
  $('#es-publicar').disabled = !cambios;
  SECCIONES_ESTUDIO.forEach(s => { const b = $(`[data-badge="${s.id}"]`); if (!b) return; const n = s.badge ? s.badge() : 0; b.hidden = !n; b.textContent = n; });
}
function esDeshacer(){ if (Datos.deshacer()) { esTrasCambio(true); aviso('Cambio deshecho.'); } }
function esRehacer(){ if (Datos.rehacer()) { esTrasCambio(true); aviso('Cambio rehecho.'); } }
// Después de cualquier cambio: refresca la barra, las páginas y (si hace falta) la sección
function esTrasCambio(redibujarSeccion){
  prepararPaginas(); esRefrescarBarra();
  if (redibujarSeccion) { const s = SECCIONES_ESTUDIO.find(x => x.id === _esSec); if (s && s.refrescar) s.refrescar(); else adminIr(_esSec); }
}
Datos.alCambiar(() => { if (_esAbierto) { clearTimeout(window._esBarra); window._esBarra = setTimeout(esRefrescarBarra, 120); } });
document.addEventListener('keydown', e => {
  if (!_esAbierto || !(e.ctrlKey || e.metaKey)) return;
  const enTexto = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
  if (e.key.toLowerCase() === 'z' && !e.shiftKey && !enTexto) { e.preventDefault(); esDeshacer(); }
  else if ((e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey)) && !enTexto) { e.preventDefault(); esRehacer(); }
  else if (e.key.toLowerCase() === 's') { e.preventDefault(); if (Datos.hayCambios()) esPublicar(); }
});

function esVerCambios(){
  const l = Datos.cambiosResumen();
  abrirModal(`<div class="es-modal"><h3>${l.length ? 'Cambios que la gente todavía no ve' : 'Todo está publicado'}</h3>
    ${l.length ? `<p>Estás trabajando en un <b>borrador</b>. Estas partes cambiaron desde la última publicación:</p><ul class="es-lista-cambios">${l.map(x => `<li>${icono('lapiz')}${esc(x)}</li>`).join('')}</ul>
      <div class="es-modal-pie"><button class="btn btn-borde btn-chico" onclick="esDescartar()">Descartar los cambios</button><button class="btn btn-verde btn-chico" onclick="cerrarModal();esPublicar()">${icono('publicar')} Publicar ahora</button></div>`
      : `<p>Lo que ves en el Estudio es exactamente lo que ve la gente.</p>`}</div>`, { cls: 'chico' });
}
function esDescartar(){
  if (!confirm('¿Descartar todos los cambios del borrador? La página vuelve a como está publicada.')) return;
  Datos.descartarBorrador(); cerrarModal(); esTrasCambio(true); aviso('Listo: el borrador volvió a lo publicado.');
}
function esPublicar(){
  const l = Datos.cambiosResumen();
  abrirModal(`<div class="es-modal"><h3>${icono('publicar')} Publicar los cambios</h3><p>Lo que cambiaste pasa a verse en la página para todo el mundo.</p>
    ${l.length ? `<ul class="es-lista-cambios">${l.map(x => `<li>${icono('check')}${esc(x)}</li>`).join('')}</ul>` : ''}
    <div class="campo"><label>¿Qué cambiaste? (opcional, queda en el historial)</label><input id="es-nota" placeholder="Ej.: promo de diciembre"></div>
    <div class="es-modal-pie"><button class="btn btn-borde btn-chico" onclick="cerrarModal()">Todavía no</button><button class="btn btn-verde btn-chico" id="es-pub-ok">${icono('publicar')} Publicar</button></div></div>`, { cls: 'chico' });
  $('#es-pub-ok').onclick = () => {
    if (!Datos.publicar($('#es-nota').value.trim())) { aviso('No se pudo publicar: no hay lugar en este navegador.', 'error'); return; }
    if (typeof Drive !== 'undefined') Drive.respaldoDePublicacion();
    cerrarModal(); esRefrescarBarra(); festejoPublicado();
  };
}
function festejoPublicado(){
  const f = document.createElement('div'); f.className = 'es-publicado';
  f.innerHTML = `<div>${icono('check')}<b>¡Publicado!</b><span>Ya lo ve todo el mundo.</span></div>`;
  document.body.appendChild(f); setTimeout(() => f.classList.add('fuera'), 1900); setTimeout(() => f.remove(), 2500);
}

/* --- Resumen (la portada del Estudio) --- */
seccionEstudio({ id: 'resumen', nombre: 'Resumen', icono: 'casa', grupo: '', render(){
  const d = Datos.get(), st = typeof Estadisticas !== 'undefined' ? Estadisticas.resumen(30) : null, sin = typeof bandejaSinAtender === 'function' ? bandejaSinAtender() : 0;
  const caja = (n, txt, ir, ic, extra) => `<button class="es-kpi" onclick="adminIr('${ir}')">${icono(ic)}<b>${n}</b><span>${txt}</span>${extra ? `<small>${extra}</small>` : ''}</button>`;
  const prox = (d.novedades || []).filter(n => n.estado === 'publicada' && new Date(n.fecha) > new Date()).length;
  return `<div class="es-hola"><div><h2>¡Hola! 👋</h2><p>Este es el Estudio de la página. Todo lo que cambies queda en un <b>borrador</b> hasta que toques <b>Publicar</b>.</p></div>
      <div class="es-hola-acc"><button class="btn btn-azul btn-chico" onclick="adminIr('paginas')">${icono('capas')} Editar las páginas</button><button class="btn btn-borde btn-chico" onclick="adminIr('novedades');setTimeout(()=>nuevaNovedad(),50)">${icono('mas')} Nueva novedad</button></div></div>
    <div class="es-kpis">${caja(sin, 'para atender en la Bandeja', 'bandeja', 'bandeja', sin ? 'pedidos, turnos y consultas' : 'todo al día')}
      ${st ? caja(st.visitas.toLocaleString('es-UY'), 'visitas en 30 días', 'estadisticas', 'grafico', st.wa + ' toques en WhatsApp') : ''}
      ${caja((d.paginas || []).length, 'páginas', 'paginas', 'capas', (d.paginas || []).filter(p => !p.sistema).length + ' propias')}
      ${caja((d.novedades || []).length, 'novedades', 'novedades', 'diario', prox ? prox + ' programadas' : '')}</div>
    <div class="es-atajos">${[['paginas', 'capas', 'Páginas y bloques', 'Armá páginas nuevas con más de 40 prototipos'], ['novedades', 'diario', 'Novedades', 'Publicaciones con fotos, video y enlaces'],
      ['links', 'enlace', 'Link en la bio', 'La página para poner en Instagram'], ['instagram', 'instagram', 'Instagram', 'Qué publicaciones se muestran'],
      ['productos', 'carrito', 'Productos', d.productos.length + ' en la tienda'], ['archivos', 'nube', 'Archivos (Drive)', 'Fotos y videos guardados'],
      ['estadisticas', 'grafico', 'Estadísticas', 'Visitas, WhatsApp y lo más visto'], ['versiones', 'historial', 'Versiones', 'Volver a una publicación anterior']]
      .map(([id, ic, t2, s]) => `<button class="es-atajo" onclick="adminIr('${id}')">${icono(ic)}<b>${t2}</b><span>${esc(s)}</span></button>`).join('')}</div>
    <div class="ad-nota"><b>Cómo funciona</b><ol><li>Elegí a la izquierda qué querés cambiar.</li><li>Los cambios se ven al instante en la vista previa, pero la gente los ve recién cuando tocás <b>Publicar</b>.</li>
      <li>¿Te equivocaste? <b>Deshacer</b> (arriba) o, en <b>Versiones</b>, volvé a una publicación anterior.</li><li>Cada texto tiene su versión en portugués: si la dejás vacía, se muestra el español.</li></ol>
      <p class="ad-demo">⚠ Demostración: todo queda guardado solo en este navegador. En la versión final se guarda en la nube, las fotos en el Drive del taller, y lo ve todo el mundo.</p></div>`;
} });

/* --- Versiones: cada publicación queda guardada --- */
seccionEstudio({ id: 'versiones', nombre: 'Versiones', icono: 'historial', grupo: 'Ajustes', render(){
  const vs = Datos.versiones();
  return `<div class="ad-cab"><div><h2>Versiones publicadas</h2><p>Cada vez que publicás, queda una copia. Podés volver a cualquiera: vuelve al borrador y la publicás cuando quieras.</p></div></div>
    ${vs.length ? `<div class="es-versiones">${vs.map((v, i) => `<div class="es-version"><span class="es-ver-n">${i === 0 ? 'Actual' : '#' + (vs.length - i)}</span>
      <div><b>${esc(v.nota || 'Publicación')}</b><small>${fechaHoraCorta(v.fecha)} · ${haceCuanto(v.fecha)}</small></div>
      ${i === 0 ? '<span class="chip">En la página</span>' : `<button class="btn btn-borde btn-chico" onclick="esVolverVersion('${v.id}')">${icono('historial')} Volver a esta</button>`}</div>`).join('')}</div>`
      : `<p class="ad-vacio">Todavía no publicaste nada desde el Estudio. Cuando publiques, las versiones aparecen acá.</p>`}`;
} });
function esVolverVersion(id){
  if (!confirm('¿Volver a esta versión? El borrador queda igual que esa publicación (después la publicás si querés).')) return;
  if (Datos.volverAVersion(id)) { esTrasCambio(); aviso('Listo: el borrador volvió a esa versión. Tocá Publicar para que la vea la gente.'); adminIr('versiones'); }
}

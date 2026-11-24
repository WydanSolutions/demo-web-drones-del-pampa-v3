/* =====================================================================
   PANEL «ADMINISTRAR»: desde acá se edita absolutamente todo.
   Se abre desde el pie de la página («Administrar») o con ?admin en el link.
   En la demo la contraseña es 1234 y los cambios quedan en este navegador;
   en la versión real se guardan en la nube y los ve todo el mundo.
   ===================================================================== */
const ETIQUETAS_TEXTOS = {
  heroEtiqueta: 'Inicio · etiqueta de arriba', heroTitulo: 'Inicio · título grande', heroSub: 'Inicio · texto', buscasTitulo: 'Inicio · título de los accesos',
  claudioTitulo: 'Inicio · título de la parte de Claudio', dronesTitulo: 'Drones · título', dronesSub: 'Drones · texto', tiendaTitulo: 'Tienda · título', tiendaSub: 'Tienda · texto',
  cursosTitulo: 'Cursos · título', cursosSub: 'Cursos · texto', servTitulo: 'Servicio técnico · título', servSub: 'Servicio técnico · texto',
  nosTitulo: 'Nosotros · título', contactoTitulo: 'Contacto · título', contactoSub: 'Contacto · texto'
};
const SECCIONES_ADMIN = [
  ['resumen', 'Resumen', 'ojo'], ['textos', 'Textos de la página', 'lapiz'], ['config', 'Contacto y datos', 'telefono'],
  ['drones', 'Drones', 'dron'], ['productos', 'Tienda · productos', 'carrito'], ['categorias', 'Tienda · categorías', 'kit'],
  ['cursos', 'Cursos', 'calendario'], ['inscriptos', 'Inscriptos', 'usuarios'], ['dinacia', 'Inscripciones DINACIA', 'escudo'], ['promos', 'Promociones', 'flecha'],
  ['pedidos', 'Pedidos, turnos y mensajes', 'wa'], ['claudio', 'Claudio (el dueño)', 'usuarios'], ['portada', 'Más contenido', 'mas'], ['instagram', 'Instagram', 'instagram'], ['respaldo', 'Respaldo', 'subir']
];
let _adSec = 'resumen';

function abrirAdmin(){
  const a = $('#admin'); a.classList.add('abierto'); document.body.classList.add('bloqueado'); if (window.lenis) window.lenis.stop();
  let entro = false; try { entro = sessionStorage.getItem('dp_admin') === '1'; } catch (e) {}
  entro ? pintarAdmin() : pintarLogin();
}
function cerrarAdmin(){ $('#admin').classList.remove('abierto'); document.body.classList.remove('bloqueado'); if (window.lenis) window.lenis.start(); }

function pintarLogin(){
  $('#admin').innerHTML = `<div class="ad-login"><form class="ad-login-caja" id="ad-login">
      ${iconoDP({ cls: 'ad-login-logo' })}<h2>Administrar la página</h2><p>Drones del Pampa · DRAGUR Rivera</p>
      <div class="campo"><label>Contraseña</label><input type="password" id="ad-clave" autocomplete="current-password"><span class="error">Contraseña incorrecta</span></div>
      <button class="btn btn-verde" type="submit">Entrar</button>
      <p class="ad-pista">Demostración: la contraseña es <b>1234</b>.</p>
      <button type="button" class="ad-volver" onclick="cerrarAdmin()">← Volver a la página</button></form></div>`;
  $('#ad-clave').focus();
  $('#ad-login').onsubmit = e => {
    e.preventDefault();
    if ($('#ad-clave').value === String(Datos.get().config.clave || '1234')) { try { sessionStorage.setItem('dp_admin', '1'); } catch (er) {} pintarAdmin(); }
    else $('#ad-clave').closest('.campo').classList.add('mal');
  };
}

function pintarAdmin(){
  const d = Datos.get(), nuevos = d.pedidos.filter(p => p.estado === 'nuevo').length + d.mensajes.filter(m => !m.leido).length + (d.services || []).filter(x => x.estado === 'nuevo').length;
  $('#admin').innerHTML = `
    <aside class="ad-menu">
      <div class="ad-marca">${iconoDP({ cls: 'ad-logo' })}<div><b>Drones del Pampa</b><small>Panel de la página</small></div></div>
      <nav>${SECCIONES_ADMIN.map(([id, n, ic]) => `<button class="${_adSec === id ? 'act' : ''}" onclick="adminIr('${id}')">${icono(ic)}<span>${n}</span>
        ${id === 'pedidos' && nuevos ? `<b class="ad-badge">${nuevos}</b>` : ''}${id === 'dinacia' && (d.dinacia || []).filter(x => x.estado === 'nuevo').length ? `<b class="ad-badge">${d.dinacia.filter(x => x.estado === 'nuevo').length}</b>` : ''}${id === 'inscriptos' && d.inscripciones.length ? `<b class="ad-badge gris">${d.inscripciones.length}</b>` : ''}</button>`).join('')}</nav>
      <div class="ad-menu-pie"><button onclick="cerrarAdmin()">${icono('ojo')} Ver la página</button>
        <button onclick="try{sessionStorage.removeItem('dp_admin')}catch(e){};pintarLogin()">Salir</button></div>
    </aside>
    <main class="ad-cuerpo" id="ad-cuerpo"></main>
    <section class="ad-editor" id="ad-editor"></section>`;
  adminIr(_adSec);
}

function adminIr(id){
  _adSec = id; if (!$('#admin').classList.contains('estudio')) $$('.ad-menu nav button').forEach((b, i) => b.classList.toggle('act', (SECCIONES_ADMIN[i] || [])[0] === id));
  adminCerrarEditor && $('#ad-editor') && adminCerrarEditor();
  const c = $('#ad-cuerpo'); c.scrollTop = 0;
  if (ESQUEMAS[id]) { c.innerHTML = adminLista(id); return; }
  c.innerHTML = ({ resumen: adminResumen, textos: adminTextos, config: adminConfig, claudio: adminClaudio, inscriptos: adminInscriptos, dinacia: adminDinacia, pedidos: adminPedidos, portada: adminPortada, respaldo: adminRespaldo }[id])();
  if (id === 'textos' || id === 'config' || id === 'claudio') activarFormFijo(c, id);
}

function adminResumen(){
  const d = Datos.get();
  const caja = (n, txt, ir) => `<button class="ad-caja" onclick="adminIr('${ir}')"><b>${n}</b><span>${txt}</span></button>`;
  return `<div class="ad-cab"><div><h2>¡Hola! 👋</h2><p>Desde acá cambiás todo lo que se ve en la página, en español y en portugués. Los precios van en dólares.</p></div></div>
    <div class="ad-cajas">${caja(d.drones.length, 'drones', 'drones')}${caja(d.productos.length, 'productos en la tienda', 'productos')}${caja(d.cursos.length, 'cursos', 'cursos')}
      ${caja(d.inscripciones.length, 'inscriptos por la web', 'inscriptos')}${caja((d.dinacia || []).length, 'inscripciones DINACIA', 'dinacia')}${caja(d.pedidos.length, 'pedidos', 'pedidos')}${caja((d.services || []).length, 'turnos de service', 'pedidos')}${caja(d.mensajes.length, 'mensajes', 'pedidos')}</div>
    <div class="ad-nota"><b>Cómo funciona</b><ol>
      <li>Elegí a la izquierda qué querés cambiar (por ejemplo, <b>Tienda · productos</b>).</li>
      <li>Tocá el producto, cambiá el precio, la foto o el texto y tocá <b>Guardar cambios</b>.</li>
      <li>Para agregar uno nuevo, tocá <b>Agregar</b>. Para que no se vea sin borrarlo, destildá <b>Se ve en la página</b>.</li>
      <li>Cada texto tiene su versión en portugués: si la dejás vacía, se muestra el español.</li></ol>
      <p class="ad-demo">⚠ Esto es una demostración: los cambios quedan guardados solo en este navegador. En la versión final se guardan en la nube y los ve todo el mundo al instante.</p></div>`;
}

function adminTextos(){
  const T = Datos.get().textos;
  return `<div class="ad-cab"><div><h2>Textos de la página</h2><p>Títulos y textos de cada sección. Columna izquierda: español; derecha: portugués.</p></div></div>
    <form class="ae-form ad-fijo" id="ad-fijo">${Object.keys(ETIQUETAS_TEXTOS).map(k => campoAdmin(k, ETIQUETAS_TEXTOS[k], /Sub|Texto|Frase/.test(k) ? 'i18narea' : 'i18n', T[k])).join('')}
      <div class="ae-pie"><button class="btn btn-verde" type="submit">${icono('check')} Guardar textos</button></div></form>`;
}
function adminConfig(){
  const c = Datos.get().config;
  return `<div class="ad-cab"><div><h2>Contacto y datos</h2><p>Teléfonos, WhatsApp, horarios, dirección, Instagram y la contraseña de este panel.</p></div></div>
    <form class="ae-form ad-fijo" id="ad-fijo">
      ${campoAdmin('telefonos', 'Teléfonos (separados por coma)', 'etiquetas', c.telefonos)}
      ${campoAdmin('whatsapp', 'WhatsApp para pedidos (con código de país, ej. 59895659627)', 'texto', c.whatsapp)}
      ${campoAdmin('email', 'Correo', 'texto', c.email)}
      ${campoAdmin('direccion', 'Dirección', 'i18n', c.direccion)}
      ${campoAdmin('mapa', 'Dirección para el mapa (como la buscarías en Google Maps)', 'texto', c.mapa)}
      ${campoAdmin('horarios', 'Horarios', 'i18n', c.horarios)}
      ${campoAdmin('instagram', 'Link de Instagram', 'texto', c.instagram)}
      ${campoAdmin('portada', 'Portada del inicio', 'portada', c.portada || 'video')}
      ${campoAdmin('clave', 'Contraseña de este panel', 'texto', c.clave)}
      <div class="ae-pie"><button class="btn btn-verde" type="submit">${icono('check')} Guardar datos</button></div></form>`;
}
function adminClaudio(){
  const c = Datos.get().claudio;
  return `<div class="ad-cab"><div><h2>Claudio (el dueño)</h2><p>Aparece en el inicio, en Nosotros, en Servicio técnico y en todos los botones de WhatsApp.</p></div></div>
    <form class="ae-form ad-fijo" id="ad-fijo">
      ${campoAdmin('nombre', 'Nombre', 'texto', c.nombre)}${campoAdmin('cargo', 'Cargo', 'i18n', c.cargo)}
      ${campoAdmin('foto', 'Foto de la cara (la redonda: menú, WhatsApp, portada)', 'img', c.foto)}${campoAdmin('foto2', 'Foto grande (inicio y Nosotros)', 'img', c.foto2)}${campoAdmin('foto3', 'Foto de Servicio técnico (se ve si no hay video)', 'img', c.foto3)}${campoAdmin('videoServicio', 'Video de Servicio técnico (ruta o link a un .mp4; vacío = la foto)', 'texto', c.videoServicio)}
      ${campoAdmin('video', 'Video del inicio (ruta o link a un .mp4)', 'texto', c.video)}
      ${campoAdmin('frase', 'Su frase (inicio y Nosotros)', 'i18narea', c.frase)}${campoAdmin('historia', 'Historia de la empresa (Nosotros)', 'i18narea', c.historia)}
      <div class="ae-pie"><button class="btn btn-verde" type="submit">${icono('check')} Guardar</button></div></form>`;
}
// Textos, Contacto y Claudio: se editan sobre una copia y se guardan juntos
function activarFormFijo(c, id){
  const destino = id;
  _ed = { col: null, i: -1, borrador: JSON.parse(JSON.stringify(Datos.get()[destino])) };
  activarCamposAdmin(c);
  $('#ad-fijo').onsubmit = e => { e.preventDefault(); Datos.get()[destino] = _ed.borrador; if (Datos.guardar()) { dibujarTodo(true); aviso('Guardado en el borrador. Tocá Publicar para que lo vea la gente.'); } };
}

function adminPortada(){
  const caja = (col) => `<button class="ad-caja grande" onclick="adminIr('${col}')"><b>${Datos.get()[col].length}</b><span>${ESQUEMAS[col].titulo}</span></button>`;
  return `<div class="ad-cab"><div><h2>Más contenido</h2><p>Lo que nos destaca, los pasos y las preguntas del servicio técnico y los tipos de service.</p></div></div>
    <div class="ad-cajas">${caja('valores')}${caja('equipo')}${caja('servicio')}${caja('faq')}${caja('tiposService')}</div>`;
}

function tablaAdmin(cols, filas, vacio){
  if (!filas.length) return `<p class="ad-vacio">${vacio}</p>`;
  return `<div class="ad-tabla-caja"><table class="ad-tabla"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${filas.join('')}</tbody></table></div>`;
}
const fechaHora = iso => new Date(iso).toLocaleString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function adminInscriptos(){
  const d = Datos.get();
  const filas = d.inscripciones.map(i => `<tr><td>${fechaHora(i.fecha)}</td><td><b>${esc(i.cursoNombre)}</b>${i.espera ? ' <span class="chip ambar">Lista de espera</span>' : ''}</td>
    <td>${esc(i.nombre)}<br><small>CI ${esc(i.ci)}</small></td><td><a href="https://wa.me/598${String(i.tel).replace(/\D/g, '').replace(/^0/, '')}" target="_blank" rel="noopener">${esc(i.tel)}</a><br><small>${esc(i.email)}</small></td>
    <td>${esc(i.ciudad || '')}</td><td>${esc({ no: 'Nunca voló', algo: 'Drones chicos', agro: 'Drones agrícolas' }[i.exp] || '')}</td>
    <td><button class="ad-mini-btn rojo" onclick="adminBorrarDe('inscripciones','${i.id}')">${icono('basura')}</button></td></tr>`);
  return `<div class="ad-cab"><div><h2>Inscriptos a los cursos</h2><p>Todas las personas que se anotaron desde la página. Los cupos se descuentan solos.</p></div>
      <button class="btn btn-borde btn-chico" onclick="exportarCSV('inscripciones')">${icono('subir')} Descargar planilla</button></div>
    ${tablaAdmin(['Fecha', 'Curso', 'Persona', 'Contacto', 'Ciudad', 'Experiencia', ''], filas, 'Todavía no se anotó nadie desde la página. Probá inscribirte en un curso para ver cómo llega.')}`;
}

function adminPedidos(){
  const d = Datos.get();
  const ped = d.pedidos.map(p => `<tr class="${p.estado === 'nuevo' ? 'nuevo' : ''}"><td>${fechaHora(p.fecha)}</td><td><b>${esc(p.nombre)}</b><br><small>${esc(p.tel)} ${p.ciudad ? '· ' + esc(p.ciudad) : ''}</small></td>
    <td>${p.items.map(i => `${i.n} × ${esc(i.nombre)}`).join('<br>')}</td><td><b>USD ${usd(p.total)}</b></td>
    <td><select onchange="adminEstado('${p.id}',this.value)">${['nuevo', 'contactado', 'vendido', 'perdido'].map(s => `<option ${p.estado === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
    <td><button class="ad-mini-btn rojo" onclick="adminBorrarDe('pedidos','${p.id}')">${icono('basura')}</button></td></tr>`);
  const msj = d.mensajes.map(m => `<tr><td>${fechaHora(m.fecha)}</td><td><b>${esc(m.nombre)}</b><br><small>${esc(m.tel)} ${m.ciudad ? '· ' + esc(m.ciudad) : ''}</small></td>
    <td><span class="chip gris">${esc(m.motivo)}</span></td><td>${esc(m.msg)}</td><td><button class="ad-mini-btn rojo" onclick="adminBorrarDe('mensajes','${m.id}')">${icono('basura')}</button></td></tr>`);
  const srv = (d.services || []).map(x => `<tr class="${x.estado === 'nuevo' ? 'nuevo' : ''}"><td>${fechaHora(x.fecha)}</td><td><b>${esc(x.nombre)}</b><br><small>${esc(x.tel)} ${x.ciudad ? '· ' + esc(x.ciudad) : ''}</small></td>
    <td><b>${esc(x.equipo)}</b> · ${esc(x.tipo)}${x.serie ? '<br><small>N° ' + esc(x.serie) + '</small>' : ''}</td><td>${esc(x.problema)}${x.retiro ? '<br><span class="chip ambar">Pasar a buscar</span>' : ''}</td><td>${esc(x.dia || '')}</td>
    <td><select onchange="adminEstadoSrv('${x.id}',this.value)">${['nuevo', 'confirmado', 'en el taller', 'listo', 'entregado'].map(s => `<option ${x.estado === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
    <td><button class="ad-mini-btn rojo" onclick="adminBorrarDe('services','${x.id}')">${icono('basura')}</button></td></tr>`);
  d.mensajes.forEach(m => m.leido = true); Datos.guardar();
  return `<div class="ad-cab"><div><h2>Pedidos de la tienda</h2><p>Cada pedido llega por WhatsApp y además queda acá para seguirlo.</p></div>
      <button class="btn btn-borde btn-chico" onclick="exportarCSV('pedidos')">${icono('subir')} Descargar planilla</button></div>
    ${tablaAdmin(['Fecha', 'Cliente', 'Productos', 'Total', 'Estado', ''], ped, 'Todavía no hay pedidos. Agregá algo al carrito y mandalo para ver cómo llega.')}
    <div class="ad-cab" style="margin-top:40px"><div><h2>Turnos de servicio técnico</h2><p>Los pedidos de turno que llegan desde la página de Servicio técnico.</p></div></div>
    ${tablaAdmin(['Fecha', 'Cliente', 'Equipo', 'Qué le pasa', 'Día', 'Estado', ''], srv, 'Todavía no pidieron turnos.')}
    <div class="ad-cab" style="margin-top:40px"><div><h2>Mensajes de contacto</h2></div></div>
    ${tablaAdmin(['Fecha', 'Persona', 'Motivo', 'Mensaje', ''], msj, 'Todavía no hay mensajes.')}`;
}
function adminEstadoSrv(id, e){ const x = (Datos.get().services || []).find(z => z.id === id); if (x) { x.estado = e; Datos.guardar(); } }
function adminEstado(id, e){ const p = Datos.get().pedidos.find(x => x.id === id); if (p) { p.estado = e; Datos.guardar(); } }
function adminBorrarDe(col, id){ if (!confirm('¿Borrar este registro?')) return; const d = Datos.get(); d[col] = d[col].filter(x => x.id !== id); Datos.guardar(); adminIr(_adSec); if (col === 'inscripciones') dibujarTodo(true); }

function exportarCSV(col){
  const d = Datos.get(); let filas;
  if (col === 'inscripciones') filas = [['Fecha', 'Curso', 'Lista de espera', 'Nombre', 'CI', 'Teléfono', 'Correo', 'Ciudad', 'Experiencia', 'Comentario'],
    ...d.inscripciones.map(i => [fechaHora(i.fecha), i.cursoNombre, i.espera ? 'Sí' : 'No', i.nombre, i.ci, i.tel, i.email, i.ciudad, i.exp, i.com])];
  else filas = [['Fecha', 'Nombre', 'Teléfono', 'Ciudad', 'Productos', 'Total USD', 'Estado'],
    ...d.pedidos.map(p => [fechaHora(p.fecha), p.nombre, p.tel, p.ciudad, p.items.map(i => i.n + ' x ' + i.nombre).join(' | '), p.total, p.estado])];
  const csv = '﻿' + filas.map(f => f.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = col + '-' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); a.remove();
}

function adminRespaldo(){
  return `<div class="ad-cab"><div><h2>Respaldo</h2><p>Guardá una copia de todo el contenido de la página o volvé a cargar una copia anterior.</p></div></div>
    <div class="ad-cajas">
      <button class="ad-caja grande" onclick="Datos.exportar()">${icono('subir')}<span><b>Descargar copia</b><br>Un archivo con todo: textos, precios, productos, cursos e inscriptos.</span></button>
      <label class="ad-caja grande">${icono('abajo')}<span><b>Cargar una copia</b><br>Vuelve la página a como estaba en ese archivo.</span><input type="file" accept=".json,application/json" hidden onchange="adminImportar(this)"></label>
      <button class="ad-caja grande" onclick="if(confirm('¿Volver al contenido de ejemplo? Se pierden los cambios hechos en este navegador.')){Datos.restaurar();dibujarTodo(true);adminIr('respaldo');aviso('Listo: volvió el contenido de ejemplo.')}">${icono('cerrar')}<span><b>Volver al ejemplo</b><br>Deshace todos los cambios de esta demostración.</span></button>
    </div>`;
}
function adminImportar(inp){
  const f = inp.files[0]; if (!f) return;
  f.text().then(txt => { try { Datos.importar(txt); dibujarTodo(true); pintarAdmin(); aviso('Copia cargada.'); } catch (e) { aviso(e.message, 'error'); } });
}

/* =====================================================================
   BANDEJA (versión 3): todo lo que mandan los visitantes, en un solo
   lugar: pedidos de la tienda, turnos de service, inscripciones a
   cursos, DINACIA y mensajes (también los de los formularios de los
   bloques). Filtros, buscador, estado de cada uno, nota interna y
   WhatsApp con un mensaje ya armado.
   ===================================================================== */
const TIPOS_BANDEJA = {
  pedidos: { n: 'Pedido de la tienda', pl: 'Pedidos', ic: 'carrito', estados: ['nuevo', 'contactado', 'vendido', 'perdido'] },
  services: { n: 'Turno de service', pl: 'Turnos', ic: 'motor', estados: ['nuevo', 'confirmado', 'en el taller', 'listo', 'entregado'] },
  inscripciones: { n: 'Inscripción a un curso', pl: 'Cursos', ic: 'calendario', estados: ['nuevo', 'confirmado', 'pagó', 'asistió', 'cancelado'] },
  dinacia: { n: 'Registro DINACIA', pl: 'DINACIA', ic: 'escudo', estados: typeof ESTADOS_DIN !== 'undefined' ? ESTADOS_DIN : ['nuevo'] },
  mensajes: { n: 'Mensaje', pl: 'Mensajes', ic: 'mail', estados: ['nuevo', 'respondido', 'archivado'] }
};
const _bj = { filtro: 'todo', q: '', sel: null };
const estadoDe = (col, x) => x.estado || (col === 'mensajes' ? (x.leido ? 'respondido' : 'nuevo') : 'nuevo');
const FINALES = ['vendido', 'perdido', 'entregado', 'asistió', 'cancelado', 'registrado', 'archivado', 'respondido'];

function itemsBandeja(){
  const d = Datos.get(), l = [];
  for (const col of Object.keys(TIPOS_BANDEJA)) for (const x of d[col] || []) {
    const nombre = col === 'dinacia' && x.persona === 'empresa' ? x.razon : x.nombre;
    const res = col === 'pedidos' ? (x.items || []).map(i => i.n + ' × ' + i.nombre).join(', ') + (x.total ? ' · USD ' + usd(x.total) : '')
      : col === 'services' ? (x.equipo || '') + ' · ' + (x.problema || '') : col === 'inscripciones' ? (x.cursoNombre || '') + (x.espera ? ' · lista de espera' : '')
      : col === 'dinacia' ? (x.modelo || '') + ' · ' + (x.uso === 'terceros' ? 'servicio a terceros' : 'uso propio') : (x.motivo ? x.motivo + ' · ' : '') + (x.msg || '');
    l.push({ col, x, id: x.id, fecha: x.fecha || '', nombre: nombre || '(sin nombre)', tel: x.tel || '', res, estado: estadoDe(col, x) });
  }
  return l.sort((a, b) => b.fecha.localeCompare(a.fecha));
}
const bandejaSinAtender = () => itemsBandeja().filter(i => i.estado === 'nuevo').length;
const telWa2 = tel => { const n = String(tel || '').replace(/\D/g, ''); return n.startsWith('598') || n.startsWith('55') ? n : '598' + n.replace(/^0/, ''); };

seccionEstudio({ id: 'bandeja', nombre: 'Bandeja', icono: 'bandeja', grupo: 'Clientes', badge: bandejaSinAtender,
  render(){
    const todos = itemsBandeja(), q = _bj.q.toLowerCase();
    const l = todos.filter(i => (_bj.filtro === 'todo' || (_bj.filtro === 'nuevo' ? i.estado === 'nuevo' : i.col === _bj.filtro)) && (!q || (i.nombre + ' ' + i.tel + ' ' + i.res).toLowerCase().includes(q)));
    if (_bj.sel && !todos.some(i => i.id === _bj.sel)) _bj.sel = null;
    const cuenta = f => f === 'todo' ? todos.length : f === 'nuevo' ? todos.filter(i => i.estado === 'nuevo').length : todos.filter(i => i.col === f).length;
    return `<div class="ad-cab"><div><h2>Bandeja</h2><p>Todo lo que llega desde la página. Cambiá el estado a medida que lo atendés; lo nuevo se marca con un punto.</p></div>
        <div class="es-cab-acc"><button class="btn btn-borde btn-chico" onclick="exportarBandeja()">${icono('descargar')} Descargar planilla</button></div></div>
      <div class="bj-filtros">${[['todo', 'Todo'], ['nuevo', 'Sin atender'], ...Object.entries(TIPOS_BANDEJA).map(([k, v]) => [k, v.pl])].map(([k, n]) => `<button class="${_bj.filtro === k ? 'act' : ''}" onclick="_bj.filtro='${k}';_bj.sel=null;adminIr('bandeja')">${n}<small>${cuenta(k)}</small></button>`).join('')}</div>
      <label class="ad-buscar">${icono('buscar')}<input id="bj-q" placeholder="Buscar por nombre, teléfono o lo que pidió…" value="${esc(_bj.q)}"></label>
      <div class="bj ${_bj.sel ? 'con-sel' : ''}"><div class="bj-lista">${l.map(i => { const T2 = TIPOS_BANDEJA[i.col];
        return `<button class="bj-item ${i.id === _bj.sel ? 'act' : ''} ${i.estado === 'nuevo' ? 'nuevo' : ''}" onclick="_bj.sel='${i.id}';adminIr('bandeja')">
          <span class="bj-ico">${icono(T2.ic)}</span><span class="bj-txt"><b>${esc(i.nombre)}</b><small>${esc(T2.n)} · ${esc(i.res).slice(0, 80)}</small></span>
          <span class="bj-der"><small>${haceCuanto(i.fecha)}</small><span class="chip ${i.estado === 'nuevo' ? 'ambar' : FINALES.includes(i.estado) ? 'gris' : 'azul'}">${esc(i.estado)}</span></span></button>`; }).join('') || '<p class="ad-vacio">No hay nada con ese filtro. Cuando alguien pida algo en la página, aparece acá.</p>'}</div>
        <div class="bj-detalle">${_bj.sel ? detalleBandeja(todos.find(i => i.id === _bj.sel)) : `<div class="pe-insp-vacio">${icono('bandeja')}<b>Elegí uno de la lista</b><p>Vas a ver todos los datos, el estado y el botón para responder por WhatsApp.</p></div>`}</div></div>`;
  },
  alMostrar(c){ const q = $('#bj-q', c); if (q) q.oninput = () => { _bj.q = q.value; clearTimeout(window._bjq); window._bjq = setTimeout(() => { adminIr('bandeja'); const n = $('#bj-q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); }; } });

function detalleBandeja(i){
  if (!i) return ''; const x = i.x, T2 = TIPOS_BANDEJA[i.col];
  const filas = []; const f = (k, v) => { if (v !== undefined && v !== null && String(v).trim() !== '') filas.push(`<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`); };
  f('Fecha', fechaHoraCorta(x.fecha)); f('Teléfono', x.tel); f('Correo', x.email); f('Ciudad', x.ciudad); f('Idioma', x.idioma === 'pt' ? 'Portugués' : x.idioma ? 'Español' : '');
  if (i.col === 'pedidos') { (x.items || []).forEach(it => f(it.n + ' ×', it.nombre)); f('Total', x.total ? 'USD ' + usd(x.total) : ''); }
  if (i.col === 'services') { f('Equipo', x.equipo); f('Tipo', x.tipo); f('N° de serie', x.serie); f('Qué le pasa', x.problema); f('Día preferido', x.dia); f('Retiro', x.retiro ? 'Pasar a buscar' : ''); }
  if (i.col === 'inscripciones') { f('Curso', x.cursoNombre); f('N°', x.numero); f('CI', x.ci); f('Experiencia', { no: 'Nunca voló', algo: 'Drones chicos', agro: 'Drones agrícolas' }[x.exp] || x.exp); f('Comentario', x.com); f('Lista de espera', x.espera ? 'Sí' : ''); }
  if (i.col === 'dinacia') { f('N°', x.numero); f('Persona', x.persona === 'empresa' ? 'Empresa · RUT ' + (x.rut || '') : 'CI ' + (x.ci || '')); f('Dron', x.modelo); f('N° de serie', x.serie); f('Uso', x.uso === 'terceros' ? 'Servicio a terceros' : 'Uso propio'); f('Documentos', Object.keys(x.docs || {}).length); }
  if (i.col === 'mensajes') { f('Asunto', x.motivo); f('Mensaje', x.msg); f('Desde la página', x.pagina); }
  const saludo = (x.idioma === 'pt' ? 'Olá ' : '¡Hola ') + String(i.nombre).split(' ')[0] + (x.idioma === 'pt' ? '! Aqui é a Drones del Pampa. ' : '! Te escribimos de Drones del Pampa. ');
  const motivo = i.col === 'pedidos' ? (x.idioma === 'pt' ? 'Recebemos seu pedido pelo site.' : 'Recibimos tu pedido de la página.') : i.col === 'services' ? (x.idioma === 'pt' ? 'Recebemos seu pedido de revisão.' : 'Recibimos tu pedido de turno.') : i.col === 'inscripciones' ? (x.idioma === 'pt' ? 'Recebemos sua inscrição no curso.' : 'Recibimos tu inscripción al curso.') : (x.idioma === 'pt' ? 'Recebemos sua mensagem.' : 'Recibimos tu mensaje.');
  return `<div class="bj-cab"><span class="bj-ico grande">${icono(T2.ic)}</span><div><b>${esc(i.nombre)}</b><small>${esc(T2.n)}</small></div><button class="pe-insp-x" onclick="_bj.sel=null;adminIr('bandeja')">${icono('cerrar')}</button></div>
    <div class="bj-estado"><label>Estado</label><div class="opciones">${T2.estados.map(s => `<label class="opcion"><input type="radio" name="bj-e" value="${esc(s)}" ${i.estado === s ? 'checked' : ''} onchange="bandejaEstado('${i.col}','${i.id}',this.value)"><span>${esc(s)}</span></label>`).join('')}</div></div>
    <div class="bj-datos">${filas.join('')}</div>
    <div class="campo"><label>Nota interna (no la ve el cliente)</label><textarea id="bj-nota" placeholder="Ej.: le pasé precio, vuelve el lunes" onchange="bandejaNota('${i.col}','${i.id}',this.value)">${esc(x.nota || '')}</textarea></div>
    <div class="bj-acc">${i.tel ? `<a class="btn btn-wa btn-chico" href="https://wa.me/${telWa2(i.tel)}?text=${encodeURIComponent(saludo + motivo)}" target="_blank" rel="noopener" onclick="bandejaEstado('${i.col}','${i.id}','${T2.estados[1]}', true)">${icono('wa')} Responder por WhatsApp</a>` : ''}
      ${x.email ? `<a class="btn btn-borde btn-chico" href="mailto:${esc(x.email)}">${icono('mail')} Correo</a>` : ''}
      <button class="btn btn-borde btn-chico rojo-txt" onclick="bandejaBorrar('${i.col}','${i.id}')">${icono('basura')} Borrar</button></div>`;
}
function bandejaEstado(col, id, e, soloSiNuevo){
  const x = (Datos.get()[col] || []).find(z => z.id === id); if (!x) return;
  if (soloSiNuevo && estadoDe(col, x) !== 'nuevo') return;
  x.estado = e; if (col === 'mensajes') x.leido = e !== 'nuevo'; Datos.guardar(); setTimeout(() => adminIr('bandeja'), soloSiNuevo ? 400 : 0);
}
function bandejaNota(col, id, v){ const x = (Datos.get()[col] || []).find(z => z.id === id); if (x) { x.nota = v; Datos.guardar(); aviso('Nota guardada.'); } }
function bandejaBorrar(col, id){ if (!confirm('¿Borrar este registro de la Bandeja?')) return; Datos.get()[col] = (Datos.get()[col] || []).filter(z => z.id !== id); _bj.sel = null; Datos.guardar(); adminIr('bandeja'); }
function exportarBandeja(){
  const filas = [['Fecha', 'Tipo', 'Nombre', 'Teléfono', 'Correo', 'Ciudad', 'Detalle', 'Estado', 'Nota'], ...itemsBandeja().map(i => [fechaHoraCorta(i.fecha), TIPOS_BANDEJA[i.col].n, i.nombre, i.tel, i.x.email || '', i.x.ciudad || '', i.res, i.estado, i.x.nota || ''])];
  const csv = '﻿' + filas.map(f => f.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'bandeja-' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); a.remove();
}

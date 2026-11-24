/* =====================================================================
   ESTUDIO · ARCHIVOS (versión 3): el Google Drive del taller (simulado).
   Carpetas, subir fotos y videos (también arrastrándolos), ver el
   original y la copia liviana, dónde se usa cada uno, descargar y borrar.
   ===================================================================== */
let _arCarpeta = '', _arQ = '';
const CARPETAS_BASE = ['Imágenes', 'Videos', 'Documentos', 'Respaldos'];

function usosDeArchivo(id){
  const ref = 'drive:' + id, d = Datos.get(), l = [];
  (d.paginas || []).forEach(p => { if (JSON.stringify(p).includes(ref)) l.push('Página: ' + tituloPagina(p)); });
  (d.novedades || []).forEach(n => { if (JSON.stringify(n).includes(ref)) l.push('Novedad: ' + tx(n.titulo)); });
  for (const k of ['drones', 'productos', 'cursos', 'promos', 'instagram', 'claudio', 'links']) if (JSON.stringify(d[k] || '').includes(ref)) l.push({ drones: 'Drones', productos: 'Productos', cursos: 'Cursos', promos: 'Promociones', instagram: 'Instagram', claudio: 'Claudio', links: 'Link en la bio' }[k]);
  return l;
}

seccionEstudio({ id: 'archivos', nombre: 'Archivos (Drive)', icono: 'nube', grupo: 'Ajustes',
  render(){
    const todos = Drive.lista(), usado = todos.reduce((s, a) => s + (a.tam || 0) + (a.tamWeb || 0), 0);
    const q = _arQ.toLowerCase(), pre = _arCarpeta ? _arCarpeta + '/' : '';
    const sub = [...new Set([...(!_arCarpeta ? CARPETAS_BASE : []), ...todos.filter(a => a.carpeta.startsWith(pre) && a.carpeta !== _arCarpeta).map(a => a.carpeta.slice(pre.length).split('/')[0])])];
    const aca = q ? todos.filter(a => (a.nombre + ' ' + a.carpeta).toLowerCase().includes(q)) : todos.filter(a => a.carpeta === _arCarpeta);
    const migas = ['', ..._arCarpeta.split('/').filter(Boolean).map((_, i, a) => a.slice(0, i + 1).join('/'))];
    return `<div class="ad-cab"><div><h2>Archivos · Google Drive del taller</h2><p>Todo lo que se sube queda <b>entero</b> en el Drive del taller. La página usa una <b>copia liviana</b> de cada foto, así carga rápido.</p></div>
        <div class="es-cab-acc"><label class="btn btn-verde btn-chico">${icono('subir')} Subir archivos<input type="file" multiple accept="image/*,video/*,application/pdf" hidden id="ar-subir"></label></div></div>
      <div class="ar-uso"><div><b>${tamano(usado)}</b> usados de <b>15 GB</b> (cuenta gratis del taller)</div><i style="--p:${Math.min(100, usado / (15 * 1073741824) * 100).toFixed(2)}%"></i></div>
      <div class="ar-barra"><nav class="ar-migas">${migas.map((c, i) => `<button onclick="_arCarpeta='${esc(c)}';_arQ='';adminIr('archivos')" class="${c === _arCarpeta ? 'act' : ''}">${i === 0 ? icono('nube') + ' ' + CARPETA_RAIZ : esc(c.split('/').pop())}</button>`).join('<span>/</span>')}</nav>
        <label class="ad-buscar">${icono('buscar')}<input id="ar-q" placeholder="Buscar en el Drive…" value="${esc(_arQ)}"></label></div>
      <div class="ar-zona" id="ar-zona">
        ${!q && sub.length ? `<div class="ar-carpetas">${sub.map(n => { const ruta = pre + n, cant = todos.filter(a => a.carpeta === ruta || a.carpeta.startsWith(ruta + '/')).length;
          return `<button class="ar-carpeta" onclick="_arCarpeta='${esc(ruta)}';adminIr('archivos')">${icono('carpeta')}<b>${esc(n)}</b><small>${cant} ${cant === 1 ? 'archivo' : 'archivos'}</small></button>`; }).join('')}</div>` : ''}
        <div class="ar-grilla">${aca.map(a => `<button class="ar-arch" onclick="detalleArchivo('${a.id}')">
          <span class="ar-th">${/^image\//.test(a.tipo) ? `<img src="drive:${a.id}" alt="" loading="lazy">` : /^video\//.test(a.tipo) ? `<video src="drive:${a.id}" muted preload="metadata"></video><i>${icono('play')}</i>` : icono('diario')}</span>
          <b>${esc(a.nombre)}</b><small>${tamano(a.tam)}${a.tamWeb ? ' · web ' + tamano(a.tamWeb) : ''}</small></button>`).join('')}</div>
        ${!aca.length && !(sub.length && !q) ? `<p class="ad-vacio">${q ? 'No hay archivos con esa búsqueda.' : 'Esta carpeta está vacía. Arrastrá fotos o videos acá, o tocá «Subir archivos».'}</p>` : ''}
        <div class="ar-soltar">${icono('subir')}<b>Soltá los archivos para subirlos</b></div></div>
      <div class="ad-nota"><b>En la versión real</b><p>Esta es la carpeta «${CARPETA_RAIZ}» del Google Drive de la cuenta del taller, compartida con la cuenta que usan todos los días. Los videos largos conviene subirlos a YouTube como «no listado» y pegar el link: el original queda acá de respaldo.</p></div>`;
  },
  alMostrar(c){
    const subirLista = async files => { if (!files.length) return; aviso('Subiendo ' + files.length + (files.length > 1 ? ' archivos…' : ' archivo…'));
      for (const f of files) await Drive.subir(f, _arCarpeta && !['Imágenes', 'Videos', 'Documentos'].includes(_arCarpeta) ? _arCarpeta : undefined);
      aviso('Listo: quedó en el Drive del taller.'); adminIr('archivos'); };
    $('#ar-subir', c).onchange = e => subirLista([...e.target.files]);
    const z = $('#ar-zona', c); z.ondragover = e => { e.preventDefault(); z.classList.add('sobre'); }; z.ondragleave = e => { if (!z.contains(e.relatedTarget)) z.classList.remove('sobre'); };
    z.ondrop = e => { e.preventDefault(); z.classList.remove('sobre'); subirLista([...e.dataTransfer.files]); };
    const q = $('#ar-q', c); q.oninput = () => { _arQ = q.value; clearTimeout(window._arq); window._arq = setTimeout(() => { adminIr('archivos'); const n = $('#ar-q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
  } });

function detalleArchivo(id){
  const a = Drive.meta(id); if (!a) return; const usos = usosDeArchivo(id), ahorro = a.tamWeb ? Math.round((1 - a.tamWeb / a.tam) * 100) : 0;
  const p = $('#ad-editor');
  p.innerHTML = `<div class="ae-cab"><h3>${esc(a.nombre)}</h3><button class="ae-x" onclick="adminCerrarEditor()">${icono('cerrar')}</button></div>
    <div class="ae-form ar-det">${/^image\//.test(a.tipo) ? `<img class="ar-det-img" src="drive:${a.id}" alt="">` : /^video\//.test(a.tipo) ? `<video class="ar-det-img" src="drive:${a.id}" controls playsinline></video>` : ''}
      <div class="bj-datos"><div><span>Carpeta</span><b>${esc(CARPETA_RAIZ + ' / ' + a.carpeta)}</b></div><div><span>Subido</span><b>${fechaHoraCorta(a.fecha)}</b></div>
        <div><span>Original</span><b>${tamano(a.tam)}${a.ancho ? '' : ''}</b></div>${a.tamWeb ? `<div><span>Copia para la web</span><b>${tamano(a.tamWeb)} · ${ahorro}% más liviana${a.ancho ? ' · ' + a.ancho + ' × ' + a.alto + ' px' : ''}</b></div>` : ''}
        <div><span>Se usa en</span><b>${usos.length ? usos.map(esc).join('<br>') : 'Ningún lugar todavía'}</b></div></div></div>
    <div class="ae-pie"><button class="btn btn-borde btn-chico" onclick="bajarOriginal('${a.id}')">${icono('descargar')} Descargar original</button>
      <button class="btn btn-borde btn-chico rojo-txt" onclick="borrarArchivo('${a.id}')">${icono('basura')} Borrar</button></div>`;
  p.classList.add('abierto');
}
async function bajarOriginal(id){ const r = await Drive.original(id); if (!r) return; const a = document.createElement('a'); a.href = URL.createObjectURL(r.original); a.download = r.nombre; document.body.appendChild(a); a.click(); a.remove(); }
async function borrarArchivo(id){
  const u = usosDeArchivo(id);
  if (!confirm(u.length ? `Este archivo se usa en: ${u.join(', ')}. Si lo borrás, ahí va a quedar un hueco. ¿Borrarlo igual?` : '¿Borrar este archivo del Drive?')) return;
  await Drive.borrar(id); adminCerrarEditor(); adminIr('archivos'); aviso('Archivo borrado.');
}

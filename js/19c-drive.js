/* =====================================================================
   ARCHIVOS · GOOGLE DRIVE DEL TALLER (simulado en la demo, versión 3)
   Cómo funciona en la versión real: cada foto o video que se sube queda
   ENTERO en el Drive del taller (carpeta «Drones del Pampa · Página web»),
   y la página arma sola una COPIA LIVIANA de cada foto, que es la que ve
   la gente (carga rápido y no depende de los límites de Google).
   Los videos largos conviene subirlos a YouTube como «no listado».
   En la demo todo queda en este navegador (IndexedDB) y se usa como
   «drive:ID» dentro del contenido.
   ===================================================================== */
const CARPETA_RAIZ = 'Drones del Pampa · Página web';
const Drive = (() => {
  let db = null; const urls = new Map(); const metas = new Map();
  const abrir = () => db ? Promise.resolve(db) : new Promise((ok, mal) => {
    const r = indexedDB.open('dp_drive_v3', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('archivos', { keyPath: 'id' });
    r.onsuccess = () => { db = r.result; ok(db); }; r.onerror = () => mal(r.error);
  });
  const tx2 = (modo) => abrir().then(d => d.transaction('archivos', modo).objectStore('archivos'));
  const pedir = req => new Promise((ok, mal) => { req.onsuccess = () => ok(req.result); req.onerror = () => mal(req.error); });

  async function todos(){ try { return await pedir((await tx2('readonly')).getAll()); } catch (e) { return []; } }
  async function precargar(){
    for (const a of await todos()) registrar(a);
    resolver(document);
  }
  function registrar(a){
    metas.set(a.id, { id: a.id, nombre: a.nombre, tipo: a.tipo, carpeta: a.carpeta, tam: a.tam, tamWeb: a.tamWeb, fecha: a.fecha, ancho: a.ancho, alto: a.alto });
    const b = a.web || a.original; if (b && !urls.has(a.id)) urls.set(a.id, URL.createObjectURL(b));
  }
  const url = ref => { const id = String(ref || '').replace(/^drive:/, ''); return urls.get(id) || ''; };

  // Copia liviana de una foto: hasta 1600 px, WebP (o JPEG si el navegador no sabe hacer WebP)
  function copiaWeb(file){
    return new Promise(ok => {
      const img = new Image(), u = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u);
        const fin = (b, tipo) => ok({ blob: b, ancho: c.width, alto: c.height, tipo });
        c.toBlob(b => b && b.type === 'image/webp' ? fin(b, 'image/webp') : c.toBlob(j => fin(j, 'image/jpeg'), 'image/jpeg', .84), 'image/webp', .84);
      };
      img.onerror = () => { URL.revokeObjectURL(u); ok(null); };
      img.src = u;
    });
  }
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function carpetaPara(file, base){
    const f = new Date(), sub = f.getFullYear() + '/' + MESES[f.getMonth()];
    if (base) return base;
    return (/^video\//.test(file.type) ? 'Videos/' : /^image\//.test(file.type) ? 'Imágenes/' : 'Documentos/') + sub;
  }
  async function subir(file, carpeta){
    const id = 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const reg = { id, nombre: file.name || 'archivo', tipo: file.type || 'application/octet-stream', carpeta: carpetaPara(file, carpeta), tam: file.size, fecha: new Date().toISOString(), original: file, web: null, tamWeb: 0 };
    if (/^image\/(jpeg|png|webp|gif|bmp)/.test(file.type)) { const w = await copiaWeb(file); if (w && w.blob && w.blob.size < file.size) { reg.web = w.blob; reg.tamWeb = w.blob.size; } if (w) { reg.ancho = w.ancho; reg.alto = w.alto; } }
    await pedir((await tx2('readwrite')).put(reg));
    registrar(reg);
    return 'drive:' + id;
  }
  async function guardarTexto(nombre, texto, carpeta){
    const f = new File([texto], nombre, { type: 'application/json' }); return subir(f, carpeta);
  }
  async function borrar(id){ await pedir((await tx2('readwrite')).delete(id)); const u = urls.get(id); if (u) URL.revokeObjectURL(u); urls.delete(id); metas.delete(id); }
  async function original(id){ try { return await pedir((await tx2('readonly')).get(id)); } catch (e) { return null; } }
  async function respaldoDePublicacion(){
    const f = new Date(), n = 'pagina-' + f.toISOString().slice(0, 16).replace('T', '_').replace(':', '-') + '.json';
    try { await guardarTexto(n, JSON.stringify(Datos.get()), 'Respaldos'); } catch (e) {}
  }

  // Cambia los «drive:ID» por la foto de verdad (en todo lo que se dibuja)
  function resolver(root){
    $$('[src^="drive:"], [poster^="drive:"]', root || document).forEach(el => {
      for (const at of ['src', 'poster']) { const v = el.getAttribute(at); if (v && v.startsWith('drive:')) { const u = url(v); if (u) el.setAttribute(at, u); else if (at === 'src') { el.removeAttribute('src'); el.classList.add('sin-archivo'); } } }
    });
  }
  new MutationObserver(ms => { for (const m of ms) {
    if (m.type === 'attributes') { const v = m.target.getAttribute(m.attributeName); if (v && v.startsWith('drive:')) resolver(m.target.parentNode || document); }
    else m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.matches('[src^="drive:"],[poster^="drive:"]')) resolver(n.parentNode); else if (n.querySelector('[src^="drive:"],[poster^="drive:"]')) resolver(n); } });
  } }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'poster'] });

  return { precargar, subir, borrar, original, url, lista: () => [...metas.values()].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')),
    meta: id => metas.get(String(id).replace(/^drive:/, '')), respaldoDePublicacion, guardarTexto, resolver };
})();
Drive.precargar();

// Las fotos que se suben desde los formularios de la v2 también van al Drive (antes quedaban pegadas en los datos)
const subirFoto = (archivo) => Drive.subir(archivo);

/* ---------- Elegir una foto o un video: subir, del Drive, de la página o un link ---------- */
const MEDIOS_PAGINA = (() => { const s = new Set(); JSON.stringify(CONTENIDO_INICIAL).replace(/"(media\/[^"]+\.(?:jpe?g|png|webp|svg|mp4))"/g, (m, u) => s.add(u)); return [...s]; })();
function elegirArchivo(opc){
  opc = opc || {}; const tipo = opc.tipo || 'imagen', esVideo = tipo === 'video';
  return new Promise(fin => {
    let elegidos = [], pest = 'drive', listo = false;
    const terminar = v => { if (listo) return; listo = true; fin(v); };
    const m = abrirModal(`<div class="es-modal ea"><h3>${icono(esVideo ? 'video' : 'imagen')} ${esVideo ? 'Elegir un video' : opc.varias ? 'Elegir fotos' : 'Elegir una foto'}</h3>
      <div class="ea-tabs">${[['subir', 'subir', 'Subir'], ['drive', 'nube', 'Del Drive'], ['pagina', 'imagen', 'De la página'], ['link', 'enlace', 'Pegar un link']].map(([k, ic, n]) => `<button data-pest="${k}">${icono(ic)}${n}</button>`).join('')}</div>
      <div class="ea-cuerpo" id="ea-cuerpo"></div>
      <div class="es-modal-pie"><span class="ea-cuenta" id="ea-cuenta"></span><button class="btn btn-borde btn-chico" data-cerrar>Cancelar</button><button class="btn btn-verde btn-chico" id="ea-ok" disabled>${icono('check')} Usar</button></div></div>`,
      { cls: 'grande', alCerrar: () => terminar(null) });
    const acepta = a => esVideo ? /^video\//.test(a.tipo) : /^image\//.test(a.tipo);
    const marcar = (ref) => { if (opc.varias) elegidos = elegidos.includes(ref) ? elegidos.filter(x => x !== ref) : [...elegidos, ref]; else elegidos = [ref];
      $$('[data-ref]', m).forEach(x => x.classList.toggle('act', elegidos.includes(x.dataset.ref))); $('#ea-ok').disabled = !elegidos.length;
      $('#ea-cuenta').textContent = elegidos.length > 1 ? elegidos.length + ' elegidas' : ''; };
    const miniatura = (ref, nombre, extra) => `<button class="ea-item" data-ref="${esc(ref)}">${esVideo ? `<video src="${esc(ref)}" muted preload="metadata"></video>` : `<img src="${esc(ref)}" alt="" loading="lazy">`}<span>${esc(nombre)}</span>${extra || ''}</button>`;
    const pintar = () => {
      $$('[data-pest]', m).forEach(b => b.classList.toggle('act', b.dataset.pest === pest));
      const c = $('#ea-cuerpo');
      if (pest === 'subir') c.innerHTML = `<label class="ea-soltar" id="ea-soltar">${icono('nube')}<b>Tocá para elegir ${esVideo ? 'un video' : 'fotos'} de la compu o del celular</b><span>o arrastralas acá. Se guardan enteras en el Drive del taller y la página usa una copia liviana.</span>
        <input type="file" accept="${esVideo ? 'video/*' : 'image/*'}" ${opc.varias ? 'multiple' : ''} hidden></label><div class="ea-subiendo" id="ea-subiendo"></div>`;
      else if (pest === 'drive') { const l = Drive.lista().filter(acepta);
        c.innerHTML = l.length ? `<div class="ea-grilla">${l.map(a => miniatura('drive:' + a.id, a.nombre, `<small>${tamano(a.tamWeb || a.tam)}</small>`)).join('')}</div>` : `<p class="ad-vacio">Todavía no hay ${esVideo ? 'videos' : 'fotos'} en el Drive. Usá «Subir».</p>`; }
      else if (pest === 'pagina') { const l = MEDIOS_PAGINA.filter(u => esVideo ? /\.mp4$/.test(u) : !/\.mp4$/.test(u));
        c.innerHTML = `<div class="ea-grilla">${l.map(u => miniatura(u, u.split('/').pop())).join('')}</div>`; }
      else c.innerHTML = `<div class="campo"><label>Link ${esVideo ? 'del video (YouTube, Instagram o un .mp4)' : 'de la imagen'}</label><input id="ea-link" placeholder="https://…"></div>`;
      $$('[data-ref]', c).forEach(b => { b.classList.toggle('act', elegidos.includes(b.dataset.ref)); b.onclick = () => marcar(b.dataset.ref); b.ondblclick = () => { marcar(b.dataset.ref); $('#ea-ok').click(); }; });
      const inp = $('input[type=file]', c);
      if (inp) { const subirLista = async files => { const s = $('#ea-subiendo'); const refs = [];
          for (const f of files) { if (esVideo && f.size > 80 * 1048576) { aviso('Ese video pesa mucho: subilo a YouTube como «no listado» y pegá el link.', 'error'); continue; }
            s.innerHTML = `<span class="ea-barra"><i></i></span>Subiendo ${esc(f.name)}…`; refs.push(await Drive.subir(f)); }
          s.innerHTML = ''; if (!refs.length) return; aviso(refs.length > 1 ? refs.length + ' archivos subidos al Drive.' : 'Subido al Drive del taller.');
          pest = 'drive'; pintar(); refs.forEach(r => { if (!elegidos.includes(r)) marcar(r); }); };
        inp.onchange = () => subirLista([...inp.files]);
        const z = $('#ea-soltar'); z.ondragover = e => { e.preventDefault(); z.classList.add('sobre'); }; z.ondragleave = () => z.classList.remove('sobre');
        z.ondrop = e => { e.preventDefault(); z.classList.remove('sobre'); subirLista([...e.dataTransfer.files].filter(f => esVideo ? /^video\//.test(f.type) : /^image\//.test(f.type))); }; }
      const lk = $('#ea-link'); if (lk) lk.oninput = () => { elegidos = lk.value.trim() ? [lk.value.trim()] : []; $('#ea-ok').disabled = !elegidos.length; };
    };
    $$('[data-pest]', m).forEach(b => b.onclick = () => { pest = b.dataset.pest; pintar(); });
    $('[data-cerrar]', m).onclick = () => cerrarModal();
    $('#ea-ok').onclick = () => { const v = opc.varias ? elegidos.slice() : elegidos[0]; terminar(v); cerrarModal(); };
    if (!Drive.lista().some(acepta)) pest = 'subir';
    pintar();
  });
}

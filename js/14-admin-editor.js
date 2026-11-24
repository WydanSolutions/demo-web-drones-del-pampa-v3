/* =====================================================================
   PANEL › EDITOR DE LISTAS: drones, productos, categorías, cursos,
   promociones, pasos del servicio, números de portada, cinta e Instagram.
   Cada lista tiene su «esquema» (qué campos tiene y de qué tipo) y el
   mismo editor sirve para todas: agregar, editar, duplicar, ordenar,
   ocultar y borrar. Los textos van en español y portugués.
   ===================================================================== */
const ICONOS_CAT = ['dron', 'kit', 'bateria', 'helice', 'motor', 'gota', 'granos', 'brazo', 'radar', 'generador', 'control', 'escudo', 'usuarios', 'estrella', 'calendario', 'telefono'];
const ESQUEMAS = {
  drones: { titulo: 'Drones', nuevo: () => ({ id: Datos.nuevoId('dron'), nombre: 'Nuevo dron', etiqueta: {}, lema: {}, desc: {}, precio: 0, precioAntes: 0, imagenes: [], galeria: [], video: '', specs: [], destacado: false, visible: true }),
    resumen: x => ({ img: x.imagenes[0], tit: 'DJI ' + x.nombre, sub: tx(x.etiqueta), precio: x.precio }),
    campos: [['nombre', 'Nombre del modelo', 'texto'], ['etiqueta', 'Etiqueta corta (ej. «Nuevo»)', 'i18n'], ['lema', 'Frase principal', 'i18n'], ['desc', 'Descripción', 'i18narea'],
      ['precio', 'Precio en dólares (0 = «Consultar precio»)', 'usd'], ['precioAntes', 'Precio anterior tachado (opcional)', 'usd'],
      ['imagenes', 'Fotos del dron sin fondo (la 1ª es la principal; las demás se ven al girarlo)', 'imgs'], ['galeria', 'Galería de fotos de la ficha', 'imgs'],
      ['video', 'Video de la ficha (ruta o link a un .mp4)', 'texto'], ['specs', 'Datos técnicos (número, unidad y qué es)', 'specs'],
      ['destacado', 'Destacado en la tienda', 'check'], ['visible', 'Se ve en la página', 'check']] },
  productos: { titulo: 'Productos de la tienda', nuevo: () => ({ id: Datos.nuevoId('prod'), codigo: '', cat: 'helices', nombre: { es: 'Nuevo producto' }, precio: 0, precioAntes: 0, stock: 0, modelos: [], desc: {}, foto: '', destacado: false, visible: true }),
    resumen: x => ({ img: x.foto, ico: (catDe(x.cat) || {}).icono, tit: tx(x.nombre), sub: x.codigo + ' · ' + tx(catDe(x.cat).n) + ' · stock ' + (x.stock || 0), precio: x.precio }),
    filtro: x => tx(x.nombre) + ' ' + x.codigo + ' ' + (x.modelos || []).join(' '),
    campos: [['nombre', 'Nombre', 'i18n'], ['codigo', 'Código', 'texto'], ['cat', 'Categoría', 'categoria'], ['precio', 'Precio en dólares (0 = «Consultar precio»)', 'usd'],
      ['precioAntes', 'Precio anterior tachado (opcional)', 'usd'], ['stock', 'Unidades en stock (0 = «A pedido»)', 'numero'], ['modelos', 'Modelos compatibles (separados por coma)', 'etiquetas'],
      ['desc', 'Descripción', 'i18narea'], ['foto', 'Foto (opcional: sin foto se ve el ícono de la categoría)', 'img'], ['destacado', 'Destacado (sale primero)', 'check'], ['visible', 'Se ve en la página', 'check']] },
  categorias: { titulo: 'Categorías de la tienda', nuevo: () => ({ id: Datos.nuevoId('cat'), icono: 'kit', n: { es: 'Nueva categoría' } }),
    resumen: x => ({ ico: x.icono, tit: tx(x.n), sub: Datos.get().productos.filter(p => p.cat === x.id).length + ' productos' }),
    campos: [['n', 'Nombre', 'i18n'], ['icono', 'Ícono', 'icono']] },
  cursos: { titulo: 'Cursos', nuevo: () => ({ id: Datos.nuevoId('curso'), titulo: { es: 'Nuevo curso' }, bajada: {}, fecha: new Date(Date.now() + 864e6).toISOString().slice(0, 10), duracion: {}, modalidad: {}, lugar: {}, nivel: {}, cupos: 10, ocupados: 0, precio: 0, imagen: 'media/fotos/entrenamiento.jpg', temario: [], incluye: [], requisitos: [], abierto: true, visible: true }),
    resumen: x => ({ img: x.imagen, tit: tx(x.titulo), sub: (x.fecha || '') + ' · ' + libresDe(x) + ' lugares libres · ' + inscriptosDe(x.id) + ' inscriptos por la web', precio: x.precio }),
    campos: [['titulo', 'Nombre del curso', 'i18n'], ['bajada', 'Resumen', 'i18narea'], ['fecha', 'Fecha de inicio', 'fecha'], ['duracion', 'Duración', 'i18n'], ['modalidad', 'Modalidad', 'i18n'],
      ['lugar', 'Lugar', 'i18n'], ['nivel', 'Nivel', 'i18n'], ['cupos', 'Cupos totales', 'numero'], ['ocupados', 'Lugares ya ocupados por fuera de la web', 'numero'], ['precio', 'Precio en dólares', 'usd'],
      ['imagen', 'Foto', 'img'], ['temario', 'Qué van a aprender', 'lista'], ['incluye', 'Qué incluye', 'lista'], ['requisitos', 'Requisitos', 'lista'],
      ['abierto', 'Inscripciones abiertas', 'check'], ['visible', 'Se ve en la página', 'check']] },
  promos: { titulo: 'Promociones', nuevo: () => ({ id: Datos.nuevoId('promo'), titulo: { es: 'Nueva promoción' }, texto: {}, imagen: '', precio: 0, precioAntes: 0, hasta: '', visible: true }),
    resumen: x => ({ img: x.imagen, tit: tx(x.titulo), sub: x.hasta ? 'Hasta ' + x.hasta : 'Sin fecha de fin', precio: x.precio }),
    campos: [['titulo', 'Título', 'i18n'], ['texto', 'Texto', 'i18narea'], ['imagen', 'Imagen', 'img'], ['precio', 'Precio promocional en dólares (opcional)', 'usd'],
      ['precioAntes', 'Precio anterior (opcional)', 'usd'], ['hasta', 'Válida hasta (opcional)', 'fecha'], ['visible', 'Se ve en la página', 'check']] },
  servicio: { titulo: 'Pasos del servicio técnico', nuevo: () => ({ t: { es: 'Nuevo paso' }, d: {} }), resumen: x => ({ ico: 'check', tit: tx(x.t), sub: tx(x.d) }),
    campos: [['t', 'Paso', 'i18n'], ['d', 'Explicación', 'i18narea']] },
  valores: { titulo: 'Lo que nos destaca (inicio y Nosotros)', nuevo: () => ({ icono: 'escudo', t: { es: 'Nuevo' }, d: {} }), resumen: x => ({ ico: x.icono, tit: tx(x.t), sub: tx(x.d) }),
    campos: [['t', 'Título', 'i18n'], ['d', 'Texto', 'i18narea'], ['icono', 'Ícono', 'icono']] },
  equipo: { titulo: 'El equipo (Nosotros)', nuevo: () => ({ icono: 'usuarios', t: { es: 'Nueva área' }, n: '', d: {} }), resumen: x => ({ ico: x.icono, tit: tx(x.t), sub: x.n || tx(x.d) }),
    campos: [['t', 'Área o tarea', 'i18n'], ['n', 'Nombre (opcional: se ve en la página)', 'texto'], ['d', 'Qué hace', 'i18narea'], ['icono', 'Ícono', 'icono']] },
  faq: { titulo: 'Preguntas frecuentes (servicio técnico)', nuevo: () => ({ p: { es: 'Nueva pregunta' }, r: {} }), resumen: x => ({ ico: 'mas', tit: tx(x.p), sub: tx(x.r) }),
    campos: [['p', 'Pregunta', 'i18n'], ['r', 'Respuesta', 'i18narea']] },
  tiposService: { titulo: 'Tipos de service (para pedir turno)', nuevo: () => ({ es: 'Nuevo tipo', pt: '' }), resumen: x => ({ ico: 'motor', tit: tx(x), sub: x.pt || '' }),
    campos: [['es', 'En español', 'texto'], ['pt', 'En portugués', 'texto']] },
  instagram: { titulo: 'Publicaciones de Instagram', nuevo: () => ({ img: '', url: Datos.get().config.instagram, video: '' }), resumen: x => ({ img: x.img, tit: x.url.replace(/^https?:\/\/(www\.)?/, ''), sub: x.video ? 'Con video' : 'Foto' }),
    campos: [['img', 'Imagen', 'img'], ['url', 'Link de la publicación', 'texto'], ['video', 'Video que se reproduce al pasar el mouse (opcional)', 'texto']] }
};

let _ed = { col: null, i: -1, borrador: null, q: '' };

function adminLista(col){
  const E = ESQUEMAS[col], arr = Datos.get()[col];
  const q = (_ed.col === col ? _ed.q : '').toLowerCase();
  const filas = arr.map((x, i) => ({ x, i })).filter(({ x }) => !q || (E.filtro ? E.filtro(x) : JSON.stringify(x)).toLowerCase().includes(q));
  return `<div class="ad-cab"><div><h2>${E.titulo}</h2><p>${arr.length} en total. Tocá uno para editarlo; los cambios se ven al instante en la página.</p></div>
      <button class="btn btn-verde btn-chico" onclick="adminNuevo('${col}')">${icono('mas')} Agregar</button></div>
    ${arr.length > 8 ? `<label class="ad-buscar">${icono('buscar')}<input placeholder="Buscar…" value="${esc(q)}" oninput="_ed.col='${col}';_ed.q=this.value;adminRefrescarLista('${col}')"></label>` : ''}
    <div class="ad-lista" id="ad-lista">${filas.map(({ x, i }) => filaAdmin(col, x, i)).join('') || '<p class="ad-vacio">No hay resultados.</p>'}</div>`;
}
function adminRefrescarLista(col){ const l = $('#ad-lista'); if (!l) return; const tmp = document.createElement('div'); tmp.innerHTML = adminLista(col); l.replaceWith($('#ad-lista', tmp)); }

function filaAdmin(col, x, i){
  const r = ESQUEMAS[col].resumen(x), oculto = x.visible === false;
  return `<div class="ad-fila ${oculto ? 'oculta' : ''}">
    <button class="ad-fila-main" onclick="adminEditar('${col}',${i})">
      <span class="ad-mini">${r.img ? `<img src="${esc(r.img)}" alt="">` : icono(r.ico || 'kit')}</span>
      <span class="ad-fila-txt"><b>${esc(r.tit || '(sin nombre)')}</b><small>${esc(r.sub || '')}</small></span>
      ${r.precio !== undefined ? `<span class="ad-precio">${r.precio ? 'USD ' + usd(r.precio) : 'Consultar'}</span>` : ''}
      ${oculto ? '<span class="chip gris">Oculto</span>' : ''}</button>
    <div class="ad-fila-acc">
      <button title="Subir" onclick="adminMover('${col}',${i},-1)">↑</button><button title="Bajar" onclick="adminMover('${col}',${i},1)">↓</button>
      <button title="Duplicar" onclick="adminDuplicar('${col}',${i})">⧉</button>
      <button title="Borrar" class="rojo" onclick="adminBorrar('${col}',${i})">${icono('basura')}</button></div></div>`;
}

function adminMover(col, i, d){ const a = Datos.get()[col], j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; adminGuardado(col); }
function adminDuplicar(col, i){
  const a = Datos.get()[col], c = JSON.parse(JSON.stringify(a[i]));
  if (c.id) c.id = Datos.nuevoId(col.slice(0, 4));
  a.splice(i + 1, 0, c); adminGuardado(col); adminEditar(col, i + 1);
}
function adminBorrar(col, i){
  const r = ESQUEMAS[col].resumen(Datos.get()[col][i]);
  if (!confirm('¿Borrar «' + (r.tit || '') + '»? No se puede deshacer (salvo restaurando un respaldo).')) return;
  Datos.get()[col].splice(i, 1); adminGuardado(col);
}
function adminNuevo(col){ const a = Datos.get()[col]; a.unshift(ESQUEMAS[col].nuevo()); Datos.guardar(); adminEditar(col, 0, true); }
function adminGuardado(col){ Datos.guardar(); dibujarTodo(true); adminRefrescarLista(col); }

/* --- Formulario de edición (se abre a la derecha) --- */
function adminEditar(col, i, esNuevo){
  const E = ESQUEMAS[col];
  _ed = { ..._ed, col, i, borrador: JSON.parse(JSON.stringify(Datos.get()[col][i])), esNuevo };
  const p = $('#ad-editor');
  p.innerHTML = `<div class="ae-cab"><h3>${esNuevo ? 'Nuevo' : 'Editar'} · ${E.titulo}</h3><button class="ae-x" onclick="adminCerrarEditor()">${icono('cerrar')}</button></div>
    <form class="ae-form" onsubmit="event.preventDefault();adminGuardarEditor()">${E.campos.map(([k, et, tipo]) => campoAdmin(k, et, tipo, _ed.borrador[k])).join('')}
      <div class="ae-pie"><button type="button" class="btn btn-borde btn-chico" onclick="adminCerrarEditor()">Cancelar</button><button class="btn btn-verde btn-chico" type="submit">${icono('check')} Guardar cambios</button></div></form>`;
  p.classList.add('abierto');
  activarCamposAdmin(p);
}
function adminCerrarEditor(){ $('#ad-editor').classList.remove('abierto'); }
function adminGuardarEditor(){
  const { col, i, borrador } = _ed;
  Datos.get()[col][i] = borrador;
  if (Datos.guardar()) { adminCerrarEditor(); dibujarTodo(true); adminRefrescarLista(col); aviso('Guardado en el borrador. Tocá Publicar para que lo vea la gente.'); }
}

// Pone un valor dentro del borrador siguiendo una «ruta» (ej. specs.2.l.pt)
function ponerEn(obj, ruta, valor){
  const p = ruta.split('.'); let o = obj;
  for (let k = 0; k < p.length - 1; k++) { if (o[p[k]] == null || typeof o[p[k]] !== 'object') o[p[k]] = /^\d+$/.test(p[k + 1]) ? [] : {}; o = o[p[k]]; }
  o[p[p.length - 1]] = valor;
}
const leerNumero = (s) => { s = String(s).trim().replace(/\s/g, ''); if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.'); else s = s.replace(/[.,](?=\d{3}(\D|$))/g, ''); return Number(s) || 0; };

function campoAdmin(k, et, tipo, v){
  const id = 'ae-' + k;
  const i18 = (ruta, val, area) => `<div class="ae-i18n">${['es', 'pt'].map(l => `<label class="ae-idioma"><span>${l.toUpperCase()}</span>
      ${area ? `<textarea rows="3" data-ruta="${ruta}.${l}">${esc((val || {})[l] || '')}</textarea>` : `<input data-ruta="${ruta}.${l}" value="${esc((val || {})[l] || '')}" ${l === 'pt' ? 'placeholder="(si queda vacío se muestra el español)"' : ''}>`}</label>`).join('')}</div>`;
  let h = '';
  switch (tipo) {
    case 'texto': h = `<input id="${id}" data-ruta="${k}" value="${esc(v || '')}">`; break;
    case 'numero': h = `<input id="${id}" data-ruta="${k}" data-num inputmode="decimal" value="${esc(v ?? 0)}">`; break;
    case 'usd': h = `<div class="ae-usd"><span>USD</span><input id="${id}" data-ruta="${k}" data-num inputmode="decimal" value="${v ? usd(v) : ''}" placeholder="0"></div>`; break;
    case 'fecha': h = `<input id="${id}" type="date" data-ruta="${k}" value="${esc(v || '')}">`; break;
    case 'check': return `<label class="ae-check"><input type="checkbox" data-ruta="${k}" data-check ${v !== false && v ? 'checked' : ''}><span></span>${et}</label>`;
    case 'portada': h = `<select data-ruta="${k}">${PORTADAS.map(([id, n]) => `<option value="${id}" ${id === v ? 'selected' : ''}>${n}</option>`).join('')}</select>`; break;
    case 'i18n': h = i18(k, v); break;
    case 'i18narea': h = i18(k, v, true); break;
    case 'categoria': h = `<select data-ruta="${k}">${Datos.get().categorias.map(c => `<option value="${c.id}" ${c.id === v ? 'selected' : ''}>${esc(tx(c.n))}</option>`).join('')}</select>`; break;
    case 'icono': h = `<div class="ae-iconos">${ICONOS_CAT.map(n => `<label><input type="radio" name="ico" data-ruta="${k}" value="${n}" ${n === v ? 'checked' : ''}>${icono(n)}</label>`).join('')}</div>`; break;
    case 'etiquetas': h = `<input data-ruta="${k}" data-lista value="${esc((v || []).join(', '))}" placeholder="T100, T70P">`; break;
    case 'img': h = `<div class="ae-img" data-k="${k}">${v ? `<img src="${esc(v)}" alt="">` : '<span>Sin imagen</span>'}
        <div><label class="btn btn-borde btn-chico">${icono('subir')} Subir foto<input type="file" accept="image/*" hidden data-subir="${k}"></label>
        <input data-ruta="${k}" value="${esc(v && !v.startsWith('data:') ? v : '')}" placeholder="o pegá una ruta / link"> ${v ? `<button type="button" class="ae-quitar" data-quitar="${k}">Quitar</button>` : ''}</div></div>`; break;
    case 'imgs': h = `<div class="ae-imgs" data-k="${k}">${(v || []).map((src, n) => `<div class="ae-th"><img src="${esc(src)}" alt=""><div>
        <button type="button" data-mover="${k}.${n}.-1">←</button><button type="button" data-mover="${k}.${n}.1">→</button><button type="button" data-sacar="${k}.${n}">✕</button></div></div>`).join('')}
        <label class="ae-th ae-th-mas">${icono('mas')}<span>Subir</span><input type="file" accept="image/*" multiple hidden data-subir-varias="${k}"></label></div>`; break;
    case 'lista': h = `<div class="ae-filas">${(v || []).map((x, n) => `<div class="ae-fila">${i18(k + '.' + n, x)}<button type="button" class="ae-quitar" data-sacar="${k}.${n}">✕</button></div>`).join('')}
        <button type="button" class="btn btn-borde btn-chico" data-agregar="${k}">${icono('mas')} Agregar renglón</button></div>`; break;
    case 'specs': h = `<div class="ae-filas">${(v || []).map((s, n) => `<div class="ae-fila ae-spec"><input data-ruta="${k}.${n}.v" value="${esc(tx(s.v))}" placeholder="100">
        <input data-ruta="${k}.${n}.u" value="${esc(tx(s.u))}" placeholder="L">${i18(k + '.' + n + '.l', s.l)}<button type="button" class="ae-quitar" data-sacar="${k}.${n}">✕</button></div>`).join('')}
        <button type="button" class="btn btn-borde btn-chico" data-agregar="${k}">${icono('mas')} Agregar dato</button></div>`; break;
  }
  return `<div class="ae-campo" data-campo="${k}"><label for="${id}">${et}</label>${h}</div>`;
}

function activarCamposAdmin(p){
  const B = () => _ed.borrador;
  const redibujar = (k) => { const E = ESQUEMAS[_ed.col], c = E.campos.find(z => z[0] === k); const el = $(`[data-campo="${k}"]`, p); el.outerHTML = campoAdmin(c[0], c[1], c[2], B()[k]); activarCamposAdmin(p); };
  $$('[data-ruta]', p).forEach(inp => { if (inp.dataset.on) return; inp.dataset.on = 1;
    inp.addEventListener(inp.type === 'radio' || inp.type === 'checkbox' || inp.tagName === 'SELECT' ? 'change' : 'input', () => {
      let val = inp.value;
      if (inp.dataset.check !== undefined) val = inp.checked;
      else if (inp.dataset.num !== undefined) val = leerNumero(val);
      else if (inp.dataset.lista !== undefined) val = val.split(',').map(s => s.trim()).filter(Boolean);
      ponerEn(B(), inp.dataset.ruta, val);
      const caja = inp.closest('.ae-img'); if (caja && val) { const im = $('img', caja) || caja.insertBefore(document.createElement('img'), caja.firstChild); im.src = val; const s = $(':scope > span', caja); if (s) s.remove(); }
    }); });
  $$('[data-subir]', p).forEach(f => { if (f.dataset.on) return; f.dataset.on = 1; f.onchange = async () => { if (!f.files[0]) return; B()[f.dataset.subir] = await subirFoto(f.files[0]); redibujar(f.dataset.subir); }; });
  $$('[data-subir-varias]', p).forEach(f => { if (f.dataset.on) return; f.dataset.on = 1; f.onchange = async () => { const k = f.dataset.subirVarias; B()[k] = B()[k] || []; for (const a of f.files) B()[k].push(await subirFoto(a)); redibujar(k); }; });
  $$('[data-quitar]', p).forEach(b => b.onclick = () => { B()[b.dataset.quitar] = ''; redibujar(b.dataset.quitar); });
  $$('[data-sacar]', p).forEach(b => b.onclick = () => { const [k, n] = b.dataset.sacar.split('.'); B()[k].splice(+n, 1); redibujar(k); });
  $$('[data-mover]', p).forEach(b => b.onclick = () => { const [k, n, d] = b.dataset.mover.split('.'); const a = B()[k], i = +n, j = i + +d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; redibujar(k); });
  $$('[data-agregar]', p).forEach(b => b.onclick = () => { const k = b.dataset.agregar; B()[k] = B()[k] || []; B()[k].push(k === 'specs' ? { v: '', u: '', l: { es: '', pt: '' } } : { es: '', pt: '' }); redibujar(k); });
}

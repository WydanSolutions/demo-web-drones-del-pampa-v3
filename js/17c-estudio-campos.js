/* =====================================================================
   ESTUDIO · CAMPOS (versión 3): los formularios con que se editan los
   bloques, las novedades y el link en la bio. Cada campo escribe en una
   «ruta» dentro de un objeto (ej. items.2.t.es) y avisa el cambio.
   camposEs(lista, objeto)  → el HTML
   activarCamposEs(caja, objeto, alCambiar(estructural), redibujar)
   ===================================================================== */
function leerEn(obj, ruta){ return String(ruta).split('.').reduce((o, k) => o == null ? undefined : o[k], obj); }

function camposEs(lista, obj, pre){
  return lista.map(([k, et, tipo, op]) => campoEs((pre ? pre + '.' : '') + k, et, tipo, op, leerEn(obj, (pre ? pre + '.' : '') + k))).join('');
}

function campoEs(r, et, tipo, op, v){
  const i18 = (area) => `<div class="ae-i18n">${['es', 'pt'].map(l => `<label class="ae-idioma"><span>${l.toUpperCase()}</span>${area
    ? `<textarea rows="4" data-r="${r}.${l}" ${l === 'pt' ? 'placeholder="(vacío = se muestra el español)"' : ''}>${esc((v || {})[l] || '')}</textarea>`
    : `<input data-r="${r}.${l}" value="${esc((v || {})[l] || '')}" ${l === 'pt' ? 'placeholder="(vacío = el español)"' : ''}>`}</label>`).join('')}</div>`;
  let h = '';
  switch (tipo) {
    case 'texto': h = `<input data-r="${r}" value="${esc(v || '')}">`; break;
    case 'numero': h = `<input data-r="${r}" data-k="num" inputmode="decimal" value="${esc(v ?? '')}">`; break;
    case 'usd': h = `<div class="ae-usd"><span>USD</span><input data-r="${r}" data-k="num" inputmode="decimal" value="${v ? usd(v) : ''}" placeholder="0"></div>`; break;
    case 'fecha': h = `<input type="date" data-r="${r}" value="${esc(v || '')}">`; break;
    case 'fechahora': h = `<input type="datetime-local" data-r="${r}" value="${esc(v || '')}">`; break;
    case 'check': return `<label class="ae-check ce"><input type="checkbox" data-r="${r}" data-k="check" ${v ? 'checked' : ''}><span></span>${esc(et)}</label>`;
    case 'select': h = `<select data-r="${r}">${op.map(([val, n]) => `<option value="${esc(val)}" ${String(v ?? '') === String(val) ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>`; break;
    case 'i18n': h = i18(false); break;
    case 'md': h = `<div class="ce-md"><div class="ce-md-barra"><button type="button" data-md="**" title="Negrita"><b>N</b></button><button type="button" data-md="*" title="Cursiva"><i>C</i></button>
      <button type="button" data-md="link" title="Link">${icono('enlace')}</button><button type="button" data-md="lista" title="Lista">${icono('menu')}</button><small>Línea en blanco = párrafo nuevo</small></div>${i18(true)}</div>`; break;
    case 'img': h = `<div class="ce-img">${v ? `<img src="${esc(v)}" alt="">` : `<span>${icono('imagen')}</span>`}<div>
      <button type="button" class="btn btn-borde btn-chico" data-elegir="${r}" data-que="imagen">${icono('nube')} ${v ? 'Cambiar' : 'Elegir foto'}</button>
      ${v ? `<button type="button" class="ae-quitar" data-quitar-r="${r}">Quitar</button>` : ''}</div></div>`; break;
    case 'video': h = `<div class="ce-video"><input data-r="${r}" value="${esc(v || '')}" placeholder="https://youtu.be/… o https://www.instagram.com/reel/…">
      <button type="button" class="btn btn-borde btn-chico" data-elegir="${r}" data-que="video">${icono('nube')} Del Drive</button></div>
      <small class="ce-ayuda">Videos largos: mejor subirlos a YouTube como «no listado» y pegar el link. El original queda en el Drive.</small>`; break;
    case 'imgs': h = `<div class="ae-imgs">${(v || []).map((src, n) => `<div class="ae-th"><img src="${esc(src)}" alt=""><div>
      <button type="button" data-imgs="${r}|${n}|-1">←</button><button type="button" data-imgs="${r}|${n}|1">→</button><button type="button" data-imgs="${r}|${n}|x">✕</button></div></div>`).join('')}
      <button type="button" class="ae-th ae-th-mas" data-elegir="${r}" data-que="imagen" data-varias="1">${icono('mas')}<span>Agregar</span></button></div>`; break;
    case 'boton': h = `<div class="ce-boton">${campoEs(r + '.txt', 'Texto del botón', 'i18n', null, (v || {}).txt).replace(/^<div class="ae-campo ce"[^>]*><label>[^<]*<\/label>/, '<div>')}
      ${urlCampo(r + '.url', (v || {}).url)}</div>`; break;
    case 'url': h = urlCampo(r, v); break;
    case 'icono': h = `<div class="ae-iconos">${ICONOS_CAT.concat(['wa', 'instagram', 'enlace', 'ubicacion', 'estrella', 'diario', 'mail', 'carrito', 'casa', 'rayo', 'mundo']).filter((x, i, a) => a.indexOf(x) === i)
      .map(n => `<label><input type="radio" name="ic-${r}" data-r="${r}" value="${n}" ${n === v ? 'checked' : ''}>${icono(n)}</label>`).join('')}</div>`; break;
    case 'cat': h = `<select data-r="${r}"><option value="">—</option>${Datos.get().categorias.map(c => `<option value="${c.id}" ${c.id === v ? 'selected' : ''}>${esc(tx(c.n))}</option>`).join('')}</select>`; break;
    case 'modelo': { const ms = [...new Set([...Datos.get().drones.map(x => x.nombre), ...Datos.get().productos.flatMap(p => p.modelos || [])])].sort();
      h = `<select data-r="${r}"><option value="">—</option>${ms.map(m => `<option ${m === v ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select>`; break; }
    case 'drones': h = `<div class="ce-checks">${Datos.get().drones.map(x => `<label class="opcion"><input type="checkbox" data-lista="${r}" value="${x.id}" ${(v || []).includes(x.id) ? 'checked' : ''}><span>${esc(x.nombre)}</span></label>`).join('')}</div>`; break;
    case 'checks': h = `<div class="ce-checks">${op.map(([val, n]) => `<label class="opcion"><input type="checkbox" data-lista="${r}" value="${val}" ${(v || []).includes(val) ? 'checked' : ''}><span>${esc(n)}</span></label>`).join('')}</div>`; break;
    case 'productos': h = `<div class="ce-prods"><div class="ce-chips">${(v || []).map((ref, n) => { const i = itemDe(ref); return `<span class="ce-chip">${esc(i ? i.nombre : ref)}<button type="button" data-imgs="${r}|${n}|x">✕</button></span>`; }).join('') || '<small>Todavía no elegiste ninguno.</small>'}</div>
      <input class="ce-buscar" data-buscar-prod="${r}" placeholder="Buscar por nombre o código para agregar…"><div class="ce-resultados"></div></div>`; break;
    case 'lista': h = `<div class="ae-filas">${(v || []).map((x, n) => `<div class="ae-fila">${campoEs(r + '.' + n, '', 'i18n', null, x).replace(/^<div class="ae-campo ce"[^>]*><label><\/label>/, '<div>')}<button type="button" class="ae-quitar" data-imgs="${r}|${n}|x">✕</button></div>`).join('')}
      <button type="button" class="btn btn-borde btn-chico" data-agregar-lista="${r}">${icono('mas')} Agregar renglón</button></div>`; break;
    case 'items': h = `<div class="ce-items">${(v || []).map((it, n) => `<details class="ce-item" ${n === (window._ceAbierto || {})[r] ? 'open' : ''} data-item="${r}|${n}">
        <summary><span class="ce-item-n">${n + 1}</span><b>${esc(resumenItem(it) || 'Elemento ' + (n + 1))}</b>
          <span class="ce-item-acc"><button type="button" data-item-acc="${r}|${n}|-1" title="Subir">↑</button><button type="button" data-item-acc="${r}|${n}|1" title="Bajar">↓</button>
          <button type="button" data-item-acc="${r}|${n}|d" title="Duplicar">${icono('duplicar')}</button><button type="button" class="rojo" data-item-acc="${r}|${n}|x" title="Borrar">${icono('basura')}</button></span></summary>
        <div class="ce-item-cuerpo">${camposEs(op, it, r + '.' + n)}</div></details>`).join('')}
      <button type="button" class="btn btn-borde btn-chico" data-item-add="${r}">${icono('mas')} Agregar</button></div>`; break;
  }
  return `<div class="ae-campo ce" data-campo="${r}"><label>${esc(et || '')}</label>${h}</div>`;
}
function resumenItem(it){ if (!it || typeof it !== 'object') return ''; for (const k of ['t', 'p', 'nombre', 'texto', 'l', 'txt']) if (it[k] && tx(it[k])) return tx(it[k]).slice(0, 60); return ''; }

// Campo de link con atajos: páginas de la página, WhatsApp o un link de afuera
function urlCampo(r, v){
  const ps = (Datos.get().paginas || []).filter(p => p.id !== 'links');
  return `<div class="ce-url"><input data-r="${r}" value="${esc(v || '')}" placeholder="#/tienda · wa:mensaje · https://…">
    <select data-url-atajo="${r}" aria-label="Elegir a dónde lleva"><option value="">Elegir…</option><option value="wa:">WhatsApp del local</option>
      ${ps.map(p => `<option value="#/${p.id === 'inicio' ? '' : p.id}">Página: ${esc(tituloPagina(p))}</option>`).join('')}
      <option value="https://www.instagram.com/${esc((Datos.get().igConexion || {}).usuario || '')}/">Instagram</option></select></div>`;
}

function activarCamposEs(caja, obj, alCambiar, redibujar){
  const cambio = (estr) => alCambiar && alCambiar(estr);
  $$('[data-r]', caja).forEach(inp => { if (inp.dataset.on) return; inp.dataset.on = 1;
    const ev = inp.type === 'radio' || inp.type === 'checkbox' || inp.tagName === 'SELECT' || inp.type === 'date' || inp.type === 'datetime-local' ? 'change' : 'input';
    inp.addEventListener(ev, () => {
      let val = inp.value;
      if (inp.dataset.k === 'check') val = inp.checked; else if (inp.dataset.k === 'num') val = leerNumero(val);
      ponerEn(obj, inp.dataset.r, val); cambio(false);
      const it = inp.closest('.ce-item'); if (it) { const b = $('summary > b', it), [rr, n] = it.dataset.item.split('|'); if (b) b.textContent = resumenItem(leerEn(obj, rr)[+n]) || 'Elemento ' + (+n + 1); }
    }); });
  $$('[data-url-atajo]', caja).forEach(s => s.onchange = () => { if (!s.value) return; const inp = $(`[data-r="${s.dataset.urlAtajo}"]`, caja); inp.value = s.value; inp.dispatchEvent(new Event('input')); s.value = ''; });
  $$('[data-lista]', caja).forEach(c => c.onchange = () => { const r = c.dataset.lista; ponerEn(obj, r, $$(`[data-lista="${r}"]:checked`, caja).map(x => x.value)); cambio(false); });
  $$('[data-elegir]', caja).forEach(b => b.onclick = async () => {
    const r = b.dataset.elegir, varias = !!b.dataset.varias;
    const res = await elegirArchivo({ tipo: b.dataset.que, varias });
    if (!res || (Array.isArray(res) && !res.length)) return;
    if (varias) { const a = leerEn(obj, r) || []; ponerEn(obj, r, a.concat(res)); } else ponerEn(obj, r, Array.isArray(res) ? res[0] : res);
    cambio(true); redibujar && redibujar();
  });
  $$('[data-quitar-r]', caja).forEach(b => b.onclick = () => { ponerEn(obj, b.dataset.quitarR, ''); cambio(true); redibujar && redibujar(); });
  $$('[data-imgs]', caja).forEach(b => b.onclick = e => { e.preventDefault(); const [r, n, acc] = b.dataset.imgs.split('|'); const a = leerEn(obj, r) || [], i = +n;
    if (acc === 'x') a.splice(i, 1); else { const j = i + +acc; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; }
    ponerEn(obj, r, a); cambio(true); redibujar && redibujar(); });
  $$('[data-agregar-lista]', caja).forEach(b => b.onclick = () => { const r = b.dataset.agregarLista; const a = leerEn(obj, r) || []; a.push({ es: '', pt: '' }); ponerEn(obj, r, a); cambio(true); redibujar && redibujar(); });
  $$('[data-item-add]', caja).forEach(b => b.onclick = () => { const r = b.dataset.itemAdd; const a = leerEn(obj, r) || []; a.push({}); ponerEn(obj, r, a);
    window._ceAbierto = { ...(window._ceAbierto || {}), [r]: a.length - 1 }; cambio(true); redibujar && redibujar(); });
  $$('[data-item-acc]', caja).forEach(b => b.onclick = e => { e.preventDefault(); e.stopPropagation(); const [r, n, acc] = b.dataset.itemAcc.split('|'); const a = leerEn(obj, r) || [], i = +n;
    if (acc === 'x') { if (!confirm('¿Borrar este elemento?')) return; a.splice(i, 1); }
    else if (acc === 'd') { a.splice(i + 1, 0, JSON.parse(JSON.stringify(a[i]))); window._ceAbierto = { ...(window._ceAbierto || {}), [r]: i + 1 }; }
    else { const j = i + +acc; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; window._ceAbierto = { ...(window._ceAbierto || {}), [r]: j }; }
    cambio(true); redibujar && redibujar(); });
  $$('.ce-item', caja).forEach(d => d.addEventListener('toggle', () => { if (d.open) { const [r, n] = d.dataset.item.split('|'); window._ceAbierto = { ...(window._ceAbierto || {}), [r]: +n }; } }));
  // Barra de formato del texto
  $$('[data-md]', caja).forEach(b => b.onclick = () => {
    const ta = $('textarea:focus', b.closest('.ce-md')) || b.closest('.ce-md')._ultimo || $('textarea', b.closest('.ce-md'));
    const s = ta.selectionStart, f = ta.selectionEnd, sel = ta.value.slice(s, f) || 'texto', m = b.dataset.md;
    const nuevo = m === 'link' ? `[${sel}](#/contacto)` : m === 'lista' ? sel.split('\n').map(l => '- ' + l.replace(/^- /, '')).join('\n') : m + sel + m;
    ta.value = ta.value.slice(0, s) + nuevo + ta.value.slice(f); ta.focus(); ta.selectionStart = s; ta.selectionEnd = s + nuevo.length; ta.dispatchEvent(new Event('input'));
  });
  $$('.ce-md textarea', caja).forEach(ta => ta.addEventListener('focus', () => { ta.closest('.ce-md')._ultimo = ta; }));
  // Buscar productos para agregar
  $$('[data-buscar-prod]', caja).forEach(inp => { const res = inp.nextElementSibling;
    inp.oninput = () => { const q = inp.value.trim().toLowerCase(); if (q.length < 2) { res.innerHTML = ''; return; }
      const l = todosLosItems().filter(i => (i.nombre + ' ' + i.codigo + ' ' + (i.modelos || []).join(' ')).toLowerCase().includes(q)).slice(0, 8);
      res.innerHTML = l.map(i => `<button type="button" data-ref="${esc(i.ref)}">${esc(i.nombre)} <small>${esc(i.codigo || '')}</small></button>`).join('') || '<small>Sin resultados</small>';
      $$('[data-ref]', res).forEach(b => b.onclick = () => { const r = inp.dataset.buscarProd, a = leerEn(obj, r) || []; if (!a.includes(b.dataset.ref)) a.push(b.dataset.ref); ponerEn(obj, r, a); cambio(true); redibujar && redibujar(); }); }; });
}

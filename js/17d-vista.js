/* =====================================================================
   VISTA PREVIA DENTRO DEL ESTUDIO (versión 3): la misma página, abierta
   con ?borrador=1&vista=1 adentro del editor.
   - Al pasar el mouse, cada bloque se marca con su nombre.
   - Tocar un bloque lo elige; tocar un TEXTO permite escribir ahí mismo
     (se guarda solo y se ve en el panel); tocar una FOTO permite cambiarla.
   - El bloque elegido tiene su barra (subir, bajar, duplicar, ocultar,
     borrar, cambiar foto) y «＋ Agregar bloque acá» debajo.
   - Cuando el Estudio cambia algo, se vuelve a dibujar sin perder la posición.
   ===================================================================== */
if (EN_EDITOR) {
  document.documentElement.classList.add('en-estudio');
  let marcado = null, editando = null;
  const etiqueta = document.createElement('div'); etiqueta.className = 'vista-etq';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(etiqueta));
  const avisar = m => parent.postMessage(m, '*');

  // Escribir directo sobre un texto
  function empezar(el, e){
    if (editando === el) return;
    terminar();
    editando = el; el.classList.add('vista-escribiendo');
    if (el.querySelector('.pal')) el.textContent = el.textContent.replace(/\s+/g, ' ').trim();   // los títulos animados vuelven a texto simple
    el.contentEditable = 'plaintext-only'; if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true';
    el.focus();
    const r = e && document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
    const s = getSelection(); s.removeAllRanges();
    if (r && el.contains(r.startContainer)) s.addRange(r); else { const r2 = document.createRange(); r2.selectNodeContents(el); r2.collapse(false); s.addRange(r2); }
    avisar({ dp: 'campo', id: el.closest('.bq').dataset.bq, ed: el.dataset.ed });
  }
  function terminar(){
    if (!editando) return; const el = editando; editando = null;
    el.contentEditable = 'false'; el.classList.remove('vista-escribiendo');
    avisar({ dp: 'fin' });
  }
  document.addEventListener('input', e => {
    if (!editando || !editando.contains(e.target)) return;
    avisar({ dp: 'texto', id: editando.closest('.bq').dataset.bq, ed: editando.dataset.ed, valor: editando.innerText.replace(/\n+$/, '') });
  }, true);
  document.addEventListener('keydown', e => {
    if (!editando) return;
    if (e.key === 'Escape' || (e.key === 'Enter' && !e.shiftKey && !/^(P|DIV|BLOCKQUOTE)$/.test(editando.tagName))) { e.preventDefault(); editando.blur(); }
  }, true);
  document.addEventListener('focusout', e => { if (editando && e.target === editando) setTimeout(terminar, 0); }, true);

  document.addEventListener('click', e => {
    const barra = e.target.closest('.vista-barra button, .vista-mas');
    if (barra) { e.preventDefault(); e.stopPropagation();
      if (barra.classList.contains('vista-mas')) avisar({ dp: 'agregar', despues: barra.dataset.id });
      else avisar({ dp: 'accion', id: barra.dataset.id, acc: barra.dataset.acc }); return; }
    if (editando && editando.contains(e.target)) return;                   // clics adentro del texto que se escribe
    const bq = e.target.closest('.bq[data-bq]');
    if (e.target.closest('a, button, input, select, textarea, label, summary, details') || bq) { e.preventDefault(); e.stopPropagation(); }
    if (!bq) return;
    if (marcado !== bq.dataset.bq) { marcar(bq.dataset.bq); avisar({ dp: 'elegir', id: bq.dataset.bq }); }
    const t = e.target.closest('[data-ed]'), img = e.target.closest('[data-ed-img]'), mdx = e.target.closest('[data-ed-md]');
    if (t) empezar(t, e);
    else if (img) { terminar(); avisar({ dp: 'imagen', id: bq.dataset.bq, ed: img.dataset.edImg }); }
    else if (mdx) { terminar(); avisar({ dp: 'campo', id: bq.dataset.bq, ed: mdx.dataset.edMd }); }
    else terminar();
  }, true);
  document.addEventListener('submit', e => e.preventDefault(), true);
  document.addEventListener('mouseover', e => {
    const bq = e.target.closest('.bq[data-bq]'); if (!bq) { etiqueta.classList.remove('ver'); return; }
    const r = bq.getBoundingClientRect(), puede = e.target.closest('[data-ed]') ? ' · tocá el texto para escribir' : e.target.closest('[data-ed-img]') ? ' · tocá para cambiar la foto' : '';
    etiqueta.textContent = bq.dataset.nombre + (bq.classList.contains('bq-oculto') ? ' · oculto' : '') + puede;
    etiqueta.style.top = Math.max(6, r.top + 8) + 'px'; etiqueta.style.left = (r.left + 10) + 'px'; etiqueta.classList.add('ver');
    $$('.bq.sobre').forEach(x => x !== bq && x.classList.remove('sobre')); bq.classList.add('sobre');
  });
  document.addEventListener('mouseleave', () => { etiqueta.classList.remove('ver'); $$('.bq.sobre').forEach(x => x.classList.remove('sobre')); });

  // El bloque elegido: borde verde, barra arriba a la derecha y «Agregar bloque acá» abajo
  function marcar(id, bajar){
    marcado = id; $$('.bq.elegido').forEach(x => x.classList.remove('elegido')); $$('.vista-barra, .vista-mas').forEach(x => x.remove());
    const el = $(`.bq[data-bq="${CSS.escape(id)}"]`); if (!el) return;
    el.classList.add('elegido');
    const b = buscarBloque(id), sis = b && b.tipo === 'sis', def = b && BLOQUES[b.tipo], foto = def && def.campos.find(c => c[2] === 'img');
    const barra = document.createElement('div'); barra.className = 'vista-barra';
    barra.innerHTML = `<b>${esc(el.dataset.nombre)}</b>` + [['sub', 'arriba', 'Subir'], ['baj', 'abajo', 'Bajar'], ...(foto ? [['foto', 'imagen', 'Cambiar foto']] : []),
      ...(sis ? [] : [['dup', 'duplicar', 'Duplicar']]), ['ver', b && b.oculto ? 'ojo' : 'ojono', b && b.oculto ? 'Mostrar' : 'Ocultar'], ...(sis ? [] : [['borrar', 'basura', 'Borrar']])]
      .map(([acc, ic, n]) => `<button data-id="${esc(id)}" data-acc="${acc}" title="${n}" class="${acc === 'borrar' ? 'rojo' : ''}">${icono(ic)}</button>`).join('');
    el.appendChild(barra);
    const mas = document.createElement('button'); mas.className = 'vista-mas'; mas.dataset.id = id; mas.innerHTML = `${icono('mas')}<span>Agregar bloque acá</span>`;
    el.appendChild(mas);
    if (bajar) { const y = el.getBoundingClientRect().top + window.scrollY - 70; if (window.lenis) window.lenis.scrollTo(y, { immediate: false, duration: .8 }); else window.scrollTo({ top: y, behavior: 'smooth' }); }
  }
  window.addEventListener('message', e => {
    const m = e.data || {}; if (!m.dp) return;
    if (m.dp === 'recargar') {
      if (editando) return;                                            // no se redibuja mientras se escribe
      if (m.borrador) Almacen.poner(CLAVE_BORRADOR, m.borrador); if (m.publicado) Almacen.poner(CLAVE_DATOS, m.publicado);
      const y = window.scrollY; Datos.cargar(); prepararPaginas(); dibujarMarco(); mostrarRuta(true);
      window.scrollTo(0, y); if (window.lenis) window.lenis.scrollTo(y, { immediate: true });
      $$('[data-aparece], [data-dividir]').forEach(x => x.classList.add('visto'));
      if (marcado) marcar(marcado);
    }
    if (m.dp === 'marcar') marcar(m.id, true);
  });
}

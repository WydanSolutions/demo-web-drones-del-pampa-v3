/* =====================================================================
   VISTA PREVIA DENTRO DEL ESTUDIO (versión 3): la misma página, abierta
   con ?borrador=1&vista=1 adentro del editor.
   - Al pasar el mouse, cada bloque se marca con su nombre.
   - Al tocar un bloque, el Estudio lo abre para editarlo (no navega).
   - Cuando el Estudio cambia algo, se vuelve a dibujar sin perder la posición.
   ===================================================================== */
if (EN_EDITOR) {
  document.documentElement.classList.add('en-estudio');
  let marcado = null;
  const etiqueta = document.createElement('div'); etiqueta.className = 'vista-etq';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(etiqueta));

  document.addEventListener('click', e => {
    const bq = e.target.closest('.bq[data-bq]');
    if (e.target.closest('a, button, input, select, textarea, label, summary, details') || bq) { e.preventDefault(); e.stopPropagation(); }
    if (bq) { marcar(bq.dataset.bq); parent.postMessage({ dp: 'elegir', id: bq.dataset.bq }, '*'); }
  }, true);
  document.addEventListener('submit', e => e.preventDefault(), true);
  document.addEventListener('mouseover', e => {
    const bq = e.target.closest('.bq[data-bq]'); if (!bq) { etiqueta.classList.remove('ver'); return; }
    const r = bq.getBoundingClientRect(); etiqueta.textContent = bq.dataset.nombre + (bq.classList.contains('bq-oculto') ? ' · oculto' : '');
    etiqueta.style.top = Math.max(6, r.top + 8) + 'px'; etiqueta.style.left = (r.left + 10) + 'px'; etiqueta.classList.add('ver');
    $$('.bq.sobre').forEach(x => x !== bq && x.classList.remove('sobre')); bq.classList.add('sobre');
  });
  document.addEventListener('mouseleave', () => { etiqueta.classList.remove('ver'); $$('.bq.sobre').forEach(x => x.classList.remove('sobre')); });

  function marcar(id, bajar){
    marcado = id; $$('.bq.elegido').forEach(x => x.classList.remove('elegido'));
    const el = $(`.bq[data-bq="${CSS.escape(id)}"]`); if (!el) return;
    el.classList.add('elegido');
    if (bajar) { const y = el.getBoundingClientRect().top + window.scrollY - 70; if (window.lenis) window.lenis.scrollTo(y, { immediate: false, duration: .8 }); else window.scrollTo({ top: y, behavior: 'smooth' }); }
  }
  window.addEventListener('message', e => {
    const m = e.data || {}; if (!m.dp) return;
    if (m.dp === 'recargar') {
      const y = window.scrollY; Datos.cargar(); prepararPaginas(); dibujarMarco(); mostrarRuta(true);
      window.scrollTo(0, y); if (window.lenis) window.lenis.scrollTo(y, { immediate: true });
      $$('[data-aparece], [data-dividir]').forEach(x => x.classList.add('visto'));
      if (marcado) marcar(marcado);
    }
    if (m.dp === 'marcar') marcar(m.id, true);
  });
}

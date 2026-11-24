/* =====================================================================
   ARRANQUE: carga los datos, arma el marco, muestra la página de la
   dirección (#/…), pantalla de carga con el logo y entrada animada.
   Versión 3: con ?admin abre directo el Estudio (sin la animación y sin
   armar la página de atrás, que se arma recién al salir); dentro de la
   vista previa del Estudio (?vista=1) no hay animación de carga.
   ===================================================================== */
async function iniciar(){
  document.documentElement.lang = IDIOMA === 'pt' ? 'pt-BR' : 'es-UY';
  await Almacen.listo;                    // el contenido vive en IndexedDB (02-datos.js)
  Datos.cargar();
  prepararPaginas();
  const conAdmin = /[?&]admin\b/.test(location.search);
  if (window.gsap && !QUIETO && !EN_EDITOR && !conAdmin) document.documentElement.classList.add('anim');
  iniciarScrollSuave();
  dibujarMarco();
  $('link[rel=icon]').href = faviconDP(64);
  if (conAdmin) { $('#cargador').remove(); abrirAdmin(); }
  else mostrarRuta();
  navAlBajar();
  if (!EN_EDITOR && !conAdmin) await pantallaDeCarga(); else if ($('#cargador')) $('#cargador').remove();
  if (typeof Estadisticas !== 'undefined') Estadisticas.empezar();
  if (!conAdmin) entradaPagina();
  window.addEventListener('resize', () => { clearTimeout(window._rsz); window._rsz = setTimeout(() => { if (_rutaActual) marcarMenu(_rutaActual.seccion); window.ScrollTrigger && ScrollTrigger.refresh(); }, 250); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();

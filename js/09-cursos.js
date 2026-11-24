/* =====================================================================
   PÁGINA · CURSOS (#/cursos y #/cursos/<curso>)
   Listado con fecha, cuenta regresiva y cupos; cada curso tiene su
   página con toda la información y la inscripción al costado.
   Las inscripciones quedan en Administrar › Inscriptos.
   ===================================================================== */
function cursosVisibles(){ return Datos.get().cursos.filter(c => c.visible !== false).sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '')); }
function inscriptosDe(id){ return Datos.get().inscripciones.filter(i => i.curso === id && !i.espera).length; }
function libresDe(c){ return Math.max(0, (Number(c.cupos) || 0) - (Number(c.ocupados) || 0) - inscriptosDe(c.id)); }
const cursoDe = id => Datos.get().cursos.find(c => c.id === id);

PAGINAS.cursos = {
  titulo: id => id && cursoDe(id) ? tx(cursoDe(id).titulo) : t('p_cursos'),
  html(id){ return id && cursoDe(id) ? cursoHTML(cursoDe(id)) : listaCursosHTML(); },
  alMostrar(v, id){
    $$('.cuenta', v).forEach(cuentaRegresiva);
    const f = $('#f-insc', v); if (f) f.onsubmit = e => { e.preventDefault(); inscribir(cursoDe(id)); };
  }
};

function listaCursosHTML(){
  const T = Datos.get().textos;
  return `<section class="cabeza-pag noche-pag"><video class="cabeza-video" src="media/video/t100-lidar.mp4" poster="media/video/t100-lidar.jpg" autoplay muted loop playsinline></video><div class="cabeza-velo"></div>
      <div class="contenedor cabeza-in"><div><span class="etiqueta"><i></i>Academia · Rivera</span><h1 class="titulo" data-dividir>${esc(tx(T.cursosTitulo))}</h1><p class="sub">${esc(tx(T.cursosSub))}</p></div></div></section>
    <section class="bloque pegado"><div class="contenedor cursos-lista">${cursosVisibles().map((c, i) => {
      const f = fechaCorta(c.fecha), libres = libresDe(c), total = Number(c.cupos) || 1, ocup = Math.min(100, Math.round((total - libres) / total * 100));
      return `<a class="curso foco" href="#/cursos/${c.id}" data-aparece>
        <div class="curso-img"><img src="${esc(c.imagen)}" alt="" loading="lazy"><div class="curso-fecha"><b>${f.d}</b><span>${esc(f.m)}</span></div></div>
        <div class="curso-info">
          <div class="curso-chips"><span class="chip azul">${esc(tx(c.nivel))}</span><span class="chip gris">${icono('reloj')}${esc(tx(c.duracion))}</span></div>
          <h3>${esc(tx(c.titulo))}</h3><p>${esc(tx(c.bajada))}</p>
          <div class="curso-abajo">
            <div class="cupos"><div class="cupos-barra"><i style="--p:${ocup}%"></i></div><span class="${libres ? '' : 'lleno'}">${libres && c.abierto !== false ? `<b>${libres}</b> ${t('cupos_libres')}` : t('cupo_lleno')}</span></div>
            <div class="cuenta mini" data-fecha="${esc(c.fecha)}"></div>
          </div>
          <div class="curso-pie">${precioHTML(c.precio)}<span class="btn btn-azul btn-chico">${t('ver_curso')} ${icono('flecha')}</span></div>
        </div></a>`; }).join('')}</div></section>`;
}

function cursoHTML(c){
  const libres = libresDe(c), espera = !libres || c.abierto === false;
  const lista = (arr, ic) => (arr || []).map((x, i) => `<li data-aparece>${ic ? icono(ic) : `<b>${String(i + 1).padStart(2, '0')}</b>`}<span>${esc(tx(x))}</span></li>`).join('');
  return `<section class="cm-hero"><img src="${esc(c.imagen)}" alt=""><div class="cm-velo"></div>
      <div class="contenedor cm-hero-in"><a class="fd-volver" href="#/cursos">${icono('flecha')} ${t('p_cursos')}</a>
        <span class="chip">${esc(tx(c.nivel))}</span><h1>${esc(tx(c.titulo))}</h1><p>${esc(tx(c.bajada))}</p>
        <div class="cuenta" data-fecha="${esc(c.fecha)}"></div></div></section>
    <section class="bloque"><div class="contenedor cm-in">
      <div class="cm-col">
        <div class="cm-datos">
          <div data-aparece>${icono('calendario')}<small>${t('fecha')}</small><b>${esc(fechaLarga(c.fecha))}</b></div>
          <div data-aparece>${icono('reloj')}<small>${t('duracion')}</small><b>${esc(tx(c.duracion))}</b></div>
          <div data-aparece>${icono('ubicacion')}<small>${t('lugar')}</small><b>${esc(tx(c.lugar))}</b></div>
          <div data-aparece>${icono('usuarios')}<small>${t('modalidad')}</small><b>${esc(tx(c.modalidad))}</b></div>
        </div>
        <h2 class="fd-h">${t('temario')}</h2><ol class="cm-temario">${lista(c.temario)}</ol>
        <div class="cm-dos"><div><h2 class="fd-h">${t('incluye')}</h2><ul class="cm-lista">${lista(c.incluye, 'check')}</ul></div>
          <div><h2 class="fd-h">${t('requisitos')}</h2><ul class="cm-lista">${lista(c.requisitos, 'escudo')}</ul></div></div>
      </div>
      <aside class="cm-lado" id="cm-lado">
        <div class="cm-precio"><small>${t('inversion')}</small>${precioHTML(c.precio)}<span class="${libres ? 'chip' : 'chip ambar'}">${libres && c.abierto !== false ? libres + ' ' + t('cupos_libres') : t('cupo_lleno')}</span></div>
        <h3>${t('inscripcion')}</h3>
        <form id="f-insc" novalidate class="cm-form">
          <div class="campo"><label>${t('f_nombre')}</label><input name="nombre" data-obl autocomplete="name"><span class="error">${t('f_obligatorio')}</span></div>
          <div class="grilla-form">
            <div class="campo"><label>${t('f_ci')}</label><input name="ci" data-obl inputmode="numeric"><span class="error">${t('f_obligatorio')}</span></div>
            <div class="campo"><label>${t('f_telefono')}</label><input name="tel" data-obl type="tel" autocomplete="tel"><span class="error">${t('f_obligatorio')}</span></div></div>
          <div class="campo"><label>${t('f_email')}</label><input name="email" data-obl type="email" autocomplete="email"><span class="error">${t('f_mail_mal')}</span></div>
          <div class="grilla-form">
            <div class="campo"><label>${t('f_ciudad')}</label><input name="ciudad"></div>
            <div class="campo"><label>${t('f_experiencia')}</label><select name="exp"><option value="no">${t('f_exp_no')}</option><option value="algo">${t('f_exp_algo')}</option><option value="agro">${t('f_exp_agro')}</option></select></div></div>
          <div class="campo"><label>${t('f_comentario')}</label><textarea name="com" rows="2"></textarea></div>
          <button class="btn btn-azul" type="submit">${espera ? t('lista_espera') : t('inscribirme')} ${icono('flecha')}</button>
        </form>
      </aside>
    </div></section>`;
}

function inscribir(c){
  const f = $('#f-insc'); if (!validar(f)) return;
  const espera = !libresDe(c) || c.abierto === false;
  const v = Object.fromEntries(new FormData(f).entries());
  const numero = 'DP-' + String(Date.now()).slice(-5);
  Datos.get().inscripciones.unshift({ id: Datos.nuevoId('ins'), numero, curso: c.id, cursoNombre: tx(c.titulo), fecha: new Date().toISOString(), espera, idioma: IDIOMA, ...v });
  Datos.guardar();
  // La caja del costado queda como comprobante; el festejo se abre encima (09b-festejo.js)
  $('#cm-lado').innerHTML = cajaInscripto(c, v, numero, espera);
  festejarInscripcion(c, v, numero, espera);
}

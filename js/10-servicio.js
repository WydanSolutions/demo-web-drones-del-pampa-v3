/* =====================================================================
   PÁGINA · SERVICIO TÉCNICO (#/servicio)
   Cómo trabajamos (pasos), pedido de turno (queda en el panel y se
   avisa por WhatsApp), garantía, consejos en video de Claudio y
   preguntas frecuentes que se abren y cierran.
   ===================================================================== */
PAGINAS.servicio = {
  titulo: () => t('p_servicio'),
  html(){
    const d = Datos.get(), T = d.textos, cl = d.claudio;
    return `<section class="serv-hero">
        <div class="contenedor serv-hero-in">
          <div class="serv-hero-txt"><span class="etiqueta"><i></i>${t('p_servicio')} · Rivera</span>
            <h1 class="titulo" data-dividir>${esc(tx(T.servTitulo))}</h1><p class="sub">${esc(tx(T.servSub))}</p>
            <div class="serv-garantia">${icono('escudo')}<div><b>${t('garantia')}</b><span>${t('garantia_txt')}</span></div></div>
            <a class="btn btn-azul magnetico" href="#turno" onclick="event.preventDefault();irATurno()">${icono('calendario')} ${t('agendar')}</a></div>
          <div class="serv-hero-foto ${cl.videoServicio ? 'con-video' : ''}" data-aparece="zoom">${cl.videoServicio
            ? `<video src="${esc(cl.videoServicio)}" poster="${esc(cl.foto3 || cl.foto2)}" muted loop playsinline autoplay preload="auto" data-auto aria-label="${esc(cl.nombre)}"></video><button class="claudio-sonido" onclick="sonidoVideo(this)">${icono('mute')}<span>${t('sonido')}</span></button>`
            : `<img src="${esc(cl.foto3 || cl.foto2)}" alt="${esc(cl.nombre)}">`}<div class="shf-tag"><b>${esc(cl.nombre)}</b><span>${esc(tx(cl.cargo))}</span></div></div>
        </div>
      </section>
      <section class="bloque niebla"><div class="contenedor">
        <div class="cabecera"><div><span class="etiqueta"><i></i>${t('pasos')}</span><h2 class="titulo chico" data-dividir>${IDIOMA === 'pt' ? 'Do diagnóstico ao voo de teste' : 'Del diagnóstico al vuelo de prueba'}</h2></div></div>
        <div class="pasos"><div class="pasos-linea"><i></i></div>${d.servicio.map((p, i) => `<div class="paso" data-aparece><span class="paso-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(tx(p.t))}</b><p>${esc(tx(p.d))}</p></div>`).join('')}</div>
      </div></section>
      <section class="bloque" id="turno"><div class="contenedor turno-in">
        <div class="turno-txt"><span class="etiqueta"><i></i>${t('agendar')}</span><h2 class="titulo chico" data-dividir>${IDIOMA === 'pt' ? 'Peça um horário em 1 minuto' : 'Pedí turno en 1 minuto'}</h2>
          <p class="sub">${IDIOMA === 'pt' ? 'Conte o que acontece com o equipamento. Confirmamos o dia pelo WhatsApp e, se precisar, buscamos.' : 'Contanos qué le pasa al equipo. Te confirmamos el día por WhatsApp y, si hace falta, lo pasamos a buscar.'}</p>
          <div class="consejos"><h3>${t('consejos')}</h3>
            <div class="consejos-vid"><div class="telefono"><video src="media/instagram/ig-revisiones.mp4" poster="media/instagram/ig-revisiones.jpg" muted loop playsinline preload="none" data-auto></video><button class="claudio-sonido" onclick="sonidoVideo(this)">${icono('mute')}<span>${t('sonido')}</span></button></div>
              <div class="telefono"><video src="media/instagram/ig-repuestos.mp4" poster="media/instagram/ig-repuestos.jpg" muted loop playsinline preload="none" data-auto></video><button class="claudio-sonido" onclick="sonidoVideo(this)">${icono('mute')}<span>${t('sonido')}</span></button></div></div></div>
        </div>
        <form class="turno-form" id="f-turno" novalidate data-aparece="der">
          <div class="campo"><label>${t('s_equipo')}</label><div class="opciones">${[...dronesVisibles().map(x => x.nombre), t('s_otro')].map((n, i) => `<label class="opcion"><input type="radio" name="equipo" value="${esc(n)}" ${i ? '' : 'checked'}><span>${esc(n)}</span></label>`).join('')}</div></div>
          <div class="campo"><label>${t('s_tipo')}</label><select name="tipo">${d.tiposService.map(x => `<option>${esc(tx(x))}</option>`).join('')}</select></div>
          <div class="grilla-form"><div class="campo"><label>${t('s_serie')}</label><input name="serie"></div>
            <div class="campo"><label>${t('s_fecha')}</label><input name="dia" type="date" min="${hoyISO()}"></div></div>
          <div class="campo"><label>${t('s_problema')}</label><textarea name="problema" data-obl rows="3"></textarea><span class="error">${t('f_obligatorio')}</span></div>
          <div class="grilla-form"><div class="campo"><label>${t('f_nombre')}</label><input name="nombre" data-obl autocomplete="name"><span class="error">${t('f_obligatorio')}</span></div>
            <div class="campo"><label>${t('f_telefono')}</label><input name="tel" data-obl type="tel" autocomplete="tel"><span class="error">${t('f_obligatorio')}</span></div></div>
          <div class="campo"><label>${t('f_ciudad')}</label><input name="ciudad"></div>
          <label class="f-switch"><input type="checkbox" name="retiro"><span></span>${t('s_retiro')}</label>
          <button class="btn btn-azul" type="submit">${icono('calendario')} ${t('s_enviar')}</button>
        </form>
      </div></section>
      <section class="bloque niebla"><div class="contenedor faq-in">
        <div><span class="etiqueta"><i></i>FAQ</span><h2 class="titulo chico" data-dividir>${t('preguntas')}</h2></div>
        <div class="faq">${d.faq.map(f => `<details class="faq-item" data-aparece><summary>${esc(tx(f.p))}<i>${icono('mas')}</i></summary><p>${esc(tx(f.r))}</p></details>`).join('')}</div>
      </div></section>`;
  },
  alMostrar(v){
    $('#f-turno', v).onsubmit = e => {
      e.preventDefault(); const f = e.target; if (!validar(f)) return;
      const x = Object.fromEntries(new FormData(f).entries()); x.retiro = !!x.retiro;
      Datos.get().services.unshift({ id: Datos.nuevoId('srv'), fecha: new Date().toISOString(), estado: 'nuevo', idioma: IDIOMA, ...x }); Datos.guardar();
      const pt = IDIOMA === 'pt';
      const msg = (pt ? 'Olá! Quero agendar uma revisão.\n' : '¡Hola! Quiero agendar un service.\n') + `${x.equipo} · ${x.tipo}${x.serie ? ' · N° ' + x.serie : ''}\n${x.problema}\n${x.dia ? (pt ? 'Dia: ' : 'Día: ') + x.dia + '\n' : ''}${x.retiro ? (pt ? 'Precisa buscar o equipamento\n' : 'Necesita que lo pasen a buscar\n') : ''}${x.nombre} · ${x.tel}${x.ciudad ? ' · ' + x.ciudad : ''}`;
      f.outerHTML = `<div class="turno-form ok-caja"><svg viewBox="0 0 80 80" class="ok-anim"><circle cx="40" cy="40" r="36"/><path d="M24 41l11 11 22-24"/></svg>
        <h3>${t('s_ok')}</h3><p>${t('s_ok_txt')}</p><a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">${icono('wa')} ${t('avisar_wa')}</a></div>`;
    };
    $$('.faq-item', v).forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq-item', v).forEach(o => { if (o !== d) o.open = false; }); }));
  }
};
function irATurno(){ const el = $('#turno'); if (window.lenis) window.lenis.scrollTo(el, { offset: -90, duration: 1.4 }); else el.scrollIntoView({ behavior: 'smooth' }); }

/* =====================================================================
   PÁGINAS · NOSOTROS (#/nosotros) y CONTACTO (#/contacto)
   Nosotros: la historia contada desde Claudio, el local, la noche del
   lanzamiento y la red Dragur (chiquito, como respaldo).
   Contacto: datos, mapa y formulario que llega por WhatsApp.
   ===================================================================== */
PAGINAS.nosotros = {
  titulo: () => t('p_nosotros'),
  html(){
    const d = Datos.get(), T = d.textos, cl = d.claudio;
    return `<section class="nos-hero">
        <div class="contenedor nos-hero-in">
          <div class="nos-hero-txt"><span class="etiqueta"><i></i>${t('p_nosotros')}</span><h1 class="titulo" data-dividir>${esc(tx(T.nosTitulo))}</h1>
            <p class="sub" data-aparece>${esc(tx(cl.historia))}</p></div>
          <div class="nos-collage">
            <figure class="nc-1" data-aparece="zoom"><img src="media/instagram/local-rivera.jpg" alt="${t('nos_local')}"><figcaption>${icono('ubicacion')} ${t('nos_local')}</figcaption></figure>
            <figure class="nc-2" data-aparece="zoom"><img src="media/claudio/noche-local.jpg" alt=""><figcaption>${t('la_noche')}</figcaption></figure>
            <figure class="nc-3" data-aparece="zoom"><img src="${esc(cl.foto2)}" alt="${esc(cl.nombre)}"></figure>
          </div>
        </div>
      </section>
      <section class="bloque noche"><div class="claudio-topo">${fondoTopo()}</div>
        <div class="contenedor carta">
          <img class="carta-foto" src="${esc(cl.foto2 || cl.foto)}" alt="${esc(cl.nombre)}" data-aparece="zoom">
          <div><span class="etiqueta"><i></i>${IDIOMA === 'pt' ? 'Uma palavra do Claudio' : 'Unas palabras de Claudio'}</span>
            <blockquote class="carta-txt" data-aparece>“${esc(tx(cl.frase))}”</blockquote>
            <div class="firma" data-aparece><svg viewBox="0 0 220 60"><path d="M8 42 C 30 10 44 12 38 40 S 60 52 72 24 S 92 30 96 42 S 120 14 132 36 S 150 46 162 28 S 190 26 212 34"/></svg><span>${esc(cl.nombre)} · ${esc(tx(cl.cargo))}</span></div></div>
        </div></section>
      ${(d.equipo || []).length ? `<section class="bloque equipo-bloque"><div class="contenedor">
        <div class="cabecera"><div><span class="etiqueta"><i></i>${IDIOMA === 'pt' ? 'A equipe' : 'El equipo'}</span><h2 class="titulo chico" data-dividir>${IDIOMA === 'pt' ? 'As pessoas por trás de cada drone' : 'Las personas detrás de cada dron'}</h2></div>
          <a class="btn btn-wa" href="${waLink(msjClaudio())}" target="_blank" rel="noopener" data-aparece>${icono('wa')} ${t('hablar_claudio')}</a></div>
        <div class="equipo">${d.equipo.map((x, i) => `<article class="eq ${i === 0 ? 'eq-dueno' : ''}" data-aparece>
          ${i === 0 ? `<img class="eq-foto" src="${esc(cl.foto)}" alt="${esc(x.n || cl.nombre)}">` : `<span class="eq-ico">${icono(x.icono)}</span>`}
          <small>${esc(tx(x.t))}</small>${x.n ? `<b>${esc(x.n)}</b>` : ''}<p>${esc(tx(x.d))}</p></article>`).join('')}</div>
      </div></section>` : ''}
      <section class="bloque"><div class="contenedor">
        <div class="cabecera"><div><span class="etiqueta"><i></i>Drones del Pampa</span><h2 class="titulo chico" data-dividir>${IDIOMA === 'pt' ? 'O que fazemos todos os dias' : 'Lo que hacemos todos los días'}</h2></div></div>
        <div class="valores grandes">${d.valores.map(v => `<div class="valor" data-aparece>${icono(v.icono)}<b>${esc(tx(v.t))}</b><span>${esc(tx(v.d))}</span></div>`).join('')}</div>
      </div></section>
      <section class="bloque niebla"><div class="contenedor lanz-in">
        <div class="telefono" data-aparece="izq"><video src="media/instagram/ig-lanzamiento.mp4" poster="media/instagram/ig-lanzamiento.jpg" muted loop playsinline preload="none" data-auto></video><button class="claudio-sonido" onclick="sonidoVideo(this)">${icono('mute')}<span>${t('sonido')}</span></button></div>
        <div><span class="etiqueta"><i></i>${t('la_noche')}</span><h2 class="titulo chico" data-dividir>${IDIOMA === 'pt' ? 'Gira de lançamento DJI Agriculture em Rivera' : 'Gira de lanzamiento DJI Agriculture en Rivera'}</h2>
          <p class="sub" data-aparece>${IDIOMA === 'pt' ? 'Abrimos as portas da loja para mostrar ao vivo a nova geração Agras. Obrigado a todos os produtores que vieram!' : 'Abrimos las puertas del local para mostrar en vivo la nueva generación Agras. ¡Gracias a todos los productores que vinieron!'}</p>
          <div class="red" data-aparece><img src="media/marca/dragur-dji-color.svg" alt="Dragur · DJI Agriculture"><p><b>${t('red')}.</b> ${t('red_txt')}</p></div></div>
      </div></section>`;
  }
};

PAGINAS.contacto = {
  titulo: () => t('p_contacto'),
  html(){
    const d = Datos.get(), c = d.config, T = d.textos, cl = d.claudio, tels = c.telefonos.filter(Boolean);
    const mapa = 'https://maps.google.com/maps?q=' + encodeURIComponent(c.mapa || 'Rivera, Uruguay') + '&z=14&output=embed';
    return `<section class="bloque contacto"><div class="contenedor contacto-in">
        <div class="ct-txt"><span class="etiqueta"><i></i>${t('p_contacto')}</span><h1 class="titulo" data-dividir>${esc(tx(T.contactoTitulo))}</h1><p class="sub">${esc(tx(T.contactoSub))}</p>
          <a class="ct-claudio" href="${waLink(msjClaudio())}" target="_blank" rel="noopener" data-aparece><span class="ct-logo">${iconoDP({ cls: 'ct-dp' })}</span><div><b>Drones del Pampa</b><span>${IDIOMA === 'pt' ? 'Nossa equipe responde no mesmo dia' : 'Nuestro equipo te responde en el día'}</span></div><span class="btn btn-wa btn-chico">${icono('wa')} WhatsApp</span></a>
          <div class="ct-datos">
            <div data-aparece>${icono('telefono')}<small>${t('c_telefonos')}</small>${tels.map(n => `<a href="tel:${n.replace(/\D/g, '')}">${esc(n)}</a>`).join('')}</div>
            <div data-aparece>${icono('reloj')}<small>${t('c_horarios')}</small><span>${esc(tx(c.horarios))}</span></div>
            <div data-aparece>${icono('ubicacion')}<small>${t('c_direccion')}</small><span>${esc(tx(c.direccion))}</span><a class="enlace" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapa || 'Rivera, Uruguay')}">${t('como_llegar')} ${icono('flecha')}</a></div>
            ${c.email ? `<div data-aparece>${icono('mail')}<small>${t('c_email')}</small><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>` : ''}
          </div></div>
        <form class="ct-form" id="ct-form" novalidate data-aparece="der">
          <h3>${t('c_mensaje')}</h3>
          <div class="campo"><label>${t('c_motivo')}</label><div class="opciones">${['c_m_compra', 'c_m_rep', 'c_m_serv', 'c_m_curso', 'c_m_otro'].map((k, i) => `<label class="opcion"><input type="radio" name="motivo" value="${esc(t(k))}" ${i ? '' : 'checked'}><span>${t(k)}</span></label>`).join('')}</div></div>
          <div class="grilla-form"><div class="campo"><label>${t('f_nombre')}</label><input name="nombre" data-obl autocomplete="name"><span class="error">${t('f_obligatorio')}</span></div>
            <div class="campo"><label>${t('f_telefono')}</label><input name="tel" data-obl type="tel" autocomplete="tel"><span class="error">${t('f_obligatorio')}</span></div></div>
          <div class="campo"><label>${t('f_ciudad')}</label><input name="ciudad"></div>
          <div class="campo"><label>${t('c_mensaje')}</label><textarea name="msg" data-obl rows="4"></textarea><span class="error">${t('f_obligatorio')}</span></div>
          <button class="btn btn-azul" type="submit">${icono('wa')} ${t('c_enviar')}</button>
        </form>
      </div></section>
      <section class="ct-mapa"><iframe src="${esc(mapa)}" loading="lazy" title="Mapa" referrerpolicy="no-referrer-when-downgrade"></iframe></section>`;
  },
  alMostrar(v){
    $('#ct-form', v).onsubmit = e => {
      e.preventDefault(); const f = e.target; if (!validar(f)) return;
      const x = Object.fromEntries(new FormData(f).entries());
      Datos.get().mensajes.unshift({ id: Datos.nuevoId('msg'), fecha: new Date().toISOString(), idioma: IDIOMA, ...x }); Datos.guardar();
      window.open(waLink(`${x.motivo}: ${x.msg}\n— ${x.nombre} · ${x.tel}${x.ciudad ? ' · ' + x.ciudad : ''}`), '_blank', 'noopener');
      f.reset(); aviso(t('c_enviado'));
    };
  }
};

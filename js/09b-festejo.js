/* =====================================================================
   FESTEJO DE LA INSCRIPCIÓN (versión 2, 13/11/2026)
   Al inscribirse a un curso se abre una ventana de felicitaciones con
   papelitos de colores: «¡Felicitaciones, Juan! Ya estás inscripto…
   en las próximas horas nos comunicamos para confirmar tu lugar».
   Trae un comprobante con el número, los pasos que siguen, «Agregar a
   mi calendario» y, si quiere, avisarle a Claudio por WhatsApp.
   ===================================================================== */
const PT = () => IDIOMA === 'pt';
const primerNombre = n => String(n || '').trim().split(/\s+/)[0] || '';

function textosFestejo(c, v, espera){
  const nom = primerNombre(v.nombre), curso = tx(c.titulo);
  if (PT()) return espera ? {
    pre: `Obrigado, ${nom}!`, tit: 'Você está na lista de espera',
    txt: `As vagas de «${curso}» estão completas, mas guardamos o seu lugar na fila. Se abrir uma vaga, entramos em contato com você na hora.`
  } : {
    pre: `Parabéns, ${nom}!`, tit: 'Sua inscrição foi recebida',
    txt: `Você está inscrito no curso «${curso}». Nas próximas horas alguém da nossa equipe vai entrar em contato com você para confirmar a vaga e explicar como seguir.`
  };
  return espera ? {
    pre: `¡Gracias, ${nom}!`, tit: 'Quedaste en la lista de espera',
    txt: `Los cupos de «${curso}» están completos, pero te guardamos el lugar en la fila. Si se libera uno, te avisamos enseguida.`
  } : {
    pre: `¡Felicitaciones, ${nom}!`, tit: 'Ya estás inscripto al curso',
    txt: `Tu lugar en «${curso}» quedó reservado. En las próximas horas alguien de nuestro equipo se va a comunicar con vos para confirmar la inscripción y contarte cómo seguir.`
  };
}

const pasosFestejo = espera => PT()
  ? [['check', 'Recebemos a sua inscrição', 'Agora mesmo'], ['telefono', espera ? 'Avisamos se abrir uma vaga' : 'Entramos em contato para confirmar', espera ? 'Por WhatsApp ou telefone' : 'Nas próximas horas'], ['dron', 'Nos vemos no curso!', 'Traga vontade de voar']]
  : [['check', 'Recibimos tu inscripción', 'Recién'], ['telefono', espera ? 'Te avisamos si se libera un lugar' : 'Te contactamos para confirmar', espera ? 'Por WhatsApp o teléfono' : 'En las próximas horas'], ['dron', '¡Nos vemos en el curso!', 'Traé ganas de volar']];

function mensajeWaInscripcion(c, v, numero){
  return PT()
    ? `Olá, Drones del Pampa! 🙌 Acabei de me inscrever no curso «${tx(c.titulo)}» (${fechaLarga(c.fecha)}). Sou ${v.nombre} · ${v.tel}. Inscrição ${numero}. Fico no aguardo da confirmação. Obrigado!`
    : `¡Hola, Drones del Pampa! 🙌 Me acabo de inscribir al curso «${tx(c.titulo)}» del ${fechaLarga(c.fecha)}. Soy ${v.nombre} · ${v.tel}. Inscripción ${numero}. Quedo atento a la confirmación. ¡Gracias!`;
}

// Comprobante: el mismo en la ventana y en la caja del costado
function ticketInscripcion(c, numero){
  return `<div class="fe-ticket">
    <div class="fe-ticket-img"><img src="${esc(c.imagen)}" alt=""></div>
    <div class="fe-ticket-txt">
      <small>${PT() ? 'Curso' : 'Curso'}</small><b>${esc(tx(c.titulo))}</b>
      <div class="fe-ticket-datos"><span>${icono('calendario')}${esc(fechaLarga(c.fecha))}</span><span>${icono('ubicacion')}${esc(tx(c.lugar))}</span></div>
    </div>
    <div class="fe-ticket-num"><small>${PT() ? 'Inscrição' : 'Inscripción'}</small><b>${esc(numero)}</b></div>
  </div>`;
}

function cajaInscripto(c, v, numero, espera){
  const T = textosFestejo(c, v, espera);
  return `<div class="ok-caja">
    <svg viewBox="0 0 80 80" class="ok-anim"><circle cx="40" cy="40" r="36"/><path d="M24 41l11 11 22-24"/></svg>
    <h3>${esc(T.pre)}</h3><p>${esc(T.tit)}. ${PT() ? 'Logo entramos em contato com você para confirmar.' : 'En breve te contactamos para confirmar.'}</p>
    ${ticketInscripcion(c, numero)}
    <button class="btn btn-borde" onclick="calendarioCurso('${c.id}')">${icono('calendario')} ${PT() ? 'Adicionar à agenda' : 'Agregar a mi calendario'}</button>
    <a class="btn btn-borde" href="#/cursos">${PT() ? 'Ver outros cursos' : 'Ver otros cursos'}</a></div>`;
}

function festejarInscripcion(c, v, numero, espera){
  const T = textosFestejo(c, v, espera);
  abrirModal(`<div class="festejo ${espera ? 'espera' : ''}">
      <div class="fe-cielo">${fondoTopo()}</div>
      <div class="fe-sello"><span class="fe-onda"></span><span class="fe-onda b"></span>
        <svg viewBox="0 0 80 80" class="fe-check"><circle cx="40" cy="40" r="36"/><path d="M24 41l11 11 22-24"/></svg></div>
      <small class="fe-pre">${esc(T.pre)}</small>
      <h3 class="fe-tit">${esc(T.tit)}</h3>
      <p class="fe-txt">${esc(T.txt)}</p>
      ${ticketInscripcion(c, numero)}
      <ol class="fe-pasos">${pasosFestejo(espera).map(([ic, a, b], i) => `<li style="--i:${i}"><span>${icono(ic)}</span><div><b>${esc(a)}</b><small>${esc(b)}</small></div></li>`).join('')}</ol>
      <div class="fe-btns">
        <button class="btn btn-azul" onclick="cerrarModal()">${PT() ? 'Perfeito!' : '¡Genial!'}</button>
        <button class="btn btn-borde" onclick="calendarioCurso('${c.id}')">${icono('calendario')} ${PT() ? 'Adicionar à agenda' : 'Agregar a mi calendario'}</button>
      </div>
      <a class="fe-wa" href="${waLink(mensajeWaInscripcion(c, v, numero))}" target="_blank" rel="noopener">${icono('wa')} ${PT() ? 'Se preferir, avise a gente pelo WhatsApp' : 'Si querés, avisanos por WhatsApp'}</a>
    </div>`, { cls: 'chico modal-festejo', alAbrir: m => animarFestejo(m, espera) });
}

function animarFestejo(m, espera){
  if (!espera) confeti();
  if (!window.gsap || QUIETO) return;
  const tl = gsap.timeline({ delay: .15 });
  tl.from('.fe-sello', { scale: 0, rotate: -40, duration: .9, ease: 'back.out(2)' })
    .from('.fe-pre, .fe-tit, .fe-txt', { opacity: 0, y: 22, stagger: .08, duration: .7, ease: 'expo.out' }, '-=.45')
    .from('.festejo .fe-ticket', { opacity: 0, y: 30, rotateX: -25, transformOrigin: '50% 0', duration: .8, ease: 'expo.out' }, '-=.4')
    .from('.fe-pasos li', { opacity: 0, x: -20, stagger: .1, duration: .6, ease: 'expo.out' }, '-=.5')
    .from('.fe-btns > *, .fe-wa', { opacity: 0, y: 14, stagger: .06, duration: .5, ease: 'expo.out' }, '-=.4');
}

/* --- Papelitos de colores (los de la marca) --- */
function confeti(){
  if (QUIETO) return;
  const cv = document.createElement('canvas'); cv.className = 'confeti'; document.body.appendChild(cv);
  const g = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
  const cs = getComputedStyle(document.documentElement), col = ['--azul', '--verde', '--verde-claro', '--cielo', '--ambar'].map(k => cs.getPropertyValue(k).trim()).concat('#ffffff');
  const piezas = Array.from({ length: 170 }, (_, i) => {
    const izq = i % 2 === 0, a = (izq ? -60 : -120) * Math.PI / 180 + (Math.random() - .5) * .9, v = (9 + Math.random() * 9) * dpr;
    return { x: izq ? -10 : W + 10, y: H * .72, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: (6 + Math.random() * 7) * dpr, h: (8 + Math.random() * 10) * dpr,
      r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: col[i % col.length], f: Math.random() * 6, redondo: Math.random() < .25 };
  });
  const t0 = performance.now();
  (function cuadro(t){
    const dt = t - t0; g.clearRect(0, 0, W, H);
    for (const p of piezas) {
      p.vy += .32 * dpr; p.vx *= .985; p.vy *= .985; p.x += p.vx + Math.sin((t / 260) + p.f) * dpr; p.y += p.vy; p.r += p.vr;
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.globalAlpha = Math.max(0, 1 - Math.max(0, dt - 2600) / 900); g.fillStyle = p.c;
      if (p.redondo) { g.beginPath(); g.arc(0, 0, p.w / 2, 0, 6.283); g.fill(); } else g.fillRect(-p.w / 2, -p.h / 2 * Math.abs(Math.cos(t / 180 + p.f)), p.w, p.h * Math.abs(Math.cos(t / 180 + p.f)));
      g.restore();
    }
    if (dt < 3600) requestAnimationFrame(cuadro); else cv.remove();
  })(t0);
}

/* --- «Agregar a mi calendario»: archivo .ics que abre el calendario del celular o la compu --- */
function calendarioCurso(id){
  const c = cursoDe(id); if (!c) return;
  const f = String(c.fecha || '').replace(/-/g, ''), sig = (() => { const d = new Date(c.fecha + 'T12:00:00'); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10).replace(/-/g, ''); })();
  const lim = s => String(s || '').replace(/[,;\\]/g, m => '\\' + m).replace(/\n/g, ' ');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Drones del Pampa//Cursos//ES', 'BEGIN:VEVENT', 'UID:' + c.id + '-' + f + '@dronesdelpampa',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + f, 'DTEND;VALUE=DATE:' + sig,
    'SUMMARY:' + lim('Curso: ' + tx(c.titulo) + ' · Drones del Pampa'), 'LOCATION:' + lim(tx(c.lugar)),
    'DESCRIPTION:' + lim((PT() ? 'Duração: ' : 'Duración: ') + tx(c.duracion) + '. ' + (PT() ? 'Dúvidas: fale conosco pelo WhatsApp.' : 'Consultas: escribinos por WhatsApp.')),
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'curso-' + c.id + '.ics'; document.body.appendChild(a); a.click(); a.remove();
  aviso(PT() ? 'Pronto: abra o arquivo para adicionar à sua agenda.' : 'Listo: abrí el archivo para sumarlo a tu calendario.');
}

/* =====================================================================
   PÁGINA · INSCRIPCIÓN DEL DRON ANTE DINACIA (#/dinacia) — versión 2
   El taller ofrece hacer el trámite: el cliente completa un formulario
   en 6 pasos (propietario, dron, piloto, uso, documentos y seguro),
   revisa y envía. Queda en Administrar › Inscripciones DINACIA.
   Requisitos según la Resolución DINACIA 291/2014 (vigente; reafirmada
   en el comunicado de enero de 2026), la circular CA.UY.PEL.07.02 (permiso
   DAOD) y el comunicado del MGAP de 2022 (aplicación con drones).
   ⚠ A confirmar con DINACIA antes de la versión real: si un tercero puede
   registrar en el portal utm.dinacia.gub.uy, qué campos son obligatorios
   y qué seguro mínimo piden.
   ===================================================================== */
const LG = (es, pt) => IDIOMA === 'pt' ? pt : es;
const MODELOS_DINACIA = ['DJI Agras T100', 'DJI Agras T70P', 'DJI Agras T50', 'DJI Agras T25P', 'DJI Agras T40', 'DJI Agras T30', 'DJI Agras T20P', 'DJI Mavic 3M'];
const DEPTOS = ['Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo', 'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto', 'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'];
let _din = null, _dinPaso = 0;
const dinNuevo = () => ({ persona: 'fisica', nacionalidad: 'Uruguaya', depto: 'Rivera', fabricante: 'DJI', modelo: 'DJI Agras T50', piloSoy: 'si', uruguayo: 'si', daod: 'no', habil: 'no', aplicador: 'no',
  uso: 'propio', fito: 'si', zonas: ['Rivera'], seguro: 'no', ayudaSeguro: true, docs: {} });

const PASOS_DIN = () => [
  [LG('Propietario', 'Proprietário'), 'usuarios'], [LG('El dron', 'O drone'), 'dron'], [LG('Piloto', 'Piloto'), 'control'],
  [LG('Uso', 'Uso'), 'gota'], [LG('Documentos', 'Documentos'), 'subir'], [LG('Seguro y envío', 'Seguro e envio'), 'escudo']];

PAGINAS.dinacia = {
  titulo: () => LG('Inscripción ante DINACIA', 'Registro na DINACIA'),
  html(){
    const cats = [
      ['menor', LG('Hasta 25 kg', 'Até 25 kg'), LG('Menores', 'Menores'), LG('Uso recreativo: no necesitan registro ni permiso. Hasta 120 m de altura y siempre a la vista.', 'Uso recreativo: não precisam de registro nem permissão. Até 120 m de altura e sempre à vista.'), ''],
      ['mediano', LG('De 25 kg a 260 kg', 'De 25 kg a 260 kg'), LG('Medianos · acá entran los Agras', 'Médios · aqui entram os Agras'), LG('Se inscriben en el registro técnico de DINACIA, llevan un número visible y el piloto necesita permiso DAOD con habilitación para ese modelo.', 'São inscritos no registro técnico da DINACIA, levam um número visível e o piloto precisa de permissão DAOD com habilitação para esse modelo.'), 'T25P · T50 · T70P · T100'],
      ['mayor', LG('Más de 260 kg vacío', 'Mais de 260 kg vazio'), LG('Mayores (RPAS)', 'Maiores (RPAS)'), LG('Tienen su propio régimen, como una aeronave. No es el caso de los drones agrícolas DJI.', 'Têm regime próprio, como uma aeronave. Não é o caso dos drones agrícolas DJI.'), '']];
    const req = [
      ['dron', LG('Registro del dron', 'Registro do drone'), LG('Gratis y en línea. DINACIA le da un número que tiene que verse a los costados, arriba y abajo del dron.', 'Grátis e online. A DINACIA dá um número que deve ficar visível nas laterais, em cima e embaixo do drone.')],
      ['control', LG('Permiso del piloto (DAOD)', 'Permissão do piloto (DAOD)'), LG('Mayor de 18, Ciclo Básico, carné de salud, curso en un instituto autorizado y prueba ante DINACIA. Para más de 25 kg, habilitación en ese modelo.', 'Maior de 18 anos, ensino básico, atestado de saúde, curso em instituto autorizado e prova na DINACIA. Para mais de 25 kg, habilitação nesse modelo.')],
      ['escudo', LG('Trabajo aéreo (si cobrás)', 'Trabalho aéreo (se cobra)'), LG('Si hacés aplicaciones para terceros, es trabajo aéreo: pide seguro de responsabilidad civil, factura del dron y constancias de BPS y DGI.', 'Se faz aplicações para terceiros, é trabalho aéreo: exige seguro de responsabilidade civil, nota fiscal do drone e certidões de BPS e DGI.')],
      ['gota', LG('MGAP, si aplicás fitosanitarios', 'MGAP, se aplica defensivos'), LG('Inscripción en el RUO, el dron en el Registro de Equipos Aplicadores (lleva un sticker) y carné de aplicador para piloto y ayudante.', 'Inscrição no RUO, o drone no Registro de Equipamentos Aplicadores (leva um adesivo) e carteira de aplicador para piloto e ajudante.')]];
    const como = [
      [LG('Completás el formulario', 'Você preenche o formulário'), LG('Desde el celular, en unos 10 minutos. Las fotos las sacás ahí mismo.', 'Pelo celular, em uns 10 minutos. As fotos você tira ali mesmo.')],
      [LG('Revisamos todo', 'Revisamos tudo'), LG('Nuestro equipo controla que no falte nada y te avisa si hay que sumar algo.', 'Nossa equipe confere que não falte nada e avisa se precisar de algo mais.')],
      [LG('Presentamos el trámite', 'Apresentamos o processo'), LG('Hacemos la presentación ante DINACIA (y el MGAP si corresponde) y lo seguimos por vos.', 'Fazemos a apresentação na DINACIA (e no MGAP, se for o caso) e acompanhamos por você.')],
      [LG('Tu dron, en regla', 'Seu drone, em dia'), LG('Te entregamos el número de registro y te lo dejamos puesto en el dron.', 'Entregamos o número de registro e deixamos colocado no drone.')]];
    return `
    <section class="din-hero">
      <div class="din-hero-fondo">${fondoTopo()}</div>
      <div class="contenedor din-hero-in">
        <div class="din-hero-txt">
          <span class="etiqueta"><i></i>${LG('Nuevo servicio', 'Novo serviço')} · DINACIA</span>
          <h1 class="titulo" data-dividir>${LG('Inscribí tu dron ante DINACIA, sin vueltas', 'Registre seu drone na DINACIA, sem complicação')}</h1>
          <p class="sub">${LG('Nos encargamos del trámite: completás un formulario, revisamos que esté todo y lo presentamos por vos. Vos seguís volando.', 'Nós cuidamos do processo: você preenche um formulário, revisamos que esteja tudo certo e apresentamos por você. Você continua voando.')}</p>
          <div class="din-hero-btns"><button class="btn btn-azul magnetico" onclick="irAFormDin()">${LG('Empezar la inscripción', 'Começar o registro')} ${icono('flecha')}</button>
            <a class="btn btn-borde" href="${waLink(LG('¡Hola, Drones del Pampa! Quiero consultar por la inscripción de mi dron ante DINACIA.', 'Olá, Drones del Pampa! Quero consultar sobre o registro do meu drone na DINACIA.'))}" target="_blank" rel="noopener">${icono('wa')} ${LG('Consultar por WhatsApp', 'Consultar pelo WhatsApp')}</a></div>
          <ul class="din-chips"><li>${icono('check')}${LG('Drones de más de 25 kg', 'Drones de mais de 25 kg')}</li><li>${icono('check')}${LG('Uso propio o para terceros', 'Uso próprio ou para terceiros')}</li><li>${icono('check')}${LG('Te avisamos cada paso', 'Avisamos cada etapa')}</li></ul>
        </div>
        <div class="din-carne" data-aparece="der">
          <div class="din-carne-cab"><span>${iconoDP({ cls: 'din-carne-logo' })}</span><div><small>${LG('Registro técnico', 'Registro técnico')}</small><b>DINACIA · Uruguay</b></div></div>
          <img src="media/drones/t50-45.png" alt="" class="din-carne-dron">
          <div class="din-carne-datos"><div><small>${LG('Modelo', 'Modelo')}</small><b>DJI Agras T50</b></div><div><small>${LG('Categoría', 'Categoria')}</small><b>${LG('Mediano', 'Médio')}</b></div>
            <div><small>N° ${LG('de registro', 'de registro')}</small><b class="din-num">UY-DAOD-0000</b></div><div><small>${LG('Estado', 'Situação')}</small><b class="din-ok">${icono('check')} ${LG('En regla', 'Em dia')}</b></div></div>
          <span class="din-sello">${LG('Ejemplo', 'Exemplo')}</span>
        </div>
      </div>
    </section>

    <section class="bloque"><div class="contenedor">
      <div class="cabecera"><div><span class="etiqueta"><i></i>${LG('Según el peso', 'Conforme o peso')}</span><h2 class="titulo chico" data-dividir>${LG('¿En qué categoría está tu dron?', 'Em que categoria está seu drone?')}</h2></div></div>
      <div class="din-cats">${cats.map(([k, peso, n, d, ej]) => `<article class="din-cat ${k}" data-aparece><span class="din-peso">${peso}</span><h3>${n}</h3><p>${d}</p>${ej ? `<span class="chip azul">${ej}</span>` : ''}</article>`).join('')}</div>
      <div class="din-reqs">${req.map(([ic, tit, d]) => `<div class="din-req" data-aparece><span>${icono(ic)}</span><b>${tit}</b><p>${d}</p></div>`).join('')}</div>
    </div></section>

    <section class="bloque noche din-como"><div class="contenedor">
      <div class="cabecera"><div><span class="etiqueta"><i></i>${LG('Cómo funciona', 'Como funciona')}</span><h2 class="titulo chico" data-dividir>${LG('Vos completás, nosotros hacemos el resto', 'Você preenche, nós fazemos o resto')}</h2></div></div>
      <ol class="din-pasos">${como.map(([a, b], i) => `<li data-aparece><span>${String(i + 1).padStart(2, '0')}</span><b>${a}</b><p>${b}</p></li>`).join('')}</ol>
    </div></section>

    <section class="bloque niebla" id="din-form-zona"><div class="contenedor din-form-in">
      <aside class="din-lado">
        <span class="etiqueta"><i></i>${LG('Formulario', 'Formulário')}</span>
        <h2 class="titulo chico">${LG('Datos para la inscripción', 'Dados para o registro')}</h2>
        <p class="sub">${LG('Lo que no sepas, dejalo en blanco: te ayudamos a completarlo. Se guarda solo mientras lo llenás.', 'O que não souber, deixe em branco: ajudamos a completar. Fica salvo enquanto você preenche.')}</p>
        <ol class="din-indice" id="din-indice"></ol>
        <a class="din-claudio" href="${waLink(LG('¡Hola, Drones del Pampa! Tengo una duda con la inscripción ante DINACIA.', 'Olá, Drones del Pampa! Tenho uma dúvida sobre o registro na DINACIA.'))}" target="_blank" rel="noopener"><span class="din-dp">${icono('wa')}</span><span>${LG('¿Dudas con algún dato? Escribinos y lo vemos juntos.', 'Dúvidas com algum dado? Escreva para a gente e vemos juntos.')}</span></a>
      </aside>
      <div class="din-form" id="din-form"></div>
    </div></section>

    <section class="bloque"><div class="contenedor faq-in">
      <div><span class="etiqueta"><i></i>FAQ</span><h2 class="titulo chico" data-dividir>${t('preguntas')}</h2>
        <p class="din-fuente">${LG('Información según la Resolución DINACIA 291/2014, la circular CA.UY.PEL.07.02 y el MGAP. Los requisitos los define cada organismo y pueden cambiar: te confirmamos todo antes de presentar.', 'Informação conforme a Resolução DINACIA 291/2014, a circular CA.UY.PEL.07.02 e o MGAP. Os requisitos são definidos por cada órgão e podem mudar: confirmamos tudo antes de apresentar.')}</p></div>
      <div class="faq">${faqDinacia().map(([p, r]) => `<details class="faq-item" data-aparece><summary>${p}<i>${icono('mas')}</i></summary><p>${r}</p></details>`).join('')}</div>
    </div></section>`;
  },
  alMostrar(v){
    try { _din = JSON.parse(sessionStorage.getItem('dp_dinacia') || 'null'); } catch (e) { _din = null; }
    if (!_din) { _din = dinNuevo(); _dinPaso = 0; }
    pintarDin();
    $$('.faq-item', v).forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq-item', v).forEach(o => { if (o !== d) o.open = false; }); }));
  }
};

function faqDinacia(){
  return [
    [LG('¿Cuánto cuesta el registro?', 'Quanto custa o registro?'), LG('El registro del dron en DINACIA y el permiso de trabajo aéreo no tienen costo. El permiso del piloto (DAOD) y el registro en el MGAP tienen aranceles chicos. El costo de nuestra gestión te lo pasamos por WhatsApp.', 'O registro do drone na DINACIA e a permissão de trabalho aéreo não têm custo. A permissão do piloto (DAOD) e o registro no MGAP têm taxas pequenas. O custo da nossa gestão informamos pelo WhatsApp.')],
    [LG('Uso el dron solo en mi campo, ¿igual tengo que registrarlo?', 'Uso o drone só no meu campo, mesmo assim preciso registrar?'), LG('Sí. Todos los drones de más de 25 kg se registran, y aplicar fitosanitarios con drones cuenta como aplicación aérea para el MGAP también en uso propio.', 'Sim. Todos os drones de mais de 25 kg são registrados, e aplicar defensivos com drone conta como aplicação aérea para o MGAP também em uso próprio.')],
    [LG('¿Qué pasa si todavía no tengo permiso de piloto?', 'E se ainda não tenho permissão de piloto?'), LG('Podés empezar igual: el dron se registra y en paralelo te anotamos al curso para el permiso DAOD y la habilitación en tu modelo.', 'Pode começar assim mesmo: o drone é registrado e em paralelo inscrevemos você no curso para a permissão DAOD e a habilitação no seu modelo.')],
    [LG('¿Dónde va el número de registro?', 'Onde vai o número de registro?'), LG('Tiene que verse a los dos costados y en la parte de arriba y de abajo del dron. Cuando esté listo, te lo dejamos puesto.', 'Deve ficar visível nas duas laterais e na parte de cima e de baixo do drone. Quando estiver pronto, deixamos colocado.')],
    [LG('¿Es obligatorio el seguro?', 'O seguro é obrigatório?'), LG('Si hacés trabajos para terceros, sí: seguro de responsabilidad civil. Si no tenés, marcá «Quiero que me ayuden» y te ponemos en contacto.', 'Se faz trabalhos para terceiros, sim: seguro de responsabilidade civil. Se não tem, marque «Quero ajuda» e colocamos você em contato.')]];
}

function irAFormDin(){ const el = $('#din-form-zona'); if (!el) return; if (window.lenis) window.lenis.scrollTo(el, { offset: -70, duration: 1.4 }); else el.scrollIntoView({ behavior: 'smooth' }); }
function guardarBorradorDin(){ try { sessionStorage.setItem('dp_dinacia', JSON.stringify(_din)); } catch (e) {} }

/* --- Campos --- */
const dinCampo = (k, label, opc = {}) => `<div class="campo ${opc.ancho ? 'ancho' : ''}"><label>${label}${opc.obl ? ' <i class="obl">*</i>' : ''}</label>
  ${opc.select ? `<select data-din="${k}" ${opc.obl ? 'data-obl' : ''}>${opc.select.map(o => `<option ${_din[k] === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`
    : opc.area ? `<textarea data-din="${k}" rows="3">${esc(_din[k] || '')}</textarea>`
    : `<input data-din="${k}" value="${esc(_din[k] || '')}" ${opc.tipo ? `type="${opc.tipo}"` : ''} ${opc.modo ? `inputmode="${opc.modo}"` : ''} ${opc.auto ? `autocomplete="${opc.auto}"` : ''} ${opc.obl ? 'data-obl' : ''} ${opc.ph ? `placeholder="${esc(opc.ph)}"` : ''}>`}
  ${opc.ayuda ? `<small class="ayuda">${opc.ayuda}</small>` : ''}<span class="error">${opc.tipo === 'email' ? t('f_mail_mal') : t('f_obligatorio')}</span></div>`;
const dinElegir = (k, label, ops) => `<div class="campo ancho"><label>${label}</label><div class="din-elegir">${ops.map(([v, txt, sub]) =>
  `<button type="button" class="${_din[k] === v ? 'act' : ''}" onclick="dinSet('${k}','${v}')"><b>${txt}</b>${sub ? `<small>${sub}</small>` : ''}</button>`).join('')}</div></div>`;
const SI_NO = () => [['si', LG('Sí', 'Sim')], ['no', LG('No', 'Não')]];
function dinSet(k, v){ leerDin(); _din[k] = v; guardarBorradorDin(); pintarDin(true); }
function dinZona(z){ leerDin(); const s = new Set(_din.zonas || []); s.has(z) ? s.delete(z) : s.add(z); _din.zonas = [...s]; guardarBorradorDin(); pintarDin(true); }
function leerDin(){ $$('[data-din]').forEach(el => { _din[el.dataset.din] = el.type === 'checkbox' ? el.checked : el.value; }); guardarBorradorDin(); }

function pasoDinHTML(p){
  const d = _din;
  if (p === 0) return `
    ${dinElegir('persona', LG('¿A nombre de quién va el dron?', 'Em nome de quem fica o drone?'), [['fisica', LG('Persona', 'Pessoa física'), LG('Productor o piloto', 'Produtor ou piloto')], ['empresa', LG('Empresa', 'Empresa'), LG('Con RUT', 'Com CNPJ/RUT')]])}
    <div class="grilla-form">
      ${d.persona === 'empresa' ? dinCampo('razon', LG('Razón social', 'Razão social'), { obl: 1, ancho: 1 }) + dinCampo('rut', 'RUT', { obl: 1, modo: 'numeric' }) + dinCampo('fantasia', LG('Nombre comercial', 'Nome fantasia'))
        + dinCampo('nombre', LG('Persona de contacto', 'Pessoa de contato'), { obl: 1, auto: 'name' }) + dinCampo('ci', LG('Cédula del contacto', 'Documento do contato'), { modo: 'numeric' })
        : dinCampo('nombre', LG('Nombre y apellido', 'Nome e sobrenome'), { obl: 1, auto: 'name', ancho: 1 }) + dinCampo('ci', LG('Cédula de identidad', 'Documento de identidade'), { obl: 1, modo: 'numeric' }) + dinCampo('nacionalidad', LG('Nacionalidad', 'Nacionalidade'), { obl: 1 })}
      ${dinCampo('domicilio', LG('Domicilio (calle, número, localidad)', 'Endereço (rua, número, cidade)'), { obl: 1, ancho: 1, auto: 'street-address' })}
      ${dinCampo('depto', LG('Departamento', 'Departamento'), { select: DEPTOS, obl: 1 })}
      ${dinCampo('tel', LG('Celular', 'Celular'), { obl: 1, tipo: 'tel', auto: 'tel' })}
      ${dinCampo('email', 'E-mail', { obl: 1, tipo: 'email', auto: 'email', ancho: 1 })}
    </div>`;
  if (p === 1) return `
    <div class="din-modelos">${MODELOS_DINACIA.concat(LG('Otro', 'Outro')).map(m => `<button type="button" class="${d.modelo === m ? 'act' : ''}" onclick="dinSet('modelo','${m}')">${m.replace('DJI ', '')}</button>`).join('')}</div>
    <div class="grilla-form">
      ${d.modelo === LG('Otro', 'Outro') ? dinCampo('fabricante', LG('Fabricante', 'Fabricante'), { obl: 1 }) + dinCampo('modeloOtro', LG('Modelo', 'Modelo'), { obl: 1 }) : ''}
      ${dinCampo('serie', LG('N° de serie del dron', 'N° de série do drone'), { obl: 1, ayuda: LG('Está en la etiqueta del cuerpo del dron y en la caja.', 'Está na etiqueta do corpo do drone e na caixa.') })}
      ${dinCampo('serieControl', LG('N° de serie del control', 'N° de série do controle'), { obl: 1 })}
      ${dinCampo('anio', LG('Año', 'Ano'), { modo: 'numeric', ph: '2026' })}
      ${dinCampo('tanque', LG('Tanque o carga (L o kg)', 'Tanque ou carga (L ou kg)'))}
      ${dinCampo('pesoVacio', LG('Peso vacío (kg)', 'Peso vazio (kg)'), { modo: 'decimal', ayuda: LG('Si no lo sabés, lo completamos nosotros.', 'Se não souber, completamos nós.') })}
      ${dinCampo('pesoMax', LG('Peso máximo de despegue (kg)', 'Peso máximo de decolagem (kg)'), { modo: 'decimal' })}
      ${dinCampo('regPrevio', LG('N° de registro DINACIA (si ya tiene)', 'N° de registro DINACIA (se já tem)'))}
      ${dinCampo('rea', LG('N° del REA del MGAP (si ya tiene)', 'N° do REA do MGAP (se já tem)'))}
      ${dinElegir('comprado', LG('¿Lo compraste en Drones del Pampa?', 'Comprou na Drones del Pampa?'), SI_NO())}
    </div>`;
  if (p === 2) return `
    ${dinElegir('piloSoy', LG('¿Quién lo va a volar?', 'Quem vai pilotar?'), [['si', LG('Yo mismo', 'Eu mesmo')], ['no', LG('Otra persona', 'Outra pessoa')]])}
    <div class="grilla-form">
      ${d.piloSoy === 'no' ? dinCampo('piloNombre', LG('Nombre del piloto', 'Nome do piloto'), { obl: 1 }) + dinCampo('piloCi', LG('Cédula del piloto', 'Documento do piloto'), { obl: 1, modo: 'numeric' }) : ''}
      ${dinElegir('uruguayo', LG('¿Es ciudadano uruguayo?', 'É cidadão uruguaio?'), SI_NO())}
      ${dinElegir('daod', LG('¿Tiene permiso de operador DAOD?', 'Tem permissão de operador DAOD?'), [['si', LG('Sí', 'Sim')], ['no', LG('No', 'Não')], ['curso', LG('Quiero hacer el curso', 'Quero fazer o curso'), LG('Te anotamos', 'Inscrevemos você')]])}
      ${d.daod === 'si' ? dinCampo('daodNum', LG('N° de permiso', 'N° da permissão')) + dinCampo('daodVence', LG('Vence', 'Vence'), { tipo: 'date' })
        + dinElegir('habil', LG('¿Tiene la habilitación para más de 25 kg en este modelo?', 'Tem a habilitação para mais de 25 kg neste modelo?'), SI_NO()) : ''}
      ${dinCampo('salud', LG('Vencimiento del carné de salud', 'Vencimento do atestado de saúde'), { tipo: 'date' })}
    </div>
    ${d.uruguayo === 'no' ? `<p class="din-aviso">${icono('estrella')} ${LG('Para el permiso de operador DINACIA pide ciudadanía uruguaya. Lo vemos con vos: puede volarlo otra persona habilitada.', 'Para a permissão de operador a DINACIA exige cidadania uruguaia. Vemos com você: outra pessoa habilitada pode pilotar.')}</p>` : ''}`;
  if (p === 3) return `
    ${dinElegir('uso', LG('¿Para qué lo vas a usar?', 'Para que vai usar?'), [['propio', LG('En mi campo', 'No meu campo'), LG('Sin cobrar', 'Sem cobrar')], ['terceros', LG('Servicio a terceros', 'Serviço para terceiros'), LG('Trabajo aéreo', 'Trabalho aéreo')]])}
    ${dinElegir('fito', LG('¿Vas a aplicar fitosanitarios?', 'Vai aplicar defensivos?'), [['si', LG('Sí', 'Sim'), LG('Suma el MGAP', 'Inclui o MGAP')], ['no', LG('No', 'Não'), LG('Siembra, fertilizante, mapeo', 'Semeadura, fertilizante, mapeamento')]])}
    ${d.fito === 'si' ? `<div class="grilla-form">${dinElegir('aplicador', LG('¿Tiene carné de aplicador (DGSA)?', 'Tem carteira de aplicador (DGSA)?'), SI_NO())}${dinElegir('ruo', LG('¿Está inscripto en el RUO?', 'Está inscrito no RUO?'), [['si', LG('Sí', 'Sim')], ['no', LG('No', 'Não')], ['nose', LG('No sé', 'Não sei')]])}</div>` : ''}
    <div class="campo ancho"><label>${LG('Departamentos donde va a trabajar', 'Departamentos onde vai trabalhar')}</label><div class="din-zonas">${DEPTOS.map(z => `<button type="button" class="${(d.zonas || []).includes(z) ? 'act' : ''}" onclick="dinZona('${z}')">${z}</button>`).join('')}</div></div>
    <div class="grilla-form">${dinCampo('base', LG('¿Dónde se guarda el equipo?', 'Onde o equipamento fica guardado?'), { ancho: 1, ph: LG('Ej.: Establecimiento La Aurora, ruta 5 km 480', 'Ex.: Fazenda La Aurora, rota 5 km 480') })}</div>
    ${d.uso === 'terceros' ? `<p class="din-aviso">${icono('escudo')} ${LG('Como es trabajo aéreo, en el paso de documentos te vamos a pedir también las constancias de BPS y DGI.', 'Como é trabalho aéreo, na etapa de documentos vamos pedir também as certidões de BPS e DGI.')}</p>` : ''}`;
  if (p === 4) {
    const docs = [['ci', LG('Cédula (frente y dorso)', 'Documento (frente e verso)'), 1], ['etiqueta', LG('Foto de la etiqueta con el N° de serie', 'Foto da etiqueta com o N° de série'), 1], ['fotos', LG('Fotos del dron (frente y costado)', 'Fotos do drone (frente e lateral)'), 1],
      ['factura', LG('Factura de compra o contrato de arrendamiento', 'Nota fiscal de compra ou contrato de arrendamento'), 1], ['salud', LG('Carné de salud', 'Atestado de saúde'), 0], ['daod', LG('Permiso DAOD (si tiene)', 'Permissão DAOD (se tem)'), 0]];
    if (d.uso === 'terceros') docs.push(['bps', LG('Certificado común de BPS', 'Certidão de BPS'), 0], ['dgi', LG('Constancias de DGI (6905 y 6951)', 'Certidões da DGI (6905 e 6951)'), 0], ['ingresos', LG('Certificado de ingresos', 'Comprovante de rendimentos'), 0]);
    return `<p class="din-nota">${icono('ojo')} ${LG('Podés sacar la foto con el celular o subir un PDF. Si te falta alguno, mandalo después por WhatsApp.', 'Pode tirar a foto com o celular ou enviar um PDF. Se faltar algum, mande depois pelo WhatsApp.')}</p>
      <div class="din-docs">${docs.map(([k, n, obl]) => { const f = d.docs[k]; return `<label class="din-doc ${f ? 'ok' : ''}">
        <input type="file" accept="image/*,application/pdf" ${k === 'fotos' || k === 'ci' ? 'multiple' : ''} onchange="dinArchivo('${k}', this)">
        <span class="din-doc-ico">${icono(f ? 'check' : 'subir')}</span><span class="din-doc-txt"><b>${n}${obl ? ' <i class="obl">*</i>' : ''}</b><small>${f ? esc(f) : LG('Tocá para sacar foto o elegir', 'Toque para tirar foto ou escolher')}</small></span></label>`; }).join('')}</div>`;
  }
  return `
    ${dinElegir('seguro', LG('¿Tiene seguro de responsabilidad civil?', 'Tem seguro de responsabilidade civil?'), SI_NO())}
    ${d.seguro === 'si' ? `<div class="grilla-form">${dinCampo('aseguradora', LG('Aseguradora', 'Seguradora'))}${dinCampo('poliza', LG('N° de póliza', 'N° da apólice'))}${dinCampo('monto', LG('Monto asegurado', 'Valor segurado'))}${dinCampo('segVence', LG('Vigente hasta', 'Válido até'), { tipo: 'date' })}</div>`
      : `<label class="f-switch din-switch"><input type="checkbox" data-din="ayudaSeguro" ${d.ayudaSeguro ? 'checked' : ''}><span></span>${LG('Quiero que me ayuden a conseguirlo', 'Quero ajuda para conseguir')}</label>`}
    ${dinCampo('obs', LG('¿Algo más que quieras contarnos?', 'Algo mais que queira contar?'), { area: 1 })}
    <div class="din-resumen">${resumenDin()}</div>
    <label class="din-acepto"><input type="checkbox" data-din="acepto" ${d.acepto ? 'checked' : ''}><span>${LG('Autorizo a Drones del Pampa a usar estos datos solo para hacer el trámite ante DINACIA y el MGAP.', 'Autorizo a Drones del Pampa a usar estes dados só para o processo na DINACIA e no MGAP.')}</span></label>`;
}

function resumenDin(){
  const d = _din, fila = (k, v) => v ? `<div><small>${k}</small><b>${esc(v)}</b></div>` : '';
  return `<h4>${LG('Revisá antes de enviar', 'Revise antes de enviar')}</h4><div class="din-res-grilla">
    ${fila(LG('Propietario', 'Proprietário'), d.persona === 'empresa' ? d.razon : d.nombre)}${fila(d.persona === 'empresa' ? 'RUT' : LG('Cédula', 'Documento'), d.persona === 'empresa' ? d.rut : d.ci)}
    ${fila(LG('Dron', 'Drone'), d.modelo === LG('Otro', 'Outro') ? (d.fabricante + ' ' + (d.modeloOtro || '')) : d.modelo)}${fila(LG('N° de serie', 'N° de série'), d.serie)}
    ${fila(LG('Uso', 'Uso'), d.uso === 'terceros' ? LG('Servicio a terceros', 'Serviço para terceiros') : LG('En mi campo', 'No meu campo'))}${fila(LG('Zonas', 'Regiões'), (d.zonas || []).join(', '))}
    ${fila(LG('Documentos', 'Documentos'), Object.keys(d.docs || {}).length + ' ' + LG('cargados', 'enviados'))}</div>`;
}

function dinArchivo(k, inp){
  const fs = [...inp.files]; if (!fs.length) return;
  leerDin(); _din.docs[k] = fs.map(f => f.name).join(', ');   // en la demo se guarda solo el nombre; en la versión real el archivo va al Drive del taller
  guardarBorradorDin(); pintarDin(true); aviso(LG('Archivo cargado', 'Arquivo enviado'));
}

function faltaDin(p){
  const f = $('#din-form'); let ok = validar(f);
  if (ok && p === 4) { const falta = ['ci', 'etiqueta', 'fotos', 'factura'].filter(k => !_din.docs[k]);
    if (falta.length && !confirm(LG('Faltan documentos obligatorios. ¿Seguir igual y mandarlos después por WhatsApp?', 'Faltam documentos obrigatórios. Continuar mesmo assim e enviar depois pelo WhatsApp?'))) ok = false; }
  if (ok && p === 5 && !_din.acepto) { aviso(LG('Falta marcar la autorización', 'Falta marcar a autorização'), 'error'); ok = false; }
  return !ok;
}

function pintarDin(quieto){
  const f = $('#din-form'); if (!f) return;
  const pasos = PASOS_DIN(), p = _dinPaso, ult = p === pasos.length - 1;
  $('#din-indice').innerHTML = pasos.map(([n, ic], i) => `<li class="${i === p ? 'act' : i < p ? 'hecho' : ''}"><button type="button" onclick="dinIr(${i})" ${i > p ? 'disabled' : ''}><span>${icono(i < p ? 'check' : ic)}</span>${n}</button></li>`).join('');
  f.innerHTML = `<div class="din-barra"><i style="width:${(p + 1) / pasos.length * 100}%"></i></div>
    <div class="din-cab"><small>${LG('Paso', 'Etapa')} ${p + 1} ${LG('de', 'de')} ${pasos.length}</small><h3>${icono(pasos[p][1])} ${pasos[p][0]}</h3></div>
    <div class="din-cuerpo">${pasoDinHTML(p)}</div>
    <div class="din-pie">${p ? `<button type="button" class="btn btn-borde" onclick="dinIr(${p - 1})">${icono('flecha')} ${LG('Atrás', 'Voltar')}</button>` : '<span></span>'}
      <button type="button" class="btn ${ult ? 'btn-verde' : 'btn-azul'}" onclick="${ult ? 'enviarDin()' : `dinIr(${p + 1})`}">${ult ? LG('Enviar la inscripción', 'Enviar o registro') : LG('Siguiente', 'Próximo')} ${icono(ult ? 'check' : 'flecha')}</button></div>`;
  $$('[data-din]', f).forEach(el => el.addEventListener('change', leerDin));
  if (!quieto && window.gsap && !QUIETO) gsap.from($$('.din-cuerpo > *', f), { opacity: 0, y: 16, stagger: .04, duration: .5, ease: 'expo.out' });
}
function dinIr(i){
  leerDin();
  if (i > _dinPaso && faltaDin(_dinPaso)) return;
  _dinPaso = i; guardarBorradorDin(); pintarDin();
  const z = $('#din-form'); if (z && z.getBoundingClientRect().top < 60) { if (window.lenis) window.lenis.scrollTo(z, { offset: -100, duration: .8 }); else z.scrollIntoView({ behavior: 'smooth' }); }
}

function enviarDin(){
  leerDin(); if (faltaDin(_dinPaso)) return;
  const numero = 'DIN-' + String(Date.now()).slice(-5);
  const reg = { id: Datos.nuevoId('din'), numero, fecha: new Date().toISOString(), estado: 'nuevo', idioma: IDIOMA, ...JSON.parse(JSON.stringify(_din)) };
  const D = Datos.get(); D.dinacia = D.dinacia || []; D.dinacia.unshift(reg); Datos.guardar();
  try { sessionStorage.removeItem('dp_dinacia'); } catch (e) {}
  const nom = primerNombre(reg.nombre), modelo = reg.modelo === LG('Otro', 'Outro') ? reg.fabricante + ' ' + (reg.modeloOtro || '') : reg.modelo;
  const msg = LG(`¡Hola, Drones del Pampa! Acabo de mandar la inscripción de mi dron ante DINACIA por la página (${numero}). ${modelo} · N° ${reg.serie}. Soy ${reg.nombre} · ${reg.tel}.`,
    `Olá, Drones del Pampa! Acabei de enviar o registro do meu drone na DINACIA pelo site (${numero}). ${modelo} · N° ${reg.serie}. Sou ${reg.nombre} · ${reg.tel}.`);
  $('#din-form').innerHTML = `<div class="ok-caja din-ok-caja"><svg viewBox="0 0 80 80" class="ok-anim"><circle cx="40" cy="40" r="36"/><path d="M24 41l11 11 22-24"/></svg>
    <h3>${LG(`¡Listo, ${nom}! Recibimos tu inscripción`, `Pronto, ${nom}! Recebemos o seu registro`)}</h3>
    <p>${LG('Nuestro equipo la revisa y en las próximas horas te escribe para confirmar los datos y contarte cómo sigue el trámite.', 'Nossa equipe revisa e nas próximas horas escreve para confirmar os dados e explicar como segue o processo.')}</p>
    <div class="din-num-final"><small>${LG('Tu número de trámite', 'Seu número de processo')}</small><b>${numero}</b></div>
    <a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">${icono('wa')} ${LG('Avisarnos por WhatsApp', 'Avisar pelo WhatsApp')}</a></div>`;
  $('#din-indice').innerHTML = PASOS_DIN().map(([n]) => `<li class="hecho"><button type="button" disabled><span>${icono('check')}</span>${n}</button></li>`).join('');
  _din = dinNuevo(); _dinPaso = 0;
  if (typeof confeti === 'function') confeti();
}

/* --- Administrar › Inscripciones DINACIA --- */
const ESTADOS_DIN = ['nuevo', 'revisando', 'falta documentación', 'presentado', 'registrado'];
function adminDinacia(){
  const lista = Datos.get().dinacia || [];
  const filas = lista.map(x => `<tr class="${x.estado === 'nuevo' ? 'nuevo' : ''}"><td>${fechaHora(x.fecha)}<br><small>${esc(x.numero)}</small></td>
    <td><b>${esc(x.persona === 'empresa' ? x.razon : x.nombre)}</b><br><small>${esc(x.persona === 'empresa' ? 'RUT ' + (x.rut || '') : 'CI ' + (x.ci || ''))} · ${esc(x.tel)}</small></td>
    <td><b>${esc(x.modelo === 'Otro' || x.modelo === 'Outro' ? (x.fabricante + ' ' + (x.modeloOtro || '')) : x.modelo)}</b><br><small>N° ${esc(x.serie)}</small></td>
    <td>${x.uso === 'terceros' ? 'Servicio a terceros' : 'Uso propio'}${x.fito === 'si' ? '<br><small>Aplica fitosanitarios (MGAP)</small>' : ''}</td>
    <td>${Object.keys(x.docs || {}).length} de ${x.uso === 'terceros' ? 9 : 6}<br><small>${x.daod === 'si' ? 'Tiene DAOD' : x.daod === 'curso' ? 'Quiere el curso DAOD' : 'Sin DAOD'} · ${x.seguro === 'si' ? 'Con seguro' : x.ayudaSeguro ? 'Pide ayuda con el seguro' : 'Sin seguro'}</small></td>
    <td><select onchange="adminEstadoDin('${x.id}',this.value)">${ESTADOS_DIN.map(s => `<option ${x.estado === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
    <td><a class="ad-mini-btn" href="https://wa.me/${telWa(x.tel)}" target="_blank" rel="noopener" title="WhatsApp">${icono('wa')}</a>
      <button class="ad-mini-btn rojo" onclick="adminBorrarDe('dinacia','${x.id}')">${icono('basura')}</button></td></tr>`);
  return `<div class="ad-cab"><div><h2>Inscripciones DINACIA</h2><p>Las que mandan desde la página «Registro DINACIA». Cambiá el estado a medida que avanza el trámite.</p></div></div>
    ${tablaAdmin(['Fecha', 'Propietario', 'Dron', 'Uso', 'Documentos', 'Estado', ''], filas, 'Todavía no llegó ninguna inscripción.')}
    <p class="ad-demo">En la demostración los documentos quedan solo con el nombre del archivo. En la versión real se guardan en el Google Drive del taller.</p>`;
}
function adminEstadoDin(id, e){ const x = (Datos.get().dinacia || []).find(z => z.id === id); if (x) { x.estado = e; Datos.guardar(); } }

const telWa = n => { const d = String(n || '').replace(/\D/g, ''); return d.startsWith('598') ? d : d.startsWith('0') ? '598' + d.slice(1) : d.length === 8 ? '598' + d : d; };
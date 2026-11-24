/* =====================================================================
   CONTENIDO NUEVO DE LA VERSIÓN 3 (24/11/2026): se suma al de 01-contenido.
   - paginas: cada página es una lista de BLOQUES que se agregan, ordenan,
     ocultan y editan desde el Estudio. Las páginas «del sistema» (Inicio,
     Drones, Tienda…) tienen sus partes fijas como bloques que también se
     pueden mover u ocultar; las «propias» se arman de cero o desde una
     plantilla.
   - novedades: publicaciones tipo blog (se pueden programar).
   - links: la página «link en la bio» para Instagram.
   - igConexion: cómo se muestra Instagram en la página.
   ===================================================================== */
// [id, clave del texto, ícono, dónde va en el menú: 'arriba' | 'mas' | 'no']
const PAGINAS_SISTEMA = [
  ['inicio', 'p_inicio', 'casa', 'arriba'], ['drones', 'p_drones', 'dron', 'arriba'], ['tienda', 'p_tienda', 'carrito', 'arriba'],
  ['cursos', 'p_cursos', 'calendario', 'arriba'], ['dinacia', 'p_dinacia', 'escudo', 'arriba'], ['servicio', 'p_servicio', 'motor', 'arriba'],
  ['nosotros', 'p_nosotros', 'usuarios', 'arriba'], ['contacto', 'p_contacto', 'telefono', 'arriba'], ['novedades', 'p_novedades', 'diario', 'mas'],
  ['links', 'p_links', 'enlace', 'no']
];
// Partes fijas del inicio (06-inicio.js): se pueden mover u ocultar
const PARTES_INICIO = [
  ['portada', 'Portada (la elegida en Marca y datos)'], ['cinta', 'Cinta de servicios'], ['accesos', 'Accesos rápidos'], ['claudio', 'Claudio y su equipo'],
  ['campo', 'Así trabaja un Agras (el campo que se completa)'], ['destacados', 'Drones destacados'], ['explorar', 'Conocelo por dentro (T100)'],
  ['curso', 'Próximo curso'], ['promos', 'Promociones del mes'], ['instagram', 'Instagram']
];

(() => {
  const L = (es, pt) => ({ es, pt });
  let n = 0; const id = p => p + '-ej' + (++n);
  const sis = (clave) => ({ id: id('bq'), tipo: 'sis', clave });

  CONTENIDO_INICIAL.paginas = [
    ...PAGINAS_SISTEMA.map(([pid, k, ic, menu]) => ({
      id: pid, sistema: true, titulo: null, icono: ic, menu, seo: {},
      bloques: pid === 'inicio'
        ? [...PARTES_INICIO.map(([c]) => sis(c)).slice(0, 2),
          { id: id('bq'), tipo: 'aviso', fondo: 'blanco', d: { texto: L('🚀 Preventa DJI Agras T100: reservá el tuyo con precio de lanzamiento', '🚀 Pré-venda DJI Agras T100: reserve o seu com preço de lançamento'), url: '#/preventa-t100', icono: 'estrella', estilo: 'verde' } },
          ...PARTES_INICIO.map(([c]) => sis(c)).slice(2),
          { id: id('bq'), tipo: 'testimonios', fondo: 'blanco', d: { etiqueta: L('Clientes', 'Clientes'), titulo: L('Lo que dicen los productores', 'O que dizem os produtores'), items: [
            { texto: L('Compramos el T50 y en la primera zafra ya cubrimos 1.800 hectáreas. El acompañamiento de Claudio en la puesta en marcha fue clave.', 'Compramos o T50 e na primeira safra já cobrimos 1.800 hectares. O acompanhamento do Claudio na colocação em marcha foi fundamental.'), nombre: 'Productor de soja', lugar: 'Tranqueras', foto: '', estrellas: 5 },
            { texto: L('Se nos rompió un brazo en plena cosecha y a los dos días estábamos volando de nuevo. Repuestos originales y servicio rápido.', 'Quebrou um braço em plena colheita e em dois dias estávamos voando de novo. Peças originais e serviço rápido.'), nombre: 'Contratista de pulverización', lugar: 'Vichadero', foto: '', estrellas: 5 },
            { texto: L('El curso de operador nos sirvió muchísimo: salimos volando con confianza y con el permiso en trámite.', 'O curso de operador ajudou muito: saímos voando com confiança e com a licença em andamento.'), nombre: 'Piloto agrícola', lugar: 'Santana do Livramento', foto: '', estrellas: 5 }] } }]
        : [sis('contenido')]
    })),
    // Página propia de ejemplo, armada con la plantilla «Lanzamiento de un dron»
    { id: 'preventa-t100', sistema: false, titulo: L('Preventa T100', 'Pré-venda T100'), icono: 'estrella', menu: 'mas',
      seo: { titulo: L('Preventa DJI Agras T100 · Drones del Pampa', 'Pré-venda DJI Agras T100 · Drones del Pampa'), desc: L('Reservá el nuevo DJI Agras T100 en Rivera con precio de lanzamiento.', 'Reserve o novo DJI Agras T100 em Rivera com preço de lançamento.'), img: 'media/instagram/promo-preventa-t100.jpg' },
      bloques: [
        { id: id('bq'), tipo: 'portada', fondo: 'noche', d: { variante: 'cuenta', etiqueta: L('Preventa · cupos limitados', 'Pré-venda · vagas limitadas'), titulo: L('El nuevo DJI Agras T100 llega a Rivera', 'O novo DJI Agras T100 chega a Rivera'), texto: L('100 litros de tanque, LiDAR y radar de última generación. Reservá el tuyo antes del lanzamiento y asegurate la primera tanda.', 'Tanque de 100 litros, LiDAR e radar de última geração. Reserve o seu antes do lançamento e garanta o primeiro lote.'), img: 'media/fotos/t100-oscuro.jpg', video: '', fecha: '2026-12-15', b1: { txt: L('Reservar por WhatsApp', 'Reservar pelo WhatsApp'), url: 'wa:Quiero reservar el T100' }, b2: { txt: L('Ver la ficha', 'Ver a ficha'), url: '#/drones/t100' } } },
        { id: id('bq'), tipo: 'numeros', fondo: 'blanco', d: { titulo: L('Hecho para campos grandes', 'Feito para campos grandes'), items: [{ n: '100', suf: 'L', l: L('de tanque de pulverización', 'de tanque de pulverização') }, { n: '30', suf: 'ha/h', l: L('de rendimiento estimado', 'de rendimento estimado') }, { n: '2', suf: '', l: L('baterías inteligentes en vuelo', 'baterias inteligentes em voo') }, { n: '24', suf: 'meses', l: L('de garantía oficial Dragur', 'de garantia oficial Dragur') }] } },
        { id: id('bq'), tipo: 'textoImg', fondo: 'niebla', d: { etiqueta: L('Por qué el T100', 'Por que o T100'), titulo: L('Más hectáreas por día, con menos paradas', 'Mais hectares por dia, com menos paradas'), texto: L('El T100 carga más producto y vuela más tiempo. Con el **LiDAR** y el radar detecta árboles, cables y obstáculos, y sigue el terreno solo.\n\nEn Drones del Pampa te lo entregamos armado, calibrado y con la primera jornada en tu campo.', 'O T100 carrega mais produto e voa mais tempo. Com o **LiDAR** e o radar detecta árvores, cabos e obstáculos, e segue o terreno sozinho.\n\nNa Drones del Pampa entregamos montado, calibrado e com a primeira jornada no seu campo.'), img: 'media/fotos/t100-estudio.jpg', lado: 'der', puntos: [L('Puesta en marcha en tu campo', 'Colocação em marcha no seu campo'), L('Capacitación del piloto incluida', 'Treinamento do piloto incluído'), L('Repuestos originales en stock', 'Peças originais em estoque')], boton: { txt: L('Hablar con un asesor', 'Falar com um consultor'), url: 'wa:Quiero asesoramiento sobre el T100' } } },
        { id: id('bq'), tipo: 'video', fondo: 'noche', d: { titulo: L('Miralo trabajando', 'Veja trabalhando'), texto: {}, url: 'media/video/t100.mp4', formato: 'ancho' } },
        { id: id('bq'), tipo: 'productos', fondo: 'blanco', d: { titulo: L('Repuestos y accesorios para el T100', 'Peças e acessórios para o T100'), modo: 'modelo', modelo: 'T100', cat: '', ids: [], cantidad: 4 } },
        { id: id('bq'), tipo: 'preguntas', fondo: 'niebla', d: { titulo: L('Preguntas sobre la preventa', 'Perguntas sobre a pré-venda'), items: [
          { p: L('¿Cuánto hay que dejar de seña?', 'Quanto é o sinal?'), r: L('Coordinamos la reserva por WhatsApp: te explicamos las opciones de pago y financiación.', 'Combinamos a reserva pelo WhatsApp: explicamos as opções de pagamento e financiamento.') },
          { p: L('¿Cuándo se entrega?', 'Quando é a entrega?'), r: L('Las primeras unidades llegan en diciembre. Te avisamos apenas esté en Rivera.', 'As primeiras unidades chegam em dezembro. Avisamos assim que estiver em Rivera.') },
          { p: L('¿Incluye el curso de piloto?', 'Inclui o curso de piloto?'), r: L('Sí, la capacitación inicial del piloto va incluida con el equipo.', 'Sim, o treinamento inicial do piloto está incluído com o equipamento.') }] } },
        { id: id('bq'), tipo: 'cta', fondo: 'verde', d: { titulo: L('Asegurá tu T100 de la primera tanda', 'Garanta o seu T100 do primeiro lote'), texto: L('Escribinos y te contamos precio, financiación y fecha de entrega.', 'Escreva para nós e contamos preço, financiamento e data de entrega.'), b1: { txt: L('Reservar por WhatsApp', 'Reservar pelo WhatsApp'), url: 'wa:Quiero reservar el T100' }, b2: { txt: L('Ver otros drones', 'Ver outros drones'), url: '#/drones' } } }
      ] }
  ];

  CONTENIDO_INICIAL.novedades = [
    { id: 'nov-t100', titulo: L('Llegó la preventa del DJI Agras T100', 'Chegou a pré-venda do DJI Agras T100'), bajada: L('El dron más grande de la línea Agras ya se puede reservar en Rivera.', 'O maior drone da linha Agras já pode ser reservado em Rivera.'),
      cuerpo: L('El **DJI Agras T100** es el nuevo tope de gama de DJI Agriculture: 100 litros de tanque, LiDAR y dos baterías inteligentes.\n\nEn Drones del Pampa abrimos la **preventa** para las primeras unidades que llegan en diciembre.\n\n- Entrega armado y calibrado\n- Puesta en marcha en tu campo\n- Capacitación del piloto incluida\n\nEscribinos y te contamos precio y financiación.', 'O **DJI Agras T100** é o novo topo de linha da DJI Agriculture: tanque de 100 litros, LiDAR e duas baterias inteligentes.\n\nNa Drones del Pampa abrimos a **pré-venda** das primeiras unidades que chegam em dezembro.\n\n- Entrega montado e calibrado\n- Colocação em marcha no seu campo\n- Treinamento do piloto incluído\n\nEscreva para nós e contamos preço e financiamento.'),
      portada: 'media/instagram/promo-preventa-t100.jpg', fotos: ['media/fotos/t100-estudio.jpg', 'media/fotos/t100-tanque.jpg', 'media/fotos/t100-aspersor.jpg'], video: 'media/video/t100.mp4',
      enlaces: [{ texto: L('Ver la página de la preventa', 'Ver a página da pré-venda'), url: '#/preventa-t100' }, { texto: L('Ficha del T100', 'Ficha do T100'), url: '#/drones/t100' }], cat: 'lanzamiento', fecha: '2026-11-20T09:00', estado: 'publicada', destacada: true },
    { id: 'nov-picos', titulo: L('Consejo del taller: limpiá los picos después de cada jornada', 'Dica da oficina: limpe os bicos depois de cada jornada'), bajada: L('Cinco minutos al final del día te ahorran una reparación en plena zafra.', 'Cinco minutos no fim do dia economizam um conserto em plena safra.'),
      cuerpo: L('Los restos de producto se secan dentro de los picos y las bombas. Al otro día el caudal no es parejo y el dron pulveriza de más en unas filas y de menos en otras.\n\n**Cómo hacerlo:**\n- Cargá el tanque con agua limpia y pulverizá un minuto\n- Sacá los filtros y enjuagalos\n- Revisá que los picos no tengan grietas\n\nSi notás que una bomba hace ruido, traelo al taller antes de que falle.', 'Os restos de produto secam dentro dos bicos e das bombas. No dia seguinte a vazão não é uniforme.\n\n**Como fazer:**\n- Encha o tanque com água limpa e pulverize um minuto\n- Tire os filtros e enxágue\n- Verifique se os bicos não têm rachaduras\n\nSe uma bomba fizer barulho, traga à oficina antes que falhe.'),
      portada: 'media/fotos/t100-aspersor.jpg', fotos: [], video: 'media/instagram/ig-revisiones.mp4', enlaces: [{ texto: L('Pedir turno de service', 'Pedir horário de revisão'), url: '#/servicio' }], cat: 'consejo', fecha: '2026-11-12T10:00', estado: 'publicada', destacada: false },
    { id: 'nov-curso', titulo: L('Abrimos inscripciones al curso de operador', 'Abrimos inscrições para o curso de operador'), bajada: L('Teoría, simulador y vuelo real en el campo. Cupos limitados.', 'Teoria, simulador e voo real no campo. Vagas limitadas.'),
      cuerpo: L('El curso de **operador de drones agrícolas** es para quien va a volar un Agras por primera vez o quiere ordenar lo que ya sabe.\n\nIncluye la parte teórica, práctica en simulador y vuelos reales en el campo con nuestros instructores.', 'O curso de **operador de drones agrícolas** é para quem vai pilotar um Agras pela primeira vez ou quer organizar o que já sabe.\n\nInclui teoria, prática em simulador e voos reais no campo com nossos instrutores.'),
      portada: 'media/instagram/curso-operador.jpg', fotos: ['media/fotos/entrenamiento.jpg', 'media/fotos/equipo-campo.jpg'], video: '', enlaces: [{ texto: L('Ver los cursos', 'Ver os cursos'), url: '#/cursos' }], cat: 'curso', fecha: '2026-11-05T08:30', estado: 'publicada', destacada: false },
    { id: 'nov-lanz', titulo: L('Así fue la noche de lanzamiento en el local', 'Assim foi a noite de lançamento na loja'), bajada: L('Productores, contratistas y amigos de la casa conocieron los nuevos Agras.', 'Produtores, prestadores e amigos da casa conheceram os novos Agras.'),
      cuerpo: L('Gracias a todos los que vinieron. Presentamos el **T55** y el **T70P**, hubo demostraciones de vuelo y charlamos de la zafra que viene.', 'Obrigado a todos que vieram. Apresentamos o **T55** e o **T70P**, houve demonstrações de voo e conversamos sobre a próxima safra.'),
      portada: 'media/claudio/lanzamiento-gente.jpg', fotos: ['media/claudio/claudio-lanzamiento-t55.jpg', 'media/claudio/noche-local.jpg', 'media/claudio/claudio-lanzamiento.jpg'], video: 'media/instagram/ig-lanzamiento.mp4', enlaces: [], cat: 'evento', fecha: '2026-10-28T20:00', estado: 'publicada', destacada: false },
    { id: 'nov-zafra', titulo: L('Prepará tu dron para la zafra de verano', 'Prepare o seu drone para a safra de verão'), bajada: L('Revisión completa a precio especial durante diciembre.', 'Revisão completa com preço especial durante dezembro.'),
      cuerpo: L('Durante diciembre hacemos la **revisión pre-zafra** completa: motores, bombas, picos, baterías y actualización de firmware.', 'Durante dezembro fazemos a **revisão pré-safra** completa: motores, bombas, bicos, baterias e atualização de firmware.'),
      portada: 'media/fotos/servicio-oficial.jpg', fotos: [], video: '', enlaces: [{ texto: L('Pedir turno', 'Pedir horário'), url: '#/servicio' }], cat: 'taller', fecha: '2026-12-01T08:00', estado: 'publicada', destacada: false }
  ];

  CONTENIDO_INICIAL.links = {
    titulo: 'Drones del Pampa', bajada: L('Sucursal oficial Dragur · DJI Agriculture · Rivera', 'Filial oficial Dragur · DJI Agriculture · Rivera'), foto: '', fondo: 'amanecer',
    items: [
      { id: 'lk-wa', texto: L('Escribinos por WhatsApp', 'Fale conosco pelo WhatsApp'), url: 'wa:', icono: 'wa', destacado: true, visible: true },
      { id: 'lk-t100', texto: L('Preventa DJI Agras T100', 'Pré-venda DJI Agras T100'), url: '#/preventa-t100', icono: 'estrella', destacado: false, visible: true },
      { id: 'lk-tienda', texto: L('Tienda de repuestos', 'Loja de peças'), url: '#/tienda', icono: 'carrito', destacado: false, visible: true },
      { id: 'lk-drones', texto: L('Drones Agras', 'Drones Agras'), url: '#/drones', icono: 'dron', destacado: false, visible: true },
      { id: 'lk-serv', texto: L('Pedir turno de service', 'Pedir horário de revisão'), url: '#/servicio', icono: 'motor', destacado: false, visible: true },
      { id: 'lk-cursos', texto: L('Cursos para pilotos', 'Cursos para pilotos'), url: '#/cursos', icono: 'calendario', destacado: false, visible: true },
      { id: 'lk-din', texto: L('Registro ante DINACIA', 'Registro na DINACIA'), url: '#/dinacia', icono: 'escudo', destacado: false, visible: true },
      { id: 'lk-mapa', texto: L('Cómo llegar', 'Como chegar'), url: 'https://www.google.com/maps/search/?api=1&query=Drones+del+Pampa+Rivera+Uruguay', icono: 'ubicacion', destacado: false, visible: true }
    ]
  };

  CONTENIDO_INICIAL.igConexion = { modo: 'propias', conectado: false, usuario: 'dragur_rivera_drones_del_pampa', desde: '' };
  CONTENIDO_INICIAL.config.compartir = L('Drones agrícolas DJI, repuestos, servicio técnico oficial y cursos para pilotos en Rivera.', 'Drones agrícolas DJI, peças, assistência técnica oficial e cursos para pilotos em Rivera.');
})();

// Temas de las novedades: [id, nombre en español, nombre en portugués, color]
const CATS_NOVEDADES = [['lanzamiento', 'Lanzamientos', 'Lançamentos', 'azul'], ['consejo', 'Consejos del taller', 'Dicas da oficina', 'verde'],
  ['curso', 'Cursos', 'Cursos', 'azul'], ['evento', 'Eventos', 'Eventos', 'ambar'], ['taller', 'Servicio técnico', 'Assistência técnica', 'verde'], ['promo', 'Promociones', 'Promoções', 'ambar']];

// Ejemplos para la Bandeja (personas INVENTADAS), así el demo no arranca vacío
(() => {
  const hace = h => new Date(Date.now() - h * 3600e3).toISOString();
  CONTENIDO_INICIAL.pedidos = [
    { id: 'ped-ej1', fecha: hace(3), nombre: 'Martín Suárez', tel: '099 123 456', ciudad: 'Tranqueras', idioma: 'es', total: 4700, estado: 'nuevo', items: [{ ref: 'prod:t100-bat', n: 2, nombre: 'Batería inteligente T100 / T70P', precio: 2350 }] },
    { id: 'ped-ej2', fecha: hace(50), nombre: 'Rodrigo Pereira', tel: '55 99 8123 4567', ciudad: 'Santana do Livramento', idioma: 'pt', total: 6900, estado: 'contactado', items: [{ ref: 'prod:d14000', n: 1, nombre: 'Generador DJI D14000', precio: 6900 }] }];
  CONTENIDO_INICIAL.services = [
    { id: 'srv-ej1', fecha: hace(7), nombre: 'Lucía Fernández', tel: '098 765 432', ciudad: 'Vichadero', idioma: 'es', equipo: 'DJI Agras T50', tipo: 'Mantenimiento / service', serie: '', problema: 'Revisión antes de la zafra; una bomba hace ruido.', dia: 'Esta semana', retiro: false, estado: 'nuevo' },
    { id: 'srv-ej2', fecha: hace(75), nombre: 'Javier Olivera', tel: '091 222 333', ciudad: 'Rivera', idioma: 'es', equipo: 'DJI Agras T40', tipo: 'Reparación por golpe o falla', serie: '', problema: 'Brazo quebrado después de un aterrizaje.', dia: '', retiro: true, estado: 'en el taller' }];
  CONTENIDO_INICIAL.inscripciones = [
    { id: 'ins-ej1', numero: 'DP-10482', fecha: hace(20), curso: 'operador', cursoNombre: 'Operador de drones agrícolas', nombre: 'Agustina Silva', ci: '4.123.456-7', tel: '094 555 111', email: 'agustina.ejemplo@correo.com', ciudad: 'Rivera', exp: 'algo', com: '', espera: false, idioma: 'es', estado: 'nuevo' }];
  CONTENIDO_INICIAL.mensajes = [
    { id: 'msg-ej1', fecha: hace(1.5), nombre: 'Pablo Rodríguez', tel: '092 444 888', email: '', ciudad: 'Tacuarembó', motivo: 'Formulario de la página', msg: '¿El T100 se puede financiar? Trabajo unas 2.000 hectáreas por año.', pagina: '#/preventa-t100', leido: false },
    { id: 'msg-ej2', fecha: hace(30), nombre: 'Carolina Méndez', tel: '093 777 222', email: '', ciudad: 'Rivera', motivo: 'Compra de un dron', msg: 'Quiero saber precio del T25P para huerta de cítricos.', leido: true, estado: 'respondido' }];
})();

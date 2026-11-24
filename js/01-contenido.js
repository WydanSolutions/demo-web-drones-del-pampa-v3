/* =====================================================================
   CONTENIDO DE EJEMPLO (lo que trae la página la primera vez).
   Todo esto se edita desde el panel «Administrar»: textos (español y
   portugués), drones, productos, precios en dólares, cursos, promociones,
   teléfonos, horarios, fotos y videos.
   ⚠ Los PRECIOS y los cursos son de ejemplo (demo para el cliente).
   Fotos y videos: de dragur.uy y del Instagram de Dragur Rivera.
   Si se cambia esta estructura, subir VERSION_CONTENIDO (datos.js).
   ===================================================================== */
const L = (es, pt) => ({ es, pt });
const D = 'media/drones/', F = 'media/fotos/', V = 'media/video/', IG = 'media/instagram/';

const CONTENIDO_INICIAL = {
  config: {
    nombre: 'Drones del Pampa',
    marca: 'DRAGUR Rivera',
    telefonos: ['095 659 627', '097 964 058'],
    whatsapp: '59895659627',
    email: 'rivera@dragur.uy',
    direccion: L('Rivera, Uruguay', 'Rivera, Uruguai'),
    mapa: 'Rivera, Uruguay',
    horarios: L('Lunes a viernes de 8:30 a 18:30 · Sábados de 8:30 a 12:30', 'Segunda a sexta das 8:30 às 18:30 · Sábados das 8:30 às 12:30'),
    instagram: 'https://www.instagram.com/dragur_rivera_drones_del_pampa/',
    clave: '1234',
    portada: 'video'          // video | estudio | ilustrada (06b-portadas.js)
  },

  // El dueño: aparece en el inicio, en Nosotros y en los botones de WhatsApp
  claudio: {
    nombre: 'Claudio Vandes',
    cargo: L('Director de Drones del Pampa', 'Diretor da Drones del Pampa'),
    foto: 'media/claudio/claudio-perfil.jpg',              // su foto de perfil de Instagram (elegida por la usuaria, 12/11/2026)
    foto2: 'media/claudio/claudio-lanzamiento-t55.jpg',    // opción 7: presentando el T55 en el lanzamiento
    foto3: 'media/claudio/claudio-taller-t100.jpg',        // opción 2: trabajando en el T100 (la 5 no gustó en Servicio, 12/11/2026)
    video: 'media/instagram/ig-claudio-taller.mp4',
    videoServicio: 'media/instagram/ig-t100-dual.mp4',   // Servicio técnico: Claudio armando el T100 (en vez de foto, 12/11/2026)
    frase: L('Antes de venderte un dron, queremos entender tu campo. Con mi equipo te asesoramos, te acompañamos en la puesta en marcha y el taller queda a la vuelta para lo que necesites.',
             'Antes de vender um drone, queremos entender o seu campo. Com a minha equipe assessoramos você, acompanhamos a colocação em marcha e a oficina fica perto para o que precisar.'),
    historia: L('Drones del Pampa nació en Rivera para acercar la agricultura de precisión a los productores del norte del país. Hoy somos la sucursal oficial de Dragur, representante de DJI Agriculture en Uruguay: vendemos los equipos, los reparamos en nuestro taller con repuestos originales y formamos a los pilotos que los van a volar.',
                'A Drones del Pampa nasceu em Rivera para aproximar a agricultura de precisão dos produtores do norte do Uruguai. Hoje somos a filial oficial da Dragur, representante da DJI Agriculture no Uruguai: vendemos os equipamentos, consertamos na nossa oficina com peças originais e formamos os pilotos que vão pilotá-los.')
  },

  // Textos de cada página (español y portugués)
  textos: {
    heroEtiqueta: L('Sucursal oficial DRAGUR · DJI Agriculture', 'Filial oficial DRAGUR · DJI Agriculture'),
    heroTitulo: L('Tecnología que vuela sobre el campo del norte.', 'Tecnologia que voa sobre o campo do norte.'),
    heroSub: L('Drones agrícolas DJI, repuestos originales, taller propio y cursos para pilotos. En Rivera, con atención personal de Claudio y su equipo.',
               'Drones agrícolas DJI, peças originais, oficina própria e cursos para pilotos. Em Rivera, com atendimento pessoal do Claudio e da sua equipe.'),
    buscasTitulo: L('¿Qué estás buscando?', 'O que você está procurando?'),
    claudioTitulo: L('Claudio y su equipo.', 'O Claudio e a sua equipe.'),
    dronesTitulo: L('Elegí el dron para tu campo', 'Escolha o drone para o seu campo'),
    dronesSub: L('Toda la línea DJI Agras y el Mavic 3M para mapeo. Compará modelos o dejá que te recomendemos uno en 3 preguntas.',
                 'Toda a linha DJI Agras e o Mavic 3M para mapeamento. Compare modelos ou deixe a gente recomendar um em 3 perguntas.'),
    tiendaTitulo: L('Tienda de drones y repuestos', 'Loja de drones e peças'),
    tiendaSub: L('Stock en Rivera para que tu equipo vuelva al campo sin perder tiempo. Precios en dólares; el pedido se confirma por WhatsApp.',
                 'Estoque em Rivera para que seu equipamento volte ao campo sem perder tempo. Preços em dólares; o pedido é confirmado pelo WhatsApp.'),
    cursosTitulo: L('Academia de pilotos en Rivera', 'Academia de pilotos em Rivera'),
    cursosSub: L('Cursos teóricos y prácticos con certificado. Elegí el tuyo, mirá toda la información y anotate en el momento.',
                 'Cursos teóricos e práticos com certificado. Escolha o seu, veja todas as informações e inscreva-se na hora.'),
    servTitulo: L('Servicio técnico oficial', 'Assistência técnica oficial'),
    servSub: L('Taller propio en Rivera, técnicos capacitados por Dragur y repuestos originales. Agendá tu service y te avisamos por WhatsApp en cada paso.',
               'Oficina própria em Rivera, técnicos capacitados pela Dragur e peças originais. Agende sua revisão e avisamos pelo WhatsApp a cada etapa.'),
    nosTitulo: L('Una empresa de Rivera, para el campo del norte', 'Uma empresa de Rivera, para o campo do norte'),
    contactoTitulo: L('Hablemos de tu próximo vuelo', 'Vamos falar do seu próximo voo'),
    contactoSub: L('Escribinos y te respondemos en el día. También podés venir al local: te mostramos los equipos funcionando.',
                   'Escreva para nós e respondemos no mesmo dia. Você também pode vir à loja: mostramos os equipamentos funcionando.')
  },

  // Lo que se destaca en el inicio, debajo de Claudio
  // El equipo (Nosotros). Sin nombres de empleados a propósito: la web es pública (12/11/2026). Se edita en Administrar › Más contenido.
  equipo: [
    { icono: 'usuarios', t: L('Dirección', 'Direção'), n: 'Claudio Vandes', d: L('Fundador y cara de Drones del Pampa. Acompaña cada venta grande y cada entrega.', 'Fundador e rosto da Drones del Pampa. Acompanha cada venda grande e cada entrega.') },
    { icono: 'estrella', t: L('Ventas y asesoramiento', 'Vendas e assessoria'), n: '', d: L('Te ayudamos a elegir el equipo, armamos la propuesta y respondemos tus consultas por WhatsApp.', 'Ajudamos a escolher o equipamento, montamos a proposta e respondemos pelo WhatsApp.') },
    { icono: 'motor', t: L('Taller y servicio técnico', 'Oficina e assistência técnica'), n: '', d: L('Técnicos capacitados por Dragur: diagnóstico, reparación y garantía oficial DJI.', 'Técnicos treinados pela Dragur: diagnóstico, conserto e garantia oficial DJI.') },
    { icono: 'bateria', t: L('Centro de baterías', 'Centro de baterias'), n: '', d: L('Revisión, diagnóstico y reparación de baterías inteligentes.', 'Revisão, diagnóstico e conserto de baterias inteligentes.') },
    { icono: 'kit', t: L('Administración', 'Administração'), n: '', d: L('Facturas, cobros, repuestos por encargo y trámites como la inscripción ante DINACIA.', 'Notas, cobranças, peças sob encomenda e trâmites como o registro na DINACIA.') }
  ],

  valores: [
    { icono: 'escudo', t: L('Sucursal oficial', 'Filial oficial'), d: L('Garantía DJI y respaldo de toda la red Dragur.', 'Garantia DJI e respaldo de toda a rede Dragur.') },
    { icono: 'motor', t: L('Taller propio', 'Oficina própria'), d: L('Diagnóstico y reparación en Rivera, sin mandar el equipo lejos.', 'Diagnóstico e conserto em Rivera, sem mandar o equipamento para longe.') },
    { icono: 'kit', t: L('Repuestos en stock', 'Peças em estoque'), d: L('Hélices, baterías, motores y bombas listos para entregar.', 'Hélices, baterias, motores e bombas prontos para entrega.') },
    { icono: 'usuarios', t: L('Academia', 'Academia'), d: L('Formamos a tus pilotos con práctica real en el campo.', 'Formamos seus pilotos com prática real no campo.') }
  ],

  drones: [
    { id: 't100', nombre: 'Agras T100', etiqueta: L('Máxima capacidad', 'Máxima capacidade'), precio: 37900, precioAntes: 0,
      lema: L('Máxima capacidad, máximo rendimiento', 'Máxima capacidade, máximo rendimento'),
      desc: L('Doce años de desarrollo en un solo equipo. Carga útil de hasta 100 kg, duplica la eficiencia operativa y trabaja en pulverización, esparcido y elevación de carga, con LiDAR, visión penta y radar de onda milimétrica. Ahora con batería dual.',
              'Doze anos de desenvolvimento em um só equipamento. Carga útil de até 100 kg, dobra a eficiência operacional e trabalha em pulverização, espalhamento e elevação de carga, com LiDAR, visão penta e radar de ondas milimétricas. Agora com bateria dupla.'),
      imagenes: [D + 't100-45.png', D + 't100-frente.png', D + 't100-45-arriba.png', D + 't100-arriba.png', D + 't100-abajo.png'],
      video: V + 't100.mp4', galeria: [F + 't100-oscuro.jpg', F + 't100-aspersor.jpg', F + 't100-bomba.jpg', F + 't100-tanque.jpg', F + 'control-rc.jpg'],
      specs: [
        { v: '100', u: 'L', l: L('Tanque de pulverización', 'Tanque de pulverização') },
        { v: '150', u: 'L', l: L('Tanque de esparcido', 'Tanque de espalhamento') },
        { v: '400', u: 'kg/min', l: L('Caudal de esparcido', 'Vazão de espalhamento') },
        { v: '20', u: 'm/s', l: L('Velocidad máxima de operación', 'Velocidade máxima de operação') },
        { v: '100', u: 'kg', l: L('Elevación de carga', 'Elevação de carga') },
        { v: '5-13', u: 'm', l: L('Ancho de pulverización', 'Largura de pulverização') }
      ], destacado: true, visible: true },
    { id: 't70p', nombre: 'Agras T70P', etiqueta: L('Experto en eficiencia', 'Especialista em eficiência'), precio: 29900, precioAntes: 0,
      lema: L('Rendimiento potente, valor excepcional', 'Desempenho potente, valor excepcional'),
      desc: L('Pulveriza, esparce y levanta carga con una capacidad útil máxima de 70 kg. Sistema de Seguridad 3.0, visión triple y radares delanteros y traseros para trabajar protegido las 24 horas.',
              'Pulveriza, espalha e levanta carga com capacidade útil máxima de 70 kg. Sistema de Segurança 3.0, visão tripla e radares dianteiros e traseiros para trabalhar protegido 24 horas.'),
      imagenes: [D + 't70p-45.png', D + 't70p-45-izq.png', D + 't70p-45-arriba.png', D + 't70p-arriba.png', D + 't70p-abajo.png'],
      video: IG + 'ig-t70p.mp4', galeria: [F + 't70-montana.jpg', F + 't70-carga.jpg', F + 't70-oscuro.jpg', IG + 'portada-t70p.jpg'],
      specs: [
        { v: '70', u: 'L', l: L('Tanque de pulverización', 'Tanque de pulverização') },
        { v: '100', u: 'L', l: L('Tanque de esparcido', 'Tanque de espalhamento') },
        { v: '400', u: 'kg/min', l: L('Caudal de esparcido', 'Vazão de espalhamento') },
        { v: '20', u: 'm/s', l: L('Velocidad máxima de operación', 'Velocidade máxima de operação') },
        { v: '65', u: 'kg', l: L('Elevación de carga', 'Elevação de carga') },
        { v: '30', u: 'L/min', l: L('Caudal de pulverización', 'Vazão de pulverização') }
      ], destacado: true, visible: true },
    { id: 't55', nombre: 'Agras T55', etiqueta: L('Nuevo', 'Novo'), precio: 21900, precioAntes: 0,
      lema: L('Vuelo ágil, inicio fácil', 'Voo ágil, início fácil'),
      desc: L('Ligero, intuitivo y muy fácil de operar. Pulveriza con altas tasas de aplicación, esparce con precisión y levanta carga. Disipador de calor integrado para la batería y retorno automático cuando se queda sin producto o sin batería.',
              'Leve, intuitivo e muito fácil de operar. Pulveriza com altas taxas de aplicação, espalha com precisão e levanta carga. Dissipador de calor integrado para a bateria e retorno automático quando acaba o produto ou a bateria.'),
      imagenes: [D + 't55-45.png', D + 't55-vuelo.png', D + 't55-esparcido.png', D + 't55-carga.png', D + 't55-carga-quieto.png'],
      video: V + 't55.mp4', galeria: [F + 't55-sierras.webp', F + 't55-montana.webp', F + 't55-tanque.jpg', F + 't55-disco.jpg', IG + 't55-campo.jpg'],
      specs: [
        { v: '50', u: 'L', l: L('Tanque de pulverización', 'Tanque de pulverização') },
        { v: '50', u: 'L/min', l: L('Caudal con nebulizadores', 'Vazão com nebulizadores') },
        { v: '80', u: 'L', l: L('Tanque de esparcido', 'Tanque de espalhamento') },
        { v: '55', u: 'kg', l: L('Carga útil de esparcido', 'Carga útil de espalhamento') },
        { v: '400', u: 'kg/min', l: L('Caudal de esparcido', 'Vazão de espalhamento') },
        { v: '4-11', u: 'm', l: L('Ancho de pulverización', 'Largura de pulverização') }
      ], destacado: true, visible: true },
    { id: 't50', nombre: 'Agras T50', etiqueta: L('Estable y firme', 'Estável e firme'), precio: 24900, precioAntes: 0,
      lema: L('Estable, firme, ¡despegue!', 'Estável, firme, decole!'),
      desc: L('Propulsión coaxial de doble rotor y estructura de torque dividido para cargar 40 kg de pulverización o 50 kg de esparcido con total estabilidad. Radares de matriz en fase y visión binocular.',
              'Propulsão coaxial de rotor duplo e estrutura de torque dividido para carregar 40 kg de pulverização ou 50 kg de espalhamento com total estabilidade. Radares de matriz em fase e visão binocular.'),
      imagenes: [D + 't50-45.png', D + 't50-frente.png', D + 't50-arriba.png', D + 't50-abajo.png'],
      video: V + 't50.mp4', galeria: [F + 'maiz.jpg', F + 'citricos.jpg', F + 'campo-pulverizando.webp'],
      specs: [
        { v: '40', u: 'kg', l: L('Carga de pulverización', 'Carga de pulverização') },
        { v: '50', u: 'kg', l: L('Carga de esparcido', 'Carga de espalhamento') },
        { v: '16', u: 'L/min', l: L('Caudal de pulverización', 'Vazão de pulverização') },
        { v: '108', u: 'kg/min', l: L('Caudal de esparcido', 'Vazão de espalhamento') },
        { v: '21', u: 'ha/h', l: L('Rendimiento en campo', 'Rendimento no campo') },
        { v: '2', u: 'km', l: L('Transmisión O3', 'Transmissão O3') }
      ], destacado: false, visible: true },
    { id: 't25', nombre: 'Agras T25P', etiqueta: L('Compacto', 'Compacto'), precio: 14900, precioAntes: 0,
      lema: L('Más pequeño. Más inteligente.', 'Menor. Mais inteligente.'),
      desc: L('El socio incondicional de la agricultura: liviano y ágil, lo maneja una sola persona. Tanque de pulverización de 20 L y de esparcido de 30 L, aviónica nueva, sensores de visión triple y radar de ondas milimétricas.',
              'O parceiro incondicional da agricultura: leve e ágil, operado por uma só pessoa. Tanque de pulverização de 20 L e de espalhamento de 30 L, aviônica nova, sensores de visão tripla e radar de ondas milimétricas.'),
      imagenes: [D + 't25-45.png', D + 't25-frente.png', D + 't25-esparcido.png'],
      video: V + 't25.mp4', galeria: [F + 't25-campo.jpg', IG + 'portada-t25p.jpg'],
      specs: [
        { v: '20', u: 'L', l: L('Tanque de pulverización', 'Tanque de pulverização') },
        { v: '30', u: 'L', l: L('Tanque de esparcido', 'Tanque de espalhamento') },
        { v: '16', u: 'L/min', l: L('Caudal de pulverización', 'Vazão de pulverização') },
        { v: '50°', u: '', l: L('Seguimiento del terreno', 'Acompanhamento do terreno') },
        { v: '1', u: L('persona', 'pessoa'), l: L('Lo opera una sola persona', 'Operado por uma só pessoa') },
        { v: '2', u: 'km', l: L('Transmisión O3', 'Transmissão O3') }
      ], destacado: false, visible: true },
    { id: 'mavic3m', nombre: 'Mavic 3M', etiqueta: L('Mapeo multiespectral', 'Mapeamento multiespectral'), precio: 5990, precioAntes: 0,
      lema: L('Ver más, trabajar mejor', 'Ver mais, trabalhar melhor'),
      desc: L('Cámara RGB de 20 MP y cuatro cámaras multiespectrales de 5 MP (verde, rojo, borde rojo e infrarrojo cercano) para relevar el estado del cultivo, con posicionamiento RTK centimétrico. Hasta 200 hectáreas por vuelo.',
              'Câmera RGB de 20 MP e quatro câmeras multiespectrais de 5 MP (verde, vermelho, borda vermelha e infravermelho próximo) para avaliar a lavoura, com posicionamento RTK centimétrico. Até 200 hectares por voo.'),
      imagenes: [D + 'mavic3m-45.png', D + 'mavic3m-frente.png', D + 'mavic3m-45-izq.png', D + 'mavic3m-arriba.png', D + 'mavic3m-abajo.png'],
      video: V + 'mavic3m.mp4', galeria: [F + 'mavic-oscuro.jpg'],
      specs: [
        { v: '200', u: 'ha', l: L('Por vuelo', 'Por voo') },
        { v: '20', u: 'MP', l: L('Cámara RGB 4/3', 'Câmera RGB 4/3') },
        { v: '4×5', u: 'MP', l: L('Cámaras multiespectrales', 'Câmeras multiespectrais') },
        { v: '15', u: 'km', l: L('Alcance de transmisión', 'Alcance de transmissão') },
        { v: 'RTK', u: '', l: L('Posicionamiento centimétrico', 'Posicionamento centimétrico') },
        { v: '360°', u: '', l: L('Anticolisión omnidireccional', 'Anticolisão omnidirecional') }
      ], destacado: false, visible: true }
  ],

  categorias: [
    { id: 'drones', icono: 'dron', n: L('Drones', 'Drones') },
    { id: 'kits', icono: 'kit', n: L('Kits completos', 'Kits completos') },
    { id: 'baterias', icono: 'bateria', n: L('Baterías y carga', 'Baterias e carga') },
    { id: 'helices', icono: 'helice', n: L('Hélices', 'Hélices') },
    { id: 'motores', icono: 'motor', n: L('Motores y ESC', 'Motores e ESC') },
    { id: 'pulverizacion', icono: 'gota', n: L('Pulverización', 'Pulverização') },
    { id: 'esparcido', icono: 'granos', n: L('Esparcido', 'Espalhamento') },
    { id: 'estructura', icono: 'brazo', n: L('Brazos y estructura', 'Braços e estrutura') },
    { id: 'radares', icono: 'radar', n: L('Radares y sensores', 'Radares e sensores') },
    { id: 'generadores', icono: 'generador', n: L('Generadores', 'Geradores') },
    { id: 'control', icono: 'control', n: L('Control remoto', 'Controle remoto') }
  ],

  // Productos de la tienda (nombres y códigos de artículos reales del taller; PRECIOS DE EJEMPLO)
  productos: [
    P('kit-t100-365', 'Kit T100 365', 'kits', L('Kit T100 365 + Generador DJI D14000', 'Kit T100 365 + Gerador DJI D14000'), 44990, 48026, 2, ['T100'],
      L('Dron T100 con 3 baterías, cargador y generador DJI D14000: listo para trabajar todo el día.', 'Drone T100 com 3 baterias, carregador e gerador DJI D14000: pronto para trabalhar o dia todo.'), D + 't100-45.png', true),
    P('kit-precision', 'KIT-PREC', 'kits', L('Kit Agricultura de Precisión', 'Kit Agricultura de Precisão'), 44990, 48026, 1, ['T100', 'Mavic 3M'],
      L('Kit 365 DJI Agras T100 + generador + Mavic 3 Multiespectral + Pix4Dfields anual.', 'Kit 365 DJI Agras T100 + gerador + Mavic 3 Multiespectral + Pix4Dfields anual.'), IG + 'promo-kit-precision.jpg', true),
    P('d14000', 'D14000', 'generadores', L('Generador DJI D14000', 'Gerador DJI D14000'), 6900, 0, 3, ['T100', 'T70P', 'T55'],
      L('Generador oficial para carga rápida de baterías inteligentes en el campo.', 'Gerador oficial para carga rápida de baterias inteligentes no campo.'), '', true),
    P('d12000', 'D12000iE', 'generadores', L('Generador DJI D12000iE', 'Gerador DJI D12000iE'), 5400, 0, 2, ['T50', 'T40', 'T25'],
      L('Generador inverter para estaciones de carga en el campo.', 'Gerador inverter para estações de carga no campo.'), '', false),
    P('t100-bat', 'DB2160', 'baterias', L('Batería inteligente T100 / T70P', 'Bateria inteligente T100 / T70P'), 2350, 0, 8, ['T100', 'T70P'],
      L('Batería de vuelo inteligente con carga ultrarrápida.', 'Bateria de voo inteligente com carga ultrarrápida.'), '', true),
    P('t50-bat', 'T50BAT', 'baterias', L('Batería de dron T50', 'Bateria de drone T50'), 1590, 0, 6, ['T50', 'T40'],
      L('Batería original DB1560 para T50 y T40.', 'Bateria original DB1560 para T50 e T40.'), '', false),
    P('cargador-65w', 'T40P266', 'baterias', L('Cargador DJI 65 W', 'Carregador DJI 65 W'), 85, 0, 12, ['T40', 'T50', 'T100'],
      L('Cargador portátil para control remoto y accesorios.', 'Carregador portátil para controle remoto e acessórios.'), '', false),
    P('helice-t50-cw', 'T50P008', 'helices', L('Hélice L-CW T50 blanca', 'Hélice L-CW T50 branca'), 145, 0, 24, ['T50'],
      L('Hélice original sentido horario.', 'Hélice original sentido horário.'), '', false),
    P('helices-t30', 'T30PCCW', 'helices', L('Hélices CCW T30', 'Hélices CCW T30'), 120, 0, 16, ['T30'],
      L('Par de hélices sentido antihorario.', 'Par de hélices sentido anti-horário.'), '', false),
    P('sujetador-helice-t100', 'T100P006', 'helices', L('Sujetador de hélices T100', 'Fixador de hélices T100'), 68, 0, 10, ['T100'],
      L('Pieza de fijación de las palas al motor.', 'Peça de fixação das pás ao motor.'), '', false),
    P('motor-t70p', 'T70P041', 'motores', L('Motor propulsor T70P', 'Motor propulsor T70P'), 690, 0, 4, ['T70P'],
      L('Motor de propulsión original.', 'Motor de propulsão original.'), '', true),
    P('motor-centrifugo', 'T100P049', 'motores', L('Motor centrífugo T70 y T100', 'Motor centrífugo T70 e T100'), 420, 0, 5, ['T100', 'T70P'],
      L('Motor del aspersor centrífugo de doble atomización.', 'Motor do aspersor centrífugo de dupla atomização.'), '', false),
    P('esc-t30', 'T30ESC', 'motores', L('Módulo ESC potenciador de motor T30', 'Módulo ESC de motor T30'), 260, 0, 3, ['T30'],
      L('Variador electrónico de velocidad.', 'Variador eletrônico de velocidade.'), '', false),
    P('bomba-carcasa', 'T50P140', 'pulverizacion', L('Carcasa de bomba impulsora', 'Carcaça da bomba impulsora'), 180, 0, 6, ['T50'],
      L('Repuesto de la bomba de impulsor magnético.', 'Peça da bomba de impulsor magnético.'), '', false),
    P('tanque-liquidos-t50', 'T50P120', 'pulverizacion', L('Tanque de líquidos T50 (solo)', 'Tanque de líquidos T50 (só)'), 540, 0, 2, ['T50'],
      L('Tanque de pulverización de reemplazo.', 'Tanque de pulverização de reposição.'), '', false),
    P('manguera-t100', 'T100P018', 'pulverizacion', L('Manguera del brazo T100', 'Mangueira do braço T100'), 45, 0, 20, ['T100'],
      L('Manguera de líquido que va por el brazo.', 'Mangueira de líquido que passa pelo braço.'), '', false),
    P('sello-bomba', 'T40P060', 'pulverizacion', L('Sello o-ring de bomba magnética', 'Anel de vedação da bomba magnética'), 18, 0, 40, ['T40'],
      L('Repuesto de mantenimiento.', 'Peça de manutenção.'), '', false),
    P('tanque-solido-t70', 'T70P092', 'esparcido', L('Tanque de sólidos 100 L (T70P)', 'Tanque de sólidos 100 L (T70P)'), 890, 0, 2, ['T70P'],
      L('Tanque plástico del sistema de esparcido.', 'Tanque plástico do sistema de espalhamento.'), '', false),
    P('disco-esparcidor', 'T40P312', 'esparcido', L('Disco esparcidor de tanque de sólidos', 'Disco espalhador do tanque de sólidos'), 210, 0, 5, ['T30', 'T40'],
      L('Disco centrífugo del esparcidor.', 'Disco centrífugo do espalhador.'), '', false),
    P('eje-disco', 'T100P195', 'esparcido', L('Eje del disco giratorio T70 y T100', 'Eixo do disco giratório T70 e T100'), 95, 0, 7, ['T100', 'T70P'],
      L('Eje de acero del disco esparcidor.', 'Eixo de aço do disco espalhador.'), '', false),
    P('brazo-t70p-m3', 'T70P009', 'estructura', L('Brazo M3 T70P (trasero izquierdo)', 'Braço M3 T70P (traseiro esquerdo)'), 980, 0, 1, ['T70P'],
      L('Brazo completo de reemplazo.', 'Braço completo de reposição.'), '', false),
    P('brazo-t40-m1', 'T40P015', 'estructura', L('Brazo M1 T40', 'Braço M1 T40'), 760, 0, 2, ['T40'],
      L('Brazo delantero de reemplazo.', 'Braço dianteiro de reposição.'), '', false),
    P('almohadilla', 'T100P139', 'estructura', L('Almohadilla anticolisión para brazo', 'Almofada anticolisão para braço'), 22, 0, 30, ['T100'],
      L('Protección de goma para el brazo.', 'Proteção de borracha para o braço.'), '', false),
    P('perno-traba', 'T100P088', 'estructura', L('Perno de traba de brazo (57,1 mm)', 'Pino de trava do braço (57,1 mm)'), 26, 0, 18, ['T100'],
      L('Perno de fijación del brazo plegable.', 'Pino de fixação do braço dobrável.'), '', false),
    P('base-radar', 'T50P132', 'radares', L('Base de radar delantera', 'Base do radar dianteiro'), 140, 0, 4, ['T50'],
      L('Soporte del radar frontal.', 'Suporte do radar frontal.'), '', false),
    P('soporte-lidar', 'T100P280', 'radares', L('Soporte del radar láser (LiDAR)', 'Suporte do radar laser (LiDAR)'), 160, 0, 3, ['T100'],
      L('Base del sistema LiDAR del T100.', 'Base do sistema LiDAR do T100.'), '', false),
    P('cable-radar', 'T50P107', 'radares', L('Cable de señal del radar frontal', 'Cabo de sinal do radar frontal'), 75, 0, 6, ['T50'],
      L('Cable de datos original.', 'Cabo de dados original.'), '', false),
    P('palanca-control', 'T40P063', 'control', L('Palanca derecha de control remoto', 'Alavanca direita do controle remoto'), 55, 0, 5, ['T40'],
      L('Joystick de repuesto del control.', 'Joystick de reposição do controle.'), '', false),
    P('rc-plus', 'RC-PLUS', 'control', L('Control remoto DJI RC Plus Agras', 'Controle remoto DJI RC Plus Agras'), 1450, 0, 2, ['T100', 'T70P', 'T55', 'T50'],
      L('Control con pantalla de alto brillo para la serie Agras.', 'Controle com tela de alto brilho para a série Agras.'), F + 'control-rc.jpg', false)
  ],

  cursos: [
    { id: 'operador', titulo: L('Operador de drones agrícolas', 'Operador de drones agrícolas'),
      bajada: L('Certificate en el uso profesional de drones agrícolas. Certificado oficial DJI Academy.', 'Certifique-se no uso profissional de drones agrícolas. Certificado oficial DJI Academy.'),
      fecha: '2026-12-05', duracion: L('3 jornadas · 24 horas', '3 jornadas · 24 horas'), modalidad: L('Presencial · teórico y práctico', 'Presencial · teórico e prático'),
      lugar: L('Local Dragur Rivera y campo de práctica', 'Loja Dragur Rivera e campo de prática'), cupos: 12, ocupados: 7, precio: 650,
      imagen: F + 'equipo-campo.jpg', nivel: L('Desde cero', 'Do zero'),
      temario: [L('Componentes del dron y mantenimiento diario', 'Componentes do drone e manutenção diária'), L('Normativa DINACIA y seguridad operacional', 'Normas da DINACIA e segurança operacional'),
        L('Planificación de misiones y mapeo de chacras', 'Planejamento de missões e mapeamento de lavouras'), L('Calibración de pulverización y esparcido', 'Calibração de pulverização e espalhamento'),
        L('Baterías, generador y logística de campo', 'Baterias, gerador e logística de campo'), L('Prácticas de vuelo manual y automático', 'Práticas de voo manual e automático')],
      incluye: [L('Certificado oficial DJI Academy', 'Certificado oficial DJI Academy'), L('Horas de vuelo con equipos Agras', 'Horas de voo com equipamentos Agras'), L('Material de estudio', 'Material de estudo'), L('Almuerzo en las jornadas de campo', 'Almoço nas jornadas de campo')],
      requisitos: [L('Ser mayor de 18 años', 'Ser maior de 18 anos'), L('Cédula de identidad vigente', 'Documento de identidade válido')],
      visible: true, abierto: true },
    { id: 'mantenimiento', titulo: L('Mantenimiento y cuidado del equipo', 'Manutenção e cuidado do equipamento'),
      bajada: L('Aprendé las revisiones que alargan la vida útil de tu dron y evitan paradas en plena zafra.', 'Aprenda as revisões que aumentam a vida útil do seu drone e evitam paradas em plena safra.'),
      fecha: '2026-12-13', duracion: L('1 jornada · 8 horas', '1 jornada · 8 horas'), modalidad: L('Presencial · en el taller', 'Presencial · na oficina'),
      lugar: L('Taller Drones del Pampa, Rivera', 'Oficina Drones del Pampa, Rivera'), cupos: 10, ocupados: 3, precio: 180,
      imagen: IG + 'consejo-tecnico.jpg', nivel: L('Para dueños y pilotos', 'Para donos e pilotos'),
      temario: [L('Limpieza después de cada jornada', 'Limpeza depois de cada jornada'), L('Hélices, motores y brazos: qué revisar', 'Hélices, motores e braços: o que revisar'),
        L('Bombas, aspersores y filtros', 'Bombas, aspersores e filtros'), L('Cuidado y almacenamiento de baterías', 'Cuidado e armazenamento de baterias'), L('Errores frecuentes y cómo leerlos', 'Erros frequentes e como interpretá-los')],
      incluye: [L('Constancia de participación', 'Certificado de participação'), L('Checklist de mantenimiento impreso', 'Checklist de manutenção impresso')],
      requisitos: [L('Tener o operar un dron agrícola (recomendado)', 'Ter ou operar um drone agrícola (recomendado)')],
      visible: true, abierto: true },
    { id: 'mapeo', titulo: L('Mapeo multiespectral con Mavic 3M', 'Mapeamento multiespectral com Mavic 3M'),
      bajada: L('Relevá tus chacras, leé los índices de vegetación y armá prescripciones de dosis variable.', 'Mapeie suas lavouras, interprete os índices de vegetação e crie prescrições de dose variável.'),
      fecha: '2027-01-17', duracion: L('2 jornadas · 14 horas', '2 jornadas · 14 horas'), modalidad: L('Presencial · campo y computadora', 'Presencial · campo e computador'),
      lugar: L('Local Dragur Rivera', 'Loja Dragur Rivera'), cupos: 8, ocupados: 2, precio: 420,
      imagen: F + 'mavic-oscuro.jpg', nivel: L('Intermedio', 'Intermediário'),
      temario: [L('Vuelo de relevamiento con Mavic 3M', 'Voo de levantamento com Mavic 3M'), L('Procesamiento en Pix4Dfields', 'Processamento no Pix4Dfields'),
        L('Índices NDVI y NDRE', 'Índices NDVI e NDRE'), L('Mapas de prescripción para el T100', 'Mapas de prescrição para o T100')],
      incluye: [L('Licencia de prueba de Pix4Dfields', 'Licença de teste do Pix4Dfields'), L('Certificado de aprobación', 'Certificado de aprovação')],
      requisitos: [L('Haber hecho el curso de operador o tener experiencia de vuelo', 'Ter feito o curso de operador ou ter experiência de voo'), L('Traer computadora portátil', 'Trazer notebook')],
      visible: true, abierto: true }
  ],

  promos: [
    { id: 'kit', titulo: L('Kit Agricultura de Precisión completo', 'Kit Agricultura de Precisão completo'),
      texto: L('T100 Kit 365 + generador + Mavic 3 Multiespectral + Pix4Dfields anual, en un solo paquete.', 'T100 Kit 365 + gerador + Mavic 3 Multiespectral + Pix4Dfields anual, em um só pacote.'),
      imagen: IG + 'promo-kit-precision.jpg', precio: 44990, precioAntes: 48026, visible: true },
    { id: 'tanque', titulo: L('T100 con tanque de sólidos de regalo', 'T100 com tanque de sólidos de presente'),
      texto: L('Llevá tu DJI Agras T100 y te regalamos el tanque de sólidos. Ahorrá hasta USD 2.500.', 'Leve seu DJI Agras T100 e ganhe o tanque de sólidos. Economize até USD 2.500.'),
      imagen: IG + 'promo-t100-octubre.jpg', precio: 35400, precioAntes: 37900, visible: true },
    { id: 'recambio', titulo: L('Plan Recambio', 'Plano de Troca'),
      texto: L('Entregá tu dron usado como parte de pago y pasate a la nueva generación Agras.', 'Entregue seu drone usado como parte do pagamento e passe para a nova geração Agras.'),
      imagen: IG + 'local-rivera.jpg', precio: 0, precioAntes: 0, visible: true }
  ],

  tiposService: [L('Mantenimiento / service', 'Manutenção / revisão'), L('Reparación por golpe o falla', 'Conserto por batida ou falha'), L('Diagnóstico de errores', 'Diagnóstico de erros'), L('Baterías y cargadores', 'Baterias e carregadores'), L('Actualización y calibración', 'Atualização e calibração')],

  faq: [
    { p: L('¿Cuánto demora un service?', 'Quanto tempo demora uma revisão?'), r: L('Un mantenimiento común sale en 24 a 48 horas. Si hace falta un repuesto que no está en stock, te avisamos el plazo antes de empezar.', 'Uma manutenção comum fica pronta em 24 a 48 horas. Se faltar uma peça que não está em estoque, avisamos o prazo antes de começar.') },
    { p: L('¿Me mandan el presupuesto antes de reparar?', 'Vocês mandam o orçamento antes de consertar?'), r: L('Sí. Nunca tocamos el equipo sin tu aprobación: el presupuesto te llega por WhatsApp con el detalle de repuestos y horas.', 'Sim. Nunca mexemos no equipamento sem sua aprovação: o orçamento chega pelo WhatsApp com o detalhe de peças e horas.') },
    { p: L('¿La garantía se mantiene si lo reparo con ustedes?', 'A garantia continua se eu consertar com vocês?'), r: L('Sí: somos servicio oficial Dragur. La garantía de DJI se basa justamente en el service hecho en las sucursales oficiales.', 'Sim: somos assistência oficial Dragur. A garantia da DJI se baseia justamente na revisão feita nas filiais oficiais.') },
    { p: L('¿Atienden equipos comprados en otro lado?', 'Atendem equipamentos comprados em outro lugar?'), r: L('Sí, atendemos cualquier dron DJI Agras. Traelo o coordiná con nosotros y lo revisamos.', 'Sim, atendemos qualquer drone DJI Agras. Traga ou combine com a gente e revisamos.') }
  ],

  servicio: [
    { t: L('Recepción', 'Recepção'), d: L('Recibimos el equipo, lo fotografiamos y anotamos todo lo que trae.', 'Recebemos o equipamento, fotografamos e anotamos tudo o que ele traz.') },
    { t: L('Diagnóstico', 'Diagnóstico'), d: L('Revisión completa con las herramientas oficiales de DJI.', 'Revisão completa com as ferramentas oficiais da DJI.') },
    { t: L('Presupuesto', 'Orçamento'), d: L('Te lo mandamos por WhatsApp antes de tocar nada.', 'Enviamos por WhatsApp antes de mexer em qualquer coisa.') },
    { t: L('Reparación', 'Conserto'), d: L('Con repuestos originales y técnicos capacitados por Dragur.', 'Com peças originais e técnicos capacitados pela Dragur.') },
    { t: L('Prueba de vuelo', 'Teste de voo'), d: L('Volamos el equipo antes de devolverlo.', 'Voamos o equipamento antes de devolvê-lo.') },
    { t: L('Entrega', 'Entrega'), d: L('Listo para volver al campo, con la garantía oficial.', 'Pronto para voltar ao campo, com a garantia oficial.') }
  ],

  instagram: [
    { img: IG + 'local-rivera.jpg', url: 'https://www.instagram.com/dragur_rivera_drones_del_pampa/reel/DfmWaXtTXCj/', video: IG + 'ig-repuestos.mp4' },
    { img: IG + 'portada-t100.jpg', url: 'https://www.instagram.com/dragur.uy/reel/DMIMi_hs93R/' },
    { img: IG + 'lanzamiento-claudio.jpg', url: 'https://www.instagram.com/claudiovandes/reel/DbMKlWGx8Ap/', video: IG + 'ig-lanzamiento.mp4' },
    { img: IG + 'curso-operador.jpg', url: 'https://www.instagram.com/claudiovandes/reel/DeNiZpLyGfj/', video: IG + 'ig-claudio-taller.mp4' },
    { img: IG + 'portada-t70p.jpg', url: 'https://www.instagram.com/dragur.uy/reel/DMIL7zWM-x6/' },
    { img: IG + 'consejo-tecnico.jpg', url: 'https://www.instagram.com/dragur_rivera_drones_del_pampa/reel/DdedhGbz4I-/', video: IG + 'ig-revisiones.mp4' },
    { img: IG + 'portada-t25p.jpg', url: 'https://www.instagram.com/dragur.uy/reel/DMILhDaNdNJ/' },
    { img: IG + 't100-dual-battery.jpg', url: 'https://www.instagram.com/claudiovandes/reel/DeSCnxBso9O/', video: IG + 'ig-t100-dual.mp4' }
  ],

  inscripciones: [],
  dinacia: [],
  services: [],
  pedidos: [],
  mensajes: []
};

// Arma un producto de la tienda (para no repetir las claves en cada uno)
function P(id, codigo, cat, nombre, precio, precioAntes, stock, modelos, desc, foto, destacado){
  return { id, codigo, cat, nombre, precio, precioAntes, stock, modelos, desc, foto: foto || '', destacado: !!destacado, visible: true };
}

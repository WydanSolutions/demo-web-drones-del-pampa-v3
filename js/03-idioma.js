/* =====================================================================
   IDIOMA: español / portugués.
   - t('clave')  → textos fijos de la página (menús, botones, avisos)
   - tx(valor)   → textos editables guardados como { es, pt }
                   (si el portugués está vacío, se muestra el español)
   ===================================================================== */
const IDIOMAS = {
  es: {
    p_inicio: 'Inicio', p_drones: 'Drones', p_tienda: 'Tienda', p_cursos: 'Cursos', p_servicio: 'Servicio técnico', p_nosotros: 'Nosotros', p_contacto: 'Contacto', p_mas: 'Más', p_dinacia: 'DINACIA',
    hablar_claudio: 'Escribinos por WhatsApp', escribinos: 'Escribinos', conoce_equipo: 'Conocé al equipo', ver_drones: 'Ver los drones', ir_tienda: 'Ir a la tienda', ver_todo: 'Ver todo', volver: 'Volver',
    b_comprar: 'Comprar un dron', b_comprar_d: 'Asesoramiento para elegir el equipo justo para tus hectáreas.',
    b_rep: 'Repuestos', b_rep_d: 'Stock en Rivera de hélices, baterías, motores y más.',
    b_serv: 'Service y reparación', b_serv_d: 'Taller oficial, presupuesto antes de tocar nada.',
    b_cursos: 'Cursos para pilotos', b_cursos_d: 'Aprendé a volar con práctica real y certificado.',
    destacados: 'Drones destacados', proximo_curso: 'Próximo curso', faltan: 'Faltan', dias: 'días', horas: 'horas', min: 'min',
    promos: 'Promociones', instagram: 'En Instagram', ver_ig: 'Ver en Instagram', mirar_video: 'Mirá el video', sonido: 'Activar sonido',
    desde: 'desde', consultar_precio: 'Consultar precio', ver_ficha: 'Ver ficha', agregar: 'Agregar al pedido', consultar: 'Consultar por WhatsApp',
    arrastra: 'Arrastrá para girar', especificaciones: 'Especificaciones', galeria: 'Galería', repuestos_modelo: 'Repuestos para este modelo', otros_modelos: 'Otros modelos',
    comparar: 'Comparar', comparando: 'Comparar modelos', quitar_comp: 'Quitar', elegir_2: 'Elegí al menos 2 modelos para comparar.', asesor: '¿Qué dron me conviene?',
    q1: '¿Cuántas hectáreas trabajás por año?', q1a: 'Menos de 500', q1b: 'Entre 500 y 2.000', q1c: 'Más de 2.000',
    q2: '¿Qué trabajo vas a hacer más?', q2a: 'Pulverizar', q2b: 'Esparcir (fertilizante, semilla)', q2c: 'Mapear y relevar',
    q3: '¿Cómo es tu terreno?', q3a: 'Chacras grandes y abiertas', q3b: 'Lomadas, montes o huertos', q3c: 'Parcelas chicas',
    te_recomendamos: 'Te recomendamos', otra_vez: 'Empezar de nuevo', siguiente: 'Siguiente',
    buscar: 'Buscar por nombre, código o modelo…', categorias: 'Categorías', todas: 'Todo', modelo: 'Modelo compatible', solo_stock: 'Solo con stock', precio_max: 'Precio hasta',
    filtros: 'Filtros', limpiar: 'Limpiar filtros', resultados: 'resultados', orden_dest: 'Destacados', orden_menor: 'Menor precio', orden_mayor: 'Mayor precio', orden_nombre: 'Nombre',
    stock_hay: 'En stock', stock_poco: 'Últimas unidades', stock_no: 'A pedido', codigo: 'Código', compatible: 'Compatible con', relacionados: 'También te puede servir',
    sin_resultados: 'No encontramos productos con esos filtros.', cantidad: 'Cantidad',
    carrito: 'Tu pedido', carrito_vacio: 'Todavía no agregaste nada.', total: 'Total estimado', enviar_pedido: 'Enviar pedido por WhatsApp',
    pedido_nota: 'Te confirmamos stock, precio final y forma de pago por WhatsApp. Precios en dólares, IVA incluido.',
    agregado: 'Agregado a tu pedido', tu_nombre: 'Tu nombre', tu_telefono: 'Tu teléfono', tu_ciudad: 'Ciudad o localidad',
    ver_curso: 'Ver el curso', inscribirme: 'Inscribirme', cupos_libres: 'lugares libres', cupo_lleno: 'Cupo completo', lista_espera: 'Anotarme en lista de espera',
    fecha: 'Fecha', duracion: 'Duración', modalidad: 'Modalidad', lugar: 'Lugar', nivel: 'Nivel', inversion: 'Inversión', empieza_en: 'Empieza en',
    temario: 'Qué vas a aprender', incluye: 'Incluye', requisitos: 'Requisitos', inscripcion: 'Inscripción',
    f_nombre: 'Nombre y apellido', f_ci: 'Cédula de identidad', f_telefono: 'Teléfono / WhatsApp', f_email: 'Correo electrónico', f_ciudad: 'Ciudad',
    f_experiencia: '¿Ya volaste drones?', f_exp_no: 'No, nunca', f_exp_algo: 'Sí, drones chicos', f_exp_agro: 'Sí, drones agrícolas',
    f_comentario: 'Comentario (opcional)', f_obligatorio: 'Completá este dato', f_mail_mal: 'Revisá el correo',
    inscripto_ok: '¡Listo! Ya estás inscripto', inscripto_txt: 'Te escribimos para confirmar el lugar y la forma de pago. Si querés, avisanos ahora por WhatsApp.',
    avisar_wa: 'Avisar por WhatsApp', cerrar: 'Cerrar',
    agendar: 'Agendá tu service', s_equipo: 'Tu equipo', s_otro: 'Otro equipo', s_tipo: '¿Qué necesitás?', s_serie: 'N° de serie (opcional)', s_problema: 'Contanos qué le pasa',
    s_fecha: '¿Cuándo lo traés?', s_retiro: 'Necesito que lo pasen a buscar', s_enviar: 'Pedir turno', s_ok: '¡Turno pedido!', s_ok_txt: 'Te confirmamos el día por WhatsApp. Si querés, mandanos ahora fotos o un video de la falla.',
    pasos: 'Cómo trabajamos', garantia: 'Garantía oficial', garantia_txt: 'Somos servicio oficial Dragur: la garantía DJI se mantiene con el service hecho acá.',
    preguntas: 'Preguntas frecuentes', consejos: 'Consejos de Claudio', hasta: 'Válido hasta', ver_promo: 'Me interesa',
    nos_local: 'Nuestro local en Rivera', la_noche: 'La noche del lanzamiento', red: 'Parte de la red Dragur', red_txt: 'Respaldo de 6 sucursales y más de 10 puntos de venta en todo el Uruguay.',
    c_telefonos: 'Teléfonos', c_horarios: 'Horarios', c_direccion: 'Dónde estamos', c_email: 'Correo', c_mensaje: '¿En qué te podemos ayudar?',
    c_enviar: 'Enviar mensaje', c_enviado: 'Mensaje enviado. Te respondemos en el día.', c_motivo: 'Motivo', c_m_compra: 'Comprar un dron', c_m_rep: 'Repuestos',
    c_m_serv: 'Servicio técnico', c_m_curso: 'Cursos', c_m_otro: 'Otro', como_llegar: 'Cómo llegar',
    cta_titulo: '¿Tenés una consulta?', cta_txt: 'Nuestro equipo te responde por WhatsApp en el día.',
    pie_txt: 'Sucursal oficial Dragur en Rivera. Drones agrícolas DJI, repuestos, servicio técnico y academia de pilotos.',
    administrar: 'Administrar', derechos: 'Todos los derechos reservados.', hecho: 'Página hecha por', idioma: 'Idioma', precios_usd: 'Precios en dólares estadounidenses.'
  },
  pt: {
    p_inicio: 'Início', p_drones: 'Drones', p_tienda: 'Loja', p_cursos: 'Cursos', p_servicio: 'Assistência técnica', p_nosotros: 'Sobre nós', p_contacto: 'Contato', p_mas: 'Mais', p_dinacia: 'DINACIA',
    hablar_claudio: 'Fale conosco no WhatsApp', escribinos: 'Fale conosco', conoce_equipo: 'Conheça a equipe', ver_drones: 'Ver os drones', ir_tienda: 'Ir à loja', ver_todo: 'Ver tudo', volver: 'Voltar',
    b_comprar: 'Comprar um drone', b_comprar_d: 'Assessoria para escolher o equipamento certo para seus hectares.',
    b_rep: 'Peças', b_rep_d: 'Estoque em Rivera de hélices, baterias, motores e mais.',
    b_serv: 'Revisão e conserto', b_serv_d: 'Oficina oficial, orçamento antes de mexer em qualquer coisa.',
    b_cursos: 'Cursos para pilotos', b_cursos_d: 'Aprenda a pilotar com prática real e certificado.',
    destacados: 'Drones em destaque', proximo_curso: 'Próximo curso', faltan: 'Faltam', dias: 'dias', horas: 'horas', min: 'min',
    promos: 'Promoções', instagram: 'No Instagram', ver_ig: 'Ver no Instagram', mirar_video: 'Veja o vídeo', sonido: 'Ativar som',
    desde: 'a partir de', consultar_precio: 'Consultar preço', ver_ficha: 'Ver ficha', agregar: 'Adicionar ao pedido', consultar: 'Consultar pelo WhatsApp',
    arrastra: 'Arraste para girar', especificaciones: 'Especificações', galeria: 'Galeria', repuestos_modelo: 'Peças para este modelo', otros_modelos: 'Outros modelos',
    comparar: 'Comparar', comparando: 'Comparar modelos', quitar_comp: 'Remover', elegir_2: 'Escolha pelo menos 2 modelos para comparar.', asesor: 'Qual drone é para mim?',
    q1: 'Quantos hectares você trabalha por ano?', q1a: 'Menos de 500', q1b: 'Entre 500 e 2.000', q1c: 'Mais de 2.000',
    q2: 'Que trabalho você vai fazer mais?', q2a: 'Pulverizar', q2b: 'Espalhar (fertilizante, semente)', q2c: 'Mapear e levantar dados',
    q3: 'Como é o seu terreno?', q3a: 'Lavouras grandes e abertas', q3b: 'Coxilhas, matas ou pomares', q3c: 'Talhões pequenos',
    te_recomendamos: 'Recomendamos', otra_vez: 'Começar de novo', siguiente: 'Próximo',
    buscar: 'Buscar por nome, código ou modelo…', categorias: 'Categorias', todas: 'Tudo', modelo: 'Modelo compatível', solo_stock: 'Só com estoque', precio_max: 'Preço até',
    filtros: 'Filtros', limpiar: 'Limpar filtros', resultados: 'resultados', orden_dest: 'Destaques', orden_menor: 'Menor preço', orden_mayor: 'Maior preço', orden_nombre: 'Nome',
    stock_hay: 'Em estoque', stock_poco: 'Últimas unidades', stock_no: 'Sob encomenda', codigo: 'Código', compatible: 'Compatível com', relacionados: 'Também pode servir',
    sin_resultados: 'Não encontramos produtos com esses filtros.', cantidad: 'Quantidade',
    carrito: 'Seu pedido', carrito_vacio: 'Você ainda não adicionou nada.', total: 'Total estimado', enviar_pedido: 'Enviar pedido pelo WhatsApp',
    pedido_nota: 'Confirmamos estoque, preço final e forma de pagamento pelo WhatsApp. Preços em dólares, impostos incluídos.',
    agregado: 'Adicionado ao seu pedido', tu_nombre: 'Seu nome', tu_telefono: 'Seu telefone', tu_ciudad: 'Cidade',
    ver_curso: 'Ver o curso', inscribirme: 'Inscrever-me', cupos_libres: 'vagas livres', cupo_lleno: 'Vagas esgotadas', lista_espera: 'Entrar na lista de espera',
    fecha: 'Data', duracion: 'Duração', modalidad: 'Modalidade', lugar: 'Local', nivel: 'Nível', inversion: 'Investimento', empieza_en: 'Começa em',
    temario: 'O que você vai aprender', incluye: 'Inclui', requisitos: 'Requisitos', inscripcion: 'Inscrição',
    f_nombre: 'Nome e sobrenome', f_ci: 'Documento de identidade', f_telefono: 'Telefone / WhatsApp', f_email: 'E-mail', f_ciudad: 'Cidade',
    f_experiencia: 'Já pilotou drones?', f_exp_no: 'Não, nunca', f_exp_algo: 'Sim, drones pequenos', f_exp_agro: 'Sim, drones agrícolas',
    f_comentario: 'Comentário (opcional)', f_obligatorio: 'Preencha este campo', f_mail_mal: 'Confira o e-mail',
    inscripto_ok: 'Pronto! Você está inscrito', inscripto_txt: 'Vamos escrever para confirmar a vaga e a forma de pagamento. Se quiser, avise agora pelo WhatsApp.',
    avisar_wa: 'Avisar pelo WhatsApp', cerrar: 'Fechar',
    agendar: 'Agende sua revisão', s_equipo: 'Seu equipamento', s_otro: 'Outro equipamento', s_tipo: 'Do que você precisa?', s_serie: 'N° de série (opcional)', s_problema: 'Conte o que está acontecendo',
    s_fecha: 'Quando você traz?', s_retiro: 'Preciso que busquem o equipamento', s_enviar: 'Pedir horário', s_ok: 'Horário pedido!', s_ok_txt: 'Confirmamos o dia pelo WhatsApp. Se quiser, mande agora fotos ou um vídeo da falha.',
    pasos: 'Como trabalhamos', garantia: 'Garantia oficial', garantia_txt: 'Somos assistência oficial Dragur: a garantia DJI continua com a revisão feita aqui.',
    preguntas: 'Perguntas frequentes', consejos: 'Dicas do Claudio', hasta: 'Válido até', ver_promo: 'Tenho interesse',
    nos_local: 'Nossa loja em Rivera', la_noche: 'A noite do lançamento', red: 'Parte da rede Dragur', red_txt: 'Respaldo de 6 filiais e mais de 10 pontos de venda em todo o Uruguai.',
    c_telefonos: 'Telefones', c_horarios: 'Horários', c_direccion: 'Onde estamos', c_email: 'E-mail', c_mensaje: 'Como podemos ajudar?',
    c_enviar: 'Enviar mensagem', c_enviado: 'Mensagem enviada. Respondemos no mesmo dia.', c_motivo: 'Motivo', c_m_compra: 'Comprar um drone', c_m_rep: 'Peças',
    c_m_serv: 'Assistência técnica', c_m_curso: 'Cursos', c_m_otro: 'Outro', como_llegar: 'Como chegar',
    cta_titulo: 'Tem alguma dúvida?', cta_txt: 'Nossa equipe responde pelo WhatsApp no mesmo dia.',
    pie_txt: 'Filial oficial Dragur em Rivera. Drones agrícolas DJI, peças, assistência técnica e academia de pilotos.',
    administrar: 'Administrar', derechos: 'Todos os direitos reservados.', hecho: 'Site feito por', idioma: 'Idioma', precios_usd: 'Preços em dólares americanos.'
  }
};

let IDIOMA = (() => { try { return localStorage.getItem('dp_idioma') || 'es'; } catch (e) { return 'es'; } })();
if (/[?&]lang=pt/.test(location.search)) IDIOMA = 'pt';

const t = (k) => (IDIOMAS[IDIOMA] && IDIOMAS[IDIOMA][k]) || IDIOMAS.es[k] || k;
function tx(v){
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  return (v[IDIOMA] && String(v[IDIOMA]).trim()) ? v[IDIOMA] : (v.es || '');
}

function cambiarIdioma(nuevo){
  if (nuevo === IDIOMA) return;
  IDIOMA = nuevo;
  try { localStorage.setItem('dp_idioma', nuevo); } catch (e) {}
  document.documentElement.lang = nuevo === 'pt' ? 'pt-BR' : 'es-UY';
  transicion(() => dibujarTodo(), nuevo === 'pt' ? 'Português' : 'Español');
}

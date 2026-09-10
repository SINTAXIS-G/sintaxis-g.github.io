// Control por gestos + voz — SINTAXIS G
// Handsfree.js (CDN) controla el scroll con la altura de la mano.
// Web Speech API (nativa del navegador) controla la navegación por voz.
// Los gestos son 100% locales. La voz usa el motor de reconocimiento del navegador
// (en Chrome eso pasa por servidores de Google; los gestos no salen de tu máquina).

(function () {
  const boton = document.getElementById('gestos-toggle');
  if (!boton) return;

  const etiqueta = boton.querySelector('span') || boton;
  let activo = false;

  // ---------- ¿En qué página estamos? ----------
  const ruta = location.pathname;
  const enProjects = ruta.includes('/projects/');
  const enArchangel = ruta.includes('archangel.html');
  const enKairos = ruta.includes('kairos.html');

  // Prefijo para construir rutas relativas correctas según dónde estemos parados
  const raiz = enProjects ? '../' : '';
  const carpetaProjects = enProjects ? '' : 'projects/';

  // ---------- GESTOS: scroll con la altura de la mano ----------
  let ultimoGesto = 0;
  let handsfree = null;

  if (typeof Handsfree !== 'undefined') {
    handsfree = new Handsfree({ hands: true });

    handsfree.use('scrollControl', (data) => {
      const hands = data.hands;
      if (!hands || !hands.landmarksVisible) return;

      let puntos = null;
      if (hands.landmarksVisible[0] && hands.landmarks?.[0]) {
        puntos = hands.landmarks[0];
      } else if (hands.landmarksVisible[1] && hands.landmarks?.[1]) {
        puntos = hands.landmarks[1];
      }
      if (!puntos || !puntos[0]) return;

      const ahora = Date.now();
      if (ahora - ultimoGesto < 800) return; // evita spam de scroll

      const muñeca = puntos[0];
      const y = muñeca.y;

      if (y < 0.35) {
        window.scrollBy({ top: -400, behavior: 'smooth' });
        ultimoGesto = ahora;
      } else if (y > 0.65) {
        window.scrollBy({ top: 400, behavior: 'smooth' });
        ultimoGesto = ahora;
      }
    });
  }

  // ---------- VOZ: navegación por comandos ----------
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let reconocimiento = null;

  function irA(url) {
    window.location.href = url;
  }

  function irASeccion(id) {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Comandos disponibles en TODAS las páginas: moverse entre páginas del sitio
  const COMANDOS_GLOBALES = [
    {
      frases: ['portada', 'página principal', 'pagina principal', 'ir al inicio', 'ir a inicio'],
      accion: () => (enProjects ? irA(raiz + 'index.html') : window.scrollTo({ top: 0, behavior: 'smooth' })),
    },
    {
      frases: ['ir a archangel', 'página de archangel', 'pagina de archangel', 'abrir archangel'],
      accion: () => (enArchangel ? window.scrollTo({ top: 0, behavior: 'smooth' }) : irA(carpetaProjects + 'archangel.html')),
    },
    {
      frases: ['ir a kairos', 'página de kairos', 'pagina de kairos', 'abrir kairos'],
      accion: () => (enKairos ? window.scrollTo({ top: 0, behavior: 'smooth' }) : irA(carpetaProjects + 'kairos.html')),
    },
    { frases: ['arriba', 'sube', 'subir'], accion: () => window.scrollBy({ top: -500, behavior: 'smooth' }) },
    { frases: ['abajo', 'baja', 'bajar'], accion: () => window.scrollBy({ top: 500, behavior: 'smooth' }) },
    { frases: ['arriba del todo', 'muy arriba'], accion: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { frases: ['abajo del todo', 'muy abajo', 'final de la página', 'final de la pagina'], accion: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
  ];

  // Secciones propias de index.html
  const SECCIONES_INICIO = [
    { frases: ['archangel'], destino: '#archangel' },
    { frases: ['ecosistema'], destino: '#ecosistema' },
    { frases: ['sobre mi', 'sobre mí'], destino: '#sobre-mi' },
    { frases: ['contacto'], destino: '#contacto' },
  ];

  // Secciones propias de projects/archangel.html
  const SECCIONES_ARCHANGEL = [
    { frases: ['resumen'], destino: '#resumen' },
    { frases: ['video', 'vídeo'], destino: '#video' },
    { frases: ['problema'], destino: '#problema' },
    { frases: ['fracturas'], destino: '#fracturas' },
    { frases: ['arquitectura'], destino: '#arquitectura' },
    { frases: ['analizadores'], destino: '#analizadores' },
    { frases: ['comparativa'], destino: '#comparativa' },
    { frases: ['bitácora', 'bitacora'], destino: '#bitacora' },
    { frases: ['planes'], destino: '#planes' },
    { frases: ['seguridad'], destino: '#seguridad' },
    { frases: ['roadmap', 'hoja de ruta'], destino: '#roadmap' },
    { frases: ['preguntas', 'faq'], destino: '#faq' },
    { frases: ['glosario'], destino: '#glosario' },
    { frases: ['inicio rápido', 'inicio rapido', 'quickstart'], destino: '#quickstart' },
    { frases: ['demo'], destino: '#demo' },
  ];

  // Secciones propias de projects/kairos.html
  const SECCIONES_KAIROS = [
    { frases: ['capturas'], destino: '#capturas' },
    { frases: ['filosofía', 'filosofia'], destino: '#filosofia' },
    { frases: ['flujo'], destino: '#flujo' },
    { frases: ['niveles'], destino: '#niveles' },
    { frases: ['radio de impacto'], destino: '#radio-impacto' },
    { frases: ['privacidad'], destino: '#privacidad' },
    { frases: ['stack'], destino: '#stack' },
    { frases: ['auditorías', 'auditorias'], destino: '#auditorias' },
    { frases: ['carta'], destino: '#carta' },
  ];

  let COMANDOS = [...COMANDOS_GLOBALES];
  if (enArchangel) {
    COMANDOS = COMANDOS.concat(SECCIONES_ARCHANGEL.map(c => ({ frases: c.frases, accion: () => irASeccion(c.destino) })));
  } else if (enKairos) {
    COMANDOS = COMANDOS.concat(SECCIONES_KAIROS.map(c => ({ frases: c.frases, accion: () => irASeccion(c.destino) })));
  } else {
    COMANDOS = COMANDOS.concat(SECCIONES_INICIO.map(c => ({ frases: c.frases, accion: () => irASeccion(c.destino) })));
  }

  function procesarComando(texto) {
    const dicho = texto.toLowerCase().trim();
    // Ordenamos por longitud de frase descendente para que "ir a archangel" gane sobre "archangel" suelto
    const candidatos = COMANDOS
      .flatMap(cmd => cmd.frases.map(f => ({ frase: f, cmd })))
      .filter(({ frase }) => dicho.includes(frase))
      .sort((a, b) => b.frase.length - a.frase.length);

    if (candidatos.length > 0) candidatos[0].cmd.accion();
  }

  if (SpeechRecognition) {
    reconocimiento = new SpeechRecognition();
    reconocimiento.lang = 'es-MX';
    reconocimiento.continuous = true;
    reconocimiento.interimResults = false;

    reconocimiento.onresult = (event) => {
      const ultimo = event.results[event.results.length - 1];
      if (ultimo.isFinal) procesarComando(ultimo[0].transcript);
    };

    reconocimiento.onend = () => {
      if (activo) reconocimiento.start(); // el navegador corta el reconocimiento cada ~60s
    };

    reconocimiento.onerror = (e) => console.warn('Reconocimiento de voz:', e.error);
  }

  // ---------- Botón: activa/desactiva ambos sistemas ----------
  boton.addEventListener('click', () => {
    if (!activo) {
      if (handsfree) handsfree.start();
      if (reconocimiento) reconocimiento.start();
      etiqueta.textContent = 'Desactivar control por voz/gestos';
      boton.setAttribute('aria-pressed', 'true');
    } else {
      if (handsfree) handsfree.stop();
      if (reconocimiento) reconocimiento.stop();
      etiqueta.textContent = 'Activar control por voz/gestos';
      boton.setAttribute('aria-pressed', 'false');
    }
    activo = !activo;
  });
})();
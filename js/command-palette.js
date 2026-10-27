// ============================================================
// SINTAXIS G — Command palette (Ctrl/Cmd+K)
// Búsqueda rápida de cualquier sección del sitio, sin recargar
// si el destino está en la misma página.
// ============================================================

(function () {
  const ITEMS = [
    // ---------- Páginas ----------
    { title: 'Inicio', subtitle: 'sintaxisg.com', url: '/index.html', group: 'Páginas' },
    { title: 'ARCHANGEL — página completa', subtitle: 'Arquitectura, capacidades, planes', url: '/projects/archangel.html', group: 'Páginas' },
    { title: 'ARCHANGEL Ω — Blueprint Cuántico (Reactor 2.5D)', subtitle: 'Inspector interactivo de los 8 cuadrantes, telemetría y KaTeX', url: '/projects/archangel-blueprint.html', group: 'Páginas' },
    { title: 'ARCHANGEL Ω — Banco de Calibración de Radar 3D', subtitle: 'Simulador táctico, z-sorting, retículo de adquisición y cinemática', url: '/projects/archangel-radar-test.html', group: 'Páginas' },
    { title: 'EXARKON — página completa', subtitle: 'Sistema operativo cognitivo, protocolo V.E.R.A. y hardware watchdog', url: '/projects/exarkon.html', group: 'Páginas' },
    { title: 'Artículos técnicos', subtitle: 'Bitácora de desarrollo de ARCHANGEL', url: '/projects/archangel-articulos.html', group: 'Páginas' },
    { title: 'A.R.G.O.S. — página completa', subtitle: 'Cartografía arquitectónica y telemetría estática pura', url: '/projects/argos.html', group: 'Páginas' },
    { title: 'KAIROS — página completa', subtitle: 'App de asistencia en emergencias', url: '/projects/kairos.html', group: 'Páginas' },

    // ---------- Ecosistema Sintaxis G ----------
    { title: 'SYS-01: EXARKON', subtitle: 'Sandbox 7 capas & razonamiento adaptativo a GPU', url: '/index.html#sys-exarkon', group: 'Ecosistema' },
    { title: 'SYS-02: EIDOLON', subtitle: 'Simulación cognitiva de entidades & memoria persistente', url: '/index.html#sys-eidolon', group: 'Ecosistema' },
    { title: 'Laboratorio: Curva de Ebbinghaus', subtitle: 'Osciloscopio interactivo R(t) = e^(-t/S)', url: '/index.html#memoria', group: 'Ecosistema' },
    { title: 'SYS-03: A.R.K.', subtitle: 'Navegador de privacidad estricta & congelación de RAM', url: '/index.html#sys-ark', group: 'Ecosistema' },
    { title: 'SYS-04: A.R.G.O.S.', subtitle: 'Cartografía arquitectónica y telemetría estática en stdlib puro', url: '/projects/argos.html', group: 'Ecosistema' },
    { title: 'SYS-05: KAIROS (Sistema)', subtitle: 'Asistencia en emergencias con Dead Man\'s Switch offline', url: '/index.html#sys-kairos', group: 'Ecosistema' },
    { title: 'SYS-06: Cazador de Enlaces', subtitle: 'Agente táctico para detección de inconsistencias cruzadas', url: '/index.html#sys-cazador', group: 'Ecosistema' },
    { title: 'Ecosistema (Visión general)', subtitle: 'Bento Grid de sistemas técnicos integrados', url: '/index.html#ecosistema', group: 'Ecosistema' },
    { title: 'Dossier // 01 — Sobre mí', subtitle: 'Manifiesto de ingeniería, stack y filosofía', url: '/index.html#sobre-mi', group: 'Sobre mí' },
    { title: 'Contacto directo', subtitle: 'Telegram, GitHub, email y canales seguros', url: '/index.html#contacto', group: 'Contacto' },

    // ---------- ARCHANGEL ----------
    { title: 'Banco de Calibración de Radar 3D', subtitle: 'Ajuste de física, bloom, z-sorting y órbita táctica', url: '/projects/archangel-radar-test.html', group: 'ARCHANGEL' },
    { title: 'Blueprint Cuántico & Reactor 2.5D', subtitle: 'Simulador visual interactivo CERN de los 8 sectores', url: '/projects/archangel-blueprint.html', group: 'ARCHANGEL' },
    { title: '¿Qué es ARCHANGEL?', url: '/projects/archangel.html#resumen', group: 'ARCHANGEL' },
    { title: 'Capacidades verificadas', url: '/projects/archangel.html#capacidades-verificadas', group: 'ARCHANGEL' },
    { title: 'En acción (video)', url: '/projects/archangel.html#video', group: 'ARCHANGEL' },
    { title: 'El problema → la respuesta', url: '/projects/archangel.html#problema', group: 'ARCHANGEL' },
    { title: 'Predicción de fracturas', url: '/projects/archangel.html#fracturas', group: 'ARCHANGEL' },
    { title: 'AQL Engine v2.0', url: '/projects/archangel.html#aql', group: 'ARCHANGEL' },
    { title: 'Health Score & anti-patrones', url: '/projects/archangel.html#health-score', group: 'ARCHANGEL' },
    { title: 'Taint & secret-leak analysis', url: '/projects/archangel.html#taint', group: 'ARCHANGEL' },
    { title: 'Sistema nervioso (ANS)', url: '/projects/archangel.html#sistema-nervioso', group: 'ARCHANGEL' },
    { title: 'Motores autónomos', url: '/projects/archangel.html#motores-autonomos', group: 'ARCHANGEL' },
    { title: 'Memoria & chat con IA local', url: '/projects/archangel.html#memoria-chat', group: 'ARCHANGEL' },
    { title: 'Arquitectura técnica', url: '/projects/archangel.html#arquitectura', group: 'ARCHANGEL' },
    { title: 'Catálogo de analizadores', url: '/projects/archangel.html#analizadores', group: 'ARCHANGEL' },
    { title: 'Comparativa honesta', url: '/projects/archangel.html#comparativa', group: 'ARCHANGEL' },
    { title: 'Bitácora de desarrollo', url: '/projects/archangel.html#bitacora', group: 'ARCHANGEL' },
    { title: 'Planes y precios', url: '/projects/archangel.html#planes', group: 'ARCHANGEL' },
    { title: 'Seguridad & datos', url: '/projects/archangel.html#seguridad', group: 'ARCHANGEL' },
    { title: 'Roadmap', url: '/projects/archangel.html#roadmap', group: 'ARCHANGEL' },
    { title: 'Empaquetado óptimo (MCKP)', url: '/projects/archangel.html#mckp', group: 'ARCHANGEL' },
    { title: 'Ejecución simbólica', url: '/projects/archangel.html#symbolic-exec', group: 'ARCHANGEL' },
    { title: 'Límite de Chandrasekhar', url: '/projects/archangel.html#chandrasekhar', group: 'ARCHANGEL' },
    { title: 'Prompt Thermodynamics', url: '/projects/archangel.html#prompt-thermo', group: 'ARCHANGEL' },
    { title: 'Anatomía de un reporte real', url: '/projects/archangel.html#reporte-real', group: 'ARCHANGEL' },
    { title: 'ARCHANGEL analizándose a sí mismo', url: '/projects/archangel.html#auto-analisis', group: 'ARCHANGEL' },
    { title: 'Preguntas frecuentes', url: '/projects/archangel.html#faq', group: 'ARCHANGEL' },
    { title: 'Glosario', url: '/projects/archangel.html#glosario', group: 'ARCHANGEL' },
    { title: 'Quickstart', url: '/projects/archangel.html#quickstart', group: 'ARCHANGEL' },
    { title: 'Demo interactiva', url: '/projects/archangel.html#demo', group: 'ARCHANGEL' },

    // ---------- EXARKON ----------
    { title: '¿Qué es EXARKON? (Soberanía)', url: '/projects/exarkon.html#resumen', group: 'EXARKON' },
    { title: 'Arquitectura Decacapa (x00 a x09)', url: '/projects/exarkon.html#arquitectura', group: 'EXARKON' },
    { title: 'Protocolo V.E.R.A. (Sandbox Zero-Trust)', url: '/projects/exarkon.html#vera', group: 'EXARKON' },
    { title: 'Hardware Eye & Protocolo Sol Negro', url: '/projects/exarkon.html#hardware', group: 'EXARKON' },
    { title: 'Cuadrilla de Agentes Autónomos', url: '/projects/exarkon.html#agentes', group: 'EXARKON' },
    { title: 'Dead Man\'s Switch (Cordón Umbilical)', url: '/projects/exarkon.html#dms', group: 'EXARKON' },
    { title: 'La Bóveda Hexagonal (HEX_BOVEDA)', url: '/projects/exarkon.html#boveda', group: 'EXARKON' },
    { title: 'Comparativa: Nube vs. EXARKON', url: '/projects/exarkon.html#comparativa', group: 'EXARKON' },
    { title: 'Métricas de Código (32,476 líneas)', url: '/projects/exarkon.html#metricas', group: 'EXARKON' },
    { title: 'Preguntas Frecuentes & FAQ', url: '/projects/exarkon.html#faq', group: 'EXARKON' },

    // ---------- KAIROS ----------
    { title: 'Capturas de pantalla', url: '/projects/kairos.html#capturas', group: 'KAIROS' },
    { title: 'Filosofía de diseño', url: '/projects/kairos.html#filosofia', group: 'KAIROS' },
    { title: 'Flujo de uso', url: '/projects/kairos.html#flujo', group: 'KAIROS' },
    { title: 'Niveles de alerta', url: '/projects/kairos.html#niveles', group: 'KAIROS' },
    { title: 'Radio de impacto', url: '/projects/kairos.html#radio-impacto', group: 'KAIROS' },
    { title: 'Privacidad', url: '/projects/kairos.html#privacidad', group: 'KAIROS' },
    { title: 'Stack técnico', url: '/projects/kairos.html#stack', group: 'KAIROS' },
    { title: 'Auditorías', url: '/projects/kairos.html#auditorias', group: 'KAIROS' },
    { title: 'Carta al usuario', url: '/projects/kairos.html#carta', group: 'KAIROS' },

    // ---------- Artículos ----------
    { title: 'Termodinámica aplicada a corregir código con LLMs', url: '/articulos/termodinamica-llms.html', group: 'Artículos' },
    { title: 'Dónde cortar un God Object: bisección espectral', url: '/articulos/god-object-biseccion-espectral.html', group: 'Artículos' },
    { title: 'PID + Bellman + Selección Clonal', url: '/articulos/pid-bellman-seleccion-clonal.html', group: 'Artículos' },
    { title: 'La Ley de Conway, verificada con datos', url: '/articulos/ley-de-conway-verificada.html', group: 'Artículos' },
    { title: 'El Bus Factor, medido en serio', url: '/articulos/bus-factor-medido-en-serio.html', group: 'Artículos' },
    { title: 'RAG para código fuente: diez técnicas', url: '/articulos/rag-para-codigo-fuente.html', group: 'Artículos' },
    { title: 'Le puse un LLM local a mi codebase', url: '/articulos/llm-local-documentacion-codebase.html', group: 'Artículos' },
    { title: 'No existe el código perfecto', url: '/articulos/no-existe-codigo-perfecto.html', group: 'Artículos' },
    { title: 'Ponerle nombre a un bug', url: '/articulos/nombrar-bugs.html', group: 'Artículos' },

    // ---------- Comandos y Telemetría ----------
    { title: 'Auditoría de Entropía de Shannon', subtitle: 'Calcula en vivo H = -Σ p log2(p) sobre el DOM actual', action: 'meta-audit', group: 'Comandos' },
    { title: 'Alternar Sonido Táctil', subtitle: 'Activa o silencia el sintetizador Web Audio procedural', action: 'toggle-audio', group: 'Comandos' },
    { title: 'Alternar Modo Cianotipo', subtitle: 'Estilo Blueprint de plano arquitectónico en alta fidelidad', action: 'toggle-cyanotype', group: 'Comandos' },
    { title: 'Alternar Modo Bunker', subtitle: 'Paleta táctica fósforo ámbar monocromática', action: 'toggle-bunker', group: 'Comandos' },
    { title: 'Repetir secuencia de arranque', subtitle: 'Calibración + escaneo + POST — recarga la página', action: 'replay-boot', group: 'Comandos' },
  ];

  let overlay = null;
  let input = null;
  let list = null;
  let selectedIndex = 0;
  let filtered = ITEMS;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'cmdk-overlay';
    overlay.innerHTML = `
      <div class="cmdk-box" role="dialog" aria-modal="true" aria-label="Buscar en el sitio">
        <input type="text" class="cmdk-input" placeholder="Buscar sección, artículo, proyecto…" aria-label="Buscar" autocomplete="off">
        <div class="cmdk-list" role="listbox"></div>
        <div class="cmdk-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> moverse</span>
          <span><kbd>↵</kbd> ir</span>
          <span><kbd>esc</kbd> cerrar</span>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    input = overlay.querySelector('.cmdk-input');
    list = overlay.querySelector('.cmdk-list');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    input.addEventListener('input', () => filter(input.value));
    input.addEventListener('keydown', onKeydown);
  }

  function render() {
    if (!filtered.length) {
      list.innerHTML = '<div class="cmdk-empty">Sin resultados</div>';
      return;
    }
    let html = '';
    let lastGroup = null;
    filtered.forEach((item, i) => {
      if (item.group !== lastGroup) {
        html += `<div class="cmdk-group">${item.group}</div>`;
        lastGroup = item.group;
      }
      html += `<div class="cmdk-item${i === selectedIndex ? ' is-selected' : ''}" role="option" data-index="${i}">
        <span class="cmdk-item-title">${escapeHtml(item.title)}</span>
        ${item.subtitle ? `<span class="cmdk-item-sub">${escapeHtml(item.subtitle)}</span>` : ''}
      </div>`;
    });
    list.innerHTML = html;
    list.querySelectorAll('.cmdk-item').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        selectedIndex = Number(el.dataset.index);
        updateSelection();
      });
      el.addEventListener('click', () => activate(Number(el.dataset.index)));
    });
    scrollSelectedIntoView();
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    selectedIndex = 0;
    if (!q) {
      filtered = ITEMS;
    } else {
      filtered = ITEMS
        .map((item) => {
          const haystack = `${item.title} ${item.subtitle || ''} ${item.group}`.toLowerCase();
          const idx = haystack.indexOf(q);
          return idx === -1 ? null : { item, score: idx };
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score)
        .map((r) => r.item);
    }
    render();
  }

  function updateSelection() {
    list.querySelectorAll('.cmdk-item').forEach((el) => {
      el.classList.toggle('is-selected', Number(el.dataset.index) === selectedIndex);
    });
    scrollSelectedIntoView();
  }

  function scrollSelectedIntoView() {
    const el = list.querySelector('.cmdk-item.is-selected');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function activate(index) {
    const item = filtered[index];
    if (!item) return;
    close();
    if (window.SGSound) window.SGSound.pop();

    if (item.action === 'replay-boot') {
      try { sessionStorage.removeItem('sg_booted'); } catch (e) {}
      if (location.pathname !== '/index.html' && location.pathname !== '/') {
        window.location.href = '/index.html';
      } else {
        window.location.reload();
      }
      return;
    }

    if (item.action === 'meta-audit') {
      if (typeof window.runMetaAudit === 'function') {
        window.runMetaAudit();
      } else {
        window.location.href = '/index.html#audit';
      }
      return;
    }

    if (item.action === 'toggle-audio') {
      if (window.SGSound) {
        const state = window.SGSound.toggle();
        const audStatus = document.getElementById('hud-audio-status');
        if (audStatus) audStatus.textContent = state ? 'ON' : 'OFF';
      }
      return;
    }

    if (item.action === 'toggle-cyanotype') {
      const cyBtn = document.getElementById('cyanotype-toggle');
      if (cyBtn) cyBtn.click();
      else document.body.classList.toggle('cyanotype-mode');
      return;
    }

    if (item.action === 'toggle-bunker') {
      const bunkerBtn = document.getElementById('bunker-toggle');
      if (bunkerBtn) bunkerBtn.click();
      else document.body.classList.toggle('bunker-mode');
      return;
    }

    if (!item.url) return;

    const [path, hash] = item.url.split('#');
    const curPath = (location.pathname || '').replace(/\/index\.html$/, '/');
    const targetPath = (path || '/index.html').replace(/\/index\.html$/, '/');
    const isSamePage = !path || path === location.pathname || targetPath === curPath;

    if (isSamePage) {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('pulse-highlight');
          setTimeout(() => el.classList.remove('pulse-highlight'), 1800);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.location.href = item.url;
    }
  }

  function onKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
      if (window.SGSound) window.SGSound.tick();
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      if (window.SGSound) window.SGSound.tick();
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(selectedIndex);
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function open() {
    if (!overlay) buildOverlay();
    filtered = ITEMS;
    selectedIndex = 0;
    render();
    overlay.classList.add('is-open');
    input.value = '';
    input.focus();
    document.body.classList.add('cmdk-locked');
    if (window.SGSound) window.SGSound.tick();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.classList.remove('cmdk-locked');
  }

  document.addEventListener('keydown', (e) => {
    const isK = e.key === 'k' || e.key === 'K';
    if ((e.metaKey || e.ctrlKey) && isK) {
      e.preventDefault();
      if (overlay && overlay.classList.contains('is-open')) close();
      else open();
    }
  });

  // ---------- Botón visible en el nav (descubrible sin saber el atajo) ----------
  function injectTrigger() {
    const nav = document.querySelector('.nav .wrap');
    if (!nav) return;
    // Si el HTML ya trae el botón (evita que la barra crezca tras cargar el JS),
    // solo se conecta y se ajusta el atajo según la plataforma.
    const existing = nav.querySelector('.cmdk-trigger');
    if (existing) {
      const isMacExisting = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
      const kbd = existing.querySelector('kbd');
      if (kbd) kbd.textContent = `${isMacExisting ? '⌘' : 'Ctrl'} K`;
      existing.addEventListener('click', open);
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'cmdk-trigger';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Buscar en el sitio');
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    btn.innerHTML = `<span>Buscar</span><kbd>${isMac ? '⌘' : 'Ctrl'} K</kbd>`;
    btn.addEventListener('click', open);

    const toggles = nav.querySelector('.mode-toggles') || nav.querySelector('.nav-links');
    if (toggles) toggles.insertAdjacentElement('afterbegin', btn);
    else nav.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTrigger);
  } else {
    injectTrigger();
  }
})();

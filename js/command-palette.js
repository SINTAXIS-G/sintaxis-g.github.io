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
    { title: 'Artículos técnicos', subtitle: 'Bitácora de desarrollo de ARCHANGEL', url: '/projects/archangel-articulos.html', group: 'Páginas' },
    { title: 'KAIROS — página completa', subtitle: 'App de asistencia en emergencias', url: '/projects/kairos.html', group: 'Páginas' },

    // ---------- Inicio ----------
    { title: 'Ecosistema', subtitle: 'EXARKON, EIDOLON, A.R.K., ATLAS, Cazador de Enlaces, AETERNA', url: '/index.html#ecosistema', group: 'Inicio' },
    { title: 'Sobre mí', subtitle: 'Quién es Gabo', url: '/index.html#sobre-mi', group: 'Inicio' },
    { title: 'Contacto', url: '/index.html#contacto', group: 'Inicio' },

    // ---------- ARCHANGEL ----------
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
    { title: 'Termodinámica aplicada a corregir código con LLMs', url: '/projects/archangel-articulos.html#termodinamica-llms', group: 'Artículos' },
    { title: 'Dónde cortar un God Object: bisección espectral', url: '/projects/archangel-articulos.html#god-object-biseccion-espectral', group: 'Artículos' },
    { title: 'PID + Bellman + Selección Clonal', url: '/projects/archangel-articulos.html#pid-bellman-seleccion-clonal', group: 'Artículos' },
    { title: 'La Ley de Conway, verificada con datos', url: '/projects/archangel-articulos.html#ley-de-conway-verificada', group: 'Artículos' },
    { title: 'El Bus Factor, medido en serio', url: '/projects/archangel-articulos.html#bus-factor-medido-en-serio', group: 'Artículos' },
    { title: 'RAG para código fuente: diez técnicas', url: '/projects/archangel-articulos.html#rag-para-codigo-fuente', group: 'Artículos' },
    { title: 'Le puse un LLM local a mi codebase', url: '/projects/archangel-articulos.html#llm-local-documentacion-codebase', group: 'Artículos' },
    { title: 'No existe el código perfecto', url: '/projects/archangel-articulos.html#no-existe-codigo-perfecto', group: 'Artículos' },
    { title: 'Ponerle nombre a un bug', url: '/projects/archangel-articulos.html#nombrar-bugs', group: 'Artículos' },
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
    const [path, hash] = item.url.split('#');
    if (path === location.pathname) {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
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

// ============================================================
// Sistema "blueprint" — tilt 3D (mousemove) genérico para cualquier
// elemento .bp-tilt dentro de un .bp-tilt-wrap. Igual criterio que el
// resto del sitio: nada de esto corre si el visitante pidió menos
// movimiento, o si el dispositivo no tiene puntero fino (touch).
// ============================================================
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  const MAX_TILT_DEG = 14;

  document.querySelectorAll('.bp-tilt-wrap').forEach((wrap) => {
    const card = wrap.querySelector('.bp-tilt');
    if (!card) return;

    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * MAX_TILT_DEG}deg) rotateX(${-y * MAX_TILT_DEG}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });
})();

// ============================================================
// Parallax de scroll — capas con [data-parallax-speed] se mueven a una
// fracción de qué tan lejos scrolleaste esa sección, dando sensación de
// profundidad (fondo más lento que el contenido). Efecto distinto del
// tilt de arriba a propósito: ahí la cámara "gira", acá el fondo se
// "atrasa" — no es el mismo truco repetido dos veces.
// ============================================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = Array.from(document.querySelectorAll('[data-parallax-speed]'));
  if (!layers.length) return;

  let ticking = false;
  function update() {
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
      const parent = el.parentElement;
      const rect = parent.getBoundingClientRect();
      el.style.transform = `translateY(${rect.top * speed}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

// ============================================================
// Grieta progresiva — los fracture-divider/seam se revelan de
// izquierda a derecha al entrar en viewport, en vez de estar ya
// dibujados de entrada.
// ============================================================
(function () {
  const cracks = document.querySelectorAll('.fracture-divider, .fracture-seam');
  if (!cracks.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // threshold 0 a propósito: son franjas angostas (36-64px) — un scroll
  // rápido (fling de trackpad, PageDown) puede saltarse una ventana de
  // visibilidad del 30% en un solo frame renderizado; con cualquier
  // intersección (aunque sea 1px) ya alcanza para disparar.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '200px 0px' });
  cracks.forEach((el) => observer.observe(el));
})();

// ============================================================
// Línea que conecta los 3 pasos del mapa de sistema — medida en vivo
// contra la posición real de cada círculo (no una aproximación en
// CSS, que se rompería apenas el texto de un paso ocupe otra altura).
// Se dibuja con el mismo truco stroke-dasharray que el ECG de gabi.html.
// ============================================================
(function () {
  const container = document.querySelector('.system-threads');
  const steps = container ? container.querySelectorAll('.system-step') : [];
  if (!container || steps.length < 2) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'bp-thread-line');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('fill', 'none');
  svg.appendChild(path);
  container.style.position = 'relative';
  container.prepend(svg);

  let drawn = false;

  function layout() {
    const cRect = container.getBoundingClientRect();
    const pts = Array.from(steps).map((s) => {
      const r = s.getBoundingClientRect();
      return [r.left + r.width / 2 - cRect.left, r.top + r.height / 2 - cRect.top];
    });
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ');
    path.setAttribute('d', d);
    if (reduced) return;
    const len = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = drawn ? '0' : `${len}`;
    // forzar reflow antes de reactivar la transición, si ya estaba dibujada
    // (p.ej. tras un resize) para que no vuelva a animarse desde cero.
    void path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 1.3s var(--ease)';
  }
  layout();
  window.addEventListener('resize', layout);

  if (reduced) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        drawn = true;
        path.style.strokeDashoffset = '0';
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(container);
})();

// ============================================================
// Mapa del sistema — los 3 pasos se "encienden" (clase .is-active) al
// entrar en viewport, en vez de mostrarse ya prendidos desde siempre.
// Simple fade/glow, no custom-property animation (soporte universal).
// ============================================================
(function () {
  const steps = document.querySelectorAll('.system-step');
  if (!steps.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    steps.forEach((s) => s.classList.add('is-active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  steps.forEach((s) => observer.observe(s));
})();

// ============================================================
// Service Worker — offline-first "cache as you go" (ver sw.js). Nunca
// bloquea el load real: se registra después de que la página ya cargó.
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ============================================================
// HUD de instrumento — altitud de scroll + tiempo en página + estado
// de red (online/offline), coherente con "soberanía/local-first".
// ============================================================
(function () {
  const altEl = document.getElementById('hud-altitude');
  const timeEl = document.getElementById('hud-time');
  const netEl = document.getElementById('hud-net');
  if (!altEl || !timeEl) return;

  if (netEl) {
    const updateNet = () => {
      netEl.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
      netEl.classList.toggle('is-offline', !navigator.onLine);
    };
    window.addEventListener('online', updateNet);
    window.addEventListener('offline', updateNet);
    updateNet();
  }

  const start = Date.now();
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    altEl.textContent = `${Math.min(100, Math.max(0, pct))}%`;
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const ss = String(elapsed % 60).padStart(2, '0');
    timeEl.textContent = `${mm}:${ss}`;
  }
  window.addEventListener('scroll', update, { passive: true });
  setInterval(update, 1000);
  update();
})();

// ============================================================
// Micro-glitch al navegar por anclas del nav — puro feedback visual,
// nunca retrasa ni intercepta la navegación real (sin preventDefault).
// ============================================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      document.body.classList.add('bp-glitching');
      setTimeout(() => document.body.classList.remove('bp-glitching'), 220);
    });
  });
})();

// ============================================================
// Modo cianotipo — mismo patrón que el toggle de bunker-mode en los
// proyectos: una clase en <body>, nada de localStorage.
// ============================================================
(function () {
  const btn = document.getElementById('cyanotype-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const active = document.body.classList.toggle('cyanotype-mode');
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
})();

// ============================================================
// Spotlight de cursor — en .eco-item y .contact-card una luz radial
// sigue al mouse (--mx/--my), independiente del lift/translate que ya
// tienen en :hover: ahí se mueve la card, acá se mueve una luz sobre
// la card quieta. Mismo guard de puntero fino que el tilt de arriba.
// ============================================================
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const spotlightSelector = '.eco-item, .contact-card, .pillar, .forensic-node, .finding, .note-box, .post-card, .post-nav a, .post-cta';
  document.querySelectorAll(spotlightSelector).forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
})();

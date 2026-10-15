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
// Mini-índice de "Sobre mí" — scroll-spy local, visible solo mientras
// esa sección está en pantalla (no compite con el minimapa global de
// la página, que ya existe y vive del otro lado).
// ============================================================
(function () {
  const section = document.getElementById('sobre-mi');
  if (!section) return;
  const heads = section.querySelectorAll('.about-subhead[id]');
  if (heads.length < 2) return;

  const toc = document.createElement('nav');
  toc.className = 'about-toc';
  toc.setAttribute('aria-label', 'Índice de "Sobre mí"');
  const links = Array.from(heads).map((h) => {
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    toc.appendChild(a);
    return { head: h, link: a };
  });
  section.querySelector('.wrap').appendChild(toc);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => toc.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0 });
  sectionObserver.observe(section);

  const headObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const match = links.find((l) => l.head === entry.target);
      if (!match) return;
      links.forEach((l) => l.link.classList.remove('is-active'));
      match.link.classList.add('is-active');
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  heads.forEach((h) => headObserver.observe(h));
})();

// ============================================================
// Chips de stack técnico — mismo patrón que el tooltip de glosario de
// las páginas de proyecto, pero local acá (index.html no carga
// project.css). Un solo tooltip compartido, reposicionado por hover.
// ============================================================
(function () {
  const chips = document.querySelectorAll('.tech-chip[data-tip]');
  if (!chips.length) return;

  const tip = document.createElement('div');
  tip.className = 'tech-chip-tip';
  document.body.appendChild(tip);

  chips.forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
      const r = chip.getBoundingClientRect();
      tip.textContent = chip.dataset.tip;
      tip.style.left = `${r.left + window.scrollX}px`;
      tip.style.top = `${r.bottom + window.scrollY + 6}px`;
      tip.classList.add('is-visible');
    });
    chip.addEventListener('mouseleave', () => tip.classList.remove('is-visible'));
  });
})();

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

// ============================================================
// Shader WebGL sobre la foto real de "Sobre mí" — ripple de distorsión
// + aberración cromática que sigue el mouse, sobre una textura que es
// la foto de verdad (no un efecto decorativo genérico). Si WebGL falla
// por cualquier motivo, el catch silencioso deja la <img> plana exactamente
// como estaba — nadie nota la diferencia. Requiere puntero fino: en touch
// no hay hover que mostrar, así que ni siquiera se arranca el loop.
// ============================================================
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  const wrap = document.querySelector('.about-photo-wrap');
  const canvas = document.getElementById('about-photo-canvas');
  const img = document.getElementById('about-photo-img');
  if (!wrap || !canvas || !img) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  try {
    const vertSrc = 'attribute vec2 aPosition; varying vec2 vUv; void main(){ vUv = aPosition*0.5+0.5; gl_Position = vec4(aPosition,0.0,1.0); }';
    const fragSrc = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform sampler2D uTex;',
      'uniform vec2 uMouse;',
      'uniform float uTime;',
      'uniform float uHover;',
      'void main(){',
      '  vec2 uv = vUv;',
      '  uv.y = 1.0 - uv.y;',
      '  vec2 d = uv - uMouse;',
      '  float dist = length(d);',
      '  float ripple = sin(dist*28.0 - uTime*3.5) * 0.015 * uHover * smoothstep(0.55,0.0,dist);',
      '  vec2 dir = normalize(d + 0.0001);',
      '  vec2 uvR = uv + dir*ripple;',
      '  float ab = 0.004 * uHover * smoothstep(0.55,0.0,dist);',
      '  float r = texture2D(uTex, uvR + dir*ab).r;',
      '  float g = texture2D(uTex, uvR).g;',
      '  float b = texture2D(uTex, uvR - dir*ab).b;',
      '  vec3 color = vec3(r,g,b);',
      '  color -= sin(uv.y*220.0)*0.02*uHover;',
      '  gl_FragColor = vec4(color,1.0);',
      '}'
    ].join('\n');

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uHover = gl.getUniformLocation(prog, 'uHover');
    const uTex = gl.getUniformLocation(prog, 'uTex');
    const tex = gl.createTexture();

    function uploadTexture() {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      wrap.classList.add('has-shader');
      canvas.classList.add('is-ready');
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    }
    resize();
    window.addEventListener('resize', resize);

    if (img.complete && img.naturalWidth) {
      uploadTexture();
    } else {
      img.addEventListener('load', uploadTexture, { once: true });
    }

    const mouse = { x: 0.5, y: 0.5 };
    let hover = 0;
    let hoverTarget = 0;
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
      hoverTarget = 1;
    });
    wrap.addEventListener('mouseleave', () => { hoverTarget = 0; });

    let isAnimating = false;
    let rafId = null;
    const start = performance.now();

    function frame(now) {
      if (!isAnimating) return;
      hover += (hoverTarget - hover) * 0.08;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uTex, 0);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uHover, hover);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(frame);
    }

    function startAnimation() {
      if (isAnimating) return;
      isAnimating = true;
      rafId = requestAnimationFrame(frame);
    }
    function stopAnimation() {
      isAnimating = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && document.visibilityState === 'visible') startAnimation();
        else stopAnimation();
      });
    }, { threshold: 0 });
    observer.observe(canvas);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { stopAnimation(); return; }
      const rect = canvas.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) startAnimation();
    });
  } catch (err) {
    // WebGL falló a mitad de camino (contexto perdido, etc.) — la <img>
    // de abajo sigue intacta, no hace falta ningún fallback explícito.
  }
})();

// ============================================================
// Red de nodos ambiental — mismo motivo visual que el fondo del hero
// (nodos + conexiones), a baja opacidad y en reposo, sin duplicar el
// grafo real de dependency-graph.js. Corre en cualquier .bp-nodes-canvas
// de la página: Contacto ("Sígueme el rastro"), el catálogo de
// analizadores de ARCHANGEL (acá los nodos SON el contenido: 77
// analizadores conectados) y el veredicto final antes del footer.
// Cada canvas tiene su propio estado — no son instancias compartidas.
// ============================================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.bp-nodes-canvas').forEach(setupNodesCanvas);

  function setupNodesCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const NODE_COUNT = 48;
  const LINK_DIST = 170;
  let nodes = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth * dpr;
    canvas.height = canvas.parentElement.offsetHeight * dpr;
  }
  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.12 * dpr,
      vy: (Math.random() - 0.5) * 0.12 * dpr,
    }));
  }

  let isAnimating = false;
  let rafId = null;

  function draw() {
    if (!isAnimating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST * dpr) {
          ctx.strokeStyle = `rgba(77, 240, 224, ${0.32 * (1 - dist / (LINK_DIST * dpr))})`;
          ctx.lineWidth = 1.1 * dpr;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach((n) => {
      ctx.fillStyle = 'rgba(77, 240, 224, 0.75)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.2 * dpr, 0, Math.PI * 2);
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    rafId = requestAnimationFrame(draw);
  }
  function stopAnimation() {
    isAnimating = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  resize();
  initNodes();
  window.addEventListener('resize', () => { resize(); initNodes(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && document.visibilityState === 'visible') startAnimation();
      else stopAnimation();
    });
  }, { threshold: 0 });
  observer.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { stopAnimation(); return; }
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) startAnimation();
  });
  }
})();

// ============================================================
// Campo de fractura: shader WebGL para el hero de ARCHANGEL — red de
// grietas (bordes de Voronoi, red fija, sin deriva: una grieta real no
// "fluye" como la convección del hero de inicio) que respira celda por
// celda y concentra brillo cerca del mouse, igual que la ecuación de
// Griffith de la sección #fracturas: la tensión se concentra en la
// punta de la grieta. Si WebGL falla, el catch deja el hero intacto.
// ============================================================
(function () {
  const canvas = document.getElementById('archangel-hero-shader');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  try {
    const VERTEX_SRC = 'attribute vec2 aPosition; void main(){ gl_Position = vec4(aPosition,0.0,1.0); }';
    const FRAGMENT_SRC = [
      'precision highp float;',
      'uniform vec2 uResolution;',
      'uniform vec2 uMouse;',
      'uniform float uTime;',
      'uniform vec3 uColorLow;',
      'uniform vec3 uColorHigh;',
      'vec2 hash2(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }',
      'void main(){',
      '  vec2 uv = gl_FragCoord.xy / uResolution.xy;',
      '  vec2 mouseUv = uMouse / uResolution.xy;',
      '  float scale = 5.0;',
      '  vec2 p = uv * vec2(scale * (uResolution.x/uResolution.y), scale);',
      '  vec2 pi = floor(p); vec2 pf = fract(p);',
      '  float d1 = 10.0; float d2 = 10.0; vec2 cellId = vec2(0.0);',
      '  for (int y=-1; y<=1; y++){ for (int x=-1; x<=1; x++){',
      '    vec2 nb = vec2(float(x), float(y));',
      '    vec2 pt = hash2(pi+nb);', // red fija: sin seno de uTime acá, la grieta no se mueve
      '    float d = length(nb + pt - pf);',
      '    if (d < d1) { d2 = d1; d1 = d; cellId = pi + nb; }',
      '    else if (d < d2) { d2 = d; }',
      '  }}',
      '  float edge = d2 - d1;',
      '  float crack = 1.0 - smoothstep(0.0, 0.045, edge);',
      '  float cellSeed = fract(sin(dot(cellId, vec2(12.9898,78.233)))*43758.5453);',
      '  float t = mod(uTime, 3000.0);',
      '  float pulse = 0.5 + 0.5 * sin(t * (0.25 + cellSeed * 0.35) + cellSeed * 6.283);',
      '  float dist = distance(uv, mouseUv);',
      '  float stress = smoothstep(0.42, 0.0, dist);', // concentración de tensión cerca del cursor (Griffith)
      '  float n = crack * clamp(pulse * 0.55 + 0.3 + stress * 0.9, 0.0, 1.0);',
      '  vec3 color = mix(uColorLow, uColorHigh, clamp(n, 0.0, 1.0));',
      '  float vignette = smoothstep(1.1, 0.2, length(uv-0.5) * 1.3);',
      '  float a = clamp(n * 0.5 * vignette, 0.0, 1.0);',
      '  gl_FragColor = vec4(color * a, a);',
      '}'
    ].join('\n');

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uColorLow = gl.getUniformLocation(program, 'uColorLow');
    const uColorHigh = gl.getUniformLocation(program, 'uColorHigh');

    function cssVarToFloat3(name, fallback) {
      const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m
        ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
        : fallback;
    }
    const [lowR, lowG, lowB] = cssVarToFloat3('--bg', [0.0784, 0.0627, 0.1098]);
    const [hiR, hiG, hiB] = cssVarToFloat3('--accent', [0.302, 0.9412, 0.8784]);
    gl.uniform3f(uColorLow, lowR, lowG, lowB);
    gl.uniform3f(uColorHigh, hiR, hiG, hiB);

    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouseX = canvas.width / 2;
      mouseY = canvas.height / 2;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      mouseX = (e.clientX - rect.left) * dpr;
      mouseY = (e.clientY - rect.top) * dpr;
    });

    let isAnimating = false;
    let rafId = null;
    const start = performance.now();

    function frame(now) {
      if (!isAnimating) return;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseX, canvas.height - mouseY);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(frame);
    }
    function startAnimation() {
      if (isAnimating) return;
      isAnimating = true;
      rafId = requestAnimationFrame(frame);
    }
    function stopAnimation() {
      isAnimating = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && document.visibilityState === 'visible') startAnimation();
        else stopAnimation();
      });
    }, { threshold: 0 });
    observer.observe(canvas);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { stopAnimation(); return; }
      const rect = canvas.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) startAnimation();
    });
  } catch (err) {
    // WebGL falló a mitad de camino — el hero queda sin shader de fondo,
    // nada más se ve afectado.
  }
})();

// ============================================================
// Osciloscopio ambiental en el footer — corre en cada página que carga
// este script. Reacciona a la velocidad REAL de scroll (no al mouse:
// el footer rara vez se hover-ea a propósito): se agita cuando el
// visitante scrollea rápido y se calma cuando deja de moverse. Metáfora
// de "sistema con estado", no un adorno que se mueve solo porque sí.
// ============================================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('footer-signal');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let energy = 0.08;
  let energyTarget = 0.08;
  let lastScrollY = window.scrollY;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth * dpr;
    canvas.height = canvas.parentElement.offsetHeight * dpr;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    energyTarget = Math.min(1, 0.08 + delta * 0.05);
  }, { passive: true });

  let isAnimating = false;
  let rafId = null;
  const start = performance.now();

  function draw(now) {
    if (!isAnimating) return;
    const t = (now - start) / 1000;
    energy += (energyTarget - energy) * 0.05;
    energyTarget += (0.08 - energyTarget) * 0.02; // decae solo hacia reposo entre scrolls

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(77, 240, 224, 0.55)';
    ctx.lineWidth = 1.2 * dpr;
    // Pegada al borde inferior del footer, no al medio: ahí vive el
    // texto ("SINTAXIS G — ..."), y la señal no puede tapizarlo.
    const mid = h * 0.9;
    for (let x = 0; x <= w; x += 3) {
      const u = x / w;
      const base = Math.sin(u * 16 + t * 2.4) * 0.5 + Math.sin(u * 37 - t * 1.3) * 0.22;
      const noise = (Math.random() - 0.5) * 0.15;
      const v = (base + noise * energy) * energy * h * 0.1;
      if (x === 0) ctx.moveTo(x, mid + v);
      else ctx.lineTo(x, mid + v);
    }
    ctx.stroke();
    rafId = requestAnimationFrame(draw);
  }

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    rafId = requestAnimationFrame(draw);
  }
  function stopAnimation() {
    isAnimating = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && document.visibilityState === 'visible') startAnimation();
      else stopAnimation();
    });
  }, { threshold: 0 });
  observer.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { stopAnimation(); return; }
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) startAnimation();
  });
})();

// ============================================================
// Carrera Rust vs Python (#rust) — barras y números cuentan hacia arriba
// una sola vez al entrar en viewport, igual criterio que el gauge de
// Health Score en main.js. Los valores salen de data-target en el HTML
// (los mismos números ya citados en el texto), no se inventan acá.
// ============================================================
document.querySelectorAll('.rust-race').forEach((race) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fills = Array.from(race.querySelectorAll('.rust-race-fill'));
  const nums = Array.from(race.querySelectorAll('.rust-race-num'));
  const maxTarget = Math.max(...fills.map((f) => parseFloat(f.dataset.target) || 0), 1);

  function applyFinal() {
    fills.forEach((f) => {
      const target = parseFloat(f.dataset.target) || 0;
      f.style.width = `${(target / maxTarget) * 100}%`;
    });
    nums.forEach((n) => { n.textContent = parseFloat(n.dataset.target).toFixed(1); });
  }

  if (reducedMotion) { applyFinal(); return; }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      fills.forEach((f) => {
        const target = parseFloat(f.dataset.target) || 0;
        requestAnimationFrame(() => { f.style.width = `${(target / maxTarget) * 100}%`; });
      });
      nums.forEach((n) => {
        const target = parseFloat(n.dataset.target) || 0;
        const start = performance.now();
        const duration = 1100;
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          n.textContent = (target * eased).toFixed(1);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      observer.unobserve(race);
    });
  }, { threshold: 0.4 });
  observer.observe(race);
});

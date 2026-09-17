// ============================================================
// SINTAXIS G — interacciones del sitio
// Todo aquí es opcional/progresivo: si un elemento no existe
// en la página actual, ese bloque simplemente no hace nada.
// ============================================================

// ---------- 1. Nav activo según sección visible ----------
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((section) => navObserver.observe(section));
}

// ---------- 2. Scroll reveal ----------
// Marca como "reveal" cualquier bloque de sección que no sea el hero,
// y lo anima al entrar en viewport.
const revealTargets = document.querySelectorAll(
  'section .wrap > *, .proj-block .wrap > *'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

if (revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el) => revealObserver.observe(el));
}

// ---------- 3. Barra de progreso de scroll ----------
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = height > 0 ? `${(scrolled / height) * 100}%` : '0%';
  }, { passive: true });
}

// ---------- 4. Números animados en el hero ----------
const statEls = document.querySelectorAll('.hero-meta strong, .stat b');
function animateNumber(el) {
  const raw = el.textContent.trim();
  const match = raw.match(/^([~]?)(\d+)(.*)$/);
  if (!match) return; // no es numérico (ej. "Local-first"), se deja tal cual
  const [, prefix, numStr, suffix] = match;
  const target = parseInt(numStr, 10);
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = `${prefix}${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (statEls.length) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statEls.forEach((el) => statObserver.observe(el));
}

// ---------- 5. Revelado tipo "typing" del finding de taint ----------
const finding = document.querySelector('.finding');
if (finding) {
  const findingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const rows = finding.querySelectorAll('div');
        rows.forEach((row, i) => {
          setTimeout(() => row.style.transitionDelay = `${i * 90}ms`, 0);
        });
        finding.classList.add('is-typed');
        findingObserver.unobserve(finding);
      }
    });
  }, { threshold: 0.4 });
  findingObserver.observe(finding);
}

// ---------- 6. Terminal falsa: revelado línea por línea ----------
// Antes solo animaba el elemento con id="fake-terminal" — como ahora
// hay varias terminales en la página, se anima cada .terminal por
// separado con su propio observer.
document.querySelectorAll('.terminal').forEach((terminal) => {
  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lines = terminal.querySelectorAll('.terminal-line');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('is-shown'), i * 450);
        });
        // Si esta terminal trae barras de Health Score, las anima
        // en el mismo momento en que arranca el "typing" de las líneas.
        const bars = terminal.querySelector('.health-bars');
        if (bars) setTimeout(() => bars.classList.add('is-filled'), 300);
        termObserver.unobserve(terminal);
      }
    });
  }, { threshold: 0.4 });
  termObserver.observe(terminal);
});

// ---------- 7. Easter egg de consola ----------
console.log(
  '%c⬡ SINTAXIS G',
  'color:#3DDAD7; font-family:monospace; font-size:20px; font-weight:bold;'
);
console.log(
  '%c"No instalo sistemas. Forjo arquitecturas."',
  'color:#8B95A5; font-family:monospace; font-size:13px; font-style:italic;'
);
console.log(
  '%c¿Fisgoneando el código? Buena señal. github.com/SINTAXIS-G',
  'color:#3DDAD7; font-family:monospace; font-size:12px;'
);

const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let nodes = [];
  const NODE_COUNT = 36;
  const LINK_DIST = 140;

  // isAnimating + rafId: antes el bucle corría para siempre vía
  // requestAnimationFrame recursivo, incluso con el hero fuera de
  // pantalla (scrolleado) o la pestaña en segundo plano — CPU/GPU
  // gastados en dibujar algo que nadie puede ver. Ahora se pausa en
  // ambos casos y se reanuda solo si de verdad está visible en el
  // viewport Y la pestaña está activa.
  let isAnimating = false;
  let rafId = null;

  function resize() {
    heroCanvas.width = heroCanvas.parentElement.offsetWidth;
    heroCanvas.height = heroCanvas.parentElement.offsetHeight;
  }

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * heroCanvas.width,
      y: Math.random() * heroCanvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));
  }

  function draw() {
    if (!isAnimating) return; // cortado por stopAnimation(): no re-encola el siguiente frame

    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > heroCanvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > heroCanvas.height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(61, 218, 215, ${0.12 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((n) => {
      ctx.fillStyle = 'rgba(61, 218, 215, 0.5)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId = requestAnimationFrame(draw);
  }

  function startAnimation() {
    if (isAnimating) return; // ya corriendo — evita encolar un segundo loop en paralelo
    isAnimating = true;
    rafId = requestAnimationFrame(draw);
  }

  function stopAnimation() {
    isAnimating = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    resize();
    initNodes();
    window.addEventListener('resize', () => { resize(); initNodes(); });

    // Pausa/reanuda según si el canvas está dentro del viewport —
    // scrollear a #ecosistema, #sobre-mi, etc. detiene el gasto de
    // CPU/GPU de dibujar un fondo que ya no se ve.
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && document.visibilityState === 'visible') {
          startAnimation();
        } else {
          stopAnimation();
        }
      });
    }, { threshold: 0 });
    heroObserver.observe(heroCanvas);

    // Pausa/reanuda según si la PESTAÑA está activa — cambiar de tab
    // también debe detener el loop, independientemente de si el hero
    // sigue "visible" en el DOM (el navegador no renderiza pestañas
    // en segundo plano, pero el JS seguiría corriendo sin esto).
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        stopAnimation();
        return;
      }
      const rect = heroCanvas.getBoundingClientRect();
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inViewport) startAnimation();
    });
  }
}

// ---------- 8b. Campo de entropía: shader WebGL reactivo al cursor ----------
// Capa detrás de la red de partículas (z-index: -1) — si WebGL falla por
// cualquier motivo (navegador viejo, contexto perdido, GPU sin soporte),
// esto no rompe nada: el catch silencioso deja el hero exactamente como
// se veía antes de este bloque.
(function () {
  const shaderCanvas = document.getElementById('hero-shader-canvas');
  if (!shaderCanvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gl = shaderCanvas.getContext('webgl') || shaderCanvas.getContext('experimental-webgl');
  if (!gl) return;

  const VERTEX_SRC = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SRC = `
    precision mediump float;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uTime;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec2 mouseUv = uMouse / uResolution.xy;

      vec2 p = uv * 3.0 + uTime * 0.03;
      float n = fbm(p + fbm(p + uTime * 0.05));

      float dist = distance(uv, mouseUv);
      float mouseInfluence = smoothstep(0.5, 0.0, dist) * 0.6;
      n += mouseInfluence * fbm(p * 2.0 + uTime * 0.1);

      vec3 colorLow = vec3(0.039, 0.055, 0.078);
      vec3 colorHigh = vec3(0.239, 0.855, 0.843);
      vec3 color = mix(colorLow, colorHigh, clamp(n * 0.35, 0.0, 1.0));

      float vignette = smoothstep(1.0, 0.3, length(uv - 0.5) * 1.4);
      gl_FragColor = vec4(color, clamp(n * 0.22 * vignette, 0.0, 1.0));
    }
  `;

  function compileShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[hero-shader] error de compilación:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SRC);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[hero-shader] error de link:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // Un solo triángulo que cubre toda la pantalla — más barato que dos.
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 3, -1, -1, 3,
  ]), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uResolution = gl.getUniformLocation(program, 'uResolution');
  const uMouse = gl.getUniformLocation(program, 'uMouse');
  const uTime = gl.getUniformLocation(program, 'uTime');

  let mouseX = 0;
  let mouseY = 0;
  let shaderAnimating = false;
  let shaderRafId = null;
  const startTime = performance.now();

  function resizeShaderCanvas() {
    const rect = shaderCanvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // tope de DPR: nitidez suficiente sin costo de retina completa
    shaderCanvas.width = rect.width * dpr;
    shaderCanvas.height = rect.height * dpr;
    gl.viewport(0, 0, shaderCanvas.width, shaderCanvas.height);
    mouseX = shaderCanvas.width / 2;
    mouseY = shaderCanvas.height / 2;
  }

  function renderShader(now) {
    if (!shaderAnimating) return;
    gl.uniform2f(uResolution, shaderCanvas.width, shaderCanvas.height);
    gl.uniform2f(uMouse, mouseX, shaderCanvas.height - mouseY);
    gl.uniform1f(uTime, (now - startTime) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    shaderRafId = requestAnimationFrame(renderShader);
  }

  function startShader() {
    if (shaderAnimating) return;
    shaderAnimating = true;
    shaderRafId = requestAnimationFrame(renderShader);
  }

  function stopShader() {
    shaderAnimating = false;
    if (shaderRafId !== null) cancelAnimationFrame(shaderRafId);
    shaderRafId = null;
  }

  resizeShaderCanvas();
  window.addEventListener('resize', resizeShaderCanvas);

  shaderCanvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = shaderCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    mouseX = (e.clientX - rect.left) * dpr;
    mouseY = (e.clientY - rect.top) * dpr;
  });

  // Mismo criterio de pausa que la red de partículas: sin gastar GPU en un
  // shader que nadie ve (fuera de viewport o pestaña en segundo plano).
  const shaderObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && document.visibilityState === 'visible') startShader();
      else stopShader();
    });
  }, { threshold: 0 });
  shaderObserver.observe(shaderCanvas);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      stopShader();
      return;
    }
    const rect = shaderCanvas.getBoundingClientRect();
    const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
    if (inViewport) startShader();
  });
})();

// ---------- 9. Cursor personalizado ----------
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  document.body.classList.add('has-custom-cursor');

  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll('a, button, .mode-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hovering'));
  });
}

// ---------- 9b. Menú móvil (hamburguesa) ----------
const navToggle = document.getElementById('nav-toggle');
const navLinksEl = document.querySelector('.nav-links');
if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinksEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- 10. Modo búnker (alto contraste) ----------
const bunkerBtn = document.getElementById('bunker-toggle');
if (bunkerBtn) {
  bunkerBtn.addEventListener('click', () => {
    document.body.classList.toggle('bunker-mode');
    bunkerBtn.classList.toggle('is-active');
  });
}

// ---------- 11. Modo desarrollador ----------
const devBtn = document.getElementById('dev-toggle');
if (devBtn) {
  devBtn.addEventListener('click', () => {
    document.body.classList.toggle('dev-mode');
    devBtn.classList.toggle('is-active');
  });
}

// ---------- 12. Skeleton loaders para imágenes (decorativo) ----------
document.querySelectorAll('.img-skeleton img').forEach((img) => {
  const markLoaded = () => img.parentElement.classList.add('is-loaded');
  if (img.complete) markLoaded();
  else img.addEventListener('load', markLoaded);
});
// ---------- 13. Lightbox para imágenes de diagramas ----------
const galleryImgs = document.querySelectorAll('.proj-split-figure img');
if (galleryImgs.length) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close">cerrar ✕</button><img alt="">';
  document.body.appendChild(overlay);
  const overlayImg = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('is-open');
  }
  function closeLightbox() {
    overlay.classList.remove('is-open');
  }

  galleryImgs.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === overlayImg || e.target === closeBtn) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ---------- 14. Índice desplegable (TOC) ----------
const tocToggle = document.getElementById('toc-toggle');
const tocMenu = document.getElementById('toc-menu');
if (tocToggle && tocMenu) {
  tocToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = tocMenu.classList.toggle('is-open');
    tocToggle.setAttribute('aria-expanded', String(isOpen));
  });
  tocMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      tocMenu.classList.remove('is-open');
      tocToggle.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', (e) => {
    if (!tocMenu.contains(e.target) && e.target !== tocToggle) {
      tocMenu.classList.remove('is-open');
      tocToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------- 15. Demo: extractor de mapa arquitectónico (simplificado) ----------
// Aproximación por patrones de línea, NO un parser AST real — la versión
// real de ARCHANGEL usa el módulo `ast` de Python. Esto solo demuestra
// el concepto (firmas sin cuerpo, docstrings, redacción de secretos,
// listado de TODOs) corriendo 100% en el navegador de quien lo prueba.
const demoRunBtn = document.getElementById('demo-run');
if (demoRunBtn) {
  const demoInput = document.getElementById('demo-input');
  const demoOutput = document.getElementById('demo-output');

  const SECRET_NAMES = /(password|passwd|pwd|secret|token|api_key|apikey|access_key|private_key|conn(?:ection)?_?str)/i;
  const TODO_RE = /#\s*(TODO|FIXME|HACK|XXX)[:\s](.*)$/;
  const SIG_RE = /^(\s*)(async\s+def|def|class)\s+([A-Za-z_]\w*)/;

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function redactSignature(line) {
    // Redacta valores por default de parámetros con nombre sospechoso:
    // password: str = "changeme123"  →  password: str = ***REDACTED***
    return line.replace(
      /([A-Za-z_]\w*)(\s*:\s*[\w\[\], ]+)?\s*=\s*(".*?"|'.*?'|[\w.]+)/g,
      (full, name, typeHint, value) => {
        if (SECRET_NAMES.test(name)) {
          return `${name}${typeHint || ''}=***REDACTED***`;
        }
        return full;
      }
    );
  }

  function extractSkeleton(source) {
    const lines = source.split('\n');
    const skeletonLines = [];
    const todos = [];
    let i = 0;

    while (i < lines.length) {
      const rawLine = lines[i];
      const todoMatch = rawLine.match(TODO_RE);
      if (todoMatch) todos.push(`${todoMatch[1]}: ${todoMatch[2].trim()}`);

      const sigMatch = rawLine.match(SIG_RE);
      if (sigMatch) {
        // Junta líneas si la firma no cierra sus paréntesis en la misma línea
        let full = rawLine;
        let depth = (full.match(/\(/g) || []).length - (full.match(/\)/g) || []).length;
        let j = i;
        while (depth > 0 && j + 1 < lines.length) {
          j++;
          full += ' ' + lines[j].trim();
          depth += (lines[j].match(/\(/g) || []).length - (lines[j].match(/\)/g) || []).length;
        }
        skeletonLines.push(redactSignature(full.trimEnd()));

        // Docstring inmediatamente después, si existe
        let k = j + 1;
        while (k < lines.length && lines[k].trim() === '') k++;
        const docMatch = k < lines.length && lines[k].trim().match(/^("""|''')/);
        if (docMatch) {
          const quote = docMatch[1];
          let docLine = lines[k];
          skeletonLines.push('    '.repeat(0) + docLine);
          if (!docLine.trim().slice(3).includes(quote)) {
            k++;
            while (k < lines.length && !lines[k].includes(quote)) {
              skeletonLines.push(lines[k]);
              k++;
            }
            if (k < lines.length) skeletonLines.push(lines[k]);
          }
        }
        i = j + 1;
        continue;
      }
      i++;
    }

    return { skeleton: skeletonLines.join('\n'), todos };
  }

  demoRunBtn.addEventListener('click', () => {
    const source = demoInput.value;
    if (!source.trim()) {
      demoOutput.textContent = '// pega algo de código Python arriba primero';
      return;
    }
    const { skeleton, todos } = extractSkeleton(source);
    let html = escapeHtml(skeleton || '// no se detectaron clases ni funciones');
    if (todos.length) {
      html += '\n\n// ── deuda técnica detectada ──\n';
      html += todos.map((t) => `// ${escapeHtml(t)}`).join('\n');
    }
    demoOutput.innerHTML = html;
  });
}

// ---------- 16. Spotlight: brillo que sigue el cursor en tarjetas ----------
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.pillar, .eco-item, .forensic-node, .stat').forEach((card) => {
    card.classList.add('spotlight');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// ---------- 18. FAQ acordeón ----------
document.querySelectorAll('.faq-list').forEach((list) => {
  const items = list.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach((i) => {
        i.classList.remove('is-open');
        const btn = i.querySelector('.faq-q');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
});

// ---------- 19. Explorador de analizadores (filtro por categoría) ----------
const analyzerFilters = document.querySelectorAll('.analyzer-chip');
const analyzerCards = document.querySelectorAll('.analyzer-card');
if (analyzerFilters.length && analyzerCards.length) {
  analyzerFilters.forEach((chip) => {
    chip.setAttribute('aria-pressed', chip.classList.contains('is-active') ? 'true' : 'false');
    chip.addEventListener('click', () => {
      analyzerFilters.forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      const cat = chip.dataset.cat;
      analyzerCards.forEach((card) => {
        card.classList.toggle('is-visible', cat === 'all' || card.dataset.cat === cat);
      });
    });
  });
}

// ---------- 19b. Calculadora de plan ----------
const calcBtn = document.getElementById('calc-btn');
if (calcBtn) {
  const tierInfo = {
    starter: { name: 'Starter', desc: '50 análisis/mes, hasta 5.000 líneas por archivo, sin batch.' },
    team: { name: 'Team', desc: '500 análisis/mes, hasta 50.000 líneas por archivo, batch de hasta 50 archivos.' },
    business: { name: 'Business', desc: 'Análisis ilimitados, hasta 200.000 líneas por archivo, batch de hasta 200 archivos.' },
    enterprise: { name: 'Enterprise', desc: 'Análisis y líneas ilimitados, batch de hasta 500 archivos, SLA de 3s.' },
  };
  calcBtn.addEventListener('click', () => {
    const analyses = Number(document.getElementById('calc-analyses').value) || 0;
    const lines = Number(document.getElementById('calc-lines').value) || 0;
    const batch = Number(document.getElementById('calc-batch').value) || 0;

    let tier = 'starter';
    if (lines > 200000 || batch > 200) tier = 'enterprise';
    else if (analyses > 500 || lines > 50000 || batch > 50) tier = 'business';
    else if (analyses > 50 || lines > 5000 || batch > 0) tier = 'team';

    const info = tierInfo[tier];
    const resultEl = document.getElementById('calc-result');
    resultEl.innerHTML = `<div class="tier-name">${info.name}</div><p>${info.desc}</p>`;
    resultEl.hidden = false;
  });
}

// ---------- 20. Minimapa de scroll ----------
// Se genera solo si la página tiene 4+ secciones con id — en páginas
// cortas (como index.html) no aporta y estorba.
const mmSections = document.querySelectorAll('section[id]');
if (mmSections.length >= 6) {
  const minimap = document.createElement('div');
  minimap.className = 'minimap';
  const dots = [];
  mmSections.forEach((section) => {
    const dot = document.createElement('div');
    dot.className = 'minimap-dot';
    dot.title = section.id;
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    minimap.appendChild(dot);
    dots.push({ section, dot });
  });
  document.body.appendChild(minimap);

  const mmObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const match = dots.find((d) => d.section === entry.target);
      if (!match) return;
      if (entry.isIntersecting) {
        dots.forEach((d) => d.dot.classList.remove('is-active'));
        match.dot.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  mmSections.forEach((s) => mmObserver.observe(s));
}

// ---------- 21. Artículos: tiempo de lectura + navegador con scrollspy ----------
const posts = document.querySelectorAll('article.post[id]');
if (posts.length >= 2) {
  // Tiempo de lectura estimado (≈200 palabras/min en español), agregado
  // a la misma línea de fecha que ya trae cada post ("Bitácora · fecha").
  posts.forEach((post) => {
    const body = post.querySelector('.post-body');
    const label = post.querySelector('.section-label');
    if (!body || !label) return;
    const words = body.textContent.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    label.textContent = `${label.textContent} · ${minutes} min de lectura`;
  });

  // Navegador flotante de artículos: lista desplegable que resalta
  // el post actual a medida que se scrollea (scrollspy).
  const artNav = document.createElement('div');
  artNav.className = 'article-nav';
  artNav.innerHTML = `
    <button class="article-nav-toggle" aria-expanded="false" aria-controls="article-nav-list">Índice de artículos ▾</button>
    <div class="article-nav-list" id="article-nav-list"></div>`;
  document.body.appendChild(artNav);

  const artNavToggle = artNav.querySelector('.article-nav-toggle');
  const artNavList = artNav.querySelector('.article-nav-list');
  const artLinks = [];

  posts.forEach((post) => {
    const titleEl = post.querySelector('.post-title');
    const a = document.createElement('a');
    a.href = `#${post.id}`;
    a.textContent = titleEl ? titleEl.textContent : post.id;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      post.scrollIntoView({ behavior: 'smooth', block: 'start' });
      artNavList.classList.remove('is-open');
      artNavToggle.setAttribute('aria-expanded', 'false');
    });
    artNavList.appendChild(a);
    artLinks.push({ post, a });
  });

  artNavToggle.addEventListener('click', () => {
    const isOpen = artNavList.classList.toggle('is-open');
    artNavToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if (!artNav.contains(e.target)) {
      artNavList.classList.remove('is-open');
      artNavToggle.setAttribute('aria-expanded', 'false');
    }
  });

  const postObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const match = artLinks.find((l) => l.post === entry.target);
      if (!match) return;
      if (entry.isIntersecting) {
        artLinks.forEach((l) => l.a.classList.remove('is-active'));
        match.a.classList.add('is-active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  posts.forEach((p) => postObserver.observe(p));
}

// ---------- 22. Chandrasekhar Playground: simulación de colapso ----------
// Heurística educativa (NO el motor real de masa cognitiva de ARCHANGEL,
// que corre en Python sobre AST + entropía de Shannon — ver disclaimer
// en la propia sección). Cada método es una partícula con gravedad
// proporcional a su masa; si la masa total de la clase supera 1.44× lo
// que N métodos "sanos" deberían pesar, colapsa.
const chandraRunBtn = document.getElementById('chandra-run');
if (chandraRunBtn) {
  const chandraInput = document.getElementById('chandra-input');
  const chandraCanvas = document.getElementById('chandra-canvas');
  const chandraVerdict = document.getElementById('chandra-verdict');
  const ctx = chandraCanvas.getContext('2d');

  const HEALTHY_MASS_PER_METHOD = 20; // calibrado a mano contra 2 clases de referencia
  const CF_RE = /\b(if|elif|else|for|while|except|and|or|try)\b/g;

  function parseMethods(source) {
    const lines = source.split('\n');
    const methods = [];
    let current = null;
    for (const line of lines) {
      const m = line.match(/^(\s*)def\s+([A-Za-z_]\w*)\s*\(/);
      if (m && m[1].length > 0 && m[1].length <= 4) {
        if (current) methods.push(current);
        current = { name: m[2], lines: 0, cf: 0 };
        continue;
      }
      if (current && line.trim() !== '') {
        current.lines++;
        const matches = line.match(CF_RE);
        if (matches) current.cf += matches.length;
      }
    }
    if (current) methods.push(current);
    return methods;
  }

  function computeMass(m) {
    return 8 + m.lines * 1.5 + m.cf * 6;
  }

  let particles = [];
  let rafId = null;
  let state = 'idle'; // idle | orbiting | collapsing | collapsed | stable
  let stateStart = 0;
  let centroid = { x: 0, y: 0 };

  function resizeCanvas() {
    const rect = chandraCanvas.parentElement.getBoundingClientRect();
    chandraCanvas.width = rect.width;
    chandraCanvas.height = rect.height || 320;
  }

  function initParticles(methods) {
    resizeCanvas();
    const w = chandraCanvas.width;
    const h = chandraCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    centroid = { x: cx, y: cy };

    particles = methods.map((m, i) => {
      const mass = computeMass(m);
      const angle = (i / methods.length) * Math.PI * 2;
      const dist = Math.min(w, h) * 0.32;
      return {
        name: m.name,
        mass,
        radius: Math.max(6, Math.sqrt(mass) * 1.6),
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: -Math.sin(angle) * 0.35,
        vy: Math.cos(angle) * 0.35,
      };
    });
  }

  function step() {
    const w = chandraCanvas.width;
    const h = chandraCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const collapsing = state === 'collapsing';
    const G = collapsing ? 0.9 : 0.045;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const distSq = Math.max(dx * dx + dy * dy, 100);
        const dist = Math.sqrt(distSq);
        const force = (G * a.mass * b.mass) / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx / a.mass;
        a.vy += fy / a.mass;
        b.vx -= fx / b.mass;
        b.vy -= fy / b.mass;
      }
    }

    particles.forEach((p) => {
      if (!collapsing) {
        // Fuerza de contención suave hacia el centro para que no se escapen del canvas
        const dxc = cx - p.x;
        const dyc = cy - p.y;
        p.vx += dxc * 0.00008;
        p.vy += dyc * 0.00008;
        p.vx *= 0.995;
        p.vy *= 0.995;
      } else {
        p.vx *= 0.98;
        p.vy *= 0.98;
      }
      p.x += p.vx;
      p.y += p.vy;
    });
  }

  function draw() {
    const w = chandraCanvas.width;
    const h = chandraCanvas.height;
    ctx.clearRect(0, 0, w, h);

    // Líneas de acoplamiento entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const maxDist = Math.min(w, h) * 0.55;
        if (dist < maxDist) {
          ctx.strokeStyle = state === 'collapsing'
            ? `rgba(248, 113, 113, ${0.25 * (1 - dist / maxDist)})`
            : `rgba(61, 218, 215, ${0.18 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      const color = state === 'collapsing' || state === 'collapsed' ? '248,113,113' : '61,218,215';
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
      grad.addColorStop(0, `rgba(${color}, 0.9)`);
      grad.addColorStop(1, `rgba(${color}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${color}, 0.95)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function loop(now) {
    step();
    draw();

    if (state === 'orbiting' && now - stateStart > 1800) {
      state = 'stable';
      showVerdict(false);
    } else if (state === 'collapsing' && now - stateStart > 1600) {
      state = 'collapsed';
      showVerdict(true);
    }

    // 'stable'/'collapsed' son estados finales: se dibuja el último frame y se
    // corta el loop — nada de requestAnimationFrame corriendo para siempre
    // por una simulación que el usuario ya no está mirando.
    if (state === 'orbiting' || state === 'collapsing') {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }

  function showVerdict(collapsed) {
    chandraVerdict.hidden = false;
    if (collapsed) {
      chandraVerdict.className = 'chandra-verdict is-critical';
      chandraVerdict.textContent = `🔴 GOD OBJECT — colapsó bajo su propia masa (${totalMassLabel})`;
    } else {
      chandraVerdict.className = 'chandra-verdict is-clean';
      chandraVerdict.textContent = `✓ Saludable — masa total dentro del límite (${totalMassLabel})`;
    }
  }

  let totalMassLabel = '';

  chandraRunBtn.addEventListener('click', () => {
    if (rafId) cancelAnimationFrame(rafId);
    chandraVerdict.hidden = true;

    const methods = parseMethods(chandraInput.value);
    if (methods.length === 0) {
      chandraVerdict.hidden = false;
      chandraVerdict.className = 'chandra-verdict';
      chandraVerdict.textContent = 'No se detectaron métodos — pegá una clase con al menos un def';
      return;
    }

    const masses = methods.map(computeMass);
    const total = masses.reduce((a, b) => a + b, 0);
    const expected = methods.length * HEALTHY_MASS_PER_METHOD;
    const mCrit = 1.44 * expected;
    const willCollapse = total > mCrit;
    totalMassLabel = `masa: ${total.toFixed(0)} / límite: ${mCrit.toFixed(0)}`;

    initParticles(methods);
    state = 'orbiting'; // siempre orbita un momento antes del veredicto
    stateStart = performance.now();

    // Si va a colapsar, programamos el cambio de estado tras la órbita inicial
    if (willCollapse) {
      setTimeout(() => {
        state = 'collapsing';
        stateStart = performance.now();
      }, 1800);
    }

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  });

  window.addEventListener('resize', () => {
    if (particles.length) resizeCanvas();
  });
}
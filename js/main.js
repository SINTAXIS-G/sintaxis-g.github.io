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
    tocMenu.classList.toggle('is-open');
  });
  tocMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => tocMenu.classList.remove('is-open'));
  });
  document.addEventListener('click', (e) => {
    if (!tocMenu.contains(e.target) && e.target !== tocToggle) {
      tocMenu.classList.remove('is-open');
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

// ---------- 17. Minimapa de scroll ----------
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
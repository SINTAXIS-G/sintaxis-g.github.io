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
const terminal = document.getElementById('fake-terminal');
if (terminal) {
  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lines = terminal.querySelectorAll('.terminal-line');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('is-shown'), i * 450);
        });
        termObserver.unobserve(terminal);
      }
    });
  }, { threshold: 0.4 });
  termObserver.observe(terminal);
}

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

    requestAnimationFrame(draw);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    resize();
    initNodes();
    window.addEventListener('resize', () => { resize(); initNodes(); });
    requestAnimationFrame(draw);
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
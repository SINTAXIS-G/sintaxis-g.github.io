// ============================================================
// Hero 3D — paneles técnicos flotantes (Three.js, vía CDN como
// módulo ES — sin bundler, igual que el resto del sitio). Cargado
// solo de forma diferida por index.html cuando el dispositivo lo
// justifica (ver loader al final de index.html).
//
// Cada panel es un concepto físico real que ARCHANGEL ya usa
// (Griffith, entropía, Reynolds) — no son formas decorativas
// sueltas, son la versión 3D del mismo callout que ya aparece en
// el texto del hero.
// ============================================================
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('hero-3d-canvas');
const heroEl = document.querySelector('.hero');
if (!canvas || !heroEl) {
  throw new Error('hero-3d: faltan #hero-3d-canvas o .hero en el DOM');
}

function readVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

// Posiciones elegidas para no tapar nunca el bloque de texto (greeting,
// h1, párrafo, lema) — todas quedan arriba del título o bien a la derecha,
// donde el hero no tiene contenido. Cada una con un tipo de movimiento
// distinto (spin/bob/drift) para que no se sientan como el mismo objeto
// clonado tres veces.
const PANELS = [
  { label: 'GRIFFITH K=0.42', x: -0.3, y: 1.3, z: 0.2, motion: 'spin' },
  { label: 'ENTROPÍA', x: 2.0, y: -0.4, z: -1.1, motion: 'bob' },
  { label: 'REYNOLDS', x: 2.4, y: 1.6, z: -2.2, motion: 'drift' },
];

function makePanelTexture(label, accentHex, surfaceHex) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext('2d');
  ctx.fillStyle = surfaceHex;
  ctx.globalAlpha = 0.72;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, c.width - 12, c.height - 12);
  // corchetes de esquina, mismo lenguaje visual que .bp-frame en CSS
  const cl = 26;
  ctx.lineWidth = 5;
  [[0, 0, 1, 1], [c.width, 0, -1, 1], [0, c.height, 1, -1], [c.width, c.height, -1, -1]].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx * cl, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * cl);
    ctx.stroke();
  });
  ctx.fillStyle = accentHex;
  ctx.font = '600 44px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, c.width / 2, c.height / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
camera.position.z = 6;

let panelMeshes = [];

function buildPanels() {
  panelMeshes.forEach((m) => {
    scene.remove(m);
    m.geometry.dispose();
    m.material.map.dispose();
    m.material.dispose();
  });
  panelMeshes = [];

  const accent = readVar('--accent', '#4DF0E0');
  const surface = readVar('--surface', '#1D1827');

  PANELS.forEach((p) => {
    const tex = makePanelTexture(p.label, accent, surface);
    const geo = new THREE.PlaneGeometry(2.4, 0.75);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(p.x, p.y, p.z);
    mesh.userData.base = { x: p.x, y: p.y, z: p.z };
    mesh.userData.motion = p.motion;
    scene.add(mesh);
    panelMeshes.push(mesh);
  });
}

buildPanels();

const bunkerBtn = document.getElementById('bunker-toggle');
if (bunkerBtn) {
  bunkerBtn.addEventListener('click', () => {
    // Esperar al frame siguiente: el toggle de clase en <body> tiene
    // que aplicarse antes de releer las variables CSS, o se lee el
    // color viejo.
    requestAnimationFrame(buildPanels);
  });
}

function resize() {
  const w = heroEl.clientWidth;
  const h = heroEl.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

let targetRotX = 0;
let targetRotY = 0;
heroEl.addEventListener('mousemove', (e) => {
  const r = heroEl.getBoundingClientRect();
  const nx = (e.clientX - r.left) / r.width - 0.5;
  const ny = (e.clientY - r.top) / r.height - 0.5;
  targetRotY = nx * 0.35;
  targetRotX = -ny * 0.25;
});
heroEl.addEventListener('mouseleave', () => {
  targetRotX = 0;
  targetRotY = 0;
});

let isAnimating = false;
let rafId = null;
let t = 0;

function draw() {
  if (!isAnimating) return;
  t += 0.01;

  scene.rotation.x += (targetRotX - scene.rotation.x) * 0.06;
  scene.rotation.y += (targetRotY - scene.rotation.y) * 0.06;

  panelMeshes.forEach((m, i) => {
    const b = m.userData.base;
    switch (m.userData.motion) {
      case 'spin':
        m.rotation.y = Math.sin(t * 0.3) * 0.5;
        m.position.y = b.y + Math.cos(t * 0.4) * 0.08;
        break;
      case 'drift':
        m.position.x = b.x + Math.sin(t * 0.5 + i) * 0.18;
        m.rotation.z = Math.cos(t * 0.4 + i) * 0.03;
        break;
      default: // 'bob'
        m.position.y = b.y + Math.sin(t + i * 2.1) * 0.12;
        m.rotation.z = Math.sin(t * 0.6 + i) * 0.04;
    }
  });

  renderer.render(scene, camera);
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

// Mismo criterio de ahorro que la red de partículas 2D del hero:
// pausar fuera de viewport o con la pestaña en background.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && document.visibilityState === 'visible') {
      startAnimation();
    } else {
      stopAnimation();
    }
  });
}, { threshold: 0 });
observer.observe(canvas);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    stopAnimation();
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
  if (inViewport) startAnimation();
});

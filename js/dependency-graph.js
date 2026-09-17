// ============================================================
// SINTAXIS G — Grafo de dependencias en 3D (archangel.html)
// Recorte curado a mano de ~20 módulos reales del repo de ARCHANGEL —
// no una corrida en vivo del import graph completo (ver disclaimer en
// la propia sección). Three.js se carga solo cuando esta sección entra
// en el viewport, vía import() dinámico — nadie paga el costo si nunca
// llega a scrollear hasta acá.
// ============================================================

(function () {
  const mount = document.getElementById('depgraph-mount');
  if (!mount) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const NODES = [
    { id: 'catalog.py', group: 'registry', mass: 3.0 },
    { id: 'dag_engine.py', group: 'registry', mass: 2.6 },
    { id: 'workers.py', group: 'registry', mass: 2.4 },
    { id: 'correlator/engine.py', group: 'correlator', mass: 2.2 },
    { id: 'correlator/confidence.py', group: 'correlator', mass: 1.6 },
    { id: 'extractors/security.py', group: 'correlator', mass: 1.8 },
    { id: 'extractors/architecture.py', group: 'correlator', mass: 1.7 },
    { id: 'extractors/ast_metrics.py', group: 'correlator', mass: 1.7 },
    { id: 'extractors/concurrency.py', group: 'correlator', mass: 1.2 },
    { id: 'extractors/formal.py', group: 'correlator', mass: 1.2 },
    { id: 'extractors/memory.py', group: 'correlator', mass: 1.1 },
    { id: 'extractors/numerical.py', group: 'correlator', mass: 1.1 },
    { id: 'physics/taint_analysis.py', group: 'physics', mass: 1.9 },
    { id: 'physics/cross_module_resolver.py', group: 'physics', mass: 1.3 },
    { id: 'topology/security_scanner.py', group: 'topology', mass: 1.3 },
    { id: 'topology/clone_detector.py', group: 'topology', mass: 1.2 },
    { id: 'topology/api_surface.py', group: 'topology', mass: 1.1 },
    { id: 'semantics/invariants.py', group: 'semantics', mass: 1.8 },
    { id: 'semantics/intent_recognition.py', group: 'semantics', mass: 1.6 },
    { id: 'rules/rule_postel_robustness.py', group: 'rules', mass: 1.3 },
    { id: 'rules/rule_numerical_stability.py', group: 'rules', mass: 1.2 },
  ];

  const EDGES = [
    ['catalog.py', 'workers.py'],
    ['catalog.py', 'dag_engine.py'],
    ['dag_engine.py', 'correlator/engine.py'],
    ['correlator/engine.py', 'correlator/confidence.py'],
    ['correlator/engine.py', 'extractors/security.py'],
    ['correlator/engine.py', 'extractors/architecture.py'],
    ['correlator/engine.py', 'extractors/ast_metrics.py'],
    ['correlator/engine.py', 'extractors/concurrency.py'],
    ['correlator/engine.py', 'extractors/formal.py'],
    ['correlator/engine.py', 'extractors/memory.py'],
    ['correlator/engine.py', 'extractors/numerical.py'],
    ['extractors/security.py', 'physics/taint_analysis.py'],
    ['physics/taint_analysis.py', 'physics/cross_module_resolver.py'],
    ['catalog.py', 'topology/security_scanner.py'],
    ['catalog.py', 'topology/clone_detector.py'],
    ['catalog.py', 'topology/api_surface.py'],
    ['catalog.py', 'semantics/invariants.py'],
    ['catalog.py', 'semantics/intent_recognition.py'],
    ['catalog.py', 'rules/rule_postel_robustness.py'],
    ['catalog.py', 'rules/rule_numerical_stability.py'],
    ['extractors/architecture.py', 'rules/rule_postel_robustness.py'],
    ['extractors/numerical.py', 'rules/rule_numerical_stability.py'],
  ];

  const GROUP_COLORS = {
    registry: 0x3ddad7,
    correlator: 0x4ade80,
    physics: 0xfbbf24,
    topology: 0xf87171,
    semantics: 0xa78bfa,
    rules: 0x60a5fa,
  };

  let started = false;
  let animating = false;
  let animateFn = null;

  async function start() {
    if (started) return;
    started = true;

    let THREE;
    try {
      THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    } catch (e) {
      console.warn('[dep-graph] no se pudo cargar three.js:', e);
      mount.innerHTML = '';
      return;
    }

    mount.innerHTML = '';

    const width = mount.clientWidth;
    const height = mount.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    mount.appendChild(renderer.domElement);

    // ---- Simulación de fuerzas simple (repulsión + resortes + centrado) ----
    const idToIndex = new Map(NODES.map((n, i) => [n.id, i]));
    const positions = NODES.map(() => new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ));
    const velocities = NODES.map(() => new THREE.Vector3());
    const edgeIndices = EDGES.map(([a, b]) => [idToIndex.get(a), idToIndex.get(b)]);

    function simulate() {
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const diff = positions[i].clone().sub(positions[j]);
          const distSq = Math.max(diff.lengthSq(), 4);
          const force = 60 / distSq;
          diff.normalize().multiplyScalar(force);
          velocities[i].add(diff);
          velocities[j].sub(diff);
        }
      }
      edgeIndices.forEach(([i, j]) => {
        const diff = positions[j].clone().sub(positions[i]);
        const dist = diff.length() || 0.001;
        const force = (dist - 12) * 0.02;
        diff.normalize().multiplyScalar(force);
        velocities[i].add(diff);
        velocities[j].sub(diff);
      });
      NODES.forEach((_, i) => {
        velocities[i].add(positions[i].clone().multiplyScalar(-0.002));
        velocities[i].multiplyScalar(0.85);
        positions[i].add(velocities[i]);
      });
    }

    for (let i = 0; i < 200; i++) simulate(); // pre-simula: arranca ya acomodado, sin caos inicial

    // ---- Geometría ----
    const nodeMeshes = NODES.map((n, i) => {
      const geo = new THREE.SphereGeometry(Math.max(0.6, n.mass * 0.55), 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: GROUP_COLORS[n.group] || 0xffffff });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(positions[i]);
      scene.add(mesh);
      return mesh;
    });

    const edgeGeometry = new THREE.BufferGeometry();
    const edgePositions = new Float32Array(edgeIndices.length * 6);
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x2a3646, transparent: true, opacity: 0.6 });
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    scene.add(edgeLines);

    function updateEdgeGeometry() {
      const arr = edgeGeometry.attributes.position.array;
      edgeIndices.forEach(([i, j], k) => {
        const a = positions[i];
        const b = positions[j];
        arr[k * 6 + 0] = a.x; arr[k * 6 + 1] = a.y; arr[k * 6 + 2] = a.z;
        arr[k * 6 + 3] = b.x; arr[k * 6 + 4] = b.y; arr[k * 6 + 5] = b.z;
      });
      edgeGeometry.attributes.position.needsUpdate = true;
    }
    updateEdgeGeometry();

    // ---- Control manual: arrastrar rota, rueda hace zoom (sin OrbitControls externo) ----
    let rotY = 0.4;
    let rotX = 0.15;
    let radius = 42;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function updateCamera() {
      camera.position.x = radius * Math.sin(rotY) * Math.cos(rotX);
      camera.position.y = radius * Math.sin(rotX);
      camera.position.z = radius * Math.cos(rotY) * Math.cos(rotX);
      camera.lookAt(0, 0, 0);
    }
    updateCamera();

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.style.touchAction = 'none';
    dom.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      dom.style.cursor = 'grabbing';
    });
    window.addEventListener('pointerup', () => {
      dragging = false;
      dom.style.cursor = 'grab';
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.006;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + (e.clientY - lastY) * 0.006));
      lastX = e.clientX;
      lastY = e.clientY;
      updateCamera();
    });
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      radius = Math.max(15, Math.min(90, radius + e.deltaY * 0.03));
      updateCamera();
    }, { passive: false });

    // ---- Tooltip con el nombre del módulo bajo el cursor ----
    const tooltip = document.createElement('div');
    tooltip.className = 'depgraph-tooltip';
    mount.appendChild(tooltip);
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    dom.addEventListener('pointermove', (e) => {
      if (dragging) {
        tooltip.classList.remove('is-visible');
        return;
      }
      const rect = dom.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(nodeMeshes);
      if (hits.length) {
        const idx = nodeMeshes.indexOf(hits[0].object);
        tooltip.textContent = NODES[idx].id;
        tooltip.style.left = `${e.clientX - rect.left + 12}px`;
        tooltip.style.top = `${e.clientY - rect.top + 12}px`;
        tooltip.classList.add('is-visible');
      } else {
        tooltip.classList.remove('is-visible');
      }
    });

    // ---- Loop de render ----
    let frame = 0;
    function animate() {
      if (!animating) return;
      frame++;
      if (frame < 60) {
        simulate();
        NODES.forEach((_, i) => nodeMeshes[i].position.copy(positions[i]));
        updateEdgeGeometry();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animateFn = animate;
    animating = true;
    animate();

    window.addEventListener('resize', () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // Un solo observer: dispara la carga la primera vez que el bloque entra
  // en pantalla, y pausa/reanuda el render loop según visibilidad real
  // (scroll fuera de vista o pestaña en segundo plano) — mismo criterio
  // que el resto de las animaciones de esta página.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!started) start();
        else if (!animating) {
          animating = true;
          if (animateFn) animateFn();
        }
      } else {
        animating = false;
      }
    });
  }, { threshold: 0.15 });
  observer.observe(mount);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      animating = false;
    } else {
      const rect = mount.getBoundingClientRect();
      const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inViewport && started && !animating) {
        animating = true;
        if (animateFn) animateFn();
      }
    }
  });
})();

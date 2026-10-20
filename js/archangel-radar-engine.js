/**
 * ARCHANGEL Ω — 3D HOLOGRAPHIC QUANTUM RADAR ENGINE v3.0
 * High-precision 3D projective engine with z-sorting, raycasting,
 * volumetric phosphor sweep, gyroscopic tensor rings, and drop stems.
 */

class ArchangelRadar {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      onSelect: null,
      onHover: null,
      initialSector: 'physics'
    }, options);

    // ─────────────────────────────────────────────────────────────
    // ESTADO DE CÁMARA Y CALIBRACIÓN
    // ─────────────────────────────────────────────────────────────
    this.camera = {
      rotX: 0.45,
      rotY: -0.25,
      targetRotX: 0.45,
      targetRotY: -0.25,
      panX: 0,
      panY: 0,
      fov: 750,
      zoom: 1.0,
      targetZoom: 1.0,
      minZoom: 0.4,
      maxZoom: 2.2
    };

    this.calib = {
      simSpeed: 1.0,
      sweepSpeed: 0.025,
      particleCount: 160,
      glowIntensity: 1.0,
      showStems: true,
      showGrid: true,
      showTrails: true,
      autoOrbit: true
    };

    this.sweepAngle = 0;
    this.lastInteraction = Date.now();
    this.isMouseDown = false;
    this.mouse = { x: -9999, y: -9999, lastX: 0, lastY: 0, isRight: false };
    this.hoveredNode = null;
    this.selectedNodeKey = this.options.initialSector;

    // ─────────────────────────────────────────────────────────────
    // NODOS SATÉLITE DE LOS 8 SECTORES ARQUITECTÓNICOS
    // ─────────────────────────────────────────────────────────────
    this.sectors = {
      physics: {
        id: 'physics',
        name: 'Física Esotérica & Cuántica',
        code: 'SEC-01',
        color: '#00f0ff',
        orbitR: 260,
        heightY: -45,
        mass: 92,
        desc: 'AdS/CFT Maldacena, SQA Ising P=8, Chaperón GroEL/GroES 14 ATP, Demonio de Maxwell.',
        metrics: { spof: '0.02', entropy: '3.41 bits', ssi: '96.2%', laws: '8 Físicas' }
      },
      cybernetics: {
        id: 'cybernetics',
        name: 'Leyes Sistémicas & Cibernética',
        code: 'SEC-02',
        color: '#ffaa00',
        orbitR: 290,
        heightY: 35,
        mass: 88,
        desc: 'Ciclo Panarchy r-K-Ω-α, Variedad Requisita de Ashby, Capacidad Shannon C=B*log2(1+S/N).',
        metrics: { spof: '0.05', entropy: '2.84 bits', ssi: '94.8%', sir: 'Cascade 0.08' }
      },
      semantics: {
        id: 'semantics',
        name: 'Semántica & Refactorización',
        code: 'SEC-03',
        color: '#00ff88',
        orbitR: 240,
        heightY: -60,
        mass: 85,
        desc: 'Seam Discovery Michael Feathers, Bisección LCOM4, Cero Kelvin, Decaimiento Rutherford.',
        metrics: { spof: '0.01', entropy: '1.92 bits', ssi: '98.1%', purity: '0K Cryo' }
      },
      rust: {
        id: 'rust',
        name: 'Motor Nativo Rust Zero-GIL',
        code: 'SEC-04',
        color: '#3ddad7',
        orbitR: 220,
        heightY: 55,
        mass: 99,
        desc: '31,666 LOC en archangel_rs, EVM SWC-107/115/104, CosmWasm, Andersen Points-To.',
        metrics: { spof: '0.00', latency: '4.8ms', ssi: '99.4%', loc: '31,666' }
      },
      graphrag: {
        id: 'graphrag',
        name: 'GraphRAG & Memoria Merkle',
        code: 'SEC-05',
        color: '#b845ff',
        orbitR: 310,
        heightY: -30,
        mass: 94,
        desc: 'SQLite WAL 3,404 LOC Gremlin, Árboles Merkle α-equivalentes, NumPy Node2Vec SGNS, Leiden.',
        metrics: { spof: '0.03', communities: '18 Macro', ssi: '95.5%', speed: '12ms' }
      },
      colosseum: {
        id: 'colosseum',
        name: 'Coliseo Cognitivo Multi-Agente',
        code: 'SEC-06',
        color: '#f87171',
        orbitR: 275,
        heightY: 40,
        mass: 90,
        desc: 'Tríada Dialéctica (Purista vs Hacker vs Sintetizador) arbitrada por Ashby/Lorentz/Seguridad.',
        metrics: { spof: '0.02', consensus: '94%', ssi: '96.8%', agents: '7 Enjambre' }
      },
      sociotechnical: {
        id: 'sociotechnical',
        name: 'Sensor Sociotécnico & Conway',
        code: 'SEC-07',
        color: '#ff3366',
        orbitR: 325,
        heightY: -20,
        mass: 86,
        desc: 'Curva Ebbinghaus (T1/2=12m), Brecha Conway, Curva S-N Wöhler de fatiga de commits.',
        metrics: { spof: '0.06', halfLife: '12 Meses', ssi: '93.2%', fatigue: 'Baja' }
      },
      bayesian: {
        id: 'bayesian',
        name: 'Correlador Bayesiano V3',
        code: 'SEC-08',
        color: '#ffc83b',
        orbitR: 250,
        heightY: 25,
        mass: 97,
        desc: 'Retículo Bellman {0,1}^k exacto, Shapley Values, NPMI Bouma, Colapso de Ruido -80%.',
        metrics: { spof: '0.01', suppression: '81.4%', ssi: '98.9%', dp: 'Exact 2^k' }
      }
    };

    // ─────────────────────────────────────────────────────────────
    // ANILLOS DE TENSORES D1-D5 (GIMBALS GIROSCÓPICOS 3D)
    // ─────────────────────────────────────────────────────────────
    this.tensorRings = [
      { id: 'D1', name: 'D1: FEEDBACK', radius: 90, tiltX: 0.15, tiltZ: 0.05, speed: 0.012, color: '#00f0ff' },
      { id: 'D2', name: 'D2: JACOBIAN ∇R', radius: 130, tiltX: -0.28, tiltZ: 0.18, speed: -0.009, color: '#ffaa00' },
      { id: 'D3', name: 'D3: CHAOS ATTRACTOR', radius: 170, tiltX: 0.38, tiltZ: -0.22, speed: 0.007, color: '#b845ff' },
      { id: 'D4', name: 'D4: LYAPUNOV λmax', radius: 205, tiltX: -0.45, tiltZ: -0.15, speed: -0.005, color: '#00ff88' },
      { id: 'D5', name: 'D5: PERCOLATION pc', radius: 235, tiltX: 0.22, tiltZ: 0.35, speed: 0.004, color: '#ff3366' }
    ];

    // Partículas cuánticas y ondas
    this.particles = [];
    this.pulses = [];
    this.initParticles();

    // Enlazar eventos de interacción
    this.bindEvents();

    // Arrancar bucle de renderizado
    this.isRunning = true;
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.calib.particleCount; i++) {
      this.particles.push({
        ringIdx: Math.floor(Math.random() * this.tensorRings.length),
        angle: Math.random() * Math.PI * 2,
        speed: (0.01 + Math.random() * 0.018) * (Math.random() > 0.5 ? 1 : -1),
        offsetR: (Math.random() - 0.5) * 8,
        offsetY: (Math.random() - 0.5) * 10,
        size: 1.2 + Math.random() * 1.8,
        phosphor: 0
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // MATEMÁTICAS DE PROYECCIÓN 3D A 2D CON PERSPECTIVA
  // ─────────────────────────────────────────────────────────────
  project(x, y, z, cx, cy) {
    // 1. Rotación alrededor del eje Y (Yaw)
    const cosY = Math.cos(this.camera.rotY);
    const sinY = Math.sin(this.camera.rotY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // 2. Rotación alrededor del eje X (Pitch)
    const cosX = Math.cos(this.camera.rotX);
    const sinX = Math.sin(this.camera.rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // 3. Perspectiva cónica
    const effectiveFov = this.camera.fov * this.camera.zoom;
    const distance = effectiveFov + z2;
    const scale = distance > 10 ? effectiveFov / distance : 0.01;

    return {
      x: cx + this.camera.panX + x1 * scale,
      y: cy + this.camera.panY + y2 * scale,
      scale: scale,
      depth: z2,
      raw3D: { x: x1, y: y2, z: z2 }
    };
  }

  // ─────────────────────────────────────────────────────────────
  // INTERACCIÓN Y RAYCASTING
  // ─────────────────────────────────────────────────────────────
  bindEvents() {
    const el = this.canvas;

    el.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.lastInteraction = Date.now();
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;
      this.mouse.isRight = e.button === 2;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    el.addEventListener('contextmenu', (e) => e.preventDefault());

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;

      if (this.isMouseDown) {
        this.lastInteraction = Date.now();
        const dx = e.clientX - this.mouse.lastX;
        const dy = e.clientY - this.mouse.lastY;

        if (this.mouse.isRight || e.shiftKey) {
          // Paneo de cámara
          this.camera.panX += dx;
          this.camera.panY += dy;
        } else {
          // Órbita
          this.camera.targetRotY += dx * 0.005;
          this.camera.targetRotX += dy * 0.005;
          // Limitar cabeceo para evitar volteo
          this.camera.targetRotX = Math.max(-1.1, Math.min(1.1, this.camera.targetRotX));
        }

        this.mouse.lastX = e.clientX;
        this.mouse.lastY = e.clientY;
      }
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.lastInteraction = Date.now();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.camera.targetZoom = Math.max(
        this.camera.minZoom,
        Math.min(this.camera.maxZoom, this.camera.targetZoom * zoomFactor)
      );
    }, { passive: false });

    el.addEventListener('click', () => {
      if (this.hoveredNode) {
        this.selectNode(this.hoveredNode.id);
      }
    });

    // Touch Support
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isMouseDown = true;
        this.lastInteraction = Date.now();
        this.mouse.lastX = e.touches[0].clientX;
        this.mouse.lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isMouseDown = false;
    });

    el.addEventListener('touchmove', (e) => {
      if (this.isMouseDown && e.touches.length === 1) {
        this.lastInteraction = Date.now();
        const dx = e.touches[0].clientX - this.mouse.lastX;
        const dy = e.touches[0].clientY - this.mouse.lastY;
        this.camera.targetRotY += dx * 0.006;
        this.camera.targetRotX += dy * 0.006;
        this.camera.targetRotX = Math.max(-1.1, Math.min(1.1, this.camera.targetRotX));
        this.mouse.lastX = e.touches[0].clientX;
        this.mouse.lastY = e.touches[0].clientY;
      }
    }, { passive: true });
  }

  selectNode(sectorId) {
    const keyMap = {
      'memory': 'graphrag',
      'cognitive': 'colosseum',
      'correlator': 'bayesian'
    };
    const norm = keyMap[sectorId] || sectorId;
    if (!this.sectors[norm]) return;
    this.selectedNodeKey = norm;
    const sector = this.sectors[norm];

    // Shockwave pulse
    this.pulses.push({
      sectorId: sectorId,
      radius: 10,
      maxRadius: 180,
      opacity: 0.9,
      color: sector.color
    });

    if (typeof this.options.onSelect === 'function') {
      this.options.onSelect(sector);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER PIPELINE PRINCIPAL (Z-SORTED PAINTERS ALGORITHM)
  // ─────────────────────────────────────────────────────────────
  render() {
    if (!this.isRunning) return;

    const ctx = this.ctx;
    const canvas = this.canvas;

    // Ajuste de resolución con DPR sin descalibrar el canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayW = rect.width;
    const displayH = rect.height;

    if (canvas.width !== Math.floor(displayW * dpr) || canvas.height !== Math.floor(displayH * dpr)) {
      canvas.width = Math.floor(displayW * dpr);
      canvas.height = Math.floor(displayH * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = displayW / 2;
    const cy = displayH / 2;

    // Suavizado inercial de cámara
    this.camera.rotX += (this.camera.targetRotX - this.camera.rotX) * 0.08;
    this.camera.rotY += (this.camera.targetRotY - this.camera.rotY) * 0.08;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.1;

    // Auto-órbita cinematográfica en reposo
    if (this.calib.autoOrbit && !this.isMouseDown && Date.now() - this.lastInteraction > 3000) {
      this.camera.targetRotY += 0.0015 * this.calib.simSpeed;
    }

    // Actualizar barrido de radar (radar sweep)
    this.sweepAngle = (this.sweepAngle + this.calib.sweepSpeed * this.calib.simSpeed) % (Math.PI * 2);

    // Limpieza con estela si los trails están activos
    if (this.calib.showTrails) {
      ctx.fillStyle = 'rgba(3, 5, 10, 0.25)';
      ctx.fillRect(0, 0, displayW, displayH);
    } else {
      ctx.clearRect(0, 0, displayW, displayH);
    }

    // ─────────────────────────────────────────────────────────
    // FASE 1: CONSTRUCCIÓN DEL BUFFER DE ÍTEMS 3D
    // ─────────────────────────────────────────────────────────
    const renderList = [];

    // A. Anillos de la retícula de tierra (Ground Plane Range Rings en Y = 0)
    if (this.calib.showGrid) {
      for (let r = 80; r <= 360; r += 70) {
        const ringPoints = [];
        const segs = 48;
        for (let s = 0; s <= segs; s++) {
          const theta = (s / segs) * Math.PI * 2;
          const p = this.project(Math.cos(theta) * r, 0, Math.sin(theta) * r, cx, cy);
          ringPoints.push(p);
        }
        renderList.push({
          type: 'groundRing',
          radius: r,
          points: ringPoints,
          depth: 0
        });
      }

      // Ejes radiales de la retícula
      for (let a = 0; a < 8; a++) {
        const theta = (a / 8) * Math.PI * 2;
        const p1 = this.project(0, 0, 0, cx, cy);
        const p2 = this.project(Math.cos(theta) * 360, 0, Math.sin(theta) * 360, cx, cy);
        renderList.push({
          type: 'groundAxis',
          p1: p1,
          p2: p2,
          depth: (p1.depth + p2.depth) / 2
        });
      }

      // Haz de barrido fosforescente del radar
      const sweepP1 = this.project(0, 0, 0, cx, cy);
      const sweepP2 = this.project(Math.cos(this.sweepAngle) * 360, 0, Math.sin(this.sweepAngle) * 360, cx, cy);
      renderList.push({
        type: 'radarSweep',
        p1: sweepP1,
        p2: sweepP2,
        angle: this.sweepAngle,
        depth: (sweepP1.depth + sweepP2.depth) / 2
      });
    }

    // B. Anillos Tensoriales D1 - D5 (Wireframe Elipses 3D)
    this.tensorRings.forEach(ring => {
      ring.currentAngle = (ring.currentAngle || 0) + ring.speed * this.calib.simSpeed;
      const ringPts = [];
      const segs = 56;
      let avgDepth = 0;

      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2 + ring.currentAngle;
        // Coordenadas con inclinación giroscópica
        let px = Math.cos(theta) * ring.radius;
        let py = Math.sin(theta) * ring.radius * ring.tiltX;
        let pz = Math.sin(theta) * ring.radius;

        // Inclinación Z
        const cosZ = Math.cos(ring.tiltZ);
        const sinZ = Math.sin(ring.tiltZ);
        const pxFinal = px * cosZ - py * sinZ;
        const pyFinal = px * sinZ + py * cosZ;

        const proj = this.project(pxFinal, pyFinal, pz, cx, cy);
        ringPts.push(proj);
        avgDepth += proj.depth;
      }

      renderList.push({
        type: 'tensorRing',
        ring: ring,
        points: ringPts,
        depth: avgDepth / ringPts.length
      });
    });

    // C. Núcleo Tokamak Central (Singularidad Cuántica en 0, 0, 0)
    const coreProj = this.project(0, 0, 0, cx, cy);
    renderList.push({
      type: 'tokamakCore',
      proj: coreProj,
      depth: coreProj.depth
    });

    // D. Nodos Satélite de los 8 Sectores Arquitectónicos
    const sectorKeys = Object.keys(this.sectors);
    let closestHover = null;
    let closestDist = 9999;

    sectorKeys.forEach((key, i) => {
      const sector = this.sectors[key];
      const baseAngle = (i / sectorKeys.length) * Math.PI * 2;
      const currentOrbitAngle = baseAngle + (Date.now() * 0.00007 * this.calib.simSpeed);

      const sx = Math.cos(currentOrbitAngle) * sector.orbitR;
      const sz = Math.sin(currentOrbitAngle) * sector.orbitR;
      const sy = sector.heightY;

      const nodeProj = this.project(sx, sy, sz, cx, cy);
      const groundProj = this.project(sx, 0, sz, cx, cy);

      // Calcular proximidad con el rayo de barrido de radar para brillo fosfórico
      const nodeAngle = Math.atan2(sz, sx);
      const angleDiff = Math.abs(((this.sweepAngle - nodeAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      const sweepProximity = Math.max(0, 1 - angleDiff * 3.5);

      // Detección de colisión / hover
      const hitDist = Math.hypot(nodeProj.x - this.mouse.x, nodeProj.y - this.mouse.y);
      const hitRadius = (sector.id === this.selectedNodeKey ? 22 : 16) * nodeProj.scale;

      if (hitDist <= hitRadius && hitDist < closestDist) {
        closestDist = hitDist;
        closestHover = { sector: sector, proj: nodeProj };
      }

      renderList.push({
        type: 'satelliteNode',
        sector: sector,
        proj: nodeProj,
        groundProj: groundProj,
        sweepGlow: sweepProximity,
        isSelected: sector.id === this.selectedNodeKey,
        depth: nodeProj.depth
      });
    });

    this.hoveredNode = closestHover ? closestHover.sector : null;
    this.canvas.style.cursor = this.hoveredNode ? 'pointer' : (this.isMouseDown ? 'grabbing' : 'grab');

    // E. Partículas Cuánticas
    this.particles.forEach(p => {
      p.angle += p.speed * this.calib.simSpeed;
      const ring = this.tensorRings[p.ringIdx];
      if (!ring) return;

      const r = ring.radius + p.offsetR;
      let px = Math.cos(p.angle) * r;
      let py = Math.sin(p.angle) * r * ring.tiltX + p.offsetY;
      let pz = Math.sin(p.angle) * r;

      const cosZ = Math.cos(ring.tiltZ);
      const sinZ = Math.sin(ring.tiltZ);
      const pxFinal = px * cosZ - py * sinZ;
      const pyFinal = px * sinZ + py * cosZ;

      const pProj = this.project(pxFinal, pyFinal, pz, cx, cy);
      renderList.push({
        type: 'particle',
        p: p,
        proj: pProj,
        color: ring.color,
        depth: pProj.depth
      });
    });

    // ─────────────────────────────────────────────────────────
    // FASE 2: ORDENAMIENTO POR PROFUNDIDAD (Z-SORTING)
    // ─────────────────────────────────────────────────────────
    renderList.sort((a, b) => b.depth - a.depth);

    // ─────────────────────────────────────────────────────────
    // FASE 3: RASTERIZACIÓN Y PINTADO VECTORIAL
    // ─────────────────────────────────────────────────────────
    renderList.forEach(item => {
      switch (item.type) {
        case 'groundRing':
          this.drawGroundRing(ctx, item.points, item.radius);
          break;
        case 'groundAxis':
          this.drawGroundAxis(ctx, item.p1, item.p2);
          break;
        case 'radarSweep':
          this.drawRadarSweep(ctx, item.p1, item.p2);
          break;
        case 'tensorRing':
          this.drawTensorRing(ctx, item.ring, item.points);
          break;
        case 'tokamakCore':
          this.drawTokamakCore(ctx, item.proj);
          break;
        case 'satelliteNode':
          this.drawSatelliteNode(ctx, item);
          break;
        case 'particle':
          this.drawParticle(ctx, item);
          break;
      }
    });

    // Ondas de pulso expansivo
    this.drawShockwaves(ctx, cx, cy);

    // Si hay un nodo hovered, dibujar la retícula de adquisición y HUD
    if (closestHover) {
      this.drawTargetReticle(ctx, closestHover.proj, closestHover.sector);
    }

    requestAnimationFrame(this.render);
  }

  // ─────────────────────────────────────────────────────────────
  // MÉTODOS DE DIBUJO VECTORIAL HOLOGRÁFICO
  // ─────────────────────────────────────────────────────────────

  drawGroundRing(ctx, pts, radius) {
    if (pts.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Etiqueta de rango métrico
    if (radius % 140 === 0 && pts[0]) {
      ctx.font = '500 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.fillText(`${radius}k LOC`, pts[0].x + 4, pts[0].y);
    }
    ctx.restore();
  }

  drawGroundAxis(ctx, p1, p2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }

  drawRadarSweep(ctx, p1, p2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  drawTensorRing(ctx, ring, pts) {
    if (pts.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();

    ctx.strokeStyle = ring.color;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.0;
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = 6 * this.calib.glowIntensity;
    ctx.stroke();

    // Tag indicador en el anillo
    const tag = pts[Math.floor(pts.length * 0.25)];
    if (tag) {
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = ring.color;
      ctx.beginPath();
      ctx.arc(tag.x, tag.y, 2.5 * tag.scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(ring.id, tag.x + 5, tag.y + 2);
    }
    ctx.restore();
  }

  drawTokamakCore(ctx, proj) {
    const scale = proj.scale;
    const r = 30 * scale;

    ctx.save();
    // 1. Resplandor exterior volumétrico
    const grad = ctx.createRadialGradient(proj.x, proj.y, 2, proj.x, proj.y, r * 2.2);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
    grad.addColorStop(0.3, 'rgba(184, 69, 255, 0.4)');
    grad.addColorStop(0.8, 'rgba(0, 240, 255, 0.08)');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Disco de acreción del agujero negro central
    ctx.fillStyle = '#050812';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12 * this.calib.glowIntensity;
    ctx.stroke();

    // 3. Glifos de rotación interna (DAG Wave Core)
    const waveAngle = Date.now() * 0.002;
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, r * 0.55, waveAngle, waveAngle + Math.PI * 1.3);
    ctx.stroke();

    ctx.font = `700 ${Math.max(7, Math.floor(9 * scale))}px "JetBrains Mono", monospace`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('DAG Ω', proj.x, proj.y + 3);

    ctx.restore();
  }

  drawSatelliteNode(ctx, item) {
    const { sector, proj, groundProj, sweepGlow, isSelected } = item;
    const scale = proj.scale;
    const nodeR = (isSelected ? 9 : 6.5) * scale;

    ctx.save();

    // 1. Drop Stem (Línea de caída vertical hacia el plano de tierra del radar)
    if (this.calib.showStems) {
      ctx.beginPath();
      ctx.moveTo(proj.x, proj.y);
      ctx.lineTo(groundProj.x, groundProj.y);
      ctx.strokeStyle = isSelected ? sector.color : 'rgba(0, 240, 255, 0.18)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.setLineDash([]);

      // Huella en la base del suelo
      ctx.beginPath();
      ctx.ellipse(groundProj.x, groundProj.y, 6 * groundProj.scale, 2.5 * groundProj.scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.fill();
      ctx.strokeStyle = isSelected ? sector.color : 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // 2. Conexión de rayo láser hacia el núcleo
    const centerProj = this.project(0, 0, 0, this.canvas.width / 2, this.canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(centerProj.x, centerProj.y);
    ctx.lineTo(proj.x, proj.y);
    ctx.strokeStyle = isSelected ? sector.color : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = isSelected ? 1.5 : 0.6;
    ctx.stroke();

    // 3. Esfera del Pod Satélite con resplandor
    const totalGlow = (isSelected ? 1.5 : 0.6) + sweepGlow * 1.2;
    ctx.shadowColor = sector.color;
    ctx.shadowBlur = 14 * totalGlow * this.calib.glowIntensity;
    ctx.fillStyle = isSelected ? '#ffffff' : sector.color;

    ctx.beginPath();
    ctx.arc(proj.x, proj.y, nodeR, 0, Math.PI * 2);
    ctx.fill();

    // Anillo exterior pulsante si está seleccionado
    if (isSelected) {
      ctx.strokeStyle = sector.color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, nodeR + 5 * scale, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Etiqueta flotante con código y nombre
    ctx.font = `${isSelected ? '700' : '600'} ${Math.max(7, Math.floor((isSelected ? 9.5 : 8) * scale))}px "JetBrains Mono", monospace`;
    ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(200, 220, 240, 0.85)';
    ctx.textAlign = 'center';
    ctx.fillText(`${sector.code} // ${sector.name.split(' ')[0]}`, proj.x, proj.y + nodeR + 10 * scale);

    ctx.restore();
  }

  drawParticle(ctx, item) {
    const { proj, color } = item;
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6 * this.calib.glowIntensity;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, item.p.size * proj.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawShockwaves(ctx, cx, cy) {
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.radius += 3.5 * this.calib.simSpeed;
      p.opacity -= 0.015 * this.calib.simSpeed;

      if (p.opacity <= 0 || p.radius >= p.maxRadius) {
        this.pulses.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx + this.camera.panX, cy + this.camera.panY, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawTargetReticle(ctx, proj, sector) {
    const scale = proj.scale;
    const boxSize = 22 * scale;

    ctx.save();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;

    // Brackets de mira [ ]
    const x = proj.x;
    const y = proj.y;
    const b = boxSize;
    const arm = 6 * scale;

    ctx.beginPath();
    // Top-Left
    ctx.moveTo(x - b, y - b + arm);
    ctx.lineTo(x - b, y - b);
    ctx.lineTo(x - b + arm, y - b);
    // Top-Right
    ctx.moveTo(x + b - arm, y - b);
    ctx.lineTo(x + b, y - b);
    ctx.lineTo(x + b, y - b + arm);
    // Bottom-Left
    ctx.moveTo(x - b, y + b - arm);
    ctx.lineTo(x - b, y + b);
    ctx.lineTo(x - b + arm, y + b);
    // Bottom-Right
    ctx.moveTo(x + b - arm, y + b);
    ctx.lineTo(x + b, y + b);
    ctx.lineTo(x + b, y + b - arm);
    ctx.stroke();

    // Línea de llamada dog-leg y tarjeta HUD
    ctx.beginPath();
    ctx.moveTo(x + b, y - b);
    ctx.lineTo(x + b + 20, y - b - 15);
    ctx.lineTo(x + b + 80, y - b - 15);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 1.0;
    ctx.stroke();

    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    ctx.fillText(`TARGET LOCKED // ${sector.code}`, x + b + 25, y - b - 18);

    ctx.restore();
  }
}

// Exportar globalmente
window.ArchangelRadar = ArchangelRadar;

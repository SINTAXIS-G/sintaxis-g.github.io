// ============================================================================
// SINTAXIS_G // Ecosystem 3D Constellation Nexus (Ecosystem Blueprint)
// 6 Hex-Nodes in R^3, 13 Skew-Free Optical Bus Links, 104 Packet Points (1 Draw),
// FSM Camera with Radial Arc Preservation, Two-Way DOM Synchronization.
// ============================================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(() => {
  'use strict';

  const viewport = document.getElementById('ecoBlueprintViewport');
  const canvas = document.getElementById('eco-blueprint-canvas');
  const labelsLayer = document.getElementById('eco-labels-layer');
  const quickNavBar = document.getElementById('ecoQuickNav');
  const hudCard = document.getElementById('eco-hud-card');

  if (!viewport || !canvas || !labelsLayer) {
    return;
  }

  // ============================================================================
  // 1. ESPECIFICACIÓN TOPOLÓGICA Y MÉTRICAS REALES DE SISTEMA
  // ============================================================================
  const NODES_SPEC = [
    {
      index: 0,
      id: '[SYS-00]',
      domId: 'sys-archangel',
      name: 'ARCHANGEL',
      badge: 'Insignia: Física de Software',
      theme: 'cyan',
      pos: new THREE.Vector3(0.00, 2.05, 0.40),
      desc: 'Motor de análisis estático que trata el software como un sistema físico: entropía de Shannon, mecánica de fractura de Griffith, número de Reynolds y estructuras disipativas de Prigogine aplicadas al código.',
      metrics: [
        { label: 'ENTROPY_BUDGET', val: '0.042 J/K' },
        { label: 'ANALYZERS_DAG', val: '78 MOTORES' },
        { label: 'CORRELATOR_FILES', val: '36 ARCHIVOS' },
        { label: 'INTERFACES_BUS', val: '6 CLIENTES' }
      ]
    },
    {
      index: 1,
      id: '[SYS-01]',
      domId: 'sys-exarkon',
      name: 'EXARKON',
      badge: 'Cerebro: IA Soberana',
      theme: 'violet',
      pos: new THREE.Vector3(-2.85, 0.45, -0.45),
      desc: 'Entorno de IA soberano 100% en local. «Razón sobre Proceso. Conciencia sobre Código.» Todo código generado corre primero en un sandbox de 7 capas con mitigación de calor en GPU.',
      metrics: [
        { label: 'SANDBOX_LAYERS', val: '7 CAPAS' },
        { label: 'DANGER_SCORE', val: '0 - 100 PTS' },
        { label: 'AIRGAP_POLICY', val: 'ENFORCED' },
        { label: 'VRAM_PACKING', val: 'GPU MODESTA' }
      ]
    },
    {
      index: 2,
      id: '[SYS-02]',
      domId: 'sys-eidolon',
      name: 'EIDOLON',
      badge: 'Cognición: Memoria Ebbinghaus',
      theme: 'cyan',
      pos: new THREE.Vector3(2.85, 0.65, -0.25),
      desc: 'Motor de simulación cognitiva para entidades sintéticas persistentes. Memoria con curva de olvido de Ebbinghaus R(t)=exp(-t/S), inercia emocional real y cortafuegos canónico de 3 capas.',
      metrics: [
        { label: 'RETENTION_R(t)', val: 'Ebbinghaus' },
        { label: 'CANON_FIREWALL', val: '3 CAPAS' },
        { label: 'VRAM_ALLOC', val: 'Bin-Packing' },
        { label: 'PERSISTENCE', val: '100% LOCAL' }
      ]
    },
    {
      index: 3,
      id: '[SYS-03]',
      domId: 'sys-ark',
      name: 'A.R.K.',
      badge: 'Privacidad: Navegador Aislado',
      theme: 'violet',
      pos: new THREE.Vector3(-1.90, -1.75, 1.85),
      desc: 'Navegador de privacidad estricta: bloquea telemetría y trackers en capa de red, congela pestañas inactivas a disco (100+ pestañas, <500MB RAM) y firma sesiones con Ed25519.',
      metrics: [
        { label: 'RAM_PER_100TABS', val: '< 500 MB' },
        { label: 'CRYPTO_SIGN', val: 'Ed25519' },
        { label: 'AUDIT_LOG', val: 'INMUTABLE' },
        { label: 'ANTI_FINGERPRINT', val: 'ACTIVE' }
      ]
    },
    {
      index: 4,
      id: '[SYS-04]',
      domId: 'sys-argos',
      name: 'A.R.G.O.S.',
      badge: 'Cartografía: Telemetría Estática',
      theme: 'amber',
      pos: new THREE.Vector3(2.05, -1.60, 1.70),
      desc: 'Motor omnisciente de cartografía arquitectónica, complejidad cognitiva SonarQube, DAG de routers y telemetría de repositorios en stdlib puro con 0 dependencias.',
      metrics: [
        { label: 'DEPENDENCIES', val: '0 KB (Stdlib)' },
        { label: 'TESTS_PASSING', val: '907 EN VERDE' },
        { label: 'EXEC_TIME', val: '1.13 SECONDS' },
        { label: 'ARCHITECTURE', val: '29 MÓDULOS' }
      ]
    },
    {
      index: 5,
      id: '[SYS-05]',
      domId: 'sys-kairos',
      name: 'KAIROS',
      badge: "Emergencias: Dead Man's Switch",
      theme: 'violet',
      pos: new THREE.Vector3(0.15, -0.85, -2.65),
      desc: 'App de asistencia en emergencias bajo degradación controlada en Flutter. Cero backend, cero cuentas; si el operador deja de responder, notifica a su red de confianza local.',
      metrics: [
        { label: 'BACKEND_REQUIRE', val: 'ZERO / 0 CTAS' },
        { label: 'DEAD_MAN_SWITCH', val: 'ARMED' },
        { label: 'CODEBASE_LINES', val: '~23.2k LOC' },
        { label: 'FAIL_STATE', val: 'DEGRADED_OK' }
      ]
    }
  ];

  // 13 Enlaces bidireccionales verificados
  const EDGES_SPEC = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 5],
    [2, 4], [2, 5],
    [3, 4], [3, 5],
    [4, 5]
  ];

  const adjacencyMap = new Map(NODES_SPEC.map((n) => [n.index, []]));
  EDGES_SPEC.forEach(([u, v], edgeIdx) => {
    adjacencyMap.get(u).push({ neighbor: v, edgeIdx });
    adjacencyMap.get(v).push({ neighbor: u, edgeIdx });
  });

  // ============================================================================
  // 2. RENDERER, CÁMARA Y CONTROLES
  // ============================================================================
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(viewport.clientWidth, viewport.clientHeight, true);
  renderer.setClearColor(0x060911, 0.95);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060911, 0.045);

  const camera = new THREE.PerspectiveCamera(
    46,
    viewport.clientWidth / viewport.clientHeight,
    0.1,
    100
  );
  const HOME_CAM_POS = new THREE.Vector3(0.0, 2.2, 9.6);
  const HOME_TARGET = new THREE.Vector3(0.0, 0.0, 0.0);
  camera.position.copy(HOME_CAM_POS);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.rotateSpeed = 0.75;
  controls.zoomSpeed = 0.9;
  controls.panSpeed = 0.75;
  controls.minDistance = 2.1;
  controls.maxDistance = 22.0;
  controls.target.copy(HOME_TARGET);

  const disposableGeometries = [];
  const disposableMaterials = [];

  const clusterGroup = new THREE.Group();
  scene.add(clusterGroup);

  // Retícula cilíndrica de suelo CAD
  const blueprintFloorGroup = new THREE.Group();
  blueprintFloorGroup.position.y = -3.1;
  scene.add(blueprintFloorGroup);

  [2.5, 4.5, 6.8].forEach((r, idx) => {
    const ringGeo = new THREE.RingGeometry(r, r + 0.025, 64);
    ringGeo.rotateX(-Math.PI * 0.5);
    disposableGeometries.push(ringGeo);

    const ringMat = new THREE.MeshBasicMaterial({
      color: idx % 2 === 0 ? 0x4DF0E0 : 0xa78bfa,
      transparent: true,
      opacity: 0.14 - idx * 0.03,
      side: THREE.DoubleSide
    });
    disposableMaterials.push(ringMat);
    blueprintFloorGroup.add(new THREE.Mesh(ringGeo, ringMat));
  });

  // ============================================================================
  // 3. CONSTRUCCIÓN DE LOS 6 NODOS HEXAGONALES
  // ============================================================================
  const NODE_RADIUS = 0.65;
  const hexOuterGeo = new THREE.CylinderGeometry(NODE_RADIUS, NODE_RADIUS, 0.28, 6, 1);
  hexOuterGeo.rotateX(Math.PI * 0.5);
  disposableGeometries.push(hexOuterGeo);

  const hexInnerGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.42, 6, 1);
  hexInnerGeo.rotateX(Math.PI * 0.5);
  disposableGeometries.push(hexInnerGeo);

  const hexEdgesGeo = new THREE.EdgesGeometry(hexOuterGeo);
  disposableGeometries.push(hexEdgesGeo);

  const haloRingGeo = new THREE.RingGeometry(0.76, 0.81, 6);
  disposableGeometries.push(haloRingGeo);

  const nodeObjects = [];
  const pickableMeshes = [];

  NODES_SPEC.forEach((spec) => {
    const nodeAnchor = new THREE.Group();
    nodeAnchor.position.copy(spec.pos);
    clusterGroup.add(nodeAnchor);

    const isViolet = spec.theme === 'violet';
    const primaryColor = new THREE.Color(isViolet ? 0xa78bfa : 0x4DF0E0);
    const secondaryColor = new THREE.Color(isViolet ? 0x4DF0E0 : 0xa78bfa);

    const nodeUniforms = {
      uTime: { value: 0 },
      uHighlight: { value: 0.0 },
      uPrimaryColor: { value: primaryColor },
      uSecondaryColor: { value: secondaryColor }
    };

    const hexMaterial = new THREE.ShaderMaterial({
      uniforms: nodeUniforms,
      transparent: true,
      depthWrite: true,
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying vec3 vLocalPos;

        void main() {
          vLocalPos = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform float uHighlight;
        uniform vec3 uPrimaryColor;
        uniform vec3 uSecondaryColor;

        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying vec3 vLocalPos;

        void main() {
          vec3 n = normalize(vNormal);
          vec3 v = normalize(vViewPos);
          float fresnel = pow(1.0 - abs(dot(n, v)), 2.2);

          float radialDist = length(vLocalPos.xy);
          float hexRings = smoothstep(0.88, 0.96, abs(sin(radialDist * 28.0 - uTime * 2.2)));
          float scanWave = 0.5 + 0.5 * sin(vLocalPos.y * 12.0 + uTime * 3.5);

          vec3 baseAbyss = vec3(0.024, 0.045, 0.085);
          vec3 glowColor = mix(uPrimaryColor, uSecondaryColor, scanWave * 0.35);

          float intensity = 0.35 + fresnel * 1.15 + hexRings * 0.35 + uHighlight * 0.95;
          vec3 finalCol = mix(baseAbyss, glowColor, clamp(intensity * 0.65, 0.0, 1.0));
          finalCol += glowColor * uHighlight * 0.45;

          float alpha = clamp(0.76 + fresnel * 0.22 + uHighlight * 0.2, 0.0, 0.98);
          gl_FragColor = vec4(finalCol, alpha);
        }
      `
    });
    disposableMaterials.push(hexMaterial);

    const outerHexMesh = new THREE.Mesh(hexOuterGeo, hexMaterial);
    outerHexMesh.userData.nodeIndex = spec.index;
    nodeAnchor.add(outerHexMesh);
    pickableMeshes.push(outerHexMesh);

    const innerMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    disposableMaterials.push(innerMat);
    const innerHexMesh = new THREE.Mesh(hexInnerGeo, innerMat);
    nodeAnchor.add(innerHexMesh);

    const edgeMat = new THREE.LineBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.92
    });
    disposableMaterials.push(edgeMat);
    const wireframeLines = new THREE.LineSegments(hexEdgesGeo, edgeMat);
    outerHexMesh.add(wireframeLines);

    const haloMat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });
    disposableMaterials.push(haloMat);
    const haloMesh = new THREE.Mesh(haloRingGeo, haloMat);
    nodeAnchor.add(haloMesh);

    // Etiqueta DOM proyectada por GPU
    const labelEl = document.createElement('div');
    labelEl.className = `eco-node-label ${isViolet ? 'violet-theme' : ''}`;
    labelEl.innerHTML = `
      <span class="label-sys">${spec.id}</span>
      <span class="label-name">${spec.name}</span>
      <span class="label-role">${spec.badge}</span>
    `;
    labelEl.addEventListener('click', (ev) => {
      ev.stopPropagation();
      selectNode(spec.index);
    });
    labelEl.addEventListener('pointerenter', () => setHoveredNode(spec.index));
    labelEl.addEventListener('pointerleave', () => {
      if (hoveredNodeIndex === spec.index) setHoveredNode(-1);
    });
    labelsLayer.appendChild(labelEl);

    // Botón en la barra de acceso rápido
    let pillBtn = null;
    if (quickNavBar) {
      pillBtn = document.createElement('button');
      pillBtn.type = 'button';
      pillBtn.className = 'eco-nav-pill';
      pillBtn.textContent = `${spec.id} ${spec.name}`;
      pillBtn.addEventListener('click', () => selectNode(spec.index));
      quickNavBar.appendChild(pillBtn);
    }

    nodeObjects.push({
      spec,
      anchor: nodeAnchor,
      outerHexMesh,
      innerHexMesh,
      haloMesh,
      uniforms: nodeUniforms,
      edgeMat,
      haloMat,
      labelEl,
      pillBtn,
      currentHighlight: 0.0
    });
  });

  // ============================================================================
  // 4. ENLACES VECTORIALES Y PAQUETES EN SHADER (1 DRAW CALL)
  // ============================================================================
  const edgeCount = EDGES_SPEC.length;
  const linePositions = new Float32Array(edgeCount * 2 * 3);
  const lineEdgeIndices = new Float32Array(edgeCount * 2);
  const lineProgress = new Float32Array(edgeCount * 2);

  EDGES_SPEC.forEach(([u, v], idx) => {
    const pA = NODES_SPEC[u].pos;
    const pB = NODES_SPEC[v].pos;
    const i6 = idx * 6;

    linePositions[i6 + 0] = pA.x;
    linePositions[i6 + 1] = pA.y;
    linePositions[i6 + 2] = pA.z;
    linePositions[i6 + 3] = pB.x;
    linePositions[i6 + 4] = pB.y;
    linePositions[i6 + 5] = pB.z;

    lineEdgeIndices[idx * 2 + 0] = idx;
    lineEdgeIndices[idx * 2 + 1] = idx;

    lineProgress[idx * 2 + 0] = 0.0;
    lineProgress[idx * 2 + 1] = 1.0;
  });

  const linksGeometry = new THREE.BufferGeometry();
  linksGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  linksGeometry.setAttribute('aEdgeIdx', new THREE.BufferAttribute(lineEdgeIndices, 1));
  linksGeometry.setAttribute('aLineT', new THREE.BufferAttribute(lineProgress, 1));
  disposableGeometries.push(linksGeometry);

  const edgeActiveArray = new Float32Array(edgeCount).fill(0.0);

  const linksUniforms = {
    uTime: { value: 0 },
    uColorCyan: { value: new THREE.Color(0x4DF0E0) },
    uColorViolet: { value: new THREE.Color(0xa78bfa) },
    uEdgeActive: { value: edgeActiveArray }
  };

  const linksMaterial = new THREE.ShaderMaterial({
    uniforms: linksUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute float aEdgeIdx;
      attribute float aLineT;
      uniform float uEdgeActive[13];
      varying float vActive;
      varying float vLineT;
      varying float vEdgeIdx;

      void main() {
        int idx = int(aEdgeIdx + 0.5);
        vActive = uEdgeActive[idx];
        vLineT = aLineT;
        vEdgeIdx = aEdgeIdx;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform vec3 uColorCyan;
      uniform vec3 uColorViolet;
      varying float vActive;
      varying float vLineT;
      varying float vEdgeIdx;

      void main() {
        float carrier = 0.5 + 0.5 * sin(vLineT * 25.1327 - uTime * 3.2 + vEdgeIdx);
        vec3 col = mix(uColorCyan, uColorViolet, 0.5 + 0.5 * sin(vEdgeIdx * 1.7 + vLineT * 3.14));
        float alpha = 0.24 + 0.16 * carrier + vActive * 0.55;
        gl_FragColor = vec4(col * (1.0 + vActive * 0.8), clamp(alpha, 0.0, 1.0));
      }
    `
  });
  disposableMaterials.push(linksMaterial);

  const linksMesh = new THREE.LineSegments(linksGeometry, linksMaterial);
  clusterGroup.add(linksMesh);

  // Paquetes ópticos pulsantes (104 instancias en 1 draw call)
  const PACKETS_PER_EDGE = 8;
  const TOTAL_PACKETS = edgeCount * PACKETS_PER_EDGE;

  const pktStart = new Float32Array(TOTAL_PACKETS * 3);
  const pktEnd = new Float32Array(TOTAL_PACKETS * 3);
  const pktParams = new Float32Array(TOTAL_PACKETS * 4);

  let pktCursor = 0;
  EDGES_SPEC.forEach(([u, v], edgeIdx) => {
    const pA = NODES_SPEC[u].pos;
    const pB = NODES_SPEC[v].pos;

    for (let k = 0; k < PACKETS_PER_EDGE; k++) {
      const forward = k % 2 === 0;
      const src = forward ? pA : pB;
      const dst = forward ? pB : pA;

      const i3 = pktCursor * 3;
      const i4 = pktCursor * 4;

      pktStart[i3 + 0] = src.x;
      pktStart[i3 + 1] = src.y;
      pktStart[i3 + 2] = src.z;

      pktEnd[i3 + 0] = dst.x;
      pktEnd[i3 + 1] = dst.y;
      pktEnd[i3 + 2] = dst.z;

      pktParams[i4 + 0] = 0.22 + (k * 0.045) + ((edgeIdx % 3) * 0.03);
      pktParams[i4 + 1] = k / PACKETS_PER_EDGE;
      pktParams[i4 + 2] = edgeIdx;
      pktParams[i4 + 3] = k % 2;

      pktCursor++;
    }
  });

  const packetsGeometry = new THREE.BufferGeometry();
  packetsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TOTAL_PACKETS * 3), 3));
  packetsGeometry.setAttribute('aStart', new THREE.BufferAttribute(pktStart, 3));
  packetsGeometry.setAttribute('aEnd', new THREE.BufferAttribute(pktEnd, 3));
  packetsGeometry.setAttribute('aParams', new THREE.BufferAttribute(pktParams, 4));
  disposableGeometries.push(packetsGeometry);

  const packetsUniforms = {
    uTime: { value: 0 },
    uDpr: { value: Math.min(window.devicePixelRatio || 1, 2) },
    uColorCyan: { value: new THREE.Color(0x4DF0E0) },
    uColorViolet: { value: new THREE.Color(0xa78bfa) },
    uEdgeActive: { value: edgeActiveArray }
  };

  const packetsMaterial = new THREE.ShaderMaterial({
    uniforms: packetsUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute vec3 aStart;
      attribute vec3 aEnd;
      attribute vec4 aParams;

      uniform float uTime;
      uniform float uDpr;
      uniform float uEdgeActive[13];

      varying float vColorMix;
      varying float vPulse;
      varying float vEdgeBoost;

      void main() {
        float speed = aParams.x;
        float phase = aParams.y;
        int edgeIdx = int(aParams.z + 0.5);
        vColorMix = aParams.w;

        float boost = uEdgeActive[edgeIdx];
        vEdgeBoost = boost;

        float t = fract(uTime * speed * (1.0 + boost * 0.65) + phase);
        vPulse = smoothstep(0.04, 0.18, t) * (1.0 - smoothstep(0.82, 0.96, t));

        vec3 pos = mix(aStart, aEnd, t);
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float baseSize = (9.5 + boost * 6.5) * uDpr;
        gl_PointSize = baseSize * (4.5 / max(-mvPosition.z, 1.2));
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColorCyan;
      uniform vec3 uColorViolet;
      varying float vColorMix;
      varying float vPulse;
      varying float vEdgeBoost;

      void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float r2 = dot(uv, uv);
        if (r2 > 1.0) discard;

        float core = exp(-r2 * 3.8);
        vec3 col = mix(uColorCyan, uColorViolet, vColorMix);
        col = mix(col, vec3(1.0), core * 0.55);

        float alpha = core * vPulse * (0.75 + vEdgeBoost * 0.4);
        gl_FragColor = vec4(col * (1.3 + vEdgeBoost * 0.7), alpha);
      }
    `
  });
  disposableMaterials.push(packetsMaterial);

  const packetsPoints = new THREE.Points(packetsGeometry, packetsMaterial);
  packetsPoints.frustumCulled = false;
  clusterGroup.add(packetsPoints);

  // ============================================================================
  // 5. FSM DE CÁMARA CON ARCO RADIAL Y SINCRONIZACIÓN DOM
  // ============================================================================
  const FSM = {
    FREE_ORBIT: 'FREE_ORBIT',
    FLYING_TO_NODE: 'FLYING_TO_NODE',
    NODE_LOCKED: 'NODE_LOCKED',
    RETURNING_HOME: 'RETURNING_HOME'
  };

  let cameraState = FSM.FREE_ORBIT;
  let hoveredNodeIndex = -1;
  let selectedNodeIndex = -1;

  const flyStartPos = new THREE.Vector3();
  const flyStartTarget = new THREE.Vector3();
  const flyEndPos = new THREE.Vector3();
  const flyEndTarget = new THREE.Vector3();
  let flyProgress = 0.0;
  const FLY_DURATION = 0.88;

  const updateActiveEdgesHighlight = () => {
    edgeActiveArray.fill(0.0);
    const focusIdx = selectedNodeIndex !== -1 ? selectedNodeIndex : hoveredNodeIndex;
    if (focusIdx !== -1) {
      const inc = adjacencyMap.get(focusIdx) || [];
      inc.forEach(({ edgeIdx }) => {
        edgeActiveArray[edgeIdx] = 1.0;
      });
    }
  };

  const setHoveredNode = (idx) => {
    if (hoveredNodeIndex === idx) return;
    hoveredNodeIndex = idx;
    canvas.style.cursor = idx !== -1 ? 'pointer' : 'grab';
    updateActiveEdgesHighlight();
  };

  const computeInspectionPose = (nodeIdx, outCamPos, outTargetPos) => {
    const nodeObj = nodeObjects[nodeIdx];
    nodeObj.anchor.getWorldPosition(outTargetPos);

    const outwardDir = outTargetPos.clone().normalize();
    outwardDir.y += 0.22;
    outwardDir.normalize();

    const inspectionDistance = 3.15;
    outCamPos.copy(outTargetPos).addScaledVector(outwardDir, inspectionDistance);
  };

  const evaluateRadialArc = (start, end, alpha, outVec) => {
    const u = alpha * alpha * (3.0 - 2.0 * alpha);
    outVec.lerpVectors(start, end, u);

    const rStart = start.length();
    const rEnd = end.length();
    const rTarget = THREE.MathUtils.lerp(rStart, rEnd, u);

    const len = outVec.length();
    if (len > 0.001) {
      const radialBlend = Math.sin(u * Math.PI);
      const blendedRadius = THREE.MathUtils.lerp(len, Math.max(rTarget, 5.2), radialBlend * 0.65);
      outVec.multiplyScalar(blendedRadius / len);
    }
  };

  const populateHudCard = (spec) => {
    if (!hudCard) return;

    hudCard.classList.toggle('violet-card', spec.theme === 'violet');
    const idEl = hudCard.querySelector('.card-id');
    const nameEl = hudCard.querySelector('.card-title');
    const badgeEl = hudCard.querySelector('.card-badge');
    const descEl = hudCard.querySelector('.card-desc');
    const metricsEl = hudCard.querySelector('.metrics-grid');
    const linksEl = hudCard.querySelector('.connected-list');

    if (idEl) idEl.textContent = spec.id;
    if (nameEl) nameEl.textContent = spec.name;
    if (badgeEl) badgeEl.textContent = spec.badge;
    if (descEl) descEl.textContent = spec.desc;

    if (metricsEl) {
      metricsEl.innerHTML = spec.metrics.map((m) => `
        <div class="metric-cell">
          <div class="metric-label">${m.label}</div>
          <div class="metric-val">${m.val}</div>
        </div>
      `).join('');
    }

    if (linksEl) {
      const neighbors = adjacencyMap.get(spec.index) || [];
      linksEl.innerHTML = '';
      neighbors.forEach(({ neighbor }) => {
        const targetSpec = NODES_SPEC[neighbor];
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'conn-chip';
        chip.textContent = `${targetSpec.id} ${targetSpec.name}`;
        chip.addEventListener('click', () => selectNode(neighbor));
        linksEl.appendChild(chip);
      });
    }

    hudCard.classList.add('visible');
  };

  const syncDomCards = (selectedIdx) => {
    // Sincronizar tarjetas HTML de la página
    document.querySelectorAll('.eco-card').forEach((card) => {
      card.classList.remove('is-selected-3d');
    });

    if (selectedIdx !== -1) {
      const spec = NODES_SPEC[selectedIdx];
      const targetCard = document.getElementById(spec.domId);
      if (targetCard) {
        targetCard.classList.add('is-selected-3d');
      }
    }
  };

  const selectNode = (nodeIdx) => {
    if (nodeIdx < 0 || nodeIdx >= NODES_SPEC.length) return;
    selectedNodeIndex = nodeIdx;

    nodeObjects.forEach((obj, i) => {
      obj.labelEl.classList.toggle('is-active', i === nodeIdx);
      if (obj.pillBtn) obj.pillBtn.classList.toggle('active', i === nodeIdx);
    });

    updateActiveEdgesHighlight();
    populateHudCard(NODES_SPEC[nodeIdx]);
    syncDomCards(nodeIdx);

    flyStartPos.copy(camera.position);
    flyStartTarget.copy(controls.target);
    computeInspectionPose(nodeIdx, flyEndPos, flyEndTarget);

    flyProgress = 0.0;
    cameraState = FSM.FLYING_TO_NODE;
    controls.enabled = false;

    if (window.SGSound) window.SGSound.tick();
  };

  const resetToGlobalOrbit = () => {
    if (selectedNodeIndex === -1 && cameraState === FSM.FREE_ORBIT) return;
    selectedNodeIndex = -1;

    nodeObjects.forEach((obj) => {
      obj.labelEl.classList.remove('is-active');
      if (obj.pillBtn) obj.pillBtn.classList.remove('active');
    });

    if (hudCard) hudCard.classList.remove('visible');
    syncDomCards(-1);
    updateActiveEdgesHighlight();

    flyStartPos.copy(camera.position);
    flyStartTarget.copy(controls.target);
    flyEndPos.copy(HOME_CAM_POS);
    flyEndTarget.copy(HOME_TARGET);

    flyProgress = 0.0;
    cameraState = FSM.RETURNING_HOME;
    controls.enabled = false;
  };

  const btnReset = document.getElementById('eco-btn-reset');
  if (btnReset) btnReset.addEventListener('click', resetToGlobalOrbit);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') resetToGlobalOrbit();
  });

  // Conectar clics en las tarjetas `.eco-card` para saltar al nodo 3D
  NODES_SPEC.forEach((spec) => {
    const cardEl = document.getElementById(spec.domId);
    if (cardEl) {
      cardEl.addEventListener('click', (ev) => {
        // Evitar interceptar clics en enlaces directos
        if (ev.target.closest('a')) return;
        selectNode(spec.index);
      });
    }
  });

  // Raycasting y desambiguación drag vs click
  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  const pointerDownPos = new THREE.Vector2();
  let pointerDownTime = 0;

  const updatePointerNDC = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  const pickNodeAtCursor = () => {
    raycaster.setFromCamera(pointerNDC, camera);
    const hits = raycaster.intersectObjects(pickableMeshes, false);
    return hits.length > 0 ? (hits[0].object.userData.nodeIndex ?? -1) : -1;
  };

  canvas.addEventListener('pointermove', (e) => {
    updatePointerNDC(e.clientX, e.clientY);
    setHoveredNode(pickNodeAtCursor());
  }, { passive: true });

  canvas.addEventListener('pointerdown', (e) => {
    pointerDownPos.set(e.clientX, e.clientY);
    pointerDownTime = performance.now();
  }, { passive: true });

  canvas.addEventListener('pointerup', (e) => {
    const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    const pressDuration = performance.now() - pointerDownTime;

    if (moveDist < 6.0 && pressDuration < 320.0) {
      updatePointerNDC(e.clientX, e.clientY);
      const hitIdx = pickNodeAtCursor();
      if (hitIdx !== -1) {
        selectNode(hitIdx);
      } else if (selectedNodeIndex !== -1) {
        resetToGlobalOrbit();
      }
    }
  }, { passive: true });

  // ============================================================================
  // 6. BUCLE DE ANIMACIÓN Y PROYECCIÓN GPU
  // ============================================================================
  const tempWorldPos = new THREE.Vector3();
  const tempProjected = new THREE.Vector3();
  let elapsedTime = 0;
  let clusterSpeedGain = 1.0;
  let lastTime = performance.now();
  let rafId = null;
  let isVisibleInViewport = false;
  let isTabActive = !document.hidden;

  const tick = (now) => {
    rafId = requestAnimationFrame(tick);

    const rawDt = (now - lastTime) * 0.001;
    const dt = Math.min(Math.max(rawDt, 0.0001), 0.1);
    lastTime = now;
    elapsedTime += dt;

    const targetClusterGain = selectedNodeIndex === -1 ? 1.0 : 0.0;
    const gainAlpha = 1.0 - Math.pow(1.0 - 0.07, dt * 60.0);
    clusterSpeedGain += (targetClusterGain - clusterSpeedGain) * gainAlpha;

    clusterGroup.rotation.y += dt * 0.14 * clusterSpeedGain;
    clusterGroup.position.y = Math.sin(elapsedTime * 0.85) * 0.09 * clusterSpeedGain;
    clusterGroup.updateMatrixWorld(true);

    if (cameraState === FSM.FLYING_TO_NODE) {
      flyProgress = Math.min(1.0, flyProgress + dt / FLY_DURATION);
      computeInspectionPose(selectedNodeIndex, flyEndPos, flyEndTarget);
      evaluateRadialArc(flyStartPos, flyEndPos, flyProgress, camera.position);
      const u = flyProgress * flyProgress * (3.0 - 2.0 * flyProgress);
      controls.target.lerpVectors(flyStartTarget, flyEndTarget, u);
      camera.lookAt(controls.target);

      if (flyProgress >= 1.0) {
        cameraState = FSM.NODE_LOCKED;
        controls.enabled = true;
      }
    } else if (cameraState === FSM.RETURNING_HOME) {
      flyProgress = Math.min(1.0, flyProgress + dt / FLY_DURATION);
      evaluateRadialArc(flyStartPos, flyEndPos, flyProgress, camera.position);
      const u = flyProgress * flyProgress * (3.0 - 2.0 * flyProgress);
      controls.target.lerpVectors(flyStartTarget, flyEndTarget, u);
      camera.lookAt(controls.target);

      if (flyProgress >= 1.0) {
        cameraState = FSM.FREE_ORBIT;
        controls.enabled = true;
      }
    } else {
      controls.update();
    }

    const viewW = viewport.clientWidth;
    const viewH = viewport.clientHeight;

    for (let i = 0; i < nodeObjects.length; i++) {
      const obj = nodeObjects[i];
      obj.anchor.quaternion.copy(clusterGroup.quaternion).invert();
      obj.outerHexMesh.rotation.z = Math.sin(elapsedTime * 0.9 + i) * 0.08;
      obj.innerHexMesh.rotation.z = -elapsedTime * 0.85 + i * 0.5;
      obj.innerHexMesh.rotation.x = Math.sin(elapsedTime * 1.1 + i) * 0.35;
      obj.haloMesh.rotation.z = elapsedTime * 0.4 * (i % 2 === 0 ? 1 : -1);

      const isSelected = selectedNodeIndex === i;
      const isHovered = hoveredNodeIndex === i;
      const targetHigh = isSelected ? 1.55 : (isHovered ? 1.05 : 0.0);

      obj.currentHighlight += (targetHigh - obj.currentHighlight) * (1.0 - Math.pow(1.0 - 0.14, dt * 60.0));
      obj.uniforms.uTime.value = elapsedTime;
      obj.uniforms.uHighlight.value = obj.currentHighlight;

      const targetScale = 1.0 + obj.currentHighlight * 0.12;
      obj.outerHexMesh.scale.setScalar(targetScale);
      obj.haloMat.opacity = 0.28 + obj.currentHighlight * 0.42;

      obj.anchor.getWorldPosition(tempWorldPos);
      tempWorldPos.y += 0.86;
      tempProjected.copy(tempWorldPos).project(camera);

      if (tempProjected.z >= -1.0 && tempProjected.z <= 1.0) {
        const screenX = (tempProjected.x * 0.5 + 0.5) * viewW;
        const screenY = (-tempProjected.y * 0.5 + 0.5) * viewH;
        obj.labelEl.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0) translate(-50%, -100%)`;
        obj.labelEl.style.opacity = (selectedNodeIndex !== -1 && !isSelected) ? '0.38' : '1.0';
        obj.labelEl.style.visibility = 'visible';
      } else {
        obj.labelEl.style.visibility = 'hidden';
      }
    }

    linksUniforms.uTime.value = elapsedTime;
    packetsUniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);
  };

  const startLoop = () => {
    if (rafId === null && isVisibleInViewport && isTabActive) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  };

  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const onResize = () => {
    const w = viewport.clientWidth;
    const h = viewport.clientHeight;
    if (w === 0 || h === 0) return;

    camera.aspect = w / h;
    if (w < 640) {
      HOME_CAM_POS.set(0.0, 2.5, 12.8);
      if (cameraState === FSM.FREE_ORBIT) {
        camera.position.set(0.0, 2.5, 12.8);
      }
    } else {
      HOME_CAM_POS.set(0.0, 2.2, 9.6);
      if (cameraState === FSM.FREE_ORBIT && camera.position.z > 11.5) {
        camera.position.set(0.0, 2.2, 9.6);
      }
    }
    camera.updateProjectionMatrix();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, true);
    packetsUniforms.uDpr.value = dpr;
  };

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(viewport);

  const intersectionObserver = new IntersectionObserver((entries) => {
    isVisibleInViewport = entries[0]?.isIntersecting ?? false;
    if (isVisibleInViewport) startLoop();
    else stopLoop();
  }, { threshold: 0.05 });
  intersectionObserver.observe(viewport);

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive) startLoop();
    else stopLoop();
  });

  window.addEventListener('pagehide', () => {
    stopLoop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    controls.dispose();
    disposableGeometries.forEach((g) => g.dispose());
    disposableMaterials.forEach((m) => m.dispose());
    renderer.dispose();
  }, { once: true });
})();

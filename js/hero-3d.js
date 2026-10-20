// ============================================================================
// SINTAXIS_G // Hero 3D Engine: CERN Gyroscopic Dark-Core Reactor
// Mathematical Invariants:
// - SO(3) clearance: R_{i+1} - r_{i+1} > R_i + r_i + eps_safety
// - Budget: 320 (Core) + 2592 (6 Torus rings) + 950 (billboards) = 3862 tris (< 4000)
// - Frame-rate independent lerp: alpha(dt) = 1 - (1 - 0.05)^(60 * dt)
// - O(1) analytical ray-sphere click interaction + hardware VRAM disposal
// ============================================================================
import * as THREE from 'three';

(() => {
  'use strict';

  const canvas = document.getElementById('hero-3d-canvas');
  const heroEl = document.querySelector('.hero');
  const overdriveBtn = document.getElementById('heroOverdriveBtn');
  const reactorEl = document.getElementById('heroReactor');
  const reactorFreqEl = document.getElementById('reactorFreq');

  if (!canvas || !heroEl) {
    return;
  }

  // Allow interaction with 3D canvas
  canvas.style.pointerEvents = 'auto';

  // 1. RENDERER & PERFORMANCE SETUP
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });

  const cappedDPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(cappedDPR);
  renderer.setSize(heroEl.clientWidth, heroEl.clientHeight, true);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    heroEl.clientWidth / heroEl.clientHeight,
    0.1,
    50
  );
  const BASE_CAM_Z = 7.0;
  camera.position.set(0, 0, BASE_CAM_Z);

  const disposableGeometries = [];
  const disposableMaterials = [];

  // Group root to position reactor responsive to viewport
  const reactorRoot = new THREE.Group();
  scene.add(reactorRoot);

  const updateReactorPosition = () => {
    const w = heroEl.clientWidth;
    const h = heroEl.clientHeight;
    if (w === 0 || h === 0) return;
    const aspect = w / h;

    // Altura visible del mundo en z=0 según FOV vertical de la cámara
    const vWorldHeight = 2.0 * Math.tan((camera.fov * Math.PI) / 360) * BASE_CAM_Z;
    // Anillo exterior tiene radio ~2.65, requiere ~5.8 unidades para margen seguro
    const maxSafeScale = Math.min(1.0, vWorldHeight / 6.0);

    if (w > 1300) {
      // Pantallas ultra-anchas y zoom-out: escala adaptativa para que nunca se recorte arriba ni abajo
      const fitScale = Math.min(0.92, maxSafeScale * 0.95);
      const posX = Math.min(3.4, Math.max(2.6, aspect * 1.45));
      reactorRoot.position.set(posX, 0.08, 0.0);
      reactorRoot.scale.setScalar(fitScale);
    } else if (w > 992) {
      const fitScale = Math.min(0.84, maxSafeScale * 0.92);
      reactorRoot.position.set(2.3, 0.12, -0.2);
      reactorRoot.scale.setScalar(fitScale);
    } else if (w > 640) {
      const fitScale = Math.min(0.72, maxSafeScale * 0.88);
      reactorRoot.position.set(1.4, 0.35, -0.8);
      reactorRoot.scale.setScalar(fitScale);
    } else {
      // Móvil: centrado en fondo con escala compacta a mayor profundidad Z
      const fitScale = Math.min(0.50, maxSafeScale * 0.82);
      reactorRoot.position.set(0.0, 0.12, -2.5);
      reactorRoot.scale.setScalar(fitScale);
    }
  };
  updateReactorPosition();

  // ============================================================================
  // 2. NÚCLEO DE ENERGÍA OSCURA (320 TRIÁNGULOS)
  // ============================================================================
  const coreGeometry = new THREE.IcosahedronGeometry(1.0, 2);
  disposableGeometries.push(coreGeometry);

  const coreUniforms = {
    uTime: { value: 0 },
    uOverdrive: { value: 0 },
    uShockwave: { value: 0 },
    uColorCyan: { value: new THREE.Color(0x4DF0E0) }, // Sintaxis_G Accent
    uColorAmber: { value: new THREE.Color(0xffaa00) },
    uColorVoid: { value: new THREE.Color(0x0a0a14) }
  };

  const coreMaterial = new THREE.ShaderMaterial({
    uniforms: coreUniforms,
    vertexShader: /* glsl */`
      uniform float uTime;
      uniform float uOverdrive;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying float vDisplacement;

      float trigNoise(vec3 p, float t) {
        float n = sin(p.x * 4.0 + t * 2.2) * cos(p.y * 4.0 - t * 1.8) * sin(p.z * 4.0 + t * 2.5);
        n += 0.5 * cos(p.x * 8.0 - t * 3.5) * sin(p.y * 8.0 + t * 3.1) * cos(p.z * 8.0 - t * 2.9);
        return n * 0.666;
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        float pulseFreq = 2.0 + uOverdrive * 4.0;
        float baseBreath = sin(uTime * pulseFreq) * 0.04;
        float plasma = trigNoise(position, uTime * (1.0 + uOverdrive * 1.2));
        float disp = clamp(baseBreath + plasma * (0.08 + uOverdrive * 0.08), -0.16, 0.18);
        vDisplacement = disp;

        vec3 displacedPos = position + normal * disp;
        vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform float uOverdrive;
      uniform float uShockwave;
      uniform vec3 uColorCyan;
      uniform vec3 uColorAmber;
      uniform vec3 uColorVoid;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying float vDisplacement;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.6);
        float fissure = smoothstep(0.01, 0.12, vDisplacement + 0.04);
        float scanline = smoothstep(0.92, 0.98, abs(sin(vViewPosition.y * 18.0 - uTime * 4.0)));

        vec3 col = uColorVoid;
        col = mix(col, uColorAmber, fissure * (0.65 + uOverdrive * 0.6));
        col += uColorCyan * fresnel * (0.9 + uOverdrive * 0.8);
        col += mix(uColorCyan, uColorAmber, uOverdrive) * scanline * 0.25;

        float flash = exp(-uShockwave * 4.5) * step(0.001, uShockwave);
        col += mix(uColorAmber, uColorCyan, 0.5) * flash * 0.9;

        gl_FragColor = vec4(col, 0.95);
      }
    `
  });
  disposableMaterials.push(coreMaterial);

  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  reactorRoot.add(coreMesh);

  // Esfera analítica para Raycasting O(1)
  const coreHitSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1.25);

  // ============================================================================
  // 3. 6 ANILLOS GIROSCÓPICOS CONCÉNTRICOS (2,592 TRIÁNGULOS TOTAL)
  // ============================================================================
  const ringRadii = [1.45, 1.61, 1.77, 1.93, 2.09, 2.25];
  const eulerOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
  const ringsGroup = new THREE.Group();
  reactorRoot.add(ringsGroup);

  const ringUniforms = {
    uTime: { value: 0 },
    uOverdrive: { value: 0 },
    uColorCyan: { value: new THREE.Color(0x4DF0E0) },
    uColorAmber: { value: new THREE.Color(0xffaa00) }
  };

  const ringMaterial = new THREE.ShaderMaterial({
    uniforms: ringUniforms,
    vertexShader: /* glsl */`
      attribute float aRingIndex;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPos;
      varying float vRingId;

      void main() {
        vUv = uv;
        vRingId = aRingIndex;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform float uOverdrive;
      uniform vec3 uColorCyan;
      uniform vec3 uColorAmber;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPos;
      varying float vRingId;

      void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vViewPos);
        vec3 l1 = normalize(vec3(1.0, 1.2, 1.5));
        vec3 l2 = normalize(vec3(-1.2, -0.8, 0.8));

        vec3 h1 = normalize(l1 + v);
        vec3 h2 = normalize(l2 + v);
        float spec1 = pow(max(dot(n, h1), 0.0), 42.0);
        float spec2 = pow(max(dot(n, h2), 0.0), 24.0);
        float diff = max(dot(n, l1), 0.0) * 0.5 + 0.5;

        vec3 baseMetal = vec3(0.06, 0.08, 0.12) * diff;
        baseMetal += vec3(0.28, 0.36, 0.45) * spec1 * 0.7;
        baseMetal += uColorCyan * spec2 * 0.18;

        float ticksMajor = smoothstep(0.92, 0.97, abs(sin(vUv.x * 3.14159265 * 36.0)));
        float ticksBand  = step(0.32, vUv.y) * step(vUv.y, 0.68);
        float centerLine = smoothstep(0.035, 0.008, abs(vUv.y - 0.5));
        float dualRail   = smoothstep(0.025, 0.006, abs(abs(vUv.y - 0.5) - 0.24));
        float dataPulse = smoothstep(0.65, 0.99, sin(vUv.x * 6.2831853 * 3.0 - uTime * (1.8 + vRingId * 0.35) * (1.0 + uOverdrive)));

        float laserMask = max(centerLine * 0.75, max(dualRail * 0.5, ticksMajor * ticksBand * 0.85));
        float parity = mod(vRingId, 2.0);
        vec3 laserColor = mix(uColorCyan, uColorAmber, clamp(parity * 0.65 + uOverdrive * 0.5, 0.0, 1.0));

        vec3 finalColor = baseMetal + laserColor * laserMask * (0.45 + 0.85 * dataPulse + uOverdrive * 0.6);
        gl_FragColor = vec4(finalColor, 0.95);
      }
    `
  });
  disposableMaterials.push(ringMaterial);

  const ringsData = [];
  ringRadii.forEach((radius, idx) => {
    const ringGeo = new THREE.TorusGeometry(radius, 0.04, 6, 36);
    const vertexCount = ringGeo.attributes.position.count;
    const ringIndexAttr = new Float32Array(vertexCount).fill(idx);
    ringGeo.setAttribute('aRingIndex', new THREE.BufferAttribute(ringIndexAttr, 1));
    disposableGeometries.push(ringGeo);

    const mesh = new THREE.Mesh(ringGeo, ringMaterial);
    mesh.rotation.order = eulerOrders[idx];
    mesh.rotation.set(
      (idx * 0.52) % Math.PI,
      (idx * 1.05) % Math.PI,
      (idx * 0.78) % Math.PI
    );

    const sign = idx % 2 === 0 ? 1 : -1;
    const angularVel = new THREE.Vector3(
      sign * (0.18 + idx * 0.031),
      -sign * (0.24 - idx * 0.019),
      sign * (0.11 + (5 - idx) * 0.023)
    );

    ringsGroup.add(mesh);
    ringsData.push({ mesh, angularVel });
  });

  // ============================================================================
  // 4. CORONA Y ONDA DE CHOQUE (950 INSTANCIAS DE 1 TRIÁNGULO)
  // ============================================================================
  const PARTICLE_COUNT = 950;
  const singleTriGeo = new THREE.BufferGeometry();
  const triVertices = new Float32Array([
     0.0,    0.056, 0.0,
    -0.0485, -0.028, 0.0,
     0.0485, -0.028, 0.0
  ]);
  const triUvs = new Float32Array([
    0.5, 1.0,
    0.0, 0.0,
    1.0, 0.0
  ]);
  singleTriGeo.setAttribute('position', new THREE.BufferAttribute(triVertices, 3));
  singleTriGeo.setAttribute('uv', new THREE.BufferAttribute(triUvs, 2));
  disposableGeometries.push(singleTriGeo);

  const instancedParticlesGeo = new THREE.InstancedBufferGeometry();
  instancedParticlesGeo.instanceCount = PARTICLE_COUNT;
  instancedParticlesGeo.setAttribute('position', singleTriGeo.attributes.position);
  instancedParticlesGeo.setAttribute('uv', singleTriGeo.attributes.uv);
  disposableGeometries.push(instancedParticlesGeo);

  const aSeedRadius = new Float32Array(PARTICLE_COUNT);
  const aSeedTheta = new Float32Array(PARTICLE_COUNT);
  const aSeedPhi = new Float32Array(PARTICLE_COUNT);
  const aSpeedPhase = new Float32Array(PARTICLE_COUNT * 2);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    aSeedRadius[i] = 1.35 + Math.pow(Math.random(), 1.7) * 2.8;
    aSeedTheta[i] = Math.random() * Math.PI * 2.0;
    aSeedPhi[i] = Math.acos(2.0 * Math.random() - 1.0);
    aSpeedPhase[i * 2 + 0] = 0.25 + Math.random() * 0.75;
    aSpeedPhase[i * 2 + 1] = Math.random() * Math.PI * 2.0;
  }

  instancedParticlesGeo.setAttribute('aSeedRadius', new THREE.InstancedBufferAttribute(aSeedRadius, 1));
  instancedParticlesGeo.setAttribute('aSeedTheta', new THREE.InstancedBufferAttribute(aSeedTheta, 1));
  instancedParticlesGeo.setAttribute('aSeedPhi', new THREE.InstancedBufferAttribute(aSeedPhi, 1));
  instancedParticlesGeo.setAttribute('aSpeedPhase', new THREE.InstancedBufferAttribute(aSpeedPhase, 2));

  const particleUniforms = {
    uTime: { value: 0 },
    uOverdrive: { value: 0 },
    uShockwave: { value: 0 },
    uShockwaveFront: { value: -1.0 },
    uColorCyan: { value: new THREE.Color(0x4DF0E0) },
    uColorAmber: { value: new THREE.Color(0xffaa00) }
  };

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: particleUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute float aSeedRadius;
      attribute float aSeedTheta;
      attribute float aSeedPhi;
      attribute vec2 aSpeedPhase;

      uniform float uTime;
      uniform float uOverdrive;
      uniform float uShockwave;
      uniform float uShockwaveFront;

      varying vec2 vUv;
      varying float vEnergy;
      varying float vDistRatio;

      void main() {
        vUv = uv;

        float speed = aSpeedPhase.x * (1.0 + uOverdrive * 1.8);
        float phase = aSpeedPhase.y;

        float theta = aSeedTheta + uTime * 0.25 * speed;
        float phi = aSeedPhi + sin(uTime * 0.4 * speed + phase) * 0.2;
        float r = aSeedRadius;

        float distToFront = abs(r - uShockwaveFront);
        float waveHit = smoothstep(0.45, 0.0, distToFront) * step(0.0, uShockwaveFront);
        r += waveHit * 0.45 * exp(-uShockwave * 2.0);

        vec3 orbitalPos = vec3(
          r * sin(phi) * cos(theta),
          r * cos(phi),
          r * sin(phi) * sin(theta)
        );

        vec4 centerView = modelViewMatrix * vec4(orbitalPos, 1.0);
        float pScale = 0.045 + waveHit * 0.065 + uOverdrive * 0.035;
        vec3 billboardPos = centerView.xyz + position * pScale * (12.0 / -centerView.z);

        vEnergy = waveHit * 2.0 + uOverdrive;
        vDistRatio = clamp((r - 1.35) / 2.8, 0.0, 1.0);

        gl_Position = projectionMatrix * vec4(billboardPos, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColorCyan;
      uniform vec3 uColorAmber;
      varying vec2 vUv;
      varying float vEnergy;
      varying float vDistRatio;

      void main() {
        vec2 p = vUv - vec2(0.5, 0.333);
        float distSq = dot(p, p);
        if (distSq > 0.22) discard;

        float alpha = smoothstep(0.22, 0.0, distSq);
        vec3 col = mix(uColorCyan, uColorAmber, clamp(vDistRatio + vEnergy * 0.4, 0.0, 1.0));
        col += vec3(1.0) * smoothstep(0.06, 0.0, distSq) * 0.85;

        gl_FragColor = vec4(col, alpha * (0.65 + vEnergy * 0.35));
      }
    `
  });
  disposableMaterials.push(particleMaterial);

  const particlesMesh = new THREE.Mesh(instancedParticlesGeo, particleMaterial);
  particlesMesh.frustumCulled = false;
  reactorRoot.add(particlesMesh);

  // ============================================================================
  // 5. CINEMÁTICA Y SINCRONIZACIÓN DE INTERACCIÓN
  // ============================================================================
  let isPointerDown = false;
  let overdriveParam = 0.0;
  let shockwaveTimer = 0.0;
  let shockwaveFront = -1.0;
  let angularGain = 1.0;

  const targetRotation = new THREE.Vector2(0, 0);
  const currentRotation = new THREE.Vector2(0, 0);

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();

  const triggerGravitationalPulse = () => {
    shockwaveTimer = 0.001;
    shockwaveFront = 1.0;
    angularGain = 3.2;

    if (window.repelHeroParticles) {
      const rect = canvas.getBoundingClientRect();
      window.repelHeroParticles(rect.left + rect.width * 0.7, rect.top + rect.height * 0.5, 16);
    }
    if (window.SGSound) {
      window.SGSound.pulse();
    }
  };

  // Expose global hook for external buttons
  window.triggerReactorShockwave = triggerGravitationalPulse;

  // Interacción pointermove sobre el hero
  const onPointerMove = (e) => {
    const rect = heroEl.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    pointerNDC.set(nx, ny);

    targetRotation.x = ny * 0.28;
    targetRotation.y = nx * 0.42;
  };

  // Clic en el canvas del hero (analítico ray-sphere contra el reactor)
  const onPointerDown = (e) => {
    isPointerDown = true;
    raycaster.setFromCamera(pointerNDC, camera);

    // Transformar ray al espacio local del reactor
    const localRay = raycaster.ray.clone();
    reactorRoot.worldToLocal(localRay.origin);
    const m = new THREE.Matrix4().extractRotation(reactorRoot.matrixWorld).invert();
    localRay.direction.applyMatrix4(m);

    if (localRay.intersectsSphere(coreHitSphere)) {
      triggerGravitationalPulse();
    }
  };

  const onPointerUp = () => {
    isPointerDown = false;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });

  // Sincronización con #heroOverdriveBtn y #heroReactor existentes
  if (overdriveBtn) {
    overdriveBtn.addEventListener('click', () => {
      triggerGravitationalPulse();
    });
  }
  if (reactorEl) {
    reactorEl.addEventListener('click', () => {
      triggerGravitationalPulse();
    });
  }

  // ============================================================================
  // 6. BUCLE DE RENDER CON PAUSA POR VISIBILIDAD (IntersectionObserver)
  // ============================================================================
  let isVisibleInViewport = true;
  let isTabActive = !document.hidden;
  let rafId = null;
  let lastTime = performance.now();
  let totalTime = 0.0;

  const tick = (now) => {
    rafId = requestAnimationFrame(tick);

    const rawDelta = (now - lastTime) * 0.001;
    const dt = Math.min(Math.max(rawDelta, 0.0001), 0.1);
    lastTime = now;
    totalTime += dt;

    // Decay exponencial desacoplado de framerate
    const lerpAlpha = 1.0 - Math.pow(1.0 - 0.05, dt * 60.0);
    currentRotation.x += (targetRotation.x - currentRotation.x) * lerpAlpha;
    currentRotation.y += (targetRotation.y - currentRotation.y) * lerpAlpha;

    reactorRoot.rotation.x = currentRotation.x;
    reactorRoot.rotation.y = currentRotation.y;

    // Control de Sobrecarga (Overdrive)
    const isGlobalOverdrive = overdriveBtn && overdriveBtn.classList.contains('is-active');
    const targetOverdrive = (isPointerDown || isGlobalOverdrive) ? 1.0 : 0.0;
    overdriveParam += (targetOverdrive - overdriveParam) * (1.0 - Math.pow(1.0 - 0.08, dt * 60.0));

    // Descompresión de ganancia angular hacia 1.0x
    angularGain += (1.0 - angularGain) * (1.0 - Math.pow(1.0 - 0.04, dt * 60.0));

    // Propagación de onda de choque
    if (shockwaveTimer > 0.0) {
      shockwaveTimer += dt;
      shockwaveFront += dt * 4.8;
      if (shockwaveTimer > 1.4) {
        shockwaveTimer = 0.0;
        shockwaveFront = -1.0;
      }
    }

    // Actualización de uniforms
    coreUniforms.uTime.value = totalTime;
    coreUniforms.uOverdrive.value = overdriveParam;
    coreUniforms.uShockwave.value = shockwaveTimer;

    ringUniforms.uTime.value = totalTime;
    ringUniforms.uOverdrive.value = overdriveParam;

    particleUniforms.uTime.value = totalTime;
    particleUniforms.uOverdrive.value = overdriveParam;
    particleUniforms.uShockwave.value = shockwaveTimer;
    particleUniforms.uShockwaveFront.value = shockwaveFront;

    // Cinemática de Euler de los 6 anillos giroscópicos
    const speedMultiplier = (1.0 + overdriveParam * 2.2) * angularGain;
    ringsData.forEach(({ mesh, angularVel }) => {
      mesh.rotation.x += angularVel.x * dt * speedMultiplier;
      mesh.rotation.y += angularVel.y * dt * speedMultiplier;
      mesh.rotation.z += angularVel.z * dt * speedMultiplier;
    });

    coreMesh.rotation.y += 0.35 * dt * speedMultiplier;

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

  // Resize handling
  const handleResize = () => {
    const w = heroEl.clientWidth;
    const h = heroEl.clientHeight;
    if (w === 0 || h === 0) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, true);
    updateReactorPosition();
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(heroEl);

  // IntersectionObserver: apaga el loop cuando el usuario scrollea hacia abajo
  const intersectionObserver = new IntersectionObserver((entries) => {
    isVisibleInViewport = entries[0]?.isIntersecting ?? true;
    if (isVisibleInViewport) startLoop();
    else stopLoop();
  }, { threshold: 0.02 });
  intersectionObserver.observe(heroEl);

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    if (isTabActive) startLoop();
    else stopLoop();
  });

  window.addEventListener('pagehide', () => {
    stopLoop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    disposableGeometries.forEach((g) => g.dispose());
    disposableMaterials.forEach((m) => m.dispose());
    renderer.dispose();
  }, { once: true });

  startLoop();
})();

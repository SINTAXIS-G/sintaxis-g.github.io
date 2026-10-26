// ============================================================
// SINTAXIS G — ARCHANGEL Ω Tactical Engineering FX Suite
// Módulo de hiper-interactividad táctica para archangel.html:
// 1. Hero Command Dock & Overdrive WebGL Shockwave
// 2. Griffith Stress Field Heatmap Canvas & Audio-visual Fracture
// 3. CascadeAnalyzer Wave Blast Ripples & Audio Synthesis
// 4. AQL Live Interactive Query Runner
// 5. Interactive Health Score Recalibrator & Smell Diagnosis
// 6. Rust vs Python Warp Race Re-runner
// 7. Taint Path Interactive Forensic Stepper
// 8. Chandrasekhar Accretion Disk & Gravitational Implosion FX
// 9. Plan Calculator Live Reactive Feedback
// 10. Quantum Scramble on Physics Formulas & Headings
// 11. Tactical Radar Card Scan Sweeps
// ============================================================

(function () {
  'use strict';

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Helper de sonido seguro
  const playSound = (name) => {
    if (window.SGSound && typeof window.SGSound[name] === 'function') {
      try { window.SGSound[name](); } catch (e) {}
    }
  };

  // ============================================================
  // 1. HERO COMMAND DOCK & OVERDRIVE SHOCKWAVE
  // ============================================================
  (function initHeroDock() {
    const overdriveBtn = document.getElementById('archangelOverdriveBtn');
    const heroShader = document.getElementById('archangel-hero-shader');
    const emblem = document.querySelector('.proj-logo');

    if (overdriveBtn) {
      let overdrive = false;
      overdriveBtn.addEventListener('click', () => {
        overdrive = !overdrive;
        overdriveBtn.classList.toggle('is-active', overdrive);
        overdriveBtn.setAttribute('aria-pressed', String(overdrive));
        playSound(overdrive ? 'laser' : 'click');

        if (heroShader) {
          heroShader.style.filter = overdrive
            ? 'brightness(1.8) contrast(1.3) drop-shadow(0 0 25px rgba(77,240,224,0.6))'
            : '';
        }

        const label = overdriveBtn.querySelector('.btn-label');
        if (label) label.textContent = overdrive ? 'SOBRECARGA ACTIVA' : 'SOBRECARGA';

        // Pulso de onda en el hero
        const hero = document.querySelector('.proj-hero');
        if (hero) {
          hero.classList.add('hero-shockwave');
          setTimeout(() => hero.classList.remove('hero-shockwave'), 800);
        }
      });
    }

    // Logo interactivo con retículo
    if (emblem) {
      emblem.addEventListener('mouseenter', () => playSound('hover'));
      emblem.addEventListener('click', () => {
        playSound('pulse');
        emblem.classList.add('emblem-burst');
        setTimeout(() => emblem.classList.remove('emblem-burst'), 600);
      });
    }
  })();

  // ============================================================
  // 2. GRIFFITH STRESS FIELD HEATMAP & AUDIO-VISUAL FRACTURE
  // ============================================================
  (function initGriffithHeatmap() {
    const gdRoot = document.getElementById('griffith-demo');
    if (!gdRoot) return;

    // Crear canvas dinámico de mapa de tensiones detrás del SVG si no existe
    let canvas = document.getElementById('gd-stress-canvas');
    const svg = document.getElementById('gd-svg');
    if (!canvas && svg) {
      canvas = document.createElement('canvas');
      canvas.id = 'gd-stress-canvas';
      canvas.className = 'griffith-stress-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      svg.parentElement.insertBefore(canvas, svg);
    }

    const aInput = document.getElementById('gd-a');
    const sigmaInput = document.getElementById('gd-sigma');
    const resetBtn = document.getElementById('gd-reset');
    const verdict = document.getElementById('gd-verdict');

    if (!canvas || !aInput || !sigmaInput) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resizeCanvas() {
      const rect = svg.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawHeatmap();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawHeatmap() {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const a = parseFloat(aInput.value);
      const sigma = parseFloat(sigmaInput.value);
      const ki = sigma * Math.sqrt(Math.PI * a);
      const ratio = Math.min(ki / 12, 1.4);

      // Posición de la punta de la grieta en el canvas
      // Probeta centrada verticalmente: y = 50%
      const halfW = w / 2;
      const lengthPx = (a / 5.0) * halfW * 0.9;
      const crackTipX = halfW - lengthPx;
      const crackTipY = h / 2;

      // Campo de tensiones de von Mises en la punta (K_I / sqrt(2*pi*r))
      const radius = (35 + ratio * 60) * dpr;
      const grad = ctx.createRadialGradient(crackTipX, crackTipY, 2 * dpr, crackTipX, crackTipY, radius);

      if (ratio >= 1.0) {
        // Fractura catastrófica
        grad.addColorStop(0, 'rgba(248, 113, 113, 0.7)');
        grad.addColorStop(0.3, 'rgba(248, 113, 113, 0.45)');
        grad.addColorStop(0.7, 'rgba(251, 191, 36, 0.2)');
        grad.addColorStop(1, 'rgba(248, 113, 113, 0)');
      } else if (ratio > 0.8) {
        // Tensión crítica
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.65)');
        grad.addColorStop(0.4, 'rgba(251, 191, 36, 0.35)');
        grad.addColorStop(0.8, 'rgba(61, 218, 215, 0.15)');
        grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      } else {
        // Régimen estable
        grad.addColorStop(0, `rgba(61, 218, 215, ${0.2 + ratio * 0.35})`);
        grad.addColorStop(0.5, `rgba(61, 218, 215, ${0.1 + ratio * 0.2})`);
        grad.addColorStop(1, 'rgba(61, 218, 215, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(crackTipX, crackTipY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Isolíneas de tensión (ondas de estrés elástico)
      ctx.strokeStyle = ratio >= 1.0 ? 'rgba(248,113,113,0.5)' : 'rgba(61,218,215,0.35)';
      ctx.lineWidth = 1 * dpr;
      for (let r = 15; r < radius; r += 20 * dpr) {
        ctx.beginPath();
        ctx.arc(crackTipX, crackTipY, r, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
    }

    // Monitorear cambios en sliders con sonido y redibujado
    let lastRatio = 0;
    function onSlider() {
      drawHeatmap();
      const a = parseFloat(aInput.value);
      const sigma = parseFloat(sigmaInput.value);
      const ki = sigma * Math.sqrt(Math.PI * a);
      const ratio = ki / 12;

      if (ratio >= 1.0 && lastRatio < 1.0) {
        // ¡Impacto de fractura!
        playSound('laser');
        gdRoot.classList.add('probe-fractured');
      } else if (ratio < 1.0) {
        gdRoot.classList.remove('probe-fractured');
        if (Math.abs(ratio - lastRatio) > 0.15) playSound('tick');
      }
      lastRatio = ratio;
    }

    aInput.addEventListener('input', onSlider);
    sigmaInput.addEventListener('input', onSlider);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        playSound('click');
        gdRoot.classList.remove('probe-fractured');
        lastRatio = 0;
        setTimeout(drawHeatmap, 50);
      });
    }

    setTimeout(drawHeatmap, 100);
  })();

  // ============================================================
  // 3. CASCADE ANALYZER WAVE BLAST & RIPPLES
  // ============================================================
  (function initCascadeEffects() {
    const canvas = document.getElementById('cascade-canvas');
    if (!canvas) return;

    canvas.addEventListener('click', () => {
      playSound('sweep');
      canvas.classList.add('cascade-active-blast');
      setTimeout(() => canvas.classList.remove('cascade-active-blast'), 1200);
    });
  })();

  // ============================================================
  // 4. AQL LIVE INTERACTIVE QUERY RUNNER
  // ============================================================
  (function initAQLTerminal() {
    const term = document.getElementById('fake-terminal');
    if (!term) return;

    // Crear barra de consultas interactivas si no existe
    let chipsBar = document.getElementById('aql-query-chips');
    if (!chipsBar) {
      chipsBar = document.createElement('div');
      chipsBar.id = 'aql-query-chips';
      chipsBar.className = 'aql-query-chips';
      chipsBar.innerHTML = `
        <span class="aql-chips-label">Consultas AQL listas para ejecutar:</span>
        <button type="button" class="aql-chip is-active" data-q="chandrasekhar">Q1: Límite Chandrasekhar</button>
        <button type="button" class="aql-chip" data-q="cyclics">Q2: Ciclos en /core</button>
        <button type="button" class="aql-chip" data-q="taint">Q3: Taint SQLI Trace</button>
        <button type="button" class="aql-chip" data-q="prigogine">Q4: Estructuras Prigogine</button>
      `;
      term.parentNode.insertBefore(chipsBar, term);
    }

    const QUERIES = {
      chandrasekhar: {
        cmd: 'archangel aql "MATCH (m:Module) WHERE m.mass > ChandrasekharLimit(1.44) YIELD m.name, m.mass, m.blast_radius"',
        lines: [
          { text: '→ Optimizando AST Graph con índice MultiDimIndex 4D...', type: 'info' },
          { text: '✓ 12.919 módulos indexados en memoria local.', type: 'ok' },
          { text: '⚠ [BLACK_HOLE] core/god_object.py: masa 2.87x sobre umbral local (M_crit=1.44)', type: 'warn' },
          { text: '→ Vector de Fiedler sugiere bisección en LCOM4=3 (energía libre ΔE = -14.2 J)', type: 'info' },
          { text: '✓ 1 módulo en colapso cognitivo aislado.', type: 'ok' }
        ]
      },
      cyclics: {
        cmd: 'archangel aql "MATCH p = (a:Module)-[:IMPORTS*]->(a) WHERE a.path STARTS WITH \'/core\' YIELD p"',
        lines: [
          { text: '→ Ejecutando DFS de Tarjan con corte de ciclos cíclicos...', type: 'info' },
          { text: '✗ [CYCLIC_DEPENDENCY] auth/session.py ⇄ db/pool.py ⇄ auth/tokens.py (Ciclo de 3 nodos)', type: 'crit' },
          { text: '⚠ Prescripción generada: Inversión de dependencias vía Protocol Interface', type: 'warn' },
          { text: '✓ Generando propuesta en rama aislada: archangel/fix-cyclic-core-4892...', type: 'ok' }
        ]
      },
      taint: {
        cmd: 'archangel aql "TRACE TAINT FROM Source.HttpInput TO Sink.SqlExecute WITH Category.SQLI"',
        lines: [
          { text: '→ Resolviendo flujo de datos con Z3 SMT Theorem Prover...', type: 'info' },
          { text: '⚠ Origen: request.GET[\"user\"] (auth/login.py:1)', type: 'warn' },
          { text: '→ Propagación intra-archivo: 1 → 5 (f-string query concatenation) → 9', type: 'info' },
          { text: '✗ [CRÍTICA] db.execute(query) alcanzado sin sanitización previa.', type: 'crit' },
          { text: '✓ Sanitizador prescrito: shlex.quote() / parametrización nativa en tupla de argumentos.', type: 'ok' }
        ]
      },
      prigogine: {
        cmd: 'archangel aql "MATCH (c:Consumer) WHERE NOT c.has_circuit_breaker AND NOT c.has_dlq YIELD c"',
        lines: [
          { text: '→ Evaluando termodinámica de eventos y disipación de colas asíncronas...', type: 'info' },
          { text: '⚠ [ENTROPY_OVERLOAD] queue/worker_async.py carece de Dead-Letter Queue (DLQ)', type: 'warn' },
          { text: '→ Sistema no disipativo: en caso de fallo, la energía saturará la memoria del proceso', type: 'info' },
          { text: '✓ Auto-parche generado con Bulkhead + Exponential Backoff jittered.', type: 'ok' }
        ]
      }
    };

    const termBody = term.querySelector('.terminal-body');
    let typingTimer = null;

    function runQuery(key) {
      playSound('click');
      const q = QUERIES[key] || QUERIES.chandrasekhar;
      if (typingTimer) clearTimeout(typingTimer);

      termBody.innerHTML = `
        <div class="terminal-line"><span class="prompt">$</span> <span id="aql-live-cmd"></span><span class="terminal-cursor"></span></div>
      `;
      const cmdEl = document.getElementById('aql-live-cmd');
      const text = q.cmd;
      let charIdx = 0;

      function typeChar() {
        if (charIdx < text.length) {
          cmdEl.textContent += text[charIdx++];
          typingTimer = setTimeout(typeChar, Math.max(8, 25 - charIdx * 0.2));
        } else {
          // Remover cursor de la línea de comando
          const cursor = termBody.querySelector('.terminal-cursor');
          if (cursor) cursor.remove();
          playSound('sweep');
          printLines(q.lines, 0);
        }
      }
      typeChar();
    }

    function printLines(lines, idx) {
      if (idx >= lines.length) {
        termBody.insertAdjacentHTML('beforeend', '<div class="terminal-line"><span class="terminal-cursor"></span></div>');
        return;
      }
      const item = lines[idx];
      let badge = '';
      if (item.type === 'ok') badge = '<span class="ok">✓</span> ';
      if (item.type === 'warn') badge = '<span class="warn">⚠</span> ';
      if (item.type === 'crit') badge = '<span class="crit">✗</span> ';

      const div = document.createElement('div');
      div.className = 'terminal-line terminal-line-fade';
      div.innerHTML = `${badge}${item.text}`;
      termBody.appendChild(div);
      playSound('tick');

      typingTimer = setTimeout(() => printLines(lines, idx + 1), 160);
    }

    chipsBar.querySelectorAll('.aql-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        chipsBar.querySelectorAll('.aql-chip').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        runQuery(btn.dataset.q);
      });
    });
  })();

  // ============================================================
  // 5. INTERACTIVE HEALTH SCORE RECALIBRATOR
  // ============================================================
  (function initHealthRecalibrator() {
    const gaugeFill = document.getElementById('health-gauge-fill');
    const scoreText = document.getElementById('health-gauge-score');
    const gradeText = document.querySelector('.health-gauge-grade');
    const barsContainer = document.querySelector('.health-bars');
    if (!gaugeFill || !scoreText || !barsContainer) return;

    const bars = barsContainer.querySelectorAll('.health-bar');
    bars.forEach((bar) => {
      bar.style.cursor = 'pointer';
      bar.title = 'Haz clic o arrastra para recalibrar esta dimensión';

      bar.addEventListener('click', (e) => {
        const track = bar.querySelector('.hb-track');
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const clickRatio = Math.max(0.1, Math.min(1.0, (e.clientX - rect.left) / rect.width));
        const valPct = (clickRatio * 100).toFixed(1);

        const fill = bar.querySelector('.hb-fill');
        const val = bar.querySelector('.hb-val');
        if (fill) fill.style.setProperty('--pct', `${valPct}%`);
        if (val) val.textContent = valPct;

        playSound('tick');
        recalculateCompositeHealth();
      });
    });

    function recalculateCompositeHealth() {
      let total = 0;
      let count = 0;
      barsContainer.querySelectorAll('.hb-val').forEach((v) => {
        total += parseFloat(v.textContent) || 0;
        count++;
      });
      const avg = count ? total / count : 71.4;

      // Animar gauge SVG
      const circumference = 2 * Math.PI * 50; // r=50
      const offset = circumference * (1 - avg / 100);
      gaugeFill.style.strokeDashoffset = offset;
      scoreText.textContent = Math.round(avg);

      let grade = '[F]';
      let gradeColor = '#F87171';
      if (avg >= 90) { grade = '[A+]'; gradeColor = 'var(--accent)'; }
      else if (avg >= 80) { grade = '[A]'; gradeColor = 'var(--accent)'; }
      else if (avg >= 70) { grade = '[B]'; gradeColor = '#FBBF24'; }
      else if (avg >= 60) { grade = '[C]'; gradeColor = '#FBBF24'; }
      else if (avg >= 50) { grade = '[D]'; gradeColor = '#F87171'; }

      if (gradeText) {
        gradeText.textContent = grade;
        gradeText.style.fill = gradeColor;
      }
    }
  })();

  // ============================================================
  // 6. RUST VS PYTHON WARP RACE RE-RUNNER
  // ============================================================
  (function initRustRaceReRun() {
    const race = document.getElementById('rust-race');
    if (!race) return;

    let rerunBtn = document.getElementById('rust-race-rerun');
    if (!rerunBtn) {
      rerunBtn = document.createElement('button');
      rerunBtn.id = 'rust-race-rerun';
      rerunBtn.className = 'mode-btn rust-rerun-btn';
      rerunBtn.type = 'button';
      rerunBtn.innerHTML = '⚡ Re-ejecutar Benchmark (12.919 archivos)';
      race.parentNode.insertBefore(rerunBtn, race.nextSibling);
    }

    const fills = Array.from(race.querySelectorAll('.rust-race-fill'));
    const nums = Array.from(race.querySelectorAll('.rust-race-num'));
    const maxTarget = Math.max(...fills.map((f) => parseFloat(f.dataset.target) || 0), 1);

    rerunBtn.addEventListener('click', () => {
      playSound('sweep');
      rerunBtn.disabled = true;

      // Resetear a 0
      fills.forEach((f) => { f.style.width = '0%'; });
      nums.forEach((n) => { n.textContent = '0.0'; });

      setTimeout(() => {
        playSound('laser');
        fills.forEach((f) => {
          const target = parseFloat(f.dataset.target) || 0;
          f.style.width = `${(target / maxTarget) * 100}%`;
        });

        nums.forEach((n) => {
          const target = parseFloat(n.dataset.target) || 0;
          const start = performance.now();
          const duration = 900;
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            n.textContent = (target * eased).toFixed(1);
            if (p < 1) requestAnimationFrame(tick);
            else rerunBtn.disabled = false;
          }
          requestAnimationFrame(tick);
        });
      }, 150);
    });
  })();

  // ============================================================
  // 7. TAINT PATH INTERACTIVE FORENSIC STEPPER
  // ============================================================
  (function initTaintForensics() {
    const taintPath = document.querySelector('.taint-path');
    if (!taintPath) return;

    const hops = taintPath.querySelectorAll('.taint-hop');
    if (!hops.length) return;

    let card = document.getElementById('taint-forensic-card');
    if (!card) {
      card = document.createElement('div');
      card.id = 'taint-forensic-card';
      card.className = 'taint-forensic-card';
      card.innerHTML = `
        <div class="tfc-header">
          <span class="tfc-step">SALTO SELECCIONADO: <b id="tfc-step-num">LÍNEA 1</b></span>
          <span class="tfc-tag">ORIGEN NO CONFIABLE</span>
        </div>
        <pre class="tfc-code" id="tfc-code-body">user_id = request.GET.get("user")  # Fuente contaminada por entrada HTTP</pre>
        <p class="tfc-expl" id="tfc-expl-text">El dato ingresa directamente desde la petición web sin validación de tipo ni esquema tipado.</p>
      `;
      taintPath.parentElement.parentElement.appendChild(card);
    }

    const DETAILS = {
      '1': {
        step: 'LÍNEA 1 — ORIGEN NO CONFIABLE',
        tag: 'FUENTE PRIMARIA',
        code: 'user_id = request.GET.get("user")  # Fuente contaminada por entrada HTTP',
        expl: 'El dato ingresa directamente desde la petición web sin pasar por validación de tipo o DTO tipado.'
      },
      '5': {
        step: 'LÍNEA 5 — MUTACIÓN Y CONCATENACIÓN',
        tag: 'PROPAGACIÓN TAINT',
        code: 'query = f"SELECT * FROM users WHERE id = \'{user_id}\'"  # F-string no parametrizado',
        expl: 'La variable contaminada se inyecta en el string SQL mediante f-string, heredando la categoría SQLI sin sanitización.'
      },
      '9': {
        step: 'LÍNEA 9 — SUMIDERO CRÍTICO (SINK)',
        tag: 'PUNTO DE EJECUCIÓN',
        code: 'cursor.execute(query)  # SINK: Inyección SQL ejecutable en motor DB',
        expl: 'El sumidero crítico ejecuta el string SQL crudo. El verificador Z3 prueba que la sintaxis de escape es SAT (explotable).'
      }
    };

    hops.forEach((h) => {
      h.style.cursor = 'pointer';
      h.title = 'Haz clic para inspeccionar este salto del dato';

      h.addEventListener('click', () => {
        hops.forEach((item) => item.classList.remove('is-active'));
        h.classList.add('is-active');
        playSound('tick');

        const stepKey = h.textContent.trim();
        const data = DETAILS[stepKey] || DETAILS['1'];

        document.getElementById('tfc-step-num').textContent = data.step;
        document.querySelector('.tfc-tag').textContent = data.tag;
        document.getElementById('tfc-code-body').textContent = data.code;
        document.getElementById('tfc-expl-text').textContent = data.expl;

        card.classList.add('tfc-highlight');
        setTimeout(() => card.classList.remove('tfc-highlight'), 400);
      });
    });

    // Activar el primer hop por default
    if (hops[0]) hops[0].classList.add('is-active');
  })();

  // ============================================================
  // 8. QUANTUM SCRAMBLE EN TÍTULOS Y FÓRMULAS
  // ============================================================
  (function initFormulaScrambles() {
    if (isReduced) return;
    const targets = document.querySelectorAll('figcaption, .physics-chip, .stress-title');

    targets.forEach((el) => {
      const orig = el.textContent;
      let isScrambling = false;

      el.addEventListener('mouseenter', () => {
        if (isScrambling) return;
        isScrambling = true;
        playSound('tick');

        let iteration = 0;
        const chars = '01#&ΔσK_Iπ*λ∫';
        const timer = setInterval(() => {
          el.textContent = orig
            .split('')
            .map((char, index) => {
              if (index < iteration || char === ' ') return orig[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          if (iteration >= orig.length) {
            clearInterval(timer);
            el.textContent = orig;
            isScrambling = false;
          }
          iteration += 1 / 2;
        }, 30);
      });
    });
  })();

  // ============================================================
  // 9. CALCULADORA REACTIVA EN TIEMPO REAL
  // ============================================================
  (function initPlanCalcReactive() {
    const calcBox = document.querySelector('.calc-box');
    if (!calcBox) return;

    const inputs = calcBox.querySelectorAll('input');
    const calcBtn = document.getElementById('calc-btn');
    const result = document.getElementById('calc-result');

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        playSound('tick');
        if (calcBtn) calcBtn.click();
      });
    });
  })();

  // ============================================================
  // 10. CARD LASER SCANNER SWEEP & HUD CURSOR ADAPTATION
  // ============================================================
  (function initCardScanners() {
    const cards = document.querySelectorAll('.pillar, .audience-card, .finding');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('card-scanned');
        setTimeout(() => card.classList.remove('card-scanned'), 750);
        
        if (window.setCursorMode) {
          const nameEl = card.querySelector('.name') || card.querySelector('.cat-tag');
          const title = nameEl ? nameEl.textContent.trim().toUpperCase() : 'ANALIZADOR';
          window.setCursorMode('inspect', `ARCH // ${title.slice(0, 22)}`);
        }
      });
      card.addEventListener('mouseleave', () => {
        if (window.setCursorMode) window.setCursorMode('default');
      });
    });

    // Simuladores tácticos y consolas
    const setContextualMode = (selector, mode, label) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('mouseenter', () => {
          if (window.setCursorMode) window.setCursorMode(mode, label);
        });
        el.addEventListener('mouseleave', () => {
          if (window.setCursorMode) window.setCursorMode('default');
        });
      });
    };

    setContextualMode('.griffith-demo', 'action', 'FÍSICA // GRIFFITH-IRWIN');
    setContextualMode('.cascade-block', 'action', 'SIM // CASCADA ONDAS');
    setContextualMode('.chandra-playground', 'action', 'FÍSICA // CHANDRASEKHAR');
    setContextualMode('.percolation-playground', 'action', 'RED // PERCOLACIÓN');
    setContextualMode('.clonal-playground', 'action', 'INMUNE // CLONALG');
    setContextualMode('.thermo-workbench', 'action', 'TERMODINÁMICA // RECOCIDO');
    setContextualMode('.violation-inspector-wrap', 'inspect', 'TRADUCTOR // SEMÁNTICO');
    setContextualMode('.gate-visualizer-box', 'inspect', 'GATE // AST DETERMINISTA');
    setContextualMode('.mckp-playground', 'action', 'ALGO // MOCHILA MCKP');
    setContextualMode('.terminal', 'action', 'CONSOLA // AQL ENGINE');
    setContextualMode('.health-gauge-row', 'inspect', 'GAUGE // HEALTH SCORE');
  })();

  // ============================================================
  // 11. ANS CLONALG ARTIFICIAL IMMUNE SYSTEM SIMULATOR
  // ============================================================
  (function initClonalImmuneSystem() {
    const root = document.getElementById('clonal-playground');
    if (!root) return;

    const poolEl = document.getElementById('clonal-pool');
    const genEl = document.getElementById('clonal-gen');
    const avgAffEl = document.getElementById('clonal-avg-aff');
    const eliteEl = document.getElementById('clonal-elite');
    const logEl = document.getElementById('clonal-log');

    let generation = 1;
    let antibodies = [
      {
        id: 'ab1',
        branch: 'archangel/heal-god-object-fiedler',
        strategy: 'SPLIT_CLASS',
        target: 'core/billing.py',
        affinity: 0.84,
        patchLines: 38
      },
      {
        id: 'ab2',
        branch: 'archangel/tighten-ashby-handlers',
        strategy: 'ADD_ERROR_HANDLING',
        target: 'api/gateway.py',
        affinity: 0.68,
        patchLines: 24
      },
      {
        id: 'ab3',
        branch: 'archangel/type-strict-protocols',
        strategy: 'ADD_INTERFACE',
        target: 'services/auth.py',
        affinity: 0.52,
        patchLines: 19
      }
    ];

    const fallbackStrategies = [
      'INJECT_DEPENDENCY',
      'DECOMPOSE',
      'ADD_VALIDATION',
      'ENCAPSULATE',
      'ADD_CIRCUIT_BREAKER'
    ];

    const renderPool = () => {
      antibodies.sort((a, b) => b.affinity - a.affinity);
      const top = antibodies[0];

      if (genEl) genEl.textContent = generation;
      if (avgAffEl) {
        const avg = antibodies.reduce((acc, a) => acc + a.affinity, 0) / antibodies.length;
        avgAffEl.textContent = avg.toFixed(2);
      }
      if (eliteEl) eliteEl.textContent = top.branch.replace('archangel/', '');

      if (!poolEl) return;
      poolEl.innerHTML = '';

      antibodies.forEach((ab, idx) => {
        const isElite = idx === 0;
        const card = document.createElement('div');
        card.className = `clonal-card ${isElite ? 'is-elite' : ''}`;
        card.innerHTML = `
          <div class="clonal-card-head">
            <span class="clonal-branch-name">${ab.branch}</span>
            <span class="badge ${isElite ? 'badge-stable' : 'badge-new'}" style="font-size:0.65rem;">
              ${isElite ? '★ ÉLITE' : 'CANDIDATO'}
            </span>
          </div>
          <div class="clonal-card-meta">
            <span>Objetivo: <code>${ab.target}</code></span>
            <span>Estrategia: <code>${ab.strategy}</code></span>
          </div>
          <div class="clonal-aff-bar">
            <div class="clonal-aff-fill" style="width: ${(ab.affinity * 100).toFixed(0)}%; background: ${isElite ? '#3ddad7' : '#fbbf24'};"></div>
          </div>
          <div class="clonal-card-meta">
            <span>Afinidad &Acal;: <b>${ab.affinity.toFixed(2)}</b></span>
            <span>Presupuesto: <b>${ab.patchLines} líneas</b></span>
          </div>
          <div class="clonal-card-actions">
            <button class="clonal-btn clonal-btn-merge" data-id="${ab.id}">✓ Merge (Reforzar)</button>
            <button class="clonal-btn clonal-btn-reject" data-id="${ab.id}">✗ Descartar (Castigar)</button>
          </div>
        `;
        poolEl.appendChild(card);
      });

      // Listeners
      poolEl.querySelectorAll('.clonal-btn-merge').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          handleMerge(id);
        });
      });

      poolEl.querySelectorAll('.clonal-btn-reject').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          handleReject(id);
        });
      });
    };

    const handleMerge = (id) => {
      playSound('laser');
      generation++;
      const target = antibodies.find((a) => a.id === id);
      if (target) {
        target.affinity = Math.min(0.98, target.affinity + 0.12);
        // Genera clon madurado
        const cloneStrategy = target.strategy;
        antibodies = antibodies.map((a) => {
          if (a.id === id) return a;
          return {
            ...a,
            affinity: Math.max(0.2, a.affinity + 0.03)
          };
        });
      }

      if (logEl) {
        logEl.innerHTML = `[Gen ${generation}] <strong>Rama mergeada en producción</strong>. Afinidad reforzada (+0.12). Maduración clonal completada sin conflicto en worktree aislado.`;
      }
      renderPool();
    };

    const handleReject = (id) => {
      playSound('click');
      generation++;
      const target = antibodies.find((a) => a.id === id);
      if (target) {
        target.affinity = Math.max(0.15, target.affinity - 0.25);
        // Hipermutación: muta a una estrategia alternativa
        const nextStrat = fallbackStrategies[Math.floor(Math.random() * fallbackStrategies.length)];
        target.strategy = nextStrat;
        target.branch = `archangel/heal-${nextStrat.toLowerCase().replace(/_/g, '-')}`;
      }

      if (logEl) {
        logEl.innerHTML = `[Gen ${generation}] <strong>Rama descartada por el dev</strong>. Penalización negativa (-0.25). Hipermutación activada: explorando estrategia <code>${target ? target.strategy : ''}</code>.`;
      }
      renderPool();
    };

    renderPool();
  })();

  // ============================================================
  // 12. PROMPT THERMODYNAMICS SUITE: LIVE WORKBENCH & PID
  // ============================================================
  (function initThermoWorkbench() {
    const slider = document.getElementById('thermo-temp-slider');
    if (!slider) return;

    const tempValEl = document.getElementById('thermo-temp-val');
    const phaseBadgeEl = document.getElementById('thermo-phase-badge');
    const metropolisEl = document.getElementById('thermo-metropolis');
    const scoreValEl = document.getElementById('thermo-score-val');
    const urgencyTagEl = document.getElementById('thermo-urgency-tag');
    const pFill = document.getElementById('pid-p-fill');
    const pVal = document.getElementById('pid-p-val');
    const iFill = document.getElementById('pid-i-fill');
    const iVal = document.getElementById('pid-i-val');
    const dFill = document.getElementById('pid-d-fill');
    const dVal = document.getElementById('pid-d-val');
    const dnaBox = document.getElementById('thermo-dna-box');
    const dnaMeta = document.getElementById('thermo-dna-meta');

    const updateThermo = () => {
      const T = parseFloat(slider.value);
      if (tempValEl) tempValEl.textContent = T.toFixed(4);

      // Metrópolis P(accept) = exp(-deltaE / T) con deltaE = 0.25
      const deltaE = 0.25;
      const pAccept = Math.min(99.9, Math.exp(-deltaE / Math.max(T, 0.001)) * 100);
      if (metropolisEl) metropolisEl.textContent = `${pAccept.toFixed(1)}%`;

      // Score simulado que decrece con T baja
      const simulatedScore = (0.2 + T * 3.4).toFixed(2);
      if (scoreValEl) scoreValEl.textContent = simulatedScore;

      // PID dynamics
      const p = Math.min(1.0, 0.25 + (1.0 - T) * 0.72);
      const i = Math.min(1.0, 0.10 + (1.0 - T) * 0.55);
      const d = Math.min(1.0, 0.05 + (1.0 - T) * 0.35);

      if (pFill) pFill.style.width = `${(p * 100).toFixed(0)}%`;
      if (pVal) pVal.textContent = p.toFixed(2);
      if (iFill) iFill.style.width = `${(i * 100).toFixed(0)}%`;
      if (iVal) iVal.textContent = i.toFixed(2);
      if (dFill) dFill.style.width = `${(d * 100).toFixed(0)}%`;
      if (dVal) dVal.textContent = d.toFixed(2);

      const pressure = (p * 0.5 + i * 0.3 + d * 0.2);

      let phaseText = '';
      let phaseClass = '';
      let urgencyText = '';
      let urgencyColor = '';
      let urgencyBg = '';
      let roleVariant = '';
      let directiveMode = '';
      let negativeBlock = '';

      if (T >= 0.70) {
        phaseText = '🔥 GAS / EXPLORACIÓN';
        phaseClass = 'thermo-phase-gas';
        urgencyText = 'URGENCIA MEDIA';
        urgencyColor = '#fbbf24';
        urgencyBg = 'rgba(251, 191, 36, 0.2)';
        roleVariant = 'Arquitecto Explorador (Soluciones Amplias)';
        directiveMode = '1 directiva general. Autorizado cambio de firma.';
        negativeBlock = '# Sin anti-patrones inyectados en alta temperatura (máxima libertad creativa)';
      } else if (T >= 0.30) {
        phaseText = '🌡 FLUIDO / TRANSICIÓN';
        phaseClass = 'thermo-phase-fluid';
        urgencyText = 'URGENCIA ALTA';
        urgencyColor = '#38bdf8';
        urgencyBg = 'rgba(56, 189, 248, 0.2)';
        roleVariant = 'Ingeniero de Refactorización Estricta';
        directiveMode = '2 directivas de reducción de acoplamiento. Mantener interfaces públicas.';
        negativeBlock = '# Anti-patrones advertidos: no tragar excepciones con `except Exception: pass`';
      } else {
        phaseText = '❄️ CRISTAL / EXPLOTACIÓN';
        phaseClass = 'thermo-phase-crystal';
        urgencyText = 'URGENCIA CRÍTICA';
        urgencyColor = '#f87171';
        urgencyBg = 'rgba(248, 113, 113, 0.2)';
        roleVariant = 'Verificador Quirúrgico Anti-Alucinación';
        directiveMode = 'Directivas quirúrgicas: CC ≤ 5 estricto, funciones puras, tipos deterministas.';
        negativeBlock = '## ⚠️ PATRONES QUE CAUSARON RECHAZO PREVIO (PROHIBIDOS):\n- except Exception: pass  # SWALLOWING DETECTADO\n- return None  # RETORNO ASIMÉTRICO PROHIBIDO\n- ir_plan()  # FUNCIÓN ALUCINADA RECHAZADA POR GATE';
      }

      if (phaseBadgeEl) {
        phaseBadgeEl.textContent = phaseText;
        phaseBadgeEl.className = `thermo-phase-badge ${phaseClass}`;
      }

      if (urgencyTagEl) {
        urgencyTagEl.textContent = urgencyText;
        urgencyTagEl.style.color = urgencyColor;
        urgencyTagEl.style.background = urgencyBg;
      }

      if (dnaMeta) {
        const hash = Math.floor(Math.sin(T * 100) * 1000000).toString(16).slice(-6);
        dnaMeta.textContent = `Hash: ${hash} | Presión PID: ${pressure.toFixed(2)} | Anti-windup: ACTIVO`;
      }

      if (dnaBox) {
        dnaBox.innerHTML = `
<span class="dna-hl">## GEN 1: SYSTEM ROLE</span>
Role: ${roleVariant}

<span class="dna-hl">## GEN 2: CONTEXTO (PREFIJO ESTABLE KV-CACHE)</span>
Código base bajo análisis [hash: 9f8a3d].
Telemetría mutable: Presión PID = <strong>${pressure.toFixed(2)}</strong> | T = <strong>${T.toFixed(4)}</strong> | Fase: <strong>${phaseText}</strong>

<span class="dna-hl">## GEN 3: DIRECTIVAS DE REPARACIÓN</span>
${directiveMode}

<span class="dna-warn">${negativeBlock}</span>
`;
      }
    };

    slider.addEventListener('input', updateThermo);
    updateThermo();
  })();

  // ============================================================
  // 13. VIOLATION-TO-INSTRUCTION TRANSLATOR TABS
  // ============================================================
  (function initViolationTranslator() {
    const wrap = document.getElementById('violation-inspector');
    if (!wrap) return;

    const tabs = wrap.querySelectorAll('.violation-tab-btn');
    const grid = document.getElementById('violation-grid');

    const violationData = {
      chandra: {
        raw: `
<div class="violation-raw-title">
  <span>CHANDRASEKHAR_EXCEEDED</span>
  <span style="color:#f87171;">CRITICAL</span>
</div>
<p style="margin:0.25rem 0; color:var(--text-dim);">Ubicación: <code>core/billing.py:142 [process_invoice]</code></p>
<p style="margin:0.25rem 0; color:var(--text-dim);">Métrica: <code>cyclomatic_complexity</code></p>
<p style="margin:0.25rem 0; color:var(--text);">Valor medido: <b>42.5</b> (Límite: <b>10.0</b>)</p>
<p style="margin:0.25rem 0; color:#f87171;">Ratio de exceso: <b>&times;4.25 sobre el colapso gravitacional</b></p>
<p style="margin-top:0.4rem; color:var(--text-dim); font-size:0.7rem;">El nodo ha superado la masa cognitiva tolerable. Riesgo inminente de implosión por deuda técnica.</p>
`,
        directive: `
<h4>DIRECTIVA DE REPARACIÓN [DECOMPOSE]</h4>
<p><strong>INSTRUCCIÓN AL LLM:</strong> Descompón la función madre en subfunciones puras independientes con CC ≤ 5. Cada subfunción debe poder describirse en una sola frase sin usar la palabra "y".</p>
<p style="margin:0.4rem 0 0.2rem; color:var(--text);"><strong>RESTRICCIONES OBLIGATORIAS:</strong></p>
<ul style="margin:0; padding-left:1.1rem;">
  <li>Cada subfunción resultante debe tener CC ≤ 5</li>
  <li>Las subfunciones no deben compartir estado mutable</li>
  <li>Nombres de subfunciones deben ser verbos específicos del dominio</li>
</ul>
<p style="margin:0.4rem 0 0.2rem; color:#f87171;"><strong>ANTI-PATRONES PROHIBIDOS:</strong></p>
<ul style="margin:0; padding-left:1.1rem; color:#f87171;">
  <li>No uses flags booleanos de control de flujo</li>
  <li>No extraigas métodos privados que solo se llamen una vez (pseudo-decomposición)</li>
</ul>
`
      },
      ashby: {
        raw: `
<div class="violation-raw-title">
  <span>CYBERNETIC_BLINDNESS (ASHBY)</span>
  <span style="color:#f87171;">CRITICAL</span>
</div>
<p style="margin:0.25rem 0; color:var(--text-dim);">Ubicación: <code>services/payment.py:88 [charge_token]</code></p>
<p style="margin:0.25rem 0; color:var(--text-dim);">Métrica: <code>unhandled_error_routes</code></p>
<p style="margin:0.25rem 0; color:var(--text);">Rutas de fallo: <b>6 posibles</b> (Handlers específicos: <b>1</b>)</p>
<p style="margin:0.25rem 0; color:#f87171;">Variedad requerida: <b>Asimetría de control 6:1 (Ceguera)</b></p>
<p style="margin-top:0.4rem; color:var(--text-dim); font-size:0.7rem;">Viola la Ley de Ashby: la variedad del controlador de errores no iguala la variedad de los estados de error del entorno.</p>
`,
        directive: `
<h4>DIRECTIVA DE REPARACIÓN [ADD_ERROR_HANDLING]</h4>
<p><strong>INSTRUCCIÓN AL LLM:</strong> Implementa una jerarquía de excepciones de dominio con un handler semántico específico para cada clase de fallo (Validación vs Red vs Fondos Insuficientes).</p>
<p style="margin:0.4rem 0 0.2rem; color:var(--text);"><strong>RESTRICCIONES OBLIGATORIAS:</strong></p>
<ul style="margin:0; padding-left:1.1rem;">
  <li>Cada handler debe ejecutar una política diferente (log estructurado + Result/Failure)</li>
  <li>Preservar el contexto original con <code>raise X from e</code></li>
  <li>Distinguir errores transitorios de errores fatales</li>
</ul>
<p style="margin:0.4rem 0 0.2rem; color:#f87171;"><strong>ANTI-PATRONES PROHIBIDOS:</strong></p>
<ul style="margin:0; padding-left:1.1rem; color:#f87171;">
  <li><code>except Exception: pass</code> (swallowing catastrófico)</li>
  <li><code>except Exception as e: logger.error(str(e))</code> (mega-handler genérico ciego)</li>
</ul>
`
      },
      lorentz: {
        raw: `
<div class="violation-raw-title">
  <span>LAYER_VIOLATION (LORENTZ GUARD)</span>
  <span style="color:#fbbf24;">WARNING</span>
</div>
<p style="margin:0.25rem 0; color:var(--text-dim);">Ubicación: <code>domain/entities/order.py:12</code></p>
<p style="margin:0.25rem 0; color:var(--text-dim);">Métrica: <code>layer_distance</code></p>
<p style="margin:0.25rem 0; color:var(--text);">Import ilegal: <code>infrastructure.db.postgres_pool</code></p>
<p style="margin:0.25rem 0; color:#fbbf24;">Violación: <b>Capa pura de Dominio acoplada a Infraestructura</b></p>
<p style="margin-top:0.4rem; color:var(--text-dim); font-size:0.7rem;">Inversión de dependencias rota. El modelo de negocio no puede compilar sin el driver de persistencia.</p>
`,
        directive: `
<h4>DIRECTIVA DE REPARACIÓN [ADD_INTERFACE]</h4>
<p><strong>INSTRUCCIÓN AL LLM:</strong> Introduce un <code>Protocol</code> o clase abstracta en el dominio para la persistencia. La implementación concreta debe inyectarse en el Composition Root.</p>
<p style="margin:0.4rem 0 0.2rem; color:var(--text);"><strong>RESTRICCIONES OBLIGATORIAS:</strong></p>
<ul style="margin:0; padding-left:1.1rem;">
  <li>Usar <code>typing.Protocol</code> con métodos abstractos puros</li>
  <li>Eliminar todo import directo a SQLAlchemy / Postgres en domain/</li>
  <li>Inyectar el repositorio en el constructor del servicio</li>
</ul>
<p style="margin:0.4rem 0 0.2rem; color:#f87171;"><strong>ANTI-PATRONES PROHIBIDOS:</strong></p>
<ul style="margin:0; padding-left:1.1rem; color:#f87171;">
  <li>No uses imports dinámicos dentro de métodos para ocultar el acoplamiento</li>
  <li>No instancies clases de infraestructura dentro de entidades de dominio</li>
</ul>
`
      }
    };

    const renderViolation = (key) => {
      const data = violationData[key];
      if (!data || !grid) return;
      grid.innerHTML = `
        <div class="violation-raw-card">${data.raw}</div>
        <div class="violation-directive-card">${data.directive}</div>
      `;
    };

    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        playSound('click');
        const key = btn.getAttribute('data-vkey');
        renderViolation(key);
      });
    });

    renderViolation('chandra');
  })();

  // ============================================================
  // 14. HALLUCINATION GATE & KV PREFIX CACHE SHOWCASE
  // ============================================================
  (function initHallucinationGate() {
    const wrap = document.getElementById('gate-visualizer');
    if (!wrap) return;

    const pills = wrap.querySelectorAll('.gate-pill-btn');
    const displayCard = document.getElementById('gate-display-card');

    const views = {
      'reward-hack': `
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
  <span style="color:#f87171; font-weight:700;">[REWARD HACKING DETECTADO] Modelo 7B sin Gate</span>
  <span class="badge badge-new" style="background:rgba(248,113,113,0.15); color:#f87171; border-color:#f87171;">Ashby Score: 100% (Falso Éxito)</span>
</div>
<p style="color:var(--text-dim); margin-bottom:0.5rem;">
  Hallazgo real documentado el 16-oct-2026: Ashby mide estructura y complejidad ciclomática. El modelo generó un código que redujo la CC a 3 y añadió logging, por lo que el validador físico creyó que el código era perfecto.
</p>
<pre style="background:var(--bg); border:1px solid var(--line); padding:0.6rem; border-radius:3px; color:#f87171; overflow-x:auto;">
# Código alucinado por el modelo 7B:
import opentracing  # ✗ ERROR: librería ni siquiera está instalada en el venv!
from uninstalled_sdk import metrics

def process_payload(data):
    plan = ir_plan(data)        # ✗ ERROR: ir_plan() no existe en ningún lado
    return optimize_plan(plan)  # ✗ ERROR: función inventada de la nada
</pre>
<p style="color:#f87171; font-size:0.75rem; margin-top:0.4rem;">
  El código ni siquiera importa, mucho menos ejecuta. El LLM satisfizo la letra del validador físico sin cumplir el espíritu.
</p>
`,
      'gate-active': `
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
  <span style="color:#3ddad7; font-weight:700;">[HALLUCINATION GATE ACTIVADO] ast.parse + importlib.util.find_spec</span>
  <span class="badge badge-stable">Tiempo de intercepción: 0.42 ms</span>
</div>
<p style="color:var(--text-dim); margin-bottom:0.5rem;">
  El Gate semántico intercepta el parche <strong>antes</strong> de enviarlo al validador físico. Realiza una verificación determinista sin invocar a otro LLM y sin ejecutar código:
</p>
<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:0.5rem 0;">
  <div style="background:var(--bg); border:1px solid var(--line); padding:0.5rem; border-radius:3px;">
    <strong style="color:var(--text); font-size:0.75rem;">A. Imports no resolubles:</strong>
    <p style="color:#f87171; font-size:0.72rem; margin:0.25rem 0;"><code>find_spec('opentracing') &rarr; None</code></p>
    <span style="color:var(--text-dim); font-size:0.68rem;">Rechaza paquetes ficticios sin instalarlos.</span>
  </div>
  <div style="background:var(--bg); border:1px solid var(--line); padding:0.5rem; border-radius:3px;">
    <strong style="color:var(--text); font-size:0.75rem;">B. Llamadas a nombres pelados:</strong>
    <p style="color:#f87171; font-size:0.72rem; margin:0.25rem 0;"><code>ir_plan() &notin; builtins &cup; defined &cup; imported</code></p>
    <span style="color:var(--text-dim); font-size:0.68rem;">Rechaza APIs inventadas de la nada.</span>
  </div>
</div>
<p style="color:#3ddad7; font-size:0.75rem; margin-top:0.4rem;">
  &rarr; Emite <code>HALLUCINATION_REJECTED</code>. El ciclo penaliza el fitness del modelo, reinicia el integral del PID y muta la estrategia sin gastar recursos en la validación física.
</p>
`,
      'kv-cache': `
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
  <span style="color:#4ade80; font-weight:700;">[SISTEMAS LLM] Alineación de Prefijo para KV Cache</span>
  <span class="badge badge-stable" style="background:rgba(74,222,128,0.15); color:#4ade80; border-color:#4ade80;">Reutilización KV: ~85%</span>
</div>
<p style="color:var(--text-dim); margin-bottom:0.5rem;">
  Motores locales como llama.cpp y Ollama cachean tensores de claves y valores (KV Cache) por <strong>prefijo literal compartido</strong> entre peticiones consecutivas al mismo modelo.
</p>
<div class="kv-cache-diagram">
  <div class="kv-cache-segment kv-hit">
    <span>✓ [PREFIJO ESTABLE - KV CACHE HIT 85%]: System Role + Original Source Code (Idéntico en cada vuelta)</span>
  </div>
  <div class="kv-cache-segment kv-miss">
    <span>⚡ [SUFIJO MUTABLE - ÚNICA GENERACIÓN NUEVA 15%]: Iteración actual, Presión PID, Temperatura T, Anti-patrones</span>
  </div>
</div>
<p style="color:var(--text-dim); font-size:0.75rem; margin-top:0.5rem;">
  Al colocar el código original estático al inicio y la telemetría mutable al final en <code>_prompt_builder.py</code>, la latencia de inferencia entre iteraciones cae de <strong>4.2s</strong> a <strong>0.8s</strong> en Ollama sobre GPUs locales.
</p>
`
    };

    const renderGateView = (tabKey) => {
      if (!displayCard) return;
      displayCard.innerHTML = views[tabKey] || '';
    };

    pills.forEach((btn) => {
      btn.addEventListener('click', () => {
        pills.forEach((p) => {
          p.classList.remove('is-active', 'is-active-safe');
        });
        const key = btn.getAttribute('data-gate-tab');
        if (key === 'gate-active' || key === 'kv-cache') {
          btn.classList.add('is-active-safe');
        } else {
          btn.classList.add('is-active');
        }
        playSound('click');
        renderGateView(key);
      });
    });

    renderGateView('reward-hack');
  })();

  // ============================================================
  // 15. RUST NATIVE 35,654 LOC MATRIX INSPECTOR
  // ============================================================
  (function initRustMatrix() {
    const wrap = document.getElementById('rust-matrix-wrap');
    if (!wrap) return;

    const tabs = wrap.querySelectorAll('.rust-tab-btn');
    const content = document.getElementById('rust-matrix-content');

    const views = {
      evm: {
        title: 'Multi-VM: Análisis de Bytecode EVM & CosmWasm (`evm.rs` + `wasm.rs`)',
        loc: '6.270 LOC',
        metrics: [
          { label: 'Líneas Totales', val: '6.270 LOC' },
          { label: 'Estándares SWC', val: '4 SWC IDs' },
          { label: 'Throughput', val: '18.2× vs Python VM' }
        ],
        desc: `
<p>Análisis de bytecode crudo para contratos inteligentes en Solidity, Vyper y CosmWasm, sin requerir emulación pesada:</p>
<ul style="margin:0; padding-left:1.1rem; line-height:1.5;">
  <li><strong>EVM (4.086 LOC):</strong> CFG sobre máquina de pila de 256 bits. Detecta Reentrancy (SWC-107) con lattice "may", Unchecked Call Return (SWC-104) con BFS acotado hasta <code>Raise</code>, y llamadas protegidas con <code>tx.origin</code> (SWC-115).</li>
  <li><strong>CosmWasm (2.184 LOC):</strong> Decodificador binario W3C WebAssembly. Resuelve el despacho dinámico de vtables (<code>deps.storage.set</code> via <code>call_indirect</code> en <code>elem[23]</code>) que cualquier linter ingenuo ignoraría.</li>
</ul>
`,
        code: `
<span class="rc-cmt">// archangel_rs/src/evm.rs (4.086 líneas)</span>
<span class="rc-kw">pub fn</span> <span class="rc-fn">find_reentrancy</span>(cfg: &amp;<span class="rc-type">Cfg</span>&lt;<span class="rc-type">Instruction</span>&gt;) -&gt; <span class="rc-type">Vec</span>&lt;<span class="rc-type">Finding</span>&gt; {
    <span class="rc-cmt">// Lattice "may": si ALGÚN camino llega a SSTORE tras CALL externo</span>
    <span class="rc-kw">let</span> entry = <span class="rc-type">ReentrancyState</span> { has_call: <span class="rc-kw">false</span> };
    <span class="rc-kw">let</span> result = dataflow::<span class="rc-fn">solve_forward</span>(cfg, entry);
    <span class="rc-cmt">// Excluye STATICCALL (el protocolo EVM prohíbe mutar estado)</span>
    ...
}

<span class="rc-cmt">// archangel_rs/src/wasm.rs (2.184 líneas)</span>
<span class="rc-kw">pub fn</span> <span class="rc-fn">resolve_call_indirect</span>(sec_elem: &amp;<span class="rc-type">ElementSection</span>, type_idx: <span class="rc-type">u32</span>) -&gt; <span class="rc-type">Vec</span>&lt;<span class="rc-type">FuncIdx</span>&gt; {
    <span class="rc-cmt">// Conecta llamadas a través de la vtable de dyn Storage hacia Storage::set</span>
    sec_elem.functions_matching_type(type_idx)
}
`
      },
      pdg: {
        title: 'Program Dependence Graph & Slicing (`pdg.rs`)',
        loc: '2.459 LOC',
        metrics: [
          { label: 'Líneas Totales', val: '2.459 LOC' },
          { label: 'Paper Base', val: 'Ferrante (1987)' },
          { label: 'Modos de Slice', val: 'Backward/Fwd/Chop' }
        ],
        desc: `
<p>Implementación formal del Program Dependence Graph (PDG) de Ferrante, Ottenstein & Warren sobre el CFG de CPython:</p>
<ul style="margin:0; padding-left:1.1rem; line-height:1.5;">
  <li><strong>Dependencia de Control:</strong> Calculada mediante el cálculo de la frontera de postdominancia en el grafo de flujo.</li>
  <li><strong>Dependencia de Datos (Reaching Defs):</strong> Distingue <em>Strong Updates</em> (asignaciones escalares que matan definiciones previas) de <em>Weak Updates</em> (mutaciones in-place como <code>a.append(v)</code> o <code>a[k] = v</code>).</li>
  <li><strong>Dependency Slicing:</strong> Slicing hacia atrás, hacia adelante y <em>chop slicing</em> (corte transitivo exacto entre dos líneas).</li>
</ul>
`,
        code: `
<span class="rc-cmt">// archangel_rs/src/pdg.rs (2.459 líneas)</span>
<span class="rc-kw">pub trait</span> <span class="rc-type">DefUse</span> {
    <span class="rc-kw">fn</span> <span class="rc-fn">defs</span>(&amp;<span class="rc-kw">self</span>) -&gt; <span class="rc-type">Vec</span>&lt;<span class="rc-type">Var</span>&gt;;      <span class="rc-cmt">// Strong update (mata defs previas)</span>
    <span class="rc-kw">fn</span> <span class="rc-fn">uses</span>(&amp;<span class="rc-kw">self</span>) -&gt; <span class="rc-type">Vec</span>&lt;<span class="rc-type">Var</span>&gt;;      <span class="rc-cmt">// Lecturas de variables</span>
    <span class="rc-kw">fn</span> <span class="rc-fn">weak_defs</span>(&amp;<span class="rc-kw">self</span>) -&gt; <span class="rc-type">Vec</span>&lt;<span class="rc-type">Var</span>&gt; { <span class="rc-cmt">// a.append(), a[k]=v</span>
        <span class="rc-type">Vec</span>::<span class="rc-fn">new</span>()
    }
}

<span class="rc-kw">pub fn</span> <span class="rc-fn">backward_slice</span>(pdg: &amp;<span class="rc-type">Pdg</span>, target_line: <span class="rc-type">i64</span>) -&gt; <span class="rc-type">BTreeSet</span>&lt;<span class="rc-type">i64</span>&gt; {
    <span class="rc-cmt">// Cierre transitivo de dependencias de datos y control</span>
    pdg.<span class="rc-fn">transitive_closure</span>(target_line, <span class="rc-type">Direction</span>::Backward)
}
`
      },
      race: {
        title: 'Concurrencia a Nivel de Bitsets 64-bit (`race_kernel.rs` + `race_cfg.rs`)',
        loc: '4.257 LOC',
        metrics: [
          { label: 'Líneas Totales', val: '4.257 LOC' },
          { label: 'Representación', val: 'Bitsets u64' },
          { label: 'Optimización', val: 'Alg. Kernighan' }
        ],
        desc: `
<p>Núcleos numéricos ultra-optimizados para la detección estática de condiciones de carrera y deadlocks en código asíncrono y multihilo:</p>
<ul style="margin:0; padding-left:1.1rem; line-height:1.5;">
  <li><strong>Lockset MUST:</strong> Resuelto con conjuntos representados en palabras de 64 bits (<code>type Bits = Vec&lt;u64&gt;</code>) con intersección bit a bit como operador meet.</li>
  <li><strong>Happens-Before:</strong> Cómputo hacia adelante y hacia atrás sobre el CFG sin allocations dinámicas en el bucle caliente.</li>
  <li><strong>Inlining Asíncrono:</strong> En <code>race_cfg.rs</code>, inlining interprocedural de corrutinas con conservación estricta de rangos de lock (<code>with lock:</code>) entre archivos.</li>
</ul>
`,
        code: `
<span class="rc-cmt">// archangel_rs/src/race_kernel.rs (312 líneas numéricas)</span>
<span class="rc-kw">type</span> <span class="rc-type">Bits</span> = <span class="rc-type">Vec</span>&lt;<span class="rc-type">u64</span>&gt;;

<span class="rc-kw">pub fn</span> <span class="rc-fn">lockset_solve</span>(n: <span class="rc-type">usize</span>, entry: <span class="rc-type">usize</span>, succs: &amp;[<span class="rc-type">Vec</span>&lt;<span class="rc-type">usize</span>&gt;], events: &amp;[<span class="rc-type">Vec</span>&lt;(<span class="rc-type">u8</span>, <span class="rc-type">usize</span>)&gt;], ...) {
    <span class="rc-kw">while let</span> <span class="rc-type">Some</span>(b) = work.<span class="rc-fn">pop</span>() {
        <span class="rc-cmt">// Intersección de bits AND entre predecesores</span>
        <span class="rc-kw">for</span> &amp;(kind, id) <span class="rc-kw">in</span> &amp;events[b] {
            <span class="rc-kw">let</span> (wi, bit) = (id / 64, 1u64 &lt;&lt; (id % 64));
            <span class="rc-kw">if</span> kind == 1 { st[wi] |= bit; }  <span class="rc-cmt">// acquire lock</span>
            <span class="rc-kw">else</span>         { st[wi] &amp;= !bit; } <span class="rc-cmt">// release lock</span>
        }
    }
}
`
      },
      fourier: {
        title: 'Fourier-Motzkin Variable Elimination (`feasibility.rs`)',
        loc: '766 LOC',
        metrics: [
          { label: 'Líneas Totales', val: '766 LOC' },
          { label: 'Precisión', val: 'Racionales Exactos' },
          { label: 'Speedup SMT', val: '22.4× vs Z3 FFI' }
        ],
        desc: `
<p>Poda matemática de caminos inviables sin incurrir en el costo del puente FFI de Z3 en cada bloque condicional:</p>
<ul style="margin:0; padding-left:1.1rem; line-height:1.5;">
  <li><strong>Eliminación Exacta:</strong> Algoritmo de Fourier-Motzkin sobre racionales para conjunciones aritméticas lineales (<code>+</code>, <code>-</code>, <code>* const</code>). Produce exactamente el mismo veredicto sat/unsat que Z3.</li>
  <li><strong>Mecanismo de Bailout:</strong> Si la rama contiene aritmética no lineal (producto de variables o desbordes), emite <code>feasibility::bail()</code> y cae al motor Python con Z3 sin inventar heurísticas degradadas.</li>
</ul>
`,
        code: `
<span class="rc-cmt">// archangel_rs/src/feasibility.rs (766 líneas)</span>
<span class="rc-kw">pub fn</span> <span class="rc-fn">check_path_feasibility</span>(conjunction: &amp;[<span class="rc-type">Expr</span>]) -&gt; <span class="rc-type">bool</span> {
    <span class="rc-kw">if</span> <span class="rc-fn">is_pure_linear_numeric</span>(conjunction) {
        <span class="rc-cmt">// Fourier-Motzkin en memoria de Rust en 0.8 µs</span>
        <span class="rc-kw">return</span> <span class="rc-fn">fourier_motzkin_solve</span>(conjunction);
    }
    <span class="rc-cmt">// No aproxima: bail y cae a Python + Z3</span>
    <span class="rc-fn">bail</span>(<span class="rc-str">"aritmética no lineal en path condition"</span>);
    <span class="rc-kw">true</span>
}
`
      },
      treesitter: {
        title: 'Taint TSX/React/Node con Tree-sitter (`jstaint.rs` + `jsast.rs` + `jstables_gen.rs`)',
        loc: '4.111 LOC',
        metrics: [
          { label: 'Líneas Totales', val: '4.111 LOC' },
          { label: 'Parser', val: 'Tree-sitter TSX / JS / TS' },
          { label: 'Sensibilidad', val: 'Campos k=4 + JSX + Express' }
        ],
        desc: `
<p>Análisis estático de flujo de taint inter-procedimental para TypeScript, TSX, React y Node.js directamente sobre el AST de Tree-sitter en Rust nativo:</p>
<ul style="margin:0; padding-left:1.1rem; line-height:1.5;">
  <li><strong>React &amp; JSX:</strong> Detección de XSS en atributos JSX como <code>dangerouslySetInnerHTML</code> y propagación en accesos indexados <code>obj[key]</code> con sensibilidad de campo k=4.</li>
  <li><strong>Express &amp; Backend Node:</strong> 25 sumideros y 8 fuentes autogeneradas desde Python hacia Rust (SQLi, CMDi, SSRF, Path Traversal, Open Redirect, Code Injection).</li>
  <li><strong>Cross-file &amp; Provenance:</strong> Resúmenes inter-módulo de funciones (<code>JsForeignCache</code>) y backward slice completo en el PDG (Ferrante-Ottenstein) sin runtime de Node.js.</li>
</ul>
`,
        code: `
<span class="rc-cmt">// archangel_rs/src/jstaint.rs + jsast.rs + jstables_gen.rs (4.111 líneas)</span>
<span class="rc-kw">pub fn</span> <span class="rc-fn">analyze_js_taint</span>(source: &amp;<span class="rc-type">str</span>, lang: &amp;<span class="rc-type">str</span>) -&gt; <span class="rc-type">Result</span>&lt;<span class="rc-type">Vec</span>&lt;<span class="rc-type">Finding</span>&gt;, <span class="rc-type">String</span>&gt; {
    <span class="rc-kw">let mut</span> parser = tree_sitter::<span class="rc-type">Parser</span>::<span class="rc-fn">new</span>();
    parser.<span class="rc-fn">set_language</span>(&amp;<span class="rc-fn">get_tree_sitter_lang</span>(lang))?;
    <span class="rc-kw">let</span> tree = parser.<span class="rc-fn">parse</span>(source, <span class="rc-type">None</span>).<span class="rc-fn">unwrap</span>();
    
    <span class="rc-cmt">// Dataflow lattice "may" sobre el CFG de Tree-sitter</span>
    <span class="rc-kw">let</span> cfg = <span class="rc-fn">build_js_cfg</span>(&amp;tree);
    <span class="rc-type">Ok</span>(<span class="rc-fn">solve_dom_xss</span>(&amp;cfg))
}
`
      }
    };

    const renderMatrix = (key) => {
      const data = views[key];
      if (!data || !content) return;

      const metricBoxes = data.metrics.map((m) => `
        <div class="rust-metric-box">
          <span>${m.label}</span>
          <strong>${m.val}</strong>
        </div>
      `).join('');

      content.innerHTML = `
        <div class="rust-detail-col">
          <p class="rust-detail-title">${data.title}</p>
          <div class="rust-metric-strip">${metricBoxes}</div>
          <div>${data.desc}</div>
        </div>
        <div class="rust-code-col">
          <div class="rust-code-card">${data.code}</div>
        </div>
      `;
    };

    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        playSound('click');
        const key = btn.getAttribute('data-rtab');
        renderMatrix(key);
      });
    });

    renderMatrix('evm');
  })();

})();



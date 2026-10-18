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
    setContextualMode('.mckp-playground', 'action', 'ALGO // MOCHILA MCKP');
    setContextualMode('.terminal', 'action', 'CONSOLA // AQL ENGINE');
    setContextualMode('.health-gauge-row', 'inspect', 'GAUGE // HEALTH SCORE');
  })();

})();

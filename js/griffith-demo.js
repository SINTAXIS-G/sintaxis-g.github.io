// ============================================================
// Demo interactiva del criterio de Griffith/Irwin — misma fórmula que
// ya se muestra en la figura estática (K_I = σ·√(π·a)), pero jugable:
// mueve σ (presión de release) y a (deuda técnica acumulada) y mira si
// el módulo fractura de verdad, no una animación decorativa.
// Opcional: si el widget no existe en la página, este script no hace nada.
// ============================================================

const gdRoot = document.getElementById('griffith-demo');

if (gdRoot) {
  const aInput = document.getElementById('gd-a');
  const sigmaInput = document.getElementById('gd-sigma');
  const aVal = document.getElementById('gd-a-val');
  const sigmaVal = document.getElementById('gd-sigma-val');
  const kiVal = document.getElementById('gd-ki');
  const verdict = document.getElementById('gd-verdict');
  const crackPath = document.getElementById('gd-crack');
  const leftPiece = document.getElementById('gd-left');
  const rightPiece = document.getElementById('gd-right');
  const resetBtn = document.getElementById('gd-reset');

  const K_IC = 12; // tolerancia a fractura del módulo (unidades normalizadas)
  const A_MAX = 5; // cm, extremo del slider
  const HALF_WIDTH = 160; // px, ancho de cada mitad de la probeta en el SVG
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let fractured = false;

  function buildCrackPath(lengthPx) {
    if (lengthPx <= 0) return 'M 160 50 L 160 50';
    const segments = Math.max(2, Math.round(lengthPx / 10));
    const step = lengthPx / segments;
    let d = `M ${160 - lengthPx} 50`;
    for (let i = 1; i <= segments; i++) {
      const x = 160 - lengthPx + i * step;
      const y = 50 + (i % 2 === 0 ? 6 : -6);
      d += ` L ${x.toFixed(1)} ${y}`;
    }
    d += ` L 160 50`;
    return d;
  }

  function fracture() {
    fractured = true;
    crackPath.setAttribute('d', buildCrackPath(HALF_WIDTH));
    crackPath.style.stroke = '#F87171';
    verdict.textContent = 'FRACTURA — K_I ≥ K_IC';
    verdict.className = 'gd-verdict gd-verdict--critical';
    if (!reducedMotion) {
      leftPiece.style.transform = 'translate(-14px, -5px) rotate(-2.5deg)';
      rightPiece.style.transform = 'translate(14px, 5px) rotate(2.5deg)';
    } else {
      leftPiece.style.transform = 'translate(-6px, 0) rotate(0)';
      rightPiece.style.transform = 'translate(6px, 0) rotate(0)';
    }
    aInput.disabled = true;
    sigmaInput.disabled = true;
    resetBtn.hidden = false;
  }

  function resetProbe() {
    fractured = false;
    leftPiece.style.transform = 'translate(0, 0) rotate(0)';
    rightPiece.style.transform = 'translate(0, 0) rotate(0)';
    crackPath.style.stroke = 'var(--accent)';
    aInput.disabled = false;
    sigmaInput.disabled = false;
    resetBtn.hidden = true;
    // Vuelve a valores seguros: si se dejaran los sliders en los valores
    // que causaron la fractura, update() volvería a fracturar al instante
    // y el reset se vería como si no hiciera nada.
    aInput.value = '1';
    sigmaInput.value = '3';
    update();
  }

  function update() {
    if (fractured) return;
    const a = parseFloat(aInput.value);
    const sigma = parseFloat(sigmaInput.value);
    const ki = sigma * Math.sqrt(Math.PI * a);

    aVal.textContent = a.toFixed(1);
    sigmaVal.textContent = sigma.toFixed(1);
    kiVal.textContent = ki.toFixed(2);

    const lengthPx = (a / A_MAX) * HALF_WIDTH * 0.9;
    crackPath.setAttribute('d', buildCrackPath(lengthPx));

    const ratio = ki / K_IC;
    if (ratio >= 1) {
      fracture();
      return;
    }
    if (ratio > 0.8) {
      verdict.textContent = 'Cerca del límite';
      verdict.className = 'gd-verdict gd-verdict--warning';
    } else {
      verdict.textContent = 'Estable';
      verdict.className = 'gd-verdict gd-verdict--ok';
    }
  }

  aInput.addEventListener('input', update);
  sigmaInput.addEventListener('input', update);
  resetBtn.addEventListener('click', resetProbe);

  update();
}

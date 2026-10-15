// ============================================================
// SINTAXIS G — Demo real de la curva de Ebbinghaus (EIDOLON)
// R(t) = e^(-t/S): retención en función del tiempo, con S (estabilidad)
// creciendo cada vez que la memoria se "refuerza" — el mismo modelo de
// repetición espaciada que describe el copy de EIDOLON. Todo acá es la
// fórmula real evaluada contra el slider; no hay una curva precalculada
// ni una animación que solo aparente decaer.
// ============================================================
(function () {
  const slider = document.getElementById('ebSlider');
  if (!slider) return;

  const daysVal = document.getElementById('ebDaysVal');
  const retentionVal = document.getElementById('ebRetentionVal');
  const stabilityVal = document.getElementById('ebStabilityVal');
  const memoryText = document.getElementById('ebMemoryText');
  const reinforceBtn = document.getElementById('ebReinforceBtn');
  const reinforceCount = document.getElementById('ebReinforceCount');
  const curvePath = document.getElementById('ebCurvePath');
  const marker = document.getElementById('ebMarker');

  let S = 4; // estabilidad inicial, en días
  let reinforcements = 0;

  const GRAPH_W = 300;
  const GRAPH_H = 140;
  const PAD_TOP = 10;
  const PAD_BOTTOM = 130; // = eje X
  const MAX_T = 30;

  function retention(t, stability) {
    return Math.exp(-t / stability);
  }

  function buildCurve(stability) {
    const points = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = (MAX_T * i) / steps;
      const r = retention(t, stability);
      const x = (t / MAX_T) * GRAPH_W;
      const y = PAD_BOTTOM - r * (PAD_BOTTOM - PAD_TOP);
      points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return points.join(' ');
  }

  function render() {
    const t = parseFloat(slider.value);
    const r = retention(t, S);
    const pct = Math.round(r * 100);

    daysVal.textContent = t.toFixed(0);
    retentionVal.textContent = `${pct}%`;
    stabilityVal.textContent = `${S.toFixed(1)} días`;

    // El texto de la memoria se desvanece y desenfoca con la retención
    // real -- no es decorativo, es R(t) manejando opacity/blur directo.
    memoryText.style.opacity = String(Math.max(0.15, r));
    memoryText.style.filter = `blur(${((1 - r) * 2.2).toFixed(2)}px)`;

    curvePath.setAttribute('d', buildCurve(S));
    const mx = (t / MAX_T) * GRAPH_W;
    const my = PAD_BOTTOM - r * (PAD_BOTTOM - PAD_TOP);
    marker.setAttribute('cx', mx.toFixed(2));
    marker.setAttribute('cy', my.toFixed(2));
  }

  slider.addEventListener('input', render);

  if (reinforceBtn) {
    reinforceBtn.addEventListener('click', () => {
      // Repetición espaciada real: cada refuerzo multiplica la
      // estabilidad (la memoria tarda más en decaer la próxima vez) y
      // la mención "ocurre ahora", así que el slider vuelve a 0.
      S *= 1.55;
      reinforcements += 1;
      reinforceCount.textContent = String(reinforcements);
      slider.value = '0';
      render();
    });
  }

  render();
})();

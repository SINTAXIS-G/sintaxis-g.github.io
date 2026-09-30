// Alterna entre el tema claro (por defecto) y el oscuro en la página de KAIROS.
// La clase inicial la pone un script pequeño en <head> para evitar parpadeo;
// aquí solo se cablea el botón y se recuerda la elección.
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');

  function sync() {
    var dark = root.classList.contains('k-dark');
    btn.textContent = dark ? 'tema claro' : 'tema oscuro';
    btn.setAttribute('aria-pressed', String(dark));
    if (meta) meta.setAttribute('content', dark ? '#0a0e1a' : '#faf7f2');
  }

  btn.addEventListener('click', function () {
    var dark = root.classList.toggle('k-dark');
    try { localStorage.setItem('kairos_theme', dark ? 'dark' : 'light'); } catch (e) { /* storage bloqueado: solo no se recuerda */ }
    sync();
  });
  sync();
})();

// Datos del responsable: aparecen automáticamente en la landing y en las páginas legales.
window.VOCARI_SITE = {
  owner: 'Vocari',
  country: 'Chile',
  countryEn: 'Chile',
  email: 'nemsstoredrip@gmail.com',
  updated: '5 de noviembre de 2026',
  updatedEn: 'November 5, 2026'
};
(function () {
  var c = window.VOCARI_SITE;
  function fill() {
    document.querySelectorAll('[data-site]').forEach(function (el) {
      var k = el.getAttribute('data-site');
      if (k === 'mailto') { el.href = 'mailto:' + c.email + (el.dataset.subject ? '?subject=' + encodeURIComponent(el.dataset.subject) : ''); if (!el.textContent.trim()) el.textContent = c.email; }
      else el.textContent = c[k];
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();

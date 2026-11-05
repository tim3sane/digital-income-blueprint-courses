// ⚠️ EDITA SOLO ESTO: tus datos aparecen automáticamente en la landing y en las páginas legales.
window.HABLA_SITE = {
  owner: '[TU NOMBRE O EMPRESA]',        // responsable legal, p. ej. "Santiago Narváez" o "Habla SAS"
  country: '[PAÍS]',                      // país cuyas leyes aplican, p. ej. "Colombia"
  email: '[CORREO DE CONTACTO]',          // correo de soporte, p. ej. "hola@tudominio.com"
  updated: '5 de noviembre de 2026'
};
(function () {
  var c = window.HABLA_SITE;
  function fill() {
    document.querySelectorAll('[data-site]').forEach(function (el) {
      var k = el.getAttribute('data-site');
      if (k === 'mailto') { el.href = 'mailto:' + c.email + (el.dataset.subject ? '?subject=' + encodeURIComponent(el.dataset.subject) : ''); if (!el.textContent.trim()) el.textContent = c.email; }
      else el.textContent = c[k];
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();

// Vocari — abre el checkout de Paddle. Uso: VocariPay.buy('plus_y' | 'pro_m' | 'ebook' | ..., 'es' | 'en')
(function () {
  var loading = null;
  function loadPaddle() {
    if (window.Paddle) return Promise.resolve(window.Paddle);
    if (loading) return loading;
    loading = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      s.onload = function () { res(window.Paddle); };
      s.onerror = function () { loading = null; rej(new Error('paddle')); };
      document.head.appendChild(s);
    });
    return loading;
  }
  var inited = false;
  window.VocariPay = {
    buy: function (item, lang) {
      return fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item: item, lang: lang || 'es' }) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.transactionId) throw new Error(j.error || 'checkout'); return j; }); })
        .then(function (j) {
          return loadPaddle().then(function (P) {
            if (!inited) {
              if (j.env === 'sandbox') P.Environment.set('sandbox');
              P.Initialize({ token: j.clientToken });
              inited = true;
            }
            P.Checkout.open({ transactionId: j.transactionId, settings: { displayMode: 'overlay', locale: j.locale, successUrl: j.successUrl, allowLogout: false } });
          });
        });
    }
  };
})();

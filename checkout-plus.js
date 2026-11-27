/* Zella — checkout-plus (2026-11-27, owner picked parts 4 and 7 of the preview tour; full preview kept in
   preview/checkout-plus.full.js). Runs on /checkout next to checkout-clear.js.
   4) A turquoise ✓ inside each field once it is valid (name 3+ letters, Egyptian mobile 01x + 8 digits, address 8+).
   7) The trust lines under the order button appear one after the other the first time they are on screen.
   Both use opacity/transform only (no layout shift), run once, are off under prefers-reduced-motion, and the trust
   lines are forced visible after 2.5 s if the motion never runs. */
(function () {
  if (window.__zckPlus) return;
  window.__zckPlus = 1;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.id = 'zcp-css';
  css.textContent =
    '.zcp-ok{position:absolute;left:12px;top:50%;transform:translateY(-50%) scale(.4);opacity:0;width:22px;height:22px;border-radius:50%;background:#14b8a6;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;transition:all .25s;pointer-events:none}' +
    '.zcp-v .zcp-ok{opacity:1;transform:translateY(-50%) scale(1)}' +
    '.zc-trust.zcp-t>*{opacity:0;transform:translateY(6px);transition:opacity .4s,transform .4s}.zc-trust.zcp-t.in>*{opacity:1;transform:none}' +
    '.zc-trust.zcp-t.in>*:nth-child(2){transition-delay:.15s}.zc-trust.zcp-t.in>*:nth-child(3){transition-delay:.3s}' +
    '@media (prefers-reduced-motion:reduce){.zcp-ok,.zc-trust.zcp-t>*{transition:none!important}}';
  document.head.appendChild(css);

  var V = {
    full_name: function (v) { return v.trim().length >= 3; },
    phone: function (v) { return /^01[0125]\d{8}$/.test(v); },
    address: function (v) { return v.trim().length >= 8; }
  };

  function checks() {
    Object.keys(V).forEach(function (k) {
      var el = document.querySelector('[name="' + k + '"]');
      if (!el) return;
      var box = el.closest('div.relative') || el.parentElement;
      if (!box.querySelector('.zcp-ok')) { var c = document.createElement('span'); c.className = 'zcp-ok'; c.textContent = '✓'; box.appendChild(c); }
      var ok = V[k](el.value);
      if (box.classList.contains('zcp-v') !== ok) box.classList.toggle('zcp-v', ok);
    });
  }

  function trust() {
    var zt = document.querySelector('.checkout_button .zc-trust');
    if (!zt || zt.classList.contains('zcp-t')) return;
    zt.classList.add('zcp-t');
    if (RM) { zt.classList.add('in'); return; }
    var t = setInterval(function () {   // first time on screen (tick: IntersectionObserver is unreliable in hidden tabs)
      if (!zt.isConnected) return clearInterval(t);
      var r = zt.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) { clearInterval(t); setTimeout(function () { zt.classList.add('in'); }, 150); }
    }, 250);
    setTimeout(function () { zt.classList.add('in'); }, 2500);   // safety: never stays hidden
  }

  function run() { if (!/^\/checkout/.test(location.pathname)) return; checks(); trust(); }
  var q = false;
  new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; run(); }); }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('input', run, true);
  document.addEventListener('change', run, true);
  run();
})();

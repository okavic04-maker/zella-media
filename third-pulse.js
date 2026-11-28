/* Zella — third-pulse (2026-11-28, owner «انشر»). Side cart with 2 offer pieces (bogo.js line «خد التالتة مجاناً، ضيف قطعة كمان…»):
   each time the cart opens in that state, «التالتة مجاناً» pops once with an orange glow. bogo.js keeps .zb-msg and only rewrites its innerHTML,
   so the class sits on .zb-msg and the CSS targets its <b>. Off under prefers-reduced-motion (the pill colour still shows). */
(function () {
  if (window.__zThirdPulse) return; window.__zThirdPulse = 1;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style'); css.id = 'ztp-css';
  css.textContent =
    '#zella-bogo-bar .zb-msg.ztp b{display:inline-block;padding:1px 8px;border-radius:999px;background:#fff7ed;color:#ea580c}' +
    '#zella-bogo-bar .zb-msg.ztp-go b{animation:ztpPop 1.1s ease 1}' +
    '@keyframes ztpPop{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(249,115,22,.55)}25%{transform:scale(1.18)}45%{transform:scale(.96)}65%{transform:scale(1.06)}100%{transform:scale(1);box-shadow:0 0 0 12px rgba(249,115,22,0)}}' +
    '@media (prefers-reduced-motion:reduce){#zella-bogo-bar .zb-msg.ztp-go b{animation:none}}';
  document.head.appendChild(css);
  var fired = false, lastX = null;
  function tick() {
    var m = document.querySelector('#zella-bogo-bar .zb-msg');
    var r = m && m.getBoundingClientRect();
    var open = !!(r && r.width > 0 && r.left >= 0 && r.right <= innerWidth + 1 && r.top < innerHeight);
    if (!open) { fired = false; lastX = null; return; }
    var b = m.querySelector('b');
    var ok = !!(b && /التالتة مجاناً/.test(b.textContent) && /ضيف قطعة كمان/.test(m.textContent));
    m.classList.toggle('ztp', ok);
    if (!ok) { m.classList.remove('ztp-go'); return; }
    var steady = lastX !== null && Math.abs(r.left - lastX) < 1; lastX = r.left;   // wait until the drawer stopped sliding
    if (fired || !steady || RM) return;
    fired = true;
    m.classList.remove('ztp-go'); void m.offsetWidth; m.classList.add('ztp-go');
    setTimeout(function () { m.classList.remove('ztp-go'); }, 1300);
    try { window.clarity && clarity('event', 'third_pulse'); } catch (e) {}
  }
  setInterval(tick, 200);
  window.__ztp = { replay: function () { fired = false; lastX = null; } };
})();

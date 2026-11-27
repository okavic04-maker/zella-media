/* Zella — cart-motion (2026-11-27; owner kept 1-4 of the tour, count-up and the reassurance lines are in preview/cart-motion.full.js). Motion in the same spirit as the product page (pdp-motion):
   every motion runs once per change, is off under prefers-reduced-motion, and never hides anything.
   1) «أضف للسلة» (page button, moving bar, «إصدارات تانية» cards): a small copy of the perfume picture flies to the
      header cart, and the count on the cart icon bounces.
   2) Offer bar: the progress line grows from where it was (not a jump); when a set completes, a few sparkles burst
      around the bar and the bar glows once.
   3) Shipping line: a small truck rides at the front of the shipping line and moves with it.
 */
(function () {
  if (window.__zCartMotion) return;
  window.__zCartMotion = 1;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TRUCK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230f766e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 7h11v9H3zM14 10h4l3 3v3h-7z'/%3E%3Ccircle cx='7' cy='17.5' r='1.6'/%3E%3Ccircle cx='17' cy='17.5' r='1.6'/%3E%3C/svg%3E\")";
  var css = document.createElement('style');
  css.id = 'zcm-css';
  css.textContent =
    '.zcm-fly{position:fixed;z-index:2147483600;border-radius:12px;object-fit:cover;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.25)}' +
    '.zcm-bump{animation:zcmBump .5s ease 1}@keyframes zcmBump{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}' +
    '#zella-bogo-bar{position:relative}' +
    '#zella-bogo-bar.zcm-glow{animation:zcmGlow 1.1s ease 1}@keyframes zcmGlow{0%{box-shadow:0 0 0 0 rgba(20,184,166,.55)}100%{box-shadow:0 0 0 14px rgba(20,184,166,0)}}' +
    '#zella-bogo-bar .zb-fill{transition:width .7s cubic-bezier(.3,.8,.3,1)!important}' +
    '.zcm-sp{position:absolute;width:7px;height:7px;border-radius:50%;pointer-events:none;animation:zcmSp .8s ease-out forwards}' +
    '@keyframes zcmSp{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--x),var(--y)) scale(.3);opacity:0}}' +
    '#zella-bogo-bar .zb-ship .zb-track{position:relative;overflow:visible!important;margin-top:17px!important}' +
    '#zella-bogo-bar .zb-ship .zb-fill{position:relative}' +
    '#zella-bogo-bar .zb-ship .zb-fill:after{content:"";position:absolute;left:-9px;top:-14px;width:18px;height:18px;background:' + TRUCK + ' center/contain no-repeat;transform:scaleX(-1)}' +
    '@media (prefers-reduced-motion:reduce){#zella-bogo-bar .zb-fill{transition:none!important}}';
  document.head.appendChild(css);

  function cartBtn() { var s = [].find.call(document.querySelectorAll('header span.sr-only'), function (e) { return /items in cart/.test(e.textContent); }); return s && s.closest('button'); }

  // 1) fly to the cart
  function fly(img) {
    var to = cartBtn(); if (!img || !to || RM) return;
    var a = img.getBoundingClientRect(), b = to.getBoundingClientRect(); if (!a.width) return;
    var s = Math.min(90, a.width), c = document.createElement('img');
    c.src = img.currentSrc || img.src; c.className = 'zcm-fly';
    c.style.width = c.style.height = s + 'px'; c.style.left = (a.left + a.width / 2 - s / 2) + 'px'; c.style.top = (a.top + a.height / 2 - s / 2) + 'px';
    document.body.appendChild(c);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    var an = c.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 60) + 'px) scale(.6)', opacity: 1, offset: .55 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.15)', opacity: .3 }], { duration: 750, easing: 'cubic-bezier(.4,0,.2,1)' });
    an.onfinish = function () { c.remove(); bump(); };
    setTimeout(function () { if (c.isConnected) c.remove(); }, 1500);
  }
  function bump() { var b = cartBtn(); var n = b && b.querySelector('span:not(.sr-only)'); var el = n || b; if (!el) return; el.classList.remove('zcm-bump'); void el.offsetWidth; el.classList.add('zcm-bump'); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button'); if (!b) return;
    var t = b.textContent.replace(/\s+/g, ' ').trim(); if (!/^\+? ?أضف للسلة/.test(t)) return;
    if (b.closest('[data-cart="panel-inner"]') || b.closest('#zop')) return;   // the offer box has its own motion
    var img = null;
    var card = b.closest('#zella-related a, #zella-related [class*=card], #zella-related > * > *');
    if (card) img = card.querySelector('img');
    if (!img && b.closest('section.fixed')) img = b.closest('section.fixed').querySelector('img');
    if (!img) img = document.querySelector('.p_gallery_container img');
    setTimeout(function () { fly(img); }, 30);
  }, true);

  // 2-3) the offer bar
  var lastFree = null, lastShip = null;
  function freeCount() { var m = (document.querySelector('#zella-bogo-bar .zb-next') || {}).textContent; m = m && m.match(/\((\d+) مجاناً\)/); return m ? +m[1] : 0; }
  function sparkle(bar) {
    if (RM) return;
    var r = bar.getBoundingClientRect(), cols = ['#14b8a6', '#f97316', '#facc15', '#22c55e'];
    for (var i = 0; i < 12; i++) {
      var d = document.createElement('i'); d.className = 'zcm-sp';
      var ang = (i / 12) * Math.PI * 2, dist = 40 + Math.random() * 30;
      d.style.left = (r.width / 2) + 'px'; d.style.top = '18px'; d.style.background = cols[i % 4];
      d.style.setProperty('--x', Math.cos(ang) * dist + 'px'); d.style.setProperty('--y', Math.sin(ang) * dist * 0.6 + 'px');
      bar.appendChild(d); setTimeout(function (x) { x.remove(); }.bind(null, d), 900);
    }
    bar.classList.remove('zcm-glow'); void bar.offsetWidth; bar.classList.add('zcm-glow');
  }
  function ship(bar) {   // bogo.js rebuilds the shipping line: grow it from the last width instead of jumping
    var f = bar.querySelector('.zb-ship .zb-fill'); if (!f || f.dataset.zcm) return;
    f.dataset.zcm = 1;
    var to = f.style.width;
    if (lastShip !== null && lastShip !== to && !RM) { f.style.transition = 'none'; f.style.width = lastShip; void f.offsetWidth; f.style.transition = ''; requestAnimationFrame(function () { f.style.width = to; }); }
    lastShip = to;
  }
  function bar() {
    // the last numbers are kept while the cart is closed, so reopening it after an add still animates the change
    var b = document.getElementById('zella-bogo-bar'); if (!b) return;
    var fc = freeCount();
    if (lastFree !== null && fc > lastFree) setTimeout(function () { if (b.isConnected) sparkle(b); }, 450);   // after the cart slides in
    lastFree = fc;
    ship(b);
  }

  function tick() { try { bar(); } catch (e) {} }
  var q = false;
  new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; tick(); }); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  window.__zcm = { fly: fly, sparkle: function () { var b = document.getElementById('zella-bogo-bar'); if (b) sparkle(b); }, bump: bump };
  tick();
})();

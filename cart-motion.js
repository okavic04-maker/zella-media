/* Zella — cart-motion (2026-11-27 PREVIEW of fly-into-cart, live is abb8f19 = preview/cart-motion.live-abb8f19.js; owner kept 1-4 of the tour, count-up and the reassurance lines are in preview/cart-motion.full.js). Motion in the same spirit as the product page (pdp-motion):
   every motion runs once per change, is off under prefers-reduced-motion, and never hides anything.
   1) «أضف للسلة» (page button, moving bar, «إصدارات تانية» cards): a small copy of the perfume picture flies to the
      new row inside the side cart (the theme opens the cart by itself), and that row glows once.
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
    (PV ? '.zcm-fly{display:none!important}' : '') + '.zcm-fly,.zcm-fly2{position:fixed;z-index:2147483600;border-radius:12px;object-fit:cover;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.25)}' +
    '.zcm-bump{animation:zcmBump .5s ease 1}@keyframes zcmBump{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}' +
    '#zella-bogo-bar{position:relative}' +
    '[data-cart="item"].zcm-row{animation:zcmRow 1.2s ease 1}@keyframes zcmRow{0%{background:rgba(20,184,166,.28)}100%{background:transparent}}' +
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

  // 1) fly to the cart. The theme opens the side cart ~150 ms after the click (fully in at ~500 ms, over the header
  //    icon), so the picture waits where it is, then lands on its own row inside the open cart and that row glows once.
  //    If the cart does not open (or the row is not found in 2 s) it flies to the header icon as before.
  var PV = !!window.__zCartMotionPrev, FC = PV ? 'zcm-fly2' : 'zcm-fly';
  function rowFor(slug) {
    var sec = document.querySelector('[data-cart="items-section"]'); if (!sec || !sec.offsetParent) return null;
    return [].find.call(sec.querySelectorAll('[data-cart="item"]'), function (li) { var a = li.querySelector('a[href*="/products/"]'); return a && decodeURIComponent(a.getAttribute('href').split('/products/')[1].split(/[?#]/)[0]) === slug; }) || null;
  }
  function fly(img, slug, from) {
    if (!img || RM) return;
    var a = img.getBoundingClientRect(); if (!a.width) return;
    // picture scrolled off the screen (customer is lower on the page): start from the button that was pressed
    if ((a.bottom < 40 || a.top > innerHeight - 40) && from) { var fb = from.getBoundingClientRect(); a = { left: fb.left + fb.width / 2 - 45, top: fb.top + fb.height / 2 - 45, width: 90, height: 90 }; }
    var s = Math.min(90, a.width), c = document.createElement('img');
    c.src = img.currentSrc || img.src; c.className = FC;
    var x0 = a.left + a.width / 2 - s / 2, y0 = a.top + a.height / 2 - s / 2;
    c.style.width = c.style.height = s + 'px'; c.style.left = x0 + 'px'; c.style.top = y0 + 'px';
    document.body.appendChild(c);
    c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 300 });   // a small lift while the cart opens
    var t0 = Date.now(), lastX = null;
    (function wait() {
      var li = slug && rowFor(slug), pic = li && li.querySelector('img');
      var r = pic && pic.getBoundingClientRect();
      var inView = r && r.width && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight;
      var steady = inView && lastX !== null && Math.abs(r.left - lastX) < 1;   // the drawer is open and stopped sliding
      lastX = r ? r.left : null;
      if (steady) return land(c, x0, y0, s, r, li);
      if (Date.now() - t0 > 2000) { var to = cartBtn(); return to ? land(c, x0, y0, s, to.getBoundingClientRect(), null, true) : c.remove(); }
      setTimeout(wait, 60);
    })();
  }
  function land(c, x0, y0, s, r, li, icon) {
    var dx = r.left + r.width / 2 - (x0 + s / 2), dy = r.top + r.height / 2 - (y0 + s / 2), k = icon ? .15 : Math.max(.3, r.width / s);
    var an = c.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * .5 + 'px,' + (dy * .5 - 50) + 'px) scale(' + ((1 + k) / 2) + ')', opacity: 1, offset: .55 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')', opacity: icon ? .3 : .9 }], { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)' });
    an.onfinish = function () { c.remove(); if (li) glow(li); else bump(); };
    setTimeout(function () { if (c.isConnected) c.remove(); }, 1600);
  }
  function glow(li) { li.classList.remove('zcm-row'); void li.offsetWidth; li.classList.add('zcm-row'); setTimeout(function () { li.classList.remove('zcm-row'); }, 1300); }
  function bump() { var b = cartBtn(); var n = b && b.querySelector('span:not(.sr-only)'); var el = n || b; if (!el) return; el.classList.remove('zcm-bump'); void el.offsetWidth; el.classList.add('zcm-bump'); }
  function pageSlug() { var m = location.pathname.match(/^\/products\/([^\/?#]+)/); return m ? decodeURIComponent(m[1]) : null; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button'); if (!b) return;
    var t = b.textContent.replace(/\s+/g, ' ').trim(); if (!/^\+? ?أضف للسلة/.test(t)) return;
    if (b.closest('[data-cart="panel-inner"]') || b.closest('#zop')) return;   // the offer box has its own motion
    var img = null, slug = null;
    var card = b.closest('#zella-related a, #zella-related [class*=card], #zella-related > * > *');
    if (card) { img = card.querySelector('img'); var ln = card.matches('a[href*="/products/"]') ? card : card.querySelector('a[href*="/products/"]'); if (ln) slug = decodeURIComponent(ln.getAttribute('href').split('/products/')[1].split(/[?#]/)[0]); }
    if (!img && b.closest('section.fixed')) img = b.closest('section.fixed').querySelector('img');
    if (!img) img = document.querySelector('.p_gallery_container img');
    if (!slug) slug = pageSlug();
    setTimeout(function () { fly(img, slug, b); }, 30);
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

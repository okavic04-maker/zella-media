/* Zella — motion-more (live 2026-11-27 on the owner's «انشر»). More motion in the same spirit as pdp-motion / cart-motion:
   transform + opacity only (no layout shift), each runs once, off under prefers-reduced-motion, and anything that
   starts hidden is forced visible after 2.5 s (zdone safety) even if its motion never runs.
   1) Home: the collection circles (#zella-cols) come in one after another.
   2) Home / collection cards: «أضف للسلة / Add to Cart» on a card -> the card picture flies into the side cart and
      lands on its row (uses cart-motion.js's fly, which already does this on product pages).
   3) Home: the review circles (#zella-reviews) pulse once, one after another, so people see they open.
   4) Product page: the «إصدارات تانية» cards come in one after another.
   5) Product page: the main picture settles with a soft zoom (1.06 -> 1) once.
   6) Product page: the moving «أضف للسلة» bar slides up instead of appearing at once.
   7) Side cart: a removed perfume row folds away softly instead of vanishing. */
(function () {
  if (window.__zMotionMore) return;
  window.__zMotionMore = 1;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.id = 'zmm-css';
  css.textContent =
    '.zmm-in{opacity:0;transform:translateY(14px) scale(.96);transition:opacity .45s ease,transform .45s cubic-bezier(.3,.8,.3,1)}' +
    '.zmm-in.zmm-on,.zmm-in.zdone{opacity:1;transform:none}' +
    '.zmm-pulse{animation:zmmPulse .6s ease 1}@keyframes zmmPulse{0%{transform:scale(1)}45%{transform:scale(1.1)}100%{transform:scale(1)}}' +
    '.zmm-zoom{animation:zmmZoom 1.1s cubic-bezier(.2,.7,.3,1) 1}@keyframes zmmZoom{0%{transform:scale(1.06)}100%{transform:scale(1)}}' +
    'section.fixed.inset-x-5>div.bottom-0.w-full.zck-mbar-show{animation:zmmUp .35s cubic-bezier(.3,.8,.3,1) 1}@keyframes zmmUp{0%{transform:translateY(110%)}100%{transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.zmm-in{opacity:1;transform:none;transition:none}.zmm-pulse,.zmm-zoom,section.fixed.inset-x-5>div.bottom-0.w-full.zck-mbar-show{animation:none}.zmm-ghost{display:none}}';
  document.head.appendChild(css);

  function onScreen(el) { var r = el.getBoundingClientRect(); return r.width && r.top < innerHeight - 30 && r.bottom > 0; }
  function whenSeen(el, fn) { if (RM) return fn(); var t = setInterval(function () { if (!el.isConnected) return clearInterval(t); if (onScreen(el)) { clearInterval(t); fn(); } }, 200); }
  // items come in one after another; safety: all visible after 2.5 s
  function stagger(items, gap) {
    if (!items.length || items[0].dataset.zmm) return;
    items.forEach(function (x) { x.dataset.zmm = 1; if (!RM) x.classList.add('zmm-in'); });
    if (RM) return;
    setTimeout(function () { items.forEach(function (x) { x.classList.add('zdone'); }); }, 2500);
    whenSeen(items[0], function () { items.forEach(function (x, i) { setTimeout(function () { x.classList.add('zmm-on'); }, 60 + i * gap); }); });
  }

  // 1) home circles
  function cols() { var c = document.getElementById('zella-cols'); if (c) stagger([].slice.call(c.querySelectorAll('a')), 90); }
  // 3) review circles
  function reviews() {
    var row = document.querySelector('#zella-reviews .zrv-row'); if (!row || row.dataset.zmm || RM) return;
    var kids = [].slice.call(row.children).slice(0, 6); if (!kids.length) return;
    row.dataset.zmm = 1;
    whenSeen(row, function () { kids.forEach(function (k, i) { setTimeout(function () { k.classList.remove('zmm-pulse'); void k.offsetWidth; k.classList.add('zmm-pulse'); }, 300 + i * 140); }); });
  }
  // 4) related cards
  function related() {
    var r = document.getElementById('zella-related'); if (!r) return;
    var cards = [].filter.call(r.querySelectorAll('a[href*="/products/"]'), function (a) { return a.querySelector('img'); });
    stagger(cards.slice(0, 8), 110);
  }
  // 5) main picture
  var zoomed = '';
  function zoom() {
    if (RM || !/^\/products\//.test(location.pathname) || zoomed === location.pathname) return;
    var img = document.querySelector('.p_gallery_container img'); if (!img || !img.complete || !img.naturalWidth) return;
    zoomed = location.pathname; img.classList.add('zmm-zoom');
    setTimeout(function () { img.classList.remove('zmm-zoom'); }, 1300);
  }

  // 2) card add -> fly into the cart (product pages are handled by cart-motion.js itself)
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button'); if (!b) return;
    if (!/^\+?\s*(أضف للسلة|add to cart)$/i.test(b.textContent.replace(/\s+/g, ' ').trim())) return;
    if (b.closest('.p_details_container,#zella-related,#zop,[data-cart="panel-inner"],section.fixed')) return;
    var card = b; for (var i = 0; i < 7 && card; i++) { if (card.querySelector && card.querySelector('img') && card.querySelector('a[href*="/products/"]')) break; card = card.parentElement; }
    if (!card || !window.__zcm || !window.__zcm.fly) return;
    var a = card.querySelector('a[href*="/products/"]'), slug = decodeURIComponent(a.getAttribute('href').split('/products/')[1].split(/[?#]/)[0]);
    var img = card.querySelector('img');
    setTimeout(function () { window.__zcm.fly(img, slug, b); }, 30);
  }, true);

  // 7) removed row folds away (the theme removes it after its own call; if it is still there after 2 s, show it again)
  document.addEventListener('click', function (e) {
    if (RM) return;
    var t = e.target.closest && e.target.closest('button'); if (!t || !t.querySelector('svg.text-red-600')) return;
    var li = t.closest('[data-cart="item"]'); if (!li) return;
    // the theme drops the row within ~150 ms, so a copy of it slides away in the same place
    var r = li.getBoundingClientRect(), c = li.cloneNode(true);
    c.removeAttribute('data-cart'); c.className = (c.className || '') + ' zmm-ghost';
    c.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;margin:0;z-index:2147483500;pointer-events:none;background:#fff;box-sizing:border-box;overflow:hidden';
    document.body.appendChild(c);
    var an = c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-40px) scale(.96)' }], { duration: 380, easing: 'ease-in', delay: 60 });
    an.onfinish = function () { c.remove(); }; setTimeout(function () { if (c.isConnected) c.remove(); }, 1200);
  }, true);

  function tick() { try { cols(); reviews(); related(); zoom(); } catch (e) {} }
  var q = false;
  new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; tick(); }); }).observe(document.body, { childList: true, subtree: true });
  window.__zmm = { replay: function (what) {
    if (what === 'cols') { var c = document.querySelectorAll('#zella-cols a'); [].forEach.call(c, function (x) { x.classList.remove('zmm-on', 'zdone'); }); void document.body.offsetWidth; [].forEach.call(c, function (x, i) { setTimeout(function () { x.classList.add('zmm-on'); }, 300 + i * 90); }); }
    if (what === 'related') { var r = [].filter.call(document.querySelectorAll('#zella-related a[href*="/products/"]'), function (a) { return a.querySelector('img'); }).slice(0, 8); r.forEach(function (x) { x.classList.remove('zmm-on', 'zdone'); }); void document.body.offsetWidth; r.forEach(function (x, i) { setTimeout(function () { x.classList.add('zmm-on'); }, 300 + i * 110); }); }
    if (what === 'reviews') { var row = document.querySelector('#zella-reviews .zrv-row'); if (row) [].slice.call(row.children, 0, 6).forEach(function (k, i) { setTimeout(function () { k.classList.remove('zmm-pulse'); void k.offsetWidth; k.classList.add('zmm-pulse'); }, 200 + i * 140); }); }
    if (what === 'zoom') { var img = document.querySelector('.p_gallery_container img'); if (img) { img.classList.remove('zmm-zoom'); void img.offsetWidth; img.classList.add('zmm-zoom'); } }
  } };
  tick();
})();

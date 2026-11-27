/* Zella — cart-plus (2026-11-27, owner kept parts 1-4 of the tour + empty-cart button; «كمّل العرض» suggestions kept in preview/cart-plus.full.js). Runs next to bogo.js (which keeps all the offer maths: it
   matched the real checkout at 1-8 pieces) and only changes how the side cart looks and helps:
   1) Compact offer bar: one message line + thin progress, details (dots, second line) hidden -> more room for items.
   2) Item tags: emoji at the END («مجاناً 🎁»), «الاتنين مجاناً» instead of «2 من 2 مجاناً», and once a set is done
      the other offer pieces say «في العرض ✓» instead of «اشتري 2 واحصل على 1 مجاناً».
   3) Theme lines in our words: «الشحن مجاني على طلبك 🚚», «فاضلك X ج.م والشحن يبقى مجاني 🚚».
   4) Empty cart: «تسوق دلوقتي» button.
   Motion: the free tag pops once when it first appears; off under prefers-reduced-motion. */
(function () {
  if (window.__zCartPlus) return;
  window.__zCartPlus = 1;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.id = 'zcap-css';
  css.textContent =
    '#zella-bogo-bar{padding:8px 10px!important;margin-bottom:8px!important}' +
    '#zella-bogo-bar .zb-msg{font-size:13px!important;line-height:1.45!important}' +
    '#zella-bogo-bar .zb-msg br,#zella-bogo-bar .zb-sub,#zella-bogo-bar .zb-dots{display:none!important}' +
    '#zella-bogo-bar .zb-msg .zb-ok{display:block}' +
    '#zella-bogo-bar .zb-progress{margin:6px 0 4px!important;height:auto!important;padding:0!important}' +
    '#zella-bogo-bar .zb-progress .zb-track{height:6px!important}' +
    '#zella-bogo-bar .zb-next{font-size:12px!important;margin:0!important}' +
    '#zella-bogo-bar .zb-ship{font-size:12px!important;margin-top:4px!important}' +
    '#zella-bogo-bar .zb-ship .zb-track{height:4px!important;margin-top:3px!important}' +
    '.zb-tag:not(.zcap-t){display:none!important}.zcap-t>span{display:inline-block}' +
    '.zcap-pop{animation:zcapPop .5s ease 1}@keyframes zcapPop{0%{transform:scale(.6)}60%{transform:scale(1.15)}100%{transform:scale(1)}}' +
    '#zcap-e{display:block;margin:14px auto 0;width:max-content;padding:11px 26px;border-radius:12px;background:#14b8a6;color:#fff;font:800 15px Almarai,inherit;text-decoration:none}' +
    '@media (prefers-reduced-motion:reduce){.zcap-pop{animation:none}}';
  document.head.appendChild(css);

  function cartLines() {
    return [].map.call(document.querySelectorAll('[data-cart="item"]'), function (li) {
      var a = li.querySelector('a[href*="/products/"]'), q = li.querySelector('[data-cart="item-quantity"]');
      return { li: li, slug: a ? decodeURIComponent(a.getAttribute('href').split('/products/')[1].split(/[?#]/)[0]) : '', qty: q ? parseInt(q.textContent, 10) || 0 : 0 };
    });
  }

  // bogo.js rewrites .zb-tag's innerHTML whenever it differs from its own, so we never edit it: its span is hidden
  // by CSS and our own copy sits right after it.
  function tags() {
    var lines = cartLines(), anyFree = false;
    lines.forEach(function (l) { if (l.li.querySelector('.zb-tag-free')) anyFree = true; });
    lines.forEach(function (l) {
      var tag = l.li.querySelector('.zb-tag'); if (!tag) return;
      var src = tag.firstElementChild; if (!src) return;
      var cls = src.className, t = src.textContent.replace(/[🎁🏷️]/gu, '').replace(/️/g, '').trim(), want;
      if (cls === 'zb-tag-free') { var m = t.match(/^(\d+) من (\d+) مجاناً$/); want = (m && m[1] === m[2] ? (m[1] === '2' ? 'الاتنين' : 'الـ' + m[1]) + ' مجاناً' : t) + ' 🎁'; }
      else if (cls === 'zb-tag-offer') want = anyFree ? 'في العرض ✓' : t + ' 🏷️';
      else if (cls === 'zb-tag-half') want = t + ' 🏷️';
      else want = t;
      var mine = tag.nextElementSibling && tag.nextElementSibling.classList.contains('zcap-t') ? tag.nextElementSibling : null;
      if (!mine) { mine = document.createElement('div'); mine.className = 'zb-tag zcap-t'; tag.insertAdjacentElement('afterend', mine); }
      var html = '<span class="' + cls + '">' + want + '</span>';
      if (mine.innerHTML !== html) {
        var pop = cls === 'zb-tag-free' && mine.dataset.c !== 'zb-tag-free' && !RM;
        mine.innerHTML = html; mine.dataset.c = cls;
        if (pop) mine.firstChild.classList.add('zcap-pop');
      }
    });
  }

  function shipText() {
    var s = document.querySelector('#zella-bogo-bar .zb-ship');
    if (!s || !s.firstChild || s.firstChild.nodeType !== 3) return;
    var t = s.firstChild.nodeValue, n;
    if (/لقد حصلت على شحن مجاني/.test(t)) n = 'الشحن مجاني على طلبك 🚚';
    else { var m = t.match(/على بُعد\s*([\d,.]+)\s*ج\.م/); if (m) n = 'فاضلك ' + m[1].replace(/\.00$/, '') + ' ج.م والشحن يبقى مجاني 🚚'; }
    if (n && t !== n) s.firstChild.nodeValue = n;
  }

  function empty() {
    var p = document.querySelector('[data-cart="panel-inner"]') || document.body;
    var h = [].find.call(p.querySelectorAll('h1,h2,h3,p,div'), function (e) { return !e.children.length && /سلة المشتريات فارغة/.test(e.textContent); });
    if (!h || document.getElementById('zcap-e')) return;
    var a = document.createElement('a'); a.id = 'zcap-e'; a.href = '/'; a.textContent = 'تسوق دلوقتي';
    var host = h.parentElement.parentElement || h.parentElement;
    host.appendChild(a);
  }

  function tick() { try { tags(); shipText(); empty(); } catch (e) {} }
  var q = false;
  new MutationObserver(function () { if (q) return; q = true; requestAnimationFrame(function () { q = false; tick(); }); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  tick();
})();

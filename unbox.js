/* Zella Store: Unboxing videos on the homepage (hosted on GitHub, loaded by one line in the head code).
   To add a video: upload <name>.mp4, <name>-card.mp4 and <name>-card.jpg to the repo, add a line to VIDS,
   and set CDN to the new commit (jsDelivr is slow to refresh files on @main). */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@b30bc06b1c/';
  var API = 'https://api.easy-orders.net/api/v1/';
  var VIDS = [
    { f: 'uomo-born-in-roma', n: 'Valentino Uomo Born in Roma', s: 'borninroma', g: 'm' },
    { f: 'donna-born-in-roma', n: 'Valentino Donna Born in Roma', s: 'donnaborninroma', g: 'w' },
    { f: 'ysl-y-edp', n: 'YSL Y EDP', s: 'yysl', g: 'm' },
    { f: 'black-orchid', n: 'Tom Ford Black Orchid', s: 'orcblack', g: 'm', b: ['bundle-2plus1-orchid-bleu-eros'] },
    { f: 'bleu-de-chanel', n: 'Bleu de Chanel EDP', s: 'bleuchanel', g: 'm', b: ['bundle-2plus1-orchid-bleu-eros'] },
    { f: 'dior-sauvage', n: 'Dior Sauvage EDP', s: 'sauvagehigh', g: 'm', b: ['bundle2-999111'] },
    { f: '212-sexy-men', n: '212 Sexy Men', s: 'sexyman', g: 'm', b: ['bundle2-999111'] },
    { f: 'libre-intense', n: 'Libre EDP Intense', s: 'lIntense', g: 'w', b: ['4mokrrwith999'] },
    { f: 'versace-eros', n: 'Versace Eros EDP', s: 'VersaceErosEaudeParfum', g: 'm', b: ['bundle-2plus1-orchid-bleu-eros', 'bundle2-999111', '4mokrrwith999'] },
    { f: 'bvlgari-man-in-black', n: 'Bvlgari Man in Black', s: 'bvg', g: 'm', b: ['bundle23-1000'] },
    { f: 'sauvage-elixir', n: 'Sauvage Elixir', s: 'sauvel', g: 'm', b: ['bundle23-1000'] }
  ];
  // b = bundle pages that also show this video (all the bundle's videos play one after another)
  function onPage(x, slug) { return x.s === slug || (x.b && x.b.indexOf(slug) > -1); }
  var filter = '', list = VIDS; // list = the videos the viewer goes through (after the For Him / For Her filter)

  var css = ''
    + '#zub{direction:ltr;text-align:center;margin:26px 0 8px}'
    + '#zub .t{font-size:20px;font-weight:700;color:#202227}'
    + '#zub .s{font-size:13px;color:#6b7280;margin:4px 0 12px}'
    + '#zub .row{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:0 16px;scroll-snap-type:x mandatory;justify-content:safe center}'
    + '#zub .row::-webkit-scrollbar{display:none}'
    + '#zub button{position:relative;flex:0 0 140px;height:248px;border:0;padding:0;border-radius:16px;overflow:hidden;background:#111;cursor:pointer;scroll-snap-align:start}'
    + '#zub button video{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}'
    + '#zub button:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.7),transparent 32%,transparent 62%,rgba(0,0,0,.8))}'
    + '#zub .p{position:absolute;top:50%;left:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:rgba(0,0,0,.35);border:2px solid #fff;z-index:1}'
    + '#zub .p:before{content:"";position:absolute;left:14px;top:10px;border-style:solid;border-width:8px 0 8px 13px;border-color:transparent transparent transparent #fff}'
    + '#zub .n{position:absolute;left:8px;right:8px;top:10px;z-index:1;color:#fff;font-size:12px;font-weight:700;text-align:left;line-height:1.25}'
    + '#zub .pr{position:absolute;left:8px;bottom:9px;z-index:1;color:#fff;font-size:14px;font-weight:800;text-align:left}'
    + '#zub .pr s{display:block;font-size:11px;font-weight:600;opacity:.75}'
    + '#zub .off{position:absolute;right:8px;bottom:10px;z-index:1;background:#c9a24d;color:#000;font-size:11px;font-weight:800;padding:3px 7px;border-radius:20px}'
    + '.zub-view{direction:ltr;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center}'
    + '.zub-view video{max-width:100%;max-height:calc(100% - 240px);border-radius:12px;background:#000}' // فراغ شفاف فوق وتحت الفيديو زي الريفيوز، الدوسة عليه تقفل
   
    + '.zub-bar{position:absolute;top:10px;left:10px;right:10px;height:3px;background:rgba(255,255,255,.35);border-radius:2px;z-index:2}'
    + '.zub-bar{display:flex;gap:4px;background:none}.zub-bar s{flex:1;height:100%;background:rgba(255,255,255,.35);border-radius:2px;overflow:hidden;text-decoration:none}'
    + '.zub-bar i{display:block;height:100%;width:0;background:#fff;border-radius:2px}'
    + '.zub-x{position:absolute;top:18px;right:10px;z-index:3;background:none;border:0;color:#fff;font-size:32px;line-height:1;cursor:pointer}'
    + '.zub-a{position:absolute;top:50%;left:8px;z-index:3;width:34px;height:34px;margin-top:-17px;border-radius:50%;background:rgba(255,255,255,.85);color:#000;font:700 26px/30px Arial;text-align:center;cursor:pointer}'
    + '.zub-a.r{left:auto;right:8px}'
    + '.zub-foot{position:absolute;left:16px;right:16px;bottom:16px;z-index:3;display:flex;gap:8px;max-width:420px;margin:0 auto}'
    + '.zub-foot a,.zub-foot button{flex:1;padding:13px 8px;border-radius:14px;font-weight:700;font-size:14px;text-align:center;text-decoration:none;cursor:pointer;font-family:inherit}'
    + '.zub-foot a{flex:0 0 34%;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.6)}'
    + '.zub-add{background:#fff;color:#000;border:0}'
    + '.zub-add.done{background:#16a34a;color:#fff}'
    + '.zub-add.so{background:#9ca3af;color:#fff;cursor:default}'
    + '#zub .off.so{background:#fff;color:#000}'
    + '#zub .tabs{display:flex;justify-content:center;gap:6px;margin:0 0 12px}'
    + '#zub .tabs b{padding:6px 14px;border-radius:20px;border:1px solid #d1d5db;font-size:12px;font-weight:700;color:#374151;cursor:pointer}'
    + '#zub .tabs b.on{background:#000;border-color:#000;color:#fff}'
    + '.zub-offer{position:absolute;left:16px;right:16px;bottom:70px;z-index:3;max-width:420px;margin:0 auto;box-sizing:border-box;text-align:center;color:#fff;font-size:12px;font-weight:700;background:rgba(201,162,77,.92);color:#000;padding:7px;border-radius:10px}'
    + '.zub-end{color:#fff;text-align:center;padding:0 28px}'
    + '.zub-end .h{font-size:22px;font-weight:800;margin-bottom:6px}'
    + '.zub-end .d{font-size:13px;opacity:.8;margin-bottom:18px}'
    + '.zub-end a{display:block;margin:8px auto;max-width:280px;padding:13px;border-radius:14px;background:#fff;color:#000;font-weight:700;text-decoration:none}'
    + '.zub-end a+a{background:transparent;color:#fff;border:1px solid #fff}'
    + '#zub-pp{display:flex;align-items:center;gap:10px;margin:12px 0 4px;padding:8px 12px 8px 8px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;cursor:pointer;width:100%;direction:ltr;font-family:inherit}'
    + '#zub-pp video{width:44px;height:60px;object-fit:cover;border-radius:8px;flex:none;pointer-events:none}'
    + '#zub-pp span{flex:1;text-align:left;font-size:14px;font-weight:700;color:#111}'
    + '#zub-pp small{display:block;font-size:11px;font-weight:500;color:#6b7280}'
    + '#zub-pp i{font-style:normal;width:30px;height:30px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px}';
  function addCss() {
    if (document.getElementById('zub-css')) return;
    var st = document.createElement('style'); st.id = 'zub-css'; st.textContent = css; document.head.appendChild(st);
  }
  // home cards: the video file loads only when its card is near the screen (speed, 2026-11-21); the poster shows until then
  var lazyObs = null;
  function lazyCards(root) {
    var vids = [].slice.call(root.querySelectorAll('video[data-src]'));
    function go(v) { if (!v.dataset.src) return; v.src = v.dataset.src; v.removeAttribute('data-src'); v.muted = true; var q = v.play(); if (q && q.catch) q.catch(function () {}); }
    if (!('IntersectionObserver' in window)) { vids.forEach(go); return; }
    if (!lazyObs) lazyObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { lazyObs.unobserve(e.target); go(e.target); } });
    }, { rootMargin: '200px' });
    vids.forEach(function (v) { lazyObs.observe(v); });
  }
  function muteplay(root) { root.querySelectorAll('video').forEach(function (v) { v.muted = true; var q = v.play(); if (q && q.catch) q.catch(function () {}); }); } // autoplay needs muted set in code

  var info = {}, infoLoading = false;
  function loadInfo() { // price + id of each product, from the store's public API
    if (infoLoading) return; infoLoading = true;
    fetch(API + 'products?limit=20&fields=id,slug,price,sale_price,quantity,track_stock&filter=slug||$in||' + VIDS.map(function (v) { return v.s; }).join(','))
      .then(function (r) { return r.json(); })
      .then(function (j) { (j.data || j || []).forEach(function (p) { info[p.slug] = p; }); fillPrices(); })
      .catch(function () {});
  }
  function money(x) { return Math.round(x).toLocaleString('en-US'); }
  function priceOf(p) { return p.sale_price && p.sale_price < p.price ? p.sale_price : p.price; }
  function soldOut(p) { return p && p.track_stock && !(p.quantity > 0); }

  function cardInfo(v) { // price + discount / sold-out tag on a card
    var p = info[v.s];
    if (!p) return '';
    var now = priceOf(p), off = '';
    if (now < p.price) off = '<span class="off">-' + Math.round((1 - now / p.price) * 100) + '%</span>';
    if (soldOut(p)) off = '<span class="off so">Sold out</span>';
    return '<span class="pr">' + (now < p.price ? '<s>' + money(p.price) + ' EGP</s>' : '') + money(now) + ' EGP</span>' + off;
  }
  function fillPrices() { // prices arrived: add them to the cards in place, so the card videos don't download again
    var el = document.getElementById('zub');
    if (!el) return;
    el.querySelectorAll('[data-zub]').forEach(function (b) {
      if (b.querySelector('.pr')) return;
      b.insertAdjacentHTML('beforeend', cardInfo(list[+b.getAttribute('data-zub')]));
    });
  }

  function render() {
    renderProductPage();
    var old = document.getElementById('zub');
    if (location.pathname !== '/') { if (old) old.remove(); return; }
    if (old) return;
    var anchor = document.getElementById('zella-reviews');
    if (!anchor) return;
    addCss();
    loadInfo();
    list = VIDS.filter(function (v) { return !filter || v.g === filter; });
    var el = document.createElement('div');
    el.id = 'zub';
    el.innerHTML = '<div class="t">Unboxing</div><div class="s">See the real bottle before you order</div>'
      + '<div class="tabs">' + [['', 'All'], ['m', 'For Him'], ['w', 'For Her']].map(function (x) { return '<b data-zubf="' + x[0] + '"' + (filter === x[0] ? ' class="on"' : '') + '>' + x[1] + '</b>'; }).join('') + '</div>'
      + '<div class="row">'
      + list.map(function (v, i) {
        return '<button type="button" data-zub="' + i + '"><video data-src="' + CDN + v.f + '-card.mp4" poster="' + CDN + v.f + '-card.jpg" muted loop playsinline preload="none"></video>'
          + '<span class="p"></span><span class="n">' + v.n + '</span>' + cardInfo(v) + '</button>';
      }).join('') + '</div>';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    lazyCards(el);
  }

  // product page: "Watch unboxing" button under the product name, when that product has a video
  function renderProductPage() {
    var m = location.pathname.match(/^\/products\/([^\/?#]+)/);
    var old = document.getElementById('zub-pp');
    var slug = m && decodeURIComponent(m[1]);
    var v = m && VIDS.filter(function (x) { return onPage(x, slug); })[0];
    if (!v) { if (old) old.remove(); return; }
    if (old && old.dataset.s === slug) return;
    if (old) old.remove();
    var h1 = document.querySelector('h1.product_name');
    if (!h1) return;
    addCss();
    loadInfo();
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'zub-pp'; b.dataset.s = slug;
    b.innerHTML = '<video src="' + CDN + v.f + '-card.mp4" poster="' + CDN + v.f + '-card.jpg" muted autoplay loop playsinline preload="metadata"></video>'
      + '<span>Watch the real unboxing<small>See the bottle before you order</small></span><i>▶</i>';
    var at = getComputedStyle(h1.parentElement).display.indexOf('flex') > -1 ? h1.parentElement : h1; // the name sits in a flex row: go under the row
    at.insertAdjacentElement('afterend', b);
    muteplay(b);
  }

  function newestFirst() { /* men & women collections open on "الأحدث" so the newest perfumes come first */ if (/^\/collections\/(men|women)\/?$/.test(location.pathname) && !/[?&]sort=/.test(location.search)) { location.replace(location.pathname + '?sort=created_at%2Cdesc'); return; }    [].slice.call(document.querySelectorAll('a[href="/collections/men"],a[href="/collections/women"]')).forEach(function (a) { a.setAttribute('href', a.getAttribute('href') + '?sort=created_at%2Cdesc'); });  }  var view = null;
  function close() {
    if (!view) return;
    view.remove(); view = null;
    document.body.style.overflow = '';
  }
  function openView() {
    if (!view) { view = document.createElement('div'); view.className = 'zub-view'; document.body.appendChild(view); document.body.style.overflow = 'hidden'; }
  }
  function endCard() { // after the last video: send them to shop the collections
    openView();
    view.dataset.i = list.length;
    view.innerHTML = '<button type="button" class="zub-x" aria-label="Close">×</button><b class="zub-a">‹</b>'
      + '<div class="zub-end"><div class="h">Like what you saw?</div><div class="d">Cash on delivery · Free shipping from 2000 EGP</div>'
      + '<a href="/collections/men">Shop Men</a><a href="/collections/women">Shop Women</a></div>';
  }
  function show(i) {
    if (i < 0) i = 0;
    if (i >= list.length) return endCard();
    var v = list[i], p = info[v.s];
    openView();
    view.dataset.i = i;
    view.innerHTML = '<div class="zub-bar">' + list.map(function (x, k) { return '<s><i' + (k < i ? ' style="width:100%"' : '') + '></i></s>'; }).join('') + '</div>'
      + '<button type="button" class="zub-x" aria-label="Close">×</button>'
      + '<video src="' + CDN + v.f + '.mp4" poster="' + CDN + v.f + '-card.jpg" playsinline preload="auto"></video>'
      + '<b class="zub-a">‹</b><b class="zub-a r">›</b>'
      + '<div class="zub-offer">🎁 2nd piece 50% OFF · Buy 2 get 1 FREE</div>'
      + '<div class="zub-foot"><a href="/products/' + v.s + '">View</a>'
      + (soldOut(p) ? '<button type="button" class="zub-add so" disabled>Out of Stock</button></div>'
        : '<button type="button" class="zub-add">' + (p ? 'Add to Cart · ' + money(priceOf(p)) + ' EGP' : 'Add to Cart') + '</button></div>');
    var vid = view.querySelector('video'), bar = view.querySelectorAll('.zub-bar i')[i];
    vid.addEventListener('timeupdate', function () { if (vid.duration) bar.style.width = (vid.currentTime / vid.duration * 100) + '%'; });
    vid.addEventListener('ended', function () { show(i + 1); });
    var pl = vid.play();
    if (pl && pl.catch) pl.catch(function () { vid.muted = true; vid.play(); }); // لو المتصفح منع الصوت، يشتغل صامت
  }

  // same cart call the store uses, so the cart drawer updates right away
  var queryClient = null;
  function findQueryClient() {
    if (queryClient) return queryClient;
    var root = document.getElementById('__next');
    if (!root) return null;
    var key = Object.keys(root).filter(function (k) { return k.indexOf('__reactContainer') === 0; })[0];
    var f = key && root[key];
    if (f && f.stateNode && f.stateNode.current) f = f.stateNode.current;
    var stack = [f], n = 0;
    while (stack.length && n < 5000) {
      var x = stack.pop(); n++;
      if (!x) continue;
      var pr = x.memoizedProps;
      if (pr && pr.client && typeof pr.client.invalidateQueries === 'function') { queryClient = pr.client; break; }
      if (x.child) stack.push(x.child);
      if (x.sibling) stack.push(x.sibling);
    }
    return queryClient;
  }
  function openCart() {
    if (document.querySelector('[data-cart="items-section"]')) return;
    var b = [].slice.call(document.querySelectorAll('header button')).filter(function (x) { return /items in cart/.test(x.innerText); })[0];
    if (b) b.click();
  }
  function addToCart(btn, v) {
    var p = info[v.s], g = {};
    try { g = JSON.parse(localStorage.getItem('guest-id')).state || {}; } catch (er) {}
    if (!p || !g.guestId) { location.href = '/products/' + v.s; return; }
    btn.disabled = true; btn.textContent = '...';
    fetch(API + 'cart-items/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*', 'currencyId': g.currencyId, 'Currency-Id': g.currencyId },
      body: JSON.stringify({ product_id: p.id, quantity: 1, guest_id: g.guestId })
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      var qc = findQueryClient();
      if (qc) qc.invalidateQueries({ queryKey: ['cart-items'] });
      try { if (window.fbq) window.fbq('track', 'AddToCart', { content_ids: [p.id], content_type: 'product', value: priceOf(p), currency: 'EGP' }); } catch (er) {}
      try { if (window.ttq) window.ttq.track('AddToCart', { content_id: p.id, value: priceOf(p), currency: 'EGP' }); } catch (er) {}
      btn.textContent = '✓ Added'; btn.classList.add('done');
      setTimeout(function () { close(); openCart(); }, 700);
    }).catch(function () { location.href = '/products/' + v.s; }); // لو فيه مشكلة نفتح صفحة المنتج
  }

  document.addEventListener('click', function (e) {
    var f = e.target.closest && e.target.closest('[data-zubf]');
    if (f) { filter = f.getAttribute('data-zubf'); var z = document.getElementById('zub'); if (z) z.remove(); render(); return; }
    var pp = e.target.closest && e.target.closest('#zub-pp');
    if (pp) { list = VIDS.filter(function (x) { return onPage(x, pp.dataset.s); }); show(0); return; }
    var b = e.target.closest && e.target.closest('[data-zub]');
    if (b) { list = VIDS.filter(function (v) { return !filter || v.g === filter; }); show(+b.getAttribute('data-zub')); return; }
    if (!view || !view.contains(e.target)) return;
    var i = +view.dataset.i;
    if (e.target.closest('.zub-foot a, .zub-end a')) { close(); return; }
    var add = e.target.closest('.zub-add');
    if (add) { if (!add.disabled) addToCart(add, list[i]); return; }
    if (e.target.closest('.zub-end')) return;
    var a = e.target.closest('.zub-a');
    if (a) return show(a.classList.contains('r') ? i + 1 : i - 1);
    if (e.target.tagName === 'VIDEO') { var vd = e.target; vd.paused ? vd.play() : vd.pause(); return; } // دوسة على الفيديو = إيقاف/تشغيل
    if (e.target.closest('.zub-foot')) return;
    close(); // برا الفيديو = قفل
  });

  var t;
  function start() {
    new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; render(); newestFirst(); }, 120); }).observe(document.body, { childList: true, subtree: true }); // runs at least every 120ms while the page keeps changing
    render(); newestFirst();
  }
  var gone;
  function go() { // start as soon as React has taken over the page (or at load), so its first render isn't disturbed
    if (gone) return;
    var m = document.querySelector('main');
    if (document.readyState === 'complete' || (m && Object.keys(m).some(function (k) { return k.indexOf('__reactFiber') === 0; }))) { gone = 1; setTimeout(start, 30); }
    else setTimeout(go, 50);
  }
  go();
})();

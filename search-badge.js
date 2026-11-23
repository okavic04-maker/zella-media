/* Zella — search dropdown: product image + category badge on the image (owner chose "shape 5", 2026-11-23).
   Badge from EasyOrders categories: MINI > UNISEX (Men + Women) > WOMEN > MEN > ORIGINAL; none if no match. */
(function () {
  if (window.__zellaSearchBadge) return;
  window.__zellaSearchBadge = 1;

  var API = 'https://api.easy-orders.net/api/v1/products?join=categories&fields=id,slug,thumb&limit=40&filter=name||cont||';
  var cache = {};      // query -> Promise<{slug: info}>
  var bySlug = {};     // slug -> {thumb, badge}

  var css = document.createElement('style');
  css.textContent =
    'a.zsb{display:flex!important;align-items:center;gap:10px;direction:ltr;text-align:left;padding-top:9px!important;padding-bottom:9px!important}' +
    '.zsb-pic{position:relative;flex:none;width:62px;height:54px}' +
    '.zsb-pic img{width:48px;height:48px;margin:0 auto;border-radius:10px;object-fit:cover;display:block;background:#f4f4f4}' +
    '.zsb-b{position:absolute;left:50%;bottom:0;transform:translateX(-50%);font-size:7px;font-weight:700;letter-spacing:.8px;line-height:1;padding:3px 6px;border-radius:999px;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;font-family:inherit;direction:ltr}' +
    '.zsb-b:before{content:"";width:4px;height:4px;border-radius:50%;background:currentColor}' +
    '.zsbc-b{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);z-index:2;font-size:10px;letter-spacing:1.2px;padding:5px 11px;box-shadow:0 1px 4px rgba(0,0,0,.18)}' +
    '.zsbc-b:before{width:5px;height:5px}' +
    '.zsb-MEN{background:#111;color:#fff;border:1px solid #111}' +
    '.zsb-WOMEN{background:#fff;color:#b0446b;border:1px solid #e9b6c8}' +
    '.zsb-UNISEX{background:linear-gradient(90deg,#1a1a1a,#8a5a8f);color:#fff;border:1px solid #5a3a5e}' +
    '.zsb-ORIGINAL{background:linear-gradient(135deg,#1f3b2d,#2f5a43);color:#f1dfa8;border:1px solid #c9a24f}' +
    '.zsb-MINI{background:linear-gradient(135deg,#f7e7c4,#d9b46a);color:#3b2a0b;border:1px solid #c9a24f}';
  document.head.appendChild(css);

  function badgeOf(cats) {
    var s = cats.join('|');
    if (/mini/i.test(s)) return 'MINI';
    var women = /women/i.test(s), men = /(^|\|)\s*men\b/i.test(s);
    if (men && women) return 'UNISEX';
    if (women) return 'WOMEN';
    if (men) return 'MEN';
    if (/original/i.test(s)) return 'ORIGINAL';
    return '';
  }

  function load(q) {
    if (!cache[q]) {
      cache[q] = fetch(API + encodeURIComponent(q)).then(function (r) { return r.json(); }).then(function (j) {
        var list = Array.isArray(j) ? j : (j && j.data) || [];
        list.forEach(function (p) {
          bySlug[String(p.slug).toLowerCase()] = {
            thumb: p.thumb || '',
            badge: badgeOf((p.categories || []).map(function (c) { return c.name || ''; }))
          };
        });
      }).catch(function () { delete cache[q]; });
    }
    return cache[q];
  }

  function links() {
    var out = [];
    var all = document.querySelectorAll('a[href^="/search"]');
    for (var i = 0; i < all.length; i++) {
      var box = all[i].parentElement;
      if (!box) continue;
      var ps = box.querySelectorAll('a[href^="/products/"]');
      for (var k = 0; k < ps.length; k++) {
        var a = ps[k];
        if (a.classList.contains('zsb') && a.dataset.zsb === slugOf(a)) continue;
        if (a.classList.contains('zsb')) {           // React reused the row for another product
          var old = a.querySelector('.zsb-pic');
          if (old) old.remove();
          a.classList.remove('zsb');
        }
        out.push(a);
      }
    }
    return out;
  }

  function slugOf(a) {
    try { return decodeURIComponent(a.getAttribute('href').split('/products/')[1] || '').split(/[?#]/)[0].toLowerCase(); }
    catch (e) { return ''; }
  }

  function decorate(a) {
    var slug = slugOf(a);
    var info = bySlug[slug];
    if (!info) return false;
    a.classList.add('zsb');
    a.dataset.zsb = slug;
    var pic = document.createElement('span');
    pic.className = 'zsb-pic';
    pic.innerHTML = (info.thumb ? '<img loading="lazy" alt="" src="' + info.thumb.replace(/"/g, '') + '">' : '<img alt="">') +
      (info.badge ? '<span class="zsb-b zsb-' + info.badge + '">' + info.badge + '</span>' : '');
    a.insertBefore(pic, a.firstChild);
    return true;
  }

  // Product cards on every page (home, collections, /search…): badge at the bottom of each card image.
  // Not on product pages (owner: don't touch "منتجات مشابهة").
  var slugReq = {};
  function loadSlugs(slugs) {
    var need = slugs.filter(function (s) { return !(s in bySlug) && !slugReq[s]; });
    var jobs = [];
    for (var i = 0; i < need.length; i += 30) {
      var part = need.slice(i, i + 30);
      part.forEach(function (s) { slugReq[s] = 1; });
      jobs.push(fetch('https://api.easy-orders.net/api/v1/products?join=categories&fields=id,slug,thumb&limit=30&filter=slug||$in||' +
        part.map(encodeURIComponent).join(',')).then(function (r) { return r.json(); }).then(function (j) {
        (Array.isArray(j) ? j : (j && j.data) || []).forEach(function (p) {
          bySlug[String(p.slug).toLowerCase()] = { thumb: p.thumb || '', badge: badgeOf((p.categories || []).map(function (c) { return c.name || ''; })) };
        });
      }).catch(function () {}));
    }
    return Promise.all(jobs);
  }

  function cards() {
    if (location.pathname.indexOf('/products/') === 0 || /^\/(checkout|thanks)/.test(location.pathname)) return;
    var as = document.querySelectorAll('main a[href^="/products/"]');
    var todo = [];
    for (var i = 0; i < as.length; i++) {
      var a = as[i], box = a.querySelector('img') && a.querySelector('img').parentElement;
      if (!box || a.closest('#zop') || a.closest('#zss')) continue;   // offer box has its own design
      var slug = slugOf(a), cur = box.querySelector('.zsbc-b');
      if (cur && cur.dataset.s === slug) continue;
      if (cur) cur.remove();
      todo.push([box, slug, decodeURIComponent((a.getAttribute('href').split('/products/')[1] || '').split(/[?#]/)[0])]);
    }
    if (!todo.length) return;
    // slugs are lower-cased by slugOf; the API filter is case-sensitive, so send the original href slug
    var orig = todo.map(function (x) { return x[2]; });
    loadSlugs(orig).then(function () {
      todo.forEach(function (x) {
        var info = bySlug[x[1]];
        if (!info || !info.badge || !x[0].isConnected || x[0].querySelector('.zsbc-b')) return;
        if (getComputedStyle(x[0]).position === 'static') x[0].style.position = 'relative';
        var b = document.createElement('span');
        b.className = 'zsb-b zsbc-b zsb-' + info.badge;
        b.dataset.s = x[1];
        b.textContent = info.badge;
        x[0].appendChild(b);
      });
    });
  }

  var busy = false;
  function run() {
    cards();
    if (busy) return;
    var ls = links();
    if (!ls.length) return;
    var pending = ls.filter(function (a) { return !decorate(a); });
    if (!pending.length) return;
    var input = document.querySelector('header input[type="text"]:focus') ||
      Array.prototype.filter.call(document.querySelectorAll('header input[type="text"]'), function (x) { return x.value; })[0];
    var q = input && input.value.trim();
    if (!q) return;
    busy = true;
    load(q).then(function () { busy = false; pending.forEach(function (a) { if (a.isConnected && !a.classList.contains('zsb')) decorate(a); }); });
  }

  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 60); })
    .observe(document.documentElement, { childList: true, subtree: true });
  run();
})();

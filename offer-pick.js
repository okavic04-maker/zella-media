/* Zella — offer picks: ?v=offer / ?v=offer2 on /collections/men shows that ad creative's perfumes, video and reviews on top */
(function () {
  // One entry per ad creative; the link is /collections/men?v=<key>. Perfumes, video, badge and reviews per creative.
  var R1 = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@5dbe4acdd43f0bd162f8e026635b31c312b41639/reviews/';
  var R2 = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@ba565e2024d08a41596db1e93110a33d0ac703cb/reviews/';
  var V1 = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@83f027bc09f1b302b5948f66d105799ab179666f/';
  var V2 = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@0d464ef68e95a8a88ed558f9b19027fd206a2205/';
  // New uploads come from statically.io: jsDelivr refuses new commits of this repo (over its 50 MB limit).
  var V3 = 'https://cdn.statically.io/gh/okavic04-maker/zella@f3fe0fb307b1734aa32eb7737fcb39c33692d59d/';
  // Videos go to the small public repo zella-media (statically.io refuses video files; jsDelivr is fine for a small repo).
  var M3 = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella-media@1a42516324fedf568bc4060ea5e439ba04d7cd07/';
  var OFFERS = {
    offer: {
      slugs: ['sauvagehigh', 'borninroma', 'intensely'], best: 'intensely', page: 'home', // link: zella-store.com/?v=offer (old /collections/men?v=offer links are sent to the homepage)
      hook: 'واحد للنهار، واحد للسهرة، واحد للخروجة',
      explain: [['للنهار ☀️', 'Sauvage'], ['للسهرة 🌙', 'Born In Roma'], ['للخروجة 😎', 'Stronger Intensely']],
      video: V1 + 'offer-video-light.mp4', poster: V1 + 'offer-poster.jpg',
      reviews: [R1 + 'r1.jpg', R1 + 'r2.jpg', R1 + 'r3.jpg', R1 + 'r4.jpg', R1 + 'r5.jpg']
    },
    offer2: {
      slugs: ['angelshare', 'wanted1', 'you'], best: 'you', page: 'home', // link: zella-store.com/?v=offer2
      hook: 'واحد للنهار، واحد للسهرة، واحد للخروجة',
      explain: [['للنهار ☀️', 'Stronger With You'], ['للسهرة 🌙', 'Angels’ Share'], ['للخروجة 😎', 'Most Wanted']],
      video: V2 + 'offer2-video-light.mp4', poster: V2 + 'offer2-poster.jpg',
      reviews: [R2 + 'r6.jpg', R2 + 'r7.jpg', R2 + 'r8.jpg', R1 + 'r4.jpg']
    },
    offer3: {
      slugs: ['ombre', 'orcblack', 'afgano'], best: 'orcblack', page: 'home', // link: zella-store.com/?v=offer3
      hook: 'واحد للنهار، واحد للسهرة، واحد للخروجة',
      explain: [['للنهار ☀️', 'Ombre Leather'], ['للسهرة 🌙', 'Black Orchid'], ['للخروجة 😎', 'Black Afgano']],
      video: M3 + 'offer3-video-light.mp4', poster: M3 + 'offer3-poster.jpg', silent: true, // the ad video has no sound track
      // No review names these three, so general store reviews with a general heading.
      reviews: [V3 + 'r9.jpg', V3 + 'r10.jpg', V3 + 'r11.jpg'], revTitle: 'آراء عملاءنا ⭐'
    }
  };
  var CAT = 'eed6365c-4905-402f-8821-db78741bd33f';
  var KEY = 'zella_offer_pick';
  // The ad link sets the creative for this tab (sessionStorage); the old value '1' means the first creative.
  var OFFER_KEY = (function () {
    var m = location.search.match(/[?&]v=(offer\d*)(?:&|$)/);
    try {
      if (m && OFFERS[m[1]]) sessionStorage.setItem(KEY, m[1]);
      var k = sessionStorage.getItem(KEY);
      return k === '1' ? 'offer' : (OFFERS[k] ? k : null);
    } catch (e) { return m && OFFERS[m[1]] ? m[1] : null; }
  })();
  var O = OFFERS[OFFER_KEY || 'offer'];
  // Saved replies may still use /collections/men?v=offer: a homepage creative opened there goes to the homepage box.
  if (OFFER_KEY && O.page === 'home' && /^\/collections\/men\/?$/.test(location.pathname) && /[?&]v=offer\d*(&|$)/.test(location.search)) location.replace('/?v=' + OFFER_KEY);
  var SLUGS = O.slugs;
  // Ad video shown at the top of the box; empty hides it. Poster = still frame shown while it loads (blurred copy fills the sides).
  var VIDEO = O.video;
  var POSTER = O.poster;
  // The deadline line disappears once this passes (Cairo time).
  var END = new Date('2026-11-11T00:00:00+02:00'); // 3-day offer from 7 Nov 2026: ends at the end of 10 Nov (Cairo)
  var END_TEXT = 'العرض بينتهي خلال ⏳';
  // Real time left until END: days, hours, minutes, seconds boxes (updated every second while the box is on screen).
  function timer() {
    var t = Math.max(0, END - new Date()) / 1000 | 0;
    var u = [[t / 86400 | 0, 'يوم'], [t / 3600 % 24 | 0, 'ساعة'], [t / 60 % 60 | 0, 'دقيقة'], [t % 60, 'ثانية']];
    return u.map(function (x) { return '<span>' + (x[0] < 10 ? '0' : '') + x[0] + '<small>' + x[1] + '</small></span>'; }).join('');
  }
  setInterval(function () {
    var el = document.querySelector('#zop .zop-end .zt');
    if (!el) return;
    if (new Date() >= END) { el.parentNode.remove(); return; }
    el.innerHTML = timer();
  }, 1000);
  // The homepage translator in bogo.js swaps the exact text 'أضف للسلة' to English; a zero-width joiner keeps ours Arabic.
  var ADD = 'أضف للسلة‌';
  var ALL_HTML = 'ضيف التلاتة للسلة بضغطة <i class="zop-cart">🛒</i>';
  // Under the box title.
  var SUB = 'اشتري 2 والتالتة هدية 🎁 والشحن مجاني 🚚';
  var TRUST = [['💵', 'الدفع عند<br>الاستلام'], ['🔄', 'استبدال واسترجاع<br>مضمون'], ['🚚', 'توصيل خلال<br>2-3 أيام عمل']];
  // Card that gets the "best seller" badge.
  var BEST = O.best;
  // Customer review screenshots about the video perfumes (full URLs).
  var REV_BASE = '';
  var REVIEWS = O.reviews;

  // Page that shows the box: the men collection, or the homepage for creatives with page 'home'.
  function isMen() { return O.page === 'home' ? location.pathname === '/' : /^\/collections\/men\/?$/.test(location.pathname); }
  function seenReview() { try { return localStorage.getItem('zop-rv-seen') === '1'; } catch (e) { return false; } }
  function fromAd() { return !!OFFER_KEY; }
  function active() { return isMen() && fromAd(); }
  // Slug of the video perfume whose page this is, for visitors who came from the ad link.
  function pageSlug() {
    var m = location.pathname.match(/^\/products\/([^\/?#]+)/);
    if (!m || SLUGS.indexOf(m[1]) < 0) return null;
    return fromAd() ? m[1] : null;
  }

  var css = '#zop{margin:0 0 22px;border-radius:20px;overflow:hidden;border:1px solid #99f6e4;background:linear-gradient(#f0fdfa,#fff 60%);box-shadow:0 8px 24px rgba(20,184,166,.15)}' +
    '#zop:not(.zop-pp){margin:10px 10px 22px}' +
    '#zop .zop-h{background:linear-gradient(135deg,#14b8a6,#0d9488);color:#fff;font-weight:800;font-size:18px;text-align:center;padding:14px 10px 12px;line-height:1.35}' +
    '#zop .zop-h small{display:block;font-weight:600;font-size:13.5px;opacity:.95;margin-top:4px}' +
    '#zop .zop-h .zop-x{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;font-style:normal;margin:8px 0 2px}' +
    '#zop .zop-h .zop-x span{background:rgba(255,255,255,.2);border-radius:20px;padding:3px 9px;font-size:11.5px;font-weight:700;white-space:nowrap}' +
    '#zop .zop-end{background:#fff7ed;color:#c2410c;font-weight:800;font-size:12.5px;text-align:center;padding:8px 8px 9px;border-bottom:1px solid #fed7aa}' +
    '#zop .zop-end .zt{display:flex;justify-content:center;gap:6px;margin-top:5px;direction:ltr}' +
    '#zop .zop-end .zt span{min-width:46px;background:#f97316;color:#fff;border-radius:8px;padding:3px 0 2px;font-size:17px;font-weight:900;line-height:1.1;font-variant-numeric:tabular-nums}' +
    '#zop .zop-end .zt small{display:block;font-size:10px;font-weight:700;opacity:.9}' +
    // The whole vertical ad video in the middle, with a blurred copy of it filling the sides instead of black bars.
    '#zop .zop-v{position:relative;height:230px;overflow:hidden;background:#111}' +
    '#zop .zop-v video{position:relative;display:block;height:100%;width:auto;max-width:100%;margin:0 auto;object-fit:contain}' +
    // Phones never autoplay with sound: the video starts muted and this button turns the sound on (a tap allows it).
    '#zop .zop-snd{position:absolute;left:8px;bottom:8px;z-index:3;border:0;border-radius:20px;background:rgba(0,0,0,.65);color:#fff;font:800 12px/1 inherit;font-family:inherit;padding:7px 11px;cursor:pointer;animation:zop-beat 1.6s ease-in-out infinite}' +
    '#zop .zop-snd.on{animation:none;background:rgba(20,184,166,.85)}' +
    '#zop .zop-v .zop-vb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(14px) brightness(.85);transform:scale(1.3)}' +
    '#zop .zop-g{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:12px 10px}' +
    '#zop .zop-k{display:flex;flex-direction:column;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}' +
    '#zop .zop-k a{display:flex;flex:1;flex-direction:column;background:#fff;border-radius:12px;overflow:hidden;text-decoration:none;color:#111;box-shadow:0 1px 4px rgba(0,0,0,.08)}' +
    '#zop img{width:100%;aspect-ratio:1/1;object-fit:contain;background:#fff}' +
    '#zop .zop-n{font-size:12px;font-weight:700;line-height:1.3;padding:6px 6px 0;min-height:32px;text-align:center}' +
    '#zop .zop-p{text-align:center;padding:4px 4px 8px}' +
    '#zop .zop-p b{color:#f97316;font-size:17px;font-weight:900}' +
    '#zop .zop-p s{color:#999;font-size:11px;margin-inline-start:4px}' +
    '#zop .zop-o{margin:-4px 6px 8px;background:#dcfce7;color:#15803d;border-radius:8px;text-align:center;font-size:11px;font-weight:800;padding:3px 2px;line-height:1.3}' +
    '#zop .zop-o b{display:block;font-size:17px;font-weight:900}' +
    // Deal prices, the per-piece price and the 3-piece line breathe like the orange button so the eye lands on them.
    '#zop .zop-o{animation:zop-beat 1.6s ease-in-out infinite}#zop .zop-k:nth-child(2) .zop-o{animation-delay:.25s}#zop .zop-k:nth-child(3) .zop-o{animation-delay:.5s}' +
    '#zop .zop-save .zs-p b{display:inline-block;animation:zop-beat 1.6s ease-in-out infinite}' +
    '#zop .zop-save .zs-c u{display:inline-block;animation:zop-pulse 1.6s ease-in-out infinite .4s}' +
    '@keyframes zop-beat{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}' +
    // iPhone only sends taps on a plain area when it looks clickable: makes a tap on the blur above/below close the review.
    '.zrv-view.zop-rview{cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    // Bottom bar: the gift circle bounces and the frame glows, so it keeps catching the eye.
    '#zop-bar{animation:zop-glow 1.8s ease-in-out infinite}' +
    '#zop-bar .zb-d span.gift{animation:zop-gift 1.2s ease-in-out infinite}' +
    '@keyframes zop-glow{0%,100%{box-shadow:0 6px 20px rgba(0,0,0,.18),0 0 0 0 rgba(20,184,166,.55)}50%{box-shadow:0 6px 20px rgba(0,0,0,.18),0 0 0 7px rgba(20,184,166,0)}}' +
    '@keyframes zop-gift{0%,100%{transform:scale(1) rotate(0)}30%{transform:scale(1.2) rotate(-12deg)}60%{transform:scale(1.1) rotate(10deg)}}' +
    '@media (prefers-reduced-motion:reduce){#zop .zop-o,#zop .zop-save .zs-p b,#zop .zop-save .zs-c u,#zop .zop-all,#zop .zop-cart,#zop-bar,#zop-bar .zb-d span.gift,#zop .zop-snd{animation:none!important}}' +
    '#zop .zop-c{display:block;margin:0 6px 8px;background:#000;color:#fff;font-size:12px;font-weight:800;text-align:center;border:0;border-radius:8px;padding:8px 0;cursor:pointer;font-family:inherit}' +
    '#zop .zop-c.zop-ok{background:#16a34a}' +
    '#zop .zop-all{display:block;width:calc(100% - 20px);margin:12px 10px 0;background:#f97316;color:#fff;font-size:15px;font-weight:900;border:0;border-radius:10px;padding:11px 0;cursor:pointer;font-family:inherit}' +
    '#zop .zop-all.zop-ok{background:#16a34a}' +
    '#zop .zop-all:not(.zop-ok){animation:zop-pulse 1.6s ease-in-out infinite}' +
    '#zop .zop-cart{display:inline-block;font-style:normal;animation:zop-ride 1.6s ease-in-out infinite}' +
    '@keyframes zop-pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(249,115,22,.5)}50%{transform:scale(1.03);box-shadow:0 0 0 8px rgba(249,115,22,0)}}' +
    '@keyframes zop-ride{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-6px) rotate(-12deg)}50%{transform:translateX(0) rotate(0)}75%{transform:translateX(-3px) rotate(8deg)}}' +
    '#zop #zop-go{display:none;text-align:center;color:#f97316;font-weight:800;font-size:14px;padding:0 0 10px;text-decoration:underline}' +
    '#zop .zop-t{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:0 10px 12px}' +
    '#zop .zop-t span{background:#fff;border:1px solid #ccfbf1;border-radius:10px;padding:7px 4px;text-align:center;color:#0f766e;font-size:11.5px;font-weight:700;line-height:1.35}' +
    '#zop .zop-t i{display:block;font-style:normal;font-size:20px;margin-bottom:2px}' +
    '#zop.zop-pp{margin:18px 0 0}#zop.zop-pp .zop-g{grid-template-columns:repeat(2,1fr)}' +
    '#zop-cs{margin:12px 0;border:2px dashed #f97316;border-radius:12px;background:#fff7ed;padding:10px;display:flex;gap:10px;align-items:center}' +
    '#zop-cs img{width:58px;height:58px;object-fit:contain;border-radius:8px;background:#fff;flex:none}' +
    '#zop-cs div{flex:1;font-size:13px;font-weight:700;line-height:1.4;color:#111}' +
    '#zop-cs button{flex:none;background:#f97316;color:#fff;border:0;border-radius:8px;padding:8px 10px;font-weight:800;font-size:12px;cursor:pointer;font-family:inherit}' +
    '#zop .zop-k{position:relative}' +
    '#zop .zop-best{position:absolute;top:6px;inset-inline-start:6px;z-index:1;background:#f97316;color:#fff;font-size:11px;font-weight:900;border-radius:20px;padding:3px 8px;box-shadow:0 2px 6px rgba(249,115,22,.4)}' +
    '#zop .zop-k.zop-isbest{outline:2px solid #f97316}' +
    '#zop .zop-save{margin:0 10px 10px;background:#fff;border:2px dashed #14b8a6;border-radius:10px;text-align:center;padding:8px 6px;font-size:14px;font-weight:800;color:#111;line-height:1.6}' +
    '#zop .zop-save{background:#fff7ed;border-color:#f97316;font-size:16px}' +
    '#zop .zop-save em{display:block;font-style:normal;color:#14b8a6;font-size:13px}' +
    '#zop .zop-save .zs-l{display:block;font-size:15px}' +
    '#zop .zop-save .zs-p{display:flex;justify-content:center;align-items:baseline;gap:8px;line-height:1.2}' +
    '#zop .zop-save b{color:#f97316;font-size:34px;font-weight:900}#zop .zop-save s{color:#999;font-size:16px}' +
    '#zop .zop-save .zs-c{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}' +
    '#zop .zop-save .zs-c u{text-decoration:none;background:#dcfce7;color:#15803d;font-size:12.5px;border-radius:20px;padding:2px 10px}' +
    '#zop .zop-rh{font-weight:900;font-size:16px;text-align:center;padding:4px 8px 8px;color:#111}' +
    '#zop .zop-rh small{display:block;font-size:12px;font-weight:700;color:#f97316;margin-top:2px;animation:zop-tap 1.2s ease-in-out infinite}' +
    '@keyframes zop-tap{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}' +
    '#zop .zop-r{display:flex;justify-content:safe center;gap:10px;overflow-x:auto;scrollbar-width:none;padding:2px 10px 12px}' +
    '#zop .zop-r img{cursor:pointer;flex:none;width:60px;height:60px;border-radius:50%;object-fit:cover;object-position:center 30%;padding:3px;background:conic-gradient(from 200deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75);box-shadow:inset 0 0 0 3px #fff}' +
    '#zop-bar{position:fixed;left:10px;right:10px;z-index:40;background:#fff;border:2px solid #14b8a6;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.18);padding:8px 10px;display:flex;align-items:center;gap:10px;font-family:inherit;direction:rtl}' +
    '#zop-bar .zb-d{display:flex;gap:4px;flex:none}#zop-bar .zb-d span{width:26px;height:26px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:14px}' +
    '#zop-bar .zb-d span.on{background:#14b8a6;color:#fff}#zop-bar .zb-d span.gift{background:#fff7ed;border:2px dashed #f97316}#zop-bar .zb-d span.gift.on{background:#f97316;border-color:#f97316}' +
    '#zop-bar .zb-t{flex:1;font-size:13px;font-weight:800;line-height:1.35;color:#111}#zop-bar .zb-t small{display:block;color:#f97316;font-size:12px}' +
    '#zop-bar button{flex:none;background:#f97316;color:#fff;border:0;border-radius:9px;padding:8px 10px;font-weight:900;font-size:12px;font-family:inherit}' +
    '@media(min-width:768px){#zop-bar{left:auto;right:20px;width:380px}#zop .zop-r img{width:70px;height:70px}}' +
    '@media(min-width:768px){#zop .zop-n{font-size:15px}#zop .zop-p b{font-size:22px}#zop .zop-g{gap:16px;padding:16px}}';

  var products = null, loading = false;
  function load() {
    if (products || loading) return;
    loading = true;
    fetch('https://api.easy-orders.net/api/v1/products?limit=500&page=1&fields=id,name,thumb,price,sale_price,slug&category_id=' + CAT + '&theme_key=sphinx')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var all = (j && j.data) || [];
        products = SLUGS.map(function (s) {
          return all.filter(function (p) { return p.slug === s; })[0];
        }).filter(Boolean);
        tick();
      })
      .catch(function () { loading = false; });
  }

  function card(p) {
    var price = p.sale_price || p.price;
    var best = p.slug === BEST;
    return '<div class="zop-k' + (best ? ' zop-isbest' : '') + '">' + (best ? '<span class="zop-best">الأكثر طلباً 🔥</span>' : '') +
      '<a href="/products/' + p.slug + '">' +
      '<img src="' + p.thumb + '" alt="" loading="eager">' +
      '<div class="zop-n">' + p.name + '</div>' +
      '<div class="zop-p"><b>' + price + ' ج.م</b>' + (p.sale_price && p.price > p.sale_price ? '<s>' + p.price + '</s>' : '') + '</div>' +
      (deal(p) ? '<div class="zop-o">في عرض التلاتة 🎁<b>' + deal(p) + ' ج.م</b></div>' : '') + '</a>' +
      (added[p.id]
        ? '<button type="button" class="zop-c zop-ok" data-id="' + p.id + '">اتضاف للسلة ✓</button></div>'
        : '<button type="button" class="zop-c" data-id="' + p.id + '">' + ADD + '</button></div>');
  }

  // The theme re-renders the grid after a cart change, which rebuilds the box; keep what was added.
  var added = {}, lastPost = 0;

  function guestId() {
    try { return JSON.parse(localStorage.getItem('guest-id')).state.guestId; } catch (e) { return null; }
  }

  // The theme keeps the cart in React Query under ['cart-items']; refetching it updates the header count.
  function queryClient() {
    try {
      var el = document.querySelector('header') || document.querySelector('.category_products_grid_container');
      var fk = el && Object.keys(el).filter(function (k) { return k.indexOf('__reactFiber') === 0; })[0];
      for (var f = fk && el[fk]; f; f = f.return) {
        var c = f.memoizedProps && f.memoizedProps.client;
        if (c && c.invalidateQueries) return c;
      }
    } catch (e) {}
    return null;
  }
  function refreshCart() {
    var c = queryClient();
    if (c) c.invalidateQueries({ queryKey: ['cart-items'] });
  }
  // The theme removes / changes cart lines with a PATCH and doesn't refetch the cart list,
  // so refetch after any cart change to keep the progress bar right away.
  function cartChanged(method, url) {
    if (!fromAd() || !/cart-items/.test(url) || /^get$/i.test(method || 'GET')) return;
    setTimeout(function () { refreshCart(); setTimeout(tick, 600); }, 150);
  }
  try {
    var xo = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (m, u) {
      this.addEventListener('loadend', function () { cartChanged(m, String(u)); });
      return xo.apply(this, arguments);
    };
    var fo = window.fetch;
    window.fetch = function (u, o) {
      var p = fo.apply(this, arguments);
      p.then(function () { cartChanged(o && o.method, String(u && u.url || u)); }, function () {});
      return p;
    };
  } catch (e) {}

  function cartItems() {
    var c = queryClient();
    var d = c && c.getQueryData(['cart-items']);
    return Array.isArray(d) ? d : [];
  }

  // Same call the theme's own "add to cart" makes; the cart page reads it from the server.
  function post(id) {
    return fetch('https://api.easy-orders.net/api/v1/cart-items/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: id, quantity: 1, guest_id: guestId() })
    }).then(function (r) {
      if (!r.ok) throw 0;
      added[id] = 1;
      lastPost = Date.now();
    });
  }

  function done() {
    refreshCart();
    var go = document.getElementById('zop-go');
    if (go) go.style.display = 'block';
    // Like the theme's own button: open the side cart once the refreshed items are in.
    setTimeout(openCart, 700);
  }

  function addToCart(btn) {
    if (!guestId()) { location.href = btn.parentNode.querySelector('a').getAttribute('href'); return; }
    btn.disabled = true;
    btn.textContent = '...';
    post(btn.getAttribute('data-id')).then(function () {
      btn.textContent = 'اتضاف للسلة ✓';
      btn.className = 'zop-c zop-ok';
      done();
    }).catch(function () {
      btn.textContent = ADD;
    }).then(function () {
      setTimeout(function () { btn.disabled = false; }, 600);
    });
  }

  // "Add all three": adds the ones not added yet, one after another, then opens the cart once.
  function addAll(btn) {
    if (!guestId()) return;
    btn.disabled = true;
    btn.textContent = '...';
    var todo = products.filter(function (p) { return !added[p.id]; });
    todo.reduce(function (chain, p) {
      return chain.then(function () { return post(p.id); });
    }, Promise.resolve()).then(function () {
      [].forEach.call(document.querySelectorAll('#zop .zop-c'), function (b) {
        b.textContent = 'اتضاف للسلة ✓';
        b.className = 'zop-c zop-ok';
      });
      btn.textContent = 'التلاتة في السلة ✓';
      btn.className = 'zop-all zop-ok';
      done();
    }).catch(function () {
      btn.innerHTML = ALL_HTML;
      btn.disabled = false;
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var btn = e.target.closest('#zop .zop-c');
    if (btn) { e.preventDefault(); addToCart(btn); return; }
    var snd = e.target.closest('#zop .zop-snd');
    if (snd) {
      e.preventDefault();
      var vd = snd.parentNode.querySelector('video');
      var on = vd.muted;
      vd.muted = !on; vd.defaultMuted = !on;
      // Only the first time the sound goes on the video starts over; after that it just continues.
      if (on) { if (!vd.dataset.heard) { vd.dataset.heard = '1'; vd.currentTime = 0; } var pr = vd.play(); if (pr && pr.catch) pr.catch(function () {}); }
      snd.className = 'zop-snd' + (on ? ' on' : '');
      snd.textContent = on ? 'اقفل الصوت 🔇' : 'شغل الصوت 🔊';
      return;
    }
    var all = e.target.closest('#zop .zop-all');
    if (all) { e.preventDefault(); addAll(all); return; }
    var cs = e.target.closest('#zop-cs button');
    if (cs) {
      e.preventDefault();
      cs.disabled = true;
      cs.textContent = '...';
      post(cs.getAttribute('data-id')).then(refreshCart).catch(function () { cs.disabled = false; cs.textContent = 'أضف'; });
      return;
    }
    var rv = e.target.closest('#zop .zop-r img');
    if (rv) { try { localStorage.setItem('zop-rv-seen', '1'); } catch (er) {} var hs = document.querySelector('#zop .zop-rh small'); if (hs) hs.remove(); }
    if (rv) { e.preventDefault(); showReview(+rv.getAttribute('data-i')); return; }
    if (view && view.contains(e.target)) {
      e.preventDefault();
      var i = +view.getAttribute('data-i'), ar = e.target.closest('.zrv-a');
      if (ar) return showReview(ar.classList.contains('r') ? i + 1 : i - 1);
      if (e.target.closest('.zrv-close') || e.target.tagName !== 'IMG') return closeReview();
      return showReview(e.clientX > innerWidth / 2 ? i + 1 : i - 1);
    }
    if (e.target.closest('#zop-bar button')) { e.preventDefault(); openCart(); return; }
    if (e.target.closest('#zop-go')) { e.preventDefault(); openCart(); }
  });

  // Review viewer: same look and swipe as the homepage reviews (bogo.js styles .zrv-view, swipe.js presses .zrv-a).
  var view = null;
  function closeReview() {
    if (!view) return;
    clearTimeout(view.t); view.remove(); view = null;
    document.body.style.overflow = '';
  }
  function showReview(i) {
    if (i < 0) i = 0;
    if (i >= REVIEWS.length) return closeReview();
    if (!view || !view.isConnected) { // another script may have removed it (the homepage viewer uses the same class)
      if (view) clearTimeout(view.t);
      view = document.createElement('div');
      view.className = 'zrv-view zop-rview';
      document.body.appendChild(view);
      document.body.style.overflow = 'hidden';
    }
    clearTimeout(view.t);
    view.setAttribute('data-i', i);
    view.innerHTML = '<div class="zrv-bars">' + REVIEWS.map(function (f, j) { return '<i><b style="width:' + (j < i ? 100 : 0) + '%"></b></i>'; }).join('') + '</div>' +
      '<div class="zrv-head">آراء عملاءنا ⭐</div><button type="button" class="zrv-close" aria-label="Close">×</button><b class="zrv-a">‹</b><b class="zrv-a r">›</b>' +
      '<img src="' + REV_BASE + REVIEWS[i] + '" alt="">';
    var bar = view.querySelectorAll('.zrv-bars b')[i];
    void bar.offsetWidth;
    bar.style.transition = 'width 5s linear'; bar.style.width = '100%';
    view.t = setTimeout(function () { showReview(i + 1); }, 5000);
  }

  // A full load of /cart 404s on this theme, so open it through the header cart button.
  function openCart() {
    var cart = [].filter.call(document.querySelectorAll('header button, button'), function (b) {
      return /items in cart/i.test(b.textContent);
    })[0];
    if (cart) cart.click(); else location.href = '/';
  }

  function ensureCss() {
    if (document.getElementById('zop-css')) return;
    var st = document.createElement('style');
    st.id = 'zop-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // In the side cart: when some of the video perfumes are in, suggest the missing ones next to the BOGO bar.
  function cartTick() {
    var cs = document.getElementById('zop-cs');
    var bar = document.getElementById('zella-bogo-bar');
    var items = bar && fromAd() && products ? cartItems() : [];
    var inCart = {}, pieces = 0;
    items.forEach(function (it) { inCart[it.product_id] = 1; pieces += it.quantity || 0; });
    var have = products ? products.filter(function (p) { return inCart[p.id]; }) : [];
    var miss = products ? products.filter(function (p) { return !inCart[p.id]; }) : [];
    if (!bar || !have.length || !miss.length) { if (cs) cs.remove(); return; }
    var p = miss[0];
    // One more piece completes a set of three, so the next one is the free one.
    var text = pieces % 3 === 2 ? 'ضيف ' + p.name + ' وخده هدية 🎁' : 'كمّل أنواع الفيديو: ' + p.name;
    var html = '<img src="' + p.thumb + '" alt=""><div>' + text + '</div><button type="button" data-id="' + p.id + '">أضف</button>';
    if (cs && cs.previousElementSibling === bar && cs.getAttribute('data-k') === p.id + text) return;
    if (cs) cs.remove();
    ensureCss();
    cs = document.createElement('div');
    cs.id = 'zop-cs';
    cs.setAttribute('data-k', p.id + text);
    cs.innerHTML = html;
    bar.parentNode.insertBefore(cs, bar.nextSibling);
  }

  // This card's share of the 3-piece price (cheapest free), spread in proportion to each price.
  function deal(p) {
    if (!products || products.length < 3 || slugPage()) return 0;
    var ps = products.map(price), sum = ps.reduce(function (a, b) { return a + b; }, 0);
    return Math.round(price(p) * (sum - Math.min.apply(null, ps)) / sum);
  }
  function slugPage() { return !!pageSlug(); }
  // Box title = a hook with the real saving of this creative's 3 perfumes (the cheapest one is the free one).
  function hook() {
    if (O.hook) return O.hook;
    if (!products || products.length < 3) return 'الأنواع اللي في الفيديو 🎬';
    return 'خد التلاتة ووفّر ' + Math.min.apply(null, products.map(price)) + ' ج.م 🔥';
  }
  function price(p) { return +(p.sale_price || p.price) || 0; }

  // The three together: the cheapest one is the free one.
  function saving() {
    if (products.length < 3) return '';
    var ps = products.map(price);
    var sum = ps.reduce(function (a, b) { return a + b; }, 0), free = Math.min.apply(null, ps);
    // Lead with the price per piece when taking all three, next to the highest single price.
    // One idea per line so it stays tidy on narrow phones.
    return '<div class="zop-save"><em>لما تاخد التلاتة 👇</em>' +
      '<span class="zs-l">البرفيوم الواحد هيكون بـ</span>' +
      '<span class="zs-p"><b>' + Math.round((sum - free) / 3) + ' ج.م</b><s>بدل ' + Math.max.apply(null, ps) + '</s></span>' +
      '<span class="zs-c"><u>التلاتة بـ ' + (sum - free) + ' بدل ' + sum + ' + شحن مجاني 🚚</u></span></div>';
  }

  // Sticky progress bar for ad visitors: how many pieces until the free one. Hidden while the side cart is open.
  function barTick() {
    var bar = document.getElementById('zop-bar');
    var cartOpen = document.getElementById('zella-bogo-bar');
    var show = fromAd() && products && !cartOpen && !document.querySelector('.zrv-view, .zub-view') && !/^\/(checkout|thank)/.test(location.pathname);
    if (!show) { if (bar) bar.remove(); return; }
    // The server can keep two rows for one product; the theme shows them as one line, so count each product once.
    var q = {};
    cartItems().forEach(function (it) { q[it.product_id] = Math.max(q[it.product_id] || 0, +it.quantity || 0); });
    var pieces = Object.keys(q).reduce(function (n, k) { return n + q[k]; }, 0);
    var n = pieces % 3, sets = Math.floor(pieces / 3);
    var dots = [1, 2, 3].map(function (i) {
      return '<span class="' + (i === 3 ? 'gift' : '') + (i <= n || (n === 0 && sets) ? ' on' : '') + '">' + (i === 3 ? '🎁' : (i <= n || (n === 0 && sets) ? '✓' : '')) + '</span>';
    }).join('');
    var text = n === 0 && sets ? 'مبروك! التالتة علينا هدية 🎁<small>كمّل طلبك من السلة والشحن مجاني 🚚</small>'
      : n === 0 ? 'اختار 2 برفيوم والتالتة هدية 🎁<small>والشحن مجاني 🚚</small>'
      : n === 1 ? 'ضفت 1 – ضيف 1 كمان<small>وبعدها التالتة علينا هدية 🎁</small>'
      : 'فاضل خطوة! ضيف التالتة ببلاش 🎁<small>البرفيوم التالت هدية مننا</small>';
    var key = pieces + '';
    if (bar && bar.getAttribute('data-k') === key) { place(bar); return; }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'zop-bar';
      document.body.appendChild(bar);
    }
    bar.setAttribute('data-k', key);
    bar.innerHTML = '<div class="zb-d">' + dots + '</div><div class="zb-t">' + text + '</div>' +
      (pieces ? '<button type="button">السلة 🛒</button>' : '');
    place(bar);
  }
  // Sit just above the theme's bottom nav.
  function place(bar) {
    var nav = document.querySelector('section.fixed.inset-x-5');
    var top = nav ? nav.getBoundingClientRect().top : innerHeight;
    if (top <= 0 || top > innerHeight) top = innerHeight;
    bar.style.bottom = (innerHeight - top + 8) + 'px';
  }

  // Keep "اتضاف للسلة ✓" in step with the real cart (a line removed in the side cart turns back to "أضف للسلة").
  function syncAdded() {
    var c = queryClient(), d = c && c.getQueryData(['cart-items']);
    // Right after our own add the cart list is still the old one; wait for the refetch.
    if (!Array.isArray(d) || !products || Date.now() - lastPost < 2500) return;
    var inCart = {};
    d.forEach(function (it) { inCart[it.product_id] = 1; });
    products.forEach(function (p) { if (inCart[p.id]) added[p.id] = 1; else delete added[p.id]; });
    [].forEach.call(document.querySelectorAll('#zop .zop-c'), function (b) {
      if (b.disabled) return;
      var on = !!added[b.getAttribute('data-id')];
      if (on !== (b.className.indexOf('zop-ok') > -1)) {
        b.className = on ? 'zop-c zop-ok' : 'zop-c';
        b.textContent = on ? 'اتضاف للسلة ✓' : ADD;
      }
    });
    var every = products.every(function (p) { return added[p.id]; });
    document.querySelectorAll('#zop .zop-all').forEach(function (all) {
      if (all.textContent.match(/^\.\.\./) || every === all.disabled) return;
      all.disabled = every;
      all.className = 'zop-all' + (every ? ' zop-ok' : '');
      all.innerHTML = every ? 'التلاتة في السلة ✓' : ALL_HTML;
    });
  }


  function tick() {
    if (fromAd()) { ensureCss(); barTick(); syncAdded(); }
    var box = document.getElementById('zop');
    var slug = pageSlug();
    if (fromAd()) { load(); cartTick(); }
    if (!active() && !slug) { if (box) box.remove(); return; }
    load();
    if (!products || !products.length) return;
    var anchor, list, title;
    if (slug) {
      // Product page of one of the video perfumes: offer the other two under the order buttons.
      var buy = [].filter.call(document.querySelectorAll('.p_details_container button'), function (b) {
        return b.textContent.trim() === 'أضف للسلة';
      })[0];
      anchor = buy && buy.parentNode;
      if (!anchor) return;
      if (box && box.previousElementSibling === anchor) return;
      list = products.filter(function (p) { return p.slug !== slug; });
      title = 'كمّل أنواع الفيديو 🎬';
    } else {
      anchor = O.page === 'home' ? document.querySelector('main > .content_container') : document.querySelector('.category_products_grid_container');
      if (!anchor) return;
      if (box && box.nextElementSibling === anchor) return;
      list = products;
      title = hook();
    }
    if (box) box.remove();
    ensureCss();
    var allAdded = products.every(function (p) { return added[p.id]; });
    box = document.createElement('div');
    box.id = 'zop';
    if (slug) box.className = 'zop-pp';
    box.innerHTML = '<div class="zop-h">' + title + (O.explain && !slug ? '<em class="zop-x">' + O.explain.map(function (x) { return '<span><bdi>' + x[1] + '</bdi> ' + x[0] + '</span>'; }).join('') + '</em>' : '') + '<small>' + SUB + '</small></div>' +
      (new Date() < END ? '<div class="zop-end">' + END_TEXT + '<div class="zt">' + timer() + '</div></div>' : '') +
      (VIDEO && !slug ? '<div class="zop-v">' +
        '<img class="zop-vb" src="' + POSTER + '" alt="" aria-hidden="true">' +
        '<video src="' + VIDEO + '" poster="' + POSTER + '" autoplay muted loop playsinline webkit-playsinline preload="auto"></video>' +
        (O.silent ? '' : '<button type="button" class="zop-snd">شغل الصوت 🔊</button>') + '</div>' : '') +
      (slug ? '' : '<button type="button" class="zop-all' + (allAdded ? ' zop-ok' : '') + '"' + (allAdded ? ' disabled' : '') + '>' +
        (allAdded ? 'التلاتة في السلة ✓' : ALL_HTML) + '</button>') +
      '<div class="zop-g">' + list.map(card).join('') + '</div>' +
      (slug ? '' : saving()) +
      (slug ? '' : '<button type="button" class="zop-all' + (allAdded ? ' zop-ok' : '') + '"' + (allAdded ? ' disabled' : '') + '>' + (allAdded ? 'التلاتة في السلة ✓' : ALL_HTML) + '</button>') +
      '<a id="zop-go" href="/cart"' + (Object.keys(added).length ? ' style="display:block"' : '') + '>كمّل الطلب من السلة ←</a>' +
      '<div class="zop-t">' + TRUST.map(function (t) { return '<span><i>' + t[0] + '</i>' + t[1] + '</span>'; }).join('') + '</div>' +
      (REVIEWS.length ? '<div class="zop-rh">' + (O.revTitle || 'آراء عملاءنا في الأنواع دي ⭐') + (seenReview() ? '' : '<small>دوس على أي ريفيو عشان تفتحه 👆</small>') + '</div><div class="zop-r">' +
        REVIEWS.map(function (f, i) { return '<img src="' + REV_BASE + f + '" data-i="' + i + '" alt="" decoding="async">'; }).join('') + '</div>' : '');
    if (slug) anchor.parentNode.insertBefore(box, anchor.nextSibling);
    else anchor.parentNode.insertBefore(box, anchor);
    startVideo(box);
  }

  // iPhone: autoplay from innerHTML is not reliable (the muted flag, Low Power Mode, Facebook/Instagram browser).
  // Set the flags as properties, call play(), and if iOS still refuses, play on the first touch and show a play button.
  function startVideo(box) {
    var vs = box.querySelectorAll('.zop-v video');
    if (!vs.length) return;
    var btn;
    function playAll() {
      var p = [].map.call(vs, function (v) {
        v.muted = true; v.defaultMuted = true; v.playsInline = true;
        v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
        var r = v.play();
        return r && r.then ? r : Promise.resolve();
      });
      return Promise.all(p).then(function () { if (btn) { btn.remove(); btn = null; } });
    }
    playAll().catch(function () {
      var wrap = box.querySelector('.zop-v');
      if (!wrap || wrap.querySelector('.zop-play')) return;
      btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'zop-play'; btn.setAttribute('aria-label', 'شغّل الفيديو');
      btn.innerHTML = '▶';
      btn.style.cssText = 'position:absolute;left:50%;top:50%;z-index:3;width:64px;height:64px;margin:-32px 0 0 -32px;border:0;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:28px;line-height:64px;padding-left:5px;cursor:pointer';
      btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); playAll().catch(function () {}); });
      wrap.appendChild(btn);
      var once = function () { document.removeEventListener('touchstart', once, true); if (box.isConnected) playAll().catch(function () {}); };
      document.addEventListener('touchstart', once, { capture: true, passive: true });
    });
  }

  setInterval(tick, 700);
  tick();
})();

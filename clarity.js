/* Zella Store — Microsoft Clarity (recordings + heatmaps) with offer tags and events. */
(function () {
  if (window.__zellaClarity) return;
  window.__zellaClarity = 1;
  var ID = 'zaa4mlkqsz';

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', ID);

  function cl() { try { window.clarity.apply(null, arguments); } catch (e) {} }
  function ev(name) { cl('event', name); }

  // Which ad link brought this visit (same key offer-pick.js keeps in sessionStorage).
  function offerKey() {
    var m = location.search.match(/[?&]v=(offer\d*)(?:&|$)/);
    if (m) return m[1];
    try { var k = sessionStorage.getItem('zella_offer_pick'); return k === '1' ? 'offer' : k; } catch (e) { return null; }
  }
  var tagged = null;
  function tagOffer() {
    var k = offerKey();
    if (k && k !== tagged) { tagged = k; cl('set', 'offer', k); ev('visit_' + k); }
  }
  tagOffer();

  // Clicks (capture phase, so it runs before offer-pick.js handles them).
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('#zop .zop-all')) ev('add_three');
    else if (t.closest('#zop .zop-c')) ev('box_add');
    else if (t.closest('#zop-cs button')) ev('cart_suggest_add');
    else if (t.closest('#zop .zop-r img')) ev('review_open');
    else if (t.closest('#zop .zop-play')) ev('video_play');
    else {
      var s = t.closest('#zop .zop-snd');
      if (s) ev(s.classList.contains('on') ? 'sound_off' : 'sound_on');
    }
  }, true);

  // Any add to cart on the site (theme or offer box).
  var of = window.fetch;
  if (of) window.fetch = function (u, o) {
    try {
      var url = typeof u === 'string' ? u : (u && u.url) || '';
      var m = (o && o.method) || (u && u.method) || 'GET';
      if (/cart-items\/guest/.test(url) && /post/i.test(m)) ev('add_to_cart');
    } catch (e) {}
    return of.apply(this, arguments);
  };

  // Page changes in the single-page theme: checkout and thank-you.
  var last = '';
  function route() {
    var p = location.pathname;
    if (p === last) return;
    last = p;
    tagOffer();
    if (/^\/checkout/.test(p)) ev('checkout');
    if (/^\/thanks/.test(p)) { ev('order_done'); cl('upgrade', 'order_done'); }
  }
  route();
  setInterval(route, 1000);
})();

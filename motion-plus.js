/* Zella — motion-plus (2026-11-28, owner «انشر»). Three small motions the owner asked for (ideas 4, 1, 3).
   Same rules as the other motion files: each runs once, transform/opacity only, off under prefers-reduced-motion,
   nothing stays hidden if a motion doesn't run (content is visible by default; the motion class only plays an entry).
   4) /checkout: delivery card above the fields «التوصيل المتوقع <day d – day d month>» (same dates as the product page:
      next working day to 3 working days, Friday off, Cairo date) + «الشحن X ج.م · الدفع عند الاستلام» read from the
      theme summary; a small truck drives along a dashed line once. Inserted from a MutationObserver (before the paint).
   1) /thanks: a turquoise circle whose ✓ draws itself, then the theme lines, our WhatsApp line and phone note come in one
      after another, then a card «التوصيل المتوقع <dates>».
   3) Search dropdown #zdd (smart-search.js): rows that were not in the previous list slide in one after another
      (fast, 30 ms apart, max 8), so typing does not replay rows that stay. */
(function () {
  if (window.__zMotionPlus) return; window.__zMotionPlus = 1;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var DAYS = ['الأحد', 'الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت'];
  var TRUCK = '<svg viewBox="0 0 22 22" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="transform:scaleX(-1)"><path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z"/><circle cx="6" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/></svg>';

  var css = document.createElement('style'); css.id = 'zmp-css';
  css.textContent =
    /* 4 checkout card */
    '#zmp-d{direction:rtl;margin:0 0 14px;border:1px solid #99f6e4;background:linear-gradient(180deg,#f0fdfa,#fff);border-radius:16px;padding:12px 14px;font-family:Almarai,sans-serif}' +
    '#zmp-d .r1{display:flex;align-items:center;gap:10px}' +
    '#zmp-d .r1 i{width:38px;height:38px;border-radius:50%;background:#14b8a6;color:#fff;display:flex;align-items:center;justify-content:center;flex:none}' +
    '#zmp-d small{display:block;font-size:12px;color:#64748b}#zmp-d b{display:block;font-size:15px;color:#0f172a;margin-top:1px}#zmp-d p{margin:2px 0 0;font-size:13px;color:#475569;line-height:1.4}' +
    '#zmp-d .rd{position:relative;height:24px;margin:10px 4px 0}' +
    '#zmp-d .rd:before{content:"";position:absolute;left:0;right:0;top:15px;border-top:2px dashed #5eead4}' +
    '#zmp-d .rd span{position:absolute;top:0;right:0;color:#0f766e;line-height:0}' +
    '#zmp-d.go .rd span{animation:zmpDrive 1.6s ease-in-out 1 forwards}' +
    '@keyframes zmpDrive{from{right:0}to{right:calc(100% - 24px)}}' +
    '#zmp-d .rd em{position:absolute;top:9px;left:-2px;width:12px;height:12px;border-radius:50%;background:#f97316;box-shadow:0 0 0 4px #ffedd5}' +
    '#zmp-d.zdone .rd span{right:calc(100% - 24px)}' +
    /* 1 thank-you */
    '#zmp-ok{display:flex;justify-content:center;margin:0 0 6px}' +
    '#zmp-ok svg{width:76px;height:76px}' +
    '#zmp-ok circle{fill:#14b8a6}#zmp-ok path{fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:48;stroke-dashoffset:0}' +
    'html.zmp-ty #zmp-ok svg{animation:zmpPop .5s cubic-bezier(.3,1.6,.5,1) both}' +
    'html.zmp-ty #zmp-ok path{animation:zmpDraw .45s .35s ease-out both}' +
    '@keyframes zmpPop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}' +
    '@keyframes zmpDraw{from{stroke-dashoffset:48}to{stroke-dashoffset:0}}' +
    'html.zmp-ty .zmp-in{animation:zmpUp .5s ease both;animation-delay:var(--d)}' +
    '@keyframes zmpUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '#zmp-te{direction:rtl;display:flex;align-items:center;gap:10px;max-width:420px;margin:14px auto 0;padding:12px 14px;border:1px solid #99f6e4;border-radius:16px;background:linear-gradient(180deg,#f0fdfa,#fff);font-family:Almarai,sans-serif;line-height:1.4;text-align:right}' +
    '#zmp-te i{width:38px;height:38px;border-radius:50%;background:#14b8a6;color:#fff;display:flex;align-items:center;justify-content:center;flex:none}' +
    '#zmp-te small{display:block;font-size:12px;color:#64748b}#zmp-te b{display:block;font-size:15px;color:#0f172a}' +
    'html.zmp-ty.zmp-done .zmp-in,html.zmp-ty.zmp-done #zmp-ok *{animation:none!important;opacity:1!important;transform:none!important;stroke-dashoffset:0!important}' +
    /* 3 search rows */
    '#zdd a.zss-r.zmp-r{animation:zmpRow .28s ease both;animation-delay:var(--d)}' +
    '@keyframes zmpRow{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){#zmp-d .rd span,html.zmp-ty .zmp-in,html.zmp-ty #zmp-ok *,#zdd a.zss-r.zmp-r{animation:none!important}#zmp-d .rd span{right:calc(100% - 24px)}}';
  document.head.appendChild(css);

  function cairoNow() { var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addWork(d, n) { var x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 5) n--; } return x; }   // Friday off
  function dates() { var t = cairoNow(), a = addWork(t, 1), b = addWork(t, 3); return DAYS[a.getDay()] + ' ' + a.getDate() + (a.getMonth() !== b.getMonth() ? ' ' + MON[a.getMonth()] : '') + ' – ' + DAYS[b.getDay()] + ' ' + b.getDate() + ' ' + MON[b.getMonth()]; }
  function seen(el, fn) {   // once on screen (tick: IntersectionObserver never fires in a hidden tab)
    var t = setInterval(function () { if (!el.isConnected) return clearInterval(t); var r = el.getBoundingClientRect(); if (r.top < innerHeight - 40 && r.bottom > 0) { clearInterval(t); fn(); } }, 250);
  }
  function dd(label) { var dts = document.querySelectorAll('dt'); for (var i = 0; i < dts.length; i++) if (dts[i].textContent.trim() === label && dts[i].nextElementSibling) { if (/مجاني/.test(dts[i].nextElementSibling.textContent)) return 0; var n = parseFloat(dts[i].nextElementSibling.textContent.replace(/[^\d.]/g, '')); if (!isNaN(n)) return n; } return null; }

  // 4) checkout delivery card
  function checkout() {
    var sec = document.querySelector('section.contact-info-heading'), host = sec && sec.parentElement;
    if (!host) return;
    var d = document.getElementById('zmp-d');
    if (!d) {
      d = document.createElement('div'); d.id = 'zmp-d';
      d.innerHTML = '<div class="r1"><i>' + TRUCK + '</i><div><small>التوصيل المتوقع</small><b>' + dates() + '</b><p></p></div></div><div class="rd"><span>' + TRUCK + '</span><em></em></div>';
      host.insertBefore(d, host.firstChild);
      if (RM) d.classList.add('zdone'); else seen(d, function () { setTimeout(function () { d.classList.add('go'); }, 250); });
    } else if (d.parentElement !== host) host.insertBefore(d, host.firstChild);
    var sh = dd('تكلفة الشحن'), p = d.querySelector('p');
    var t = sh === null ? 'الدفع عند الاستلام' : (sh === 0 ? 'الشحن مجاني على طلبك' : 'الشحن ' + sh + ' ج.م') + ' · الدفع عند الاستلام';
    if (p.textContent !== t) p.textContent = t;
  }

  // 1) thank-you page
  function thanks() {
    var box = document.querySelector('.thanks_content');
    if (!box) return;
    if (!document.getElementById('zmp-ok')) {
      var ok = document.createElement('div'); ok.id = 'zmp-ok';
      ok.innerHTML = '<svg viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="38"/><path d="M23 39l10 10 20-21"/></svg>';
      box.insertBefore(ok, box.firstChild);
      t0 = performance.now();
      if (!RM) document.documentElement.classList.add('zmp-ty');
      setTimeout(function () { document.documentElement.classList.add('zmp-done'); }, 4000);   // safety
    }
    if (!document.getElementById('zmp-te')) {
      var te = document.createElement('div'); te.id = 'zmp-te';
      te.innerHTML = '<i>' + TRUCK + '</i><span><small>التوصيل المتوقع</small><b>' + dates() + '</b></span>';
      box.appendChild(te);
    }
    var te2 = document.getElementById('zmp-te'); if (te2.nextElementSibling) box.appendChild(te2);   // stays last (wa-help / checkout-clear add lines later)
    // wa-help.js / checkout-clear.js add their lines a little later: each line's delay is set from its final place,
    // counted from when its own animation started (el._zt), and kept up to date while none has started yet (< 0.6 s)
    var now = (performance.now() - t0) / 1000, j = 0;
    [].forEach.call(box.children, function (el) {
      if (el.id === 'zmp-ok') return;
      j++;
      var fresh = !el.classList.contains('zmp-in');
      if (fresh) { el._zt = now; el.classList.add('zmp-in'); }
      if (fresh || now < 0.6) el.style.setProperty('--d', Math.max(0, 0.7 + j * 0.25 - el._zt).toFixed(2) + 's');
    });
  }
  var t0 = performance.now();

  // 3) search dropdown rows
  var shown = {};
  function search() {
    var d = document.getElementById('zdd');
    if (!d) { shown = {}; return; }
    var rows = d.querySelectorAll('a.zss-r'), now = {}, k = 0;
    [].forEach.call(rows, function (a) {
      var h = a.getAttribute('href'); now[h] = 1;
      if (a.dataset.zmp) return; a.dataset.zmp = 1;
      if (RM || shown[h]) return;
      a.classList.add('zmp-r'); a.style.setProperty('--d', Math.min(k++, 8) * 30 + 'ms');
    });
    if (rows.length) shown = now;
  }

  function run() {
    var p = location.pathname;
    if (/^\/checkout/.test(p)) checkout();
    else if (/^\/thanks/.test(p)) thanks();
    search();
  }
  var q = false;
  new MutationObserver(function () { run(); if (!q) { q = true; requestAnimationFrame(function () { q = false; run(); }); } }).observe(document.documentElement, { childList: true, subtree: true });
  run();
})();

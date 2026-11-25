/* Zella product page bundle (built 2026-11-26): eta.js (style «B») + notes-frame.js (no «تكبير») + pdp-layout.js. Sources in code/. */
/* Zella: delivery card on the product page (owner 2026-11-25, style «B»).
   In stock: one small card placed after «إصدارات تانية» (flex order 3 in .p_details_container, see pdp-layout.js):
     «اطلب النهارده يوصلك» + <next delivery day> – <3 delivery days after today + month> (Cairo date; the courier
     delivers every day except Friday, owner; official holidays not counted), then 3 small facts:
     «الدفع عند الاستلام» and «استبدال واسترجاع» open a sheet from the bottom with the store's own policy text
     (shortened, same facts), «اسألنا واتساب» opens WhatsApp with the perfume name.
     The theme's policy rows at the bottom and wa-help.js's #zwa-p line are hidden on product pages (pdp-layout.js).
   Sold out («نفذ المخزون» only): orange card «خلص دلوقتي / بلّغني لما يرجع 💬» (WhatsApp) right after the buttons,
     above smart-search.js's «بدائل متاحة» box (#zalt). */
(function () {
  if (window.__zellaEta) return; window.__zellaEta = 1;
  var WA = '6285659440745';   // same number as wa-help.js
  var DAYS = ['الأحد', 'الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت'];
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function ic(p, w) { return '<svg viewBox="0 0 24 24" width="' + (w || 18) + '" height="' + (w || 18) + '" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var TRUCK = '<path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z"/><circle cx="6" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>';
  var CASH = ic('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>');
  var SWAP = ic('<path d="M4 9h13l-3-3M20 15H7l3 3"/>');
  var BELL = ic('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>', 22);
  var WAI = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>';
  // the store's policy texts (EasyOrders product page), shortened, same facts
  var POL = [
    [CASH, 'الدفع عند الاستلام', 'تدفع لما البرفيوم يوصلك، وتقدر تعاينه قبل ما تستلم.<br>أو تعالى عاينه في فرعنا: 9 عبد الحميد لطفي، آخر مكرم عبيد، مدينة نصر.'],
    [SWAP, 'استبدال واسترجاع خلال 48 ساعة', 'لو فيه أي مشكلة في المنتج، بنستبدله أو نرجّعه خلال 48 ساعة من الاستلام.']
  ];
  var SHIP = 'المندوب بيتصل بيك قبل ما يوصل عشان يتأكد إنك موجود.';
  var css =
    '#zeta{margin:12px 0 4px;border:1px solid #e2e8f0;border-radius:16px;background:#fff;direction:rtl;overflow:hidden;color:#0f172a}' +
    '#zeta .ze-m{display:flex;align-items:center;gap:12px;padding:12px 14px;text-decoration:none;color:inherit}' +
    '#zeta .ze-i{flex:0 0 auto;width:42px;height:42px;border-radius:12px;background:#f0fdfa;color:#0d9488;display:flex;align-items:center;justify-content:center}' +
    '#zeta .ze-t small{display:block;font-size:12.5px;color:#64748b;font-weight:600}#zeta .ze-t b{display:block;font-size:16px;font-weight:800;color:#0f172a;margin-top:1px}' +
    '#zeta .ze-f{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid #f1f5f9;background:#fafafa}' +
    '#zeta .ze-f>*{display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 4px;font:inherit;font-size:12px;font-weight:700;color:#475569;text-decoration:none;text-align:center;line-height:1.25;border:0;background:none;cursor:pointer}' +
    '#zeta .ze-f>*+*{border-right:1px solid #f1f5f9}#zeta .ze-f svg{color:#0d9488}#zeta .ze-f a{color:#15803d}#zeta .ze-f a svg{color:#22c55e}' +
    '#zeta .ze-f em{font-style:normal;font-size:11px;color:#94a3b8;font-weight:600}' +
    '#zeta.zeta-out{border-color:#fed7aa;background:#fff7ed}#zeta.zeta-out .ze-i{background:#ffedd5;color:#c2410c}#zeta.zeta-out .ze-t b{color:#c2410c}' +
    '#zeta-sh{position:fixed;inset:0;z-index:100000;background:rgba(15,23,42,0);display:flex;align-items:flex-end;direction:rtl;transition:background .25s}#zeta-sh.on{background:rgba(15,23,42,.45)}' +
    '#zeta-sh .zs-b{width:100%;max-width:560px;margin:0 auto;background:#fff;border-radius:22px 22px 0 0;padding:10px 20px 28px;transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.9,.3,1);touch-action:none;box-shadow:0 -8px 30px rgba(15,23,42,.12)}#zeta-sh.on .zs-b{transform:none}#zeta-sh.drag .zs-b{transition:none}' +
    '#zeta-sh i{display:block;width:44px;height:5px;border-radius:5px;background:#cbd5e1;margin:0 auto 16px}#zeta-sh b{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:800;color:#0f172a}#zeta-sh b svg{color:#0d9488}' +
    '#zeta-sh p{font-size:14.5px;color:#475569;line-height:1.8;margin:10px 0 0}#zeta-sh .zs-2{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;color:#64748b;padding-top:10px;border-top:1px solid #f1f5f9}#zeta-sh .zs-2 svg{flex:0 0 auto;color:#0d9488;margin-top:4px}' +
    '#zeta-sh small{display:block;text-align:center;margin-top:16px;font-size:12px;color:#94a3b8;font-weight:600}' +
    '@media (prefers-reduced-motion:reduce){#zeta-sh,#zeta-sh .zs-b{transition:none}}';

  function cairoNow() { var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addWork(d, n) { var x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 5) n--; } return x; }   // Friday off
  function range() {
    var t = cairoNow(), a = addWork(t, 1), b = addWork(t, 3);
    return DAYS[a.getDay()] + ' ' + a.getDate() + (a.getMonth() !== b.getMonth() ? ' ' + MON[a.getMonth()] : '') + ' – ' + DAYS[b.getDay()] + ' ' + b.getDate() + ' ' + MON[b.getMonth()];
  }
  function waLink(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }
  function here() { return location.origin + location.pathname; }
  function inHTML(name) {
    return '<div class="ze-m"><span class="ze-i">' + ic(TRUCK, 22) + '</span><span class="ze-t"><small>اطلب النهارده يوصلك</small><b>' + range() + '</b></span></div>' +
      '<div class="ze-f">' + POL.map(function (p, i) { return '<button type="button" data-i="' + i + '">' + p[0] + p[1].replace(' خلال 48 ساعة', '') + '<em>اعرف أكتر</em></button>'; }).join('') +
      '<a href="' + waLink('أهلاً Zella Store، عندي سؤال عن ' + name + '\n' + here()) + '" target="_blank" rel="noopener">' + WAI + 'اسألنا واتساب<em>رد سريع</em></a></div>';
  }
  function outHTML(name) {
    return '<a class="ze-m" href="' + waLink('أهلاً Zella Store، البرفيوم ده خلص: ' + name + '\n' + here() + '\nبلّغوني لما يرجع لو سمحتوا') + '" target="_blank" rel="noopener">' +
      '<span class="ze-i">' + BELL + '</span><span class="ze-t"><small>خلص دلوقتي</small><b>بلّغني لما يرجع 💬</b></span></a>';
  }
  // bottom sheet: slides up; closes by swiping it down, tapping outside it, Escape, or leaving the page — no button
  function sheet(i) {
    var p = POL[i]; if (!p) return;
    var old = document.getElementById('zeta-sh'); if (old) old.remove();
    var sh = document.createElement('div'); sh.id = 'zeta-sh';
    sh.innerHTML = '<div class="zs-b" role="dialog" aria-modal="true" aria-label="' + p[1] + '"><i></i><b>' + p[0] + p[1] + '</b><p>' + p[2] + '</p><p class="zs-2">' + ic(TRUCK) + SHIP + '</p><small>اسحب لتحت للقفل</small></div>';
    var bx = sh.firstChild, y0 = null, dy = 0, t0 = 0;
    function close() { sh.classList.remove('drag'); bx.style.transform = ''; sh.classList.remove('on'); document.removeEventListener('keydown', esc); setTimeout(function () { sh.remove(); }, 320); }
    function esc(e) { if (e.key === 'Escape') close(); }
    sh.addEventListener('click', function (e) { if (e.target === sh) close(); });
    bx.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; dy = 0; t0 = Date.now(); sh.classList.add('drag'); }, { passive: true });
    bx.addEventListener('touchmove', function (e) { if (y0 === null) return; dy = Math.max(0, e.touches[0].clientY - y0); bx.style.transform = 'translateY(' + dy + 'px)'; }, { passive: true });
    bx.addEventListener('touchend', function () { if (y0 === null) return; y0 = null; sh.classList.remove('drag'); var fast = dy > 30 && dy / Math.max(1, Date.now() - t0) > 0.5; if (dy > 80 || fast) close(); else bx.style.transform = ''; });
    document.addEventListener('keydown', esc);
    document.body.appendChild(sh);
    requestAnimationFrame(function () { requestAnimationFrame(function () { sh.classList.add('on'); }); });
    try { window.clarity && window.clarity('event', 'deliv_info_' + i); } catch (e) { }
  }
  function isProduct() { return /^\/products\/[^\/]+/.test(location.pathname); }
  function addCss() { if (!document.getElementById('zbe-css')) { var s = document.createElement('style'); s.id = 'zbe-css'; s.textContent = css; document.head.appendChild(s); } }
  function btns(re) { return [].filter.call(document.querySelectorAll('button'), function (b) { return re.test(b.textContent) && b.offsetParent; }); }
  function run() {
    var oe = document.getElementById('zeta');
    if (!isProduct()) { if (oe) oe.remove(); var sh = document.getElementById('zeta-sh'); if (sh) sh.remove(); return; }
    var h1 = document.querySelector('h1.product_name'), name = h1 ? h1.innerText.trim() : '';
    var buy = btns(/اضغط هنا للشراء/)[0], out = btns(/نفذ المخزون/)[0];
    var anchor = buy || out; if (!anchor || !anchor.parentElement || !name) { if (oe) oe.remove(); return; }
    var state = (out && !buy) ? 'out' : 'in', key = location.pathname + '|' + state + '|' + name + '|' + cairoNow().getDate();
    if (!oe || oe.dataset.k !== key || !document.body.contains(oe)) {
      addCss(); if (oe) oe.remove();
      oe = document.createElement('div'); oe.id = 'zeta'; oe.dataset.k = key;
      if (state === 'out') { oe.className = 'zeta-out'; oe.innerHTML = outHTML(name); }
      else {
        oe.innerHTML = inHTML(name);
        oe.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (b) { e.preventDefault(); sheet(+b.dataset.i); } });
      }
    }
    var box = anchor.parentElement, det = document.querySelector('.p_details_container');
    if (state === 'in' && det) {   // after «إصدارات تانية»: a direct child of the details column, flex order 3 (pdp-layout.js)
      if (oe.parentElement !== det) det.appendChild(oe);
    } else if (oe.previousElementSibling !== box) box.insertAdjacentElement('afterend', oe);   // sold out: right under the buttons, above #zalt
  }
  setInterval(run, 400); run();
})();

;
/* Zella: notes frame on the product page (owner 2026-11-25). One fixed-size card «مكونات البرفيوم» for every product,
   in place of the theme's description (flex order 4 in .p_details_container, see pdp-layout.js):
   - description with the HTML pyramid (≈220 products: titles الإفتتاحية / قلب العطر / المكونات الأساسية + small note
     pictures) is redrawn as 3 rows «البداية / القلب / القاعدة» of round notes that scroll sideways;
   - description with one notes picture (≈250 products) shows it inside the same frame (contain) (no zoom, owner);
   - anything else (bundles, text) keeps the theme's description untouched.
   The theme node is only hidden (class zn-old), never moved; the frame is rebuilt when the description changes (SPA). */
(function () {
  if (window.__zellaNotes) return; window.__zellaNotes = 1;
  var TIER = { 'الإفتتاحية': ['البداية', 'أول ما تحطه'], 'الافتتاحية': ['البداية', 'أول ما تحطه'], 'قلب العطر': ['القلب', 'بعد شوية'], 'المكونات الأساسية': ['القاعدة', 'اللي بيفضل'], 'القاعدة': ['القاعدة', 'اللي بيفضل'] };
  var css =
    'html.zpdp .product_description.zn-old{display:none!important}' +
    '#znf{margin-top:16px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;direction:rtl;overflow:hidden}' +
    '#znf .zn-h{padding:14px 14px 10px;background:linear-gradient(180deg,#f0fdfa,#fff)}#znf .zn-h b{display:block;font-size:17px;font-weight:800;color:#0f172a}' +
    '#znf .zn-b{position:relative;height:300px;border-top:1px solid #f1f5f9}' +
    '#znf .zn-rows{height:100%;display:flex;flex-direction:column;justify-content:space-around;padding:6px 0}' +
    '#znf .zn-r{display:flex;align-items:center;gap:6px;min-height:0}' +
    '#znf .zn-l{flex:0 0 62px;padding-right:12px;font-size:12.5px;font-weight:800;color:#0f766e;line-height:1.2}#znf .zn-l i{display:block;font-style:normal;font-size:11px;color:#94a3b8;font-weight:600}' +
    '#znf .zn-s{flex:1;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 2px 12px;-webkit-mask-image:linear-gradient(270deg,#000 85%,transparent);mask-image:linear-gradient(270deg,#000 85%,transparent)}#znf .zn-s::-webkit-scrollbar{display:none}' +
    '#znf .zn-n{flex:0 0 64px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11.5px;font-weight:700;color:#334155;text-align:center;line-height:1.2}' +
    '#znf .zn-n img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 0 0 1px #e2e8f0,0 2px 6px rgba(15,23,42,.08);background:#f8fafc}' +
    '#znf .zn-pic{height:100%;display:flex;align-items:center;justify-content:center;padding:10px;background:#fcfcfd}' +
    '#znf .zn-pic img{max-width:100%;max-height:100%;object-fit:contain;border-radius:10px}' +
    '';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build(desc) {
    var tiers = [], ti = -1;
    [].forEach.call(desc.querySelectorAll('div,img'), function (el) {
      if (el.tagName === 'DIV') { if (el.childElementCount === 0 && TIER[el.textContent.trim()]) { tiers.push({ t: TIER[el.textContent.trim()], n: [] }); ti = tiers.length - 1; } return; }
      if (ti >= 0) { var sp = el.parentElement && el.parentElement.querySelector('span'); tiers[ti].n.push([el.getAttribute('src'), sp ? sp.textContent.trim() : (el.alt || '')]); }
    });
    tiers = tiers.filter(function (x) { return x.n.length; });
    if (tiers.length) return '<div class="zn-rows">' + tiers.map(function (x) {
      return '<div class="zn-r"><div class="zn-l">' + x.t[0] + '<i>' + x.t[1] + '</i></div><div class="zn-s">' +
        x.n.map(function (n) { return '<span class="zn-n"><img src="' + esc(n[0]) + '" alt="" loading="lazy">' + esc(n[1].replace(/^ال(?=\S{3})/, '')) + '</span>'; }).join('') + '</div></div>';
    }).join('') + '</div>';
    var imgs = desc.querySelectorAll('img'), txt = desc.textContent.replace(/\s+/g, '');
    if (imgs.length === 1 && txt.length < 40) return '<div class="zn-pic"><img src="' + esc(imgs[0].getAttribute('src')) + '" alt="مكونات البرفيوم"></div>';
    return '';
  }
  function run() {
    var f = document.getElementById('znf');
    if (!/^\/products\/[^\/]+/.test(location.pathname)) { if (f) f.remove(); return; }
    var desc = document.querySelector('.p_details_container .product_description'); if (!desc) { if (f) f.remove(); return; }
    var key = location.pathname + '|' + desc.innerHTML.length;
    if (f && f.dataset.k === key && document.body.contains(f)) return;
    if (f) f.remove();
    desc.classList.remove('zn-old');
    var body = build(desc); if (!body) return;   // keep the theme's description as it is
    if (!document.getElementById('znf-css')) { var s = document.createElement('style'); s.id = 'znf-css'; s.textContent = css; document.head.appendChild(s); }
    f = document.createElement('div'); f.id = 'znf'; f.dataset.k = key;
    f.innerHTML = '<div class="zn-h"><b>مكونات البرفيوم</b></div><div class="zn-b">' + body + '</div>';
    desc.classList.add('zn-old'); desc.insertAdjacentElement('beforebegin', f);
  }
  setInterval(run, 500); run();
})();
;
/* Zella: calmer product page (owner, 2026-11-25). CSS only, no moves of theme nodes (the theme's React keeps them).
   On /products/*, order of the details column:
     1 product info (name, price, buy buttons) -> 2 bogo.js's #zella-related «إصدارات تانية» -> 3 eta.js's delivery
     card #zeta -> 4 notes-frame.js's #znf «مكونات البرفيوم» (or the theme description) -> 5 the rest.
   - the theme's free-shipping box under the buttons (progress + its small slider) is hidden; #zella-related inside it stays;
   - the theme's policy rows (shipping, exchange, COD) are hidden: their facts are in the delivery card's sheets;
   - wa-help.js's WhatsApp line #zwa-p is hidden here: the delivery card has «اسألنا واتساب»;
   - the main picture loads first (the theme marks it loading=lazy).
   Needs :has() for the order (Chrome 105+, iOS 15.4+); older browsers keep the theme order. */
(function () {
  if (window.__zellaPdp) return; window.__zellaPdp = 1;
  var D = 'html.zpdp .p_details_container', BOX = D + '>div.bg-white.rounded-lg.border', DS = D + '>div:has(.product_description)';
  var css =
    D + '{display:flex;flex-direction:column}' +
    D + '>div{order:1}' +
    BOX + '{display:contents}' +
    BOX + '>:not(#zella-related){display:none!important}' +
    D + ' #zella-related{order:2;margin-top:14px;border:1px solid #e2e8f0;border-radius:14px;padding:12px 8px;background:#fff}' +
    D + '>#zeta{order:3}' +
    DS + '{display:contents}' +
    D + ' .product_description{order:4}' +
    'html.zpdp #znf{order:4}' +
    DS + '>:not(.product_description):not(#znf){order:5;margin-top:18px}' +
    DS + '>div:has(button[id^="headlessui-disclosure"]){display:none!important}' +
    'html.zpdp #zwa-p{display:none!important}' +
    '';   // the first-screen rules (one-picture gallery, smaller gap) are in the Header layout <style> (layout-fix.css) so they apply before the first paint
  var st = document.createElement('style'); st.id = 'zpdp-css'; st.textContent = css; document.head.appendChild(st);
  function run() {
    var on = /^\/products\/[^\/]+/.test(location.pathname), h = document.documentElement;
    h.classList.toggle('zpdp', on); if (!on) return;
    var im = document.querySelector('.p_gallery_container img');
    if (im && im.loading === 'lazy') { im.loading = 'eager'; im.setAttribute('fetchpriority', 'high'); }
  }
  setInterval(run, 300); run();
})();

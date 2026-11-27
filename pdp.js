/* Zella product page bundle (built 2026-11-26): eta.js (line, notes, rows) + notes-frame.js + pdp-layout.js. Sources in code/. */
/* Zella: delivery + store info on the product page (owner 2026-11-26, athrscents-style «C»).
   In stock (owner 2026-11-26 order): line #zetl (flex order 3, after «إصدارات تانية») -> notes frame #znf (order 4,
     notes-frame.js, always open) -> rows #zeta (order 5) -> the rest of the page (order 6), see pdp-layout.js:
     line «التوصيل المتوقع: <next delivery day> – <3 delivery days after today + month>» (Cairo date; the courier delivers
     every day except Friday, owner; official holidays not counted);
     rows that open in place (<details>, nothing leaves the page): الشحن والتوصيل / الدفع عند الاستلام /
     الاستبدال والاسترجاع / العرض الحالي (only on Men + Women Collection products, where the EasyOrders BOGO discount runs;
     categories from api/v1/products?join=categories, no free-shipping amount, owner);
     last a small line «لديك استفسار؟ تواصل معنا عبر واتساب» (WhatsApp with the perfume name).
     Facts = the store policies (EasyOrders → سياسات المتجر). Clarity event deliv_info_<k> when a row opens.
     The theme's policy rows at the bottom and wa-help.js's #zwa-p line are hidden on product pages (pdp-layout.js).
   Sold out («نفذ المخزون» only): orange card «خلص دلوقتي / بلّغني لما يرجع» right after the buttons, above smart-search.js's
     «بدائل متاحة» box (#zalt): phone field + «بلّغني» -> worker POST /notifyme; the cashier app's order-confirmation WhatsApp
     number sends one message when it is back (owner 2026-11-26). localStorage zbis-<slug> keeps the «✓ تمام» state. */
(function () {
  if (window.__zellaEta) return; window.__zellaEta = 1;
  var WA = '6285659440745';   // same number as wa-help.js
  var DAYS = ['الأحد', 'الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت'];
  var MON = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  function ic(p, w) { return '<svg viewBox="0 0 24 24" width="' + (w || 18) + '" height="' + (w || 18) + '" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var TRUCK = '<path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z"/><circle cx="6" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>';
  var CASH = '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>';
  var SWAP = '<path d="M4 9h13l-3-3M20 15H7l3 3"/>';
  var DROP = '<path d="M9 3h6M10 3v3h4V3M8 6h8l1.5 3v10a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V9z"/>';
  var GIFT = '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 4 8 4.5 7.5 8 12 8zM12 8s1.5-4 4-3.5S16.5 8 12 8z"/>';
  var Q = '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17h.01"/>';
  var DOWN = ic('<path d="M6 9l6 6 6-6"/>', 18);
  var BELL = ic('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>', 22);
  function waIcon(w) { return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>'; }
  var css =
    '#zeta{margin:16px 0 4px;direction:rtl;color:#0f172a}#zeta.zeta-out{margin-top:12px}' +
    '#zetl{display:flex;align-items:center;gap:8px;margin:16px 0 0;padding:2px;direction:rtl;font-size:14.5px;color:#475569;font-weight:600}#zetl svg{color:#0f172a}#zetl b{color:#0f172a;font-weight:800}' +
    '#zeta details{border:1px solid #e5e7eb;border-radius:14px;background:#fff;margin-top:10px;overflow:hidden}#zeta details:first-child{margin-top:0}' +
    '#zeta summary{list-style:none;display:flex;align-items:center;gap:10px;padding:15px 16px;font-size:15px;font-weight:800;color:#0f172a;cursor:pointer}#zeta summary::-webkit-details-marker{display:none}' +
    '#zeta summary>svg:first-child{color:#0d9488}#zeta summary span{flex:1}#zeta summary>svg:last-child{color:#0f172a;transition:transform .25s}#zeta details[open] summary>svg:last-child{transform:rotate(180deg)}' +
    '#zeta .zm-b{padding:0 14px 14px;animation:zmo .25s ease-out}@keyframes zmo{from{opacity:0;transform:translateY(-4px)}}' +
    '#zeta .zm-p{margin:0;padding:0 4px;font-size:14.5px;line-height:1.7;color:#475569}#zeta .zm-p b{color:#0f172a;font-weight:800}' +
    '#zeta details.zof{border-color:#fed7aa;background:#fff7ed}#zeta details.zof summary>svg:first-child{color:#f97316}#zeta details.zof summary span{color:#9a3412}#zeta details.zof summary>svg:last-child{color:#c2410c}#zeta details.zof .zm-b{background:#fff;border-top:1px solid #fed7aa;padding:14px 10px 12px}' +
    '#zeta .zy{display:flex;align-items:flex-start;justify-content:space-between;padding:2px 0}#zeta .zy>div{flex:0 0 72px;display:flex;flex-direction:column;align-items:center;text-align:center}' +
    '#zeta .zy>i{flex:1;margin-top:24px;height:2px;background:#99f6e4;display:flex;align-items:center;justify-content:center}#zeta .zy>i.o{background:none;border-top:2px dashed #fdba74;height:0}' +
    '#zeta .zy>i u{text-decoration:none;margin-top:-1px;padding:2px 9px;border-radius:999px;background:#fff;border:1.5px solid #fdba74;color:#c2410c;font-size:12px;font-weight:800;font-style:normal;line-height:1.3}' +
    '#zeta .zy span{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;color:#0d9488;border:1.5px solid #99f6e4}#zeta .zy .h span{background:#f0fdfa}#zeta .zy .g span{background:#f97316;color:#fff;border-color:#f97316;box-shadow:0 4px 12px rgba(249,115,22,.25)}' +
    '#zeta .zy b{margin-top:8px;font-size:13px;font-weight:700;color:#334155}#zeta .zy small{font-size:14px;font-weight:800;color:#0f172a;margin-top:1px}#zeta .zy .h small{color:#0d9488}#zeta .zy .g small{color:#c2410c}' +
    '#zeta .zy em{font-style:normal;font-size:11.5px;font-weight:600;color:#94a3b8;margin-top:1px;white-space:nowrap}' +
    '#zeta .zm-ask{display:flex;align-items:center;gap:8px;margin-top:12px;padding:4px;text-decoration:none;font-size:14px;color:#475569;font-weight:600}#zeta .zm-ask>svg{color:#0d9488}#zeta .zm-ask span{flex:1}' +
    '#zeta .zm-ask b{display:inline-flex;align-items:center;gap:5px;color:#15803d;font-weight:800}#zeta .zm-ask b svg{color:#22c55e}' +
    '#zeta.zeta-out{border:1px solid #fed7aa;border-radius:16px;background:#fff7ed;overflow:hidden;margin-top:12px}#zeta .ze-o{display:flex;align-items:center;gap:12px;padding:12px 14px;text-decoration:none;color:inherit}' +
    '#zeta .ze-i{flex:0 0 auto;width:42px;height:42px;border-radius:12px;background:#ffedd5;color:#c2410c;display:flex;align-items:center;justify-content:center}#zeta .ze-o small{display:block;font-size:12.5px;color:#64748b;font-weight:600}#zeta .ze-o b{display:block;font-size:16px;font-weight:800;color:#c2410c;margin-top:1px}' +
    '#zeta .ze-o{padding-bottom:4px}#zeta .ze-f,#zeta .ze-ok{margin:0;padding:0 14px 14px}#zeta .ze-t{margin:2px 0 10px;font-size:14px;line-height:1.6;color:#7c2d12;font-weight:600}' +
    '#zeta .ze-r{display:flex;gap:8px}#zeta .ze-r input[type=tel]{flex:1;min-width:0;height:48px;border:1.5px solid #fdba74;border-radius:12px;background:#fff;padding:0 12px;font-size:16px;direction:ltr;text-align:right;color:#0f172a;outline:none}' +
    '#zeta .ze-r input[type=tel]:focus{border-color:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,.15)}#zeta .ze-hp{position:absolute;width:1px;height:1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);opacity:0;pointer-events:none}#zeta .ze-f{position:relative}' +
    '#zeta .ze-r button{flex:0 0 auto;height:48px;padding:0 20px;border:0;border-radius:12px;background:#f97316;color:#fff;font-size:16px;font-weight:800;cursor:pointer}#zeta .ze-r button:disabled{opacity:.7}' +
    '#zeta .ze-e{margin:8px 0 0;font-size:13px;color:#b91c1c;font-weight:600}#zeta .ze-ok{padding-top:6px;font-size:14.5px;line-height:1.6;color:#15803d;font-weight:700}' +
    '@media (prefers-reduced-motion:reduce){#zeta .zm-b{animation:none}#zeta summary>svg:last-child{transition:none}}';

  function cairoNow() { var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addWork(d, n) { var x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 5) n--; } return x; }   // Friday off
  function range() {
    var t = cairoNow(), a = addWork(t, 1), b = addWork(t, 3);
    return DAYS[a.getDay()] + ' ' + a.getDate() + (a.getMonth() !== b.getMonth() ? ' ' + MON[a.getMonth()] : '') + ' – ' + DAYS[b.getDay()] + ' ' + b.getDate() + ' ' + MON[b.getMonth()];
  }
  function waLink(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }
  function here() { return location.origin + location.pathname; }
  function askLink(name) { return waLink('أهلاً Zella Store، عندي سؤال عن ' + name + '\n' + here()); }
  function one(t) { return '<p class="zm-p">' + t + '</p>'; }
  function row(k, icon, title, body) { return '<details data-k="' + k + '"><summary>' + ic(icon, 20) + '<span>' + title + '</span>' + DOWN + '</summary><div class="zm-b">' + body + '</div></details>'; }
  function offer() {   // one line, two offers (owner 2026-11-26): 1st at its price -> 2nd 50% (buying 2) «أو» 3rd free (buying 3)
    return '<div class="zy"><div><span>' + ic(DROP, 22) + '</span><b>الأولى</b><small>بسعرها</small></div><i></i>' +
      '<div class="h"><span>' + ic(DROP, 22) + '</span><b>التانية</b><small>خصم 50%</small><em>عند شراء قطعتين</em></div><i class="o"><u>أو</u></i>' +
      '<div class="g"><span>' + ic(GIFT, 22) + '</span><b>التالتة</b><small>مجاناً</small><em>عند شراء 3 قطع</em></div></div>';
  }
  function inHTML(name, date, bogo) {
    return row(0, TRUCK, 'الشحن والتوصيل', one('التوصيل خلال <b>3 أيام عمل</b> كحد أقصى، مع تواصل المندوب قبل الوصول.')) +
      row(1, CASH, 'الدفع عند الاستلام', one('<b>الدفع نقداً عند الاستلام</b>، مع إمكانية معاينة المنتج قبل الدفع.')) +
      row(2, SWAP, 'الاستبدال والاسترجاع', one('الاستبدال أو الاسترجاع متاح خلال <b>48 ساعة</b> من الاستلام في حال وجود أي مشكلة بالمنتج، مع إمكانية معاينة الطلب قبل الدفع.')) +
      (bogo ? row(3, GIFT, 'العرض الحالي 🎁', offer()).replace('<details ', '<details class="zof" ') : '') +
      '<a class="zm-ask" href="' + askLink(name) + '" target="_blank" rel="noopener">' + ic(Q, 18) + '<span>لديك استفسار؟</span><b>' + waIcon(15) + 'تواصل معنا عبر واتساب</b></a>';
  }
  function lineHTML(date) { return ic(TRUCK, 20) + '<span>التوصيل المتوقع: <b>' + date + '</b></span>'; }
  // sold out (owner 2026-11-26): the customer leaves a phone number; when the perfume is back, the order-confirmation
  // WhatsApp number (cashier app, wa-ship) sends one message by itself. Saved by the worker POST /notifyme {sku, slug, name, phone}.
  var NOTIFY = 'https://zella-cost-sync.amrxvv.workers.dev/notifyme';
  function bisKey(slug) { return 'zbis-' + slug.toLowerCase(); }
  function bisGet(slug) { try { return localStorage.getItem(bisKey(slug)) || ''; } catch (e) { return ''; } }
  function outHTML(name, slug) {
    var done = bisGet(slug);
    return '<div class="ze-o"><span class="ze-i">' + BELL + '</span><span><small>خلص دلوقتي</small><b>بلّغني لما يرجع</b></span></div>' +
      (done ? '<p class="ze-ok">تمام، هنبعتلك رسالة واتساب على <bdi>' + done + '</bdi> أول ما يرجع ✅</p>' :
        '<form class="ze-f" novalidate><p class="ze-t">اكتب رقم موبايلك وهنبعتلك رسالة واتساب أول ما يرجع.</p>' +
        '<div class="ze-r"><input type="tel" inputmode="numeric" autocomplete="tel" maxlength="16" placeholder="01xxxxxxxxx" aria-label="رقم الموبايل">' +
        '<input class="ze-hp" name="hp" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="submit">بلّغني</button></div><p class="ze-e" hidden></p></form>');
  }
  function phoneOf(v) {
    v = String(v).replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/[۰-۹]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); }).replace(/\D/g, '');
    if (/^(00)?20(1\d{9})$/.test(v)) v = '0' + v.replace(/^(00)?20/, '');
    return /^01[0125]\d{8}$/.test(v) ? v : '';
  }
  var skus = {};
  function skuOf(slug) {
    if (skus[slug]) return Promise.resolve(skus[slug]);
    return fetch('https://api.easy-orders.net/api/v1/products?fields=id,slug,sku&limit=5&filter=slug||$in||' + encodeURIComponent(slug))
      .then(function (r) { return r.json(); }).then(function (j) {
        var p = (Array.isArray(j) ? j : (j && j.data) || []).filter(function (x) { return String(x.slug).toLowerCase() === slug.toLowerCase(); })[0];
        return (skus[slug] = (p && p.sku) || '');
      });
  }
  function bindOut(oe, name, slug) {
    var f = oe.querySelector('.ze-f'); if (!f) return;
    var inp = f.querySelector('input[type=tel]'), err = f.querySelector('.ze-e'), b = f.querySelector('button');
    function say(t) { err.textContent = t; err.hidden = !t; }
    inp.addEventListener('input', function () { say(''); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ph = phoneOf(inp.value);
      if (!ph) { say('اكتب رقم موبايل مصري صحيح من 11 رقم، يبدأ بـ 01.'); inp.focus(); return; }
      b.disabled = true; b.textContent = '...'; say('');
      skuOf(slug).then(function (sku) {
        return fetch(window.__zNotifyUrl || NOTIFY, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sku: sku, slug: slug, name: name, phone: ph, hp: f.querySelector('.ze-hp').value }) });
      }).then(function (r) {
        if (r.status === 429) throw new Error('many');
        return r.json().then(function (j) { if (!r.ok || !j || !j.ok) throw new Error((j && j.err) || 'bad'); });
      }).then(function () {
        try { localStorage.setItem(bisKey(slug), ph); } catch (x) { }
        try { window.clarity && window.clarity('event', 'bis_signup'); } catch (x) { }
        f.outerHTML = '<p class="ze-ok">تمام، هنبعتلك رسالة واتساب على <bdi>' + ph + '</bdi> أول ما يرجع ✅</p>';
      }).catch(function (x) {
        b.disabled = false; b.textContent = 'بلّغني';
        say(x && x.message === 'phone' ? 'اكتب رقم موبايل مصري صحيح من 11 رقم، يبدأ بـ 01.' :
          x && x.message === 'many' ? 'استنى شوية وجرّب تاني.' : 'حصلت مشكلة، جرّب تاني بعد شوية.');
      });
    });
  }
  // BOGO offer only on Men / Women Collection products (EasyOrders automatic discounts run on those two categories)
  var cats = {};
  function bogoOf(slug) {
    if (slug in cats) return cats[slug];
    cats[slug] = null;
    fetch('https://api.easy-orders.net/api/v1/products?join=categories&fields=id,slug&limit=5&filter=slug||$in||' + encodeURIComponent(slug))
      .then(function (r) { return r.json(); }).then(function (j) {
        var p = (Array.isArray(j) ? j : (j && j.data) || []).filter(function (x) { return String(x.slug).toLowerCase() === slug.toLowerCase(); })[0];
        cats[slug] = !!(p && (p.categories || []).some(function (c) { return /^(men|women) collection$/i.test((c.name || '').trim()); }));
        run();
      }).catch(function () { cats[slug] = false; });
    return null;
  }
  function isProduct() { return /^\/products\/[^\/]+/.test(location.pathname); }
  function addCss() { if (!document.getElementById('zbe-css')) { var s = document.createElement('style'); s.id = 'zbe-css'; s.textContent = css; document.head.appendChild(s); } }
  function btns(re) { return [].filter.call(document.querySelectorAll('button'), function (b) { return re.test(b.textContent) && b.offsetParent; }); }
  function run() {
    var oe = document.getElementById('zeta'), ln = document.getElementById('zetl');
    if (!isProduct()) { if (oe) oe.remove(); if (ln) ln.remove(); return; }
    var h1 = document.querySelector('h1.product_name'), name = h1 ? h1.innerText.trim() : '';
    // the theme's buy button says the product's own «buy_now_text»; products saved without it say «إتمام الطلب»
    // (2026-11-26: 9 new products had no rows because of that), so take any buy-style button inside the details column
    var det0 = document.querySelector('.p_details_container') || document;
    var own = function (re) { return [].filter.call(det0.querySelectorAll('button'), function (b) { return re.test(b.textContent) && b.offsetParent && !b.closest('.home_grid_section_card,#zella-related,#zalt,#zeta'); }); };
    var buy = own(/^\s*(اضغط هنا للشراء|إتمام الطلب)\s*$/)[0] || btns(/اضغط هنا للشراء/)[0], out = own(/نفذ المخزون/)[0] || btns(/نفذ المخزون/)[0];
    var anchor = buy || out; if (!anchor || !anchor.parentElement || !name) { if (oe) oe.remove(); if (ln) ln.remove(); return; }
    var slug = decodeURIComponent(location.pathname.split('/')[2] || '');
    var state = (out && !buy) ? 'out' : 'in', date = range(), bogo = state === 'in' && bogoOf(slug) === true;
    var key = location.pathname + '|' + state + '|' + name + '|' + date + '|' + bogo;
    if (!oe || oe.dataset.k !== key || !document.body.contains(oe)) {
      addCss();
      var open = oe ? [].map.call(oe.querySelectorAll('details[open]'), function (d) { return d.dataset.k; }) : [];
      if (oe && oe.dataset.k.split('|')[0] !== location.pathname) open = [];
      if (oe) oe.remove();
      oe = document.createElement('div'); oe.id = 'zeta'; oe.dataset.k = key;
      if (state === 'out') { oe.className = 'zeta-out'; oe.innerHTML = outHTML(name, slug); bindOut(oe, name, slug); }
      else {
        oe.innerHTML = inHTML(name, date, bogo);
        open.forEach(function (k) { var d = oe.querySelector('details[data-k="' + k + '"]'); if (d) d.open = true; });
        oe.addEventListener('toggle', function (e) { var d = e.target; if (d.open) try { window.clarity && window.clarity('event', 'deliv_info_' + d.dataset.k); } catch (x) { } }, true);
      }
    }
    var box = anchor.parentElement, det = document.querySelector('.p_details_container');
    if (state === 'in' && det) {   // direct children of the details column: line #zetl order 3, notes #znf 4, rows #zeta 5 (pdp-layout.js)
      if (!ln) { ln = document.createElement('div'); ln.id = 'zetl'; }
      var lh = lineHTML(date); if (ln.innerHTML !== lh) ln.innerHTML = lh;
      if (ln.parentElement !== det) det.appendChild(ln);
      if (oe.parentElement !== det) det.appendChild(oe);
    } else {
      if (ln) ln.remove();
      if (oe.previousElementSibling !== box) box.insertAdjacentElement('afterend', oe);   // sold out: right under the buttons, above #zalt
    }
  }
  setInterval(run, 400); run();
})();
;
/* Zella: notes frame on the product page (owner 2026-11-25). One fixed-size card «مكونات البرفيوم» for every product,
   in place of the theme's description (flex order 4 in .p_details_container, see pdp-layout.js):
   - description with the HTML pyramid (≈220 products: titles الإفتتاحية / قلب العطر / المكونات الأساسية + small note
     pictures) is redrawn as 3 centered groups of round notes (top / heart / base, thin lines between, no names, owner 2026-11-26);
   - description with one notes picture (≈250 products) shows it inside the same frame (contain) (no zoom, owner);
   - anything else (bundles, text) keeps the theme's description untouched.
   The theme node is only hidden (class zn-old), never moved; the frame is rebuilt when the description changes (SPA). */
(function () {
  if (window.__zellaNotes) return; window.__zellaNotes = 1;
  var TIER = { 'الإفتتاحية': ['البداية', 'أول ما تحطه'], 'الافتتاحية': ['البداية', 'أول ما تحطه'], 'قلب العطر': ['القلب', 'بعد شوية'], 'المكونات الأساسية': ['القاعدة', 'اللي بيفضل'], 'القاعدة': ['القاعدة', 'اللي بيفضل'],
    'المكونات': ['المكونات', ''], 'مكونات العطر': ['المكونات', ''], 'مكونات البرفيوم': ['المكونات', ''] };   // one-group descriptions (e.g. dgRose)
  var css =
    'html.zpdp .product_description.zn-old{display:none!important}' +
    '#znf{margin-top:16px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;direction:rtl;overflow:hidden}' +
    '#znf .zn-h{text-align:center;padding:14px 14px 10px;background:linear-gradient(180deg,#f0fdfa,#fff)}#znf .zn-h b{display:block;font-size:17px;font-weight:800;color:#0f172a}' +
    '#znf .zn-b{position:relative;border-top:1px solid #f1f5f9}#znf .zn-b.zn-fix{height:300px}' +
    '#znf .zn-tg{display:flex;flex-direction:column;align-items:center;padding:8px 10px 14px}#znf .zn-tg>div{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 4px;padding:12px 0}' +
    '#znf .zn-tg>hr{width:56%;border:0;height:1px;margin:0;background:linear-gradient(90deg,transparent,#99f6e4,transparent)}' +
    '#znf .zn-n{flex:0 0 60px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11.5px;font-weight:700;color:#334155;text-align:center;line-height:1.2}' +
    '#znf .zn-n img{width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid #fff;box-shadow:0 0 0 1px #e2e8f0,0 2px 6px rgba(15,23,42,.08);background:#f8fafc}' +
    '#znf .zn-pic{height:100%;display:flex;align-items:center;justify-content:center;padding:10px;background:#fcfcfd}' +
    '#znf .zn-pic img{max-width:100%;max-height:100%;object-fit:contain;border-radius:10px}' +
    '';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function build(desc) {
    var tiers = [], ti = -1;
    // titles come as <div>الإفتتاحية</div> (newer) or <p><strong>الإفتتاحية</strong></p> (older editor, 2026-11-26: those showed the old look)
    [].forEach.call(desc.querySelectorAll('div,p,strong,b,span,h1,h2,h3,h4,h5,h6,img'), function (el) {
      if (el.tagName !== 'IMG') { var tt = el.textContent.replace(/[:：]/g, '').trim(); if (el.childElementCount === 0 && TIER[tt]) { tiers.push({ t: TIER[tt], n: [] }); ti = tiers.length - 1; } return; }
      if (ti >= 0) { var sp = el.parentElement && el.parentElement.querySelector('span'); tiers[ti].n.push([el.getAttribute('src'), sp ? sp.textContent.trim() : (el.alt || '')]); }
    });
    tiers = tiers.filter(function (x) { return x.n.length; });
    // owner 2026-11-26: one centered group per tier (top / heart / base), thin lines between, no tier names
    if (tiers.length) return '<div class="zn-tg">' + tiers.map(function (x) {
      return '<div>' + x.n.map(function (n) { return '<span class="zn-n"><img src="' + esc(n[0]) + '" alt="" loading="lazy">' + esc(/\s/.test(n[1].trim()) ? n[1] : n[1].replace(/^ال(?=\S{3})/, '')) + '</span>'; }).join('') + '</div>';
    }).join('<hr>') + '</div>';
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
    f.innerHTML = '<div class="zn-h"><b>مكونات العطر</b></div><div class="zn-b' + (body.indexOf('zn-pic') > 0 ? ' zn-fix' : '') + '">' + body + '</div>';
    desc.classList.add('zn-old'); desc.insertAdjacentElement('beforebegin', f);
  }
  setInterval(run, 500); run();
})();
;
/* Zella: calmer product page (owner, 2026-11-25). CSS only, no moves of theme nodes (the theme's React keeps them).
   On /products/*, order of the details column:
     1 product info (name, price, buy buttons) -> 2 bogo.js's #zella-related «إصدارات تانية» -> 3 eta.js's line #zetl
     «التوصيل المتوقع» -> 4 notes-frame.js's #znf «مكونات البرفيوم» (or the theme description) -> 5 eta.js's rows #zeta -> 6 the rest.
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
    D + '>#zetl{order:3}' +
    D + '>#zeta{order:5}' +
    D + '>#zeta.zeta-out{order:1}' +
    DS + '{display:contents}' +
    D + ' .product_description{order:4}' +
    'html.zpdp #znf{order:4}' +
    DS + '>:not(.product_description):not(#znf){order:6;margin-top:18px}' +
    DS + '>div:has(button[id^="headlessui-disclosure"]){display:none!important}' +
    'html.zpdp #zwa-p{display:none!important}' +
    '';   // the first-screen rules (one-picture gallery, smaller gap) are in the Header layout <style> (layout-fix.css) so they apply before the first paint
  var st = document.createElement('style'); st.id = 'zpdp-css'; st.textContent = css; document.head.appendChild(st);
  function run() {
    var on = /^\/products\/[^\/]+/.test(location.pathname), h = document.documentElement;
    h.classList.toggle('zpdp', on); if (!on) return;
    // products without a description have the policy rows outside the description block (CSS above misses them):
    // hide any «سياسة …» disclosure row on the page, the delivery card #zeta already holds these facts
    [].forEach.call(document.querySelectorAll('.p_details_container button[id^="headlessui-disclosure"]'), function (b) {
      if (!/سياسة/.test(b.textContent)) return;
      var w = b.parentElement; if (w && w.style.display !== 'none') w.style.setProperty('display', 'none', 'important');
    });
    var im = document.querySelector('.p_gallery_container img');
    if (im && im.loading === 'lazy') { im.loading = 'eager'; im.setAttribute('fetchpriority', 'high'); }
  }
  setInterval(run, 300); run();
})();

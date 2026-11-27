/* Zella product page bundle (built 2026-11-26): eta.js (line, notes, rows) + notes-frame.js + pdp-layout.js + pdp-motion.js. Sources in code/. */
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
   2026-11-27 (owner, idea 3 of preview/eta-ideas.js, then only the delivery fact + idea 5 of preview/path-ideas.js): #zetl is a card
     «التوصيل المتوقع <dates>» whose path «النهارده -> أقرب يوم -> آخر موعد» is folded and opens by itself once per product page
     when the card is in view (draws itself); the header row folds / opens it (Clarity deliv_path_open); the rows are one
     card with icon tiles, an open row = icon bubble + title + text + highlighted note; WhatsApp line is the card's footer.
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
  var HAND = '<path d="M3 15h3l4 2h4a1.5 1.5 0 0 0 0-3h-3"/><path d="M6 20l-3-1v-4M14 14l4.5-2a1.5 1.5 0 0 1 1.5 2.5L14 19H9"/><rect x="9" y="3" width="10" height="6.5" rx="1.2"/><circle cx="14" cy="6.2" r="1.3"/>';
  var SHIELD = '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>';
  var CAL = '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>';
  var Q = '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17h.01"/>';
  var DOWN = ic('<path d="M6 9l6 6 6-6"/>', 18);
  var BELL = ic('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>', 22);
  function waIcon(w) { return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>'; }
  var css =
    '#zeta{margin:16px 0 4px;direction:rtl;color:#0f172a}#zeta.zeta-out{margin-top:12px}' +
    '#zetl,#zeta,#zetl *,#zeta *{font-family:Almarai,sans-serif!important;letter-spacing:0}' +
    /* top card (owner 2026-11-27, idea 3): 3 facts (tap = open its row below) + delivery path today -> first day -> last day */
    '#zetl{margin:16px 0 0;direction:rtl;display:flex;justify-content:center}#zetl .zt-w{width:100%}' +
    /* owner 2026-11-27: «التوصيل المتوقع» centered in its own rounded frame; the path comes out from under it in a narrower rounded frame */
    '#zetl .zt-h{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:12px;width:100%;padding:14px 14px 17px;border:1px solid #e2e8f0;border-radius:18px;background:linear-gradient(180deg,#f0fdfa,#fff 75%);box-shadow:0 1px 3px rgba(15,23,42,.05);cursor:pointer;color:inherit;-webkit-tap-highlight-color:transparent}' +
    '#zetl .zt-all{display:inline-block;margin-right:6px;padding:1px 8px;border-radius:999px;background:#ccfbf1;color:#0f766e;font-size:10.5px;font-weight:800;font-style:normal;line-height:1.6;vertical-align:1px}' +
    '#zetl .zt-h i svg{transform:scaleX(-1)}' +   /* owner: the truck faces left, the way it drives in RTL */
    '#zetl .zt-h:focus-visible{outline:2px solid #14b8a6;outline-offset:2px}' +
    '#zetl .zt-h i{font-style:normal;flex:0 0 44px;height:44px;border-radius:50%;background:#fff;color:#0d9488;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1.5px #99f6e4,0 2px 6px rgba(20,184,166,.12)}' +
    '#zetl .zt-h span{text-align:right}#zetl .zt-h small{display:block;font-size:12px;color:#64748b;font-weight:700;line-height:1.3}#zetl .zt-h b{display:block;font-size:17px;font-weight:800;color:#0f172a;line-height:1.35;white-space:nowrap}' +
    '#zetl .zt-h>svg{position:absolute;left:50%;bottom:-12px;width:24px;height:24px;margin-left:-12px;padding:4px;box-sizing:border-box;border-radius:50%;background:#fff;border:1px solid #e2e8f0;color:#14b8a6;transition:transform .3s}#zetl:not(.zc) .zt-h>svg{transform:rotate(180deg)}' +
    /* idea 5 (owner 2026-11-27): the path is folded, opens by itself once when the card is seen, the header row folds / opens it */
    '#zetl .zt-pw{display:grid;grid-template-rows:1fr;transition:grid-template-rows .45s cubic-bezier(.2,.8,.2,1)}#zetl .zt-pw>div{overflow:hidden;min-height:0}#zetl.zc .zt-pw{grid-template-rows:0fr}' +
    '#zetl .zt-p{transition:opacity .35s .1s,transform .35s .1s}#zetl.zc .zt-p{opacity:0;transform:translateY(-6px)}' +
    '#zetl.zd .zt-p>i{transform-origin:right;animation:zpl .45s ease-out both}#zetl.zd .zt-p>i:nth-of-type(1){animation-delay:.25s}#zetl.zd .zt-p>i:nth-of-type(2){animation-delay:.75s}' +
    '#zetl.zd .zt-p>div{animation:zpd .35s ease-out both}#zetl.zd .zt-p>div:nth-of-type(2){animation-delay:.6s}#zetl.zd .zt-p>div:nth-of-type(3){animation-delay:1.1s}' +
    /* the little truck drives along the path while it draws, from today to the last day, then the last dot glows (owner 2026-11-27) */
    '#zetl .zt-car{position:absolute;top:15px;right:36px;width:28px;height:18px;border-radius:9px;background:#fff;box-shadow:0 0 0 1.5px #14b8a6,0 3px 8px rgba(20,184,166,.25);color:#0d9488;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;z-index:1}' +
    '#zetl .zt-car svg{transform:scaleX(-1)}#zetl.zd .zt-car{animation:zpc 1.5s .2s cubic-bezier(.45,.05,.35,1) both}' +
    '@keyframes zpc{0%{right:36px;opacity:0}10%{opacity:1}85%{right:calc(100% - 64px);opacity:1}100%{right:calc(100% - 64px);opacity:0}}' +
    '#zetl.zd .zt-p>div:last-child u{animation:zpg 1.6s 1.4s ease-out 2}@keyframes zpl{from{transform:scaleX(0)}}@keyframes zpd{from{opacity:0;transform:scale(.6)}}@keyframes zpg{50%{box-shadow:0 0 0 8px rgba(20,184,166,.18)}}' +
    '#zetl .zt-pw{margin:-1px 14px 0}#zetl .zt-p{display:flex;align-items:flex-start;padding:19px 10px 11px;position:relative;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 18px 18px;background:linear-gradient(180deg,#f1f5f9,#f8fafc 40%,#fff)}' +
    '#zetl .zt-p>div{flex:0 0 76px;display:flex;flex-direction:column;align-items:center;text-align:center}#zetl .zt-p>i{flex:1;height:2px;margin-top:4px;border-radius:2px;background:linear-gradient(90deg,#14b8a6,#99f6e4)}' +
    '#zetl .zt-p u{width:10px;height:10px;border-radius:50%;background:#fff;border:2.5px solid #14b8a6}#zetl .zt-p>div:last-child u{background:#14b8a6;box-shadow:0 0 0 4px rgba(20,184,166,.15)}' +
    '#zetl .zt-p b{margin-top:4px;font-size:13px;font-weight:800;color:#0f172a;line-height:1.2;white-space:nowrap}#zetl .zt-p small{font-size:10px;color:#94a3b8;font-weight:700;line-height:1.2}#zetl .zt-p>div:last-child b{color:#0d9488}' +
    /* rows: one card, thin lines between, icon tiles; an open row shows icon bubble + title + text + highlighted note */
    '#zeta:not(.zeta-out){border:1px solid #e2e8f0;border-radius:18px;background:#fff;overflow:hidden;box-shadow:0 1px 2px rgba(15,23,42,.04)}#zeta details+details{border-top:1px solid #f1f5f9}' +
    '#zeta summary{list-style:none;display:flex;align-items:center;gap:12px;padding:12px 14px;font-size:15px;font-weight:800;color:#0f172a;cursor:pointer;-webkit-tap-highlight-color:transparent}#zeta summary::-webkit-details-marker{display:none}#zeta summary:focus-visible{outline:2px solid #14b8a6;outline-offset:-2px}' +
    '#zeta .zr-i{font-style:normal;flex:0 0 36px;height:36px;border-radius:12px;background:#f0fdfa;color:#0d9488;display:flex;align-items:center;justify-content:center}' +
    '#zeta details[data-k="0"] .zr-i svg{transform:scaleX(-1)}' +   /* owner: trucks face left */
    '#zeta summary span{flex:1}#zeta summary>svg:last-child{color:#64748b;transition:transform .25s}#zeta details[open] summary>svg:last-child{transform:rotate(180deg)}#zeta details[open]{background:#fcfffe}' +
    '#zeta .zm-b{padding:2px 14px 16px;animation:zmo .25s ease-out}@keyframes zmo{from{opacity:0;transform:translateY(-4px)}}' +
    '#zeta .zm-d{display:flex;gap:12px;align-items:flex-start}#zeta .zm-d>i{flex:0 0 42px;height:42px;border-radius:50%;background:#fff;color:#0d9488;box-shadow:inset 0 0 0 1.5px #99f6e4;display:flex;align-items:center;justify-content:center;font-style:normal}' +
    '#zeta .zm-d b{display:block;font-size:14.5px;font-weight:800;color:#0f172a;line-height:1.4}#zeta .zm-d p{margin:3px 0 7px;font-size:13.5px;line-height:1.55;color:#64748b}' +
    '#zeta .zm-n{display:inline;padding:1px 4px;font-size:13px;font-weight:800;color:#0f172a;background:linear-gradient(transparent 55%,#ccfbf1 55%)}' +
    '#zeta details.zof summary .zr-i{background:#ffedd5;color:#f97316}#zeta details.zof summary span{color:#9a3412}#zeta details.zof[open]{background:#fffaf5}#zeta details.zof .zm-b{padding:6px 10px 14px}' +
    '#zeta .zy{display:flex;align-items:flex-start;justify-content:space-between;padding:2px 0}#zeta .zy>div{flex:0 0 72px;display:flex;flex-direction:column;align-items:center;text-align:center}' +
    '#zeta .zy>i{flex:1;margin-top:24px;height:2px;background:#99f6e4;display:flex;align-items:center;justify-content:center}#zeta .zy>i.o{background:none;border-top:2px dashed #fdba74;height:0}' +
    '#zeta .zy>i u{text-decoration:none;margin-top:-1px;padding:2px 9px;border-radius:999px;background:#fff;border:1.5px solid #fdba74;color:#c2410c;font-size:12px;font-weight:800;font-style:normal;line-height:1.3}' +
    '#zeta .zy span{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;color:#0d9488;border:1.5px solid #99f6e4}#zeta .zy .h span{background:#f0fdfa}#zeta .zy .g span{background:#f97316;color:#fff;border-color:#f97316;box-shadow:0 4px 12px rgba(249,115,22,.25)}' +
    '#zeta .zy b{margin-top:8px;font-size:13px;font-weight:700;color:#334155}#zeta .zy small{font-size:14px;font-weight:800;color:#0f172a;margin-top:1px}#zeta .zy .h small{color:#0d9488}#zeta .zy .g small{color:#c2410c}' +
    '#zeta .zy em{font-style:normal;font-size:11.5px;font-weight:600;color:#94a3b8;margin-top:1px;white-space:nowrap}' +
    '#zeta .zm-ask{display:flex;align-items:center;gap:12px;padding:12px 14px;border-top:1px solid #f1f5f9;background:#f0fdf4;text-decoration:none;font-size:14px;color:#475569;font-weight:700}#zeta .zm-ask span{flex:1}' +
    '#zeta .zm-ask .zr-i{background:#fff;color:#16a34a}#zeta .zm-ask b{display:inline-flex;align-items:center;gap:5px;color:#15803d;font-weight:800}#zeta .zm-ask b svg{color:#22c55e}' +
    '#zeta.zeta-out{border:1px solid #fed7aa;border-radius:16px;background:#fff7ed;overflow:hidden;margin-top:12px}#zeta .ze-o{display:flex;align-items:center;gap:12px;padding:12px 14px;text-decoration:none;color:inherit}' +
    '#zeta .ze-i{flex:0 0 auto;width:42px;height:42px;border-radius:12px;background:#ffedd5;color:#c2410c;display:flex;align-items:center;justify-content:center}#zeta .ze-o small{display:block;font-size:12.5px;color:#64748b;font-weight:600}#zeta .ze-o b{display:block;font-size:16px;font-weight:800;color:#c2410c;margin-top:1px}' +
    '#zeta .ze-o{padding-bottom:4px}#zeta .ze-f,#zeta .ze-ok{margin:0;padding:0 14px 14px}#zeta .ze-t{margin:2px 0 10px;font-size:14px;line-height:1.6;color:#7c2d12;font-weight:600}' +
    '#zeta .ze-r{display:flex;gap:8px}#zeta .ze-r input[type=tel]{flex:1;min-width:0;height:48px;border:1.5px solid #fdba74;border-radius:12px;background:#fff;padding:0 12px;font-size:16px;direction:ltr;text-align:right;color:#0f172a;outline:none}' +
    '#zeta .ze-r input[type=tel]:focus{border-color:#f97316;box-shadow:0 0 0 3px rgba(249,115,22,.15)}#zeta .ze-hp{position:absolute;width:1px;height:1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);opacity:0;pointer-events:none}#zeta .ze-f{position:relative}' +
    '#zeta .ze-r button{flex:0 0 auto;height:48px;padding:0 20px;border:0;border-radius:12px;background:#f97316;color:#fff;font-size:16px;font-weight:800;cursor:pointer}#zeta .ze-r button:disabled{opacity:.7}' +
    '#zeta .ze-e{margin:8px 0 0;font-size:13px;color:#b91c1c;font-weight:600}#zeta .ze-ok{padding-top:6px;font-size:14.5px;line-height:1.6;color:#15803d;font-weight:700}' +
    '@media (max-width:350px){#zetl .zt-p>div{flex-basis:66px}#zetl .zt-h b{font-size:15px}#zetl .zt-h{gap:10px;padding-left:10px;padding-right:10px}}' +
    '@media (prefers-reduced-motion:reduce){#zeta .zm-b{animation:none}#zeta summary>svg:last-child,#zetl *{transition:none!important;animation:none!important}}';

  function cairoNow() { var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addWork(d, n) { var x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 5) n--; } return x; }   // Friday off
  function range() {   // {a, b, s: «28 – 30 نوفمبر»}
    var t = cairoNow(), a = addWork(t, 1), b = addWork(t, 3);
    return { a: a, b: b, s: a.getDate() + (a.getMonth() !== b.getMonth() ? ' ' + MON[a.getMonth()] : '') + ' – ' + b.getDate() + ' ' + MON[b.getMonth()] };
  }
  function waLink(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }
  function here() { return location.origin + location.pathname; }
  function askLink(name) { return waLink('أهلاً Zella Store، عندي سؤال عن ' + name + '\n' + here()); }
  // open row body: icon bubble + title + text + highlighted note
  function one(icon, t, s, note) { return '<div class="zm-d"><i>' + ic(icon, 20) + '</i><div><b>' + t + '</b><p>' + s + '</p>' + (note ? '<span class="zm-n">' + note + '</span>' : '') + '</div></div>'; }
  function row(k, icon, title, body) { return '<details data-k="' + k + '"><summary><i class="zr-i">' + ic(icon, 21) + '</i><span>' + title + '</span>' + DOWN + '</summary><div class="zm-b">' + body + '</div></details>'; }
  function offer() {   // one line, two offers (owner 2026-11-26): 1st at its price -> 2nd 50% (buying 2) «أو» 3rd free (buying 3)
    return '<div class="zy"><div><span>' + ic(DROP, 22) + '</span><b>الأولى</b><small>بسعرها</small></div><i></i>' +
      '<div class="h"><span>' + ic(DROP, 22) + '</span><b>التانية</b><small>خصم 50%</small><em>عند شراء قطعتين</em></div><i class="o"><u>أو</u></i>' +
      '<div class="g"><span>' + ic(GIFT, 22) + '</span><b>التالتة</b><small>مجاناً</small><em>عند شراء 3 قطع</em></div></div>';
  }
  function inHTML(name, date, bogo) {
    return row(0, TRUCK, 'الشحن والتوصيل', one(CAL, 'التوصيل خلال 3 أيام عمل كحد أقصى', 'يتواصل معك المندوب قبل الوصول.', 'التوصيل المتوقع: ' + date.s)) +
      row(1, HAND, 'الدفع عند الاستلام', one(HAND, 'الدفع نقداً عند الاستلام', 'بدون أي دفع إلكتروني مسبق.', 'يمكنك معاينة المنتج قبل الدفع')) +
      row(2, SWAP, 'الاستبدال والاسترجاع', one(SHIELD, 'متاح خلال 48 ساعة من الاستلام', 'في حال وجود أي مشكلة بالمنتج.', 'مع إمكانية معاينة الطلب قبل الدفع')) +
      (bogo ? row(3, GIFT, 'العرض الحالي 🎁', offer()).replace('<details ', '<details class="zof" ') : '') +
      '<a class="zm-ask" href="' + askLink(name) + '" target="_blank" rel="noopener"><i class="zr-i">' + ic(Q, 19) + '</i><span>لديك استفسار؟</span><b>' + waIcon(15) + 'تواصل معنا عبر واتساب</b></a>';
  }
  function lineHTML(d) {   // owner 2026-11-27: only «التوصيل المتوقع» (like his Estimated Delivery example) + the folding path (idea 5)
    return '<div class="zt-w"><button type="button" class="zt-h" aria-expanded="false"><i>' + ic(TRUCK, 22) + '</i><span><small>التوصيل المتوقع<em class="zt-all">لكل المحافظات</em></small><b>' + DAYS[d.a.getDay()] + ' ' + d.a.getDate() + ' – ' + DAYS[d.b.getDay()] + ' ' + d.b.getDate() + ' ' + MON[d.b.getMonth()] + '</b></span>' + DOWN + '</button>' +
      '<div class="zt-pw"><div><div class="zt-p"><em class="zt-car">' + ic(TRUCK, 15) + '</em><div><u></u><b>النهارده</b><small>تأكيد الطلب</small></div><i></i>' +
      '<div><u></u><b>' + DAYS[d.a.getDay()] + ' ' + d.a.getDate() + '</b><small>أقرب يوم</small></div><i></i>' +
      '<div><u></u><b>' + DAYS[d.b.getDay()] + ' ' + d.b.getDate() + '</b><small>آخر موعد</small></div></div></div></div></div>';
  }
  function pathOpen(ln, open) {
    ln.classList.toggle('zc', !open); var h = ln.querySelector('.zt-h'); if (h) h.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { ln.classList.remove('zd'); void ln.offsetWidth; ln.classList.add('zd'); }
  }
  function pathAuto(ln) {   // once per product page: opens by itself when the card is well in view
    if (ln.dataset.p === location.pathname) return; ln.dataset.p = location.pathname; pathOpen(ln, false);
    if (ln.__io) ln.__io.disconnect();
    if (!('IntersectionObserver' in window)) { pathOpen(ln, true); return; }
    ln.__io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting || es[0].intersectionRatio < .6) return;
      ln.__io.disconnect(); setTimeout(function () { if (ln.dataset.p === location.pathname) pathOpen(ln, true); }, 350);
    }, { threshold: [0, .6, 1] });
    ln.__io.observe(ln);
  }
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
    var key = location.pathname + '|' + state + '|' + name + '|' + date.s + '|' + bogo;
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
      if (!ln) {
        ln = document.createElement('div'); ln.id = 'zetl';
        ln.addEventListener('click', function (e) {   // the header row folds / opens the path
          if (!e.target.closest('.zt-h')) return;
          if (ln.__io) ln.__io.disconnect();
          var open = ln.classList.contains('zc'); pathOpen(ln, open);
          if (open) try { window.clarity && window.clarity('event', 'deliv_path_open'); } catch (x) { }
        });
      }
      if (ln.dataset.k !== date.s) { ln.innerHTML = lineHTML(date); ln.dataset.k = date.s; }   // (innerHTML of SVG never equals the source string)
      pathAuto(ln);
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
;
/* Zella: motion on the product page (owner 2026-11-27, from preview/anim-prev.js):
   - notes frame #znf: the first time it is well in view, top notes come in, then heart, then base (lines between draw);
   - offer row #zeta details.zof: each time it opens, الأولى -> line -> التانية -> «أو» -> التالتة appear in turn, the gift shakes.
   2026-11-27 (owner: all of preview/anim2-prev.js except «اتضافت ✓»):
   - price: the old price is struck by a line that draws itself, the new price (#sale-price) glows once, the % pill pops;
   - row icons move when a row opens (truck drives, cash flips, arrows turn, gift shakes);
   - sold out: the bell rings when the «بلّغني لما يرجع» card is seen and again when the «تمام» line appears;
   - «بدائل متاحة» (#zalt): the 3 cards come in one after another when the box is seen.
   Off under prefers-reduced-motion. */
(function () {
  if (window.__zellaMotion) return; window.__zellaMotion = 1;
  var css =
    '#znf.za .zn-tg .zn-n{opacity:0;transform:translateY(10px) scale(.8)}#znf.za .zn-tg>hr{transform:scaleX(0)}' +
    '#znf.za.zgo .zn-tg .zn-n{animation:zan .5s cubic-bezier(.2,.8,.2,1.2) var(--d) both}#znf.za.zgo .zn-tg>hr{animation:zah .5s ease-out var(--d) both}' +
    '#znf.za.zdone .zn-tg .zn-n,#znf.za.zdone .zn-tg>hr{opacity:1!important;transform:none!important}' +   /* safety: shown even if the animation never ran */
    '@keyframes zan{from{opacity:0;transform:translateY(10px) scale(.8)}to{opacity:1;transform:none}}@keyframes zah{from{transform:scaleX(0)}to{transform:scaleX(1)}}' +
    '#znf.za.zgo .zn-tg .zn-n img{animation:zag 1s ease-out calc(var(--d) + .3s) both}@keyframes zag{0%{box-shadow:0 0 0 0 rgba(20,184,166,.35),0 0 0 1px #e2e8f0}100%{box-shadow:0 0 0 10px rgba(20,184,166,0),0 0 0 1px #e2e8f0}}' +
    '#zeta .zy.zgo>div{animation:zan .45s cubic-bezier(.2,.8,.2,1.2) both}#zeta .zy.zgo>div:nth-of-type(2){animation-delay:.5s}#zeta .zy.zgo>div:nth-of-type(3){animation-delay:1.05s}' +
    '#zeta .zy.zgo>i{transform-origin:right;animation:zah .4s ease-out both}#zeta .zy.zgo>i:nth-of-type(1){animation-delay:.2s}#zeta .zy.zgo>i:nth-of-type(2){animation-delay:.75s}' +
    '#zeta .zy.zgo>i u{display:inline-block;animation:zan .35s ease-out .85s both}' +
    '#zeta .zy.zgo .g span{animation:zan .45s cubic-bezier(.2,.8,.2,1.2) 1.05s both,zas .6s ease-in-out 1.6s 2}@keyframes zas{0%,100%{transform:rotate(0)}20%{transform:rotate(-12deg)}40%{transform:rotate(10deg)}60%{transform:rotate(-6deg)}80%{transform:rotate(4deg)}}' +
    '@media (prefers-reduced-motion:reduce){#znf.za .zn-tg .zn-n,#znf.za .zn-tg>hr{opacity:1!important;transform:none!important;animation:none!important}#zeta .zy.zgo *,#zeta .zy.zgo>*{animation:none!important}}';
  var st = document.createElement('style'); st.id = 'zanim-css'; st.textContent = css; document.head.appendChild(st);
  function notes() {
    var f = document.getElementById('znf'); if (!f || f.__za || !f.querySelector('.zn-tg')) return;
    f.__za = 1; f.classList.add('za');
    var d = 0;
    [].forEach.call(f.querySelector('.zn-tg').children, function (el) {
      if (el.tagName === 'HR') { el.style.setProperty('--d', d + 's'); d += .25; return; }
      [].forEach.call(el.querySelectorAll('.zn-n'), function (n, i) { n.style.setProperty('--d', (d + i * .08).toFixed(2) + 's'); });
      d += .35 + el.querySelectorAll('.zn-n').length * .08;
    });
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting && es[0].intersectionRatio > .35) { io.disconnect(); f.classList.add('zgo'); setTimeout(function () { f.classList.add('zdone'); }, (d + 1.6) * 1000); } }, { threshold: [0, .35, .7] });
    io.observe(f);
  }
  document.addEventListener('toggle', function (e) {
    var d = e.target; if (!d.matches || !d.matches('#zeta details.zof') || !d.open) return;
    var y = d.querySelector('.zy'); if (!y) return; y.classList.remove('zgo'); void y.offsetWidth; y.classList.add('zgo');
  }, true);
  setInterval(notes, 400); notes();
})();

/* part 2 (2026-11-27) */
(function () {
  if (window.__zellaMotion2) return; window.__zellaMotion2 = 1;
  var css =
    '#zeta details[open] .zr-i svg{animation:var(--za) .8s ease-out both}' +
    '#zeta details[data-k="0"]{--za:zai0}#zeta details[data-k="1"]{--za:zai1}#zeta details[data-k="2"]{--za:zai2}#zeta details[data-k="3"]{--za:zai3}' +
    '@keyframes zai0{0%{transform:scaleX(-1)}40%{transform:scaleX(-1) translateX(7px)}41%{transform:scaleX(-1) translateX(-9px);opacity:0}60%{opacity:1}100%{transform:scaleX(-1)}}' +
    '@keyframes zai1{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}@keyframes zai2{from{transform:rotate(0)}to{transform:rotate(180deg)}}' +
    '@keyframes zai3{0%,100%{transform:rotate(0)}20%{transform:rotate(-14deg)}40%{transform:rotate(11deg)}60%{transform:rotate(-6deg)}80%{transform:rotate(3deg)}}' +
    '#zeta .ze-i.zring svg{transform-origin:50% 10%;animation:zring 1s ease-in-out 2}@keyframes zring{0%,100%{transform:rotate(0)}15%{transform:rotate(18deg)}30%{transform:rotate(-16deg)}45%{transform:rotate(11deg)}60%{transform:rotate(-7deg)}75%{transform:rotate(3deg)}}' +
    '#zalt.zdone a{opacity:1!important;transform:none!important}' +
    '#zalt.zaw a{opacity:0;transform:translateY(14px)}#zalt.zaw.zgo a{animation:zan2 .5s cubic-bezier(.2,.8,.2,1) both}#zalt.zaw.zgo a:nth-child(2){animation-delay:.15s}#zalt.zaw.zgo a:nth-child(3){animation-delay:.3s}@keyframes zan2{to{opacity:1;transform:none}}' +
    '.zas-o{text-decoration:none!important;position:relative;display:inline-block}.zas-o::after{content:"";position:absolute;right:-2px;left:-2px;top:52%;height:1.5px;background:currentColor;transform-origin:right;transform:scaleX(0)}.zas-o.zgo::after{animation:zah2 .5s ease-out .2s both}@keyframes zah2{to{transform:scaleX(1)}}' +
    '.zas-n.zgo{animation:zpn 1.2s ease-out .6s both}@keyframes zpn{0%,100%{text-shadow:none}40%{text-shadow:0 0 12px rgba(20,184,166,.55)}}' +
    '.zas-c.zgo{animation:zan3 .45s cubic-bezier(.3,1.6,.5,1) .75s both}@keyframes zan3{from{opacity:0;transform:scale(.5)}}' +
    '@media (prefers-reduced-motion:reduce){#zeta .zr-i svg,#zeta .ze-i svg,#zalt a,.zas-o::after,.zas-n,.zas-c{animation:none!important}#zalt.zaw a{opacity:1;transform:none}.zas-o::after{transform:scaleX(1)}}';
  var st = document.createElement('style'); st.id = 'zmotion2-css'; st.textContent = css; document.head.appendChild(st);
  var wait = [];   // checked on every tick (no IntersectionObserver: it never fires in a hidden tab, and #zalt would stay invisible)
  function once(el, fn, r) { wait.push([el, fn, r]); }
  function seen(el, r) { var b = el.getBoundingClientRect(), h = innerHeight || 800, v = Math.min(b.bottom, h) - Math.max(b.top, 0); return b.height > 0 && v >= b.height * r - 1; }
  document.addEventListener('toggle', function (e) {   // replay the row icon each time a row opens
    var d = e.target; if (!d.matches || !d.matches('#zeta details') || !d.open) return;
    var s = d.querySelector('.zr-i svg'); if (s) { s.style.animation = 'none'; void s.offsetWidth; s.style.animation = ''; }
  }, true);
  function tick() {
    wait = wait.filter(function (w) { if (!document.body.contains(w[0])) return false; if (seen(w[0], w[2])) { w[1](); return false; } return true; });
    if (!/^\/products\//.test(location.pathname)) return;
    var bi = document.querySelector('#zeta.zeta-out .ze-i');
    if (bi && !bi.__z) { bi.__z = 1; once(bi, function () { bi.classList.add('zring'); setTimeout(function () { bi.classList.remove('zring'); }, 2100); }, .9); }
    var ok = document.querySelector('#zeta .ze-ok');
    if (ok && !ok.__z && bi) { ok.__z = 1; bi.classList.remove('zring'); void bi.offsetWidth; bi.classList.add('zring'); setTimeout(function () { bi.classList.remove('zring'); }, 2100); }
    var za = document.getElementById('zalt');
    if (za && !za.__z && za.querySelector('a')) { za.__z = 1; za.classList.add('zaw'); once(za, function () { za.classList.add('zgo'); setTimeout(function () { za.classList.add('zdone'); }, 1400); }, .4); }
    var det = document.querySelector('.p_details_container'); if (!det) return;
    var o = [].filter.call(det.querySelectorAll('p,span,del,s'), function (x) {
      return x.childElementCount === 0 && /\d/.test(x.textContent) && !x.closest('#zella-related,#zalt,#zeta,#znf,.home_grid_section_card') && /line-through/.test(getComputedStyle(x).textDecorationLine + ' ' + x.className);
    })[0];
    if (o && !o.classList.contains('zas-o')) {
      o.classList.add('zas-o');
      var n = det.querySelector('#sale-price'), pc = [].filter.call(det.querySelectorAll('p'), function (x) { return /^\s*\d+%-?\s*$/.test(x.textContent) && !x.closest('#zella-related'); })[0];
      if (n) n.classList.remove('zgo'), n.classList.add('zas-n'); if (pc) pc.classList.remove('zgo'), pc.classList.add('zas-c');
      once(o, function () { o.classList.add('zgo'); if (n) n.classList.add('zgo'); if (pc) pc.classList.add('zgo'); }, .9);
    }
  }
  setInterval(tick, 250); addEventListener('scroll', tick, { passive: true }); tick();
})();

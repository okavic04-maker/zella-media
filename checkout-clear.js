/* Zella — clearer, shorter checkout (2026-11-21). Only on /checkout and /thanks.
   1) The theme summary above "إتمام الطلب" (items, products, shipping, total) opens by itself once, so the jump from the
      product price is never a surprise.
   2) Shorter page: the free-shipping bar is hidden on checkout (the side cart still shows it); the big
      coupon ("إضافة خصم" / coupon input) is hidden (owner's call, 2026-11-21).
   3) "اختر وسيلة الدفع" (a title that looked like a button, dead clicks in Clarity) becomes a plain
      "طريقة الدفع" title + "مختارة تلقائياً ✓" under cash on delivery.
   4) Phone help while typing (bogo.js already converts Arabic digits and shows "✓ رقم صحيح"): spaces/+20 removed, a hint until the number
      is an Egyptian mobile (01x + 8 digits), then a green ✓. It never blocks the order button.
   5) Trust: adds "التوصيل خلال 2–3 أيام عمل" to the two lines checkout-bundles.js shows under "إتمام الطلب".
   6) First time the customer presses Back on checkout: a small sheet "عندك سؤال قبل ما تطلب؟" with a WhatsApp link
      and "كمّل طلبك". Shown once per visit, no timer, no pressure.
   8) Autofill: id + aria-label on name/phone/governorate/address (autocomplete tokens were already right).
   9) Every page: the free-shipping line number is rounded up ("250.00" -> "250").
   7) Thanks page: one line asking to keep the phone available for the confirmation call. */
(function () {
  if (window.__zellaCheckoutClear) return;
  window.__zellaCheckoutClear = 1;
  var PHONE = '6285659440745'; // same WhatsApp number as wa-help.js

  var css = document.createElement('style');
  css.textContent =
    '.zck-hide{display:none!important}' +
    '.zck-mbar.zck-mbar-hide{display:none!important}' +
    '@media(max-width:767px){' +
    '.zck-mbar>div{padding:10px 12px!important}' +
    '.zck-mbar .flex-1{gap:10px!important;align-items:center;min-width:0}' +
    '.zck-mbar .h-16.w-16{display:block!important;width:48px!important;height:48px!important;flex:none;border-radius:10px}' +
    '.zck-mbar img.h-16{display:block!important;width:48px!important;height:48px!important}' +
    '.zck-mbar p.font-bold{display:-webkit-box!important;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;white-space:normal;font-size:13px!important;line-height:1.25;max-width:none!important;direction:ltr;text-align:right;unicode-bidi:plaintext}' +
    '.zck-mbar .text-xl{font-size:16px!important}' +
    '.zck-mbar button{padding:11px 14px!important;font-size:14px!important;flex:none}' +
    '.zck-mbar .flex-col{min-width:0;flex:1}}' +
    '.zck-lbl{display:block;margin:0 4px 6px;font-size:14px;font-weight:400;color:#4b5563;text-align:right;direction:rtl}' +
    'body.zck-typing .checkout_button{position:static!important}' +
    '.zck-paytitle{background:transparent!important;padding:0!important;cursor:default!important;pointer-events:none}' +
    '.zck-paytitle svg{display:none}.zck-paytitle h3{font-size:18px!important}' +
    '#zck-pick{display:block;margin-top:4px;color:#0f766e;font-size:13px;font-weight:700}' +
    '.zck-coupon{border:0!important;background:none!important;box-shadow:none!important;padding:2px 0!important;' +
    'font-size:13px!important;color:#6b7280!important;text-decoration:underline!important;min-height:0!important}' +
    '.zck-coupon svg{display:none}' +
    '#zck-ph{display:block;margin:6px 4px 0;font-size:13px;color:#b45309}' +
    '#zck-ph.ok{color:#15803d}' +
    '#zck-back{position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.45);display:flex;align-items:flex-end}' +
    '#zck-back>div{width:100%;background:#fff;border-radius:18px 18px 0 0;padding:20px 18px 24px;direction:rtl;text-align:center}' +
    '#zck-back h4{font-size:18px;font-weight:800;margin:0 0 6px;color:#0f172a}' +
    '#zck-back p{font-size:14px;color:#475569;margin:0 0 14px}' +
    '#zck-back a,#zck-back button{display:block;width:100%;padding:13px;border-radius:12px;font-size:15px;font-weight:800;margin-top:8px}' +
    '#zck-back a{background:#16a34a;color:#fff;text-decoration:none}' +
    '#zck-back button{background:#f97316;color:#fff;border:0}' +
    '#zck-back .zck-leave{background:none;color:#64748b;font-weight:500;font-size:13px}' +
    '#zck-thx{margin:10px auto;max-width:460px;padding:10px 12px;border-radius:12px;background:#fff7ed;' +
    'border:1px solid #fed7aa;color:#9a3412;font-size:14px;line-height:1.6;text-align:center;direction:rtl}';
  document.head.appendChild(css);

  function leaf(re) {
    return [].find.call(document.querySelectorAll('h2,h3,p,span,div,button'), function (e) {
      return e.childElementCount === 0 && re.test(e.textContent.trim());
    });
  }
  function num(sel) {
    var el = document.querySelector(sel);
    if (!el) return null;
    var n = parseFloat((el.firstChild && el.firstChild.nodeValue || el.textContent).replace(/[^\d.]/g, ''));
    return isNaN(n) ? null : n;
  }
  function shipping() {
    var dts = document.querySelectorAll('dt');
    for (var i = 0; i < dts.length; i++) {
      if (dts[i].textContent.trim() !== 'تكلفة الشحن') continue;
      var dd = dts[i].nextElementSibling;
      if (!dd) continue;
      if (/مجان/.test(dd.textContent)) return 0;
      var n = parseFloat(dd.textContent.replace(/[^\d.]/g, ''));
      if (!isNaN(n)) return n;
    }
    return null;
  }

  // ---------- phone ----------
  var AR = '٠١٢٣٤٥٦٧٨٩', FA = '۰۱۲۳۴۵۶۷۸۹';
  function cleanPhone(v) {
    v = v.replace(/[٠-٩۰-۹]/g, function (d) { var i = AR.indexOf(d); return String(i < 0 ? FA.indexOf(d) : i); });
    v = v.replace(/[^\d+]/g, '');
    if (/^\+?20(1\d{9})$/.test(v)) v = '0' + v.replace(/^\+?20/, '');
    return v;
  }
  function setNative(inp, v) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, v);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function phoneHint(inp) {
    var v = inp.value, hint = document.getElementById('zck-ph');
    if (!hint) { hint = document.createElement('small'); hint.id = 'zck-ph'; inp.parentElement.insertAdjacentElement('afterend', hint); }
    if (!v) { hint.textContent = ''; hint.className = ''; return; }
    if (/^01[0125]\d{8}$/.test(v)) { hint.textContent = ''; hint.className = ''; } // bogo.js already shows "✓ رقم صحيح"
    else if (!/^0/.test(v)) { hint.textContent = 'الرقم لازم يبدأ بـ 01'; hint.className = ''; }
    else if (v.length < 11) { hint.textContent = 'فاضل ' + (11 - v.length) + ' أرقام'; hint.className = ''; }
    else { hint.textContent = 'الرقم المصري 11 رقم بيبدأ بـ 010 أو 011 أو 012 أو 015'; hint.className = ''; }
  }
  function bindPhone() {
    var inp = document.querySelector('input[name="phone"]');
    if (!inp || inp.dataset.zck) return;
    inp.dataset.zck = '1';
    inp.setAttribute('inputmode', 'numeric');
    inp.addEventListener('input', function () {
      var c = cleanPhone(inp.value);
      if (c !== inp.value) setNative(inp, c);
      phoneHint(inp);
    });
    inp.addEventListener('blur', function () { phoneHint(inp); });
  }

  // ---------- back button sheet ----------
  var trapped = false, shown = false;
  function seen() { try { return sessionStorage.getItem('zck-back') === '1'; } catch (e) { return shown; } }
  function trapBack() {
    if (trapped || seen()) return;
    trapped = true;
    history.pushState({ zck: 1 }, '', location.href);
    window.addEventListener('popstate', function onPop() {
      window.removeEventListener('popstate', onPop);
      if (!/^\/checkout/.test(location.pathname) || seen()) return;
      shown = true;
      try { sessionStorage.setItem('zck-back', '1'); } catch (e) {}
      history.pushState({ zck: 1 }, '', location.href); // stay on checkout while the sheet is open
      var s = document.createElement('div');
      s.id = 'zck-back';
      s.innerHTML = '<div><h4>عندك سؤال قبل ما تطلب؟</h4>' +
        '<p>كلمنا واتساب وهنرد عليك، أو نعملّك الطلب بنفسنا 💬</p>' +
        '<a target="_blank" rel="noopener" href="https://wa.me/' + PHONE + '?text=' +
        encodeURIComponent('السلام عليكم، عندي سؤال قبل ما أطلب') + '">كلمنا واتساب</a>' +
        '<button type="button" class="zck-stay">كمّل طلبك</button>' +
        '<button type="button" class="zck-leave">لا شكراً، ارجع</button></div>';
      document.body.appendChild(s);
      s.addEventListener('click', function (e) {
        if (e.target === s || e.target.closest('.zck-stay')) s.remove();
        else if (e.target.closest('.zck-leave')) { s.remove(); history.go(-2); }
      });
    });
  }

  function checkout() {
    // 1) total: open the theme's own summary above the order button once (items, products, shipping, total),
    //    instead of our own box (owner, 2026-11-21). If the customer closes it, it stays closed.
    var tg = document.querySelector('button.checkout_mobile_total_toggle');
    if (tg && !tg.dataset.zck && tg.offsetParent) {
      tg.dataset.zck = '1';
      if (tg.getAttribute('aria-expanded') === 'false') tg.click();
    }

    // 2) shorter page: free-shipping bar off, coupon as a small link
    [].forEach.call(document.querySelectorAll('span'), function (sp) {
      if (sp.childElementCount > 2 || !/الشحن المجاني/.test(sp.textContent)) return;
      var w = sp.parentElement && sp.parentElement.parentElement;
      if (w && w.querySelector('[style*="width"]') && !w.classList.contains('zck-hide')) w.classList.add('zck-hide');
    });
    // coupon: owner wants it gone (button on mobile, input field on desktop)
    [].forEach.call(document.querySelectorAll('button'), function (b) {
      if (b.textContent.trim() === 'إضافة خصم' && !b.classList.contains('zck-hide')) b.classList.add('zck-hide');
    });
    [].forEach.call(document.querySelectorAll('input[name$="coupon-input"]'), function (i) {
      var f = i.closest('form') || i.parentElement.parentElement;
      if (f && !f.classList.contains('zck-hide') && !f.querySelector('input[name="phone"]')) f.classList.add('zck-hide');
    });

    // 3) payment title
    [].forEach.call(document.querySelectorAll('h3'), function (h) {
      if (h.textContent.replace(/\s+/g, ' ').trim() !== 'اختر وسيلة الدفع') return;
      h.parentElement.classList.add('zck-paytitle');
      var spans = h.querySelectorAll('span');
      if (spans.length === 2) spans[0].textContent = 'طريقة';
    });
    var cod = leaf(/^ادفع عند استلام طلبك$/);
    if (cod && !document.getElementById('zck-pick')) {
      var pk = document.createElement('span'); pk.id = 'zck-pick'; pk.textContent = 'مختارة تلقائياً ✓';
      cod.parentNode.appendChild(pk);
    }
    // only one way to pay (cash on delivery): hide the whole payment block, like rifq-essentials (owner, 2026-11-21).
    // If a second payment method is ever added, the block shows again by itself.
    var pc = document.querySelector('.payments_container');
    if (pc && pc.parentElement) {
      var one = pc.children.length === 1 && cod;
      pc.parentElement.classList.toggle('zck-hide', !!one);
    }

    // 3b) a label above each field (the placeholder disappears once the customer types)
    [['full_name', 'اسمك بالكامل', 'shipping-name', 'برجاء كتابة اسمك بالكامل..'], ['phone', 'رقم الموبايل', 'shipping-tel', 'برجاء كتابة رقم موبايلك'],
      ['government', 'المحافظة', 'shipping-region', ''], ['address', 'العنوان بالتفصيل', 'shipping-address', 'اكتب عنوانك بالتفصيل']]
      .forEach(function (f) {
        var el = document.querySelector('[name="' + f[0] + '"]');
        if (!el) return;
        if (!el.id) el.id = f[2];
        if (f[3] && el.getAttribute('placeholder') !== f[3]) el.setAttribute('placeholder', f[3]);
        var box = el.closest('div.relative') || el.parentElement;
        if (box.previousElementSibling && box.previousElementSibling.classList.contains('zck-lbl')) return;
        var lb = document.createElement('label');
        lb.className = 'zck-lbl';
        if (el.id) lb.htmlFor = el.id;
        lb.textContent = f[1];
        box.parentNode.insertBefore(lb, box);
      });

    // 4) phone
    bindPhone();

    // 5) trust lines under the order button: checkout-bundles.js already writes .zc-trust (cash on delivery +
    //    exchange); add the delivery time as a third line in the same style.
    var zt = document.querySelector('.checkout_button .zc-trust');
    if (zt && !zt.querySelector('.zck-del')) {
      var dl = document.createElement('span'); dl.className = 'zck-del'; dl.textContent = '🚚 التوصيل خلال 2–3 أيام عمل';
      zt.appendChild(dl);
    }

    // 6) back button sheet
    trapBack();

    // 8) autofill hints: the theme fields already have the right autocomplete tokens; give them an id and a
    //    label name too, so phone/browser autofill recognises them more reliably. Nothing visible changes.
    [['full_name', 'shipping-name', 'الاسم بالكامل'], ['phone', 'shipping-tel', 'رقم الموبايل'],
      ['government', 'shipping-region', 'المحافظة'], ['address', 'shipping-address', 'العنوان بالتفصيل']]
      .forEach(function (f) {
        var el = document.querySelector('[name="' + f[0] + '"]');
        if (!el || el.dataset.zckAf) return;
        el.dataset.zckAf = '1';
        if (!el.id) el.id = f[1];
        if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', f[2]);
      });

    // 7) keyboard: while a field is focused the sticky order bar (≈124px) covered the field being typed on small
    //    phones (tested 360px wide with ~350px left above the keyboard). Unstick it while typing and keep the field
    //    in view; it sticks again when the keyboard closes.
    var form = document.querySelector('.checkout_form');
    if (form && !form.dataset.zck) {
      form.dataset.zck = '1';
      form.addEventListener('focusin', function (e) {
        if (!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
        document.body.classList.add('zck-typing');
        setTimeout(function () { try { e.target.scrollIntoView({ block: 'center' }); } catch (er) {} }, 300);
      });
      form.addEventListener('focusout', function () {
        setTimeout(function () {
          var a = document.activeElement;
          if (!a || !form.contains(a) || !/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) document.body.classList.remove('zck-typing');
        }, 150);
      });
    }
  }

  function thanks() {
    if (document.getElementById('zck-thx')) return;
    var el = [].find.call(document.querySelectorAll('p'), function (x) { return /خدمة العملاء سوف تتواصل/.test(x.innerText); });
    if (!el) return;
    var d = document.createElement('div'); d.id = 'zck-thx';
    d.textContent = 'خلّي موبايلك متاح عشان هنكلمك نأكد الطلب 📞';
    el.insertAdjacentElement('afterend', d);
  }

  // every page: "أنت على بُعد 250.00 ج.م ..." -> "250" (the theme prints decimals; React keeps the number in its own text node)
  function roundShip() {
    [].forEach.call(document.querySelectorAll('span'), function (sp) {
      if (sp.childElementCount > 2 || !/الشحن المجاني/.test(sp.textContent)) return;
      [].forEach.call(sp.childNodes, function (tn) {
        if (tn.nodeType !== 3) return;
        var v = tn.nodeValue.replace(/(\d[\d,]*)\.\d+/g, function (m, a) { return String(Math.ceil(parseFloat(m.replace(/,/g, '')))); });
        if (v !== tn.nodeValue) tn.nodeValue = v;
      });
    });
  }

  // product pages: EasyOrders' own moving buy bar (section.fixed.inset-x-5 > div.bottom-0.w-full) becomes an
  // add-to-cart bar (owner, 2026-11-21): its button says "أضف للسلة" and clicks the page's own add-to-cart button
  // instead of going to checkout. Needs the Header line that hid this bar to be removed.
  function pageAdd() {
    return [].find.call(document.querySelectorAll('.mt-5.flex.flex-col button'), function (b) {
      return b.textContent.trim() === 'أضف للسلة' && b.offsetParent;
    });
  }
  var mbObs = null, mbWatched = null;
  function movingBar() {
    if (!/^\/products\//.test(location.pathname)) return;
    var bar = document.querySelector('section.fixed.inset-x-5 > div.bottom-0.w-full');
    var btn = bar && bar.querySelector('button');
    if (!btn) return;
    // show the small image + name on phones too, and only show the bar once the page's own buttons are off screen
    if (!bar.classList.contains('zck-mbar')) bar.classList.add('zck-mbar');
    // owner (2026-11-21): show it as soon as the customer scrolls past the page's own "أضف للسلة" a little
    // (after the first one or two swipes), i.e. once that button has moved up above the bar's area.
    if (!mbWatched) {
      mbWatched = true;
      var check = function () {
        var b = document.querySelector('section.fixed.inset-x-5 > div.bottom-0.w-full');
        var a = pageAdd();
        if (!b) return;
        var show = !!a && a.getBoundingClientRect().bottom < window.innerHeight - 170;
        b.classList.toggle('zck-mbar-hide', !show);
        b.classList.toggle('zck-mbar-show', show); // Header CSS keeps the bar hidden until this class is set (no flash on load)
      };
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
      mbObs = check;
    }
    if (mbObs) mbObs();
    var lab = btn.querySelector('p') || btn;
    if (lab.textContent.trim() !== 'أضف للسلة' && lab.textContent.trim() !== 'اتضاف ✓') lab.textContent = 'أضف للسلة';
    if (btn.dataset.zck) return;
    btn.dataset.zck = '1';
    btn.addEventListener('click', function (e) {
      var add = pageAdd();
      if (!add) return; // no add-to-cart on this page: let the theme do its normal buy
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      add.click();
      var l = btn.querySelector('p') || btn;
      l.textContent = 'اتضاف ✓';
      setTimeout(function () { l.textContent = 'أضف للسلة'; }, 1800);
    }, true);
  }

  // smooth navigation (2026-11-22): links our scripts add (home collection circles, brands, offer box, bundles…)
  // are plain <a> tags, so a click reloaded the whole site. Same-site plain links now go through the site's own
  // router (no reload). Links React already handles, new-tab clicks and other sites are left alone.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    if (Object.keys(a).some(function (k) { return k.indexOf('__react') === 0; })) return; // the theme's own link
    var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (er) { return; }
    if (u.origin !== location.origin || /^\/(checkout|thanks)/.test(u.pathname)) return;
    if (u.pathname === location.pathname && u.search === location.search && u.hash) return; // in-page anchor
    var rt = window.next && window.next.router;
    if (!rt || !rt.push) return;
    e.preventDefault();
    var to = u.pathname + u.search + u.hash;
    rt.push(to).then(function () { window.scrollTo(0, 0); }).catch(function () { location.href = to; });
  }, true);

  // Keyboard down when the finger scrolls (owner, 2026-11-23; same as the search dropdown): on every page, a drag of
  // more than 24px while a text field is focused closes the keyboard so the page can be seen. Not when the drag starts
  // inside that field (moving the cursor / selecting). On /checkout this also brings the sticky order button back
  // (focusout above removes body.zck-typing), so the customer sees the total and "اطلب" after filling a field.
  (function () {
    var y0 = null, inside = false;
    function textField(a) {
      return a && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT' && !/^(checkbox|radio|range|button|submit|file|color)$/i.test(a.type));
    }
    document.addEventListener('touchstart', function (e) {
      var a = document.activeElement;
      if (!textField(a) || !e.touches[0]) { y0 = null; return; }
      y0 = e.touches[0].clientY;
      inside = a.contains(e.target);
    }, { passive: true, capture: true });
    document.addEventListener('touchmove', function (e) {
      if (y0 === null || inside || !e.touches[0]) return;
      if (Math.abs(e.touches[0].clientY - y0) > 24) {
        y0 = null;
        var a = document.activeElement;
        if (textField(a)) a.blur();
      }
    }, { passive: true, capture: true });
  })();

  function run() {
    var p = location.pathname;
    roundShip();
    movingBar();
    if (/^\/checkout/.test(p)) checkout();
    else if (/^\/thanks/.test(p)) thanks();
  }
  var t;
  new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; run(); }, 120); })
    .observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  run();
})();

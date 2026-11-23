/* Zella Store: WhatsApp help links where customers get stuck (no floating button).
   Product page: a small line under the order button. Checkout: a help link under "إتمام الطلب"
   only when the form shows an error.
   Thanks page: confirm the order on WhatsApp. To change the number, edit PHONE. */
(function () {
  var PHONE = '6285659440745';
  var css = ''
    + '.zwa{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 0 4px;padding:11px 12px;border:1px solid #d1fadf;border-radius:14px;background:#f0fdf4;color:#14532d;font-size:14px;font-weight:700;text-decoration:none;line-height:1.4;text-align:center}'
    + '.zwa,.zwa *{text-decoration:none!important}'
    + '.zwa svg{width:20px;height:20px;flex:none;fill:#16a34a}'
    + '.zwa small{display:block;font-size:12px;font-weight:500;color:#3f6212}'
    + '#zwa-p{display:flex;justify-content:center;align-items:center;gap:5px;margin:8px 0 2px;padding:0;border:0;background:none;font-size:12px;font-weight:500;color:#6b7280}'
    + '#zwa-p svg{width:14px;height:14px}'
    + '#zwa-p b{color:#15803d;font-weight:700}';

  var ICON = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 5.2 5.2 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';

  function wa(text) { return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text); }
  function link(id, text, title, sub) {
    var a = document.createElement('a');
    a.className = 'zwa'; a.id = id; a.href = wa(text); a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = ICON + '<span>' + title + (sub ? '<small>' + sub + '</small>' : '') + '</span>';
    return a;
  }
  function btnWith(re) {
    return [].slice.call(document.querySelectorAll('button')).filter(function (b) { return re.test(b.innerText) && b.offsetParent; })[0];
  }

  function productPage() {
    if (document.getElementById('zwa-p')) return;
    var b = btnWith(/اطلب دلوقتي|إتمام الطلب|أضف للسلة|اضغط هنا للشراء/);
    var h1 = document.querySelector('h1.product_name');
    if (!b || !h1) return;
    var at = b.parentElement.querySelectorAll('button').length > 1 ? b.parentElement : b;
    at.insertAdjacentElement('afterend', link('zwa-p',
      'السلام عليكم، عندي سؤال عن: ' + h1.innerText.trim() + '\n' + location.origin + location.pathname,
      'عندك سؤال عن البرفيوم أو العرض؟ <b>واتساب</b>', ''));
  }

  // remember name + phone while the customer types them, for the thank-you page message (owner, 2026-11-23:
  // the order code alone told him nothing; with the phone he finds and confirms the order at once)
  function store(k, v) { try { sessionStorage.setItem(k, v); localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return sessionStorage.getItem(k) || localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function digits(v) { return String(v || '').replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/\D/g, ''); }
  document.addEventListener('input', function (e) {
    var n = e.target && e.target.name;
    if (n === 'phone') store('zwa-phone', digits(e.target.value));
    else if (n === 'full_name') store('zwa-name', e.target.value.trim().slice(0, 60));
  }, true);

  function checkoutPage() {
    // autofilled fields fire no input event: read them too
    var ph = document.querySelector('[name="phone"]'), nm = document.querySelector('[name="full_name"]');
    if (ph && digits(ph.value).length >= 10) store('zwa-phone', digits(ph.value));
    if (nm && nm.value.trim()) store('zwa-name', nm.value.trim().slice(0, 60));
    // the store shows "هذا الحقل مطلوب" in red under empty fields: only then offer to finish the order for them
    var err = [].slice.call(document.querySelectorAll('p.text-red-600, .Toastify__toast--error')).filter(function (x) { return x.offsetParent; })[0];
    var old = document.getElementById('zwa-c');
    if (err && !old) {
      var b = btnWith(/إتمام الطلب/);
      if (b) b.insertAdjacentElement('afterend', link('zwa-c',
        'السلام عليكم، مش عارف أكمّل الطلب على الموقع، ممكن تساعدني؟',
        'مش عارف تكمّل؟ ابعتلنا على الواتساب وهنعملّك الطلب 💬', ''));
    } else if (!err && old) old.remove();
  }

  function thanksPage() {
    if (document.getElementById('zwa-t')) return;
    var el = [].slice.call(document.querySelectorAll('p')).filter(function (x) { return /خدمة العملاء سوف تتواصل/.test(x.innerText); })[0];
    if (!el) return;
    var id = (location.search.match(/order_id=([\w-]+)/) || [])[1] || '';
    var phone = load('zwa-phone'), name = load('zwa-name');
    var msg = 'أهلاً Zella Store 🌸\n' +
      'لسه عامل طلب من الموقع، ياريت تأكدوه ✅\n\n' +
      (name ? 'الاسم: ' + name + '\n' : '') +
      (phone.length >= 10 ? 'رقم الموبايل: ' + phone + '\n' : (id ? 'رقم الطلب: ' + id.slice(0, 8) + '\n' : '')) +
      '\nشكراً ليكم 🙏';
    el.insertAdjacentElement('afterend', link('zwa-t', msg,
      'عايز تأكد طلبك أسرع أو تعدّل حاجة؟ كلمنا واتساب', 'ابعتلنا والطلب يتأكد على طول'));
  }

  function run() {
    var p = location.pathname;
    if (/^\/products\//.test(p)) productPage();
    else if (/^\/checkout/.test(p)) checkoutPage();
    else if (/^\/thanks/.test(p)) thanksPage();
  }

  var t;
  function start() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; run(); }, 150); }).observe(document.body, { childList: true, subtree: true }); // runs at least every 150ms while the page keeps changing
    run();
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

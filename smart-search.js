/* Zella — smart search + alternatives for sold-out perfumes (2026-11-23).
   - Search: typo-tolerant + Arabic/Franco names ("سوفاج", "suvage", "sawaj" -> Sauvage), price/gender/mood words.
     Our own header dropdown replaces the theme's (results come out corrected, no "did you mean"); it stays open
     while scrolling (keyboard goes down), closes on a tap outside / a pick / page change. On /search?q= with no
     results (or an Arabic / filter query) the closest products are shown.
   - Clarity: search_empty / search_none (query tag), search_pick (result tapped in the dropdown).
   - Sold-out product page: "بدائل متاحة" box, 3 in-stock perfumes with the same badge and a close price.
   Catalog (all products + categories) is loaded only when needed and kept 6 h in localStorage. */
(function () {
  if (window.__zellaSmart) return;
  window.__zellaSmart = 1;

  var API = 'https://api.easy-orders.net/api/v1/products?join=categories&fields=id,slug,name,thumb,price,sale_price,quantity,track_stock,disable_orders_for_no_stock,hidden&limit=200&page=';
  var KEY = 'zss-cat-v3', TTL = 6 * 3600 * 1000;

  // ---------- badge (same rules as search-badge.js) ----------
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

  // ---------- catalog ----------
  var catalog = null, catP = null;
  function getCatalog() {
    if (catalog) return Promise.resolve(catalog);
    if (catP) return catP;
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.t < TTL && c.d && c.d.length) { catalog = prep(c.d); return Promise.resolve(catalog); }
    } catch (e) {}
    var all = [];
    function page(n) {
      return fetch(API + n).then(function (r) { return r.json(); }).then(function (j) {
        var L = Array.isArray(j) ? j : (j && j.data) || [];
        all = all.concat(L);
        return L.length === 200 && n < 10 ? page(n + 1) : all;
      });
    }
    catP = page(1).then(function (list) {
      var seen = {}, d = [];
      list.forEach(function (p) {
        if (!p || p.hidden || seen[p.id]) return;
        seen[p.id] = 1;
        // index 5 = 1 if it can be ordered. Same rule as the theme's "نفذ المخزون": orders blocked without stock and quantity 0
        // (the theme ignores track_stock).
        var ok = p.disable_orders_for_no_stock && +p.quantity <= 0 ? 0 : 1;
        d.push([p.name || '', p.slug, p.thumb || '', +p.price || 0, +p.sale_price || 0, ok,
          badgeOf((p.categories || []).map(function (c) { return c.name || ''; }))]);
      });
      try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
      catalog = prep(d);
      return catalog;
    }).catch(function () { catP = null; return []; });
    return catP;
  }
  function prep(d) {
    return d.map(function (r) {
      var o = { name: r[0].trim(), slug: r[1], thumb: r[2], price: r[4] > 0 ? r[4] : r[3], qty: r[5], badge: r[6] };
      o.n = norm(o.name);
      o.w = o.n.split(' ').filter(Boolean);
      // "1million" -> also "1" + "million"
      o.w.slice().forEach(function (w) { var m = w.match(/^(\d+)([a-z]{3,})$/); if (m) o.w.push(m[1], m[2]); });
      // famous lines carry their brand ("dior sauvage" finds "Sauvage Elixir")
      LINES.forEach(function (l) { if ((' ' + o.n + ' ').indexOf(' ' + l[0] + ' ') > -1) l[1].split(' ').forEach(function (b) { if (o.w.indexOf(b) < 0) o.w.push(b); }); });
      // bundles/offers have Arabic titles (sometimes starting with a quote or emoji)
      o.offer = (o.name.match(/[؀-ۿ]/g) || []).length > (o.name.match(/[A-Za-z]/g) || []).length;
      return o;
    });
  }

  // ---------- text ----------
  // Arabic -> Latin words customers type. Longest first when replacing.
  var AR = {
    'سوفاج': 'sauvage', 'سوفاچ': 'sauvage', 'ديور': 'dior', 'شانيل': 'chanel', 'شنيل': 'chanel', 'بلو': 'bleu', 'بلوو': 'bleu',
    'ايروس': 'eros', 'إيروس': 'eros', 'فرزاتشي': 'versace', 'فيرزاتشي': 'versace', 'فرساتشي': 'versace', 'فيرساتشي': 'versace',
    'ارماني': 'armani', 'أرماني': 'armani', 'كود': 'code', 'سترونجر': 'stronger', 'ستروجر': 'stronger', 'ويذ': 'with', 'يو': 'you',
    'ون مليون': '1million', 'وان مليون': '1million', 'مليون': 'million', 'انفكتوس': 'invictus', 'إنفكتوس': 'invictus', 'فانتوم': 'phantom',
    'باكو': 'paco', 'رابان': 'rabanne', 'توم فورد': 'tom ford', 'توم': 'tom', 'فورد': 'ford', 'عود': 'oud', 'بلاك': 'black',
    'جوتشي': 'gucci', 'جوشي': 'gucci', 'قوتشي': 'gucci', 'برادا': 'prada', 'ايف سان لوران': 'ysl', 'سان لوران': 'ysl', 'ليبر': 'libre',
    'جادور': 'jadore', 'ميس': 'miss', 'هوجو': 'hugo', 'بوس': 'boss', 'لاكوست': 'lacoste', 'لو مال': 'le male', 'لومال': 'le male',
    'جان بول': 'jean paul', 'جيفنشي': 'givenchy', 'جفنشي': 'givenchy', 'كارولينا': 'carolina', 'هيريرا': 'herrera', 'جود جيرل': 'good girl',
    'باكارات': 'baccarat', 'بكرات': 'baccarat', 'روج': 'rouge', 'ميني': 'mini', 'الكسير': 'elixir', 'إليكسير': 'elixir', 'اليكسير': 'elixir',
    'انتنس': 'intense', 'إنتنس': 'intense', 'انتنسلي': 'intensely', 'ازارو': 'azzaro', 'أزارو': 'azzaro', 'وانتد': 'wanted', 'مونت بلانك': 'montblanc',
    'مونتبلانك': 'montblanc', 'ليجند': 'legend', 'امواج': 'amouage', 'أمواج': 'amouage', 'كريد': 'creed', 'افنتوس': 'aventus', 'أفنتوس': 'aventus',
    'لطافة': 'lattafa', 'لطافه': 'lattafa', 'بديع العود': 'badee al oud', 'اسد': 'asad', 'خمرة': 'khamrah', 'خمره': 'khamrah',
    'دلشس': 'delicious', 'ديلشس': 'delicious', 'هاج': 'hug', 'سينت': 'scent', 'مانسيرا': 'mancera', 'توباكو': 'tobacco', 'توباكوا': 'tobacco',
    'فانيلا': 'vanilla', 'فانيليا': 'vanilla', 'بولجاري': 'bvlgari', 'بفلغاري': 'bvlgari', 'فالنتينو': 'valentino', 'بورن ان روما': 'born in roma',
    'كيليان': 'kilian', 'زيرجوف': 'xerjoff', 'اكسرجوف': 'xerjoff', 'اينيشيو': 'initio', 'جيرلان': 'guerlain', 'بويزن': 'poison', 'ألترا': 'ultra', 'الترا': 'ultra',
    'فيري': 'very', 'فيرى': 'very', 'سكسي': 'sexy', 'سكسى': 'sexy', 'بومب شيل': 'bombshell', 'بومبشيل': 'bombshell', 'فيكتوريا': 'victoria',
    'سيكريت': 'secret', 'سيكرت': 'secret', 'يارا': 'yara', 'ماي واي': 'my way', 'ميس ديور': 'miss dior', 'بربري': 'burberry', 'بيربري': 'burberry',
    'ديلان': 'dylan', 'الور': 'allure', 'ألور': 'allure', 'سبورت': 'sport', 'لايت بلو': 'light blue', 'دولتشي': 'dolce', 'جابانا': 'gabbana',
    'ذا ون': 'the one', 'دانهيل': 'dunhill', 'ديزاير': 'desire', 'مونتال': 'montale', 'نارسيسو': 'narciso', 'كايالي': 'kayali', 'فانتازيا': 'fantasy',
    'بلاك اوبيوم': 'black opium', 'اوبيوم': 'opium', 'سي': 'si', 'ايدول': 'idole', 'لانكوم': 'lancome', 'فيرساتشي ديلان': 'versace dylan', 'شيروتي': 'cerruti',
    // from empty searches (Clarity, 2026-11-25)
    'اروجيت': 'arrogate', 'أروجيت': 'arrogate', 'عساف': 'assaf', 'اماراتي': 'emirates', 'امارتي': 'emirates', 'اماراتيه': 'emirates',
    'امارات': 'emirates', 'دخون': 'dkhoon', 'افنان': 'afnan', 'انسينس': 'incense'
  };
  var AR_KEYS = Object.keys(AR).sort(function (a, b) { return b.length - a.length; });

  // Franco / phonetic spellings -> real word
  var LAT = {
    sawaj: 'sauvage', sawag: 'sauvage', sowag: 'sauvage', sovag: 'sauvage', sovage: 'sauvage', sofag: 'sauvage', sofage: 'sauvage', sauvaj: 'sauvage', suvaj: 'sauvage',
    shanel: 'chanel', shanil: 'chanel', kreed: 'creed', bakarat: 'baccarat', bacara: 'baccarat', bakara: 'baccarat',
    gucci: 'gucci', guchi: 'gucci', jucci: 'gucci', versachi: 'versace', fersace: 'versace', armany: 'armani', lataffa: 'lattafa', latafa: 'lattafa',
    khamra: 'khamrah', invektus: 'invictus', milion: 'million', millon: 'million', ysl: 'ysl', 'yves': 'ysl',
    azar: 'azzaro', azaro: 'azzaro', azzaro: 'azzaro', insence: 'incense', insense: 'incense', insenc: 'incense', dukhoon: 'dkhoon', dakhoon: 'dkhoon'
  };

  // line word(s) -> brand word(s) added to that product's search words
  var LINES = [
    ['sauvage', 'dior'], ['jadore', 'dior'], ['fahrenheit', 'dior'], ['eros', 'versace'], ['dylan', 'versace'],
    ['invictus', 'paco rabanne'], ['1million', 'paco rabanne'], ['phantom', 'paco rabanne'], ['aventus', 'creed'],
    ['khamrah', 'lattafa'], ['asad', 'lattafa'], ['stronger', 'armani'], ['acqua', 'armani'], ['bleu', 'chanel'],
    ['coco mademoiselle', 'chanel'], ['coco noir', 'chanel'], ['chance', 'chanel'], ['tobacco vanille', 'tom ford'], ['oud wood', 'tom ford'], ['baccarat', 'mfk'],
    ['good girl', 'carolina herrera'], ['le male', 'jpg gaultier'], ['ultra male', 'jpg gaultier'], ['scandal', 'jpg gaultier'],
    ['wanted', 'azzaro'], ['legend', 'montblanc'], ['explorer', 'montblanc'], ['libre', 'ysl'], ['black opium', 'ysl'], ['si', 'armani']
  ];

  // words that only describe the request
  // mood words -> words in perfume names (until we have the notes of every perfume)
  var MOODS = [
    [/^(فريش|منعش|صيفي|صيفى|للصيف|سبور|سبورت|fresh|summer|sport)$/, 'فريش', ['aqua', 'acqua', 'blue', 'bleu', 'sport', 'fresh', 'cool', 'water', 'light', 'ocean', 'marine', 'profondo', 'pacific', 'swim', 'ice']],
    [/^(سهره|سهرة|شتوي|شتوى|للشتا|تقيل|تقيله|ليلي|winter|night|evening)$/, 'للسهرة', ['oud', 'intense', 'elixir', 'night', 'noir', 'black', 'tobacco', 'absolu', 'extrait', 'leather', 'amber', 'smoke']],
    [/^(حلو|مسكر|سكري|سويت|sweet|vanilla)$/, 'حلو وفانيلا', ['vanilla', 'vanille', 'candy', 'sugar', 'sweet', 'honey', 'caramel', 'delicious']]
  ];
  var FILLER =/^(برفيوم|برفان|برفانات|برفيومات|عطر|عطور|ريحه|ريحة|perfume|perfumes|fragrance|اوريجينال|اصلي)$/;
  // ("male", "homme", "femme" are in perfume names, so they stay search words)
  var MEN_W = /^(رجالي|رجالى|رجال|للرجال|men|man|mens)$/, WOMEN_W = /^(حريمي|حريمى|حريم|نسائي|بناتي|للبنات|للستات|women|woman|ladies)$/;

  function norm(s) {
    s = String(s || '').toLowerCase();
    s = s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s;
    // ٓ-ٕ: hamza/madda marks that NFD leaves behind ("إ" -> "ا" + "ٕ"), so "إيروس" matches "ايروس"
    s = s.replace(/[ً-ٕـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
    // punctuation (also Arabic ، ؟) -> space, so words can be matched whole
    s = s.replace(/['’`]/g, '').replace(/[^a-z0-9ء-ي٠-٩پچڤگ]+/g, ' ');
    // whole Arabic words only ("يو" must not change "برفيوم"); "ال" in front is allowed ("السوفاج")
    s = ' ' + s + ' ';
    AR_KEYS.forEach(function (k) {
      var kk = k.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
      [' ' + kk + ' ', ' ال' + kk + ' '].forEach(function (pat) {
        while (s.indexOf(pat) > -1) s = s.replace(pat, ' ' + AR[k] + ' ');
      });
    });
    s = s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s;
    s = s.replace(/['’`]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9؀-ۿ]+/g, ' ');
    s = s.replace(/\bone\s+million\b|\b1\s+million\b/g, '1million');
    s = s.replace(/(^|\s)([ld])\s+([a-z]{3,})/g, '$1$2$3');   // French l'/d' typed with a space: "l homme" -> "lhomme" (like L'Homme)
    s = s.replace(/\b(\d{1,2})\s+(pm|am)\b/g, '$1$2').replace(/\bpm\s*(\d{1,2})\b/g, '$1pm');   // "9 pm", "pm9" -> "9pm"
    s = s.split(' ').map(function (w) { return LAT[w] || w; }).join(' ');
    return s.trim();
  }

  // Damerau-Levenshtein (optimal string alignment), stops early above max.
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var i, j, d = [];
    for (i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) {
      var rowMin = 1e9;
      for (j = 1; j <= b.length; j++) {
        var c = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1);
        d[i][j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
    }
    return d[a.length][b.length];
  }

  // score of one query word against a product's words (0 = no match)
  function wordScore(q, words) {
    var best = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w === q) return 1;
      if (q.length >= 2 && w.indexOf(q) === 0) { best = Math.max(best, 0.9); continue; }
      if (q.length >= 4 && w.indexOf(q) > 0) { best = Math.max(best, 0.7); continue; }
      var max = q.length >= 7 ? 2 : q.length >= 4 ? 1 : (q.length === 3 && w[0] === q[0] ? 1 : 0);   // "blu" ~ "bleu"
      if (!max) continue;
      // compare with the same-length start of the word too (typing not finished)
      var dd = Math.min(dist(q, w, max), w.length > q.length ? dist(q, w.slice(0, q.length), max) : 99);
      if (dd <= max) best = Math.max(best, dd === 1 ? 0.75 : 0.6);
    }
    return best;
  }

  // price / gender words: "تحت 800", "ارخص", "رجالي"
  function filters(raw) {
    var f = { max: 0, cheap: false, sex: '' };
    var t = String(raw).replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
    var m = t.match(/(تحت|اقل من|أقل من|لحد|under|below|less than|max)\s*(\d{2,5})/i) || t.match(/(\d{2,5})\s*(جنيه|ج|egp|le)?\s*(او اقل|أو أقل|وأقل|واقل)/i);
    if (m) { f.max = +(m[2] && /^\d+$/.test(m[2]) ? m[2] : m[1]); t = t.replace(m[0], ' '); }
    if (/(ارخص|أرخص|رخيص|cheap)/i.test(t)) { f.cheap = true; t = t.replace(/(ارخص|أرخص|رخيص|cheapest|cheap)/ig, ' '); }
    var words = norm(t).split(' ').filter(function (w) {
      for (var i = 0; i < MOODS.length; i++) if (MOODS[i][0].test(w)) { f.mood = MOODS[i]; return false; }
      if (MEN_W.test(w)) { f.sex = f.sex ? 'any' : 'm'; return false; }
      if (WOMEN_W.test(w)) { f.sex = f.sex ? 'any' : 'w'; return false; }
      return !FILLER.test(w) && !/^\d{4,5}$/.test(w);   // a lone 4-5 digit number is a price; "212", "360" are names
    });
    f.words = words.filter(function (w) { return w.length > 1 || /\d/.test(w); });
    return f;
  }
  function passes(p, f) {
    if (f.max && p.price > f.max) return false;
    if (f.mood && !f.mood[2].some(function (k) { return p.w.indexOf(k) > -1; })) return false;
    if (f.sex === 'm' && !/MEN|UNISEX/.test(p.badge) || f.sex === 'm' && p.badge === 'WOMEN') return false;
    if (f.sex === 'w' && !/WOMEN|UNISEX/.test(p.badge)) return false;
    return true;
  }

  function search(list, raw, n) {
    var f = filters(raw), qw = f.words;
    var onlyFilter = !qw.length && (f.max || f.cheap || f.sex || f.mood);
    if (!qw.length && !onlyFilter) return [];
    var out = [];
    list.forEach(function (p) {
      if (p.offer || !passes(p, f)) return;
      if (onlyFilter) { if (p.qty > 0 && p.badge !== 'MINI') out.push([0, p]); return; }
      var s = 0, hit = 0;
      qw.forEach(function (w) { var v = wordScore(w, p.w); if (v) { hit++; s += v; } });
      if (!hit || hit < Math.ceil(qw.length / 2)) return;
      s = s / qw.length + (hit === qw.length ? 0.3 : 0) + (p.qty > 0 ? 0.08 : 0);   // available ones a bit higher
      if (qw.length > 1 && p.n.indexOf(qw.join(' ')) > -1) s += 0.4;   // the whole phrase as typed ("ysl y")
      out.push([s, p]);
    });
    if (onlyFilter || f.cheap) {
      out.sort(function (a, b) { return f.cheap || !f.max ? a[1].price - b[1].price : b[1].price - a[1].price; });   // "تحت 800": closest to 800 first
      if (!onlyFilter) { var t1 = Math.max.apply(null, out.map(function (x) { return x[0]; })); out = out.filter(function (x) { return x[0] >= t1 * 0.6; }); }
    } else {
      out.sort(function (a, b) { return b[0] - a[0] || a[1].name.length - b[1].name.length; });
      if (out.length) { var top = out[0][0]; out = out.filter(function (x) { return x[0] >= top * 0.6; }); }   // drop weak extras
    }
    var res = out.slice(0, n || 6).map(function (x) { return x[1]; });
    if (!res.length && f.max && onlyFilter) {   // nothing available under that price: show the closest prices above it
      res = list.filter(function (p) { return !p.offer && p.qty > 0 && p.badge !== 'MINI' && p.price > f.max && passes(p, { sex: f.sex, mood: f.mood }); })
        .sort(function (a, b) { return a.price - b.price; }).slice(0, n || 6);
      res.relaxed = f.max;
    }
    return res;
  }
  function filterTitle(raw) {
    var f = filters(raw), parts = [];
    if (f.mood) parts.push(f.mood[1]);
    if (f.sex === 'm') parts.push('رجالي'); if (f.sex === 'w') parts.push('حريمي');
    if (f.max) parts.push('لحد ' + f.max + ' ج.م');
    if (f.cheap) parts.push('من الأرخص');
    return parts.join(' · ');
  }

  // the words of the best match that correspond to the query -> "قصدك: Sauvage Elixir؟"
  function correction(raw, top) {
    if (!top) return '';
    var qw = norm(raw).split(' ').filter(Boolean), pw = top.name.split(/\s+/), used = [];
    qw.forEach(function (q) {
      var best = null, bs = 0;
      pw.forEach(function (w) { var v = wordScore(q, [norm(w)]); if (v > bs) { bs = v; best = w; } });
      if (best && used.indexOf(best) < 0) used.push(best);
    });
    return used.join(' ') || top.name;
  }

  function clarity(ev, tag, val) {
    try { if (window.clarity) { window.clarity('event', ev); if (tag) window.clarity('set', tag, String(val).slice(0, 60)); } } catch (e) {}
  }

  // ---------- UI ----------
  var css = document.createElement('style');
  css.textContent =
    '#zss{direction:rtl;background:#fff;border-radius:12px;padding:10px 12px;font-family:inherit}' +
    '#zss .zss-fix{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;color:#555;margin-bottom:6px}' +
    '#zss .zss-fix b{color:#111;text-decoration:underline;cursor:pointer;direction:ltr;unicode-bidi:isolate}' +
    '#zss .zss-t{font-size:12px;color:#888;margin:6px 0 2px}' +
    '#zss a.zss-r{display:flex;align-items:center;gap:10px;direction:ltr;text-align:left;padding:8px 0;border-top:1px solid #f1f1f1;color:#111;text-decoration:none;font-size:13px}' +
    '#zss .zss-n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#zss .zss-p{flex:none;font-size:12px;color:#555;direction:rtl}' +
    '#zss-page{margin:16px;box-shadow:0 1px 10px rgba(0,0,0,.08)}' +
    '#zalt{direction:rtl;margin:14px 0;padding:14px;border-radius:16px;background:#f0fdfa;border:1px solid #99f6e4}' +
    '#zalt .zalt-h{font-weight:700;font-size:15px;color:#134e4a}' +
    '#zalt .zalt-s{font-size:12px;color:#0f766e;margin:2px 0 10px}' +
    '#zalt .zalt-g{display:flex;gap:8px}' +
    '#zalt a{flex:1;min-width:0;text-decoration:none;color:#111;text-align:center;background:#fff;border-radius:12px;padding:6px 6px 8px}' +
    '#zalt .zalt-i{position:relative;margin-bottom:12px}' +
    '#zalt img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;display:block}' +
    '#zalt .zalt-i .zsb-b{bottom:-7px}' +
    '#zalt .zalt-n{font-size:11.5px;line-height:1.3;height:30px;overflow:hidden;direction:ltr}' +
    '#zalt .zalt-p{font-size:13px;font-weight:700;color:#f97316;margin-top:2px}';
  document.head.appendChild(css);

  function pill(b) { return b ? '<span class="zsb-b zsb-' + b + '">' + b + '</span>' : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function price(p) { return p.price ? Math.round(p.price) + ' ج.م' : ''; }
  function rows(list) {
    return list.map(function (p) {
      return '<a class="zss-r" href="/products/' + encodeURIComponent(p.slug) + '"><span class="zsb-pic"><img alt="" src="' + esc(p.thumb) + '">' +
        pill(p.badge) + '</span><span class="zss-n">' + esc(p.name) + '</span><span class="zss-p">' +
        (p.qty ? price(p) : '<span style="color:#999">خلص</span>') + '</span></a>';
    }).join('');
  }

  function isAr(s) { return /[؀-ۿ]/.test(s); }

  // text above the results (no "did you mean": results simply come out corrected)
  function panelHTML(raw, list) {
    var ft = filterTitle(raw);
    if (list.relaxed) return '<div class="zss-t">مفيش برفيوم متاح لحد ' + list.relaxed + ' ج.م دلوقتي، ودي أقرب أسعار 👇</div>' + rows(list);
    return (ft ? '<div class="zss-t">برفيومات ' + ft + ' 👇</div>' : '') + rows(list);
  }
  // words for "عرض جميع النتائج": what was typed, or the corrected words when nothing matches it exactly
  function allQuery(raw, list) {
    var f = filters(raw), q = f.words.join(' ');
    if (!list.length || !q || filterTitle(raw)) return raw;
    var exact = list.some(function (p) { return p.n.indexOf(q) > -1; });
    return exact && !isAr(raw) ? raw : correction(q, list[0]) || raw;
  }

  // ---------- header dropdown: ours replaces the theme's ----------
  // The theme's list is hidden (it showed plain rows first, closed when the page was touched, and stayed open after a tap).
  css.textContent += 'header :is(div,ul):has(> a[href^="/search"]){display:none!important}' +
    '#zdd{position:fixed;left:10px;right:10px;z-index:9990;background:#fff;border-radius:14px;box-shadow:0 10px 34px rgba(0,0,0,.2);' +
    'overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:4px 12px 0}' +
    '#zdd .zss-t{margin:8px 0 2px}' +
    '#zdd .zdd-all{display:block;cursor:pointer;text-align:center;padding:12px 0 14px;border-top:1px solid #f1f1f1;font-size:13px;font-weight:700;color:#0f766e;text-decoration:none}' +
    '#zdd .zdd-wait{padding:14px 0;text-align:center;color:#999;font-size:13px}';

  var dd = null, ddInput = null, ddTimer, lastQ = '', apiCache = {};
  function headerInput(el) { return el && el.matches && el.matches('header input[type="text"]'); }
  function place() {
    if (!dd || !ddInput) return;
    var r = ddInput.getBoundingClientRect(), vv = window.visualViewport;
    var top = Math.max(8, r.bottom + 6), h = (vv ? vv.height + vv.offsetTop : innerHeight) - top - 10;
    dd.style.top = top + 'px';
    dd.style.maxHeight = Math.max(160, h) + 'px';
  }
  function closeDD() { if (dd) { dd.remove(); dd = null; } }
  function render(raw, list, waiting) {
    if (!dd) { dd = document.createElement('div'); dd.id = 'zdd'; document.body.appendChild(dd); }
    if (!list.length) {
      dd.innerHTML = waiting ? '<div class="zdd-wait">بندوّر…</div>' : '<div class="zdd-wait">مفيش نتايج، جرّب اسم الماركة أو جزء من الاسم.</div>';
    } else {
      var q = allQuery(raw, list);
      dd.innerHTML = '<div id="zss" style="padding:0;border-radius:0">' + panelHTML(raw, list) + '</div>' +
        // data-go, not href="/search…": search-badge.js decorates product links that sit next to a /search link
        '<a class="zdd-all" role="link" data-go="/search?q=' + encodeURIComponent(q) + '">عرض جميع النتائج</a>';
    }
    place();
  }
  // fast first answer while the catalog loads: the store's own name search (+ categories for the badge)
  function quick(raw) {
    if (apiCache[raw]) return Promise.resolve(apiCache[raw]);
    return fetch('https://api.easy-orders.net/api/v1/products?join=categories&fields=id,slug,name,thumb,price,sale_price,quantity,disable_orders_for_no_stock,hidden&limit=6&filter=name||cont||' +
      encodeURIComponent(raw)).then(function (r) { return r.json(); }).then(function (j) {
      var L = (Array.isArray(j) ? j : (j && j.data) || []).filter(function (p) { return !p.hidden; }).map(function (p) {
        return [p.name || '', p.slug, p.thumb || '', +p.price || 0, +p.sale_price || 0, p.disable_orders_for_no_stock && +p.quantity <= 0 ? 0 : 1,
          badgeOf((p.categories || []).map(function (c) { return c.name || ''; }))];
      });
      return (apiCache[raw] = prep(L).filter(function (p) { return !p.offer; }));
    }).catch(function () { return []; });
  }
  function update() {
    if (!ddInput) return;
    var raw = ddInput.value.trim();
    if (raw.length < 2) { closeDD(); return; }
    if (catalog) {
      var res = search(catalog, raw, 6);
      render(raw, res, false);
      if (raw !== lastQ) { lastQ = raw; if (!res.length) clarity('search_empty', 'search_none', raw); }
      return;
    }
    if (!dd || !dd.querySelector('a.zss-r')) render(raw, [], true);
    if (!isAr(raw)) quick(raw).then(function (L) { if (!catalog && ddInput && ddInput.value.trim() === raw && L.length) render(raw, L, false); });
    getCatalog().then(function () { if (ddInput && ddInput.value.trim() === raw) update(); });
  }
  document.addEventListener('focusin', function (e) { if (headerInput(e.target)) { ddInput = e.target; getCatalog(); if (e.target.value.trim().length > 1) update(); } }, true);
  document.addEventListener('input', function (e) {
    if (!headerInput(e.target)) return;
    ddInput = e.target;
    clearTimeout(ddTimer);
    ddTimer = setTimeout(update, 120);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (!headerInput(e.target)) return;
    if (e.key === 'Escape') closeDD();
    if (e.key === 'Enter' && dd) {   // keyboard "search" = عرض جميع النتائج
      var all = dd.querySelector('.zdd-all');
      if (all) { e.preventDefault(); e.stopPropagation(); go(all.dataset.go); }
    }
  }, true);
  function go(url) {
    closeDD();
    if (ddInput) ddInput.blur();
    if (window.next && window.next.router) window.next.router.push(url); else location.href = url;
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var a = t.closest('#zdd a');
    if (a) {   // a result or "عرض جميع النتائج": open it and close the list
      e.preventDefault(); e.stopPropagation();
      if (a.classList.contains('zss-r')) clarity('search_pick');
      go(a.dataset.go || a.getAttribute('href'));
      return;
    }
    if (t.closest('#zdd') || headerInput(t)) return;
    closeDD();   // tap anywhere else
  }, true);
  // scrolling: the keyboard goes down, the results stay open
  document.addEventListener('touchmove', function () {
    if (dd && ddInput && document.activeElement === ddInput) ddInput.blur();
  }, { passive: true, capture: true });
  window.addEventListener('scroll', place, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', place);
  // /search page: one search bar. When the header bar is open, the page's own bar is hidden and the header one holds the words.
  css.textContent += 'html.zss-one [data-search="container"]{display:none!important}';
  function oneBar() {
    var on = false;
    if (location.pathname === '/search') {
      var hi = Array.prototype.filter.call(document.querySelectorAll('header input[type="text"]'), function (x) { return x.getBoundingClientRect().height > 0; })[0];
      if (hi) {
        on = true;
        var q = new URLSearchParams(location.search).get('q') || '';
        if (!hi.value && q && document.activeElement !== hi) Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(hi, q);
      }
    }
    document.documentElement.classList.toggle('zss-one', on);
  }
  setInterval(oneBar, 400);
  var lastUrl = location.pathname + location.search;
  setInterval(function () { var u = location.pathname + location.search; if (u !== lastUrl) { lastUrl = u; closeDD(); } }, 300);

  // /search?q= page with no results
  var pageQ = '';
  function searchPage() {
    var old = document.getElementById('zss-page');
    if (location.pathname !== '/search') { if (old) old.remove(); return; }
    var raw = (new URLSearchParams(location.search).get('q') || '').trim();
    var main = document.querySelector('main');
    if (!raw || !main) return;
    var special = isAr(raw) || filterTitle(raw);
    if (!special && main.querySelector('a[href^="/products/"]:not(.zss-r)')) { if (old) old.remove(); return; }
    if (old && old.dataset.q === raw) return;
    if (pageQ === raw) return;
    pageQ = raw;
    setTimeout(function () {
      var themeHas = !!main.querySelector('a[href^="/products/"]:not(.zss-r)');
      if (themeHas && !special) { pageQ = ''; return; }
      getCatalog().then(function (list) {
        var res = search(list, raw, special ? 8 : 6);
        if (!themeHas) clarity(res.length ? 'search_none' : 'search_empty', 'search_none', raw);
        if (!res.length) return;
        var p = document.getElementById('zss-page') || document.createElement('div');
        p.id = 'zss-page';
        p.dataset.q = raw;
        p.innerHTML = '<div id="zss">' + (special ? '' : '<div class="zss-t">دي أقرب حاجة للي اتكتب 👇</div>') + panelHTML(raw, res) + '</div>';
        if (!p.isConnected) {
          // put it in place of the theme's empty state ("لم يتم العثور على نتائج"), else at the top of main
          var empty = Array.prototype.filter.call(main.querySelectorAll('p,span,div,h2,h3'), function (e) {
            return e.children.length === 0 && /لم يتم العثور/.test(e.textContent);
          })[0];
          var blk = empty;
          while (blk && blk.parentElement && blk.parentElement !== main && blk.parentElement.children.length < 3) blk = blk.parentElement;
          if (blk && blk.parentElement) { blk.parentElement.insertBefore(p, blk); blk.style.display = 'none'; } else main.prepend(p);
        }
      });
    }, 1500);
  }

  // ---------- sold-out product page ----------
  var altFor = '';
  function soldOut() {
    var m = location.pathname.match(/^\/products\/([^/?#]+)/);
    var old = document.getElementById('zalt');
    if (!m) { if (old) old.remove(); altFor = ''; return; }
    var slug = decodeURIComponent(m[1]);
    if (old && old.dataset.s === slug) return;
    if (old) old.remove();
    var btns = Array.prototype.filter.call(document.querySelectorAll('button'), function (b) {   // product pages have no <main>
      return b.textContent.trim() === 'نفذ المخزون' && b.getBoundingClientRect().height > 0 && !b.closest('.home_grid_section_card');
    });
    if (!btns.length || altFor === slug) return;
    altFor = slug;
    var anchor = btns[btns.length - 1].parentElement;
    getCatalog().then(function (list) {
      if (location.pathname.indexOf('/products/' + m[1]) !== 0 || document.getElementById('zalt')) return;
      var me = null;
      list.forEach(function (p) { if (p.slug.toLowerCase() === slug.toLowerCase()) me = p; });
      if (!me || !me.badge) return;
      var same = list.filter(function (p) {
        return p !== me && !p.offer && p.qty > 0 && p.badge && p.price > 0 &&
          (me.badge === 'MINI' ? p.badge === 'MINI' : p.badge !== 'MINI' && (p.badge === me.badge ||
            (me.badge === 'UNISEX' || p.badge === 'UNISEX') && me.badge !== 'ORIGINAL' && p.badge !== 'ORIGINAL'));
      });
      // close price first, then same exact badge
      same.sort(function (a, b) {
        var da = Math.abs(a.price - me.price) / (me.price || 1) + (a.badge === me.badge ? 0 : 0.15);
        var db = Math.abs(b.price - me.price) / (me.price || 1) + (b.badge === me.badge ? 0 : 0.15);
        return da - db;
      });
      var pick = same.slice(0, 3);
      if (pick.length < 2 || !anchor.isConnected) return;
      var box = document.createElement('div');
      box.id = 'zalt';
      box.dataset.s = slug;
      box.innerHTML = '<div class="zalt-h">البرفيوم ده خلص حالياً، بس دي بدائل متاحة 👇</div>' +
        '<div class="zalt-s">من نفس القسم وفي سعر قريب.</div><div class="zalt-g">' +
        pick.map(function (p) {
          return '<a href="/products/' + encodeURIComponent(p.slug) + '"><div class="zalt-i"><img alt="" loading="lazy" src="' + esc(p.thumb) + '">' + pill(p.badge) +
            '</div><div class="zalt-n">' + esc(p.name) + '</div><div class="zalt-p">' + price(p) + '</div></a>';
        }).join('') + '</div>';
      anchor.parentElement.insertBefore(box, anchor.nextSibling);
    });
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#zalt a')) clarity('oos_alt_click');
  }, true);

  window.__zss = { search: search, correction: correction, getCatalog: getCatalog, norm: norm, panelHTML: panelHTML, isAr: isAr, filterTitle: filterTitle };   // for test runs

  var t;
  function tick() { searchPage(); soldOut(); }
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 150); })
    .observe(document.documentElement, { childList: true, subtree: true });
  tick();
})();

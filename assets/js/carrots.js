// carrots.js — the easter-egg-collection game.
// Seven carrots, one per page. Click reveals a quote. Find all 7 to
// unlock the master line. State persists in localStorage.
(function () {
  'use strict';

  var KEY = 'oschei.carrots.found';

  // page-id → { quote, source }
  var QUOTES = {
    'about':       { q: 'Mostly harmless.',                                                 s: '— D. Adams' },
    'projects':    { q: 'All that is gold does not glitter.',                               s: '— J.R.R. Tolkien' },
    'project':     { q: 'Even the smallest person can change the course of the future.',    s: '— J.R.R. Tolkien' },
    'experience':  { q: 'Who controls the past controls the future.',                       s: '— G. Orwell' },
    'contact':     { q: "O brave new world, that has such people in't!",                    s: '— A. Huxley' },
    'colophon':    { q: 'Good prose is like a windowpane.',                                 s: '— G. Orwell' },
    '404':         { q: 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', s: '— D. Adams' }
  };

  var TOTAL = 7;
  var MASTER = "you can't pull a carrot up to check its progress.";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function save(found) {
    try { localStorage.setItem(KEY, JSON.stringify(found)); } catch (e) { /* ignore */ }
  }

  function record(pageId) {
    var found = load();
    if (found.indexOf(pageId) === -1) {
      found.push(pageId);
      save(found);
    }
    return found;
  }

  function updateCounter(count) {
    var el = document.getElementById('carrot-counter');
    var txt = document.getElementById('carrot-counter-text');
    if (!el || !txt) return;
    el.setAttribute('data-active', 'true');
    if (count >= TOTAL) {
      txt.textContent = '✓';
    } else {
      txt.textContent = count + '/' + TOTAL;
    }
  }

  function showTooltip(near, pageId, foundCount) {
    var quote = QUOTES[pageId];
    if (!quote) return;

    // Remove any existing tooltip
    var existing = document.querySelector('.carrot-tooltip');
    if (existing) existing.remove();

    var t = document.createElement('div');
    t.className = 'carrot-tooltip';
    t.setAttribute('role', 'dialog');
    t.setAttribute('aria-label', 'Easter egg revealed');

    var qline = document.createElement('div');
    var qspan = document.createElement('span'); qspan.className = 'quote'; qspan.textContent = '"' + quote.q + '"';
    var sspan = document.createElement('span'); sspan.className = 'src';   sspan.textContent = quote.s;
    qline.appendChild(qspan); qline.appendChild(sspan);
    t.appendChild(qline);

    var pline = document.createElement('div');
    pline.className = 'progress';
    pline.textContent = 'found ' + foundCount + ' of ' + TOTAL;
    t.appendChild(pline);

    if (foundCount >= TOTAL) {
      var mline = document.createElement('div');
      mline.className = 'master';
      mline.textContent = MASTER;
      t.appendChild(mline);
    }

    document.body.appendChild(t);

    // Position near the clicked carrot
    var rect = near.getBoundingClientRect();
    var trect = t.getBoundingClientRect();
    var top = rect.top - trect.height - 8;
    var left = rect.left + rect.width / 2 - trect.width / 2;
    if (top < 8) top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + trect.width > window.innerWidth - 8) {
      left = window.innerWidth - trect.width - 8;
    }
    t.style.top = top + 'px';
    t.style.left = left + 'px';
    t.setAttribute('data-visible', 'true');

    // Dismiss on Esc or outside-click
    function dismiss() {
      t.remove();
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    }
    function onKey(ev) { if (ev.key === 'Escape') dismiss(); }
    function onClick(ev) {
      if (ev.target.closest('.carrot-tooltip') || ev.target.closest('.carrot')) return;
      dismiss();
    }
    setTimeout(function () {
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onClick);
    }, 0);
  }

  // The scene drawn in the completion overlay:
  //   - A dirt band with clods and texture
  //   - The hole where the carrot came out of
  //   - A small hand trowel lying beside the hole (just-dropped)
  //   - The carrot itself: 5 asymmetric fern leaves + 2 background ferns
  //     + a small but recognisable cone-shaped body with ring marks and
  //     a burgundy "too-early" tip with wispy root threads
  // Only the .carrot-svg group animates; everything else is static stage.
  var COMPLETION_SVG = (
    '<svg viewBox="0 0 240 200" width="240" height="220" aria-hidden="true">' +
      // ---------- DIRT BAND (static) ----------
      '<path d="M 10 156 Q 25 154 38 156 Q 52 158 64 155 Q 78 153 92 156' +
              ' Q 105 158 116 155 Q 124 156 132 155 Q 147 153 162 156' +
              ' Q 177 158 192 155 Q 207 153 222 156 L 230 195 L 10 195 Z"' +
        ' fill="#2a251c" stroke="#3a3327" stroke-width="0.6"/>' +
      '<g fill="#3d3528">' +
        '<ellipse cx="32"  cy="166" rx="3.2" ry="1.5"/>' +
        '<ellipse cx="50"  cy="172" rx="2.5" ry="1.2"/>' +
        '<ellipse cx="68"  cy="164" rx="3.6" ry="1.6"/>' +
        '<ellipse cx="82"  cy="174" rx="2.2" ry="1.1"/>' +
        '<ellipse cx="100" cy="168" rx="3"   ry="1.4"/>' +
        '<ellipse cx="115" cy="178" rx="2.8" ry="1.2"/>' +
        '<ellipse cx="138" cy="165" rx="3.2" ry="1.5"/>' +
        '<ellipse cx="160" cy="175" rx="3.6" ry="1.5"/>' +
        '<ellipse cx="178" cy="167" rx="2.5" ry="1.2"/>' +
        '<ellipse cx="195" cy="170" rx="3"   ry="1.4"/>' +
        '<ellipse cx="212" cy="165" rx="2.8" ry="1.3"/>' +
      '</g>' +
      '<g fill="#1a160f" opacity="0.7">' +
        '<ellipse cx="44"  cy="170" rx="2"   ry="0.9"/>' +
        '<ellipse cx="75"  cy="180" rx="2.4" ry="1"/>' +
        '<ellipse cx="108" cy="184" rx="2"   ry="0.9"/>' +
        '<ellipse cx="148" cy="181" rx="2.3" ry="1"/>' +
        '<ellipse cx="186" cy="184" rx="2"   ry="0.9"/>' +
      '</g>' +
      '<g fill="#565f89" opacity="0.5">' +
        '<circle cx="40"  cy="160" r="0.7"/>' +
        '<circle cx="92"  cy="161" r="0.8"/>' +
        '<circle cx="125" cy="160" r="0.7"/>' +
        '<circle cx="168" cy="160" r="0.8"/>' +
        '<circle cx="200" cy="161" r="0.7"/>' +
      '</g>' +
      // ---------- THE HOLE ----------
      '<ellipse cx="120" cy="156" rx="12" ry="3" fill="#0a0b14"/>' +
      '<ellipse cx="120" cy="155" rx="12" ry="2.5" fill="none" stroke="#1a160f" stroke-width="0.8"/>' +
      // ---------- TROWEL (static) ----------
      '<g transform="rotate(-10 175 156)">' +
        '<ellipse cx="172" cy="168" rx="42" ry="2.4" fill="#000" opacity="0.4"/>' +
        // blade
        '<path d="M 130 159 Q 134 153 146 152 Q 156 152 162 156 L 162 162 Q 156 165 146 165 Q 134 164 130 159 Z"' +
              ' fill="#a8b1c5" stroke="#3a4055" stroke-width="0.5"/>' +
        '<path d="M 132 159 Q 145 158 160 158" fill="none" stroke="#7a8294" stroke-width="0.5" opacity="0.75"/>' +
        '<path d="M 136 156 Q 148 154 160 155" fill="none" stroke="#d8e1f5" stroke-width="0.5" opacity="0.85"/>' +
        '<path d="M 136 163 Q 148 164 160 162" fill="none" stroke="#5a647f" stroke-width="0.4" opacity="0.7"/>' +
        // cranked shaft
        '<path d="M 162 158 L 166 158 L 168 154 L 174 153" stroke="#3a4055" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M 162 158 L 166 158 L 168 154 L 174 153" stroke="#9aa5c0" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M 162 157.4 L 166 157.4 L 168 153.4 L 174 152.4" stroke="#d8e1f5" stroke-width="0.7" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>' +
        // ferrule
        '<rect x="174" y="150" width="5" height="7" rx="0.6" fill="#3a4055"/>' +
        '<rect x="174" y="150" width="5" height="2.4" fill="#9aa5c0"/>' +
        // wooden handle (contoured)
        '<path d="M 179 150 Q 182 149 188 148.5 Q 196 148 199 150 Q 201 152.5 201 156 Q 201 159.5 199 161 Q 196 162 188 161.5 Q 182 161 179 160 Z"' +
              ' fill="#b08550" stroke="#5a3e22" stroke-width="0.5"/>' +
        '<line x1="182" y1="152" x2="200" y2="151.5" stroke="#7a5a35" stroke-width="0.32" opacity="0.55"/>' +
        '<line x1="182" y1="156" x2="200" y2="156"   stroke="#7a5a35" stroke-width="0.32" opacity="0.5"/>' +
        '<line x1="183" y1="158.5" x2="198" y2="158" stroke="#7a5a35" stroke-width="0.28" opacity="0.45"/>' +
        '<path d="M 182 150.5 Q 190 149.5 199 150.5" fill="none" stroke="#d8b07f" stroke-width="0.6" opacity="0.85"/>' +
        '<circle cx="197" cy="155" r="1.2" fill="#3a2511"/>' +
        '<circle cx="197" cy="155" r="0.8" fill="#1a100a"/>' +
      '</g>' +

      // ---------- ANIMATED LAYER: the carrot itself ----------
      '<g class="carrot-svg">' +
        // Background ferns (muted, for depth)
        '<g fill="none" stroke-linecap="round" opacity="0.62">' +
          '<path d="M 120 108 Q 104 72 82 40" stroke="#5a7d2b" stroke-width="1.3"/>' +
          '<g stroke="#7aa55b" stroke-width="0.75">' +
            '<line x1="107" y1="86" x2="98"  y2="82"/>' +
            '<line x1="107" y1="86" x2="112" y2="78"/>' +
            '<line x1="95"  y1="68" x2="84"  y2="63"/>' +
            '<line x1="95"  y1="68" x2="100" y2="60"/>' +
            '<line x1="86"  y1="51" x2="74"  y2="46"/>' +
            '<line x1="86"  y1="51" x2="92"  y2="42"/>' +
          '</g>' +
          '<path d="M 120 108 Q 137 70 159 40" stroke="#5a7d2b" stroke-width="1.3"/>' +
          '<g stroke="#7aa55b" stroke-width="0.75">' +
            '<line x1="133" y1="86" x2="142" y2="82"/>' +
            '<line x1="133" y1="86" x2="128" y2="78"/>' +
            '<line x1="146" y1="68" x2="157" y2="62"/>' +
            '<line x1="146" y1="68" x2="141" y2="59"/>' +
            '<line x1="155" y1="50" x2="167" y2="44"/>' +
            '<line x1="155" y1="50" x2="149" y2="41"/>' +
          '</g>' +
        '</g>' +
        // 5 main fern leaves (slightly asymmetric)
        // LEFT-FAR
        '<g fill="none" stroke-linecap="round">' +
          '<path d="M 120 108 Q 96 78 62 32" stroke="#7aa55b" stroke-width="1.7"/>' +
          '<g stroke="#9ece6a" stroke-width="0.95">' +
            '<line x1="112" y1="96" x2="103" y2="91"/>' +
            '<line x1="112" y1="96" x2="116" y2="88"/>' +
            '<line x1="100" y1="82" x2="89"  y2="76"/>' +
            '<line x1="100" y1="82" x2="106" y2="73"/>' +
            '<line x1="88"  y1="66" x2="73"  y2="59"/>' +
            '<line x1="88"  y1="66" x2="94"  y2="55"/>' +
            '<line x1="76"  y1="52" x2="59"  y2="46"/>' +
            '<line x1="76"  y1="52" x2="82"  y2="42"/>' +
            '<line x1="66"  y1="39" x2="52"  y2="36"/>' +
            '<line x1="66"  y1="39" x2="72"  y2="30"/>' +
          '</g>' +
        '</g>' +
        // LEFT-MID
        '<g fill="none" stroke-linecap="round">' +
          '<path d="M 120 108 Q 109 66 99 18" stroke="#7aa55b" stroke-width="1.7"/>' +
          '<g stroke="#9ece6a" stroke-width="0.95">' +
            '<line x1="116" y1="94" x2="107" y2="89"/>' +
            '<line x1="116" y1="94" x2="121" y2="86"/>' +
            '<line x1="112" y1="74" x2="99"  y2="69"/>' +
            '<line x1="112" y1="74" x2="118" y2="65"/>' +
            '<line x1="107" y1="55" x2="92"  y2="50"/>' +
            '<line x1="107" y1="55" x2="114" y2="46"/>' +
            '<line x1="103" y1="37" x2="88"  y2="33"/>' +
            '<line x1="103" y1="37" x2="109" y2="28"/>' +
            '<line x1="101" y1="24" x2="90"  y2="22"/>' +
            '<line x1="101" y1="24" x2="106" y2="17"/>' +
          '</g>' +
        '</g>' +
        // CENTER (subtle right lean, asymmetric fronds)
        '<g fill="none" stroke-linecap="round">' +
          '<path d="M 120 108 Q 121 60 124 10" stroke="#7aa55b" stroke-width="1.7"/>' +
          '<g stroke="#9ece6a" stroke-width="0.95">' +
            '<line x1="120" y1="94" x2="110" y2="89"/>' +
            '<line x1="120" y1="94" x2="131" y2="90"/>' +
            '<line x1="121" y1="74" x2="107" y2="69"/>' +
            '<line x1="121" y1="74" x2="134" y2="68"/>' +
            '<line x1="122" y1="54" x2="107" y2="49"/>' +
            '<line x1="122" y1="54" x2="135" y2="48"/>' +
            '<line x1="123" y1="33" x2="110" y2="30"/>' +
            '<line x1="123" y1="33" x2="136" y2="27"/>' +
            '<line x1="124" y1="18" x2="116" y2="15"/>' +
            '<line x1="124" y1="18" x2="133" y2="14"/>' +
          '</g>' +
        '</g>' +
        // RIGHT-MID
        '<g fill="none" stroke-linecap="round">' +
          '<path d="M 120 108 Q 132 65 143 20" stroke="#7aa55b" stroke-width="1.7"/>' +
          '<g stroke="#9ece6a" stroke-width="0.95">' +
            '<line x1="124" y1="94" x2="133" y2="89"/>' +
            '<line x1="124" y1="94" x2="119" y2="86"/>' +
            '<line x1="128" y1="74" x2="141" y2="69"/>' +
            '<line x1="128" y1="74" x2="122" y2="65"/>' +
            '<line x1="133" y1="55" x2="147" y2="50"/>' +
            '<line x1="133" y1="55" x2="126" y2="46"/>' +
            '<line x1="138" y1="37" x2="153" y2="33"/>' +
            '<line x1="138" y1="37" x2="131" y2="28"/>' +
            '<line x1="141" y1="24" x2="152" y2="22"/>' +
            '<line x1="141" y1="24" x2="135" y2="17"/>' +
          '</g>' +
        '</g>' +
        // RIGHT-FAR
        '<g fill="none" stroke-linecap="round">' +
          '<path d="M 120 108 Q 144 76 178 32" stroke="#7aa55b" stroke-width="1.7"/>' +
          '<g stroke="#9ece6a" stroke-width="0.95">' +
            '<line x1="128" y1="96" x2="137" y2="91"/>' +
            '<line x1="128" y1="96" x2="125" y2="88"/>' +
            '<line x1="140" y1="82" x2="151" y2="76"/>' +
            '<line x1="140" y1="82" x2="135" y2="73"/>' +
            '<line x1="152" y1="66" x2="167" y2="59"/>' +
            '<line x1="152" y1="66" x2="147" y2="55"/>' +
            '<line x1="164" y1="52" x2="181" y2="46"/>' +
            '<line x1="164" y1="52" x2="159" y2="42"/>' +
            '<line x1="174" y1="39" x2="188" y2="36"/>' +
            '<line x1="174" y1="39" x2="168" y2="30"/>' +
          '</g>' +
        '</g>' +
        // Carrot body — bigger, with rings + highlight + burgundy tip
        '<path d="M 113 108 Q 116 102 120 102 Q 124 102 127 108 L 124 130 Q 120 134 117 130 Z"' +
              ' fill="#ff9e64" stroke="#c8472c" stroke-width="0.8"/>' +
        '<path d="M 115 109 Q 117 116 117 128 Q 117 130 118 130 L 119 102 Z" fill="#ffb37e" opacity="0.55"/>' +
        '<path d="M 115 112 Q 120 114 125 112" fill="none" stroke="#c8472c" stroke-width="0.8" opacity="0.75"/>' +
        '<path d="M 116 120 Q 120 122 124 120" fill="none" stroke="#c8472c" stroke-width="0.7" opacity="0.7"/>' +
        '<path d="M 118 127 Q 120 128 122 127" fill="none" stroke="#c8472c" stroke-width="0.6" opacity="0.65"/>' +
        '<path d="M 118 128 L 120 134 L 122 128 Z" fill="#a13d2a" opacity="0.7"/>' +
        // Fine root threads
        '<g stroke="#a89d8a" stroke-width="0.5" stroke-linecap="round" opacity="0.85">' +
          '<line x1="120" y1="134" x2="118" y2="141"/>' +
          '<line x1="120" y1="134" x2="121" y2="143"/>' +
          '<line x1="120" y1="134" x2="123" y2="140"/>' +
          '<line x1="120" y1="134" x2="119" y2="139"/>' +
        '</g>' +
        // Dirt clinging
        '<circle cx="120" cy="135" r="0.9" fill="#3d3528" opacity="0.9"/>' +
        '<circle cx="118" cy="133" r="0.5" fill="#3d3528" opacity="0.7"/>' +
      '</g>' +
    '</svg>'
  );

  // Grand reveal: shown when the visitor reaches 7/7 for the first time
  // (or invokes the impatient cheat). The big SVG drives the joke; the
  // master line text underneath drives it home.
  function showCompletionOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'overlay overlay--carrot';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Carrot index complete');

    var card = document.createElement('div');
    card.className = 'overlay__card overlay__card--carrot';

    var close = document.createElement('button');
    close.className = 'overlay__close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';

    var scene = document.createElement('div');
    scene.className = 'achievement__scene';
    scene.innerHTML = COMPLETION_SVG;

    var quote = document.createElement('blockquote');
    quote.className = 'achievement__quote';
    quote.textContent = '"' + MASTER + '"';

    card.appendChild(close);
    card.appendChild(scene);
    card.appendChild(quote);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function dismiss() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onOutside);
    }
    function onKey(ev) { if (ev.key === 'Escape') dismiss(); }
    function onOutside(ev) {
      if (!ev.target.closest('.overlay__card')) dismiss();
    }
    close.addEventListener('click', dismiss);
    setTimeout(function () {
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onOutside);
    }, 0);
    close.focus();
  }

  // The "i'm impatient" cheat. Marks all 7 carrots as found, updates the
  // chrome counter, and shows the same grand-reveal overlay. The visitor
  // who chooses this gets exactly the lesson the carrot is teaching.
  window.__revealAllCarrots = function () {
    var allPages = Object.keys(QUOTES);
    save(allPages.slice());
    updateCounter(allPages.length);
    document.querySelectorAll('.carrot').forEach(function (c) {
      c.classList.add('found');
    });
    showCompletionOverlay();
    if (window.__trackCmd) window.__trackCmd('carrot.cheat', '');
  };

  function attach() {
    var foundOnLoad = load();
    if (foundOnLoad.length > 0) updateCounter(foundOnLoad.length);

    // Mark already-found carrots visually
    var carrots = document.querySelectorAll('.carrot');
    carrots.forEach(function (c) {
      var pid = c.getAttribute('data-carrot');
      if (foundOnLoad.indexOf(pid) !== -1) c.classList.add('found');
      c.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var wasAlreadyFound = load().indexOf(pid) !== -1;
        var found = record(pid);
        c.classList.add('found');
        updateCounter(found.length);

        if (!wasAlreadyFound && found.length >= TOTAL) {
          // First completion — grand reveal
          showCompletionOverlay();
          if (window.__trackCmd) window.__trackCmd('carrot.complete', '');
        } else {
          showTooltip(c, pid, found.length);
        }
        if (window.__trackCmd) window.__trackCmd('carrot.found', pid);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', attach);

  // ---- Smoke tests ----
  window.__carrotTests = function () {
    var results = [];
    function check(label, condition) {
      results.push((condition ? 'PASS' : 'FAIL') + ': ' + label);
    }
    check('QUOTES has 7 entries', Object.keys(QUOTES).length === 7);
    check('QUOTES.about has a source', QUOTES.about.s.length > 0);
    check('TOTAL is 7', TOTAL === 7);
    check('MASTER is set', MASTER.length > 0);
    check('load() returns array', Array.isArray(load()));
    console.table(results);
    return results;
  };
})();

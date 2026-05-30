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
        var found = record(pid);
        c.classList.add('found');
        updateCounter(found.length);
        showTooltip(c, pid, found.length);
        if (window.__trackCmd) window.__trackCmd('carrot.found', pid);
        if (found.length >= TOTAL && window.__trackCmd) {
          window.__trackCmd('carrot.complete', '');
        }
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

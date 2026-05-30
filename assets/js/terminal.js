// terminal.js — handles the typed-input field at the bottom of every page.
// Parses commands, routes to matching URLs, surfaces unknowns inline.
//
// Tested by opening any page and running through the cases in the
// __TESTS__ block in DevTools console (window.__terminalTests()).
(function () {
  'use strict';

  // Map of canonical command strings to target URLs.
  // Each key is what the user types; the value is where they land.
  var COMMANDS = {
    'cat about.md':        '/about/',
    'ls projects/':        '/projects/',
    'ls projects':         '/projects/',
    'git log experience':  '/experience/',
    'ssh oliver':          '/contact/',
    'man oschei':          '/colophon/',
    'history':             null, // virtual — scroll to nav
    'cd ~':                '/about/',
    'cd home':             '/about/',
    'about':               '/about/',
    'projects':            '/projects/',
    'experience':          '/experience/',
    'contact':             '/contact/',
    'colophon':            '/colophon/'
  };

  var HIDDEN = {
    '--panic':   handlePanic,
    '--carrots': handleCarrots,
    '--reveal':  handleReveal,
    '--soma':    handleSoma,
    'cd shire':  handleShire
  };

  function normalize(input) {
    return input.trim().toLowerCase();
  }

  function showFeedback(text, kind) {
    var f = document.getElementById('cmd-feedback');
    if (!f) return;
    f.textContent = text;
    f.className = 'feedback ' + (kind || '');
  }

  function clearFeedback() {
    var f = document.getElementById('cmd-feedback');
    if (f) { f.textContent = ''; f.className = 'feedback'; }
  }

  function execute(cmd) {
    var n = normalize(cmd);
    if (!n) return;

    if (COMMANDS.hasOwnProperty(n)) {
      var target = COMMANDS[n];
      if (target === null) {
        // history — scroll to the nav element if it exists
        var nav = document.querySelector('nav.history');
        if (nav) { nav.scrollIntoView({behavior: 'smooth', block: 'start'}); }
        return;
      }
      // Track event before navigation
      if (window.__trackCmd) window.__trackCmd('typed', n);
      window.location.href = target;
      return;
    }

    if (HIDDEN.hasOwnProperty(n)) {
      HIDDEN[n]();
      if (window.__trackCmd) window.__trackCmd('hidden_cmd', n);
      return;
    }

    showFeedback("command not found: " + n + ". try 'history'.", 'err');
  }

  function makeOverlay(titleText, bodyText, modClass) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay' + (modClass ? ' ' + modClass : '');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', titleText);

    var card = document.createElement('div');
    card.className = 'overlay__card';

    var close = document.createElement('button');
    close.className = 'overlay__close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';
    close.addEventListener('click', function () { overlay.remove(); });

    var title = document.createElement('div');
    title.className = 'overlay__title';
    title.textContent = titleText;

    var body = document.createElement('div');
    body.className = 'overlay__body';
    body.textContent = bodyText;

    card.appendChild(close);
    card.appendChild(title);
    card.appendChild(body);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function dismiss(ev) {
      if (ev.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', dismiss); }
    }
    document.addEventListener('keydown', dismiss);
    close.focus();
  }

  function handlePanic() {
    makeOverlay("DON'T PANIC.", 'You forgot your towel.');
  }

  function handleCarrots() {
    var found = [];
    try {
      var raw = localStorage.getItem('oschei.carrots.found');
      found = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(found)) found = [];
    } catch (e) { found = []; }
    var TOTAL = 7;
    var msg;
    if (found.length === 0) {
      msg = "0 of 7 found. They're hidden in plain sight on every page.";
    } else if (found.length >= TOTAL) {
      msg = "you can't pull a carrot up to check its progress.";
    } else {
      msg = found.length + " of " + TOTAL + " found. Pages with carrots: " +
            ['about','projects','project','experience','contact','colophon','404'].join(', ');
    }
    makeOverlay('🥕 ' + found.length + '/' + TOTAL, msg);
  }

  function handleSoma() {
    document.body.classList.add('overlay--soma');
    setTimeout(function () {
      document.body.classList.remove('overlay--soma');
    }, 3000);
  }

  function handleShire() {
    // Quick toast, then redirect. Defensively remove the toast first so
    // it can't persist if the redirect is delayed or blocked by anything
    // upstream (browser extensions, slow nav, etc.).
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = 'There and back again.';
    document.body.appendChild(t);
    setTimeout(function () {
      if (t && t.parentNode) t.parentNode.removeChild(t);
      window.location.assign('/about/');
    }, 1200);
  }

  function handleReveal() {
    // Calls into carrots.js — unlocks all 7 + shows the grand reveal.
    if (typeof window.__revealAllCarrots === 'function') {
      window.__revealAllCarrots();
    }
  }

  function attachInputHandler() {
    var input = document.getElementById('cmd-input');
    if (!input) return;
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        execute(input.value);
        // Don't clear if we showed an error — give user a chance to fix
        var feedback = document.getElementById('cmd-feedback');
        if (!feedback || !feedback.textContent) {
          input.value = '';
        }
      } else if (ev.key === 'Escape') {
        input.value = '';
        clearFeedback();
        input.blur();
      }
    });
    input.addEventListener('input', clearFeedback);
  }

  // Block cursor — position a fake █ at the input's caret. The real caret
  // is hidden via CSS (caret-color: transparent).
  //
  // Perf: JetBrains Mono is a monospace font, so per-char width is
  // constant. We sample one character once (and on resize / font swap)
  // to get charWidth, then position is pure arithmetic — no layout reads
  // per keystroke, no forced reflow.
  function attachBlockCursor() {
    var input   = document.getElementById('cmd-input');
    var cursor  = document.getElementById('cmd-cursor');
    var measure = document.getElementById('cmd-measure');
    if (!input || !cursor || !measure) return;

    var charWidth = 0;

    function syncFont() {
      // Copy the input's actually-computed font properties onto the
      // measure span so a sampled char measures at exactly the same
      // width the input is rendering at.
      var s = window.getComputedStyle(input);
      measure.style.fontFamily    = s.fontFamily;
      measure.style.fontSize      = s.fontSize;
      measure.style.fontWeight    = s.fontWeight;
      measure.style.fontStyle     = s.fontStyle;
      measure.style.letterSpacing = s.letterSpacing;
      measure.style.padding       = '0';
      measure.style.border        = '0';
      measure.style.boxSizing     = 'content-box';
      // Sample one ASCII char. JetBrains Mono is monospace, so this is
      // the width every typed character will take.
      measure.textContent = 'M';
      charWidth = measure.offsetWidth || 0;
    }

    function position() {
      var pos = (typeof input.selectionStart === 'number')
        ? input.selectionStart
        : input.value.length;
      // input.offsetLeft is the X within its positioning parent (the
      // field wrapper, position: relative). Pure math from here on —
      // no layout reads, no reflow.
      cursor.style.left = (input.offsetLeft + pos * charWidth) + 'px';
    }

    syncFont();
    position();

    ['input', 'focus', 'click', 'keyup', 'select'].forEach(function (ev) {
      input.addEventListener(ev, position);
    });
    window.addEventListener('resize', function () {
      syncFont();
      position();
    });
    // Re-sample after web fonts load — switching from system fallback
    // to JetBrains Mono changes the per-char width.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        syncFont();
        position();
      });
    }
  }

  function attachGlobalShortcuts() {
    document.addEventListener('keydown', function (ev) {
      // `/` or Cmd-K / Ctrl-K → focus the input from anywhere
      var input = document.getElementById('cmd-input');
      if (!input) return;
      var inField = (document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
         document.activeElement.tagName === 'TEXTAREA'));
      if (inField) return;

      if (ev.key === '/') {
        ev.preventDefault();
        input.focus();
      } else if ((ev.metaKey || ev.ctrlKey) && ev.key === 'k') {
        ev.preventDefault();
        input.focus();
      }
    });
  }

  // Expose the command executor so inline-cmd elements with `data-cmd`
  // can trigger it via clicks. Same code path as typed commands.
  window.__exec = execute;

  function attachInlineCmdClicks() {
    document.addEventListener('click', function (ev) {
      var trigger = ev.target.closest('[data-cmd]');
      if (!trigger) return;
      // Honor modifier-clicks for link-style triggers — let users open
      // navigable commands in a new tab as expected.
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      if (ev.button !== 0) return;
      ev.preventDefault();
      execute(trigger.getAttribute('data-cmd'));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    attachInputHandler();
    attachGlobalShortcuts();
    attachBlockCursor();
    attachInlineCmdClicks();
  });

  // ---- Smoke test runner — call window.__terminalTests() in DevTools ----
  window.__terminalTests = function () {
    var results = [];
    function check(label, condition) {
      results.push((condition ? 'PASS' : 'FAIL') + ': ' + label);
    }

    check('normalize trims and lowercases',
      normalize('  CAT About.md ') === 'cat about.md');
    check('COMMANDS has cat about.md',
      COMMANDS['cat about.md'] === '/about/');
    check('COMMANDS has ssh oliver',
      COMMANDS['ssh oliver'] === '/contact/');
    check('COMMANDS handles cd home alias',
      COMMANDS['cd home'] === '/about/');
    check('HIDDEN includes --panic',
      HIDDEN.hasOwnProperty('--panic'));

    console.table(results);
    return results;
  };
})();

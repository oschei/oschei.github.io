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

  // Hidden commands are wired in Phase 6 — placeholder here so they don't
  // error out as "command not found":
  var HIDDEN = [
    '--panic', '--carrots', '--soma', 'cd shire'
  ];

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

    if (HIDDEN.indexOf(n) !== -1) {
      // Hidden commands wired in Phase 6 — placeholder for now
      showFeedback("(hidden command — not wired yet)", 'err');
      return;
    }

    showFeedback("command not found: " + n + ". try 'history'.", 'err');
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

  document.addEventListener('DOMContentLoaded', function () {
    attachInputHandler();
    attachGlobalShortcuts();
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
      HIDDEN.indexOf('--panic') !== -1);

    console.table(results);
    return results;
  };
})();

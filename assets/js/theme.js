// theme.js — light/dark toggle wiring.
// Reads localStorage on load (handled by inline script in <head> to prevent FOUC).
// This file handles the user-toggle behavior and announces changes.
(function () {
  'use strict';

  var KEY = 'oschei.theme';

  function currentTheme() {
    // <html data-theme> is hardcoded in the layout (default "dark") and
    // the inline FOUC script in default.html only ever sets it to
    // "dark" or "light" — never removes it. So the attribute is always
    // present and well-formed.
    return document.documentElement.getAttribute('data-theme');
  }

  function setTheme(next) {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
    syncButton();
    if (window.__trackCmd) window.__trackCmd('theme.toggle', next);
  }

  function syncButton() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var t = currentTheme();
    btn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label',
      t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    btn.textContent = t === 'light' ? '☾' : '☀';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      setTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });
    syncButton();
  });
})();

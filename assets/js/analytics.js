// analytics.js — tiny wrapper around goatcounter.count() for custom events.
// Exposes window.__trackCmd(event, label) used by terminal.js, carrots.js,
// and outbound link clicks.
(function () {
  'use strict';

  function gc() {
    return (window.goatcounter && typeof window.goatcounter.count === 'function')
      ? window.goatcounter.count
      : null;
  }

  window.__trackCmd = function (event, label) {
    var fn = gc();
    if (!fn) return; // no analytics loaded
    fn({
      path:  '/' + event + (label ? '/' + label : ''),
      title: event + (label ? ' · ' + label : ''),
      event: true
    });
  };

  // Outbound link tracking — any <a> whose hostname differs from window's
  function isOutbound(a) {
    if (!a.href) return false;
    try {
      var u = new URL(a.href);
      return u.hostname && u.hostname !== window.location.hostname;
    } catch (e) { return false; }
  }
  function hostKey(a) {
    try {
      var u = new URL(a.href);
      var h = u.hostname.replace(/^www\./, '');
      if (h.indexOf('linkedin') !== -1) return 'linkedin';
      if (h.indexOf('github') !== -1)   return 'github';
      if (h.indexOf('strava') !== -1)   return 'strava';
      if (h.indexOf('goodreads') !== -1)return 'goodreads';
      if (h.indexOf('calendly') !== -1) return 'calendly';
      return h;
    } catch (e) { return 'unknown'; }
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('a');
    if (!a) return;
    if (!isOutbound(a)) return;
    window.__trackCmd('outbound', hostKey(a));
  });

  // Track history-link clicks vs typed commands
  document.addEventListener('click', function (ev) {
    var row = ev.target.closest('a.history__row');
    if (!row) return;
    var ariaLabel = row.getAttribute('aria-label') || '';
    var cmd = ariaLabel.split('—')[0].trim();
    if (cmd) window.__trackCmd('cmd.clicked', cmd);
  });
})();

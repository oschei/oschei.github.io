(function () {
  var input = document.getElementById('theme-toggle-input');
  if (!input) return;

  function currentlyDark() {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function syncInput() {
    input.checked = currentlyDark();
  }

  input.addEventListener('change', function () {
    var next = input.checked ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (!localStorage.getItem('theme')) syncInput();
  });

  syncInput();
})();

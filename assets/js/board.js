/* Sample pages: filter table rows by status group, and copy reply templates.
   Counts are written into the page; this only shows and hides rows. */
(function () {
  'use strict';

  // Copy buttons: <button data-copy="id"> copies the text of #id
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var src = document.getElementById(btn.getAttribute('data-copy'));
      if (!src || !navigator.clipboard) return;
      navigator.clipboard.writeText(src.textContent.trim()).then(function () {
        var label = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = label; }, 1500);
      }).catch(function () {});
    });
  });

  var table = document.querySelector('[data-board]');
  if (!table) return;

  var rows = Array.prototype.slice.call(table.tBodies[0].rows);
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var statusText = document.getElementById('table-status');
  var noun = table.getAttribute('data-noun') || 'rows';

  function apply(filter) {
    var shown = 0;
    rows.forEach(function (row) {
      var visible = filter === 'all' || row.getAttribute('data-group') === filter;
      row.hidden = !visible;
      if (visible) shown += 1;
    });
    var phrase = '';
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-filter') === filter;
      b.setAttribute('aria-pressed', String(on));
      if (on) phrase = b.getAttribute('data-label') || '';
    });
    if (statusText) {
      statusText.textContent = filter === 'all'
        ? 'Showing all ' + shown + ' ' + noun
        : 'Showing ' + shown + ' ' + noun + ' ' + phrase;
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
  });
  apply(table.getAttribute('data-default') || 'all');
})();

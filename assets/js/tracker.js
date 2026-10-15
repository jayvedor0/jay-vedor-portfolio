/* Client & Billing Operations Tracker
   Recomputes every figure from the row data with the spreadsheet's own formula
   (Amount needed = MAX(Required - Trust + Outstanding + WIP, 0)), then filters by status. */
(function () {
  'use strict';
  var table = document.querySelector('[data-accounts]');
  if (!table) return;

  var rows = Array.prototype.slice.call(table.tBodies[0].rows);
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var statusText = document.getElementById('table-status');
  var money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  var labels = { 'Action Needed': 'that need action', 'Attention': 'that need attention', 'Good': 'in good standing' };

  var data = rows.map(function (row) {
    var d = row.dataset;
    var needed = Math.max(Number(d.required) - Number(d.trust) + Number(d.outstanding) + Number(d.wip), 0);
    var cell = row.querySelector('[data-needed]');
    if (cell && cell.textContent.trim() !== money.format(needed)) {
      console.warn('Tracker: amount mismatch for', row.querySelector('.client').textContent);
    }
    if (cell) cell.textContent = money.format(needed);
    return { row: row, status: d.status, needed: needed };
  });

  function setKpi(name, value) {
    var el = document.querySelector('[data-kpi="' + name + '"]');
    if (el) el.textContent = value;
  }
  setKpi('clients', String(data.length));
  setKpi('action', String(data.filter(function (x) { return x.status === 'Action Needed'; }).length));
  setKpi('needed', money.format(data.reduce(function (sum, x) { return sum + x.needed; }, 0)));

  function apply(filter) {
    var shown = 0;
    data.forEach(function (x) {
      var visible = filter === 'all' || x.status === filter;
      x.row.hidden = !visible;
      if (visible) shown += 1;
    });
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
    });
    if (statusText) {
      statusText.textContent = filter === 'all'
        ? 'Showing all ' + shown + ' accounts'
        : 'Showing ' + shown + ' accounts ' + labels[filter];
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.filter); });
  });
  apply('Action Needed');
})();

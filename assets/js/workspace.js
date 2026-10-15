/* Executive Operations Workspace: priorities can be ticked off; progress updates. */
(function () {
  'use strict';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-task]'));
  var out = document.getElementById('progress');
  if (!boxes.length || !out) return;
  function update() {
    var done = boxes.filter(function (b) { return b.checked; }).length;
    out.textContent = done === boxes.length
      ? 'All ' + boxes.length + ' priorities done. Time for the end-of-day handoff.'
      : done + ' of ' + boxes.length + ' priorities done';
  }
  boxes.forEach(function (b) { b.addEventListener('change', update); });
  update();
})();

const $ = (id) => document.getElementById(id);
let tone = 'Professional';
let messageFormat = 'text';
let lastResult = null;

function value(id) { return Math.max(0, Number($(id)?.value) || 0); }
function clientName() { return ($('clientName')?.value || '').trim(); }
function formatUsd(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
}
function calculateReplenishment({ currentTrust=0, requiredTrust=0, workInProgress=0, outstanding=0, includeWip=false, includeOutstanding=false, additionalRequirement=0 } = {}) {
  const current = Math.max(0, Number(currentTrust) || 0);
  const required = Math.max(0, Number(requiredTrust) || 0);
  const wip = Math.max(0, Number(workInProgress) || 0);
  const owed = Math.max(0, Number(outstanding) || 0);
  const additional = Math.max(0, Number(additionalRequirement) || 0);
  const trustShortfall = Math.max(required - current, 0);
  const includedWip = includeWip ? wip : 0;
  const includedOutstanding = includeOutstanding ? owed : 0;
  const recommended = trustShortfall + includedWip + includedOutstanding + additional;
  return { current, required, wip, outstanding: owed, additional, trustShortfall, includedWip, includedOutstanding, recommended };
}
function getInputs() {
  return {
    currentTrust: value('currentTrust'), requiredTrust: value('requiredTrust'), workInProgress: value('wip'), outstanding: value('outstanding'),
    includeWip: $('includeWip').checked, includeOutstanding: $('includeOutstanding').checked,
    additionalRequirement: $('includeAdditional').checked ? value('additional') : 0,
  };
}
function greeting() {
  const hour = new Date().getHours();
  const salutation = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${salutation}, ${clientName() || '[Client Name]'}!`;
}
function paymentSentence(amount) {
  const link = ($('paymentLink')?.value || '').trim();
  if (!link) return `Please make payment of ${amount}.`;
  return `Please make payment of ${amount} using this link:\n${link}`;
}
function buildTextMessage({ event, result }) {
  const { current, required, trustShortfall, includedWip, includedOutstanding, additional, recommended } = result;
  const name = clientName() || '[Client Name]';
  const greetingLine = `${greeting()} This is Jay.`;
  let body;
  if (event !== 'No upcoming event' && required > 0) {
    const available = Math.max(current - includedWip, 0);
    if (includedWip > 0) {
      body = `I’m reaching out to follow up regarding your trust account. At the moment, you have ${formatUsd(current)} remaining in your trust account, with a work in progress balance of ${formatUsd(includedWip)}, leaving an available trust balance of ${formatUsd(available)}. This is below the required amount for your upcoming ${event.toLowerCase()}.`;
    } else {
      body = `I’m reaching out to follow up regarding your trust account. At the moment, you have ${formatUsd(current)} remaining in your trust account, which is below the required amount for your upcoming ${event.toLowerCase()}.`;
    }
    body += `\n\nTo restore your trust balance to the required ${formatUsd(required)}, we kindly ask that you replenish your trust account. This amount will serve as your ${event.toLowerCase()} deposit, allowing our legal team to continue working on your case with sufficient funds in place and helping ensure that your ${event.toLowerCase()} process proceeds without interruption.`;
  } else if (includedWip > 0) {
    const available = Math.max(current - includedWip, 0);
    body = `I’m reaching out to follow up regarding your trust account. At the moment, you have ${formatUsd(current)} remaining in your trust account, with a work in progress balance of ${formatUsd(includedWip)}, leaving an available trust balance of ${formatUsd(available)} for the legal team to work on.`;
    body += `\n\nTo maintain sufficient funds for the remaining work on your case, we kindly ask that you replenish your trust account.`;
  } else {
    body = `I’m reaching out to follow up regarding your trust account. At the moment, you have ${formatUsd(current)} remaining in your trust account.`;
    body += `\n\nWe kindly ask that you replenish your trust account by ${formatUsd(recommended)} to maintain sufficient funds for the legal team to continue working on your case.`;
  }
  if (includedOutstanding > 0) body += `\n\nThere is also an outstanding balance of ${formatUsd(includedOutstanding)} that is included in the requested amount.`;
  if (additional > 0) body += `\n\nThe legal team requires an additional replenishment of ${formatUsd(additional)}, as there are still documents that need to be drafted and filed.`;
  body += `\n\n${paymentSentence(formatUsd(recommended))}`;
  return `${greetingLine}\n\n${body}`;
}
function buildEmailMessage({ event, result }) {
  const { current, required, trustShortfall, includedWip, includedOutstanding, additional, recommended } = result;
  const link = ($('paymentLink')?.value || '').trim();
  let body = `At the moment, your trust balance is ${formatUsd(current)}`;
  if (includedWip > 0) body += `, with a work-in-progress balance of ${formatUsd(includedWip)}. Once those fees are billed, your trust balance will be reduced to approximately ${formatUsd(Math.max(current - includedWip, 0))}`;
  body += `, which is insufficient to cover the remaining costs of your case`;
  if (event !== 'No upcoming event') body += ` and your upcoming ${event.toLowerCase()}`;
  body += `.`;
  if (event !== 'No upcoming event' && required > 0) {
    body += `\n\nDue to your upcoming ${event.toLowerCase()}, our office requires that your trust account be replenished to a total balance of ${formatUsd(required)}. This amount will serve as your trust and ${event.toLowerCase()} deposit, allowing our legal team to prepare for and proceed with the ${event.toLowerCase()} smoothly.`;
  } else if (additional > 0) {
    body += `\n\nThe legal team requires an additional replenishment of ${formatUsd(additional)}, as there are still documents that need to be drafted and filed.`;
  } else {
    body += `\n\nTo maintain sufficient funds for the legal team to continue working on your case, we kindly ask that you replenish your trust account by ${formatUsd(recommended)}.`;
  }
  if (includedOutstanding > 0) body += `\n\nThere is also an outstanding balance of ${formatUsd(includedOutstanding)} included in the requested amount.`;
  body += `\n\nPlease make a payment of ${formatUsd(recommended)} in this invoice`;
  if (link) body += ` at this link:\n${link}`;
  body += `.`;
  return body;
}
function buildClientMessage({ event='No upcoming event', result }) {
  if (messageFormat === 'email') return buildEmailMessage({ event, result });
  if (tone === 'Professional') return buildTextMessage({ event, result });
  const { current, required, recommended } = result;
  const eventName = event !== 'No upcoming event' ? event.toLowerCase() : '';
  const greet = greeting();
  if (tone === 'Friendly') return `${greet} This is Jay! Just following up on your trust account. You currently have ${formatUsd(current)} remaining${eventName ? `, and your upcoming ${eventName} requires ${formatUsd(required)}` : ''}. We kindly ask that you replenish your trust account by ${formatUsd(recommended)}.\n\n${paymentSentence(formatUsd(recommended))}`;
  if (tone === 'Direct') return `${greet} This is Jay. Your current trust balance is ${formatUsd(current)}${eventName ? `, which is below the required amount for your upcoming ${eventName}` : ''}. Please replenish your trust account by ${formatUsd(recommended)}.\n\n${paymentSentence(formatUsd(recommended))}`;
  return `${greet} This is Jay. Your current trust balance is ${formatUsd(current)}${eventName ? `, which is below the required amount for your upcoming ${eventName}` : ''}. To avoid delays, please replenish your trust account by ${formatUsd(recommended)}.\n\n${paymentSentence(formatUsd(recommended))}`;
}
function updateMessage() {
  if (!lastResult) return;
  $('message').value = buildClientMessage({ event: $('event').value, result: lastResult });
}
function updateWarning() {
  const warning = $('warning'), required = value('requiredTrust'), current = value('currentTrust'), wip = value('wip'), outstanding = value('outstanding'), selected = $('includeWip').checked || $('includeOutstanding').checked;
  if (required === 0 && (wip > 0 || outstanding > 0) && selected) { warning.hidden = false; warning.textContent = 'Review the calculation: no target trust amount is set, so only the selected WIP/outstanding amounts are being requested.'; }
  else if (current > required && required > 0 && selected) { warning.hidden = false; warning.textContent = 'Current trust already exceeds the required trust amount. Included WIP/outstanding amounts are being added separately.'; }
  else { warning.hidden = true; }
}
function calculate() {
  lastResult = calculateReplenishment(getInputs());
  $('recommended').textContent = formatUsd(lastResult.recommended);
  const rows = [['Current Trust',lastResult.current],['Required Trust',lastResult.required],['Trust Shortfall',lastResult.trustShortfall],['Work in Progress',lastResult.includedWip],['Outstanding Balance',lastResult.includedOutstanding],['Additional Requirement',lastResult.additional]];
  $('breakdown').innerHTML = rows.map(([label, amount]) => `<div><span>${label}</span><b>${formatUsd(amount)}</b></div>`).join('');
  const pieces = [`${formatUsd(lastResult.required)} − ${formatUsd(lastResult.current)} = ${formatUsd(lastResult.trustShortfall)}`];
  if (lastResult.includedWip) pieces.push(`+ ${formatUsd(lastResult.includedWip)} WIP`); if (lastResult.includedOutstanding) pieces.push(`+ ${formatUsd(lastResult.includedOutstanding)} outstanding`); if (lastResult.additional) pieces.push(`+ ${formatUsd(lastResult.additional)} additional`);
  $('formula').textContent = `${pieces.join(' ')} = ${formatUsd(lastResult.recommended)}`; updateMessage(); updateWarning();
}
function setScenario(scenario) {
  document.querySelectorAll('.scenario').forEach((button) => button.classList.toggle('active', button.dataset.scenario === scenario));
  if (scenario === 'general') { $('event').value = 'No upcoming event'; $('requiredTrust').value = ''; }
  if (scenario === 'mediation') { $('event').value = 'Mediation'; $('requiredTrust').value = ''; }
  if (scenario === 'trial') { $('event').value = 'Trial'; $('requiredTrust').value = ''; }
  if (scenario === 'documents') { $('event').value = 'Final Documents'; $('requiredTrust').value = ''; $('includeAdditional').checked = true; $('additional').value = '1000.00'; }
  calculate();
}
function reset() {
  ['clientName','currentTrust','wip','outstanding','requiredTrust','paymentLink'].forEach((id) => $(id).value = '');
  $('event').value = 'No upcoming event'; $('includeWip').checked = false; $('includeOutstanding').checked = false; $('includeAdditional').checked = false; $('additional').value = '1000.00';
  document.querySelectorAll('.scenario').forEach((button) => button.classList.toggle('active', button.dataset.scenario === 'general')); calculate();
}
async function copyText(text, label) {
  try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text); else { const area=document.createElement('textarea'); area.value=text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); } $('copyStatus').textContent=`${label} copied.`; setTimeout(()=>$('copyStatus').textContent='',1800); }
  catch { $('copyStatus').textContent='Copy unavailable — select and copy manually.'; }
}
function init() {
  $('calculateBtn').addEventListener('click', calculate); $('resetBtn').addEventListener('click', reset);
  document.querySelectorAll('.scenario').forEach((button)=>button.addEventListener('click',()=>setScenario(button.dataset.scenario)));
  document.querySelectorAll('.tone').forEach((button)=>button.addEventListener('click',()=>{tone=button.dataset.tone;document.querySelectorAll('.tone').forEach((b)=>b.classList.toggle('active',b===button));updateMessage();}));
  document.querySelectorAll('.format').forEach((button)=>button.addEventListener('click',()=>{messageFormat=button.dataset.format;document.querySelectorAll('.format').forEach((b)=>b.classList.toggle('active',b===button));updateMessage();}));
  $('event').addEventListener('change',()=>{if($('event').value==='Final Documents'&&!$('requiredTrust').value)$('includeAdditional').checked=true;calculate();});
  ['clientName','currentTrust','wip','outstanding','requiredTrust','additional','paymentLink','includeWip','includeOutstanding','includeAdditional'].forEach((id)=>{$(id).addEventListener('input',calculate);$(id).addEventListener('change',calculate);});
  $('copyMessageBtn').addEventListener('click',()=>copyText($('message').value,'Message'));
  $('copyResultsBtn').addEventListener('click',()=>copyText([`Recommended Replenishment: ${formatUsd(lastResult.recommended)}`,`Current Trust: ${formatUsd(lastResult.current)}`,`Required Trust: ${formatUsd(lastResult.required)}`,`Trust Shortfall: ${formatUsd(lastResult.trustShortfall)}`,`Work in Progress: ${formatUsd(lastResult.includedWip)}`,`Outstanding Balance: ${formatUsd(lastResult.includedOutstanding)}`,`Additional Requirement: ${formatUsd(lastResult.additional)}`].join('\n'),'Results'));
  calculate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

/* --- Accessibility layer (added in the redesign; calculation logic above is unchanged) ---
   Mirrors each toggle's visual .active state into aria-pressed so screen readers
   announce which scenario, format, and tone are selected. */
(function () {
  function syncPressed() {
    document.querySelectorAll('.scenario, .tone, .format').forEach(function (b) {
      b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
    });
  }
  document.addEventListener('click', syncPressed);
  document.addEventListener('change', syncPressed);
  syncPressed();
})();

// Research-use gate (home page only)
const gate = document.getElementById('gate');
if (gate) {
  const KEY = 'sbh-research-ack';
  let ok = false;
  try { ok = localStorage.getItem(KEY) === 'yes'; } catch (e) {}
  if (!ok) {
    gate.hidden = false;
    document.getElementById('main')?.setAttribute('inert', '');
    const check = document.getElementById('gateCheck');
    const enter = document.getElementById('gateEnter');
    check.addEventListener('change', () => { enter.disabled = !check.checked; });
    enter.addEventListener('click', () => {
      if (!check.checked) return;
      try { localStorage.setItem(KEY, 'yes'); } catch (e) {}
      gate.hidden = true;
      document.getElementById('main')?.removeAttribute('inert');
    });
  }
}

// Service worker: auto-update to the newest version
if ('serviceWorker' in navigator) {
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return; reloading = true; window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(r => r.update()).catch(() => {});
  });
}

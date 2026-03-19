/**
 * loader.js
 * Animated percentage-fill loader shown before page content.
 * Hides itself once 100% is reached.
 */

export function initLoader() {
  const fill = document.getElementById('loader-fill');
  const txt  = document.getElementById('loader-text');
  const loader = document.getElementById('loader');
  if (!fill || !txt || !loader) return;
  const msgs = [
    'Initializing…',
    'Loading assets…',
    'Building 3D scene…',
    'Almost there…',
    'Ready.',
  ];

  let pct    = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct > 100) pct = 100;

    fill.style.width    = pct + '%';
    txt.textContent     = msgs[Math.min(msgIdx++, msgs.length - 1)];

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 400);
    }
  }, 220);
}

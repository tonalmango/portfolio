/**
 * cursor.js
 * Custom 3-layer cursor: dot · lagging ring · soft glow
 * Scales on hover over interactive elements
 */

export function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');
  if (!dot || !ring || !glow || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0;
  let rx = window.innerWidth / 2, ry = window.innerHeight / 2;

  // Dot follows immediately
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });

  // Ring lerps behind the cursor
  function animateRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Enlarge on interactive elements
  const interactives = 'a, button, .project-card, .cert-card, .skill-card, .contact-item';
  document.querySelectorAll(interactives).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });
}

/**
 * navbar.js
 * - Shrinks navbar on scroll
 * - Highlights the active nav link based on scroll position
 */

export function initNavbar() {
  const nav      = document.getElementById('navbar');
  if (!nav) return;
  const links    = nav.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky glass effect
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Active link tracking
    let current = 'home';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });

    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });
}

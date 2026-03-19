/**
 * scrollReveal.js
 * IntersectionObserver-based scroll reveal for all
 * animatable elements. Also animates proficiency bar fills.
 */

export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        // Animate proficiency bars when their parent becomes visible
        entry.target.querySelectorAll?.('.prof-fill').forEach((bar) => {
          bar.style.width = bar.dataset.width + '%';
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  // Elements to observe
  const targets = [
    '.section-label',
    '.section-title',
    '.about-img-wrap',
    '.about-text',
    '.skill-card',
    '.prof-item',
    '.project-card',
    '.cert-card',
    '.contact-info',
    '.contact-form',
    '.reveal',
  ].join(', ');

  document.querySelectorAll(targets).forEach((el) => observer.observe(el));

  // Staggered transition delays for grouped cards
  document.querySelectorAll('.project-card').forEach((c, i) => { c.style.transitionDelay = i * 0.12 + 's'; });
  document.querySelectorAll('.cert-card')   .forEach((c, i) => { c.style.transitionDelay = i * 0.10 + 's'; });
  document.querySelectorAll('.skill-card')  .forEach((c, i) => { c.style.transitionDelay = i * 0.08 + 's'; });
  document.querySelectorAll('.prof-item')   .forEach((c, i) => { c.style.transitionDelay = i * 0.10 + 's'; });
}

/**
 * Scroll-based parallax for the progress bar and orbs
 */
export function initScrollExtras() {
  const bar  = document.getElementById('progress-bar');
  const orb1 = document.getElementById('orb1');
  const orb2 = document.getElementById('orb2');
  const orb3 = document.getElementById('orb3');
  if (!bar || !orb1 || !orb2 || !orb3) return;

  // Progress bar
  window.addEventListener('scroll', () => {
    const scrolled = document.documentElement.scrollTop;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? scrolled / total : 0;
    bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  });

  // Parallax orbs on mouse move
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    orb1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
    orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
    orb3.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  });
}

/**
 * contactForm.js
 * Basic client-side validation and mailto handoff for the contact form.
 */

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const status = document.getElementById('contact-form-status');

  if (!form || !nameInput || !emailInput || !messageInput || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please complete all fields.';
      status.style.color = '#f7c948';
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#f7c948';
      return;
    }

    const subject = encodeURIComponent('Portfolio inquiry from ' + name);
    const body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      message
    );

    status.textContent = 'Opening your email client...';
    status.style.color = '#4f8ef7';

    window.location.href = 'mailto:tonalmango@gmail.com?subject=' + subject + '&body=' + body;
  });
}

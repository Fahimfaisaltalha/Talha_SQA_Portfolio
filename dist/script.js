const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  mobileMenu.classList.toggle('open', !open);
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

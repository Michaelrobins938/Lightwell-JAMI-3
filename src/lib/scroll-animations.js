export function initScrollGlassReveals() {
  if (typeof window === 'undefined' || !window.IntersectionObserver) return;
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  const glassObserver = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);
  document.querySelectorAll('.scroll-glass-revealer')
    .forEach(el => glassObserver.observe(el));
}
// Usage: Call initScrollGlassReveals() on page/component mount 
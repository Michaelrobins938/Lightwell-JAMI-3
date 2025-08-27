// Focus main content for skip navigation
export function focusMainContent() {
  const main = document.getElementById('main-content');
  if (main) {
    main.setAttribute('tabindex', '-1');
    main.focus();
  }
}
// Usage: Add a skip link in your layout/header:
// <a href="#main-content" className="skip-link">Skip to main content</a>
// And set id="main-content" on your main content wrapper. 
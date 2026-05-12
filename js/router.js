// ============================================
// PALLETE — Client-Side Hash Router
// ============================================

const routes = new Map();
let currentCleanup = null;
let currentPath = null;

/**
 * Register a route
 * @param {string} path - Hash path, e.g. '/' or '/workspace'
 * @param {object} handler - { render: () => string, init?: () => void|Function }
 */
export function addRoute(path, handler) {
  routes.set(path, handler);
}

/**
 * Navigate to a route programmatically
 */
export function navigate(path) {
  window.location.hash = path === '/' ? '' : path;
}

/**
 * Get current route path
 */
export function getCurrentRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash;
}

/**
 * Initialize the router — call once after all routes are registered
 */
export function startRouter() {
  function handleRoute() {
    const path = getCurrentRoute();

    // Don't re-render same route
    if (path === currentPath) return;
    currentPath = path;

    const handler = routes.get(path) || routes.get('/');

    if (!handler) {
      console.error(`No route found for: ${path}`);
      return;
    }

    // Run cleanup from previous route
    if (typeof currentCleanup === 'function') {
      currentCleanup();
      currentCleanup = null;
    }

    const app = document.getElementById('app');
    if (!app) return;

    // Fade out
    app.style.opacity = '0';

    setTimeout(() => {
      // Render new view
      app.innerHTML = handler.render();

      // Scroll to top
      window.scrollTo(0, 0);

      // Fade in
      requestAnimationFrame(() => {
        app.style.opacity = '1';
      });

      // Initialize view logic
      if (handler.init) {
        const cleanup = handler.init();
        if (typeof cleanup === 'function') {
          currentCleanup = cleanup;
        }
      }
    }, 150);
  }

  window.addEventListener('hashchange', handleRoute);

  // Handle in-page anchor clicks (e.g., #features, #how-it-works)
  window.addEventListener('hashchange', (e) => {
    const hash = window.location.hash;
    // If it's an in-page anchor (not a route), scroll to it
    if (hash && !hash.startsWith('#/') && hash !== '#') {
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // Initial route
  handleRoute();
}

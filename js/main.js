// ============================================
// PALLETE — SPA Entry Point
// ============================================

import { addRoute, startRouter } from './router.js';
import { renderLanding, initLanding } from './views/landingView.js';
import { renderWorkspace, initWorkspace } from './views/workspaceView.js';

// Apply saved theme on load
const savedTheme = localStorage.getItem('pallete_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Register routes
addRoute('/', {
  render: renderLanding,
  init: initLanding,
});

addRoute('/workspace', {
  render: renderWorkspace,
  init: initWorkspace,
});

// Start the router
startRouter();

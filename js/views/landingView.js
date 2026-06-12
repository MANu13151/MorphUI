// ============================================
// MORPHUI — Landing View
// ============================================

import { navigate } from '../router.js';
import { showToast } from '../toast.js';

const LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff6b4a"/><stop offset="50%" stop-color="#f5a623"/><stop offset="100%" stop-color="#2dd4a8"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="url(#lg)"/><circle cx="11" cy="12" r="3.5" fill="#fff" opacity="0.9"/><circle cx="21" cy="12" r="3.5" fill="#fff" opacity="0.7"/><circle cx="16" cy="21" r="3.5" fill="#fff" opacity="0.5"/></svg>`;

export function renderLanding() {
  return `
  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <a href="#/" class="navbar-logo">
      ${LOGO_SVG}
      <span class="logo-gradient">MorphUI</span>
    </a>
    <div class="navbar-links">
      <a href="#features">Features</a>
      <a href="#how-it-works">How It Works</a>
      <a href="#plugin-setup">Plugin Setup</a>
      <a href="#demo">Try It</a>
    </div>
    <div class="navbar-actions">
      <button class="btn-icon tooltip" data-tooltip="Toggle Theme" id="theme-toggle-landing" aria-label="Toggle theme">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <a href="#/workspace" class="btn btn-primary btn-sm">Get Started</a>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-orb hero-orb-1"></div>
    <div class="hero-orb hero-orb-2"></div>
    <div class="hero-orb hero-orb-3"></div>

    <div class="hero-badge">
      <span class="dot"></span>
      AI-Powered Color Design Tool
    </div>

    <h1>
      Transform Your Design<br>
      Colors <span class="gradient-text">Instantly</span>
    </h1>

    <p class="hero-subtitle">
      Paste a Figma link and your access token — we parse your design
      and let you remix every color in real time.
    </p>

    <!-- Stacked Input Form -->
    <div class="hero-form" id="hero-form">
      <div class="hero-form-card">
        <div class="hero-form-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <input type="text" id="figma-link-input" placeholder="Paste your Figma frame URL..." aria-label="Figma link input">
        </div>
        <div class="hero-form-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input type="password" id="figma-token-input" placeholder="Figma Personal Access Token..." aria-label="Figma token input">
          <button class="btn btn-primary" id="figma-go-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            Go
          </button>
        </div>
      </div>

      <div class="hero-form-helpers">
        <button type="button" id="token-help-toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          How do I get a token?
        </button>
        <span class="helper-separator"></span>
        <a href="#" id="explore-without-figma">
          Explore Without Figma →
        </a>
      </div>

      <div class="token-help" id="token-help">
        <div class="token-help-content">
          <h4>Get Your Figma Token (30 seconds)</h4>
          <ol>
            <li>Open <a href="https://www.figma.com/settings" target="_blank" rel="noopener">Figma Settings</a></li>
            <li>Scroll to <strong>Personal Access Tokens</strong></li>
            <li>Click <strong>"Generate new token"</strong>, copy it, and paste above</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- First Visit Nudge (only for new users) -->
    <div class="first-visit-nudge" id="first-visit-nudge" style="display:none">
      <span class="first-visit-text">👋 First time here?</span>
      <button class="first-visit-btn" id="first-visit-btn">See how it works ↓</button>
      <button class="first-visit-close" id="first-visit-close" aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Hero Preview Mockup -->
    <div class="hero-preview" id="hero-preview">
      <div class="hero-preview-window">
        <div class="hero-preview-titlebar">
          <span class="hero-preview-dot" style="background:#ff5f57"></span>
          <span class="hero-preview-dot" style="background:#febc2e"></span>
          <span class="hero-preview-dot" style="background:#28c840"></span>
        </div>
        <div class="hero-preview-content" id="hero-mockup-content">
          <div class="hero-preview-sidebar">
            <div class="hero-preview-sidebar-item" style="width:70%;height:14px;background:var(--color-brand-primary);opacity:0.6"></div>
            <div class="hero-preview-sidebar-item" style="width:85%"></div>
            <div class="hero-preview-sidebar-item" style="width:60%"></div>
            <div class="hero-preview-sidebar-item" style="width:90%"></div>
            <div class="hero-preview-sidebar-item" style="width:50%"></div>
            <div style="flex:1"></div>
            <div class="hero-preview-sidebar-item" style="width:75%"></div>
          </div>
          <div class="hero-preview-main">
            <div class="hero-preview-card" id="hero-card-1" style="background: rgba(255,107,74,0.15)">
              <div class="card-line" style="width:60%"></div>
              <div class="card-line" style="width:40%;opacity:0.5"></div>
              <div class="card-line" style="width:80%;height:24px;margin-top:auto;background:var(--color-brand-primary);opacity:0.4;border-radius:6px"></div>
            </div>
            <div class="hero-preview-card" id="hero-card-2" style="background: rgba(245,166,35,0.15)">
              <div class="card-line" style="width:50%"></div>
              <div class="card-line" style="width:70%;opacity:0.5"></div>
              <div class="card-line" style="width:80%;height:24px;margin-top:auto;background:var(--color-brand-secondary);opacity:0.4;border-radius:6px"></div>
            </div>
            <div class="hero-preview-card" id="hero-card-3" style="background: rgba(45,212,168,0.15)">
              <div class="card-line" style="width:65%"></div>
              <div class="card-line" style="width:45%;opacity:0.5"></div>
              <div class="card-line" style="width:80%;height:24px;margin-top:auto;background:var(--color-brand-accent);opacity:0.4;border-radius:6px"></div>
            </div>
            <div class="hero-preview-chart" style="background: rgba(255,107,74,0.06)">
              <div style="display:flex;align-items:flex-end;gap:8px;height:100%">
                <div style="flex:1;background:var(--color-brand-primary);opacity:0.5;border-radius:4px 4px 0 0;height:60%"></div>
                <div style="flex:1;background:var(--color-brand-secondary);opacity:0.5;border-radius:4px 4px 0 0;height:80%"></div>
                <div style="flex:1;background:var(--color-brand-accent);opacity:0.5;border-radius:4px 4px 0 0;height:45%"></div>
                <div style="flex:1;background:var(--color-brand-primary);opacity:0.5;border-radius:4px 4px 0 0;height:90%"></div>
                <div style="flex:1;background:var(--color-brand-secondary);opacity:0.5;border-radius:4px 4px 0 0;height:55%"></div>
                <div style="flex:1;background:var(--color-brand-accent);opacity:0.5;border-radius:4px 4px 0 0;height:70%"></div>
                <div style="flex:1;background:var(--color-brand-primary);opacity:0.5;border-radius:4px 4px 0 0;height:85%"></div>
                <div style="flex:1;background:var(--color-brand-secondary);opacity:0.5;border-radius:4px 4px 0 0;height:40%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features-section" id="features">
    <div class="section-header">
      <span class="label">Features</span>
      <h2>Everything You Need to Perfect Your Palette</h2>
      <p>From AI-powered suggestions to WCAG accessibility scoring, we've got you covered.</p>
    </div>
    <div class="features-grid">
      <div class="card feature-card animate-in">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="16" r="2.5"/><circle cx="8" cy="16" r="2.5"/><path d="M13.5 9a5.5 5.5 0 0 1 5.1 3.5"/><path d="M8 13.5A5.5 5.5 0 0 1 13.5 9"/><path d="M10.4 16a5.5 5.5 0 0 1-.9-4.5"/></svg>
        </div>
        <h3>Real-Time Color Editing</h3>
        <p>Change any color in your palette and see the results instantly in the live preview. No waiting, no refreshing.</p>
      </div>
      <div class="card feature-card animate-in animate-in-delay-1">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 3.5-2 6-5 9-3-3-5-5.5-5-9a5 5 0 0 1 5-5z"/><circle cx="12" cy="7" r="1"/><path d="M7 19h10"/><path d="M9 22h6"/></svg>
        </div>
        <h3>AI Palette Generator</h3>
        <p>Generate stunning color palettes based on mood and brand personality. Choose from Minimal, Vibrant, Dark, Pastel, and more.</p>
      </div>
      <div class="card feature-card animate-in animate-in-delay-2">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <h3>Live UI Preview</h3>
        <p>See how your colors look on a real app interface. Toggle between mobile, tablet, and desktop viewports.</p>
      </div>
      <div class="card feature-card animate-in animate-in-delay-3">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h3>WCAG Accessibility</h3>
        <p>Automatic contrast scoring for every color pair. Get warnings when contrast is too low and smart suggestions to fix it.</p>
      </div>
      <div class="card feature-card animate-in animate-in-delay-4">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <h3>Export Anywhere</h3>
        <p>Export your palette as Tailwind CSS config, CSS custom properties, or JSON design tokens. Copy or download in one click.</p>
      </div>
      <div class="card feature-card animate-in animate-in-delay-5">
        <div class="feature-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
        </div>
        <h3>Undo / Redo</h3>
        <p>Full history support with undo and redo. Experiment freely and roll back any time — never lose your progress.</p>
      </div>
    </div>
  </section>

  <!-- How It Works Section — Dual Track -->
  <section class="how-section" id="how-it-works">
    <div class="section-header">
      <span class="label">How It Works</span>
      <h2>Two Ways to Use MorphUI</h2>
      <p>Whether you just want to explore palettes or retheme an entire Figma file — we've got you.</p>
    </div>
    <div class="tracks-container">
      <div class="track-card animate-in">
        <span class="track-badge track-badge-quick">⚡ No Setup Needed</span>
        <h3>Quick Exploration</h3>
        <ol class="track-steps">
          <li>Open MorphUI and head to the workspace</li>
          <li>Pick a mood & personality, generate AI palettes instantly</li>
          <li>Fine-tune any color with the built-in editor</li>
          <li>Export as Tailwind config, CSS variables, or JSON tokens</li>
        </ol>
      </div>
      <div class="track-card animate-in animate-in-delay-2">
        <span class="track-badge track-badge-full">🔗 Full Power</span>
        <h3>Figma Integration</h3>
        <ol class="track-steps">
          <li>Paste your Figma URL + Personal Access Token</li>
          <li>MorphUI fetches & renders a pixel-accurate live preview</li>
          <li>Edit colors or use AI suggestions — preview updates in real time</li>
          <li>Push the new palette back to Figma via the MorphUI Sync plugin</li>
        </ol>
      </div>
    </div>
  </section>

  <!-- Plugin Setup Guide -->
  <section class="plugin-section" id="plugin-setup">
    <div class="section-header">
      <span class="label">One-Time Setup</span>
      <h2>Install the Figma Plugin</h2>
      <p>Push your remixed palette directly back into your Figma file. Takes under 2 minutes.</p>
    </div>
    <div class="plugin-grid">
      <div class="plugin-step animate-in">
        <div class="plugin-step-number">1</div>
        <h4>Download Plugin Files</h4>
        <p>Grab the 3 files you need — manifest.json, code.js, and ui.html.</p>
        <a href="/morphui-figma-plugin.zip" download class="btn btn-primary btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download ZIP
        </a>
      </div>
      <div class="plugin-step animate-in animate-in-delay-1">
        <div class="plugin-step-number">2</div>
        <h4>Extract the ZIP</h4>
        <p>Unzip it anywhere on your computer. You'll see 3 files inside the folder.</p>
      </div>
      <div class="plugin-step animate-in animate-in-delay-2">
        <div class="plugin-step-number">3</div>
        <h4>Install Figma Desktop</h4>
        <p>Plugin development requires the <a href="https://www.figma.com/downloads/" target="_blank" rel="noopener">Figma Desktop app</a> (not the web version).</p>
      </div>
      <div class="plugin-step animate-in animate-in-delay-3">
        <div class="plugin-step-number">4</div>
        <h4>Import the Plugin</h4>
        <p>In Figma: <strong>Menu → Plugins → Development → Import plugin from manifest</strong></p>
      </div>
      <div class="plugin-step animate-in animate-in-delay-4">
        <div class="plugin-step-number">5</div>
        <h4>Select manifest.json</h4>
        <p>Navigate to the folder you extracted and pick the <strong>manifest.json</strong> file.</p>
      </div>
      <div class="plugin-step animate-in animate-in-delay-5">
        <div class="plugin-step-number">6</div>
        <h4>Done! 🎉</h4>
        <p>Find it under <strong>Plugins → Development → MorphUI Sync</strong>. Ready to push palettes.</p>
      </div>
    </div>
    <div class="plugin-note">
      <strong>One-time setup.</strong> Once imported, the plugin stays in your Figma app permanently — no need to repeat these steps.
    </div>
  </section>

  <!-- Interactive Demo Section -->
  <section class="demo-section" id="demo">
    <div class="section-header">
      <span class="label">Try It Now</span>
      <h2>See the Magic in Action</h2>
      <p>Click any color below to see how your palette changes the preview in real time.</p>
    </div>
    <div class="demo-container">
      <div class="demo-palette" id="demo-palette"></div>
      <div class="demo-preview-mini" id="demo-preview-mini"></div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <a href="#/" class="navbar-logo">
        <svg viewBox="0 0 32 32" width="24" height="24" fill="none"><defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff6b4a"/><stop offset="50%" stop-color="#f5a623"/><stop offset="100%" stop-color="#2dd4a8"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="url(#lg2)"/><circle cx="11" cy="12" r="3.5" fill="#fff" opacity="0.9"/><circle cx="21" cy="12" r="3.5" fill="#fff" opacity="0.7"/><circle cx="16" cy="21" r="3.5" fill="#fff" opacity="0.5"/></svg>
        <span class="logo-gradient">MorphUI</span>
      </a>
      <div class="footer-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="https://github.com/MANu13151/MorphUI" target="_blank" rel="noopener">GitHub</a>
      </div>
      <span class="footer-copy">&copy; 2026 MorphUI. Built with love.</span>
    </div>
  </footer>

  <!-- Feedback Widget -->
  <div class="feedback-overlay" id="feedback-overlay"></div>
  <div class="feedback-panel" id="feedback-panel">
    <div class="feedback-panel-header">
      <h3>💬 Send Feedback</h3>
      <button class="btn-icon" id="feedback-close" aria-label="Close feedback">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="feedback-panel-body">
      <div class="feedback-field">
        <label for="feedback-category">Category</label>
        <select id="feedback-category">
          <option value="Suggestion">💡 Suggestion</option>
          <option value="Bug Report">🐛 Bug Report</option>
          <option value="Question">❓ Question</option>
        </select>
      </div>
      <div class="feedback-field">
        <label for="feedback-email">Your Email (optional)</label>
        <input type="email" id="feedback-email" placeholder="you@example.com">
      </div>
      <div class="feedback-field">
        <label for="feedback-message">Your Message</label>
        <textarea id="feedback-message" placeholder="Tell us what's on your mind..."></textarea>
      </div>
    </div>
    <div class="feedback-panel-footer">
      <button class="btn btn-primary" id="feedback-submit">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Submit Feedback
      </button>
    </div>
  </div>
  <button class="feedback-fab" id="feedback-fab" aria-label="Send Feedback">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </button>
  `;
}

export function initLanding() {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle-landing');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('morphui_theme', next);
    });
  }

  // Figma link + token input -> navigate to workspace
  const figmaInput = document.getElementById('figma-link-input');
  const tokenInput = document.getElementById('figma-token-input');
  const figmaGoBtn = document.getElementById('figma-go-btn');

  if (figmaGoBtn && figmaInput && tokenInput) {
    figmaGoBtn.addEventListener('click', () => {
      const link = figmaInput.value.trim();
      const token = tokenInput.value.trim();
      if (link) sessionStorage.setItem('morphui_figma_link', link);
      if (token) sessionStorage.setItem('morphui_figma_token', token);
      navigate('/workspace');
    });

    figmaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tokenInput.focus();
    });

    tokenInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') figmaGoBtn.click();
    });
  }

  // Token help toggle
  const tokenHelpToggle = document.getElementById('token-help-toggle');
  const tokenHelp = document.getElementById('token-help');
  if (tokenHelpToggle && tokenHelp) {
    tokenHelpToggle.addEventListener('click', () => {
      tokenHelp.classList.toggle('open');
    });
  }

  // Explore without Figma
  const exploreLink = document.getElementById('explore-without-figma');
  if (exploreLink) {
    exploreLink.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.setItem('morphui_explore_mode', 'true');
      navigate('/workspace');
    });
  }

  // First-visit nudge — show only if user hasn't visited before
  const firstVisitNudge = document.getElementById('first-visit-nudge');
  if (firstVisitNudge && !localStorage.getItem('morphui_seen_intro')) {
    // Show with a slight delay so the page settles first
    setTimeout(() => {
      firstVisitNudge.style.display = 'flex';
      // Trigger animation
      requestAnimationFrame(() => firstVisitNudge.classList.add('visible'));
    }, 1500);

    const dismissNudge = () => {
      localStorage.setItem('morphui_seen_intro', 'true');
      firstVisitNudge.classList.remove('visible');
      setTimeout(() => { firstVisitNudge.style.display = 'none'; }, 300);
    };

    document.getElementById('first-visit-btn')?.addEventListener('click', () => {
      dismissNudge();
      const target = document.getElementById('how-it-works');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.getElementById('first-visit-close')?.addEventListener('click', dismissNudge);
  }

  // Feedback widget
  const feedbackFab = document.getElementById('feedback-fab');
  const feedbackPanel = document.getElementById('feedback-panel');
  const feedbackOverlay = document.getElementById('feedback-overlay');
  const feedbackClose = document.getElementById('feedback-close');
  const feedbackSubmit = document.getElementById('feedback-submit');

  function openFeedback() {
    feedbackPanel?.classList.add('open');
    feedbackOverlay?.classList.add('open');
  }

  function closeFeedback() {
    feedbackPanel?.classList.remove('open');
    feedbackOverlay?.classList.remove('open');
  }

  feedbackFab?.addEventListener('click', openFeedback);
  feedbackClose?.addEventListener('click', closeFeedback);
  feedbackOverlay?.addEventListener('click', closeFeedback);

  if (feedbackSubmit) {
    feedbackSubmit.addEventListener('click', async () => {
      const category = document.getElementById('feedback-category')?.value || 'Suggestion';
      const email = document.getElementById('feedback-email')?.value || '(not provided)';
      const message = document.getElementById('feedback-message')?.value || '';

      if (!message.trim()) {
        showToast('Please enter a message before submitting.');
        return;
      }

      // Show loading state
      const originalText = feedbackSubmit.innerHTML;
      feedbackSubmit.disabled = true;
      feedbackSubmit.innerHTML = `<span class="spinner" style="width:16px;height:16px;border-width:2px"></span> Sending...`;

      try {
        const response = await fetch('https://formsubmit.co/ajax/prakharmanu76@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `[MorphUI Feedback] ${category}`,
            category: category,
            email: email,
            message: message,
            _template: 'table',
          }),
        });

        if (response.ok) {
          // Clear form & close panel
          const msgEl = document.getElementById('feedback-message');
          const emailEl = document.getElementById('feedback-email');
          if (msgEl) msgEl.value = '';
          if (emailEl) emailEl.value = '';
          closeFeedback();
          showToast('Thanks for your feedback! 🙌');
        } else {
          showToast('Failed to send. Please try again.');
        }
      } catch (err) {
        console.error('Feedback submit error:', err);
        showToast('Network error. Please try again later.');
      } finally {
        feedbackSubmit.disabled = false;
        feedbackSubmit.innerHTML = originalText;
      }
    });
  }

  // Scroll-triggered animations
  const animatedElements = document.querySelectorAll('.animate-in');
  let observer = null;
  if (animatedElements.length > 0) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // Interactive demo section
  const demoColors = [
    { key: 'primary', label: 'Primary', color: '#ff6b4a' },
    { key: 'secondary', label: 'Secondary', color: '#f5a623' },
    { key: 'accent', label: 'Accent', color: '#2dd4a8' },
    { key: 'background', label: 'Background', color: '#0d0d0f' },
    { key: 'surface', label: 'Surface', color: '#1a1a1e' },
  ];

  const demoPalette = document.getElementById('demo-palette');
  const demoPreview = document.getElementById('demo-preview-mini');

  if (demoPalette && demoPreview) {
    let currentDemoColors = demoColors.map(c => ({ ...c }));

    function renderDemoPalette() {
      demoPalette.innerHTML = currentDemoColors.map(c => `
        <div class="demo-color-row">
          <input type="color" class="demo-color-swatch" value="${c.color}" data-demo-key="${c.key}"
            style="width:48px;height:48px;border:2px solid var(--color-border);border-radius:var(--radius-lg);cursor:pointer;padding:0;background:none">
          <div>
            <div class="demo-color-label">${c.label}</div>
            <div class="demo-color-value">${c.color.toUpperCase()}</div>
          </div>
        </div>
      `).join('');

      demoPalette.querySelectorAll('.demo-color-swatch').forEach(swatch => {
        swatch.addEventListener('input', (e) => {
          const key = swatch.dataset.demoKey;
          const entry = currentDemoColors.find(c => c.key === key);
          if (entry) {
            entry.color = e.target.value;
            renderDemoPalette();
            renderDemoPreview();
          }
        });
      });
    }

    function renderDemoPreview() {
      const get = (key) => currentDemoColors.find(c => c.key === key)?.color || '#888';
      demoPreview.style.background = get('surface');
      demoPreview.style.borderColor = get('background');

      demoPreview.innerHTML = `
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <div style="width:8px;height:8px;border-radius:50%;background:${get('primary')}"></div>
          <div style="flex:1;height:8px;border-radius:4px;background:${get('primary')}30"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
          <div style="height:48px;border-radius:8px;background:${get('primary')}22;border:1px solid ${get('primary')}33"></div>
          <div style="height:48px;border-radius:8px;background:${get('secondary')}22;border:1px solid ${get('secondary')}33"></div>
        </div>
        <div style="height:64px;border-radius:8px;background:${get('background')};margin-bottom:12px;display:flex;align-items:flex-end;gap:6px;padding:8px">
          <div style="flex:1;background:${get('primary')};border-radius:3px 3px 0 0;height:50%"></div>
          <div style="flex:1;background:${get('secondary')};border-radius:3px 3px 0 0;height:70%"></div>
          <div style="flex:1;background:${get('accent')};border-radius:3px 3px 0 0;height:40%"></div>
          <div style="flex:1;background:${get('primary')};border-radius:3px 3px 0 0;height:85%"></div>
          <div style="flex:1;background:${get('secondary')};border-radius:3px 3px 0 0;height:55%"></div>
        </div>
        <div style="display:flex;gap:8px">
          <div style="padding:6px 16px;border-radius:6px;background:${get('primary')};color:white;font-size:12px;font-weight:600">Button</div>
          <div style="padding:6px 16px;border-radius:6px;background:transparent;border:1px solid ${get('accent')};color:${get('accent')};font-size:12px;font-weight:600">Action</div>
        </div>
      `;
    }

    renderDemoPalette();
    renderDemoPreview();
  }

  // Smooth scroll for in-page anchor links
  document.querySelectorAll('.navbar-links a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#/')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });

  // Hero preview color cycling
  const heroCards = ['hero-card-1', 'hero-card-2', 'hero-card-3'];
  const heroColorSets = [
    ['rgba(255,107,74,0.15)', 'rgba(245,166,35,0.15)', 'rgba(45,212,168,0.15)'],
    ['rgba(45,212,168,0.15)', 'rgba(255,107,74,0.15)', 'rgba(245,166,35,0.15)'],
    ['rgba(245,166,35,0.15)', 'rgba(45,212,168,0.15)', 'rgba(255,107,74,0.15)'],
    ['rgba(45,212,168,0.15)', 'rgba(245,166,35,0.15)', 'rgba(255,107,74,0.15)'],
  ];

  let heroColorIndex = 0;
  const heroInterval = setInterval(() => {
    heroColorIndex = (heroColorIndex + 1) % heroColorSets.length;
    const colors = heroColorSets[heroColorIndex];
    heroCards.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.style.background = colors[i];
    });
  }, 3000);

  // Return cleanup function
  return () => {
    clearInterval(heroInterval);
    if (observer) observer.disconnect();
  };
}

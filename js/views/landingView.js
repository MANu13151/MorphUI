// ============================================
// PALLETE — Landing View
// ============================================

import { navigate } from '../router.js';

const LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818cf8"/><stop offset="50%" stop-color="#c084fc"/><stop offset="100%" stop-color="#f472b6"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="url(#lg)"/><circle cx="11" cy="12" r="3.5" fill="#fff" opacity="0.9"/><circle cx="21" cy="12" r="3.5" fill="#fff" opacity="0.7"/><circle cx="16" cy="21" r="3.5" fill="#fff" opacity="0.5"/></svg>`;

export function renderLanding() {
  return `
  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <a href="#/" class="navbar-logo">
      ${LOGO_SVG}
      <span class="logo-gradient">Pallete</span>
    </a>
    <div class="navbar-links">
      <a href="#features">Features</a>
      <a href="#how-it-works">How It Works</a>
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
      Customize Your App<br>
      Colors <span class="gradient-text">Instantly</span>
    </h1>

    <p class="hero-subtitle">
      Upload your design or paste a Figma link. Get AI-powered palette suggestions,
      real-time preview, and WCAG accessibility scoring — all in one place.
    </p>

    <div class="hero-actions">
      <a href="#/workspace" class="btn btn-primary btn-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Upload Design
      </a>
      <span class="hero-divider-text">or</span>
      <a href="#/workspace" class="btn btn-secondary btn-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Paste Figma Link
      </a>
    </div>

    <div class="hero-input-group" id="figma-input-group">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:12px;color:var(--color-text-tertiary);flex-shrink:0"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      <input type="text" id="figma-link-input" placeholder="Paste your Figma link here..." aria-label="Figma link input">
      <button class="btn btn-primary" id="figma-go-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        Go
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
            <div class="hero-preview-card" id="hero-card-1" style="background: rgba(129,140,248,0.15)">
              <div class="card-line" style="width:60%"></div>
              <div class="card-line" style="width:40%;opacity:0.5"></div>
              <div class="card-line" style="width:80%;height:24px;margin-top:auto;background:var(--color-brand-primary);opacity:0.4;border-radius:6px"></div>
            </div>
            <div class="hero-preview-card" id="hero-card-2" style="background: rgba(192,132,252,0.15)">
              <div class="card-line" style="width:50%"></div>
              <div class="card-line" style="width:70%;opacity:0.5"></div>
              <div class="card-line" style="width:80%;height:24px;margin-top:auto;background:var(--color-brand-secondary);opacity:0.4;border-radius:6px"></div>
            </div>
            <div class="hero-preview-card" id="hero-card-3" style="background: rgba(244,114,182,0.15)">
              <div class="card-line" style="width:65%"></div>
              <div class="card-line" style="width:45%;opacity:0.5"></div>
              <div class="card-line" style="width:80%;height:24px;margin-top:auto;background:var(--color-brand-accent);opacity:0.4;border-radius:6px"></div>
            </div>
            <div class="hero-preview-chart" style="background: rgba(129,140,248,0.06)">
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

  <!-- How It Works Section -->
  <section class="how-section" id="how-it-works">
    <div class="section-header">
      <span class="label">How It Works</span>
      <h2>Three Steps to a Perfect Palette</h2>
      <p>From design upload to export — it's that simple.</p>
    </div>
    <div class="steps-grid">
      <div class="step-card animate-in">
        <div class="step-number">1</div>
        <h3>Upload Your Design</h3>
        <p>Paste a Figma link or drag & drop your design file. We'll parse and render your UI components.</p>
      </div>
      <div class="step-card animate-in animate-in-delay-2">
        <div class="step-number">2</div>
        <h3>Customize Colors</h3>
        <p>Edit colors manually or let our AI suggest palettes based on mood and brand personality.</p>
      </div>
      <div class="step-card animate-in animate-in-delay-4">
        <div class="step-number">3</div>
        <h3>Export & Ship</h3>
        <p>Download your palette as Tailwind config, CSS variables, or JSON tokens. Ready for production.</p>
      </div>
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
        <svg viewBox="0 0 32 32" width="24" height="24" fill="none"><defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818cf8"/><stop offset="50%" stop-color="#c084fc"/><stop offset="100%" stop-color="#f472b6"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="url(#lg2)"/><circle cx="11" cy="12" r="3.5" fill="#fff" opacity="0.9"/><circle cx="21" cy="12" r="3.5" fill="#fff" opacity="0.7"/><circle cx="16" cy="21" r="3.5" fill="#fff" opacity="0.5"/></svg>
        <span class="logo-gradient">Pallete</span>
      </a>
      <div class="footer-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      </div>
      <span class="footer-copy">&copy; 2026 Pallete. Built with love.</span>
    </div>
  </footer>
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
      localStorage.setItem('pallete_theme', next);
    });
  }

  // Figma link input -> navigate to workspace
  const figmaInput = document.getElementById('figma-link-input');
  const figmaGoBtn = document.getElementById('figma-go-btn');

  if (figmaGoBtn && figmaInput) {
    figmaGoBtn.addEventListener('click', () => {
      const link = figmaInput.value.trim();
      if (link) {
        sessionStorage.setItem('pallete_figma_link', link);
      }
      navigate('/workspace');
    });

    figmaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') figmaGoBtn.click();
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
    { key: 'primary', label: 'Primary', color: '#818cf8' },
    { key: 'secondary', label: 'Secondary', color: '#c084fc' },
    { key: 'accent', label: 'Accent', color: '#f472b6' },
    { key: 'background', label: 'Background', color: '#09090b' },
    { key: 'surface', label: 'Surface', color: '#1e1e24' },
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
    // Only handle section anchors, not route anchors
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
    ['rgba(129,140,248,0.15)', 'rgba(192,132,252,0.15)', 'rgba(244,114,182,0.15)'],
    ['rgba(52,211,153,0.15)', 'rgba(96,165,250,0.15)', 'rgba(251,191,36,0.15)'],
    ['rgba(248,113,113,0.15)', 'rgba(52,211,153,0.15)', 'rgba(129,140,248,0.15)'],
    ['rgba(192,132,252,0.15)', 'rgba(244,114,182,0.15)', 'rgba(52,211,153,0.15)'],
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

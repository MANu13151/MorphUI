import { state } from '../state.js';
import { initColorEditor } from '../colorEditor.js';
import { initAiPalette } from '../aiPalette.js';
import { initLivePreview } from '../livePreview.js';
import { initExportPanel } from '../exportPanel.js';
import { initAccessibility } from '../accessibility.js';
import { showToast } from '../toast.js';
import {
  parseFigmaUrl,
  fetchFileData,
  fetchFrameNodes,
  getTopFrames,
  extractColorsFromNode,
  autoMapColorsToPalette,
  isValidToken,
  isRateLimited,
  getRateLimitWaitSeconds,
  clearRateLimit,
} from '../figmaApi.js';
import { parseFrame, buildColorMapping } from '../figmaParser.js';
import { renderReconstruction, applyPaletteVariables } from '../figmaRenderer.js';

const LOGO_SVG = `<svg viewBox="0 0 32 32" width="24" height="24" fill="none"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff6b4a"/><stop offset="50%" stop-color="#f5a623"/><stop offset="100%" stop-color="#2dd4a8"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="url(#lg)"/><circle cx="11" cy="12" r="3.5" fill="#fff" opacity="0.9"/><circle cx="21" cy="12" r="3.5" fill="#fff" opacity="0.7"/><circle cx="16" cy="21" r="3.5" fill="#fff" opacity="0.5"/></svg>`;

export function renderWorkspace() {
  return `
  <div class="workspace" id="workspace">
    <!-- Header / Toolbar -->
    <header class="workspace-header" id="workspace-header">
      <div class="header-left">
        <a href="#/" class="header-logo">
          ${LOGO_SVG}
          <span class="logo-gradient">MorphUI</span>
        </a>
        <div class="header-divider"></div>
        <input type="text" class="project-name" id="project-name" value="Untitled Project" aria-label="Project name">
      </div>

      <div class="header-center">
        <button class="btn-icon tooltip" data-tooltip="Undo (Ctrl+Z)" id="btn-undo" aria-label="Undo" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </button>
        <button class="btn-icon tooltip" data-tooltip="Redo (Ctrl+Y)" id="btn-redo" aria-label="Redo" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
      </div>

      <div class="header-right">
        <button class="btn-icon tooltip" data-tooltip="Save Project" id="btn-save" aria-label="Save">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </button>
        <button class="btn btn-secondary btn-sm" id="btn-export">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
        <button class="btn-icon tooltip" data-tooltip="Toggle Theme" id="theme-toggle" aria-label="Toggle theme">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
      </div>
    </header>

    <!-- Sidebar: Color Editor & AI Palette -->
    <aside class="sidebar" id="sidebar">
      <!-- Color Palette Section -->
      <div class="sidebar-section" id="color-palette-section">
        <div class="sidebar-section-header">
          <h3 class="sidebar-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="16" r="2.5"/><circle cx="8" cy="16" r="2.5"/></svg>
            Color Palette
          </h3>
          <label class="toggle tooltip" data-tooltip="Apply to all similar">
            <input type="checkbox" id="apply-all-toggle">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="color-slot-list" id="color-slot-list"></div>
      </div>

      <!-- AI Palette Generator Section -->
      <div class="sidebar-section" id="ai-palette-section">
        <div class="sidebar-section-header">
          <h3 class="sidebar-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 3.5-2 6-5 9-3-3-5-5.5-5-9a5 5 0 0 1 5-5z"/><circle cx="12" cy="7" r="1"/></svg>
            AI Palette
          </h3>
        </div>
        <div class="ai-section">
          <div>
            <span class="label">Mood</span>
            <div class="mood-chips" id="mood-chips">
              <button class="chip active" data-mood="minimal">Minimal</button>
              <button class="chip" data-mood="vibrant">Vibrant</button>
              <button class="chip" data-mood="dark">Dark</button>
              <button class="chip" data-mood="pastel">Pastel</button>
              <button class="chip" data-mood="corporate">Corporate</button>
              <button class="chip" data-mood="neon">Neon</button>
            </div>
          </div>
          <div>
            <span class="label">Brand Personality</span>
            <div class="personality-chips" id="personality-chips">
              <button class="chip active" data-personality="professional">Professional</button>
              <button class="chip" data-personality="playful">Playful</button>
              <button class="chip" data-personality="luxury">Luxury</button>
              <button class="chip" data-personality="techy">Techy</button>
            </div>
          </div>
          <button class="btn btn-primary ai-generate-btn" id="btn-generate-palette">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Generate AI Palette
          </button>
          <div class="ai-suggestions" id="ai-suggestions"></div>
        </div>
      </div>

      <!-- Accessibility Section -->
      <div class="sidebar-section" id="accessibility-section">
        <div class="sidebar-section-header">
          <h3 class="sidebar-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            Accessibility
          </h3>
        </div>
        <div id="accessibility-content"></div>
      </div>
    </aside>

    <!-- Preview Panel -->
    <main class="preview-panel" id="preview-panel">
      <div class="preview-toolbar">
        <div class="preview-toolbar-left">
          <span class="label" style="margin:0">Preview</span>
          <div class="device-toggles" id="device-toggles">
            <button class="device-toggle" data-device="mobile" aria-label="Mobile preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </button>
            <button class="device-toggle" data-device="tablet" aria-label="Tablet preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </button>
            <button class="device-toggle active" data-device="desktop" aria-label="Desktop preview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </button>
          </div>
        </div>
        <div class="preview-toolbar-right">
          <div class="zoom-controls">
            <button class="btn-icon" id="btn-zoom-out" aria-label="Zoom out" style="width:28px;height:28px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span class="zoom-level" id="zoom-level">100%</span>
            <button class="btn-icon" id="btn-zoom-in" aria-label="Zoom in" style="width:28px;height:28px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="preview-viewport" id="preview-viewport">
        <div class="preview-frame" data-device="desktop" id="preview-frame">
          <div class="preview-content" id="preview-content"></div>
        </div>
      </div>
    </main>
  </div>

  <!-- Export Modal -->
  <div class="modal-overlay export-modal" id="export-modal" style="display:none">
    <div class="modal">
      <div class="modal-header">
        <h3>Export Palette</h3>
        <button class="btn-icon" id="btn-close-export" aria-label="Close export">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="tabs export-tabs" id="export-tabs">
          <button class="tab active" data-tab="tailwind">Tailwind CSS</button>
          <button class="tab" data-tab="css">CSS Variables</button>
          <button class="tab" data-tab="json">JSON Tokens</button>
          <button class="tab" data-tab="scss">SCSS</button>
        </div>
        <pre class="export-code" id="export-code"></pre>
        <div class="export-actions">
          <button class="btn btn-secondary" id="btn-copy-export">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy Code
          </button>
          <button class="btn btn-primary" id="btn-download-export">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function initWorkspace() {
  // Add workspace-active class for layout control
  document.body.classList.add('workspace-active');

  // Load saved state
  state.load();

  // Project name
  const nameInput = document.getElementById('project-name');
  if (nameInput) {
    nameInput.value = state.projectName;
    nameInput.addEventListener('change', () => {
      state.projectName = nameInput.value;
    });
  }

  // Check for Figma link and token from landing page
  const figmaLink = sessionStorage.getItem('morphui_figma_link');
  const landingToken = sessionStorage.getItem('morphui_figma_token');
  const exploreMode = sessionStorage.getItem('morphui_explore_mode');

  // Clean up sessionStorage
  sessionStorage.removeItem('morphui_figma_link');
  sessionStorage.removeItem('morphui_figma_token');
  sessionStorage.removeItem('morphui_explore_mode');

  // If token was entered on landing, save it for workspace use
  if (landingToken) {
    localStorage.setItem('morphui_figma_token', landingToken);
  }

  // Initialize all modules
  initColorEditor();
  initAiPalette();
  initExportPanel();
  initAccessibility();

  // Only init live preview immediately if NO Figma link
  // (otherwise we show loading first, then init after)
  if (figmaLink) {
    startFigmaFlow(figmaLink);
  } else {
    initLivePreview();
  }

  // Undo / Redo buttons
  const undoBtn = document.getElementById('btn-undo');
  const redoBtn = document.getElementById('btn-redo');

  function updateHistoryButtons() {
    if (undoBtn) undoBtn.disabled = !state.canUndo;
    if (redoBtn) redoBtn.disabled = !state.canRedo;
  }

  undoBtn?.addEventListener('click', () => state.undo());
  redoBtn?.addEventListener('click', () => state.redo());
  state.subscribe('history', updateHistoryButtons);
  updateHistoryButtons();

  // Keyboard shortcuts handler
  const keyHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      state.undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      state.redo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      state.save();
      showToast('Project saved!');
    }
  };
  document.addEventListener('keydown', keyHandler);

  // Save button
  document.getElementById('btn-save')?.addEventListener('click', () => {
    state.save();
    showToast('Project saved!');
  });

  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    state.isDark = !state.isDark;
    localStorage.setItem('morphui_theme', state.isDark ? 'dark' : 'light');
  });

  // Return cleanup
  return () => {
    document.removeEventListener('keydown', keyHandler);
    document.body.classList.remove('workspace-active');
  };
}

// ---- Figma Reconstruction State ----
let _parsedSchema = null;       // Parsed frame schema from figmaParser
let _colorMapping = {};         // { hex: slotKey } for CSS variable binding
let _extractedMapping = null;   // { slot: originalHex } from autoMap — for mapping panel
let _paletteUnsub = null;       // Palette subscription cleanup
let _figmaFrames = [];          // Available frames from file
let _selectedFrameId = null;    // Currently selected frame ID

function startFigmaFlow(link) {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;

  const parsed = parseFigmaUrl(link);
  if (!parsed) {
    showToast('Invalid Figma URL. Please use a figma.com/design/... link.');
    initLivePreview();
    return;
  }

  state._figmaLink = link;
  state._figmaParsed = parsed;

  // Build embed URL for fallback view
  state._figmaEmbedUrl = `https://www.figma.com/embed?embed_host=morphui&url=${encodeURIComponent(link)}`;

  // Check for saved token
  const savedToken = localStorage.getItem('morphui_figma_token');

  // Show token input
  showTokenPrompt(savedToken || '');
}

function showTokenPrompt(prefillToken) {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;

  previewContent.innerHTML = `
    <div class="figma-token-prompt">
      <div class="figma-token-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
      </div>
      <h3 class="figma-token-title">Connect to Figma</h3>
      <p class="figma-token-desc">
        Enter your Figma Personal Access Token to fetch and render your design with real-time color editing.
      </p>

      <div class="figma-token-input-row">
        <input
          type="password"
          id="figma-token-input"
          class="figma-token-input"
          placeholder="Paste your token (figd_...)"
          value="${prefillToken}"
          autocomplete="off"
        />
        <button class="btn btn-primary" id="btn-figma-connect">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Connect
        </button>
      </div>

      <label class="figma-token-remember">
        <input type="checkbox" id="figma-remember-token" ${prefillToken ? 'checked' : ''}>
        <span>Remember token in this browser</span>
      </label>

      <details class="figma-token-help">
        <summary>How to get a token?</summary>
        <ol>
          <li>Go to <strong>figma.com</strong> → click your avatar → <strong>Settings</strong></li>
          <li>Scroll to <strong>Personal access tokens</strong></li>
          <li>Click <strong>Generate new token</strong> → name it "MorphUI"</li>
          <li>Copy the token (starts with <code>figd_</code>)</li>
        </ol>
        <p style="margin-top:8px;font-size:11px;color:var(--color-text-tertiary)">Your token is stored locally and never sent to any server except Figma's API.</p>
      </details>

      <div class="figma-token-alt">
        <button class="btn btn-ghost btn-sm" id="btn-figma-skip">Skip — use embed preview</button>
        <button class="btn btn-ghost btn-sm" id="btn-figma-mock">Skip — use mock preview</button>
      </div>
    </div>
  `;

  // Attach events
  document.getElementById('btn-figma-connect')?.addEventListener('click', () => {
    const token = document.getElementById('figma-token-input')?.value?.trim();
    const remember = document.getElementById('figma-remember-token')?.checked;
    if (!token) { showToast('Please enter your Figma token.'); return; }
    if (!isValidToken(token)) { showToast('Token format looks invalid. It usually starts with figd_'); return; }
    if (remember) localStorage.setItem('morphui_figma_token', token);
    else localStorage.removeItem('morphui_figma_token');
    
    // Clear any previous rate limit lock if user manually provides a new token
    clearRateLimit();
    connectToFigma(token);
  });

  // Enter key
  document.getElementById('figma-token-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-figma-connect')?.click();
  });

  // Auto-connect if token already saved AND not rate limited
  if (prefillToken && isValidToken(prefillToken)) {
    if (isRateLimited()) {
      // Show countdown instead of auto-connecting
      const waitSec = getRateLimitWaitSeconds();
      showRateLimitCountdown(waitSec, prefillToken);
      return;
    }
    connectToFigma(prefillToken);
    return;
  }

  document.getElementById('btn-figma-skip')?.addEventListener('click', () => {
    showFigmaEmbed();
    addViewModeToggles('embed');
  });

  document.getElementById('btn-figma-mock')?.addEventListener('click', () => {
    initLivePreview();
    addViewModeToggles('mock');
  });
}

function showRateLimitCountdown(seconds, token) {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;

  let remaining = seconds;

  const render = () => {
    previewContent.innerHTML = `
      <div class="figma-token-prompt">
        <div class="figma-token-icon" style="background:var(--color-warning-bg);color:var(--color-warning)">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h3 class="figma-token-title">Figma Rate Limit</h3>
        <p class="figma-token-desc">
          Too many requests. Figma's API is cooling down.<br>
          Auto-retrying in <strong id="countdown-num" style="color:var(--color-warning);font-size:var(--text-xl)">${remaining}s</strong>
        </p>
        <div style="width:200px;height:6px;background:var(--color-surface);border-radius:99px;overflow:hidden;margin:var(--space-2) 0">
          <div id="countdown-bar" style="width:${(remaining / seconds) * 100}%;height:100%;background:var(--color-warning);border-radius:99px;transition:width 1s linear"></div>
        </div>
        <div class="figma-token-alt" style="margin-top:var(--space-4)">
          <button class="btn btn-ghost btn-sm" id="btn-rate-embed">Use Embed while waiting</button>
          <button class="btn btn-ghost btn-sm" id="btn-rate-mock">Use Color Preview</button>
        </div>
      </div>
    `;

    document.getElementById('btn-rate-embed')?.addEventListener('click', () => {
      showFigmaEmbed();
      addViewModeToggles('embed');
    });
    document.getElementById('btn-rate-mock')?.addEventListener('click', () => {
      initLivePreview();
      addViewModeToggles('mock');
    });
  };

  render();

  const timer = setInterval(() => {
    remaining--;
    const numEl = document.getElementById('countdown-num');
    const barEl = document.getElementById('countdown-bar');
    if (numEl) numEl.textContent = `${remaining}s`;
    if (barEl) barEl.style.width = `${(remaining / seconds) * 100}%`;

    if (remaining <= 0) {
      clearInterval(timer);
      connectToFigma(token);
    }
  }, 1000);
}

async function connectToFigma(token) {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent || !state._figmaParsed) return;

  const { fileKey } = state._figmaParsed;

  previewContent.innerHTML = `
    <div class="loading-overlay">
      <div class="spinner" style="width:40px;height:40px;border-width:3px"></div>
      <div class="loading-text" id="figma-load-status">Connecting to Figma...</div>
    </div>
  `;

  try {
    const urlNodeId = state._figmaParsed.nodeId
      ? state._figmaParsed.nodeId.replace(/-/g, ':')
      : null;

    if (urlNodeId) {
      // Fast-path: We have a node ID, skip fetching the whole file metadata!
      // This saves an API call and avoids rate-limits on the /files endpoint.
      document.getElementById('figma-load-status').textContent = 'Connecting directly to frame...';
      state._figmaToken = token;
      state._figmaFileKey = fileKey;
      
      const mockFrame = { id: urlNodeId, name: 'Selected Frame' };
      await selectAndRenderFrame(mockFrame, token, fileKey);
      return; // Exit here, selectAndRenderFrame handles the rest
    }

    // Step 1: Fetch file metadata (API call #1 — cached)
    document.getElementById('figma-load-status').textContent = 'Fetching file data...';
    const fileData = await fetchFileData(fileKey, token);

    // Get available frames
    _figmaFrames = getTopFrames(fileData);
    state._figmaToken = token;
    state._figmaFileKey = fileKey;

    if (_figmaFrames.length === 0) {
      showFigmaEmbed();
      addViewModeToggles('embed');
      showToast('No frames found in this file.');
      return;
    }

    if (_figmaFrames.length === 1) {
      await selectAndRenderFrame(_figmaFrames[0], token, fileKey);
    } else {
      showFrameSelector(_figmaFrames, token, fileKey, fileData.name);
    }

  } catch (err) {
    console.error('Figma API error:', err);
    if (isRateLimited()) {
      showRateLimitCountdown(getRateLimitWaitSeconds(), token);
      return;
    }
    previewContent.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div class="error-title">Failed to connect</div>
        <div class="error-message">${err.message}</div>
        <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4)">
          <button class="btn btn-primary btn-sm" id="btn-figma-retry">Try Again</button>
          <button class="btn btn-secondary btn-sm" id="btn-figma-fallback">Use Mock Preview</button>
        </div>
      </div>
    `;
    document.getElementById('btn-figma-retry')?.addEventListener('click', () => showTokenPrompt(token));
    document.getElementById('btn-figma-fallback')?.addEventListener('click', () => {
      initLivePreview();
      addViewModeToggles('mock');
    });
  }
}

// ---- Frame Selection Modal ----

function showFrameSelector(frames, token, fileKey, fileName) {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;

  previewContent.innerHTML = `
    <div class="frame-select-modal">
      <div class="frame-select-header">
        <div class="frame-select-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        </div>
        <h3 class="frame-select-title">Select a Screen</h3>
        <p class="frame-select-desc">from <strong>${fileName || 'Figma file'}</strong> — ${frames.length} screens found</p>
      </div>
      <div class="frame-select-grid" id="frame-select-grid">
        ${frames.map((f, i) => `
          <button class="frame-card" data-frame-id="${f.id}" data-frame-idx="${i}">
            <div class="frame-card-preview">
              <div class="frame-card-placeholder" style="aspect-ratio:${(f.width||4)/(f.height||3)}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/></svg>
              </div>
            </div>
            <div class="frame-card-info">
              <span class="frame-card-name">${f.name || `Frame ${i + 1}`}</span>
              <span class="frame-card-size">${Math.round(f.width)}×${Math.round(f.height)}</span>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Bind click events
  previewContent.querySelectorAll('.frame-card').forEach(card => {
    card.addEventListener('click', () => {
      const frameId = card.dataset.frameId;
      const frame = frames.find(f => f.id === frameId);
      if (frame) selectAndRenderFrame(frame, token, fileKey);
    });
  });
}

// ---- Select & Render a Frame ----

async function selectAndRenderFrame(frame, token, fileKey) {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;

  _selectedFrameId = frame.id;

  previewContent.innerHTML = `
    <div class="loading-overlay">
      <div class="spinner" style="width:40px;height:40px;border-width:3px"></div>
      <div class="loading-text" id="figma-load-status">Importing "${frame.name}"...</div>
    </div>
  `;

  try {
    // Fetch ONLY this frame's node tree (API call #2 — cached)
    document.getElementById('figma-load-status').textContent = 'Fetching frame data...';
    const frameNode = await fetchFrameNodes(fileKey, frame.id, token);

    // Extract colors from this frame only
    document.getElementById('figma-load-status').textContent = 'Extracting colors...';
    const frameColors = extractColorsFromNode(frameNode);
    const autoMapped = autoMapColorsToPalette(frameColors);

    // Store for mapping panel
    _extractedMapping = autoMapped ? { ...autoMapped } : null;

    // Build color mapping (hex → slot name) for CSS variable binding
    _colorMapping = buildColorMapping(autoMapped || {});

    // Apply extracted colors to our palette
    if (autoMapped) {
      Object.entries(autoMapped).forEach(([key, value]) => {
        if (state.palette[key] !== undefined) {
          state.setColor(key, value);
        }
      });
    }

    // Parse frame into internal schema
    document.getElementById('figma-load-status').textContent = 'Building reconstruction...';
    _parsedSchema = parseFrame(frameNode, _colorMapping);

    // Render the reconstruction
    renderReconstructionView();
    addViewModeToggles('figma');
    addFigmaExportButton();

    // Render the color mapping panel in the sidebar
    renderColorMappingPanel();

    // Subscribe to palette changes — update CSS variables only (no re-render)
    if (_paletteUnsub) _paletteUnsub();
    _paletteUnsub = state.subscribe('palette', () => {
      const container = document.getElementById('preview-content');
      if (container) applyPaletteVariables(container, state.palette);
    });

    showToast(
      `"${frame.name}" imported! ${frameColors.length} colors mapped. ` +
      `Change any color — your design updates in real-time!`
    );

  } catch (err) {
    console.error('Frame import error:', err);
    if (isRateLimited()) {
      showRateLimitCountdown(getRateLimitWaitSeconds(), token);
      return;
    }
    previewContent.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div class="error-title">Failed to import frame</div>
        <div class="error-message">${err.message}</div>
        <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4)">
          <button class="btn btn-primary btn-sm" id="btn-frame-retry">Try Again</button>
          <button class="btn btn-secondary btn-sm" id="btn-frame-mock">Use Mock Preview</button>
        </div>
      </div>
    `;
    document.getElementById('btn-frame-retry')?.addEventListener('click', () => selectAndRenderFrame(frame, token, fileKey));
    document.getElementById('btn-frame-mock')?.addEventListener('click', () => {
      initLivePreview();
      addViewModeToggles('mock');
    });
  }
}

// ---- Render Reconstruction View ----

function renderReconstructionView() {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent || !_parsedSchema) return;
  renderReconstruction(_parsedSchema, previewContent, state.palette);
}

// ---- Fallback Views ----

function showFigmaEmbed() {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent || !state._figmaEmbedUrl) return;
  previewContent.innerHTML = `
    <iframe
      src="${state._figmaEmbedUrl}"
      style="width:100%;height:100%;border:none;border-radius:var(--radius-lg)"
      allowfullscreen
    ></iframe>
  `;
}

function addViewModeToggles(activeView) {
  const toolbarLeft = document.querySelector('.preview-toolbar-left');
  if (!toolbarLeft || document.getElementById('view-mode-toggles')) return;

  const hasDesign = !!_parsedSchema;

  const toggleGroup = document.createElement('div');
  toggleGroup.id = 'view-mode-toggles';
  toggleGroup.style.cssText = 'display:flex;gap:4px;margin-left:12px;';
  toggleGroup.innerHTML = `
    ${hasDesign ? `
      <button class="chip ${activeView === 'figma' ? 'active' : ''}" id="btn-view-figma" style="font-size:11px;padding:4px 10px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        Your Design
      </button>
    ` : ''}
    <button class="chip ${activeView === 'embed' ? 'active' : ''}" id="btn-view-embed" style="font-size:11px;padding:4px 10px">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      Figma Embed
    </button>
    <button class="chip ${activeView === 'mock' ? 'active' : ''}" id="btn-view-mock" style="font-size:11px;padding:4px 10px">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="13.5" cy="17.5" r="2.5"/></svg>
      Color Preview
    </button>
  `;
  toolbarLeft.appendChild(toggleGroup);

  const setActive = (id) => {
    toggleGroup.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  };

  document.getElementById('btn-view-figma')?.addEventListener('click', () => {
    renderReconstructionView();
    setActive('btn-view-figma');
  });
  document.getElementById('btn-view-embed')?.addEventListener('click', () => {
    showFigmaEmbed();
    setActive('btn-view-embed');
  });
  document.getElementById('btn-view-mock')?.addEventListener('click', () => {
    initLivePreview();
    setActive('btn-view-mock');
  });
}

// ---- Color Mapping Panel ----

const SLOT_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  background: 'Background',
  surface: 'Surface',
  text: 'Text',
  textSecondary: 'Text Secondary',
  border: 'Border',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

function renderColorMappingPanel() {
  if (!_extractedMapping) return;

  // Remove existing panel if any
  document.getElementById('color-mapping-section')?.remove();

  const aiSection = document.getElementById('ai-palette-section');
  if (!aiSection) return;

  const section = document.createElement('div');
  section.className = 'sidebar-section';
  section.id = 'color-mapping-section';

  // Only show slots that have a mapped color
  const mappedSlots = Object.entries(_extractedMapping).filter(
    ([, hex]) => hex && !['success', 'warning', 'error'].includes(hex)
  );

  section.innerHTML = `
    <div class="sidebar-section-header">
      <h3 class="sidebar-section-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 4.27 11 2.55l3.5 1.72M7.5 4.27l-4 2L7.5 8.27l4-2-4-2ZM7.5 4.27v4M16.5 4.27l4 2v4l-4 2-4-2v-4l4-2ZM7.5 12.27l-4 2 4 2 4-2-4-2ZM7.5 12.27v4M16.5 12.27l4 2v4l-4 2-4-2v-4l4-2Z"/></svg>
        Color Mapping
      </h3>
    </div>
    <div class="mapping-panel" id="mapping-panel">
      <p class="mapping-hint">Reassign extracted colors to palette slots</p>
      <div class="mapping-rows" id="mapping-rows"></div>
    </div>
  `;

  // Insert after AI section
  aiSection.after(section);

  const rowsContainer = section.querySelector('#mapping-rows');

  // Build available slots list
  const availableSlots = Object.keys(SLOT_LABELS);

  Object.entries(_extractedMapping).forEach(([slot, originalHex]) => {
    if (!originalHex || ['success', 'warning', 'error'].includes(slot)) return;

    const row = document.createElement('div');
    row.className = 'mapping-row';
    row.innerHTML = `
      <div class="mapping-original">
        <span class="mapping-swatch" style="background:${originalHex}"></span>
        <span class="mapping-hex">${originalHex}</span>
      </div>
      <span class="mapping-arrow">→</span>
      <select class="mapping-dropdown" data-original-hex="${originalHex}" data-current-slot="${slot}">
        ${availableSlots.map(s => `
          <option value="${s}" ${s === slot ? 'selected' : ''}>${SLOT_LABELS[s]}</option>
        `).join('')}
      </select>
      <span class="mapping-current-swatch" style="background:${state.palette[slot] || originalHex}"></span>
    `;
    rowsContainer.appendChild(row);
  });

  // Handle reassignment
  rowsContainer.querySelectorAll('.mapping-dropdown').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const originalHex = e.target.dataset.originalHex;
      const oldSlot = e.target.dataset.currentSlot;
      const newSlot = e.target.value;

      if (oldSlot === newSlot) return;

      // Update the mapping
      _extractedMapping[newSlot] = originalHex;
      delete _extractedMapping[oldSlot];

      // Rebuild color mapping
      _colorMapping = buildColorMapping(_extractedMapping);

      // Apply the color to the new slot
      state.setColor(newSlot, originalHex);

      // Update the data attribute
      e.target.dataset.currentSlot = newSlot;

      // Re-render the panel to reflect swaps
      renderColorMappingPanel();

      showToast(`Moved ${originalHex} → ${SLOT_LABELS[newSlot]}`);
    });
  });
}

// ---- Export to Figma Plugin ----

function addFigmaExportButton() {
  const toolbarRight = document.querySelector('.preview-toolbar-right');
  if (!toolbarRight || document.getElementById('btn-figma-export')) return;

  const btn = document.createElement('button');
  btn.id = 'btn-figma-export';
  btn.className = 'btn btn-secondary btn-sm';
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
    Export to Figma
  `;
  btn.style.cssText = 'font-size:11px;gap:4px;';
  toolbarRight.appendChild(btn);

  btn.addEventListener('click', () => {
    const payload = generatePluginPayload();
    const json = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      showToast('Palette JSON copied to clipboard! Paste it into the MorphUI Sync Figma plugin.');
    }).catch(() => {
      // Fallback: show in a modal
      prompt('Copy this JSON and paste it into the MorphUI Sync Figma plugin:', json);
    });
  });
}

function generatePluginPayload() {
  const mappings = [];

  if (_extractedMapping) {
    Object.entries(_extractedMapping).forEach(([slot, originalHex]) => {
      if (!originalHex) return;
      const currentHex = state.palette[slot];
      if (currentHex && currentHex.toLowerCase() !== originalHex.toLowerCase()) {
        mappings.push({
          from: originalHex.toLowerCase(),
          to: currentHex.toLowerCase(),
          slot,
          slotLabel: SLOT_LABELS[slot] || slot,
        });
      }
    });
  }

  return {
    version: 1,
    name: state.projectName || 'MorphUI Theme',
    timestamp: new Date().toISOString(),
    palette: { ...state.palette },
    mappings,
  };
}

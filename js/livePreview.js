// ============================================
// MORPHUI — Live Preview Panel
// ============================================

import { state } from './state.js';
import { getReadableTextColor, adjustLightness } from './colorUtils.js';

// Track subscriptions for cleanup
let _unsubscribers = [];

export function initLivePreview() {
  // Clear any previous subscriptions
  _unsubscribers.forEach(unsub => unsub());
  _unsubscribers = [];

  renderMockApp();

  _unsubscribers.push(state.subscribe('palette', () => applyPaletteToPreview()));
  _unsubscribers.push(state.subscribe('device', () => updateDevice()));
  _unsubscribers.push(state.subscribe('zoom', () => updateZoom()));

  // Device toggles
  document.getElementById('device-toggles')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.device-toggle');
    if (!btn) return;
    state.activeDevice = btn.dataset.device;
  });

  // Zoom controls
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => { state.zoom += 25; });
  document.getElementById('btn-zoom-out')?.addEventListener('click', () => { state.zoom -= 25; });

  // Initial apply
  applyPaletteToPreview();
}

function renderMockApp() {
  const container = document.getElementById('preview-content');
  if (!container) return;

  container.innerHTML = `
    <div class="mock-app" id="mock-app">
      <!-- Nav -->
      <nav class="mock-nav" id="mock-nav">
        <span class="mock-nav-brand" id="mock-brand">Dashboard</span>
        <div class="mock-nav-items">
          <span>Overview</span>
          <span>Analytics</span>
          <span>Reports</span>
          <span>Settings</span>
        </div>
        <div class="mock-nav-avatar" id="mock-avatar"></div>
      </nav>

      <!-- Sidebar -->
      <aside class="mock-sidebar" id="mock-sidebar">
        <div class="mock-sidebar-item mock-sidebar-active" id="mock-sb-1">
          <div class="mock-sidebar-icon" id="mock-sb-icon-1"></div>
          <span>Dashboard</span>
        </div>
        <div class="mock-sidebar-item" id="mock-sb-2">
          <div class="mock-sidebar-icon" id="mock-sb-icon-2"></div>
          <span>Projects</span>
        </div>
        <div class="mock-sidebar-item" id="mock-sb-3">
          <div class="mock-sidebar-icon" id="mock-sb-icon-3"></div>
          <span>Team</span>
        </div>
        <div class="mock-sidebar-item" id="mock-sb-4">
          <div class="mock-sidebar-icon" id="mock-sb-icon-4"></div>
          <span>Messages</span>
        </div>
        <div class="mock-sidebar-item" id="mock-sb-5">
          <div class="mock-sidebar-icon" id="mock-sb-icon-5"></div>
          <span>Calendar</span>
        </div>
        <div style="flex:1"></div>
        <div class="mock-sidebar-item" id="mock-sb-6">
          <div class="mock-sidebar-icon" id="mock-sb-icon-6"></div>
          <span>Settings</span>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="mock-main" id="mock-main">
        <h2 id="mock-heading">Overview</h2>

        <!-- Stat Cards -->
        <div class="mock-stats">
          <div class="mock-stat-card" id="mock-stat-1">
            <div class="mock-stat-label" id="mock-stat-label-1">Total Revenue</div>
            <div class="mock-stat-value" id="mock-stat-val-1">$48,235</div>
          </div>
          <div class="mock-stat-card" id="mock-stat-2">
            <div class="mock-stat-label" id="mock-stat-label-2">Active Users</div>
            <div class="mock-stat-value" id="mock-stat-val-2">2,847</div>
          </div>
          <div class="mock-stat-card" id="mock-stat-3">
            <div class="mock-stat-label" id="mock-stat-label-3">Conversion Rate</div>
            <div class="mock-stat-value" id="mock-stat-val-3">3.24%</div>
          </div>
        </div>

        <!-- Chart -->
        <div class="mock-chart" id="mock-chart">
          <div class="mock-chart-title">Revenue Over Time</div>
          <div class="mock-chart-bars" id="mock-chart-bars">
            <div class="mock-chart-bar" style="height:60%"></div>
            <div class="mock-chart-bar" style="height:80%"></div>
            <div class="mock-chart-bar" style="height:45%"></div>
            <div class="mock-chart-bar" style="height:90%"></div>
            <div class="mock-chart-bar" style="height:55%"></div>
            <div class="mock-chart-bar" style="height:70%"></div>
            <div class="mock-chart-bar" style="height:85%"></div>
            <div class="mock-chart-bar" style="height:50%"></div>
            <div class="mock-chart-bar" style="height:95%"></div>
            <div class="mock-chart-bar" style="height:65%"></div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mock-actions">
          <button class="mock-btn" id="mock-btn-primary">Create Report</button>
          <button class="mock-btn" id="mock-btn-secondary">Export Data</button>
          <button class="mock-btn" id="mock-btn-accent">View Details</button>
        </div>

        <!-- Table -->
        <table class="mock-table" id="mock-table">
          <thead>
            <tr id="mock-thead-row">
              <th>Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td id="mock-td-1">Marketing Campaign</td>
              <td><span class="mock-tag" id="mock-tag-1">Active</span></td>
              <td>Jan 15, 2026</td>
              <td>$12,400</td>
            </tr>
            <tr>
              <td id="mock-td-2">Product Launch</td>
              <td><span class="mock-tag" id="mock-tag-2">Pending</span></td>
              <td>Feb 03, 2026</td>
              <td>$8,750</td>
            </tr>
            <tr>
              <td id="mock-td-3">Q1 Review</td>
              <td><span class="mock-tag" id="mock-tag-3">Completed</span></td>
              <td>Mar 22, 2026</td>
              <td>$24,100</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  `;
}

function applyPaletteToPreview() {
  const p = state.palette;
  const app = document.getElementById('mock-app');
  if (!app) return;

  const nav = document.getElementById('mock-nav');
  if (nav) { nav.style.backgroundColor = p.surface; nav.style.borderColor = p.border; nav.style.color = p.text; }

  const brand = document.getElementById('mock-brand');
  if (brand) brand.style.color = p.primary;

  const avatar = document.getElementById('mock-avatar');
  if (avatar) avatar.style.background = p.accent;

  const navItems = app.querySelector('.mock-nav-items');
  if (navItems) navItems.style.color = p.textSecondary;

  const sidebar = document.getElementById('mock-sidebar');
  if (sidebar) { sidebar.style.backgroundColor = p.surface; sidebar.style.borderColor = p.border; sidebar.style.color = p.textSecondary; }

  const sb1 = document.getElementById('mock-sb-1');
  if (sb1) { sb1.style.backgroundColor = adjustLightness(p.primary, -30) + '33'; sb1.style.color = p.primary; }

  for (let i = 2; i <= 6; i++) {
    const sb = document.getElementById(`mock-sb-${i}`);
    if (sb) { sb.style.color = p.textSecondary; sb.style.backgroundColor = 'transparent'; }
  }

  const iconColors = [p.primary, p.secondary, p.accent, p.primary, p.secondary, p.textSecondary];
  iconColors.forEach((color, i) => {
    const icon = document.getElementById(`mock-sb-icon-${i + 1}`);
    if (icon) icon.style.background = color + '44';
  });

  const main = document.getElementById('mock-main');
  if (main) main.style.backgroundColor = p.background;

  const heading = document.getElementById('mock-heading');
  if (heading) heading.style.color = p.text;

  const statColors = [p.primary, p.secondary, p.accent];
  for (let i = 0; i < 3; i++) {
    const card = document.getElementById(`mock-stat-${i + 1}`);
    const label = document.getElementById(`mock-stat-label-${i + 1}`);
    const val = document.getElementById(`mock-stat-val-${i + 1}`);
    if (card) { card.style.backgroundColor = p.surface; card.style.borderColor = p.border; }
    if (label) label.style.color = p.textSecondary;
    if (val) val.style.color = statColors[i];
  }

  const chart = document.getElementById('mock-chart');
  if (chart) { chart.style.backgroundColor = p.surface; chart.style.borderColor = p.border; chart.style.color = p.text; }

  const bars = document.querySelectorAll('.mock-chart-bar');
  bars.forEach((bar, i) => {
    const colors = [p.primary, p.secondary, p.accent];
    bar.style.backgroundColor = colors[i % 3];
    bar.style.opacity = '0.8';
  });

  const btnPrimary = document.getElementById('mock-btn-primary');
  if (btnPrimary) { btnPrimary.style.backgroundColor = p.primary; btnPrimary.style.color = getReadableTextColor(p.primary); }

  const btnSecondary = document.getElementById('mock-btn-secondary');
  if (btnSecondary) { btnSecondary.style.backgroundColor = 'transparent'; btnSecondary.style.border = `1px solid ${p.border}`; btnSecondary.style.color = p.text; }

  const btnAccent = document.getElementById('mock-btn-accent');
  if (btnAccent) { btnAccent.style.backgroundColor = p.accent; btnAccent.style.color = getReadableTextColor(p.accent); }

  const theadRow = document.getElementById('mock-thead-row');
  if (theadRow) {
    theadRow.querySelectorAll('th').forEach(th => { th.style.color = p.textSecondary; th.style.borderColor = p.border; });
  }

  const table = document.getElementById('mock-table');
  if (table) {
    table.querySelectorAll('td').forEach(td => { td.style.color = p.text; td.style.borderColor = p.border; });
  }

  const tag1 = document.getElementById('mock-tag-1');
  if (tag1) { tag1.style.backgroundColor = p.success + '22'; tag1.style.color = p.success; }
  const tag2 = document.getElementById('mock-tag-2');
  if (tag2) { tag2.style.backgroundColor = p.warning + '22'; tag2.style.color = p.warning; }
  const tag3 = document.getElementById('mock-tag-3');
  if (tag3) { tag3.style.backgroundColor = p.primary + '22'; tag3.style.color = p.primary; }
}

function updateDevice() {
  const frame = document.getElementById('preview-frame');
  if (frame) frame.setAttribute('data-device', state.activeDevice);
  document.querySelectorAll('.device-toggle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.device === state.activeDevice);
  });
}

function updateZoom() {
  const frame = document.getElementById('preview-frame');
  const label = document.getElementById('zoom-level');
  if (frame) frame.style.transform = `scale(${state.zoom / 100})`;
  if (label) label.textContent = `${state.zoom}%`;
}

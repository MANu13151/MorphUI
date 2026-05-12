// ============================================
// PALLETE — Accessibility (WCAG) Panel
// ============================================

import { state } from './state.js';
import { getContrastRatio, getWcagLevel, getReadableTextColor } from './colorUtils.js';

/**
 * Color pairs to check for contrast accessibility
 */
const CONTRAST_PAIRS = [
  { fg: 'text', bg: 'background', label: 'Text / Background' },
  { fg: 'text', bg: 'surface', label: 'Text / Surface' },
  { fg: 'textSecondary', bg: 'background', label: 'Secondary Text / Background' },
  { fg: 'textSecondary', bg: 'surface', label: 'Secondary Text / Surface' },
  { fg: 'primary', bg: 'background', label: 'Primary / Background' },
  { fg: 'primary', bg: 'surface', label: 'Primary / Surface' },
  { fg: 'accent', bg: 'background', label: 'Accent / Background' },
  { fg: 'success', bg: 'background', label: 'Success / Background' },
  { fg: 'warning', bg: 'background', label: 'Warning / Background' },
  { fg: 'error', bg: 'background', label: 'Error / Background' },
];

export function initAccessibility() {
  renderAccessibility();
  state.subscribe('palette', () => renderAccessibility());
}

function renderAccessibility() {
  const container = document.getElementById('accessibility-content');
  if (!container) return;

  const palette = state.palette;
  let passCount = 0;
  const total = CONTRAST_PAIRS.length;

  const pairResults = CONTRAST_PAIRS.map(pair => {
    const fgColor = palette[pair.fg];
    const bgColor = palette[pair.bg];
    const ratio = getContrastRatio(fgColor, bgColor);
    const level = getWcagLevel(ratio);
    if (level === 'AA' || level === 'AAA') passCount++;
    return { ...pair, fgColor, bgColor, ratio, level };
  });

  const scorePercent = Math.round((passCount / total) * 100);
  const scoreColor = scorePercent >= 80 ? 'var(--color-success)' : scorePercent >= 50 ? 'var(--color-warning)' : 'var(--color-error)';

  container.innerHTML = `
    <div class="a11y-score">
      <div class="a11y-score-value" style="color:${scoreColor}">${passCount}/${total}</div>
      <div class="a11y-score-label">pairs pass WCAG AA</div>
    </div>
    <div class="a11y-pairs">
      ${pairResults.map(r => {
        const badgeClass = r.level === 'AAA' ? 'badge-success' :
                           r.level === 'AA' ? 'badge-success' :
                           r.level === 'AA Large' ? 'badge-warning' : 'badge-error';
        return `
          <div class="a11y-pair">
            <div class="a11y-preview" style="background:${r.bgColor};color:${r.fgColor}">Aa</div>
            <div class="a11y-info">
              <div class="a11y-label">${r.label}</div>
              <div class="a11y-ratio">${r.ratio.toFixed(2)}:1</div>
            </div>
            <span class="badge ${badgeClass}">${r.level}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

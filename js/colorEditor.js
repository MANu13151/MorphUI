import { state, SLOT_LABELS } from './state.js';
import { hexToRgb, rgbToHex, hexToHsl, hslToHex, isValidHex, normalizeHex } from './colorUtils.js';
import { showToast } from './toast.js';

let activeEditorSlot = null;

const SLOT_DESCRIPTIONS = {
  primary:       'Buttons, links, active states',
  secondary:     'Accents, badges, secondary buttons',
  accent:        'Highlights, CTAs, tags',
  background:    'Page background',
  surface:       'Cards, panels, nav bar',
  text:          'Headings, body text',
  textSecondary: 'Labels, captions, muted text',
  border:        'Dividers, outlines',
  success:       'Success states, "Active" tags',
  warning:       'Warning states, "Pending" tags',
  error:         'Error states, alerts',
};

/** Friendly type labels for Figma node types */
const TYPE_ICONS = {
  'button':           '◼',
  'card':             '▢',
  'navbar':           '▬',
  'sidebar':          '▮',
  'container':        '▭',
  'text-block':       'Aa',
  'icon-placeholder': '◆',
  'divider':          '—',
  'input':            '▭',
};

export function initColorEditor() {
  const list = document.getElementById('color-slot-list');
  if (!list) return;

  renderSlots(list);

  state.subscribe('palette', () => renderSlots(list));
  state.subscribe('activeSlot', () => highlightActiveSlot());
}

function renderSlots(container) {
  const palette = state.palette;
  const slots = Object.keys(SLOT_LABELS);
  const usageMap = state._colorUsageMap || {};
  const hasFigma = Object.keys(usageMap).length > 0;

  container.innerHTML = slots.map(key => {
    const color = palette[key];
    const label = SLOT_LABELS[key];
    const usage = usageMap[key] || [];
    const isActive = state.activeSlot === key;

    // Build description: dynamic from Figma or static fallback
    let descHTML = '';
    if (hasFigma && usage.length > 0) {
      // Show count + top element names
      const countText = `${usage.length} element${usage.length > 1 ? 's' : ''}`;
      const topNames = usage.slice(0, 3).map(u =>
        `<span class="usage-chip" title="${u.name} (${u.type})">${TYPE_ICONS[u.type] || '•'} ${truncate(u.name, 16)}</span>`
      ).join('');
      const moreText = usage.length > 3 ? `<span class="usage-more">+${usage.length - 3} more</span>` : '';
      descHTML = `
        <div class="color-slot-usage">${countText}</div>
        <div class="color-slot-chips">${topNames}${moreText}</div>
      `;
    } else {
      descHTML = `<div class="color-slot-desc">${SLOT_DESCRIPTIONS[key] || ''}</div>`;
    }

    return `
      <div class="color-slot ${isActive ? 'active' : ''}" data-slot="${key}" id="slot-${key}">
        <div class="color-slot-swatch" style="background:${color}"></div>
        <div class="color-slot-info">
          <div class="color-slot-name">${label}</div>
          ${descHTML}
          <div class="color-slot-value">${color.toUpperCase()}</div>
        </div>
        <button class="btn-icon color-slot-copy" data-copy="${color}" aria-label="Copy ${label} color" style="width:28px;height:28px;border:none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
      ${isActive ? buildExpandedEditor(key, color, usage) : ''}
    `;
  }).join('');

  // Bind click events
  container.querySelectorAll('.color-slot').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.color-slot-copy')) return;
      if (e.target.closest('.color-editor-expanded')) return;
      const slot = el.dataset.slot;
      state.activeSlot = state.activeSlot === slot ? null : slot;
    });

    // Hover highlight — both mock preview AND Figma reconstruction
    el.addEventListener('mouseenter', () => {
      const slot = el.dataset.slot;
      // Mock preview highlight
      document.dispatchEvent(new CustomEvent('slot-highlight', { detail: { slot } }));
      // Figma reconstruction highlight
      highlightFigmaElements(slot, true);
    });
    el.addEventListener('mouseleave', () => {
      const slot = el.dataset.slot;
      document.dispatchEvent(new CustomEvent('slot-unhighlight', { detail: { slot } }));
      highlightFigmaElements(slot, false);
    });
  });

  container.querySelectorAll('.color-slot-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = btn.dataset.copy;
      navigator.clipboard.writeText(val).then(() => {
        showToast(`Copied ${val.toUpperCase()}`);
      });
    });
  });

  // Bind expanded editor events
  bindExpandedEditorEvents(container);
}

/** Highlight/unhighlight Figma reconstruction elements by slot */
function highlightFigmaElements(slot, highlight) {
  const varName = `--p-${slot}`;
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;
  const selectors = `[data-fill-var="${varName}"], [data-stroke-var="${varName}"], [data-text-var="${varName}"]`;
  previewContent.querySelectorAll(selectors).forEach(el => {
    if (highlight) el.classList.add('rc-highlight');
    else el.classList.remove('rc-highlight');
  });
}

/** Truncate long names */
function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function buildExpandedEditor(key, color) {
  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  return `
    <div class="color-editor-expanded" data-editor-slot="${key}">
      <div class="hex-input-row">
        <input type="color" class="native-color-picker" value="${color}" data-picker-slot="${key}">
        <input type="text" class="hex-input input-mono" value="${color.toUpperCase()}" data-hex-slot="${key}" maxlength="7" placeholder="#000000">
      </div>
      <div class="color-input-row">
        <div class="color-input-group">
          <label>R</label>
          <input type="number" min="0" max="255" value="${rgb.r}" data-rgb="r" data-rgb-slot="${key}">
        </div>
        <div class="color-input-group">
          <label>G</label>
          <input type="number" min="0" max="255" value="${rgb.g}" data-rgb="g" data-rgb-slot="${key}">
        </div>
        <div class="color-input-group">
          <label>B</label>
          <input type="number" min="0" max="255" value="${rgb.b}" data-rgb="b" data-rgb-slot="${key}">
        </div>
      </div>
      <div>
        <label class="label" style="margin-bottom:var(--space-1)">Hue ${hsl.h}°</label>
        <input type="range" class="color-slider" min="0" max="360" value="${hsl.h}" data-hsl="h" data-hsl-slot="${key}"
          style="background:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)">
      </div>
      <div>
        <label class="label" style="margin-bottom:var(--space-1)">Saturation ${hsl.s}%</label>
        <input type="range" class="color-slider" min="0" max="100" value="${hsl.s}" data-hsl="s" data-hsl-slot="${key}">
      </div>
      <div>
        <label class="label" style="margin-bottom:var(--space-1)">Lightness ${hsl.l}%</label>
        <input type="range" class="color-slider" min="0" max="100" value="${hsl.l}" data-hsl="l" data-hsl-slot="${key}">
      </div>
    </div>
  `;
}

function bindExpandedEditorEvents(container) {
  // Native color picker
  container.querySelectorAll('.native-color-picker').forEach(picker => {
    picker.addEventListener('input', (e) => {
      const slot = picker.dataset.pickerSlot;
      state.setColor(slot, e.target.value);
    });
  });

  // HEX input
  container.querySelectorAll('.hex-input').forEach(input => {
    input.addEventListener('change', () => {
      const slot = input.dataset.hexSlot;
      let val = input.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (isValidHex(val)) {
        state.setColor(slot, normalizeHex(val));
      } else {
        input.value = state.getColor(slot).toUpperCase();
      }
    });
  });

  // RGB inputs
  container.querySelectorAll('[data-rgb-slot]').forEach(input => {
    input.addEventListener('input', () => {
      const slot = input.dataset.rgbSlot;
      const channel = input.dataset.rgb;
      const current = hexToRgb(state.getColor(slot));
      current[channel] = parseInt(input.value) || 0;
      state.setColor(slot, rgbToHex(current.r, current.g, current.b));
    });
  });

  // HSL sliders
  container.querySelectorAll('[data-hsl-slot]').forEach(slider => {
    slider.addEventListener('input', () => {
      const slot = slider.dataset.hslSlot;
      const component = slider.dataset.hsl;
      const current = hexToHsl(state.getColor(slot));
      current[component] = parseInt(slider.value);
      state.setColor(slot, hslToHex(current.h, current.s, current.l));
    });
  });
}

function highlightActiveSlot() {
  document.querySelectorAll('.color-slot').forEach(el => {
    el.classList.toggle('active', el.dataset.slot === state.activeSlot);
  });
  // Re-render to show/hide expanded editor
  const list = document.getElementById('color-slot-list');
  if (list) renderSlots(list);
}

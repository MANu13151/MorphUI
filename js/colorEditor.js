// ============================================
// MORPHUI — Color Editor Panel
// ============================================

import { state, SLOT_LABELS } from './state.js';
import { hexToRgb, rgbToHex, hexToHsl, hslToHex, isValidHex, normalizeHex } from './colorUtils.js';
import { showToast } from './toast.js';

let activeEditorSlot = null;

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

  container.innerHTML = slots.map(key => {
    const color = palette[key];
    const label = SLOT_LABELS[key];
    const isActive = state.activeSlot === key;
    return `
      <div class="color-slot ${isActive ? 'active' : ''}" data-slot="${key}" id="slot-${key}">
        <div class="color-slot-swatch" style="background:${color}"></div>
        <div class="color-slot-info">
          <div class="color-slot-name">${label}</div>
          <div class="color-slot-value">${color.toUpperCase()}</div>
        </div>
        <button class="btn-icon color-slot-copy" data-copy="${color}" aria-label="Copy ${label} color" style="width:28px;height:28px;border:none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
      ${isActive ? buildExpandedEditor(key, color) : ''}
    `;
  }).join('');

  // Bind events
  container.querySelectorAll('.color-slot').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.color-slot-copy')) return;
      if (e.target.closest('.color-editor-expanded')) return;
      const slot = el.dataset.slot;
      state.activeSlot = state.activeSlot === slot ? null : slot;
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

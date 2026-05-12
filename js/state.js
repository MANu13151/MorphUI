// ============================================
// PALLETE — Reactive State Management
// ============================================

const MAX_HISTORY = 50;

/**
 * Default palette — dark mode SaaS dashboard
 */
const DEFAULT_PALETTE = {
  primary:       '#818cf8',
  secondary:     '#c084fc',
  accent:        '#f472b6',
  background:    '#09090b',
  surface:       '#1e1e24',
  text:          '#f4f4f5',
  textSecondary: '#a1a1aa',
  border:        '#27272a',
  success:       '#34d399',
  warning:       '#fbbf24',
  error:         '#f87171',
};

/**
 * Human-friendly slot labels
 */
export const SLOT_LABELS = {
  primary:       'Primary',
  secondary:     'Secondary',
  accent:        'Accent',
  background:    'Background',
  surface:       'Surface',
  text:          'Text',
  textSecondary: 'Text Secondary',
  border:        'Border',
  success:       'Success',
  warning:       'Warning',
  error:         'Error',
};

class AppState {
  constructor() {
    this._palette = { ...DEFAULT_PALETTE };
    this._history = [JSON.stringify(this._palette)];
    this._historyIndex = 0;
    this._subscribers = new Map();
    this._activeDevice = 'desktop';
    this._projectName = 'Untitled Project';
    this._zoom = 100;
    this._activeSlot = null;
    this._isDark = true;
  }

  // ---- Palette ----

  get palette() {
    return { ...this._palette };
  }

  getColor(key) {
    return this._palette[key];
  }

  setColor(key, value, addToHistory = true) {
    if (this._palette[key] === value) return;
    this._palette[key] = value;
    if (addToHistory) this._pushHistory();
    this._notify('palette');
    this._notify(`color:${key}`);
  }

  setPalette(newPalette, addToHistory = true) {
    let changed = false;
    for (const key in newPalette) {
      if (this._palette.hasOwnProperty(key) && this._palette[key] !== newPalette[key]) {
        this._palette[key] = newPalette[key];
        changed = true;
      }
    }
    if (changed) {
      if (addToHistory) this._pushHistory();
      this._notify('palette');
      Object.keys(newPalette).forEach(k => this._notify(`color:${k}`));
    }
  }

  resetPalette() {
    this.setPalette(DEFAULT_PALETTE);
  }

  // ---- History (Undo/Redo) ----

  _pushHistory() {
    const snapshot = JSON.stringify(this._palette);
    // Remove any redo states
    this._history = this._history.slice(0, this._historyIndex + 1);
    this._history.push(snapshot);
    if (this._history.length > MAX_HISTORY) {
      this._history.shift();
    } else {
      this._historyIndex++;
    }
    this._notify('history');
  }

  get canUndo() {
    return this._historyIndex > 0;
  }

  get canRedo() {
    return this._historyIndex < this._history.length - 1;
  }

  undo() {
    if (!this.canUndo) return;
    this._historyIndex--;
    this._palette = JSON.parse(this._history[this._historyIndex]);
    this._notify('palette');
    this._notify('history');
    Object.keys(this._palette).forEach(k => this._notify(`color:${k}`));
  }

  redo() {
    if (!this.canRedo) return;
    this._historyIndex++;
    this._palette = JSON.parse(this._history[this._historyIndex]);
    this._notify('palette');
    this._notify('history');
    Object.keys(this._palette).forEach(k => this._notify(`color:${k}`));
  }

  // ---- Device & Zoom ----

  get activeDevice() { return this._activeDevice; }
  set activeDevice(val) {
    this._activeDevice = val;
    this._notify('device');
  }

  get zoom() { return this._zoom; }
  set zoom(val) {
    this._zoom = Math.max(50, Math.min(150, val));
    this._notify('zoom');
  }

  // ---- Active Slot ----

  get activeSlot() { return this._activeSlot; }
  set activeSlot(val) {
    this._activeSlot = val;
    this._notify('activeSlot');
  }

  // ---- Project Name ----

  get projectName() { return this._projectName; }
  set projectName(val) {
    this._projectName = val;
    this._notify('projectName');
  }

  // ---- Theme ----

  get isDark() { return this._isDark; }
  set isDark(val) {
    this._isDark = val;
    document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
    this._notify('theme');
  }

  // ---- Subscriptions ----

  subscribe(event, callback) {
    if (!this._subscribers.has(event)) {
      this._subscribers.set(event, []);
    }
    this._subscribers.get(event).push(callback);
    return () => {
      const subs = this._subscribers.get(event);
      const idx = subs.indexOf(callback);
      if (idx > -1) subs.splice(idx, 1);
    };
  }

  _notify(event) {
    const subs = this._subscribers.get(event);
    if (subs) subs.forEach(cb => cb(this));
  }

  // ---- Serialization ----

  save() {
    const data = {
      palette: this._palette,
      projectName: this._projectName,
      activeDevice: this._activeDevice,
      isDark: this._isDark,
    };
    localStorage.setItem('pallete_project', JSON.stringify(data));
  }

  load() {
    try {
      const raw = localStorage.getItem('pallete_project');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.palette) {
        this._palette = { ...DEFAULT_PALETTE, ...data.palette };
        this._history = [JSON.stringify(this._palette)];
        this._historyIndex = 0;
      }
      if (data.projectName) this._projectName = data.projectName;
      if (data.activeDevice) this._activeDevice = data.activeDevice;
      if (typeof data.isDark === 'boolean') this.isDark = data.isDark;
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton
export const state = new AppState();
export { DEFAULT_PALETTE };

// ============================================
// PALLETE — AI Palette Generator
// ============================================

import { state } from './state.js';

/**
 * Curated palette presets indexed by mood × personality
 */
const PALETTES = {
  minimal: {
    professional: [
      { primary: '#6366f1', secondary: '#818cf8', accent: '#a78bfa', background: '#09090b', surface: '#18181b', text: '#fafafa', textSecondary: '#a1a1aa', border: '#27272a', success: '#22c55e', warning: '#eab308', error: '#ef4444' },
      { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd', background: '#0a0a0f', surface: '#1a1a2e', text: '#f1f5f9', textSecondary: '#94a3b8', border: '#1e293b', success: '#10b981', warning: '#f59e0b', error: '#f43f5e' },
      { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd', background: '#0c0a09', surface: '#1c1917', text: '#fafaf9', textSecondary: '#a8a29e', border: '#292524', success: '#34d399', warning: '#fbbf24', error: '#fb7185' },
    ],
    playful: [
      { primary: '#a855f7', secondary: '#d946ef', accent: '#f472b6', background: '#0f0a1a', surface: '#1a1025', text: '#faf5ff', textSecondary: '#c084fc', border: '#2e1065', success: '#4ade80', warning: '#facc15', error: '#fb923c' },
      { primary: '#ec4899', secondary: '#f472b6', accent: '#fb923c', background: '#0d0d0d', surface: '#1a1a1a', text: '#fff1f2', textSecondary: '#fda4af', border: '#2a2a2a', success: '#34d399', warning: '#fde047', error: '#f87171' },
    ],
    luxury: [
      { primary: '#d4af37', secondary: '#c9a96e', accent: '#e8d5b7', background: '#0a0908', surface: '#171411', text: '#faf7f2', textSecondary: '#c9bfa8', border: '#2a2520', success: '#86efac', warning: '#fcd34d', error: '#fca5a5' },
      { primary: '#b8a9c9', secondary: '#d8c4e9', accent: '#e8d5f5', background: '#0d0b10', surface: '#1a1720', text: '#f5f0fa', textSecondary: '#b8a9c9', border: '#2a2535', success: '#6ee7b7', warning: '#fde68a', error: '#fda4af' },
    ],
    techy: [
      { primary: '#06b6d4', secondary: '#22d3ee', accent: '#67e8f9', background: '#020617', surface: '#0f172a', text: '#e2e8f0', textSecondary: '#94a3b8', border: '#1e293b', success: '#4ade80', warning: '#fbbf24', error: '#f87171' },
      { primary: '#14b8a6', secondary: '#2dd4bf', accent: '#5eead4', background: '#042f2e', surface: '#0d3d3b', text: '#ccfbf1', textSecondary: '#5eead4', border: '#134e4a', success: '#34d399', warning: '#fcd34d', error: '#fb7185' },
    ],
  },
  vibrant: {
    professional: [
      { primary: '#7c3aed', secondary: '#2563eb', accent: '#06b6d4', background: '#0c0a1a', surface: '#15132b', text: '#f5f3ff', textSecondary: '#a5b4fc', border: '#1e1b4b', success: '#22c55e', warning: '#f59e0b', error: '#ef4444' },
    ],
    playful: [
      { primary: '#f43f5e', secondary: '#8b5cf6', accent: '#06b6d4', background: '#0a0a0a', surface: '#171717', text: '#fafafa', textSecondary: '#d4d4d8', border: '#262626', success: '#4ade80', warning: '#facc15', error: '#fb923c' },
      { primary: '#ff6b6b', secondary: '#feca57', accent: '#48dbfb', background: '#0d0d0d', surface: '#1a1a1a', text: '#ffffff', textSecondary: '#b0b0b0', border: '#2a2a2a', success: '#00d2d3', warning: '#ff9f43', error: '#ee5a24' },
    ],
    luxury: [
      { primary: '#e11d48', secondary: '#be185d', accent: '#db2777', background: '#0f0507', surface: '#1a0a10', text: '#fff1f2', textSecondary: '#fda4af', border: '#3f0520', success: '#34d399', warning: '#fcd34d', error: '#fb7185' },
    ],
    techy: [
      { primary: '#00ff88', secondary: '#00b4d8', accent: '#9b5de5', background: '#0a0a0f', surface: '#12121a', text: '#e0ffe0', textSecondary: '#88ffbb', border: '#1a1a2e', success: '#00ff88', warning: '#ffbe0b', error: '#ff006e' },
      { primary: '#39ff14', secondary: '#ff073a', accent: '#ff6ec7', background: '#0a0a0a', surface: '#141414', text: '#f0fff0', textSecondary: '#a0ffa0', border: '#222222', success: '#39ff14', warning: '#ffea00', error: '#ff073a' },
    ],
  },
  dark: {
    professional: [
      { primary: '#6366f1', secondary: '#4f46e5', accent: '#818cf8', background: '#030305', surface: '#0a0a10', text: '#e2e8f0', textSecondary: '#64748b', border: '#1e293b', success: '#22c55e', warning: '#eab308', error: '#ef4444' },
    ],
    playful: [
      { primary: '#c084fc', secondary: '#e879f9', accent: '#f0abfc', background: '#050208', surface: '#0d0815', text: '#faf5ff', textSecondary: '#d8b4fe', border: '#1e103a', success: '#86efac', warning: '#fde047', error: '#fda4af' },
    ],
    luxury: [
      { primary: '#a38555', secondary: '#c9a96e', accent: '#d4af37', background: '#050403', surface: '#0d0c08', text: '#f5f0e8', textSecondary: '#b8a88a', border: '#1a1810', success: '#6ee7b7', warning: '#fcd34d', error: '#fca5a5' },
    ],
    techy: [
      { primary: '#00d4ff', secondary: '#0099ff', accent: '#7b2ff7', background: '#000208', surface: '#050a15', text: '#cce5ff', textSecondary: '#6699cc', border: '#0a1a2e', success: '#00ff88', warning: '#ffbe0b', error: '#ff4757' },
    ],
  },
  pastel: {
    professional: [
      { primary: '#93c5fd', secondary: '#a5b4fc', accent: '#c4b5fd', background: '#0f172a', surface: '#1e293b', text: '#f1f5f9', textSecondary: '#94a3b8', border: '#334155', success: '#86efac', warning: '#fde68a', error: '#fca5a5' },
    ],
    playful: [
      { primary: '#f9a8d4', secondary: '#c4b5fd', accent: '#93c5fd', background: '#1a1025', surface: '#251838', text: '#fdf2f8', textSecondary: '#f0abfc', border: '#3b1f5e', success: '#a7f3d0', warning: '#fef08a', error: '#fecaca' },
    ],
    luxury: [
      { primary: '#e8d5b7', secondary: '#b8c1ec', accent: '#f7aef8', background: '#1a1a2e', surface: '#222240', text: '#f0eaf0', textSecondary: '#c8b8d8', border: '#2a2a48', success: '#bbf7d0', warning: '#fef3c7', error: '#fecdd3' },
    ],
    techy: [
      { primary: '#67e8f9', secondary: '#a5b4fc', accent: '#86efac', background: '#0c1220', surface: '#131b2e', text: '#e0f2fe', textSecondary: '#7dd3fc', border: '#1e3050', success: '#86efac', warning: '#fde68a', error: '#fda4af' },
    ],
  },
  corporate: {
    professional: [
      { primary: '#2563eb', secondary: '#3b82f6', accent: '#8b5cf6', background: '#0f172a', surface: '#1e293b', text: '#f8fafc', textSecondary: '#94a3b8', border: '#334155', success: '#22c55e', warning: '#f59e0b', error: '#ef4444' },
      { primary: '#0284c7', secondary: '#0ea5e9', accent: '#38bdf8', background: '#0c1524', surface: '#162032', text: '#f0f9ff', textSecondary: '#7dd3fc', border: '#1e3a5f', success: '#10b981', warning: '#eab308', error: '#f43f5e' },
    ],
    playful: [
      { primary: '#6366f1', secondary: '#ec4899', accent: '#14b8a6', background: '#0f0f1a', surface: '#1a1a2e', text: '#fafafa', textSecondary: '#a5a5c0', border: '#2a2a40', success: '#4ade80', warning: '#fbbf24', error: '#f87171' },
    ],
    luxury: [
      { primary: '#1e40af', secondary: '#1e3a8a', accent: '#312e81', background: '#020617', surface: '#0f172a', text: '#e2e8f0', textSecondary: '#64748b', border: '#1e293b', success: '#34d399', warning: '#fcd34d', error: '#fb7185' },
    ],
    techy: [
      { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#14b8a6', background: '#020617', surface: '#0f172a', text: '#e2e8f0', textSecondary: '#94a3b8', border: '#1e293b', success: '#4ade80', warning: '#fbbf24', error: '#f87171' },
    ],
  },
  neon: {
    professional: [
      { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a78bfa', background: '#05050a', surface: '#0f0f1a', text: '#e8e8ff', textSecondary: '#8888cc', border: '#1a1a35', success: '#00ff88', warning: '#ffea00', error: '#ff4444' },
    ],
    playful: [
      { primary: '#ff00ff', secondary: '#00ffff', accent: '#ffff00', background: '#0a0a0a', surface: '#151515', text: '#ffffff', textSecondary: '#cccccc', border: '#222222', success: '#00ff00', warning: '#ff8800', error: '#ff0055' },
    ],
    luxury: [
      { primary: '#ff6ec7', secondary: '#7b2ff7', accent: '#00d4ff', background: '#08050d', surface: '#120a1e', text: '#f5e6ff', textSecondary: '#b088d0', border: '#201438', success: '#39ff14', warning: '#ffbe0b', error: '#ff006e' },
    ],
    techy: [
      { primary: '#39ff14', secondary: '#ff073a', accent: '#ff6ec7', background: '#0a0a0f', surface: '#10101a', text: '#e0ffe0', textSecondary: '#80ff80', border: '#1a1a2e', success: '#39ff14', warning: '#ffea00', error: '#ff073a' },
      { primary: '#00ff88', secondary: '#00d4ff', accent: '#ff00ff', background: '#050508', surface: '#0a0a12', text: '#d0ffd0', textSecondary: '#60dd90', border: '#151520', success: '#00ff88', warning: '#ffff00', error: '#ff0044' },
    ],
  },
};

let selectedMood = 'minimal';
let selectedPersonality = 'professional';

export function initAiPalette() {
  // Mood chips
  document.getElementById('mood-chips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    selectedMood = chip.dataset.mood;
    document.querySelectorAll('#mood-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });

  // Personality chips
  document.getElementById('personality-chips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    selectedPersonality = chip.dataset.personality;
    document.querySelectorAll('#personality-chips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });

  // Generate button
  document.getElementById('btn-generate-palette')?.addEventListener('click', generatePalettes);
}

function generatePalettes() {
  const btn = document.getElementById('btn-generate-palette');
  const container = document.getElementById('ai-suggestions');
  if (!btn || !container) return;

  // Loading state
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Generating...';

  // Simulate AI processing
  setTimeout(() => {
    const moodPalettes = PALETTES[selectedMood];
    const personalityPalettes = moodPalettes?.[selectedPersonality] || [];

    // Also grab from other personalities in same mood for variety
    let allOptions = [...personalityPalettes];
    Object.entries(moodPalettes || {}).forEach(([key, palettes]) => {
      if (key !== selectedPersonality) {
        allOptions.push(...palettes);
      }
    });

    // Shuffle and pick up to 4
    allOptions = shuffleArray(allOptions).slice(0, 4);

    // Render suggestion cards
    container.innerHTML = allOptions.map((pal, i) => `
      <div class="ai-palette-card" data-palette-index="${i}">
        <div class="ai-palette-swatches">
          <span style="background:${pal.primary}"></span>
          <span style="background:${pal.secondary}"></span>
          <span style="background:${pal.accent}"></span>
          <span style="background:${pal.background}"></span>
          <span style="background:${pal.surface}"></span>
          <span style="background:${pal.text}"></span>
        </div>
        <button class="btn btn-secondary btn-sm ai-palette-apply">Apply</button>
      </div>
    `).join('');

    // Bind apply buttons
    container.querySelectorAll('.ai-palette-card').forEach((card, i) => {
      card.addEventListener('click', () => {
        state.setPalette(allOptions[i]);
      });
    });

    // Reset button
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      Regenerate
    `;
  }, 800);
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

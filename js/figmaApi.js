// ============================================
// MORPHUI — Figma API Integration
// ============================================

/**
 * Parse a Figma URL to extract file key and node ID
 * Supports: /design/, /file/, /proto/ URL formats
 */
export function parseFigmaUrl(url) {
  const match = url.match(/figma\.com\/(?:design|file|proto)\/([a-zA-Z0-9]+)/);
  if (!match) return null;

  const fileKey = match[1];
  const nodeIdMatch = url.match(/node-id=([^&]+)/);
  const nodeId = nodeIdMatch ? decodeURIComponent(nodeIdMatch[1]) : null;

  return { fileKey, nodeId };
}

// ---- Rate Limit Tracking ----

let _rateLimitedUntil = 0;

export function isRateLimited() {
  return Date.now() < _rateLimitedUntil;
}

export function getRateLimitWaitSeconds() {
  return Math.max(0, Math.ceil((_rateLimitedUntil - Date.now()) / 1000));
}

export function clearRateLimit() {
  _rateLimitedUntil = 0;
}

function handleRateLimit(res) {
  const retryAfter = res.headers.get('retry-after');
  let waitMs = 60000;
  if (retryAfter) {
    const parsed = parseInt(retryAfter, 10);
    if (!isNaN(parsed) && parsed > 0) {
      waitMs = Math.min(parsed * 1000, 60000);
    }
  }
  _rateLimitedUntil = Date.now() + waitMs;
  const waitSec = Math.ceil(waitMs / 1000);
  throw new Error(`Rate limited by Figma. Please wait ${waitSec}s and try again.`);
}

// ---- API Calls (exactly 2, both cached) ----

/**
 * Fetch file metadata from Figma API — with sessionStorage cache.
 * Used to list available frames. This is API call #1.
 */
export async function fetchFileData(fileKey, token) {
  const cacheKey = `morphui_figma_file_${fileKey}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      console.log('[Figma] Using cached file data');
      return JSON.parse(cached);
    } catch { /* cache corrupt, refetch */ }
  }

  if (isRateLimited()) {
    const wait = getRateLimitWaitSeconds();
    throw new Error(`Rate limited. Please wait ${wait}s before retrying.`);
  }

  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: { 'X-Figma-Token': token },
  });

  if (res.status === 429) handleRateLimit(res);
  if (res.status === 403) throw new Error('Invalid token or no access to this file.');
  if (res.status === 404) throw new Error('File not found. Check the Figma URL.');
  if (!res.ok) throw new Error(`Figma API error: ${res.status}`);

  const data = await res.json();

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {
    console.warn('[Figma] File too large to cache:', e.message);
  }

  return data;
}

/**
 * Fetch ONLY a single frame's node tree from Figma API — with cache.
 * Uses GET /v1/files/:key/nodes?ids=FRAME_ID (much lighter than full file).
 * This is API call #2 — only made once per frame selection.
 */
export async function fetchFrameNodes(fileKey, frameId, token) {
  const cacheKey = `morphui_figma_frame_${fileKey}_${frameId}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      console.log('[Figma] Using cached frame data for', frameId);
      return JSON.parse(cached);
    } catch { /* cache corrupt, refetch */ }
  }

  if (isRateLimited()) {
    const wait = getRateLimitWaitSeconds();
    throw new Error(`Rate limited. Please wait ${wait}s before retrying.`);
  }

  const encodedId = encodeURIComponent(frameId);
  const res = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodedId}`,
    { headers: { 'X-Figma-Token': token } }
  );

  if (res.status === 429) handleRateLimit(res);
  if (res.status === 403) throw new Error('Invalid token or no access.');
  if (res.status === 404) throw new Error('Frame not found.');
  if (!res.ok) throw new Error(`Figma API error: ${res.status}`);

  const data = await res.json();

  // Extract the actual node from the response
  const nodeData = data.nodes?.[frameId]?.document;
  if (!nodeData) throw new Error('Frame data not found in API response.');

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(nodeData));
  } catch (e) {
    console.warn('[Figma] Frame too large to cache:', e.message);
  }

  return nodeData;
}

// ---- Frame Discovery ----

/**
 * Walk the Figma document tree and collect top-level frame nodes.
 * Returns lightweight descriptors (no full node data).
 */
export function getTopFrames(fileData) {
  const frames = [];

  function walk(node, depth = 0) {
    if (depth === 2 && (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET')) {
      frames.push({
        id: node.id,
        name: node.name,
        width: node.absoluteBoundingBox?.width || 0,
        height: node.absoluteBoundingBox?.height || 0,
      });
    }
    if (node.children && depth < 2) {
      for (const child of node.children) {
        walk(child, depth + 1);
      }
    }
  }

  if (fileData.document) walk(fileData.document, 0);
  return frames;
}

// ---- Color Extraction ----

/**
 * Extract unique colors from a Figma node tree.
 * Works on both full file data and single frame node data.
 * Returns array of { hex, count, contexts } sorted by frequency.
 */
export function extractColorsFromNode(node) {
  const colorMap = new Map();

  function figmaColorToHex(c) {
    const r = Math.round((c.r || 0) * 255);
    const g = Math.round((c.g || 0) * 255);
    const b = Math.round((c.b || 0) * 255);
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function walk(n) {
    if (n.fills && Array.isArray(n.fills)) {
      for (const fill of n.fills) {
        if (fill.type === 'SOLID' && fill.color && fill.visible !== false) {
          const hex = figmaColorToHex(fill.color).toLowerCase();
          const entry = colorMap.get(hex) || { count: 0, contexts: new Set() };
          entry.count++;
          entry.contexts.add('fill');
          colorMap.set(hex, entry);
        }
      }
    }

    if (n.strokes && Array.isArray(n.strokes)) {
      for (const stroke of n.strokes) {
        if (stroke.type === 'SOLID' && stroke.color && stroke.visible !== false) {
          const hex = figmaColorToHex(stroke.color).toLowerCase();
          const entry = colorMap.get(hex) || { count: 0, contexts: new Set() };
          entry.count++;
          entry.contexts.add('stroke');
          colorMap.set(hex, entry);
        }
      }
    }

    if (n.children) {
      for (const child of n.children) walk(child);
    }
  }

  walk(node);

  return Array.from(colorMap.entries())
    .map(([hex, { count, contexts }]) => ({
      hex,
      count,
      contexts: Array.from(contexts),
    }))
    .sort((a, b) => b.count - a.count);
}

/** Legacy alias for backward compatibility */
export function extractColorsFromFile(fileData) {
  return extractColorsFromNode(fileData.document);
}

// ---- Color → Palette Mapping ----

/**
 * Auto-map extracted Figma colors to palette slots.
 * Uses heuristics: darkest → background, lightest → text, most saturated → primary, etc.
 */
export function autoMapColorsToPalette(figmaColors) {
  if (figmaColors.length === 0) return null;

  function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function getSaturation(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
  }

  const bySaturation = [...figmaColors].sort((a, b) => getSaturation(b.hex) - getSaturation(a.hex));
  const chromatic = figmaColors.filter(c => getSaturation(c.hex) > 0.15);
  const neutrals = figmaColors.filter(c => getSaturation(c.hex) <= 0.15);

  const palette = {};

  // Background: darkest neutral
  const darkNeutrals = neutrals.filter(c => getLuminance(c.hex) < 0.3);
  palette.background = darkNeutrals.length > 0
    ? darkNeutrals.sort((a, b) => getLuminance(a.hex) - getLuminance(b.hex))[0].hex
    : '#09090b';

  // Surface: slightly lighter than background
  const surfaceCandidates = neutrals.filter(c => {
    const l = getLuminance(c.hex);
    return l > getLuminance(palette.background) && l < 0.4;
  });
  palette.surface = surfaceCandidates.length > 0 ? surfaceCandidates[0].hex : '#1e1e24';

  // Text: lightest neutral
  const lightNeutrals = neutrals.filter(c => getLuminance(c.hex) > 0.7);
  palette.text = lightNeutrals.length > 0
    ? lightNeutrals.sort((a, b) => getLuminance(b.hex) - getLuminance(a.hex))[0].hex
    : '#f4f4f5';

  // Text secondary: medium-light neutral
  const medNeutrals = neutrals.filter(c => {
    const l = getLuminance(c.hex);
    return l > 0.3 && l < 0.7;
  });
  palette.textSecondary = medNeutrals.length > 0 ? medNeutrals[0].hex : '#a1a1aa';

  // Border: dark-ish neutral
  const borderCandidates = neutrals.filter(c => {
    const l = getLuminance(c.hex);
    return l > 0.1 && l < 0.3;
  });
  palette.border = borderCandidates.length > 0 ? borderCandidates[0].hex : '#27272a';

  // Primary: most frequent chromatic color
  palette.primary = chromatic[0]?.hex || bySaturation[0]?.hex || '#818cf8';

  // Secondary: second most frequent chromatic
  const secondChromatic = chromatic.filter(c => c.hex !== palette.primary);
  palette.secondary = secondChromatic[0]?.hex || '#c084fc';

  // Accent: most saturated (not primary/secondary)
  const accentCandidates = bySaturation.filter(
    c => c.hex !== palette.primary && c.hex !== palette.secondary && getSaturation(c.hex) > 0.15
  );
  palette.accent = accentCandidates[0]?.hex || '#f472b6';

  // Semantic: keep defaults
  palette.success = '#34d399';
  palette.warning = '#fbbf24';
  palette.error = '#f87171';

  return palette;
}

// ---- Token Validation ----

export function isValidToken(token) {
  return token && token.length > 10 && (token.startsWith('figd_') || token.length > 20);
}

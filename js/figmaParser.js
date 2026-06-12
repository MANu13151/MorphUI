// ============================================
// MORPHUI — Figma Node Parser
// Transforms raw Figma JSON into internal schema
// ============================================

/**
 * Parse a single Figma frame node tree into an internal schema.
 *
 * @param {Object} frameNode - Full frame node from Figma API (with children)
 * @param {Object} colorMapping - { hexColor: paletteSlotKey } from autoMapColorsToPalette
 * @returns {Object} Internal schema tree ready for rendering
 */
export function parseFrame(frameNode, colorMapping = {}) {
  const frameBBox = frameNode.absoluteBoundingBox || { x: 0, y: 0, width: 400, height: 600 };

  return {
    id: frameNode.id,
    name: frameNode.name || 'Frame',
    type: 'frame',
    figmaType: frameNode.type,
    x: 0,
    y: 0,
    width: frameBBox.width,
    height: frameBBox.height,
    fill: resolveColor(getSolidFill(frameNode), colorMapping),
    stroke: resolveColor(getSolidStroke(frameNode), colorMapping),
    strokeWeight: frameNode.strokeWeight || 0,
    radius: getRadius(frameNode),
    opacity: frameNode.opacity ?? 1,
    shadow: getShadow(frameNode),
    clipsContent: frameNode.clipsContent ?? true,
    children: parseChildren(frameNode, frameBBox, frameBBox, colorMapping),
  };
}

/**
 * Recursively parse children of a node.
 */
function parseChildren(parentNode, frameBBox, parentBBox, colorMapping, depth = 0) {
  if (!parentNode.children || depth > 12) return [];

  const SUPPORTED_TYPES = ['FRAME', 'GROUP', 'TEXT', 'RECTANGLE', 'ELLIPSE', 'COMPONENT', 'INSTANCE', 'VECTOR', 'LINE', 'BOOLEAN_OPERATION'];

  return parentNode.children
    .filter(child => child.visible !== false && SUPPORTED_TYPES.includes(child.type))
    .map(child => parseNode(child, frameBBox, parentBBox, colorMapping, depth + 1))
    .filter(Boolean);
}

/**
 * Parse a single node into internal schema.
 */
function parseNode(node, frameBBox, parentBBox, colorMapping, depth) {
  const bbox = node.absoluteBoundingBox;
  if (!bbox) return null;

  const fill = getSolidFill(node);
  const gradientFill = getGradientFill(node);
  const stroke = getSolidStroke(node);
  const textData = getTextData(node);
  const hasImage = hasImageFill(node);

  const schema = {
    id: node.id,
    name: node.name || '',
    type: classifyNode(node, bbox, frameBBox),
    figmaType: node.type,
    // Position relative to PARENT, not frame — critical for nested DOM
    x: Math.round(bbox.x - parentBBox.x),
    y: Math.round(bbox.y - parentBBox.y),
    width: Math.round(bbox.width),
    height: Math.round(bbox.height),
    // For TEXT nodes, fill = text color, NOT background — skip fill
    fill: (node.type === 'TEXT') ? null : resolveColor(fill, colorMapping),
    gradient: gradientFill ? resolveGradient(gradientFill, colorMapping) : null,
    hasImage,
    stroke: resolveColor(stroke, colorMapping),
    strokeWeight: node.strokeWeight || 0,
    radius: getRadius(node),
    opacity: node.opacity ?? 1,
    shadow: getShadow(node),
    clipsContent: node.clipsContent ?? false,
    // Text properties
    text: textData?.text || null,
    fontSize: textData?.fontSize || null,
    fontWeight: textData?.fontWeight || null,
    fontFamily: textData?.fontFamily || null,
    lineHeight: textData?.lineHeight || null,
    letterSpacing: textData?.letterSpacing || null,
    textAlign: textData?.textAlign || null,
    textAlignV: textData?.textAlignV || null,
    textColor: textData?.textColor ? resolveColor(textData.textColor, colorMapping) : null,
    // Children — pass THIS node's bbox as the parent bbox
    children: parseChildren(node, frameBBox, bbox, colorMapping, depth),
  };

  return schema;
}

// ============================================
// Node Classification (heuristics)
// ============================================

function classifyNode(node, bbox, frameBBox) {
  const w = bbox.width;
  const h = bbox.height;
  const ratio = w / h;
  const frameW = frameBBox.width;
  const frameH = frameBBox.height;
  const relW = w / frameW;
  const relH = h / frameH;
  const fill = getSolidFill(node);
  const hasChildren = node.children && node.children.length > 0;
  const hasText = node.type === 'TEXT';
  const childHasText = hasChildren && node.children.some(c => c.type === 'TEXT');

  // TEXT node
  if (hasText) return 'text-block';

  // VECTOR / LINE → icon or divider
  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') return 'icon-placeholder';
  if (node.type === 'LINE') return 'divider';

  // ELLIPSE → avatar or icon
  if (node.type === 'ELLIPSE') return w < 60 ? 'icon-placeholder' : 'container';

  // Very thin → divider
  if ((h <= 3 && w > 20) || (w <= 3 && h > 20)) return 'divider';

  // Button: small-ish rect with text, saturated fill
  if (childHasText && w < 300 && h < 70 && h > 20 && fill) {
    const sat = getSaturation(fill);
    if (sat > 0.15) return 'button';
  }

  // Input: rect with stroke, no fill or light fill, has typical input proportions
  if (w > 100 && h > 25 && h < 65 && ratio > 2.5) {
    const hasStroke = getSolidStroke(node);
    if (hasStroke && !fill) return 'input';
    if (hasStroke && fill) {
      const lum = getLuminance(fill);
      if (lum < 0.15 || lum > 0.85) return 'input';
    }
  }

  // Navbar: full-width at top
  if (relW > 0.85 && h < 80 && bbox.y - frameBBox.y < 10) return 'navbar';

  // Sidebar: tall narrow on left
  if (relH > 0.6 && w < frameW * 0.35 && bbox.x - frameBBox.x < 10) return 'sidebar';

  // Card: medium rect with children, has radius or shadow
  if (hasChildren && w > 60 && h > 60 && (getRadius(node) > 0 || getShadow(node))) {
    return 'card';
  }

  // Container: has children
  if (hasChildren) return 'container';

  // Small icon-ish things
  if (w < 40 && h < 40) return 'icon-placeholder';

  return 'container';
}

// ============================================
// Color Utilities
// ============================================

function figmaColorToHex(c) {
  if (!c) return null;
  const r = Math.round((c.r || 0) * 255);
  const g = Math.round((c.g || 0) * 255);
  const b = Math.round((c.b || 0) * 255);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function getSolidFill(node) {
  if (!node.fills || !Array.isArray(node.fills)) return null;
  const solid = node.fills.find(f => f.type === 'SOLID' && f.visible !== false);
  if (!solid?.color) return null;
  return figmaColorToHex(solid.color);
}

function getGradientFill(node) {
  if (!node.fills || !Array.isArray(node.fills)) return null;
  return node.fills.find(f =>
    (f.type === 'GRADIENT_LINEAR' || f.type === 'GRADIENT_RADIAL') && f.visible !== false
  ) || null;
}

function getSolidStroke(node) {
  if (!node.strokes || !Array.isArray(node.strokes)) return null;
  const s = node.strokes.find(s => s.type === 'SOLID' && s.visible !== false);
  if (!s?.color) return null;
  return figmaColorToHex(s.color);
}

function hasImageFill(node) {
  if (!node.fills || !Array.isArray(node.fills)) return false;
  return node.fills.some(f => f.type === 'IMAGE' && f.visible !== false);
}

/**
 * Resolve a hex color to a CSS variable reference, or keep the raw hex.
 * colorMapping = { '#818cf8': 'primary', '#09090b': 'background', ... }
 * Returns: { var: '--p-primary', hex: '#818cf8' } or { var: null, hex: '#aabbcc' }
 */
function resolveColor(hex, colorMapping) {
  if (!hex) return null;
  const lowerHex = hex.toLowerCase();
  const slot = colorMapping[lowerHex];
  return {
    var: slot ? `--p-${slot}` : null,
    hex: lowerHex,
  };
}

function resolveGradient(gradFill, colorMapping) {
  if (!gradFill?.gradientStops) return null;
  const stops = gradFill.gradientStops.map(s => ({
    color: resolveColor(figmaColorToHex(s.color), colorMapping),
    position: Math.round(s.position * 100),
  }));
  return {
    type: gradFill.type === 'GRADIENT_LINEAR' ? 'linear' : 'radial',
    stops,
  };
}

function getRadius(node) {
  if (node.cornerRadius) return node.cornerRadius;
  if (node.rectangleCornerRadii) {
    const [a, b, c, d] = node.rectangleCornerRadii;
    if (a === b && b === c && c === d) return a;
    return { tl: a, tr: b, br: c, bl: d };
  }
  return 0;
}

function getShadow(node) {
  if (!node.effects || !Array.isArray(node.effects)) return null;
  const shadows = node.effects
    .filter(e => e.type === 'DROP_SHADOW' && e.visible !== false)
    .map(e => {
      const c = e.color || { r: 0, g: 0, b: 0, a: 0.25 };
      const x = e.offset?.x || 0;
      const y = e.offset?.y || 0;
      const blur = e.radius || 0;
      const a = c.a ?? 0.25;
      return `${x}px ${y}px ${blur}px rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a.toFixed(2)})`;
    });
  return shadows.length > 0 ? shadows.join(', ') : null;
}

function getTextData(node) {
  if (node.type !== 'TEXT' || !node.characters) return null;

  const textFill = getSolidFill(node);

  return {
    text: node.characters,
    fontSize: node.style?.fontSize || 14,
    fontWeight: node.style?.fontWeight || 400,
    fontFamily: node.style?.fontFamily || 'Inter',
    lineHeight: node.style?.lineHeightPx || null,
    letterSpacing: node.style?.letterSpacing || null,
    textAlign: node.style?.textAlignHorizontal || 'LEFT',
    textAlignV: node.style?.textAlignVertical || 'TOP',
    textColor: textFill,
  };
}

function getLuminance(hex) {
  if (!hex) return 0.5;
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getSaturation(hex) {
  if (!hex) return 0;
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

/**
 * Build a reverse color mapping from autoMapColorsToPalette result.
 * Input:  { primary: '#818cf8', background: '#09090b', ... }
 * Output: { '#818cf8': 'primary', '#09090b': 'background', ... }
 */
export function buildColorMapping(paletteMap) {
  if (!paletteMap) return {};
  const mapping = {};
  for (const [slot, hex] of Object.entries(paletteMap)) {
    if (hex) mapping[hex.toLowerCase()] = slot;
  }
  return mapping;
}

/**
 * Walk a parsed schema tree and build a usage map:
 * { slotName: [{ name, type, id, context }] }
 *
 * This tells us exactly which Figma elements use each palette color,
 * enabling usage counts, semantic labels, and click-to-highlight.
 */
export function buildUsageMap(schema) {
  const usageMap = {};

  function addUsage(slot, node, context) {
    if (!slot) return;
    if (!usageMap[slot]) usageMap[slot] = [];
    // Avoid duplicates for the same node
    if (!usageMap[slot].some(e => e.id === node.id && e.context === context)) {
      usageMap[slot].push({
        name: node.name || 'Unnamed',
        type: node.type || 'container',
        id: node.id,
        context, // 'fill', 'stroke', 'text', 'gradient'
      });
    }
  }

  function walk(node) {
    if (!node) return;

    // Check fill
    if (node.fill?.var) {
      addUsage(node.fill.var.replace('--p-', ''), node, 'fill');
    }

    // Check stroke
    if (node.stroke?.var) {
      addUsage(node.stroke.var.replace('--p-', ''), node, 'stroke');
    }

    // Check text color
    if (node.textColor?.var) {
      addUsage(node.textColor.var.replace('--p-', ''), node, 'text');
    }

    // Check gradient stops
    if (node.gradient?.stops) {
      for (const stop of node.gradient.stops) {
        if (stop.color?.var) {
          addUsage(stop.color.var.replace('--p-', ''), node, 'gradient');
        }
      }
    }

    // Recurse into children
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }

  walk(schema);
  return usageMap;
}

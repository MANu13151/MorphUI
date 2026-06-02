// ============================================
// MorphUI Sync — Figma Plugin (Sandbox Code)
// Traverses nodes and replaces fill colors
// ============================================

figma.showUI(__html__, { width: 420, height: 520, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'apply-palette') {
    const mappings = msg.mappings; // [{ from: '#hex', to: '#hex', slot, slotLabel }]
    if (!mappings || mappings.length === 0) {
      figma.ui.postMessage({ type: 'result', changed: 0, error: 'No color changes to apply.' });
      return;
    }

    try {
      // Build lookup: from-hex → to-hex (both lowercased, without #)
      const colorLookup = {};
      for (const m of mappings) {
        const fromKey = normalizeHex(m.from);
        colorLookup[fromKey] = m.to;
      }

      let changedCount = 0;
      const page = figma.currentPage;

      // Traverse all nodes on current page
      const allNodes = page.findAll();

      for (const node of allNodes) {
        // Replace fills
        if ('fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
          const newFills = [];
          let fillChanged = false;

          for (const fill of node.fills) {
            if (fill.type === 'SOLID') {
              const hex = rgbToHex(fill.color);
              const match = colorLookup[hex];
              if (match) {
                newFills.push(figma.util.solidPaint(match, { opacity: fill.opacity }));
                fillChanged = true;
                continue;
              }
            }
            newFills.push({ fill });
          }

          if (fillChanged) {
            node.fills = newFills;
            changedCount++;
          }
        }

        // Replace strokes
        if ('strokes' in node && node.strokes !== figma.mixed && Array.isArray(node.strokes)) {
          const newStrokes = [];
          let strokeChanged = false;

          for (const stroke of node.strokes) {
            if (stroke.type === 'SOLID') {
              const hex = rgbToHex(stroke.color);
              const match = colorLookup[hex];
              if (match) {
                newStrokes.push(figma.util.solidPaint(match, { opacity: stroke.opacity }));
                strokeChanged = true;
                continue;
              }
            }
            newStrokes.push({ stroke });
          }

          if (strokeChanged) {
            node.strokes = newStrokes;
          }
        }
      }

      figma.ui.postMessage({
        type: 'result',
        changed: changedCount,
        total: allNodes.length,
      });

      figma.notify(`✅ MorphUI Sync: Updated ${changedCount} nodes!`);

    } catch (err) {
      figma.ui.postMessage({
        type: 'result',
        changed: 0,
        error: err.message || 'Unknown error',
      });
    }
  }

  if (msg.type === 'preview') {
    const mappings = msg.mappings;
    if (!mappings || mappings.length === 0) {
      figma.ui.postMessage({ type: 'preview-result', counts: {} });
      return;
    }

    const colorLookup = {};
    for (const m of mappings) {
      colorLookup[normalizeHex(m.from)] = m.slot;
    }

    const counts = {};
    const page = figma.currentPage;
    const allNodes = page.findAll();

    for (const node of allNodes) {
      if ('fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
        for (const fill of node.fills) {
          if (fill.type === 'SOLID') {
            const hex = rgbToHex(fill.color);
            const slot = colorLookup[hex];
            if (slot) {
              counts[slot] = (counts[slot] || 0) + 1;
            }
          }
        }
      }
    }

    figma.ui.postMessage({ type: 'preview-result', counts });
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// ---- Helpers ----

function rgbToHex(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function normalizeHex(hex) {
  return hex.toLowerCase().replace(/^#/, '#');
}

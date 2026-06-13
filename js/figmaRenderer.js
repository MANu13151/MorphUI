// ============================================
// MORPHUI — Figma Reconstruction Renderer
// Renders internal schema as HTML/CSS using CSS variables
// ============================================

/**
 * Render a parsed frame schema into a DOM container.
 * Colors are bound to CSS variables for instant live updates.
 *
 * @param {Object} schema - Parsed frame schema from figmaParser.parseFrame()
 * @param {HTMLElement} container - DOM container to render into
 * @param {Object} palette - Current palette { primary: '#818cf8', ... }
 */
export function renderReconstruction(schema, container, palette) {
  container.innerHTML = '';

  // Apply palette as CSS custom properties on the container
  applyPaletteVariables(container, palette);

  // Create the frame wrapper
  const frame = document.createElement('div');
  frame.className = 'rc-frame';
  frame.dataset.nodeId = schema.id;
  frame.dataset.nodeType = schema.type;
  frame.style.cssText = `
    position: relative;
    width: ${schema.width}px;
    height: ${schema.height}px;
    overflow: ${schema.clipsContent ? 'hidden' : 'visible'};
    transform-origin: top left;
  `;

  // Frame background
  applyFill(frame, schema.fill, schema.gradient);
  applyRadius(frame, schema.radius);
  if (schema.shadow) frame.style.boxShadow = schema.shadow;

  // Render children
  if (schema.children) {
    schema.children.forEach(child => {
      const el = renderNode(child);
      if (el) frame.appendChild(el);
    });
  }

  // Scale to fit container
  const containerRect = container.getBoundingClientRect();
  const padX = 32, padY = 32;
  const scaleX = (containerRect.width - padX) / schema.width;
  const scaleY = (containerRect.height - padY) / schema.height;
  const scale = Math.min(scaleX, scaleY, 1);

  const wrapper = document.createElement('div');
  wrapper.className = 'rc-wrapper';
  wrapper.style.cssText = `
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    overflow: auto;
  `;

  frame.style.transform = `scale(${scale.toFixed(4)})`;
  frame.style.flexShrink = '0';
  frame.style.margin = 'auto'; // Magic trick to center without clipping

  wrapper.appendChild(frame);
  container.appendChild(wrapper);
}

/**
 * Update CSS variables on the reconstruction container.
 * This is the ONLY function called on palette change — no re-rendering needed.
 */
export function applyPaletteVariables(container, palette) {
  if (!container || !palette) return;
  for (const [slot, hex] of Object.entries(palette)) {
    container.style.setProperty(`--p-${slot}`, hex);
  }
}

// ============================================
// Node Rendering
// ============================================

function renderNode(node) {
  if (!node) return null;

  const el = document.createElement('div');
  el.className = `rc-node rc-${node.type}`;
  el.dataset.nodeId = node.id;
  el.dataset.nodeType = node.type;
  el.dataset.nodeName = node.name;

  // Position & size
  el.style.position = 'absolute';
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;
  el.style.width = `${node.width}px`;
  el.style.height = `${node.height}px`;

  // Opacity
  if (node.opacity < 1) el.style.opacity = node.opacity;

  // Fill
  applyFill(el, node.fill, node.gradient);

  // Image placeholder
  if (node.hasImage) {
    el.style.background = 'linear-gradient(135deg, #e2e2e2 0%, #c8c8c8 50%, #e2e2e2 100%)';
    el.style.backgroundSize = '200% 200%';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.overflow = 'hidden';
    const icon = document.createElement('span');
    icon.textContent = '🖼';
    icon.style.cssText = 'font-size:16px;opacity:0.4;';
    el.appendChild(icon);
  }

  // Stroke
  if (node.stroke && node.strokeWeight) {
    applyStroke(el, node.stroke, node.strokeWeight);
  }

  // Border radius
  applyRadius(el, node.radius);

  // Shadow
  if (node.shadow) el.style.boxShadow = node.shadow;

  // Clipping
  if (node.clipsContent) el.style.overflow = 'hidden';

  // Text content
  if (node.text) {
    renderText(el, node);
  }

  // Transitions for smooth color updates
  el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';

  // Children
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const childEl = renderNode(child);
      if (childEl) el.appendChild(childEl);
    });
  }

  return el;
}

// ============================================
// Style Application
// ============================================

function applyFill(el, fill, gradient) {
  if (gradient) {
    const stops = gradient.stops.map(s => {
      const color = s.color?.var ? `var(${s.color.var})` : (s.color?.hex || 'transparent');
      return `${color} ${s.position}%`;
    }).join(', ');

    if (gradient.type === 'linear') {
      el.style.background = `linear-gradient(135deg, ${stops})`;
    } else {
      el.style.background = `radial-gradient(circle, ${stops})`;
    }

    const hexes = gradient.stops.map(s => s.color?.hex?.toLowerCase()).filter(Boolean);
    if (hexes.length > 0) {
      el.dataset.fillHex = hexes.join(',');
    }
    return;
  }

  if (!fill) return;

  if (fill.var) {
    el.style.backgroundColor = `var(${fill.var})`;
    el.dataset.fillVar = fill.var;
  } else {
    el.style.backgroundColor = fill.hex;
  }
  el.dataset.fillHex = fill.hex.toLowerCase();
}

function applyStroke(el, stroke, weight) {
  if (!stroke) return;
  const color = stroke.var ? `var(${stroke.var})` : stroke.hex;
  el.style.border = `${weight}px solid ${color}`;
  if (stroke.var) el.dataset.strokeVar = stroke.var;
  el.dataset.strokeHex = stroke.hex.toLowerCase();
}

function applyRadius(el, radius) {
  if (!radius) return;
  if (typeof radius === 'number') {
    el.style.borderRadius = `${radius}px`;
  } else if (typeof radius === 'object') {
    el.style.borderRadius = `${radius.tl}px ${radius.tr}px ${radius.br}px ${radius.bl}px`;
  }
}

function renderText(el, node) {
  el.textContent = node.text;
  el.style.overflow = 'hidden';

  // Flex for alignment
  el.style.display = 'flex';
  el.style.alignItems =
    node.textAlignV === 'CENTER' ? 'center' :
    node.textAlignV === 'BOTTOM' ? 'flex-end' : 'flex-start';
  el.style.justifyContent =
    node.textAlign === 'CENTER' ? 'center' :
    node.textAlign === 'RIGHT' ? 'flex-end' : 'flex-start';

  // Typography
  if (node.fontSize) el.style.fontSize = `${node.fontSize}px`;
  if (node.fontWeight) el.style.fontWeight = node.fontWeight;
  if (node.fontFamily) el.style.fontFamily = `"${node.fontFamily}", "Inter", sans-serif`;
  if (node.lineHeight) el.style.lineHeight = `${node.lineHeight}px`;
  if (node.letterSpacing) el.style.letterSpacing = `${node.letterSpacing}px`;

  // Text color via CSS variable
  if (node.textColor) {
    if (node.textColor.var) {
      el.style.color = `var(${node.textColor.var})`;
      el.dataset.textVar = node.textColor.var;
    } else {
      el.style.color = node.textColor.hex;
    }
    el.dataset.textHex = node.textColor.hex.toLowerCase();
  }
}

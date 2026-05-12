<div align="center">

# ✦ Chromiq

### AI-Powered Figma Theme Reconstruction Engine

*Paste a Figma URL → remix its entire color system → push it back — instantly.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-6366f1?style=for-the-badge&logo=vercel)](https://github.com/MANu13151/Chromiq)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)](LICENSE)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Figma Plugin](https://img.shields.io/badge/Figma-Plugin%20Ready-f472b6?style=for-the-badge&logo=figma)](figma-plugin/)

</div>

---

## What is Chromiq?

**Chromiq** is a browser-based design tool that connects directly to your Figma files and lets you completely retheme them in seconds. Feed it a Figma frame URL and a personal access token — it parses every color in your design, maps them to a structured 12-slot palette, and renders a pixel-faithful live preview that updates in real time as you edit colors.

When you're happy with the new theme, the bundled **Figma plugin** pushes the changes straight back into your actual Figma file — no copy-pasting hex values, no manual find-and-replace.

---

## ✨ Feature Highlights

| Feature | Description |
|---|---|
| 🎨 **AI Palette Generator** | 6 moods × 4 personalities = 60+ curated palette presets, shuffled & surfaced instantly |
| 🔗 **Figma REST API Integration** | Fetch any publicly shared or token-authenticated Figma frame in real time |
| 🧩 **Smart Node Parser** | Recursively traverses frames, groups, text, vectors, gradients, shadows & effects |
| 🖼 **Live Canvas Preview** | Pixel-accurate DOM renderer mirrors your Figma design with hot-swappable CSS variables |
| 🔁 **Two-Way Figma Sync** | Figma plugin (`Pallete Sync`) applies palette changes back to fills & strokes on every node |
| ♿ **WCAG Accessibility Checks** | Real-time contrast ratio scoring on all text/background color pairs |
| 📤 **Export Panel** | Copy CSS custom properties, Tailwind config tokens, or JSON color maps |
| 🌈 **Color Editor** | Full HEX / HSL picker with live preview for manual overrides |
| 🔔 **Toast Notification System** | Non-intrusive feedback for every async action |
| ⚡ **SPA Router** | Zero-dependency hash-based routing (Landing → Workspace) with smooth transitions |

---

## 🏗 Architecture

```
chromiq/
├── index.html                  # SPA shell — single <div id="app">
├── vite.config.js              # Vite build config
│
├── css/
│   ├── variables.css           # Design tokens (12 palette CSS vars + typography)
│   ├── reset.css               # Modern CSS reset
│   ├── animations.css          # Keyframe & transition library
│   ├── components.css          # Shared UI components (buttons, chips, modals)
│   ├── landing.css             # Landing page styles
│   └── workspace.css           # Workspace layout & panels
│
├── js/
│   ├── main.js                 # Entry — bootstraps router
│   ├── router.js               # Hash-based SPA router
│   ├── state.js                # Global reactive state (palette, mappings, frame data)
│   ├── colorUtils.js           # HEX↔HSL↔RGB conversions, contrast math
│   ├── colorEditor.js          # Color picker UI component
│   ├── aiPalette.js            # Mood × personality palette engine
│   ├── figmaApi.js             # Figma REST API client
│   ├── figmaParser.js          # Figma node tree → internal schema
│   ├── figmaRenderer.js        # Internal schema → live DOM canvas
│   ├── livePreview.js          # CSS variable injection + preview orchestration
│   ├── exportPanel.js          # CSS / Tailwind / JSON export formatters
│   ├── accessibility.js        # WCAG AA/AAA contrast checker
│   ├── toast.js                # Toast notification helper
│   └── views/
│       ├── landingView.js      # Landing page: URL input + token form
│       └── workspaceView.js    # Full workspace: panels, mapping, preview
│
└── figma-plugin/
    ├── manifest.json           # Figma plugin manifest
    ├── code.js                 # Plugin sandbox — node traversal & color replacement
    └── ui.html                 # Plugin iframe UI — palette import & apply controls
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A [Figma Personal Access Token](https://www.figma.com/developers/api#access-tokens)

### 1. Clone & Install

```bash
git clone https://github.com/MANu13151/Chromiq.git
cd Chromiq
npm install
```

### 2. Run Dev Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Use It

1. **Paste a Figma URL** — any frame or component URL (e.g. `https://www.figma.com/file/...`)
2. **Enter your Figma Personal Access Token** — generated in Figma → Settings → Personal Access Tokens
3. Chromiq fetches the frame, parses all colors, and renders a live preview
4. **Edit the palette** manually or hit **AI Generate** to get instant suggestions
5. Use the **Export Panel** to copy the theme as CSS variables, Tailwind config, or JSON

---

## 🔌 Figma Plugin: Pallete Sync

The companion plugin lets you push the remixed palette directly back into your Figma file.

### Install (Development / Local)

1. Open **Figma Desktop**
2. Go to **Plugins → Development → Import plugin from manifest**
3. Select `figma-plugin/manifest.json` from this repo
4. The plugin appears under **Plugins → Development → Pallete Sync**

### How It Works

```
Browser App (Chromiq)
        │
        │  Color mappings: [{ from: '#6366f1', to: '#ff6ec7', slot: 'primary' }, ...]
        ▼
Figma Plugin (Pallete Sync)
        │
        │  figma.currentPage.findAll()
        │  Replace SOLID fills & strokes matching `from` → `to`
        ▼
Your Figma File  ✅  All nodes updated
```

The plugin traverses **every node** on the current page — frames, groups, text, shapes, components — and replaces matching solid fills and strokes. It also has a **preview mode** that counts how many nodes will be affected before committing.

---

## 🎨 AI Palette Engine

The palette engine is organized along two axes:

| Axis | Options |
|---|---|
| **Mood** | `minimal` · `vibrant` · `dark` · `pastel` · `corporate` · `neon` |
| **Personality** | `professional` · `playful` · `luxury` · `techy` |

Each combination maps to a curated set of 12-token palettes (`primary`, `secondary`, `accent`, `background`, `surface`, `text`, `textSecondary`, `border`, `success`, `warning`, `error`). The generator shuffles across all personality variants in the selected mood and surfaces 4 options instantly.

---

## 📦 Build for Production

```bash
npm run build
```

Output is in the `dist/` folder — deploy anywhere (Vercel, Netlify, GitHub Pages, etc.).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Bundler | [Vite 6](https://vitejs.dev) |
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Vanilla CSS with CSS Custom Properties |
| Typography | [Inter](https://rsms.me/inter/) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |
| Design API | [Figma REST API v1](https://www.figma.com/developers/api) |
| Plugin Runtime | Figma Plugin API |
| Dependencies | **Zero runtime dependencies** |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © [MANu13151](https://github.com/MANu13151)

---

<div align="center">
  <sub>Built with ✦ and a lot of palette iterations</sub>
</div>

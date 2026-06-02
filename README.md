<div align="center">

# ✦ MorphUI

### AI-Powered Design Color Customization Platform

*Paste a Figma URL → remix its entire color system → push it back — instantly.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-ff6b4a?style=for-the-badge)](https://huggingface.co/spaces/Prakhar132/MorphUI)
[![License](https://img.shields.io/badge/License-MIT-f5a623?style=for-the-badge)](LICENSE)
[![Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Figma Plugin](https://img.shields.io/badge/Figma-Plugin%20Ready-2dd4a8?style=for-the-badge&logo=figma)](figma-plugin/)

</div>

---

## What is MorphUI?

**MorphUI** is a browser-based design tool that connects directly to your Figma files and lets you completely retheme them in seconds. Feed it a Figma frame URL and a personal access token — it parses every color in your design, maps them to a structured 12-slot palette, and renders a pixel-faithful live preview that updates in real time as you edit colors.

When you're happy with the new theme, the bundled **Figma plugin** pushes the changes straight back into your actual Figma file — no copy-pasting hex values, no manual find-and-replace.

---

## ✨ Feature Highlights

| Feature | Description |
|---|---|
| 🎨 **AI Palette Generator** | 6 moods × 4 personalities = 60+ curated palette presets |
| 🔗 **Figma REST API Integration** | Fetch any frame via URL + token |
| 🧩 **Smart Node Parser** | Recursively parses frames, text, vectors, gradients, shadows |
| 🖼 **Live Canvas Preview** | DOM renderer with hot-swappable CSS variables |
| 🔁 **Two-Way Figma Sync** | Plugin pushes palette changes back to fills & strokes |
| ♿ **WCAG Accessibility** | Real-time contrast ratio scoring |
| 📤 **Export Panel** | CSS variables, Tailwind config, JSON tokens |
| 🌈 **Color Editor** | Full HEX/HSL picker with live preview |
| 💬 **Feedback Widget** | Built-in support for suggestions and bug reports |
| ⚡ **Zero Dependencies** | Pure Vite + Vanilla JS, no runtime deps |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A [Figma Personal Access Token](https://www.figma.com/developers/api#access-tokens)

### 1. Clone & Install

```bash
git clone https://github.com/MANu13151/MorphUI.git
cd MorphUI
npm install
```

### 2. Run Dev Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Use It

1. **Paste a Figma URL** and your **Personal Access Token** on the landing page
2. MorphUI fetches the frame, parses all colors, and renders a live preview
3. **Edit the palette** manually or hit **AI Generate** for instant suggestions
4. **Export** as CSS variables, Tailwind config, or JSON

---

## 🔌 Figma Plugin: MorphUI Sync

The companion plugin pushes your remixed palette directly back into your Figma file.

### Quick Setup (One-Time)

1. Download the plugin files from the app or [clone this repo](https://github.com/MANu13151/MorphUI)
2. Open **Figma Desktop** (plugin dev requires the desktop app)
3. Go to **Menu → Plugins → Development → Import plugin from manifest**
4. Select `figma-plugin/manifest.json`
5. Done! Find it under **Plugins → Development → MorphUI Sync**

---

## 🏗 Architecture

```
morphui/
├── index.html
├── vite.config.js
├── css/
│   ├── variables.css       # Design tokens
│   ├── reset.css           # CSS reset
│   ├── animations.css      # Keyframes
│   ├── components.css      # Shared UI
│   ├── landing.css         # Landing page
│   └── workspace.css       # Workspace
├── js/
│   ├── main.js             # Entry point
│   ├── router.js           # SPA router
│   ├── state.js            # Reactive state
│   ├── colorUtils.js       # Color math
│   ├── colorEditor.js      # Color picker
│   ├── aiPalette.js        # AI engine
│   ├── figmaApi.js         # Figma client
│   ├── figmaParser.js      # Node parser
│   ├── figmaRenderer.js    # DOM renderer
│   ├── livePreview.js      # Preview
│   ├── exportPanel.js      # Export
│   ├── accessibility.js    # WCAG checker
│   ├── toast.js            # Notifications
│   └── views/
│       ├── landingView.js
│       └── workspaceView.js
└── figma-plugin/
    ├── manifest.json
    ├── code.js
    └── ui.html
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Bundler | Vite 6 |
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Vanilla CSS + CSS Custom Properties |
| Typography | Inter + JetBrains Mono |
| Design API | Figma REST API v1 |
| Plugin | Figma Plugin API |
| Dependencies | **Zero runtime dependencies** |

---

## 📦 Build

```bash
npm run build
```

Output in `dist/` — deploy anywhere.

---

## 💬 Feedback

Have a suggestion or found a bug? Use the feedback widget in the app or email prakharmanu76@gmail.com

---

## 📄 License

MIT © [MANu13151](https://github.com/MANu13151)

---

<div align="center">
  <sub>Built with ✦ by the MorphUI team</sub>
</div>

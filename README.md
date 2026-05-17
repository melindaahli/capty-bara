# capty-bara

A Chrome extension that shows dual-language subtitles on YouTube videos. Watch with two languages displayed simultaneously — side by side or stacked — with full control over fonts, colors, and positioning.

---

## Features

- **Dual-language captions** — display two languages at the same time
- **6 supported languages** — English, Chinese, Japanese, Korean, Spanish, French
- **Draggable overlay** — click and drag to reposition captions anywhere on the video
- **Layout options** — side-by-side or stacked display
- **Appearance customization** — font family, font size, text color, background color
- **Persistent settings** — saved to Chrome sync storage (works across devices)
- **Smart caching** — transcript requests are cached and deduplicated on the backend

---

## Project Structure

```
capty-bara/
├── backend/              # Express server for fetching YouTube transcripts
│   ├── index.js
│   └── package.json
├── src/
│   ├── background/       # Service worker (initializes default settings)
│   ├── content/          # Content script injected into YouTube
│   │   ├── index.jsx
│   │   └── CaptionOverlay.jsx
│   ├── popup/            # Extension popup UI
│   │   ├── Popup.jsx
│   │   ├── popup.html
│   │   └── components/
│   │       ├── Settings/ # Language and display settings panel
│   │       └── Toggle/   # Toggle component
│   └── assets/
├── public/icons/         # Extension icons
├── manifest.json         # Chrome Manifest V3
├── vite.config.js
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Extension frontend | React 18, Vite, vite-plugin-web-extension |
| Backend server | Node.js, Express |
| Transcript fetching | youtube-transcript |
| Settings persistence | Chrome Sync Storage API |

---

## Setup

### Prerequisites

- Node.js and npm
- Google Chrome

### 1. Backend

```bash
cd capty-bara/backend
npm install
npm start
```

The server runs on `http://localhost:3001` and exposes:
- `GET /transcript?videoId=&lang=` — fetch full transcript
- `GET /transcript/at-time?videoId=&lang=&time=` — get caption at a specific timestamp (seconds)

### 2. Extension

```bash
cd capty-bara
npm install
npm run build
```

For development with watch mode:
```bash
npm run dev
```

### 3. Load in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `capty-bara/dist` folder

---

## Usage

1. Make sure the backend server is running (`npm start` in `capty-bara/backend`)
2. Navigate to any YouTube video
3. The caption overlay will appear automatically
4. Click the extension icon to open settings and configure:
   - Primary and secondary languages
   - Layout (side-by-side or stacked)
   - Font size, font family, text color, background color

---

## How It Works

1. The **content script** injects a React component into the YouTube video player
2. The **caption overlay** polls the backend every 500ms with the current video timestamp
3. The **backend** fetches and caches the YouTube transcript, then returns the matching caption segment for that timestamp
4. **Settings** are read from Chrome sync storage and update the overlay in real time via storage change listeners

Transcript lookup uses a linear scan over time-ordered segments to find the one whose `[offset, offset + duration)` window contains the current playback time.

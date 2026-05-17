# capty-bara

A Chrome extension that overlays dual-language subtitles on YouTube videos, so immigrant families, heritage language learners, deaf and hard-of-hearing viewers, and anyone watching across a language barrier can follow along together.



## How it works

capty-bara injects a subtitle overlay directly into the YouTube player. The backend fetches the video transcript from YouTube and exposes it via API endpoints. The extension reads those endpoints and displays captions in two languages simultaneously.



## Running locally

### 1. Start the backend

The backend handles transcript fetching and translation endpoints.

```bash
cd backend
npm install
npm start
```

### 2. Build the extension

```bash
cd capty-bara
npm install
npm run build
```

This outputs the extension to the `dist/` folder.

### 3. Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `dist/` folder

The capty-bara extension will now appear in your extensions list. Navigate to any YouTube video and it should be live.



## Built with

React, Vite, JavaScript, Tailwind CSS, Express, Nods.js, youtube-transcript library

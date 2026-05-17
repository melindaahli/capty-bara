import React from 'react';
import { createRoot } from 'react-dom/client';
import CaptionOverlay from './CaptionOverlay';

function waitForPlayer() {
  return new Promise((resolve) => {
    const check = () => {
      const player = document.querySelector('#movie_player');
      if (player) return resolve(player);
      setTimeout(check, 300);
    };
    check();
  });
}

async function mount() {
  // Don't mount twice (e.g. on YouTube SPA navigation)
  if (document.getElementById('capty-bara-root')) return;

  const player = await waitForPlayer();

  if (getComputedStyle(player).position === 'static') {
    player.style.position = 'relative';
  }

  const container = document.createElement('div');
  container.id = 'capty-bara-root';
  player.appendChild(container);

  createRoot(container).render(<CaptionOverlay />);
}

// Mount on initial load
mount();

// Re-mount on YouTube SPA navigations (url changes without full page reload)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    const old = document.getElementById('capty-bara-root');
    if (old) old.remove();
    if (new URLSearchParams(location.search).get('v')) mount();
  }
}).observe(document.body, { childList: true, subtree: true });

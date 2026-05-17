import { useState, useEffect, useRef } from 'react';

const BACKEND = 'http://localhost:3001';

function getVideoId() {
  return new URLSearchParams(window.location.search).get('v');
}

export default function CaptionOverlay() {
  const [langs, setLangs] = useState({ primary: 'en', secondary: 'ja' });
  const [captions, setCaptions] = useState({ primary: '', secondary: '' });
  // null = default position (bottom-center), otherwise { x, y } px from player top-left
  const [pos, setPos] = useState(null);
  const overlayRef = useRef(null);

  // Load language settings and listen for changes from popup
  useEffect(() => {
    chrome.storage.sync.get({ primaryLang: 'en', secondaryLang: 'ja' }, (stored) => {
      setLangs({ primary: stored.primaryLang, secondary: stored.secondaryLang });
    });
    const handleChange = (changes) => {
      setLangs((prev) => ({
        primary: changes.primaryLang?.newValue ?? prev.primary,
        secondary: changes.secondaryLang?.newValue ?? prev.secondary,
      }));
    };
    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  // Poll video time and fetch captions for both languages
  useEffect(() => {
    const videoId = getVideoId();
    if (!videoId) return;

    async function tick() {
      const video = document.querySelector('video');
      if (!video) return;
      const time = video.currentTime;

      try {
        const [r1, r2] = await Promise.all([
          fetch(`${BACKEND}/transcript/at-time?videoId=${videoId}&lang=${langs.primary}&time=${time}`).then((r) => r.json()),
          fetch(`${BACKEND}/transcript/at-time?videoId=${videoId}&lang=${langs.secondary}&time=${time}`).then((r) => r.json()),
        ]);
        setCaptions({ primary: r1?.text ?? '', secondary: r2?.text ?? '' });
      } catch {
        // backend unreachable — keep last captions
      }
    }

    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [langs]);

  // Drag: record where mouse started relative to overlay center, update pos on move
  function handleMouseDown(e) {
    e.preventDefault();
    const overlay = overlayRef.current;
    if (!overlay) return;

    const player = overlay.parentElement;
    const playerRect = player.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

    // Center of overlay in player-relative coords
    const startX = overlayRect.left - playerRect.left + overlayRect.width / 2;
    const startY = overlayRect.top - playerRect.top + overlayRect.height / 2;
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    function onMove(e) {
      setPos({
        x: startX + (e.clientX - startMouseX),
        y: startY + (e.clientY - startMouseY),
      });
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  const posStyle = pos
    ? { left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }
    : { bottom: '14%', left: '50%', transform: 'translateX(-50%)' };

  const hasCaption = captions.primary || captions.secondary;

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        ...posStyle,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      {/* Drag handle — always visible so user can reposition even without captions */}
      <div
        style={{
          display: hasCaption ? 'none' : 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(0,0,0,0.45)',
          borderRadius: 20,
          padding: '3px 10px',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 11,
          fontFamily: 'sans-serif',
        }}
      >
        <span>⠿</span>
        <span>capty-bara</span>
      </div>

      {captions.primary && (
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 6,
            padding: '5px 16px',
            color: '#ffffff',
            fontSize: '1.3rem',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontWeight: 500,
            lineHeight: 1.4,
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
            maxWidth: '90vw',
          }}
        >
          {captions.primary}
        </span>
      )}

      {captions.secondary && (
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 6,
            padding: '5px 16px',
            color: '#FFD700',
            fontSize: '1.1rem',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontWeight: 400,
            lineHeight: 1.4,
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
            whiteSpace: 'nowrap',
            maxWidth: '90vw',
          }}
        >
          {captions.secondary}
        </span>
      )}
    </div>
  );
}

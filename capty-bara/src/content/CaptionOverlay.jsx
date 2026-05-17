import { useState, useEffect, useRef } from 'react';

const BACKEND = 'http://localhost:3001';

const LANG_CODE = {
  'English': 'en',
  'Chinese': 'zh',
  'Korean': 'ko',
  'Japanese': 'ja',
  'Spanish': 'es',
  'French': 'fr',
};

const COLOR_HEX = {
  'White': '#FFFFFF',
  'Black': '#000000',
  'Gray': '#808080',
};

const BG_RGBA = {
  'White': 'rgba(255,255,255,0.85)',
  'Black': 'rgba(0,0,0,0.7)',
  'Gray': 'rgba(128,128,128,0.7)',
};

const FONT_FAMILY = {
  'Arial': 'Arial, sans-serif',
  'Times New Roman': '"Times New Roman", serif',
  'Georgia': 'Georgia, serif',
  'Courier New': '"Courier New", monospace',
};

const DEFAULT_SETTINGS = {
  primaryLanguage: 'English',
  secondaryLanguage: 'Japanese',
  isSideBySide: false,
  fontFamily: 'Arial',
  fontSize: 16,
  fontColor: null,
  bgColor: null,
  windowColor: null,
};

function getVideoId() {
  return new URLSearchParams(window.location.search).get('v');
}

// Map slider value (0–100) to rem
function sliderToRem(v) {
  return 0.8 + (v / 100) * 1.7;
}

export default function CaptionOverlay() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [captions, setCaptions] = useState({ primary: '', secondary: '' });
  const [pos, setPos] = useState(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const keys = Object.keys(DEFAULT_SETTINGS);
    chrome.storage.sync.get(keys, (stored) => {
      setSettings((prev) => ({ ...prev, ...Object.fromEntries(keys.map(k => [k, stored[k] ?? prev[k]])) }));
    });

    const handleChange = (changes) => {
      setSettings((prev) => {
        const patch = {};
        for (const key of Object.keys(DEFAULT_SETTINGS)) {
          if (key in changes) patch[key] = changes[key].newValue;
        }
        return { ...prev, ...patch };
      });
    };
    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  useEffect(() => {
    const videoId = getVideoId();
    if (!videoId) return;

    const primaryCode = LANG_CODE[settings.primaryLanguage] ?? 'en';
    const secondaryCode = LANG_CODE[settings.secondaryLanguage] ?? 'ja';

    async function tick() {
      const video = document.querySelector('video');
      if (!video) return;
      const time = video.currentTime;

      try {
        const [r1, r2] = await Promise.all([
          fetch(`${BACKEND}/transcript/at-time?videoId=${videoId}&lang=${primaryCode}&time=${time}`).then((r) => r.json()),
          fetch(`${BACKEND}/transcript/at-time?videoId=${videoId}&lang=${secondaryCode}&time=${time}`).then((r) => r.json()),
        ]);
        setCaptions({ primary: r1?.text ?? '', secondary: r2?.text ?? '' });
      } catch {
        // backend unreachable — keep last captions
      }
    }

    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [settings.primaryLanguage, settings.secondaryLanguage]);

  function handleMouseDown(e) {
    e.preventDefault();
    const overlay = overlayRef.current;
    if (!overlay) return;

    const player = overlay.parentElement;
    const playerRect = player.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

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

  const captionFontFamily = FONT_FAMILY[settings.fontFamily] ?? 'Arial, sans-serif';
  const captionFontSize = `${sliderToRem(settings.fontSize)}rem`;
  const captionColor = COLOR_HEX[settings.fontColor] ?? '#ffffff';
  const captionBg = BG_RGBA[settings.bgColor] ?? 'rgba(0,0,0,0.7)';
  const windowBg = BG_RGBA[settings.windowColor] ?? 'transparent';

  // isSideBySide=false → "adjacent" (row), isSideBySide=true → "stacked" (column)
  const captionDirection = settings.isSideBySide ? 'column' : 'row';

  const captionStyle = {
    display: 'inline-block',
    background: captionBg,
    borderRadius: 6,
    padding: '5px 16px',
    color: captionColor,
    fontSize: captionFontSize,
    fontFamily: captionFontFamily,
    fontWeight: 500,
    lineHeight: 1.4,
    textShadow: '0 1px 4px rgba(0,0,0,0.9)',
    whiteSpace: 'nowrap',
    maxWidth: '90vw',
  };

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
        background: windowBg,
        borderRadius: windowBg !== 'transparent' ? 8 : 0,
        padding: windowBg !== 'transparent' ? '6px 10px' : 0,
      }}
    >
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

      {hasCaption && (
        <div style={{ display: 'flex', flexDirection: captionDirection, alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {captions.primary && (
            <span style={captionStyle}>{captions.primary}</span>
          )}
          {captions.secondary && (
            <span style={{ ...captionStyle, fontSize: `${sliderToRem(settings.fontSize) * 0.85}rem` }}>
              {captions.secondary}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

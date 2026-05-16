import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Map codes to full language names so we can display them
const LANGUAGE_MAP = {
  'en': 'English', 'zh': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)',
  'ja': 'Japanese', 'ko': 'Korean', 'es': 'Spanish', 'fr': 'French',
  'de': 'German', 'pt': 'Portuguese', 'ar': 'Arabic', 'hi': 'Hindi',
  'vi': 'Vietnamese', 'tl': 'Filipino'
};

const MovableCaption = () => {
  const containerRef = useRef(null);

  // High-performance GPU Drag Info tracking
  const dragInfo = useRef({ 
    isDragging: false, 
    startX: 0, 
    startY: 0, 
    currentX: 100, 
    currentY: 100,
    ticking: false 
  });
  
  // State to handle the layout options
  const [layoutMode, setLayoutMode] = useState('stacked'); // 'stacked' | 'side-by-side'

  // State to sync with Chrome storage from popup
  const [languages, setLanguages] = useState({ primary: 'en', secondary: 'ja' });

  // Sync languages with Chrome Storage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // 1. Fetch initial values on load
      chrome.storage.sync.get(['primaryLanguage', 'secondaryLanguage'], (result) => {
        setLanguages(prev => ({
          primary: result.primaryLanguage || prev.primary,
          secondary: result.secondaryLanguage || prev.secondary
        }));
      });

      // 2. Listen for live updates when selections change in the popup
      const handleStorageChange = (changes, areaName) => {
        if (areaName === 'sync') {
          setLanguages(prev => ({
            primary: changes.primaryLanguage ? changes.primaryLanguage.newValue : prev.primary,
            secondary: changes.secondaryLanguage ? changes.secondaryLanguage.newValue : prev.secondary
          }));
        }
      };
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }
  }, []);

  // --- Smooth Drag Event Handlers ---
  const handleMouseDown = (e) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;

    dragInfo.current.isDragging = true;
    dragInfo.current.startX = e.clientX - dragInfo.current.currentX;
    dragInfo.current.startY = e.clientY - dragInfo.current.currentY;

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragInfo.current.isDragging) return;
    
    e.preventDefault(); // Prevents layout selection & browser highlights while dragging

    const newX = e.clientX - dragInfo.current.startX;
    const newY = e.clientY - dragInfo.current.startY;

    dragInfo.current.currentX = newX;
    dragInfo.current.currentY = newY;

    // requestAnimationFrame ensures position updates are bound to monitor refresh rate
    if (!dragInfo.current.ticking) {
      window.requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = `translate3d(${dragInfo.current.currentX}px, ${dragInfo.current.currentY}px, 0)`;
        }
        dragInfo.current.ticking = false;
      });
      dragInfo.current.ticking = true;
    }
  };

  const handleMouseUp = () => {
    dragInfo.current.isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Cleanup drag listeners if component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: '0px',
        top: '0px',
        transform: 'translate3d(100px, 100px, 0)', // Use 3D Transform on GPU layer instead of top/left layout parameters
        zIndex: 2147483647,
        backgroundColor: 'rgba(31, 41, 55, 0.95)', 
        backdropFilter: 'blur(8px)',
        minWidth: layoutMode === 'side-by-side' ? '600px' : '400px',
      }}
      // Transition min-width smoothly, but do NOT include position coordinates to avoid dragging jitter
      className="rounded-xl shadow-2xl border border-gray-600 text-white font-sans flex flex-col overflow-hidden transition-[min-width] duration-300"
    >
      {/* Top Drag Bar & Controls */}
      <div
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: 'rgba(17, 24, 39, 1)' }}
        className="px-4 py-2 flex justify-between items-center cursor-move select-none"
      >
        <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
          {/* Drag Icon */}
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
          </svg>
          Capty-Bara
        </span>
        
        {/* Toggle Layout Button */}
        <button
          onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking the button
          onClick={() => setLayoutMode(prev => prev === 'stacked' ? 'side-by-side' : 'stacked')}
          className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md text-white font-medium transition-colors border border-blue-500 shadow-sm"
        >
          Toggle View: {layoutMode === 'stacked' ? 'Stacked' : 'Side-by-Side'}
        </button>
      </div>

      {/* Subtitles Container - Changes Flex Direction based on state */}
      <div className={`p-4 flex gap-4 ${layoutMode === 'side-by-side' ? 'flex-row' : 'flex-col'}`}>
        
        {/* Language 1 Box */}
        <div 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          className="rounded-lg p-4 flex-1 border border-gray-700/50 shadow-inner"
        >
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">
            {LANGUAGE_MAP[languages.primary] || 'Language 1'}
          </div>
          <div className="text-lg font-medium leading-relaxed text-white">
            This is the first subtitle track.
          </div>
        </div>

        {/* Language 2 Box */}
        <div 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          className="rounded-lg p-4 flex-1 border border-gray-700/50 shadow-inner"
        >
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-semibold">
            {LANGUAGE_MAP[languages.secondary] || 'Language 2'}
          </div>
          <div className="text-lg font-medium leading-relaxed text-yellow-400">
            Esta es la segunda pista de subtítulos.
          </div>
        </div>
        
      </div>
    </div>
  );
};

// --- Injection Polling Logic ---
(function initExtension() {
  console.log('Capty-Bara content script loaded!');

  const targetSelector = '#above-the-fold'; // YouTube target
  let checkCount = 0;

  const interval = setInterval(() => {
    const target = document.querySelector(targetSelector);
    checkCount++;

    if (target) {
      clearInterval(interval);

      // Ensure we don't inject multiple times
      if (document.getElementById('capty-bara-root')) return;

      // Create the root container
      const rootElement = document.createElement('div');
      rootElement.id = 'capty-bara-root';

      // Inject it into YouTube
      target.insertAdjacentElement('afterbegin', rootElement);

      // Render the React app into the container
      const root = createRoot(rootElement);
      root.render(<MovableCaption />);

      console.log('Success: Capty-Bara injected after ' + checkCount + ' attempts.');
    } else if (checkCount > 10) {
      clearInterval(interval);
      console.error('Error: Target element not found after 5 seconds.');
    }
  }, 500);
})();
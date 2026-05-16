// src/content/components/SettingsBar.jsx
import React from 'react'
import useStore from '../store/useStore'

export default function SettingsBar() {
  const {
    layoutMode, setLayoutMode,
    fontSize, setFontSize,
    highContrast, toggleHighContrast,
    dyslexiaFont, toggleDyslexiaFont,
    romanization, toggleRomanization
  } = useStore()

  const btnStyle = (active) => ({
    padding: '4px 10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    background: active ? '#2d6a9f' : '#333',
    color: '#fff',
    marginRight: '6px'
  })

  return (
    <div style={{ display:'flex', gap:'8px', marginBottom:'10px', flexWrap:'wrap', alignItems:'center' }}>
      <span style={{ fontSize:'11px', color:'#888', marginRight:'4px' }}>Layout:</span>
      <button style={btnStyle(layoutMode==='stacked')}
        onClick={() => setLayoutMode('stacked')}>Stacked</button>
      <button style={btnStyle(layoutMode==='sideBySide')}
        onClick={() => setLayoutMode('sideBySide')}>Side by Side</button>

      <span style={{ fontSize:'11px', color:'#888', marginLeft:'8px', marginRight:'4px' }}>Size:</span>
      {['small','medium','large','xlarge'].map(s => (
        <button key={s} style={btnStyle(fontSize===s)}
          onClick={() => setFontSize(s)}>{s[0].toUpperCase()}</button>
      ))}

      <button style={btnStyle(highContrast)} onClick={toggleHighContrast}>
        High Contrast
      </button>
      <button style={btnStyle(dyslexiaFont)} onClick={toggleDyslexiaFont}>
        Dyslexia Font
      </button>
      <button style={btnStyle(romanization)} onClick={toggleRomanization}>
        Romanization
      </button>
    </div>
  )
}

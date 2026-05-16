import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hi', label: 'Hindi' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'tl', label: 'Filipino' },
]

function Popup() {
  const [primary, setPrimary] = useState('en')
  const [secondary, setSecondary] = useState('ja')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    chrome.storage.sync.get(['primaryLanguage','secondaryLanguage'], (result) => {
      if (result.primaryLanguage) setPrimary(result.primaryLanguage)
      if (result.secondaryLanguage) setSecondary(result.secondaryLanguage)
    })
  }, [])

  function save() {
    chrome.storage.sync.set({ primaryLanguage: primary, secondaryLanguage: secondary })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const selectStyle = {
    width: '100%', padding: '8px', borderRadius: '6px',
    border: '1px solid #444', background: '#1e1e2e',
    color: '#e0e0e0', fontSize: '14px', marginTop: '4px'
  }

  return (
    <div style={{ width:'280px', padding:'16px', background:'#0f0f0f', color:'#e0e0e0', fontFamily:'Arial' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
        <span style={{ fontSize:'24px' }}>🦫</span>
        <span style={{ fontSize:'18px', fontWeight:'bold', color:'#2d6a9f' }}>Capty-Bara</span>
      </div>

      <label style={{ fontSize:'12px', color:'#888' }}>My language (L1)</label>
      <select value={primary} onChange={e => setPrimary(e.target.value)} style={selectStyle}>
        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>

      <label style={{ fontSize:'12px', color:'#888', display:'block', marginTop:'12px' }}>
        Video language (L2)
      </label>
      <select value={secondary} onChange={e => setSecondary(e.target.value)} style={selectStyle}>
        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>

      <button onClick={save} style={{
        width:'100%', padding:'10px', marginTop:'16px',
        background: saved ? '#1a6b3c' : '#2d6a9f',
        color:'#fff', border:'none', borderRadius:'6px',
        fontSize:'14px', cursor:'pointer', fontWeight:'bold'
      }}>
        {saved ? '✓ Saved!' : 'Save Languages'}
      </button>

      <p style={{ fontSize:'11px', color:'#666', marginTop:'12px', textAlign:'center' }}>
        Open a YouTube video to activate captions
      </p>
    </div>
  )
}

createRoot(document.getElementById('popup-root')).render(<Popup />)

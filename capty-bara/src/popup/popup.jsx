// src/popup/popup.jsx
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import Settings from './components/Settings/Settings'
import logo from '/public/icons/logo.png';

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

  //toggles
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <div style={{ width:'280px', padding:'16px', background:'#f3f3f3' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        <img src={logo} alt="capybara logo" style={{ maxHeight:'50px', width: '40px'}}/>
        <span className={logo} style={{ fontSize:'18px', fontWeight:'bold', color:'#175423' }}>capty-bara</span>
      </div>

      <Settings />

      <p style={{ fontSize:'11px', color:'#666', marginTop:'12px', textAlign:'center' }}>
        Open a YouTube video to activate captions
      </p>
    </div>
  )
}

createRoot(document.getElementById('popup-root')).render(<Popup />)

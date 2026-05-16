// src/content/store/useStore.js
import { create } from 'zustand'

const useStore = create((set) => ({
  // Caption data
  tracks: [],
  primaryLanguage: 'en',
  secondaryLanguage: 'ja',
  primaryCues: [],
  secondaryCues: [],
  currentTime: 0,

  // UI settings
  layoutMode: 'stacked',    // 'stacked' | 'sideBySide'
  fontSize: 'medium',        // 'small'|'medium'|'large'|'xlarge'
  highContrast: false,
  dyslexiaFont: false,
  romanization: true,

  // Actions
  setTracks: (tracks) => set({ tracks }),
  setPrimaryLanguage: (lang) => set({ primaryLanguage: lang }),
  setSecondaryLanguage: (lang) => set({ secondaryLanguage: lang }),
  setPrimaryCues: (cues) => set({ primaryCues: cues }),
  setSecondaryCues: (cues) => set({ secondaryCues: cues }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setLayoutMode: (mode) => set({ layoutMode: mode }),
  setFontSize: (size) => set({ fontSize: size }),
  toggleHighContrast: () => set(s => ({ highContrast: !s.highContrast })),
  toggleDyslexiaFont: () => set(s => ({ dyslexiaFont: !s.dyslexiaFont })),
  toggleRomanization: () => set(s => ({ romanization: !s.romanization })),
}))

export default useStore

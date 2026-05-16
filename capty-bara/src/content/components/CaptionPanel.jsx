import React from 'react'
import CaptionLog from './CaptionLog'
import SettingsBar from './SettingsBar'
import { useCaptions } from '../hooks/useCaptions'
import { useCaptionSync } from '../hooks/useCaptionSync'
import useStore from '../store/useStore'

export default function CaptionPanel() {
  useCaptions()        // fetches and stores cues
  const cues = useCaptionSync()  // returns prev/current/next
  const { highContrast, dyslexiaFont, fontSize } = useStore()

  const fontSizeMap = {
    small: '14px', medium: '18px', large: '22px', xlarge: '28px'
  }

  return (
    <div style={{
      background: highContrast ? '#000' : '#0f0f0f',
      color: highContrast ? '#fff' : '#e0e0e0',
      fontFamily: dyslexiaFont ? 'OpenDyslexic, sans-serif' : 'Arial, sans-serif',
      fontSize: fontSizeMap[fontSize],
      padding: '12px 16px',
      minHeight: '100px',
      borderTop: '2px solid #2d6a9f'
    }}>
      <SettingsBar />
      <CaptionLog cues={cues} />
    </div>
  )
}

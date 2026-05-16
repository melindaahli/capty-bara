// src/content/components/CaptionLog.jsx
import React from 'react'
import CaptionLine from './CaptionLine'
import useStore from '../store/useStore'

// DUMMY DATA — replace with real cues once Person A is done
const DUMMY = {
  primaryPrev:      { text: 'Previous line in primary language' },
  primaryCurrent:   { text: 'Current line in primary language' },
  primaryNext:      { text: 'Next line in primary language' },
  secondaryPrev:    { text: '前の行' },
  secondaryCurrent: { text: 'あなたは今日どこに行きましたか？' },
  secondaryNext:    { text: '次の行' },
}

export default function CaptionLog({ cues }) {
  const { layoutMode, primaryLanguage, secondaryLanguage } = useStore()
  const data = cues || DUMMY  // use dummy until Person A is ready

  const rows = [
    { primary: data.primaryPrev,    secondary: data.secondaryPrev,    role: 'prev' },
    { primary: data.primaryCurrent, secondary: data.secondaryCurrent, role: 'current' },
    { primary: data.primaryNext,    secondary: data.secondaryNext,    role: 'next' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {rows.map(({ primary, secondary, role }) => (
        <div key={role} style={{
          display: layoutMode === 'sideBySide' ? 'flex' : 'block',
          gap: layoutMode === 'sideBySide' ? '24px' : '0',
          opacity: role === 'current' ? 1 : 0.4,
          borderLeft: role === 'current' ? '3px solid #2d6a9f' : '3px solid transparent',
          paddingLeft: '8px',
        }}>
          <CaptionLine cue={primary} language={primaryLanguage} isActive={role === 'current'} />
          <CaptionLine cue={secondary} language={secondaryLanguage} isActive={role === 'current'} />
        </div>
      ))}
    </div>
  )
}

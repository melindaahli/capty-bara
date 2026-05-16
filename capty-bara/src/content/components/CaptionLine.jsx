// src/content/components/CaptionLine.jsx
import React from 'react'
import Romanization from './Romanization'
import WordTooltip from './WordTooltip'
import { tokenize } from '../utils/tokenizer'
import useStore from '../store/useStore'

export default function CaptionLine({ cue, language, isActive }) {
  const { romanization } = useStore()
  if (!cue) return <div style={{ minHeight: '24px' }} />

  const tokens = tokenize(cue.text, language)

  return (
    <div style={{ flex: 1, lineHeight: 1.6 }}>
      {romanization && (
        <Romanization text={cue.text} language={language} />
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
        {tokens.map((token, i) => (
          isActive ? (
            <WordTooltip
              key={i}
              word={token}
              fullLine={cue.text}
              language={language}
            />
          ) : (
            <span key={i}>{token}</span>
          )
        ))}
      </div>
    </div>
  )
}

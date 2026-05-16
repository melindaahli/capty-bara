// src/content/components/WordTooltip.jsx
import React, { useState } from 'react'
import { useHoverDefinition } from '../hooks/useHoverDefinition'

export default function WordTooltip({ word, fullLine, language }) {
  const { definition, loading, onHover, onLeave } = useHoverDefinition()
  const [visible, setVisible] = useState(false)

  function handleMouseEnter() {
    setVisible(true)
    onHover(word, fullLine, language)
  }
  function handleMouseLeave() {
    setVisible(false)
    onLeave()
  }

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          borderBottom: '1px dotted #2d6a9f',
          paddingBottom: '1px'
        }}
      >
        {word}
      </span>

      {visible && (
        <div style={{
          position: 'absolute',
          bottom: '130%',
          left: '0',
          zIndex: 99999,
          background: '#1e1e2e',
          border: '1px solid #2d6a9f',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: '220px',
          maxWidth: '320px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          color: '#e0e0e0',
          fontSize: '13px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.5
        }}>
          {loading && <div style={{ color: '#888' }}>Looking up...</div>}
          {definition && (
            <>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff', marginBottom: '6px' }}>
                {word}
                {definition.pronunciation && (
                  <span style={{ fontWeight: 'normal', fontSize: '13px', color: '#9bb5cc', marginLeft: '8px' }}>
                    {definition.pronunciation}
                  </span>
                )}
              </div>
              <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>
                {definition.partOfSpeech}
              </div>
              <div style={{ marginBottom: '6px' }}>{definition.definition}</div>
              {definition.contextNote && (
                <div style={{ color: '#9bb5cc', fontSize: '12px', marginBottom: '4px' }}>
                  In context: {definition.contextNote}
                </div>
              )}
              {definition.example && (
                <div style={{ color: '#888', fontSize: '12px', fontStyle: 'italic' }}>
                  e.g. {definition.example}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </span>
  )
}

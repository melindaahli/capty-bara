// src/content/components/Romanization.jsx
import React, { useEffect, useState } from 'react'
import { getRomanization } from '../utils/romanization'

export default function Romanization({ text, language }) {
  const [romanized, setRomanized] = useState('')

  useEffect(() => {
    getRomanization(text, language).then(setRomanized)
  }, [text, language])

  if (!romanized) return null

  return (
    <div style={{
      fontSize: '0.75em',
      color: '#9bb5cc',
      letterSpacing: '0.05em',
      marginBottom: '2px'
    }}>
      {romanized}
    </div>
  )
}

// src/content/hooks/useHoverDefinition.js
import { useState, useRef, useCallback } from 'react'
import useStore from '../store/useStore'

export function useHoverDefinition() {
  const [definition, setDefinition] = useState(null)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const { primaryLanguage } = useStore()

  const onHover = useCallback((word, fullLine, language) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setDefinition(null)
      chrome.runtime.sendMessage(
        {
          type: 'DEFINE_WORD',
          payload: { word, fullLine, language, nativeLanguage: primaryLanguage }
        },
        (response) => {
          setLoading(false)
          if (response?.success) setDefinition(response.data)
        }
      )
    }, 400) // 400ms debounce — don't fire on fast mouse movement
  }, [primaryLanguage])

  const onLeave = useCallback(() => {
    clearTimeout(debounceRef.current)
    setDefinition(null)
    setLoading(false)
  }, [])

  return { definition, loading, onHover, onLeave }
}

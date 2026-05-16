// src/content/hooks/useCaptionSync.js
import { useEffect } from 'react'
import useStore from '../store/useStore'

function findCues(cues, time) {
  const currentIndex = cues.findIndex(
    c => time >= c.start && time <= c.end
  )
  if (currentIndex === -1) {
    // Between cues — find next upcoming
    const nextIndex = cues.findIndex(c => c.start > time)
    return {
      prev: nextIndex > 1 ? cues[nextIndex - 2] : null,
      current: null,
      next: nextIndex >= 0 ? cues[nextIndex] : null
    }
  }
  return {
    prev: currentIndex > 0 ? cues[currentIndex - 1] : null,
    current: cues[currentIndex],
    next: currentIndex < cues.length - 1 ? cues[currentIndex + 1] : null
  }
}

export function useCaptionSync() {
  const { primaryCues, secondaryCues, setCurrentTime } = useStore()

  useEffect(() => {
    const video = document.querySelector('video')
    if (!video) return

    const interval = setInterval(() => {
      setCurrentTime(video.currentTime)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const time = useStore(s => s.currentTime)

  return {
    ...Object.fromEntries(
      Object.entries(findCues(primaryCues, time))
        .map(([k, v]) => ['primary' + k[0].toUpperCase() + k.slice(1), v])
    ),
    ...Object.fromEntries(
      Object.entries(findCues(secondaryCues, time))
        .map(([k, v]) => ['secondary' + k[0].toUpperCase() + k.slice(1), v])
    )
  }
}

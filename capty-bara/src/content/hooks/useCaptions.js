// src/content/hooks/useCaptions.js
import { useEffect } from 'react'
import { getAvailableTracks, fetchCaptionTrack } from '../utils/youtubeCaption'
import { parseVTT } from '../utils/vttParser'
import useStore from '../store/useStore'

export function useCaptions() {
  const {
    primaryLanguage, secondaryLanguage,
    setTracks, setPrimaryCues, setSecondaryCues
  } = useStore()

  useEffect(() => {
    async function load() {
      const tracks = await getAvailableTracks()
      setTracks(tracks)

      const primaryTrack = tracks.find(t => t.language === primaryLanguage)
        || tracks.find(t => t.language.startsWith(primaryLanguage))
      const secondaryTrack = tracks.find(t => t.language === secondaryLanguage)
        || tracks.find(t => t.language.startsWith(secondaryLanguage))

      if (primaryTrack) {
        const vtt = await fetchCaptionTrack(primaryTrack.url)
        setPrimaryCues(parseVTT(vtt))
      }
      if (secondaryTrack) {
        const vtt = await fetchCaptionTrack(secondaryTrack.url)
        setSecondaryCues(parseVTT(vtt))
      }
    }
    load()
  }, [primaryLanguage, secondaryLanguage])
}

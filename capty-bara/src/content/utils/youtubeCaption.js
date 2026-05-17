// src/content/utils/youtubeCaption.js

export async function getAvailableTracks() {
  try {
    const playerData = window.ytInitialPlayerResponse
    if (!playerData) {
      console.warn('Capty-Bara: ytInitialPlayerResponse not found')
      return []
    }
    const captionTracks =
      playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks
    if (!captionTracks || captionTracks.length === 0) {
      console.warn('Capty-Bara: no caption tracks found')
      return []
    }
    return captionTracks.map(track => ({
      language: track.languageCode,
      label: track.name?.simpleText || track.languageCode,
      url: track.baseUrl
    }))
  } catch (err) {
    console.error('Capty-Bara: error extracting tracks', err)
    return []
  }
}

export async function fetchCaptionTrack(url) {
  const vttUrl = url + '&fmt=vtt'
  const res = await fetch(vttUrl)
  return res.text()
}

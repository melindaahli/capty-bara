// src/content/utils/vttParser.js

export function parseVTT(vttText) {
  const cues = []
  const blocks = vttText.split('\n\n')

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    const timeLine = lines.find(l => l.includes('-->'))
    if (!timeLine) continue

    const [startStr, endStr] = timeLine.split(' --> ')
    const start = parseTimestamp(startStr.trim())
    const end = parseTimestamp(endStr.trim())

    const textLines = lines.slice(lines.indexOf(timeLine) + 1)
    const text = textLines
      .join(' ')
      .replace(/<[^>]+>/g, '') // strip VTT inline tags
      .trim()

    if (text) cues.push({ start, end, text })
  }
  return cues
}

function parseTimestamp(ts) {
  const parts = ts.split(':')
  let seconds = 0
  if (parts.length === 3) {
    seconds += parseFloat(parts[0]) * 3600
    seconds += parseFloat(parts[1]) * 60
    seconds += parseFloat(parts[2])
  } else if (parts.length === 2) {
    seconds += parseFloat(parts[0]) * 60
    seconds += parseFloat(parts[1])
  }
  return seconds
}
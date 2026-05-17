// src/background/index.js
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE'  // get from aistudio.google.com
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'DEFINE_WORD') return false

  const { word, fullLine, language, nativeLanguage } = message.payload

  const prompt = `
You are a concise language assistant in a video caption tool.
The subtitle line is: "${fullLine}"
The user hovered over: "${word}"
Caption language: ${language}
User's language: ${nativeLanguage}

Return ONLY valid JSON, no markdown, no explanation:
{
  "definition": "meaning in this context, under 20 words",
  "pronunciation": "pinyin/romaji/IPA if non-Latin script, else null",
  "partOfSpeech": "noun/verb/adj/etc",
  "contextNote": "how it's used in this specific line, under 20 words",
  "example": "one short example sentence"
}
  `.trim()

  fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })
  .then(r => r.json())
  .then(data => {
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    sendResponse({ success: true, data: JSON.parse(clean) })
  })
  .catch(err => sendResponse({ success: false, error: err.message }))

  return true  // keep channel open for async response
})

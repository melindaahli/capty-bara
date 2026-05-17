// src/content/utils/romanization.js
import { pinyin } from 'pinyin-pro'
import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

let kuroshiro = null
async function getKuroshiro() {
  if (!kuroshiro) {
    kuroshiro = new Kuroshiro()
    await kuroshiro.init(new KuromojiAnalyzer())
  }
  return kuroshiro
}

export async function getRomanization(text, language) {
  if (!text) return ''
  try {
    if (language === 'zh' || language.startsWith('zh')) {
      return pinyin(text, { toneType: 'symbol', separator: ' ' })
    }
    if (language === 'ja') {
      const k = await getKuroshiro()
      return k.convert(text, { to: 'romaji', mode: 'spaced' })
    }
    if (language === 'ko') {
      return romanize(text)
    }
    return '' // no romanization for other languages
  } catch (err) {
    console.warn('Romanization failed:', err)
    return ''
  }
}

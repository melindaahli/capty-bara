// src/content/utils/tokenizer.js

const CJK_REGEX = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/

export function tokenize(text, language) {
  if (!text) return []

  if (language === 'zh' || language.startsWith('zh') || language === 'ja') {
    // Split into individual characters for CJK
    return text.split('').filter(c => c.trim())
  }

  // For all other languages, split on spaces
  return text.split(/\s+/).filter(Boolean)
}

// Client-side translation helper.
// Uses a server-side /api/translate endpoint to keep API keys secure.

// Simple localStorage cache helper
const cacheKey = (lang, text) => `tr:${lang}:${btoa(text)}`;

export async function translateTexts(texts = [], lang = 'en') {
  if (!texts || texts.length === 0) return [];
  if (lang === 'en') return texts;

  // Check cache for each text first
  const results = [];
  const toFetch = [];
  const fetchIndexes = [];

  texts.forEach((t, i) => {
    try {
      const cached = localStorage.getItem(cacheKey(lang, t));
      if (cached) {
        results[i] = cached;
      } else {
        results[i] = null;
        toFetch.push(t);
        fetchIndexes.push(i);
      }
    } catch (e) {
      results[i] = null;
      toFetch.push(t);
      fetchIndexes.push(i);
    }
  });

  if (toFetch.length === 0) return results;

  // Call server proxy to translate multiple texts at once
  const resp = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts: toFetch, target: lang })
  });

  if (!resp.ok) {
    console.warn('Translation proxy failed', resp.status);
    // fallback: return original texts mapped back
    fetchIndexes.forEach((idx, j) => results[idx] = toFetch[j]);
    return results;
  }

  const json = await resp.json();
  const translated = Array.isArray(json.translations) ? json.translations : toFetch;

  // Store in cache and set results
  fetchIndexes.forEach((idx, j) => {
    const tr = translated[j] || toFetch[j];
    results[idx] = tr;
    try { localStorage.setItem(cacheKey(lang, toFetch[j]), tr); } catch (e) { /* ignore */ }
  });

  return results;
}

// Convenience single-text helper
export async function translateText(text, lang = 'en') {
  const [t] = await translateTexts([text], lang);
  return t;
}

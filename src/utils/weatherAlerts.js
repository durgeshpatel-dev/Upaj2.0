import alerts from '../data/weatherAlerts.json'

// Determine alert keys based on simple heuristics from weather data
export function getAlertKeysFromWeather(weather) {
  if (!weather) return []

  const keys = new Set()

  // Normalize common fields
  const tempC = Number(weather.tempC ?? weather.temp ?? weather.temperature ?? NaN)
  const humidity = Number(weather.humidity ?? NaN)
  const wind = Number(weather.windSpeed ?? weather.wind ?? NaN)
  const precip = Number(weather.precipitation ?? weather.rain ?? weather.precipProbability ?? 0)
  const summary = (weather.summary || weather.description || '').toLowerCase()

  // High heat
  if (!Number.isNaN(tempC) && tempC >= 40) keys.add('heat')
  // Very warm but not extreme
  else if (!Number.isNaN(tempC) && tempC >= 35) keys.add('heat')

  // Rain/possible waterlogging
  if (!Number.isNaN(precip) && precip > 0.2) keys.add('rain')
  if (summary.includes('rain') || summary.includes('shower') || summary.includes('drizzle')) keys.add('rain')

  // Storm / high wind
  if (!Number.isNaN(wind) && wind >= 50) keys.add('storm')
  if (summary.includes('storm') || summary.includes('wind') || summary.includes('squall')) keys.add('storm')

  // Frost / low temperatures
  if (!Number.isNaN(tempC) && tempC <= 2) keys.add('frost')

  // Flood risk based on heavy precipitation in summary or very high precip value
  if (!Number.isNaN(precip) && precip >= 0.7) keys.add('flood')
  if (summary.includes('flood') || summary.includes('waterlogging') || summary.includes('inundation')) keys.add('flood')

  // Dry / drought
  if (!Number.isNaN(precip) && precip < 0.05 && (!Number.isNaN(tempC) && tempC >= 35)) keys.add('dry')
  if (summary.includes('dry') || summary.includes('drought')) keys.add('dry')

  return Array.from(keys)
}

export function getAlertsForWeather(weather, lang = 'en') {
  const keys = getAlertKeysFromWeather(weather)
  const results = []

  keys.forEach(k => {
    const info = alerts[k]
    if (!info) return
    const localized = info[lang] || info['en'] || {}
    results.push({ key: k, title: localized.title || '', messages: localized.messages || [] })
  })

  return results
}

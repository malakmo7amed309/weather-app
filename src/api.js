import axios from 'axios'

const weather = axios.create({ baseURL: 'https://api.open-meteo.com/v1' })
const geocoding = axios.create({ baseURL: 'https://geocoding-api.open-meteo.com/v1' })

// Search cities by name (used by the search autocomplete)
export async function searchCities(name) {
  const { data } = await geocoding.get('/search', {
    params: { name, count: 6, language: 'en', format: 'json' },
  })
  return data.results || []
}

// Current conditions + hourly (next 24 h) + 7-day forecast for one place
export async function getForecast({ latitude, longitude, unit = 'celsius' }) {
  const { data } = await weather.get('/forecast', {
    params: {
      latitude,
      longitude,
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure',
      hourly: 'temperature_2m,weather_code',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: 7,
      temperature_unit: unit,
      wind_speed_unit: 'kmh',
    },
  })
  return data
}

// WMO weather codes -> label + emoji
const WMO = {
  0: ['Clear sky', '☀️'],
  1: ['Mainly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'],
  48: ['Icy fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Drizzle', '🌦️'],
  55: ['Heavy drizzle', '🌧️'],
  61: ['Light rain', '🌦️'],
  63: ['Rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  66: ['Freezing rain', '🌧️'],
  67: ['Freezing rain', '🌧️'],
  71: ['Light snow', '🌨️'],
  73: ['Snow', '🌨️'],
  75: ['Heavy snow', '❄️'],
  77: ['Snow grains', '🌨️'],
  80: ['Light showers', '🌦️'],
  81: ['Showers', '🌧️'],
  82: ['Heavy showers', '🌧️'],
  85: ['Snow showers', '🌨️'],
  86: ['Snow showers', '🌨️'],
  95: ['Thunderstorm', '⛈️'],
  96: ['Storm with hail', '⛈️'],
  99: ['Storm with hail', '⛈️'],
}

export function describeWeather(code, isDay = 1) {
  const [label, icon] = WMO[code] || ['Unknown', '🌡️']
  if (!isDay && (code === 0 || code === 1)) return [label, '🌙']
  return [label, icon]
}

export function windDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

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

// WMO weather codes -> label + icon kind (see components/WeatherIcon.jsx)
const WMO = {
  0: ['Clear sky', 'sun'],
  1: ['Mainly clear', 'mostly'],
  2: ['Partly cloudy', 'partly'],
  3: ['Overcast', 'cloud'],
  45: ['Fog', 'fog'],
  48: ['Icy fog', 'fog'],
  51: ['Light drizzle', 'showers'],
  53: ['Drizzle', 'showers'],
  55: ['Heavy drizzle', 'rain'],
  61: ['Light rain', 'showers'],
  63: ['Rain', 'rain'],
  65: ['Heavy rain', 'rain'],
  66: ['Freezing rain', 'rain'],
  67: ['Freezing rain', 'rain'],
  71: ['Light snow', 'snow'],
  73: ['Snow', 'snow'],
  75: ['Heavy snow', 'snow'],
  77: ['Snow grains', 'snow'],
  80: ['Light showers', 'showers'],
  81: ['Showers', 'rain'],
  82: ['Heavy showers', 'rain'],
  85: ['Snow showers', 'snow'],
  86: ['Snow showers', 'snow'],
  95: ['Thunderstorm', 'storm'],
  96: ['Storm with hail', 'storm'],
  99: ['Storm with hail', 'storm'],
}

export function describeWeather(code, isDay = 1) {
  const [label, icon] = WMO[code] || ['Unknown', 'cloud']
  if (!isDay && (code === 0 || code === 1)) return [label, 'moon']
  return [label, icon]
}

export function windDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

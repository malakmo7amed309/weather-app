import WeatherIcon from './WeatherIcon'
import { describeWeather, windDirection } from '../api'

export default function CurrentWeather({ place, current, daily, unit }) {
  const [label, icon] = describeWeather(current.weather_code, current.is_day)
  const symbol = unit === 'celsius' ? '°C' : '°F'
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return (
    <section className="current-card">
      <div className="current-main">
        <div>
          <h2 className="place">
            {place.name}
            {place.country ? <span className="country">, {place.country}</span> : null}
          </h2>
          <p className="today">{today}</p>
          <p className="condition">
            <span className="condition-icon" aria-hidden="true"><WeatherIcon kind={icon} /></span> {label}
          </p>
        </div>
        <div className="temp-block">
          <p className="temp">
            {Math.round(current.temperature_2m)}
            <span className="temp-unit">{symbol}</span>
          </p>
          <p className="feels">Feels like {Math.round(current.apparent_temperature)}{symbol}</p>
          <p className="hi-lo">
            <svg className="arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V5M6 11l6-6 6 6" /></svg> {Math.round(daily.temperature_2m_max[0])}° &nbsp; <svg className="arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v15M6 13l6 6 6-6" /></svg> {Math.round(daily.temperature_2m_min[0])}°
          </p>
        </div>
      </div>
      <ul className="stat-grid">
        <li><span className="stat-label">Humidity</span><span className="stat-value">{current.relative_humidity_2m}%</span></li>
        <li><span className="stat-label">Wind</span><span className="stat-value">{Math.round(current.wind_speed_10m)} km/h {windDirection(current.wind_direction_10m)}</span></li>
        <li><span className="stat-label">Pressure</span><span className="stat-value">{Math.round(current.surface_pressure)} hPa</span></li>
        <li><span className="stat-label">Sunrise</span><span className="stat-value">{daily.sunrise[0].slice(11)}</span></li>
        <li><span className="stat-label">Sunset</span><span className="stat-value">{daily.sunset[0].slice(11)}</span></li>
        <li><span className="stat-label">Rain chance</span><span className="stat-value">{daily.precipitation_probability_max?.[0] ?? 0}%</span></li>
      </ul>
    </section>
  )
}

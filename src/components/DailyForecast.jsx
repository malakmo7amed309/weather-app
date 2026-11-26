import WeatherIcon from './WeatherIcon'
import { describeWeather } from '../api'

export default function DailyForecast({ daily, unit }) {
  return (
    <section className="panel">
      <h3 className="panel-title">7-day forecast</h3>
      <ul className="daily-list">
        {daily.time.map((day, i) => {
          const date = new Date(`${day}T12:00:00`)
          const weekday = i === 0 ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'short' })
          const [label, icon] = describeWeather(daily.weather_code[i])
          return (
            <li className="daily-row" key={day}>
              <span className="daily-day">{weekday}</span>
              <span className="daily-icon" title={label} aria-hidden="true"><WeatherIcon kind={icon} /></span>
              <span className="daily-rain">Rain {daily.precipitation_probability_max?.[i] ?? 0}%</span>
              <span className="daily-min">{Math.round(daily.temperature_2m_min[i])}°</span>
              <span className="daily-max">{Math.round(daily.temperature_2m_max[i])}°</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

import { describeWeather } from '../api'

export default function HourlyForecast({ hourly, timezone, unit }) {
  const symbol = unit === 'celsius' ? '°' : '°'
  // take the next 24 hours starting from the current hour in the place's timezone
  const nowInPlace = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))
  const startIndex = hourly.time.findIndex((t) => new Date(t) >= new Date(nowInPlace.getFullYear(), nowInPlace.getMonth(), nowInPlace.getDate(), nowInPlace.getHours()))
  const from = startIndex === -1 ? 0 : startIndex
  const slice = hourly.time.slice(from, from + 24)
  return (
    <section className="panel">
      <h3 className="panel-title">Next 24 hours</h3>
      <div className="hourly-row">
        {slice.map((t, i) => {
          const idx = from + i
          const hour = new Date(t).getHours()
          const [, icon] = describeWeather(hourly.weather_code[idx])
          return (
            <div className="hour-cell" key={t}>
              <span className="hour-time">{String(hour).padStart(2, '0')}:00</span>
              <span className="hour-icon" aria-hidden="true">{icon}</span>
              <span className="hour-temp">{Math.round(hourly.temperature_2m[idx])}{symbol}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { getForecast, searchCities } from './api'
import CurrentWeather from './components/CurrentWeather'
import DailyForecast from './components/DailyForecast'
import HourlyForecast from './components/HourlyForecast'
import SearchBar from './components/SearchBar'
import Spinner from './components/Spinner'
import ErrorBox from './components/ErrorBox'

const RECENTS_KEY = 'weather-app-recents'
const UNIT_KEY = 'weather-app-unit'
const DEFAULT_PLACE = { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 }

function loadRecents() {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY)) || []
  } catch {
    return []
  }
}

export default function App() {
  const [place, setPlace] = useState(DEFAULT_PLACE)
  const [recents, setRecents] = useState(loadRecents)
  const [unit, setUnit] = useState(() => localStorage.getItem(UNIT_KEY) || 'celsius')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  const load = useCallback(async (target, selectedUnit) => {
    const id = ++requestId.current
    setLoading(true)
    setError('')
    try {
      const forecast = await getForecast({
        latitude: target.latitude,
        longitude: target.longitude,
        unit: selectedUnit,
      })
      if (id !== requestId.current) return // a newer request already finished
      setData(forecast)
    } catch {
      if (id !== requestId.current) return
      setError('Could not load the forecast. Check your connection and try again.')
      setData(null)
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(place, unit)
  }, [place, unit, load])

  function choosePlace(p) {
    const chosen = {
      name: p.name,
      country: p.country || '',
      latitude: p.latitude,
      longitude: p.longitude,
    }
    setPlace(chosen)
    setRecents((prev) => {
      const next = [chosen, ...prev.filter((r) => r.name !== chosen.name || r.country !== chosen.country)].slice(0, 5)
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      return next
    })
  }

  function toggleUnit() {
    const next = unit === 'celsius' ? 'fahrenheit' : 'celsius'
    setUnit(next)
    localStorage.setItem(UNIT_KEY, next)
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        choosePlace({
          name: 'My location',
          country: '',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => setError('Location permission was denied. Search for a city instead.'),
    )
  }

  return (
    <div className="app">
      <header className="topbar container">
        <h1 className="brand">
          <span aria-hidden="true">⛅</span> SkyCast
        </h1>
        <button className="unit-toggle" onClick={toggleUnit} title="Switch units">
          °{unit === 'celsius' ? 'C' : 'F'}
        </button>
      </header>

      <main className="container">
        <SearchBar onSearch={searchCities} onSelect={choosePlace} onLocate={useMyLocation} />

        {recents.length > 0 && (
          <div className="recents">
            {recents.map((r) => (
              <button key={`${r.name}-${r.country}`} className="chip" onClick={() => choosePlace(r)}>
                {r.name}
                {r.country ? `, ${r.country}` : ''}
              </button>
            ))}
          </div>
        )}

        {loading && <Spinner label="Loading forecast…" />}
        {error && !loading && <ErrorBox message={error} onRetry={() => load(place, unit)} />}

        {data && !loading && !error && (
          <>
            <CurrentWeather place={place} current={data.current} daily={data.daily} unit={unit} />
            <HourlyForecast hourly={data.hourly} timezone={data.timezone} unit={unit} />
            <DailyForecast daily={data.daily} unit={unit} />
          </>
        )}
      </main>

      <footer className="footer">
        <p>
          Built with React + the Open-Meteo API. Weather data by{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener">
            Open-Meteo
          </a>
          , free for non-commercial use.
        </p>
      </footer>
    </div>
  )
}

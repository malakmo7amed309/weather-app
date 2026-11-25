import { useEffect, useRef, useState } from 'react'

export default function SearchBar({ onSearch, onSelect, onLocate }) {
  const [text, setText] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const boxRef = useRef(null)

  // Debounce: wait until the user pauses typing before hitting the geocoding API
  useEffect(() => {
    if (text.trim().length < 2) {
      setResults([])
      setOpen(false)
      return undefined
    }
    setSearching(true)
    const timer = setTimeout(async () => {
      try {
        const cities = await onSearch(text.trim())
        setResults(cities)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [text, onSearch])

  // Close the dropdown when clicking outside it
  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function pick(city) {
    setText('')
    setOpen(false)
    onSelect(city)
  }

  return (
    <div className="search-row">
      <div className="search-box" ref={boxRef}>
        <input
          type="search"
          className="search-input"
          placeholder="Search for a city… (e.g. Al Fayyum)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Search for a city"
        />
        {searching && <span className="search-hint">searching…</span>}
        {open && results.length > 0 && (
          <ul className="suggestions">
            {results.map((c) => (
              <li key={`${c.id}-${c.name}`}>
                <button type="button" onClick={() => pick(c)}>
                  <strong>{c.name}</strong>
                  <span>
                    {[c.admin1, c.country].filter(Boolean).join(', ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {open && results.length === 0 && !searching && (
          <ul className="suggestions">
            <li className="no-match">No cities found</li>
          </ul>
        )}
      </div>
      <button className="locate-btn" onClick={onLocate} title="Use my location">
        My location
      </button>
    </div>
  )
}

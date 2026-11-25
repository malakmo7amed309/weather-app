# How SkyCast works (plain-language tour)

This note explains how the app is put together, so you can talk about it
confidently in an interview.

## The big picture

SkyCast is a single-page React app with one screen made of sections: a search
bar, recent-search chips, a current-conditions card, an hourly strip and a
7-day list. There is no router and no backend of our own: all weather data
comes from the free [Open-Meteo](https://open-meteo.com) API.

## Where the data comes from

Two Open-Meteo APIs, both free with no key:

- The **geocoding API** turns a city name into coordinates and a country
  ("Al Fayyum" -> latitude/longitude in Egypt).
- The **forecast API** takes coordinates and returns current conditions,
  hourly values and daily values in one response.

`src/api.js` is the only file that talks to these APIs. It also holds the
table that translates the numeric **WMO weather codes** the API returns (like
`61`) into human labels and icons ("Light rain"). Pages never build URLs or
interpret codes themselves; if the API changes, there is one file to fix.

## The main state flow

`App.jsx` owns three pieces of state: the selected **place**, the temperature
**unit**, and the loaded **forecast data**. One `useEffect` watches the place
and the unit: whenever either changes, it refetches the forecast. That is the
core React idea here: the UI is a function of state, and side effects
(network requests) follow state changes.

Two small details worth being able to explain:

- **Stale-request protection.** If you search London and quickly switch back
  to Cairo, two requests are in flight and the slower one could win, showing
  the wrong city. A request counter (`useRef`) tags each request, and only
  the newest one is allowed to update the screen.
- **Debounced search.** The autocomplete does not call the geocoding API on
  every keystroke. A 400 ms timer resets with each keystroke, so the request
  fires only when you pause typing. Fewer requests, less flicker, no rate
  limits.

## Working with the browser

- **Geolocation API**: the "My location" button asks the browser for your
  coordinates (which always triggers a permission prompt) and uses them as
  the selected place.
- **`localStorage`**: recent searches (as chips) and the °C/°F choice are
  saved locally, so they survive a refresh without any account or database.
- **Timezones**: the hourly strip starts at "now" in the *city's* timezone,
  not the visitor's, using `Intl` formatting with the timezone name the API
  returns for each place.

## Concepts worth mentioning in an interview

- Component composition: `SearchBar`, `CurrentWeather`, `HourlyForecast`,
  `DailyForecast`, `Spinner` and `ErrorBox` are small single-purpose pieces.
- Lifting state up: the place and unit live in `App` because several
  components need them; data flows down as props, and events flow up as
  callbacks (`onSelect`, `onLocate`).
- Derived data: labels, icons and the hourly "next 24 hours" slice are
  computed from API data at render time, never stored as separate state.
- Graceful failure: loading spinners, an error box with a retry button, and
  "no cities found" in the autocomplete.

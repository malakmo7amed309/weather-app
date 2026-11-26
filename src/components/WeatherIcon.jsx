const SUN = '#f6b93b'
const CLOUD = '#e9eef5'
const EDGE = '#90a4b8'
const CLOUD_PATH = 'M7 20a4.500 4.500 0 0 1 .5-9A6 6 0 0 1 19 12.500a3.800 3.800 0 0 1-.5 7.500z'

function Sun({ cx = 12, cy = 12, r = 4.500, rays = true }) {
  return (
    <g>
      {rays && [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1={cx} y1={cy - r - 2} x2={cx} y2={cy - r - 4} stroke={SUN} strokeWidth="1.800" strokeLinecap="round" transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill={SUN} />
    </g>
  )
}

const Cloud = ({ t = '' }) => <path d={CLOUD_PATH} fill={CLOUD} stroke={EDGE} strokeWidth="1.400" strokeLinejoin="round" transform={t} />
const drops = (xs, y = 21.500) => xs.map((x) => <line key={x} x1={x} y1={y} x2={x - 1.200} y2={y + 2} stroke="#3b82c4" strokeWidth="1.800" strokeLinecap="round" />)

export default function WeatherIcon({ kind = 'cloud', size = 28 }) {
  let body
  switch (kind) {
    case 'sun': body = <Sun cx={12} cy={12} r={5} />; break
    case 'moon': body = <path d="M19 14.500A8 8 0 0 1 9.500 5a8 8 0 1 0 9.500 9.500z" fill="#c9d4ff" stroke="#8a9bd6" strokeWidth="1.400" strokeLinejoin="round" />; break
    case 'mostly': body = <><Sun cx={9} cy={9} r={3.800} /><Cloud t="translate(3 -1) scale(.8)" /></>; break
    case 'partly': body = <><Sun cx={8} cy={8} r={3.500} /><Cloud t="translate(1 0)" /></>; break
    case 'fog': body = <><Cloud t="translate(0 -3)" /><path d="M5 20h14M7 23h10" stroke={EDGE} strokeWidth="1.800" strokeLinecap="round" /></>; break
    case 'showers': body = <><Sun cx={7.500} cy={7} r={3} rays={false} /><Cloud t="translate(0 -2)" />{drops([9, 13, 17], 19)}</>; break
    case 'rain': body = <><Cloud t="translate(0 -3)" />{drops([8, 12, 16], 18.500)}</>; break
    case 'snow': body = <><Cloud t="translate(0 -3)" />{[8, 12, 16].map((x) => <circle key={x} cx={x} cy="20.500" r="1.200" fill="#7aa7d9" />)}</>; break
    case 'storm': body = <><Cloud t="translate(0 -3)" /><path d="M12.500 15l-3 4.500h3l-1 4 4.500-5.500h-3z" fill={SUN} /></>; break
    default: body = <Cloud />
  }
  return <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>{body}</svg>
}

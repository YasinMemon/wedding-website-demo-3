import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Islamic geometric tessellation — eight-point khatam stars joined by a
 * continuous lattice. Drawn as an SVG pattern so it is crisp at any size.
 */
export function GeoPattern({ color = '#D9C9A5', opacity = 0.08, size = 88, className = '', strokeWidth = 0.8 }) {
  const id = useId().replace(/:/g, '')
  const c = size / 2
  const h = size * 0.21 // half-side of each square in the star
  const tip = h * Math.SQRT2
  const star = (x, y) => (
    <g key={`${x}-${y}`}>
      <rect x={x - h} y={y - h} width={h * 2} height={h * 2} />
      <rect x={x - h} y={y - h} width={h * 2} height={h * 2} transform={`rotate(45 ${x} ${y})`} />
      <circle cx={x} cy={y} r={h * 0.36} />
    </g>
  )
  return (
    <svg className={`pointer-events-none ${className}`} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth={strokeWidth}>
            {[star(c, c), star(0, 0), star(size, 0), star(0, size), star(size, size)]}
            {/* axis lattice */}
            <path d={`M${c} ${c - tip}V0M${c} ${c + tip}V${size}M${c - tip} ${c}H0M${c + tip} ${c}H${size}`} />
            <path d={`M${tip} 0H${c}M${size - tip} 0H${c}M${tip} ${size}H${c}M${size - tip} ${size}H${c}M0 ${tip}V${c}M0 ${size - tip}V${c}M${size} ${tip}V${c}M${size} ${size - tip}V${c}`} />
            {/* diagonal lattice */}
            <path d={`M${h} ${h}L${c - h} ${c - h}M${size - h} ${h}L${c + h} ${c - h}M${h} ${size - h}L${c - h} ${c + h}M${size - h} ${size - h}L${c + h} ${c + h}`} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  )
}

const ARCH_OUTER = 'M1 300V104C1 51 52 21 100 1c48 20 99 50 99 103v196'
const ARCH_INNER = 'M11 300V107C11 59 57 31 100 13c43 18 89 46 89 94v193'

/**
 * Double-line pointed arch outline that rises into view. Stretches to its box
 * while keeping hairline strokes crisp (non-scaling stroke). The reveal uses a
 * clip-path sweep — dash-based "drawing" is unreliable with non-scaling strokes.
 */
export function ArchOutline({ className = '', color = '#D9C9A5', draw = true, delay = 0, duration = 2.4, inner = true, width = 1 }) {
  const reduce = useReducedMotion()
  const anim = draw && !reduce
  const stroke = { fill: 'none', stroke: color, strokeWidth: width, vectorEffect: 'non-scaling-stroke' }
  return (
    <motion.svg
      className={`pointer-events-none overflow-visible ${className}`}
      viewBox="0 0 200 300"
      preserveAspectRatio="none"
      aria-hidden="true"
      initial={anim ? { clipPath: 'inset(100% -2% -2% -2%)', opacity: 0 } : false}
      animate={{ clipPath: 'inset(-2% -2% -2% -2%)', opacity: 1 }}
      transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      <path d={ARCH_OUTER} {...stroke} />
      {inner && <path d={ARCH_INNER} {...stroke} strokeOpacity={0.55} />}
    </motion.svg>
  )
}

/** Eight-point star glyph. */
export function Star8({ size = 14, className = '', filled = false, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill={filled ? color : 'none'} stroke={color} strokeWidth={filled ? 0 : 1.1}>
        <rect x="5" y="5" width="14" height="14" />
        <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
      </g>
      {!filled && <circle cx="12" cy="12" r="2" fill={color} />}
    </svg>
  )
}

/** Hairline — star — hairline. */
export function Divider({ className = '', color = 'currentColor', width = 'w-14' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={{ color }} aria-hidden="true">
      <span className={`h-px ${width} bg-current opacity-50`} />
      <Star8 size={12} />
      <span className={`h-px ${width} bg-current opacity-50`} />
    </div>
  )
}

/** Stationery corner flourish (rotate per corner). */
export function Corner({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="0.9">
      <path d="M2 58V14C2 7 7 2 14 2h44" />
      <path d="M8 58V18c0-5.5 4.5-10 10-10h40" strokeOpacity=".5" />
      <g transform="translate(14 14)">
        <rect x="-4" y="-4" width="8" height="8" />
        <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" />
      </g>
    </svg>
  )
}

/** Delicate botanical sprig — jasmine & leaves, line-drawn. */
export function FloralSprig({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
      <path d="M60 218C58 170 50 130 62 90S78 30 70 6" />
      {[
        [58, 180, -35], [61, 150, 32], [56, 122, -38], [64, 98, 30], [66, 66, -30], [72, 42, 28],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x + (r > 0 ? 9 : -9)} cy={y} rx="11" ry="4.2" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <g transform="translate(70 8)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-6" rx="3.2" ry="6" transform={`rotate(${a})`} />
        ))}
        <circle r="1.6" fill={color} />
      </g>
      <g transform="translate(40 132) scale(.7)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-6" rx="3.2" ry="6" transform={`rotate(${a})`} />
        ))}
        <circle r="1.6" fill={color} />
      </g>
    </svg>
  )
}

/** Circular monogram seal. */
export function Monogram({ className = '', color = '#D9C9A5', letters = ['A', 'Z'] }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`${letters[0]} and ${letters[1]} monogram`}>
      <g fill="none" stroke={color}>
        <circle cx="60" cy="60" r="57" strokeWidth="0.8" />
        <circle cx="60" cy="60" r="51" strokeWidth="0.5" strokeOpacity=".6" />
        <rect x="26" y="26" width="68" height="68" strokeWidth="0.5" strokeOpacity=".45" />
        <rect x="26" y="26" width="68" height="68" strokeWidth="0.5" strokeOpacity=".45" transform="rotate(45 60 60)" />
      </g>
      <text x="44" y="72" textAnchor="middle" fill={color} style={{ font: '300 34px "Noto Serif Display", Georgia, serif' }}>{letters[0]}</text>
      <text x="60" y="68" textAnchor="middle" fill={color} style={{ font: 'italic 400 18px "Cormorant Garamond", Georgia, serif' }}>&amp;</text>
      <text x="77" y="72" textAnchor="middle" fill={color} style={{ font: '300 34px "Noto Serif Display", Georgia, serif' }}>{letters[1]}</text>
    </svg>
  )
}

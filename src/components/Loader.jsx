import { motion, useReducedMotion } from 'framer-motion'
import { wedding, coupleNames } from '../config/wedding'
import { GeoPattern } from './ornaments'
import { EASE } from './motion'

export function Loader() {
  const reduce = useReducedMotion()
  const draw = (delay) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.4, delay, ease: [0.65, 0, 0.35, 1] },
  })
  return (
    <motion.div
      className="fixed inset-0 z-100 grid place-items-center bg-emerald"
      // Click-through as soon as it starts leaving, so the Open button is usable immediately.
      exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: reduce ? 0.3 : 0.9, ease: EASE } }}
      role="status"
      aria-live="polite"
      aria-label="Loading the invitation"
    >
      <GeoPattern className="absolute inset-0" opacity={0.045} />
      <div className="relative flex flex-col items-center text-champagne">
        <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden="true">
          <g fill="none" stroke="#D9C9A5" strokeWidth="0.9">
            <motion.path d="M22 22H78V78H22Z" {...draw(0)} />
            <motion.path d="M50 10.4 89.6 50 50 89.6 10.4 50Z" {...draw(0.25)} />
            <motion.circle cx="50" cy="50" r="12" {...draw(0.5)} />
          </g>
        </svg>
        <motion.p
          className="eyebrow mt-8 text-champagne/85"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: EASE }}
        >
          {coupleNames}
        </motion.p>
        <div className="mt-5 h-px w-40 overflow-hidden bg-champagne/15">
          <motion.div
            className="h-full origin-left bg-champagne"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: wedding.loader.minDuration / 1000, ease: [0.45, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import { music, useMusic } from '../utils/music'

/** Animated equaliser bars — flat when paused. */
export function EqBars({ playing, className = '' }) {
  return (
    <span className={`flex h-4 items-end gap-[3px] ${className}`} aria-hidden="true">
      {[0.9, 0.55, 1, 0.7].map((d, i) => (
        <span
          key={i}
          className="w-[2px] origin-bottom rounded-full bg-current"
          style={{
            height: '100%',
            transform: playing ? undefined : 'scaleY(0.22)',
            animation: playing ? `eq ${d}s ease-in-out ${i * 0.12}s infinite` : 'none',
            transition: 'transform .4s',
          }}
        />
      ))}
    </span>
  )
}

export function MusicToggle({ visible }) {
  const playing = useMusic()
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={() => music.toggle()}
      className="group fixed bottom-5 right-5 z-[60] flex h-[3.25rem] items-center gap-3 rounded-full border border-champagne/40 bg-emerald/85 pl-[1.15rem] pr-[1.15rem] text-champagne shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:bg-emerald md:bottom-7 md:right-7"
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      aria-pressed={playing}
      initial={false}
      animate={visible ? { opacity: 1, y: 0, pointerEvents: 'auto' } : { opacity: 0, y: 24, pointerEvents: 'none' }}
      transition={{ duration: reduce ? 0 : 0.9, delay: visible && !reduce ? 2 : 0 }}
    >
      <EqBars playing={playing} />
      <span className="eyebrow hidden !text-[0.58rem] sm:inline">{playing ? 'Music on' : 'Music off'}</span>
    </motion.button>
  )
}

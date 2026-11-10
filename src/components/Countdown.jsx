import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CalendarPlus } from 'lucide-react'
import { wedding } from '../config/wedding'
import { googleCalendarUrl } from '../utils/calendar'
import { pad, timeLeft } from '../utils/time'
import { GeoPattern, Star8 } from './ornaments'
import { Reveal, SectionTitle } from './motion'

/** Re-renders exactly on each wall-clock second (self-correcting, no drift). */
function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    let id
    const tick = () => {
      setNow(Date.now())
      id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5)
    }
    id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5)
    const onVisible = () => !document.hidden && setNow(Date.now())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
  return now
}

function Digit({ char }) {
  const reduce = useReducedMotion()
  return (
    <span className="relative inline-block w-[0.6em] overflow-hidden text-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          className="inline-block"
          initial={reduce ? false : { y: '-70%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={reduce ? undefined : { y: '70%', opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Unit({ value, label, digits = 2, className = '' }) {
  const str = String(value).padStart(digits, '0')
  return (
    <div className={`flex flex-col items-center border-champagne/20 px-2 py-8 md:py-12 ${className}`} data-unit={label} data-value={Number(value)}>
      <span className="display whitespace-nowrap text-[clamp(3.1rem,8.4vw,7rem)] font-light leading-none text-ivory" aria-hidden="true">
        {str.split('').map((c, i) => (
          <Digit key={`${str.length}-${i}`} char={c} />
        ))}
      </span>
      <span className="eyebrow mt-5 text-champagne">{label}</span>
    </div>
  )
}

export function Countdown() {
  const { countdown: c, date } = wedding
  const now = useNow()
  const t = timeLeft(c.target, now)

  return (
    <section id="countdown" className="relative overflow-hidden bg-emerald py-24 text-ivory md:py-36">
      <GeoPattern className="absolute inset-0" opacity={0.06} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(29,81,67,0.9)_0%,rgba(18,60,50,0)_65%)]" />
      <SectionTitle kicker={c.kicker} title={c.title} accent={c.titleAccent} light className="relative px-5" />

      <Reveal className="relative mx-auto mt-14 max-w-5xl px-5 md:mt-20">
        {t.done ? (
          <p className="display text-center text-[clamp(2rem,5vw,3.6rem)] text-champagne">{c.afterMessage}</p>
        ) : (
          <>
            <p className="sr-only" aria-live="off">
              {t.days} days, {t.hours} hours and {t.minutes} minutes until the Nikah.
            </p>
            <div className="grid grid-cols-2 border-y border-champagne/20 md:grid-cols-4">
              <Unit value={t.days} label="Days" digits={t.days >= 100 ? 3 : 2} className="border-b border-r md:border-b-0" />
              <Unit value={t.hours} label="Hours" className="border-b md:border-b-0 md:border-r" />
              <Unit value={t.minutes} label="Minutes" className="border-r" />
              <Unit value={pad(t.seconds)} label="Seconds" />
            </div>
          </>
        )}
      </Reveal>

      <Reveal delay={0.15} className="relative mt-12 flex flex-col items-center gap-7 px-5 text-center">
        <p className="eyebrow flex flex-col items-center justify-center gap-2 text-ivory/80 sm:flex-row sm:gap-3">
          <span>{date.long}</span>
          <Star8 size={8} filled color="#D9C9A5" className="hidden sm:block" />
          <span>11:00 AM {wedding.timezoneLabel}</span>
        </p>
        <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-champagne">
          <CalendarPlus size={14} strokeWidth={1.5} aria-hidden="true" /> Save the Date
        </a>
      </Reveal>
    </section>
  )
}

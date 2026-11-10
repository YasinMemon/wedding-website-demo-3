import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUp, CalendarPlus, ChevronDown, Download } from 'lucide-react'
import { wedding, coupleNames } from '../config/wedding'
import { downloadIcs, googleCalendarUrl } from '../utils/calendar'
import { music, useMusic } from '../utils/music'
import { scrollToId, whatsappShareUrl } from '../utils/share'
import { Divider, GeoPattern, Monogram, Star8 } from './ornaments'
import { EqBars } from './MusicToggle'
import { Reveal, RiseText } from './motion'

function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

function CalendarMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button type="button" className="btn btn-ivory" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        <CalendarPlus size={14} strokeWidth={1.5} aria-hidden="true" /> Add to Calendar
        <ChevronDown size={13} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className="absolute bottom-[calc(100%+0.75rem)] left-1/2 z-20 w-72 -translate-x-1/2 overflow-hidden rounded-2xl bg-ivory p-2 text-left text-emerald shadow-2xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <a
              role="menuitem"
              href={googleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-beige"
            >
              <CalendarPlus size={16} strokeWidth={1.4} className="text-bronze" aria-hidden="true" />
              <span>
                <span className="block text-sm font-medium">Google Calendar</span>
                <span className="block text-xs text-charcoal/55">The Nikah ceremony</span>
              </span>
            </a>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                downloadIcs()
                setOpen(false)
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-beige"
            >
              <Download size={16} strokeWidth={1.4} className="text-bronze" aria-hidden="true" />
              <span>
                <span className="block text-sm font-medium">Apple / Outlook (.ics)</span>
                <span className="block text-xs text-charcoal/55">All four celebrations</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Closing() {
  const reduce = useReducedMotion()
  const playing = useMusic()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '0%'])
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.15, 1])
  const { closing: c, date } = wedding

  return (
    <>
      <section id="closing" ref={ref} className="relative flex min-h-svh items-center overflow-hidden bg-emerald-deep text-ivory">
        <motion.picture className="absolute inset-0 block" style={{ y, scale }}>
          <source media="(min-width: 768px)" srcSet={c.imageLg} />
          <img src={c.imageSm} alt={c.alt} loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_60%] md:object-[50%_35%]" />
        </motion.picture>
        <div className="absolute inset-0 bg-emerald-deep/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,43,36,0.55)_0%,rgba(12,43,36,0.35)_45%,rgba(12,43,36,0.8)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-emerald-deep to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-28 text-center">
          <Reveal>
            <p lang="ar" aria-hidden="true" className="font-ruqaa text-[clamp(2.4rem,6vw,3.6rem)] leading-none text-champagne">
              مبارك
            </p>
            <p className="eyebrow mt-3 text-champagne/75">Mubarak</p>
          </Reveal>
          <h2 className="display mt-8 text-[clamp(2.3rem,5.6vw,4.7rem)] leading-[1.08]">
            <RiseText text={c.blessing} />
          </h2>
          <Reveal delay={0.3}>
            <Divider className="mt-10" color="#D9C9A5" />
            <p className="accent mt-8 text-[clamp(1.6rem,3vw,2.2rem)] text-champagne">{c.signoff}</p>
            <p className="eyebrow mt-4 text-ivory/80">{date.display}</p>
          </Reveal>

          <Reveal delay={0.45} className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <a href={whatsappShareUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-champagne bg-emerald-deep/30 backdrop-blur-sm">
              <WhatsAppIcon size={15} /> Share on WhatsApp
            </a>
            <CalendarMenu />
            <button type="button" onClick={() => music.toggle()} className="btn btn-ivory" aria-pressed={playing} aria-label={playing ? 'Pause background music' : 'Play background music'}>
              <EqBars playing={playing} className="h-3!" /> {playing ? 'Pause Music' : 'Play Music'}
            </button>
            <button type="button" onClick={() => scrollToId('top')} className="icon-btn border-ivory/60 text-ivory hover:bg-ivory hover:text-emerald" aria-label="Back to top">
              <ArrowUp size={17} strokeWidth={1.4} />
            </button>
          </Reveal>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-emerald-deep px-5 pb-24 pt-20 text-ivory md:pb-10">
        <GeoPattern className="absolute inset-0" opacity={0.04} />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <Monogram className="h-20 w-20" />
            <p className="display mt-6 text-[2.4rem]">{coupleNames}</p>
            <p className="accent mt-1 text-xl text-champagne">{wedding.title}</p>
            <p className="eyebrow mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-ivory/60">
              <span className="whitespace-nowrap">{date.display}</span>
              <Star8 size={7} filled color="#D9C9A5" />
              <span className="whitespace-nowrap">{wedding.city}, India</span>
            </p>
          </div>

          <nav aria-label="Footer" className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-y border-ivory/10 py-6">
            {wedding.nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="ulink eyebrow text-[0.6rem]! text-ivory/70 hover:text-champagne">
                {n.label}
              </a>
            ))}
            <button type="button" onClick={() => scrollToId('top')} className="ulink eyebrow text-[0.6rem]! text-champagne">
              Back to top ↑
            </button>
          </nav>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 text-center text-[0.72rem] tracking-[0.12em] text-ivory/45 md:flex-row">
            <p>{wedding.footer.credit}</p>
            <p>{wedding.collection} · {wedding.footer.photoCredit}</p>
          </div>
        </div>
      </footer>
    </>
  )
}

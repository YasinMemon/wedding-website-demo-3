import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { wedding } from '../config/wedding'
import { scrollToId } from '../utils/share'
import { GeoPattern, Monogram, Star8 } from './ornaments'
import { EASE } from './motion'

export function Navbar({ visible }) {
  const reduce = useReducedMotion()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.82)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const els = wedding.nav.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    // Let the menu begin closing before scrolling.
    setTimeout(() => scrollToId(id), open ? 280 : 0)
  }

  const tone = solid ? 'text-emerald' : 'text-ivory'

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-700 ${
          solid ? 'on-light bg-ivory/85 shadow-[0_1px_0_rgba(18,60,50,0.08)] backdrop-blur-xl' : 'bg-gradient-to-b from-black/30 to-transparent'
        }`}
        initial={false}
        animate={visible ? { y: 0, opacity: 1 } : { y: '-100%', opacity: 0 }}
        transition={{ duration: reduce ? 0 : 1, ease: EASE, delay: visible && !reduce ? 1.6 : 0 }}
      >
        <nav className={`mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 md:px-8 ${tone}`} aria-label="Main">
          <a href="#home" onClick={go('top')} className="flex items-center gap-3" aria-label="Back to top">
            <Monogram className="h-10 w-10" color={solid ? '#123C32' : '#D9C9A5'} />
            <span className="eyebrow hidden sm:inline">{wedding.couple.groom.first} &amp; {wedding.couple.bride.first}</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {wedding.nav.map((n) =>
              n.id === 'rsvp' ? (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    className={`btn !min-h-0 !px-6 !py-2.5 ${solid ? 'btn-outline' : 'btn-ivory'}`}
                  >
                    {n.label}
                  </a>
                </li>
              ) : (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={go(n.id)} className="eyebrow ulink" aria-current={active === n.id ? 'true' : undefined}>
                    {n.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          <button
            type="button"
            className="icon-btn border-current/30 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu size={18} strokeWidth={1.4} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[70] flex flex-col bg-emerald text-ivory"
            initial={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 2.6rem) 2.2rem)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'circle(150% at calc(100% - 2.6rem) 2.2rem)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 2.6rem) 2.2rem)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <GeoPattern className="absolute inset-0" opacity={0.06} />
            <div className="relative flex h-[4.5rem] items-center justify-between px-5">
              <Monogram className="h-10 w-10" />
              <button type="button" className="icon-btn border-ivory/30" onClick={() => setOpen(false)} aria-label="Close menu" autoFocus>
                <X size={18} strokeWidth={1.4} />
              </button>
            </div>
            <ul className="relative flex flex-1 flex-col items-center justify-center gap-7">
              {wedding.nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: EASE }}
                >
                  <a href={`#${n.id}`} onClick={go(n.id)} className="display text-[2.6rem] text-ivory transition-colors hover:text-champagne">
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="relative flex items-center justify-center gap-3 pb-10 text-champagne/80">
              <Star8 size={10} />
              <span className="eyebrow">{wedding.date.display} · {wedding.city}</span>
              <Star8 size={10} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

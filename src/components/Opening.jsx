import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { wedding } from '../config/wedding'
import { ArchOutline, Divider, GeoPattern, Star8 } from './ornaments'
import { EASE, EASE_IN_OUT } from './motion'

/**
 * Full-screen invitation card on emerald "doors". On open, the card dissolves
 * and the doors part to reveal the hero underneath.
 */
export function Opening({ onOpen }) {
  const reduce = useReducedMotion()
  const [clicked, setClicked] = useState(false)
  const { opening: o, couple, date } = wedding

  const door = (side) => ({
    exit: reduce ? { opacity: 0 } : { x: side === 'left' ? '-101%' : '101%' },
    transition: { duration: reduce ? 0.5 : 1.7, ease: EASE_IN_OUT, delay: reduce ? 0 : 0.5 },
  })

  const item = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: EASE, delay: 0.35 + i * 0.14 },
  })

  const handleOpen = () => {
    if (clicked) return
    setClicked(true)
    onOpen()
  }

  return (
    <motion.div
      className="fixed inset-0 z-90"
      exit={{ pointerEvents: 'none' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-names"
    >
      {/* The two doors (each pattern spans the full viewport so the seam aligns perfectly) */}
      {['left', 'right'].map((side) => (
        <motion.div
          key={side}
          className={`absolute inset-y-0 w-1/2 overflow-hidden bg-emerald ${side === 'left' ? 'left-0' : 'right-0'}`}
          {...door(side)}
        >
          <div className={`absolute inset-y-0 w-screen ${side === 'left' ? 'left-0' : 'right-0'}`}>
            <GeoPattern className="absolute inset-0" opacity={0.075} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(29,81,67,0.55)_0%,rgba(12,43,36,0.85)_75%)]" />
          </div>
          {/* Seam light — appears only as the doors part */}
          <motion.div
            className={`absolute inset-y-0 w-px bg-linear-to-b from-transparent via-champagne/60 to-transparent ${side === 'left' ? 'right-0' : 'left-0'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      ))}

      {/* Invitation card */}
      <motion.div
        className="no-scrollbar relative z-10 flex h-full items-center justify-center overflow-y-auto px-5 py-8"
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
        transition={{ duration: 0.75, ease: EASE }}
      >
        <div className="relative my-auto w-full max-w-md text-center">
          <ArchOutline className="absolute inset-0 h-full w-full" delay={0.2} duration={2.6} />
          <ArchOutline className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] opacity-40" inner={false} delay={0.5} duration={2.8} />

          <div className="relative px-7 pb-16 pt-[clamp(5rem,14vh,7.5rem)] sm:px-12">
            <motion.p {...item(0)} lang="ar" className="arabic text-[clamp(1.45rem,5vw,2rem)] text-champagne">
              {o.basmala}
            </motion.p>
            <motion.p {...item(1)} className="eyebrow mt-1 text-champagne/70">
              {o.basmalaLabel}
            </motion.p>
            <motion.div {...item(2)}>
              <Divider className="mt-6" color="#D9C9A5" width="w-10" />
            </motion.div>
            <motion.p {...item(3)} className="eyebrow mt-6 text-ivory/80">
              {o.kicker}
            </motion.p>
            <motion.h1 {...item(4)} id="opening-names" className="display mt-5 text-[clamp(3.2rem,12vw,5.2rem)] leading-[0.92] text-ivory">
              {couple.groom.first}
              <span className="accent my-1 block text-[0.55em] leading-none text-champagne">&amp;</span>
              {couple.bride.first}
            </motion.h1>
            <motion.p {...item(5)} className="accent mx-auto mt-6 max-w-76 text-[1.4rem] leading-snug text-champagne/95">
              {o.invite}
            </motion.p>
            <motion.p {...item(6)} className="eyebrow mt-6 flex items-center justify-center gap-3 text-ivory/85">
              {date.display.split(' ').map((part, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 && <Star8 size={7} filled color="#D9C9A5" />}
                  {part}
                </span>
              ))}
            </motion.p>
          </div>

          <motion.div {...item(7)} className="relative -mt-7 flex flex-col items-center">
            <button type="button" onClick={handleOpen} disabled={clicked} className="btn btn-champagne bg-emerald" autoFocus>
              <Star8 size={12} />
              {o.button}
            </button>
            <p className="mt-4 flex items-center gap-2 text-[0.7rem] tracking-[0.18em] text-ivory/55">
              <Volume2 size={13} aria-hidden="true" /> Best experienced with sound on
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

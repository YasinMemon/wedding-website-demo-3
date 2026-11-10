import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { wedding } from '../config/wedding'
import { scrollToId } from '../utils/share'
import { ArchOutline, Star8 } from './ornaments'
import { EASE } from './motion'

export function Hero({ entered }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '16%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%'])
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const { hero: h, couple, date, city } = wedding

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: entered ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.4, ease: EASE, delay: reduce ? 0 : delay },
  })
  const name = (delay) => ({
    initial: reduce ? false : { y: '105%' },
    animate: entered ? { y: '0%' } : undefined,
    transition: { duration: 1.5, ease: EASE, delay: reduce ? 0 : delay },
  })

  return (
    <section id="home" ref={ref} className="relative h-svh min-h-160 w-full overflow-hidden bg-emerald-deep text-ivory">
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <motion.picture
          className="block h-full w-full"
          initial={reduce ? false : { scale: 1.16 }}
          animate={entered ? { scale: 1.02 } : undefined}
          transition={{ duration: 3.4, ease: EASE, delay: 0.3 }}
        >
          <source media="(min-width: 768px)" srcSet={h.imageLg} />
          <img
            src={h.imageSm}
            alt={h.alt}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[50%_42%] md:object-[50%_22%]"
          />
        </motion.picture>
      </motion.div>

      {/* Cinematic grading */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,43,36,0.55)_0%,rgba(12,43,36,0)_26%,rgba(12,43,36,0)_45%,rgba(12,43,36,0.72)_78%,rgba(12,43,36,0.96)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(12,43,36,0.45)_100%)]" />

      {/* Arch framing the couple (desktop) */}
      {entered && (
        <ArchOutline
          className="absolute left-1/2 top-[11vh] hidden h-[74vh] w-[min(40vh,30vw)] -translate-x-1/2 opacity-60 lg:block"
          delay={1.2}
          duration={2.8}
        />
      )}

      <motion.div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[clamp(6.5rem,13vh,9rem)]" style={{ y: textY, opacity: fade }}>
        <motion.p {...rise(1.1)} className="eyebrow flex items-center justify-center gap-3 text-champagne">
          <span className="h-px w-8 bg-champagne/60" />
          {h.kicker}
          <span className="h-px w-8 bg-champagne/60" />
        </motion.p>

        <h1 className="display mt-4 text-center leading-[0.9]">
          <span className="sr-only">
            {couple.groom.first} and {couple.bride.first}
          </span>
          <span aria-hidden="true" className="flex flex-col items-center lg:flex-row lg:items-baseline lg:justify-center lg:gap-[2.2vw]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span {...name(1.25)} className="block text-[clamp(3.8rem,15vw,10.5rem)] lg:text-[clamp(5rem,9.6vw,10.5rem)]">
                {couple.groom.first}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span {...name(1.4)} className="accent block text-[clamp(2.6rem,9vw,4.5rem)] text-champagne lg:text-[clamp(3.5rem,6vw,7rem)]">
                &amp;
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span {...name(1.55)} className="block text-[clamp(3.8rem,15vw,10.5rem)] lg:text-[clamp(5rem,9.6vw,10.5rem)]">
                {couple.bride.first}
              </motion.span>
            </span>
          </span>
        </h1>

        <motion.p {...rise(1.85)} className="accent mx-auto mt-5 max-w-xl text-center text-[clamp(1.25rem,2.4vw,1.75rem)] text-ivory/90">
          {h.tagline}
        </motion.p>
        <motion.p {...rise(2.05)} className="eyebrow mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-ivory/85">
          <span>{date.display}</span>
          <Star8 size={8} filled color="#D9C9A5" />
          <span>{city}</span>
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToId('invitation')}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-ivory/70 transition-colors hover:text-champagne"
        initial={reduce ? false : { opacity: 0 }}
        animate={entered ? { opacity: 1 } : undefined}
        transition={{ delay: reduce ? 0 : 2.6, duration: 1 }}
        aria-label="Scroll to the invitation"
      >
        <span className="eyebrow text-[0.56rem]!">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 block h-1/2 bg-champagne" style={{ animation: 'scroll-cue 2.2s cubic-bezier(.65,0,.35,1) infinite' }} />
        </span>
      </motion.button>
    </section>
  )
}

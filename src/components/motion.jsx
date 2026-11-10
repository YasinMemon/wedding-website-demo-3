import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Divider } from './ornaments'

export const EASE = [0.22, 0.8, 0.2, 1]
export const EASE_IN_OUT = [0.76, 0, 0.24, 1]

/** Fade-and-rise on scroll. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', amount = 0.15 }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

/*
 * NOTE: the in-view trigger always lives on an *unclipped* parent. A child that
 * starts fully masked (translated out of an overflow box / clipped to zero)
 * has no visible area, so an IntersectionObserver on it would never fire.
 */
const wordVariants = {
  hidden: { y: '110%' },
  show: (d) => ({ y: '0%', transition: { duration: 1.15, ease: EASE, delay: d } }),
}

/** Masked word-by-word rise for headings. */
export function RiseText({ text, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.14em] mb-[-0.14em] align-bottom" aria-hidden="true">
          <motion.span className="inline-block" variants={wordVariants} custom={delay + i * 0.07}>
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

const unveilVariants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.5, ease: EASE_IN_OUT } },
}

/** Image that unveils from the bottom inside its (optionally arched) frame, with gentle parallax. */
export function UnveilImage({ src, alt, className = '', imgClassName = '', parallax = 40, eager = false, sizes, width, height }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-parallax, parallax])
  return (
    <motion.div
      ref={ref}
      className={`${/\babsolute\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div className="absolute inset-0 overflow-hidden" variants={unveilVariants}>
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ y, scale: 1.14 }}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      </motion.div>
    </motion.div>
  )
}

/** Eyebrow + two-tone headline (serif + italic accent) + star divider. */
export function SectionTitle({ kicker, title, accent, light = false, align = 'center', className = '' }) {
  const center = align === 'center'
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      <Reveal>
        <p className={`eyebrow ${light ? 'text-champagne' : 'text-bronze'}`}>{kicker}</p>
      </Reveal>
      <h2 className={`display mt-5 text-[clamp(2.5rem,6.4vw,5.4rem)] ${light ? 'text-ivory' : 'text-emerald'}`}>
        <RiseText text={title} />
        <br />
        <span className={`accent text-[1.08em] ${light ? 'text-champagne' : 'text-forest'}`}>
          <RiseText text={accent} delay={0.18} />
        </span>
      </h2>
      <Reveal delay={0.3}>
        <Divider className={`mt-7 ${center ? '' : 'lg:justify-start!'}`} color={light ? '#D9C9A5' : '#B19D72'} />
      </Reveal>
    </div>
  )
}

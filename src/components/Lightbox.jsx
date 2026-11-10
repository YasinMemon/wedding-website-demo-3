import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { GeoPattern } from './ornaments'

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.98 }),
}

export function Lightbox({ images, index, onClose, onIndex }) {
  const reduce = useReducedMotion()
  const [dir, setDir] = useState(0)
  const closeRef = useRef(null)
  const count = images.length
  const img = images[index]

  const go = useCallback(
    (step) => {
      setDir(step)
      onIndex((index + step + count) % count)
    },
    [index, count, onIndex],
  )

  useEffect(() => {
    const prevFocus = document.activeElement
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // Preload neighbours for instant navigation.
  useEffect(() => {
    ;[1, -1].forEach((s) => {
      const n = images[(index + s + count) % count]
      if (n) new Image().src = n.full
    })
  }, [index, images, count])

  return (
    <motion.div
      className="fixed inset-0 z-80 flex flex-col bg-emerald-deep/97 text-ivory backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <GeoPattern className="absolute inset-0" opacity={0.04} />

      <div className="relative z-10 flex h-16 items-center justify-between px-4 sm:px-6">
        <p className="eyebrow text-champagne" aria-live="polite">
          {String(index + 1).padStart(2, '0')} <span className="text-ivory/40">/ {String(count).padStart(2, '0')}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="icon-btn border-ivory/25 hover:bg-ivory hover:text-emerald" aria-label="Close gallery">
          <X size={18} strokeWidth={1.4} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.figure
            key={img.id}
            custom={dir}
            variants={reduce ? undefined : variants}
            initial={reduce ? { opacity: 0 } : 'enter'}
            animate={reduce ? { opacity: 1 } : 'center'}
            exit={reduce ? { opacity: 0 } : 'exit'}
            transition={{ duration: 0.55, ease: [0.22, 0.8, 0.2, 1] }}
            className="flex max-h-full flex-col items-center"
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1)
              else if (info.offset.x > 70) go(-1)
            }}
          >
            <img
              src={img.full}
              alt={img.alt}
              className="max-h-[calc(100svh-11rem)] w-auto max-w-full touch-pan-y select-none rounded-sm object-contain shadow-2xl"
              style={{ aspectRatio: `${img.w} / ${img.h}` }}
              draggable={false}
            />
            <figcaption className="mt-4 max-w-xl px-4 text-center">
              <span className="eyebrow block text-champagne">{img.category}</span>
              <span className="accent mt-1 block text-lg text-ivory/85">{img.caption}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          className="icon-btn absolute left-3 top-1/2 hidden -translate-y-1/2 border-ivory/25 bg-emerald-deep/40 hover:bg-ivory hover:text-emerald sm:inline-grid md:left-6"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} strokeWidth={1.3} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="icon-btn absolute right-3 top-1/2 hidden -translate-y-1/2 border-ivory/25 bg-emerald-deep/40 hover:bg-ivory hover:text-emerald sm:inline-grid md:right-6"
          aria-label="Next image"
        >
          <ChevronRight size={20} strokeWidth={1.3} />
        </button>
      </div>

      {/* Mobile controls */}
      <div className="relative z-10 flex items-center justify-center gap-6 pb-6 pt-2 sm:hidden">
        <button type="button" onClick={() => go(-1)} className="icon-btn border-ivory/25" aria-label="Previous image">
          <ChevronLeft size={20} strokeWidth={1.3} />
        </button>
        <span className="eyebrow text-[0.56rem]! text-ivory/50">Swipe</span>
        <button type="button" onClick={() => go(1)} className="icon-btn border-ivory/25" aria-label="Next image">
          <ChevronRight size={20} strokeWidth={1.3} />
        </button>
      </div>
    </motion.div>
  )
}

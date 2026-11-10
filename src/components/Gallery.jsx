import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { wedding } from '../config/wedding'
import { Lightbox } from './Lightbox'
import { SectionTitle, Reveal } from './motion'

function Tile({ img, i, onOpen }) {
  const reduce = useReducedMotion()
  return (
    <motion.figure
      className="mb-4 break-inside-avoid sm:mb-5"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.22, 0.8, 0.2, 1], delay: (i % 3) * 0.08 }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full overflow-hidden rounded-[1.25rem] bg-beige text-left"
        aria-label={`View image: ${img.caption}`}
      >
        <img
          src={img.src}
          alt={img.alt}
          width={img.w > 100 ? img.w : img.w * 360}
          height={img.w > 100 ? img.h : img.h * 360}
          loading="lazy"
          decoding="async"
          className="h-auto w-full transition-transform duration-[1.4s] ease-[cubic-bezier(.22,.8,.2,1)] group-hover:scale-[1.06]"
          style={{ aspectRatio: `${img.w} / ${img.h}` }}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-emerald-deep/85 via-emerald-deep/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="absolute inset-x-0 bottom-0 flex translate-y-4 items-end justify-between gap-4 p-5 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span>
            <span className="eyebrow block !text-[0.58rem] text-champagne">{img.category}</span>
            <span className="accent mt-1 block text-[1.1rem] leading-snug text-ivory">{img.caption}</span>
          </span>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ivory/40 text-ivory">
            <Maximize2 size={14} strokeWidth={1.4} aria-hidden="true" />
          </span>
        </span>
      </button>
    </motion.figure>
  )
}

export function Gallery() {
  const { gallery: g } = wedding
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null)
  const shown = useMemo(() => (filter === 'All' ? g.images : g.images.filter((i) => i.category === filter)), [filter, g.images])

  return (
    <section id="gallery" className="on-light relative bg-ivory py-24 md:py-36">
      <SectionTitle kicker={g.kicker} title={g.title} accent={g.titleAccent} className="px-5" />

      <Reveal className="mt-10 px-4">
        <div className="no-scrollbar mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center" role="tablist" aria-label="Filter gallery">
          {g.filters.map((f) => {
            const active = f === filter
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.62rem] font-semibold tracking-[0.24em] uppercase transition-colors duration-500 ${
                  active ? 'border-emerald bg-emerald text-ivory' : 'border-emerald/15 text-emerald/75 hover:border-emerald/50 hover:text-emerald'
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>
      </Reveal>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="columns-1 gap-4 min-[480px]:columns-2 sm:gap-5 lg:columns-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {shown.map((img, i) => (
              <Tile key={img.id} img={img} i={i} onOpen={() => setOpen(i)} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open !== null && <Lightbox images={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  )
}

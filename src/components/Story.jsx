import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { wedding } from '../config/wedding'
import { ArchOutline, GeoPattern, Star8 } from './ornaments'
import { Reveal, SectionTitle, UnveilImage } from './motion'

function Chapter({ chapter, index }) {
  const flip = index % 2 === 1
  return (
    <article className="relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-24">
      {/* Node on the timeline */}
      <span className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory p-2 text-bronze lg:block">
        <Star8 size={16} />
      </span>

      <div className={`relative mx-auto w-full max-w-104 ${flip ? 'lg:order-2' : ''}`}>
        <div className="absolute -inset-4 hidden sm:block">
          <ArchOutline className="h-full w-full" color="#C9B68C" inner={false} draw={false} />
        </div>
        <UnveilImage
          src={chapter.image}
          alt={chapter.alt}
          className="arch aspect-4/5 w-full bg-beige"
          parallax={36}
        />
      </div>

      <div className={`relative text-center lg:text-left ${flip ? 'lg:order-1 lg:text-right' : ''}`}>
        <Reveal>
          <span
            className="display block text-[clamp(4.5rem,9vw,7.5rem)] leading-none text-transparent"
            style={{ WebkitTextStroke: '1px #B19D72' }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mt-4 text-bronze">{chapter.when}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <h3 className="display mt-4 text-[clamp(2.1rem,4vw,3.3rem)] text-emerald">{chapter.title}</h3>
        </Reveal>
        <Reveal delay={0.26}>
          <p className={`mx-auto mt-5 max-w-md text-[1.02rem] leading-[1.9] text-charcoal/75 ${flip ? 'lg:ml-auto lg:mr-0' : 'lg:mx-0'}`}>
            {chapter.text}
          </p>
        </Reveal>
      </div>
    </article>
  )
}

export function Story() {
  const { story } = wedding
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  return (
    <section id="story" className="on-light relative overflow-hidden bg-ivory py-24 md:py-36">
      <GeoPattern className="absolute inset-x-0 top-0 h-72 mask-[linear-gradient(to_bottom,black,transparent)]" color="#B19D72" opacity={0.08} />
      <SectionTitle kicker={story.kicker} title={story.title} accent={story.titleAccent} className="relative px-5" />

      <div ref={ref} className="relative mx-auto mt-14 max-w-6xl px-5 md:mt-20">
        <div className="absolute bottom-20 left-1/2 top-20 hidden w-px -translate-x-1/2 bg-champagne/40 lg:block" aria-hidden="true">
          <motion.div className="h-full w-full origin-top bg-bronze" style={{ scaleY: progress }} />
        </div>
        {story.chapters.map((c, i) => (
          <Chapter key={c.title} chapter={c} index={i} />
        ))}
      </div>
    </section>
  )
}

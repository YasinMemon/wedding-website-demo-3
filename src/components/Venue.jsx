import { BedDouble, ExternalLink, Info, MapPin, Navigation, Plane, Sun, TrainFront } from 'lucide-react'
import { wedding } from '../config/wedding'
import { Reveal, SectionTitle, UnveilImage } from './motion'
import { Star8 } from './ornaments'

const ICONS = { bed: BedDouble, plane: Plane, train: TrainFront, sun: Sun }

export function Venue() {
  const { venue: v, city, region } = wedding
  return (
    <section id="venue" className="on-light relative overflow-hidden bg-beige py-24 md:py-36">
      <SectionTitle kicker={v.kicker} title={v.title} accent={v.titleAccent} className="px-5" />

      <div className="mx-auto mt-14 grid max-w-6xl items-center gap-10 px-5 md:mt-20 lg:grid-cols-12 lg:gap-0">
        <div className="relative lg:col-span-7">
          <UnveilImage src={v.image} alt={v.alt} className="aspect-[4/3] w-full rounded-[2rem] lg:aspect-[5/4]" parallax={40} />
          <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-ivory/90 px-4 py-2 text-[0.6rem] font-semibold tracking-[0.24em] text-emerald uppercase backdrop-blur">
            <MapPin size={12} strokeWidth={1.6} aria-hidden="true" /> {city} · Gujarat
          </span>
        </div>

        <Reveal className="relative lg:col-span-5 lg:-ml-16">
          <div className="rounded-[2rem] bg-ivory p-8 shadow-card sm:p-10 md:p-12">
            <p className="eyebrow text-bronze">{v.descriptor}</p>
            <h3 className="display mt-4 text-[clamp(2.2rem,4vw,3.2rem)] text-emerald">{v.name}</h3>
            {v.isPlaceholder && (
              <p className="mt-4 inline-flex items-start gap-2 rounded-lg bg-beige/70 px-3 py-2 text-[0.78rem] leading-snug text-charcoal/70">
                <Info size={14} className="mt-[2px] shrink-0 text-bronze" aria-hidden="true" />
                Sample venue for this invitation design — name, address &amp; map links are configurable.
              </p>
            )}
            <p className="mt-6 text-[0.98rem] leading-[1.9] text-charcoal/75">{v.description}</p>

            <div className="mt-7 flex gap-3 border-t border-emerald/10 pt-6">
              <MapPin size={18} strokeWidth={1.4} className="mt-1 shrink-0 text-bronze" aria-hidden="true" />
              <address className="not-italic text-[0.95rem] text-charcoal/80">
                {v.address}
                <span className="block text-charcoal/55">
                  {city}, {region}
                </span>
              </address>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={v.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-emerald">
                <Navigation size={14} strokeWidth={1.5} aria-hidden="true" /> Get Directions
              </a>
              <a href={v.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" /> Google Maps
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-5 md:mt-28">
        <Reveal className="flex items-center gap-4">
          <Star8 size={14} className="text-bronze" />
          <h3 className="eyebrow text-emerald">Stay &amp; Travel</h3>
          <span className="h-px flex-1 bg-emerald/15" />
        </Reveal>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {v.details.map((d, i) => {
            const Icon = ICONS[d.icon] ?? Star8
            return (
              <Reveal key={d.title} delay={i * 0.08}>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-bronze/40 text-forest">
                  <Icon size={18} strokeWidth={1.3} aria-hidden="true" />
                </span>
                <h4 className="display mt-5 text-[1.6rem] text-emerald">{d.title}</h4>
                <p className="mt-3 text-[0.93rem] leading-[1.85] text-charcoal/70">{d.text}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

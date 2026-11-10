import { wedding } from '../config/wedding'
import { Corner, Divider, FloralSprig, Monogram } from './ornaments'
import { Reveal } from './motion'

/** Stationery-inspired formal invitation wording. */
export function Invitation() {
  const { invitation: t, couple, date, city, region } = wedding
  return (
    <section id="invitation" className="on-light relative overflow-hidden bg-beige/70 px-5 py-24 md:py-36">
      <FloralSprig className="pointer-events-none absolute -left-6 bottom-0 hidden h-104 text-champagne md:block" />
      <FloralSprig className="pointer-events-none absolute -right-6 top-6 hidden h-104 -scale-x-100 rotate-180 text-champagne md:block" />

      <Reveal className="relative mx-auto max-w-3xl">
        <div className="paper-grain relative border border-champagne/70 bg-ivory p-2.5 shadow-card">
          <div className="relative border border-champagne/40 px-6 py-16 text-center sm:px-14 md:py-20">
            <Corner className="absolute left-3 top-3 h-12 w-12 text-champagne" />
            <Corner className="absolute right-3 top-3 h-12 w-12 rotate-90 text-champagne" />
            <Corner className="absolute bottom-3 right-3 h-12 w-12 rotate-180 text-champagne" />
            <Corner className="absolute bottom-3 left-3 h-12 w-12 -rotate-90 text-champagne" />

            <Monogram className="mx-auto h-20 w-20" color="#9C8455" />
            <p className="eyebrow mt-8 text-bronze">{t.kicker}</p>
            <p className="accent mx-auto mt-6 max-w-md text-[1.3rem] leading-relaxed text-charcoal/80">{t.opening},</p>

            <p className="mt-8 font-display text-[1.05rem] tracking-[0.12em] text-emerald uppercase">{couple.groom.parents}</p>
            <p className="mx-auto mt-3 max-w-sm text-[0.95rem] text-charcoal/70">{t.groomLine}</p>

            <h2 className="display mt-8 text-[clamp(2.8rem,8vw,4.6rem)] text-emerald">{couple.groom.full}</h2>
            <p className="accent my-3 text-[1.8rem] text-bronze">{t.joiner}</p>
            <h2 className="display text-[clamp(2.8rem,8vw,4.6rem)] text-emerald">{couple.bride.full}</h2>

            <p className="mx-auto mt-6 max-w-sm text-[0.95rem] text-charcoal/70">{t.brideLine}</p>
            <p className="mt-3 font-display text-[1.05rem] tracking-[0.12em] text-emerald uppercase">{couple.bride.parents}</p>

            <Divider className="mt-10" color="#B19D72" />
            <p className="eyebrow mt-8 text-emerald">{date.long}</p>
            <p className="mt-2 text-sm tracking-[0.2em] text-charcoal/65 uppercase">
              {city}, {region}
            </p>
            <p className="accent mx-auto mt-8 max-w-md text-[1.25rem] text-charcoal/75">{t.closing}</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

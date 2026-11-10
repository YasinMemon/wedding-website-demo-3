import { CalendarPlus, Clock, Download, MapPin, Shirt } from 'lucide-react'
import { wedding } from '../config/wedding'
import { downloadIcs, googleCalendarUrl } from '../utils/calendar'
import { ArchOutline, FloralSprig, GeoPattern, Star8 } from './ornaments'
import { Reveal, SectionTitle, UnveilImage } from './motion'

/** Marigold bloom — the Haldi motif. */
function Marigold({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke={color} strokeWidth="0.9" aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse key={i} cx="50" cy="26" rx="7" ry="18" transform={`rotate(${i * 22.5} 50 50)`} />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={`i${i}`} cx="50" cy="36" rx="4.5" ry="10" transform={`rotate(${i * 36 + 18} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="6" />
    </svg>
  )
}

/** Each celebration gets its own palette and motif inside one shared system. */
const THEMES = {
  mehndi: {
    card: 'bg-forest text-ivory',
    sub: 'text-ivory/75',
    label: 'text-sage',
    rule: 'border-ivory/15',
    accent: '#A9C3A0',
    btn: 'btn-ivory',
    imageFrame: 'full',
    Motif: (p) => <FloralSprig {...p} />,
  },
  haldi: {
    card: 'bg-[#F4E9CC] text-charcoal on-light',
    sub: 'text-charcoal/70',
    label: 'text-[#9A6E12]',
    rule: 'border-charcoal/10',
    accent: '#C99A2E',
    btn: 'btn-outline',
    imageFrame: 'round',
    Motif: (p) => <Marigold {...p} />,
  },
  nikah: {
    card: 'bg-ivory text-emerald ring-1 ring-champagne/70 on-light',
    sub: 'text-charcoal/70',
    label: 'text-bronze',
    rule: 'border-emerald/10',
    accent: '#B19D72',
    btn: 'btn-outline',
    imageFrame: 'arch',
    Motif: (p) => <Star8 {...p} size="100%" />,
  },
  walima: {
    card: 'bg-emerald-deep text-ivory',
    sub: 'text-ivory/70',
    label: 'text-champagne',
    rule: 'border-ivory/12',
    accent: '#D9C9A5',
    btn: 'btn-champagne',
    imageFrame: 'full',
    Motif: (p) => <Star8 {...p} size="100%" />,
  },
}

function EventImage({ event, theme }) {
  if (theme.imageFrame === 'full') {
    return (
      <div className="relative h-72 sm:h-96 md:h-full md:min-h-136">
        <UnveilImage src={event.image} alt={event.alt} className="absolute inset-0" parallax={30} />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
      </div>
    )
  }
  const shape = theme.imageFrame === 'arch' ? 'arch' : 'arch-round'
  return (
    <div className="relative flex h-full items-center justify-center p-8 sm:p-12 md:min-h-136">
      <GeoPattern className="absolute inset-0" color={theme.accent} opacity={0.18} size={64} />
      <div className="relative w-full max-w-76">
        {theme.imageFrame === 'arch' && (
          <ArchOutline className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]" color={theme.accent} draw={false} />
        )}
        <UnveilImage src={event.image} alt={event.alt} className={`${shape} aspect-3/4 w-full`} parallax={24} />
      </div>
    </div>
  )
}

function Detail({ icon: Icon, label, children, theme }) {
  return (
    <div className={`border-t pt-4 ${theme.rule}`}>
      <p className={`flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.26em] uppercase ${theme.label}`}>
        <Icon size={13} strokeWidth={1.5} aria-hidden="true" /> {label}
      </p>
      <div className="mt-2 text-[0.98rem] font-normal">{children}</div>
    </div>
  )
}

function EventCard({ event, index, total }) {
  const theme = THEMES[event.theme]
  const imageFirst = index % 2 === 0
  const [first, ...rest] = event.name.split(' ')
  return (
    <article
      className={`relative overflow-hidden rounded-4xl shadow-card lg:sticky ${theme.card}`}
      style={{ top: `calc(5.75rem + ${index * 1.4}rem)` }}
      aria-labelledby={`event-${event.id}`}
    >
      <div className="grid md:grid-cols-2">
        <div className={imageFirst ? '' : 'md:order-2'}>
          <EventImage event={event} theme={theme} />
        </div>

        <div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12 md:py-14 xl:px-16">
          <theme.Motif className="pointer-events-none absolute right-6 top-6 h-20 w-20 opacity-25" color={theme.accent} />
          <div className="flex items-center gap-4">
            <span className={`eyebrow ${theme.label}`}>
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span className="h-px w-10 bg-current opacity-25" />
            {event.featured && <span className={`eyebrow ${theme.label}`}>The Main Ceremony</span>}
          </div>

          <h3 id={`event-${event.id}`} className="display mt-5 text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.98]">
            {first} <span className="accent block text-[0.82em]" style={{ color: theme.accent }}>{rest.join(' ')}</span>
          </h3>
          <p className={`accent mt-3 text-[1.25rem] ${theme.sub}`}>{event.tagline}</p>
          <p className={`mt-4 max-w-md text-[0.97rem] leading-[1.85] ${theme.sub}`}>{event.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
            <Detail icon={CalendarPlus} label="Date" theme={theme}>
              <span className="block">{event.weekday}</span>
              {event.date}
            </Detail>
            <Detail icon={Clock} label="Time" theme={theme}>
              <span className="block">{event.time}</span>
              <span className={theme.sub}>{wedding.timezoneLabel}</span>
            </Detail>
            <Detail icon={Shirt} label="Dress Code" theme={theme}>
              <span className="block">{event.dressCode}</span>
              <span className="mt-2 flex gap-1.5" aria-hidden="true">
                {event.swatches.map((s) => (
                  <span key={s} className="h-4 w-4 rounded-full" style={{ background: s, boxShadow: '0 0 0 1px rgba(140,140,120,0.45)' }} />
                ))}
              </span>
            </Detail>
            <Detail icon={MapPin} label="Setting" theme={theme}>
              <span className="block">{event.space}</span>
              <span className={theme.sub}>{wedding.venue.name}</span>
            </Detail>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={`btn ${theme.btn}`}>
              <CalendarPlus size={14} strokeWidth={1.5} aria-hidden="true" /> Add to Calendar
            </a>
            <button
              type="button"
              onClick={() => downloadIcs(event, `ayaan-zara-${event.id}.ics`)}
              className={`ulink inline-flex items-center gap-2 px-2 text-[0.66rem] font-medium tracking-[0.24em] uppercase ${theme.sub}`}
              aria-label={`Download ${event.name} calendar file for Apple Calendar or Outlook`}
            >
              <Download size={13} strokeWidth={1.5} aria-hidden="true" /> Apple / Outlook
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function Events() {
  const { events } = wedding
  return (
    <section id="celebrations" className="on-light relative bg-beige py-24 md:py-36">
      <GeoPattern className="absolute inset-0 mask-[linear-gradient(to_bottom,black,transparent_40%)]" color="#B19D72" opacity={0.1} />
      <SectionTitle kicker={events.kicker} title={events.title} accent={events.titleAccent} className="relative px-5" />

      <Reveal className="relative mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3 px-5">
        {events.list.map((e) => (
          <a key={e.id} href={`#event-${e.id}`} className="ulink eyebrow text-emerald/80">
            {e.short} · <span className="text-bronze">{e.date.replace(' 2028', '')}</span>
          </a>
        ))}
      </Reveal>

      <div className="relative mx-auto mt-14 flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:mt-20 lg:gap-[12vh]">
        {events.list.map((e, i) => (
          <EventCard key={e.id} event={e} index={i} total={events.list.length} />
        ))}
      </div>
    </section>
  )
}

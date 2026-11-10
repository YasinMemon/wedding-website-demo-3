import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Info, LoaderCircle, Minus, Plus, Send } from 'lucide-react'
import { wedding } from '../config/wedding'
import { isDemoMode, submitRsvp, validateRsvp } from '../utils/rsvp'
import { GeoPattern, Monogram, Star8 } from './ornaments'
import { Reveal, SectionTitle, EASE } from './motion'

const initial = () => ({
  name: '',
  email: '',
  phone: '',
  attending: '',
  guests: 1,
  events: wedding.events.list.map((e) => e.id),
  dietary: wedding.rsvp.dietary[0],
  message: '',
})

function Field({ id, label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} className="err" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Success({ values, onReset }) {
  const reduce = useReducedMotion()
  const accepted = values.attending === 'accept'
  const first = values.name.trim().split(' ')[0]
  const draw = (delay) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1, delay, ease: [0.65, 0, 0.35, 1] },
  })
  return (
    <motion.div
      key="success"
      className="relative flex min-h-136 flex-col items-center justify-center py-8 text-center"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      role="status"
      aria-live="polite"
    >
      {/* Soft burst of stars */}
      {!reduce &&
        Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2
          return (
            <motion.span
              key={i}
              className="absolute left-1/2 top-[30%] text-champagne"
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              animate={{ x: Math.cos(a) * 150, y: Math.sin(a) * 110, opacity: [0, 1, 0], scale: [0.4, 1, 0.6], rotate: 90 }}
              transition={{ duration: 1.8, delay: 0.6 + (i % 4) * 0.05, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <Star8 size={12} filled color="#C9B68C" />
            </motion.span>
          )
        })}

      <svg viewBox="0 0 100 100" className="h-28 w-28" aria-hidden="true">
        <motion.circle cx="50" cy="50" r="46" fill="none" stroke="#B19D72" strokeWidth="1" {...draw(0.1)} />
        <motion.circle cx="50" cy="50" r="40" fill="#123C32" initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 0.7, ease: EASE }} style={{ transformOrigin: 'center' }} />
        <motion.path d="M34 51 45 62 67 39" fill="none" stroke="#FAF8F0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...draw(0.9)} />
      </svg>

      <p className="eyebrow mt-8 text-bronze">{accepted ? 'Response received' : 'With gratitude'}</p>
      <h3 className="display mt-4 text-[clamp(2.2rem,5vw,3.2rem)] text-emerald">Shukriya, {first}.</h3>
      <p className="mx-auto mt-4 max-w-md text-[1rem] leading-[1.85] text-charcoal/75">
        {accepted
          ? `We are overjoyed that you will celebrate with us${values.guests > 1 ? ` — a place is being prepared for your party of ${values.guests}` : ''}. We cannot wait to see you in ${wedding.city}.`
          : 'Thank you for letting us know. You will be dearly missed, and we will hold you close in our hearts and prayers on the day.'}
      </p>

      {isDemoMode() && (
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-beige px-4 py-2 text-[0.75rem] text-charcoal/70">
          <Info size={13} className="text-bronze" aria-hidden="true" /> Demo mode — this response was not stored or sent anywhere.
        </p>
      )}

      <button type="button" onClick={onReset} className="btn btn-outline mt-8">
        Send another response
      </button>
    </motion.div>
  )
}

export function Rsvp() {
  const { rsvp: r, events } = wedding
  const uid = useId()
  const id = (n) => `${uid}-${n}`
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const cardRef = useRef(null)
  const prevStatus = useRef(status)

  // The form is taller than the confirmation — keep the card in view when it swaps
  // (only on sending → done and done → idle, never on first render).
  useEffect(() => {
    const prev = prevStatus.current
    prevStatus.current = status
    const swapped = (prev === 'sending' && status === 'done') || (prev === 'done' && status === 'idle')
    if (!swapped) return
    const el = cardRef.current
    if (!el) return
    const t = setTimeout(() => {
      const r = el.getBoundingClientRect()
      if (r.top < 0 || r.top > window.innerHeight * 0.6) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: window.scrollY + r.top - 96, behavior: reduce ? 'auto' : 'smooth' })
      }
    }, 450)
    return () => clearTimeout(t)
  }, [status])

  const set = (key, val) => {
    const next = { ...values, [key]: val }
    setValues(next)
    if (touched) setErrors(validateRsvp(next))
  }
  const toggleEvent = (eid) => set('events', values.events.includes(eid) ? values.events.filter((x) => x !== eid) : [...values.events, eid])

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    const errs = validateRsvp(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(id(first))?.focus({ preventScroll: false })
      return
    }
    setStatus('sending')
    try {
      await submitRsvp(values)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(initial())
    setErrors({})
    setTouched(false)
    setStatus('idle')
  }

  const aria = (k) => ({ 'aria-invalid': errors[k] ? 'true' : 'false', 'aria-describedby': errors[k] ? `${id(k)}-err` : undefined })
  const accepted = values.attending === 'accept'

  return (
    <section id="rsvp" className="relative overflow-hidden bg-emerald py-24 md:py-36">
      <GeoPattern className="absolute inset-0" opacity={0.055} />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-12 lg:gap-16">
        <div className="text-ivory lg:col-span-5 lg:pt-6">
          <SectionTitle kicker={r.kicker} title={r.title} accent={r.titleAccent} light align="left" className="text-center lg:text-left" />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-md text-center text-[1.02rem] leading-[1.9] text-ivory/75 lg:mx-0 lg:text-left">{r.intro}</p>
          </Reveal>
          <Reveal delay={0.3} className="mx-auto mt-10 max-w-md lg:mx-0">
            <div className="relative overflow-hidden rounded-3xl border border-champagne/25 p-7 text-center lg:text-left">
              <Monogram className="absolute -right-8 -top-8 h-36 w-36 opacity-15" />
              <p className="eyebrow text-champagne">Kindly respond by</p>
              <p className="display mt-3 text-[2.2rem] text-ivory">{r.deadline}</p>
              <p className="mt-4 text-sm text-ivory/60">
                {r.contact.label}: <span className="text-ivory/85">{r.contact.phone}</span>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div ref={cardRef} className="on-light paper-grain relative rounded-4xl bg-ivory p-6 shadow-[0_50px_100px_-50px_rgba(0,0,0,0.7)] sm:p-10 md:p-12">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <Success values={values} onReset={reset} />
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="relative space-y-8">
                  {/* Attendance */}
                  <fieldset aria-describedby={errors.attending ? `${id('attending')}-err` : undefined}>
                    <legend className="label">Will you attend?</legend>
                    <div className="grid grid-cols-2 gap-3" role="radiogroup">
                      {[
                        ['accept', 'Joyfully accepts', 'With pleasure'],
                        ['regret', 'Regretfully declines', 'With love, from afar'],
                      ].map(([val, title, sub], i) => {
                        const on = values.attending === val
                        return (
                          <button
                            key={val}
                            id={i === 0 ? id('attending') : undefined}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => set('attending', val)}
                            className={`relative rounded-2xl border p-4 text-left transition-all duration-500 sm:p-5 ${
                              on ? 'border-emerald bg-emerald text-ivory shadow-lg' : 'border-emerald/15 text-emerald hover:border-emerald/45'
                            }`}
                          >
                            <span className={`absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full border ${on ? 'border-champagne bg-champagne text-emerald' : 'border-emerald/25'}`}>
                              {on && <Check size={12} strokeWidth={2.4} />}
                            </span>
                            <span className="display block pr-6 text-[1.25rem] leading-tight sm:text-[1.45rem]">{title}</span>
                            <span className={`accent mt-1 block text-[1rem] ${on ? 'text-champagne' : 'text-bronze'}`}>{sub}</span>
                          </button>
                        )
                      })}
                    </div>
                    {errors.attending && (
                      <p id={`${id('attending')}-err`} className="err" role="alert">
                        {errors.attending}
                      </p>
                    )}
                  </fieldset>

                  <div className="grid gap-7 sm:grid-cols-2">
                    <Field id={id('name')} label="Full name" error={errors.name} className="sm:col-span-2">
                      <input id={id('name')} className="field" autoComplete="name" placeholder="Your full name" value={values.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} />
                    </Field>
                    <Field id={id('email')} label="Email" error={errors.email}>
                      <input id={id('email')} type="email" inputMode="email" className="field" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />
                    </Field>
                    <Field id={id('phone')} label="Phone number" error={errors.phone}>
                      <input id={id('phone')} type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="+91 98765 43210" value={values.phone} onChange={(e) => set('phone', e.target.value)} {...aria('phone')} />
                    </Field>
                  </div>

                  <AnimatePresence initial={false}>
                    {accepted && (
                      <motion.div
                        key="accept-fields"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-8 pt-1">
                          <div className="grid gap-7 sm:grid-cols-2">
                            <Field id={id('guests')} label="Number of guests" error={errors.guests}>
                              <div className="flex items-center justify-between border-b border-charcoal/20 py-1.5">
                                <button type="button" className="icon-btn h-9! w-9! border-emerald/20 text-emerald hover:bg-emerald hover:text-ivory disabled:opacity-30" onClick={() => set('guests', Math.max(1, values.guests - 1))} disabled={values.guests <= 1} aria-label="Fewer guests">
                                  <Minus size={14} />
                                </button>
                                <output id={id('guests')} className="display text-[1.6rem] text-emerald" aria-live="polite" tabIndex={-1}>
                                  {values.guests} <span className="font-sans text-xs tracking-[0.2em] text-charcoal/50 uppercase">{values.guests === 1 ? 'guest' : 'guests'}</span>
                                </output>
                                <button type="button" className="icon-btn h-9! w-9! border-emerald/20 text-emerald hover:bg-emerald hover:text-ivory disabled:opacity-30" onClick={() => set('guests', Math.min(r.maxGuests, values.guests + 1))} disabled={values.guests >= r.maxGuests} aria-label="More guests">
                                  <Plus size={14} />
                                </button>
                              </div>
                            </Field>
                            <Field id={id('dietary')} label="Dietary preference">
                              <select id={id('dietary')} className="field" value={values.dietary} onChange={(e) => set('dietary', e.target.value)}>
                                {r.dietary.map((d) => (
                                  <option key={d}>{d}</option>
                                ))}
                              </select>
                            </Field>
                          </div>

                          <fieldset>
                            <legend className="label">Celebrations attending</legend>
                            <div className="flex flex-wrap gap-2.5" id={id('events')} tabIndex={-1}>
                              {events.list.map((ev) => {
                                const on = values.events.includes(ev.id)
                                return (
                                  <button
                                    key={ev.id}
                                    type="button"
                                    role="checkbox"
                                    aria-checked={on}
                                    onClick={() => toggleEvent(ev.id)}
                                    className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.85rem] transition-colors duration-400 ${
                                      on ? 'border-forest bg-forest text-ivory' : 'border-emerald/20 text-emerald/80 hover:border-emerald/50'
                                    }`}
                                  >
                                    <span className={`grid h-4 w-4 place-items-center rounded-full border ${on ? 'border-champagne bg-champagne text-forest' : 'border-emerald/30'}`}>
                                      {on && <Check size={10} strokeWidth={3} />}
                                    </span>
                                    {ev.short}
                                    <span className={`text-[0.72rem] ${on ? 'text-ivory/60' : 'text-charcoal/45'}`}>{ev.date.replace(' February 2028', ' Feb')}</span>
                                  </button>
                                )
                              })}
                            </div>
                            {errors.events && (
                              <p className="err" role="alert">
                                {errors.events}
                              </p>
                            )}
                          </fieldset>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Field id={id('message')} label="A personal message (optional)" error={errors.message}>
                    <textarea
                      id={id('message')}
                      rows={3}
                      maxLength={600}
                      className="field resize-none"
                      placeholder="Share a prayer, a wish or a memory…"
                      value={values.message}
                      onChange={(e) => set('message', e.target.value)}
                      {...aria('message')}
                    />
                  </Field>

                  {isDemoMode() && (
                    <p className="flex items-start gap-2.5 rounded-xl bg-beige/80 px-4 py-3 text-[0.8rem] leading-relaxed text-charcoal/70">
                      <Info size={15} className="mt-0.5 shrink-0 text-bronze" aria-hidden="true" />
                      <span>
                        <strong className="font-semibold text-charcoal/85">Demo mode:</strong> this form is not connected to a backend, so responses are not stored or sent.
                      </span>
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="err text-center" role="alert">
                      We could not send your response just now. Please try again in a moment.
                    </p>
                  )}

                  <button type="submit" className="btn btn-emerald w-full" disabled={status === 'sending'}>
                    {status === 'sending' ? (
                      <>
                        <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send size={14} strokeWidth={1.5} aria-hidden="true" /> Send RSVP
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

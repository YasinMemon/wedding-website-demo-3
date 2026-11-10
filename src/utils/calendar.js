import { wedding, coupleNames } from '../config/wedding'

const stamp = (d) => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, '')
const location = (e) => `${e.space}, ${wedding.venue.name}, ${wedding.city}, ${wedding.region}`
const summary = (e) => `${e.name} — ${coupleNames}`
const details = (e) => `${e.tagline}. Dress code: ${e.dressCode}.\n\nInvitation: ${typeof window !== 'undefined' ? window.location.origin : wedding.siteUrl}`
const icsEscape = (s) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

/** The headline event used by the global "Add to Calendar" actions. */
export const mainEvent = () => wedding.events.list.find((e) => e.featured) ?? wedding.events.list[0]

export function googleCalendarUrl(e = mainEvent()) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary(e),
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    details: details(e),
    location: location(e),
    ctz: wedding.timezone,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

/** Builds an .ics file (Apple Calendar, Outlook…) for one or many events and downloads it. */
export function downloadIcs(events = wedding.events.list, filename = 'ayaan-zara-nikah.ics') {
  const list = Array.isArray(events) ? events : [events]
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Nikah Collection//Ayaan & Zara//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...list.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.id}-2028@ayaan-zara.wedding`,
      `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${stamp(e.start)}`,
      `DTEND:${stamp(e.end)}`,
      `SUMMARY:${icsEscape(summary(e))}`,
      `DESCRIPTION:${icsEscape(details(e))}`,
      `LOCATION:${icsEscape(location(e))}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsEscape(summary(e))} is tomorrow`,
      'END:VALARM',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

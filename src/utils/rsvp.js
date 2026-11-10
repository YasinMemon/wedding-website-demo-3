import { wedding } from '../config/wedding'

/** True while no backend is configured — the UI then says responses are not stored. */
export const isDemoMode = () => !wedding.rsvp.endpoint

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[\d\s()-]{7,20}$/

export function validateRsvp(v) {
  const errors = {}
  if (!v.name.trim() || v.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!EMAIL.test(v.email.trim())) errors.email = 'Please enter a valid email address.'
  const digits = v.phone.replace(/\D/g, '')
  if (!PHONE.test(v.phone.trim()) || digits.length < 7 || digits.length > 15)
    errors.phone = 'Please enter a valid phone number, including country code if outside India.'
  if (!v.attending) errors.attending = 'Please let us know if you can join us.'
  if (v.attending === 'accept') {
    if (!(v.guests >= 1 && v.guests <= wedding.rsvp.maxGuests))
      errors.guests = `Please choose between 1 and ${wedding.rsvp.maxGuests} guests.`
    if (!v.events.length) errors.events = 'Please select at least one celebration.'
  }
  if (v.message.length > 600) errors.message = 'Please keep your message under 600 characters.'
  return errors
}

/**
 * Submission handler — ready for backend integration.
 * With `wedding.rsvp.endpoint` set, the response is POSTed as JSON.
 * Without it, a realistic demo submission runs and nothing leaves the browser.
 */
export async function submitRsvp(values) {
  const payload = {
    ...values,
    guests: values.attending === 'accept' ? values.guests : 0,
    events: values.attending === 'accept' ? values.events : [],
    submittedAt: new Date().toISOString(),
    invitation: 'ayaan-zara-2028',
  }
  if (!isDemoMode()) {
    const res = await fetch(wedding.rsvp.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`RSVP failed (${res.status})`)
    return { stored: true }
  }
  await new Promise((r) => setTimeout(r, 1400))
  return { stored: false }
}

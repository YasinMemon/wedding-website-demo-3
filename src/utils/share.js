import { wedding } from '../config/wedding'

export const pageUrl = () => (typeof window !== 'undefined' ? window.location.href.split('#')[0] : wedding.siteUrl)

export const whatsappShareUrl = () =>
  `https://wa.me/?text=${encodeURIComponent(`${wedding.share.whatsappMessage} ${pageUrl()}`)}`

export const scrollToId = (id) => {
  if (id === 'top') return window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

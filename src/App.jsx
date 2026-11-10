import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { wedding } from './config/wedding'
import { music } from './utils/music'
import { prefersReducedMotion } from './utils/share'
import { Loader } from './components/Loader'
import { Opening } from './components/Opening'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Invitation } from './components/Invitation'
import { Story } from './components/Story'
import { Events } from './components/Events'
import { Countdown } from './components/Countdown'
import { Gallery } from './components/Gallery'
import { Venue } from './components/Venue'
import { Rsvp } from './components/Rsvp'
import { Closing } from './components/Closing'
import { MusicToggle } from './components/MusicToggle'

/** Resolves once the hero photograph and web fonts are ready (or on timeout). */
function useAssetsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    const t0 = performance.now()
    const min = prefersReducedMotion() ? 400 : wedding.loader.minDuration
    const finish = () => {
      if (cancelled) return
      setTimeout(() => !cancelled && setReady(true), Math.max(0, min - (performance.now() - t0)))
    }
    const hero = new Promise((resolve) => {
      const img = new Image()
      img.onload = img.onerror = resolve
      img.src = window.matchMedia('(min-width: 768px)').matches ? wedding.hero.imageLg : wedding.hero.imageSm
    })
    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.all([hero, fonts]).then(finish)
    const cap = setTimeout(() => !cancelled && setReady(true), wedding.loader.maxDuration)
    return () => {
      cancelled = true
      clearTimeout(cap)
    }
  }, [])
  return ready
}

export default function App() {
  const ready = useAssetsReady()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('locked', !opened)
    if (!opened) window.scrollTo(0, 0)
  }, [opened])

  const open = useCallback(() => {
    // Called from the button's click → audio is allowed to start.
    music.play()
    setOpened(true)
  }, [])

  return (
    <>
      <AnimatePresence>{!ready && <Loader key="loader" />}</AnimatePresence>
      <AnimatePresence>{ready && !opened && <Opening key="opening" onOpen={open} />}</AnimatePresence>

      <Navbar visible={opened} />
      <main id="top" aria-hidden={!opened || undefined} inert={!opened || undefined}>
        <Hero entered={opened} />
        <Invitation />
        <Story />
        <Events />
        <Countdown />
        <Gallery />
        <Venue />
        <Rsvp />
        <Closing />
      </main>
      <MusicToggle visible={opened} />
    </>
  )
}

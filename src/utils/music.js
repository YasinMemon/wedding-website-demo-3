import { useSyncExternalStore } from 'react'
import { wedding } from '../config/wedding'

/**
 * Background music engine.
 * - With `wedding.music.src` set, plays that file (looped, faded in/out).
 * - Otherwise plays a gentle generative instrumental: a soft plucked melody
 *   wandering over a warm drone, with a little echo for space. No files needed.
 * Audio is only ever started from a user gesture (Open Invitation / toggles).
 */

const ROOT = 293.66 // D4
const SCALE = [-5, 0, 1, 4, 5, 7, 8, 10, 12, 13, 16] // Hijaz-flavoured scale degrees, in semitones from D4
const hz = (semi) => ROOT * 2 ** (semi / 12)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

class GenerativeScore {
  ctx = null
  timer = null
  next = 0
  idx = 4

  init() {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return false
    const ctx = (this.ctx = new AC())
    this.master = ctx.createGain()
    this.master.gain.value = 0
    const comp = ctx.createDynamicsCompressor()
    this.master.connect(comp).connect(ctx.destination)

    // Melody bus → tone filter → dry + feedback echo
    this.bus = ctx.createGain()
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 2400
    const delay = ctx.createDelay(2)
    delay.delayTime.value = 0.46
    const feedback = ctx.createGain()
    feedback.gain.value = 0.36
    const wet = ctx.createGain()
    wet.gain.value = 0.3
    this.bus.connect(tone).connect(this.master)
    tone.connect(delay)
    delay.connect(feedback).connect(delay)
    delay.connect(wet).connect(this.master)

    // Warm, slowly breathing drone on D & A
    ;[[73.42, 0.045], [110, 0.026], [146.83, 0.012]].forEach(([f, g], i) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const gain = ctx.createGain()
      gain.gain.value = g
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.045 + i * 0.03
      const depth = ctx.createGain()
      depth.gain.value = g * 0.55
      lfo.connect(depth).connect(gain.gain)
      o.connect(gain).connect(this.master)
      o.start()
      lfo.start()
    })
    return true
  }

  pluck(t, f, vel) {
    const { ctx } = this
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(0.14 * vel, t + 0.015)
    env.gain.exponentialRampToValueAtTime(0.0001, t + 2.8)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(3000, t)
    filter.frequency.exponentialRampToValueAtTime(520, t + 1.4)
    const body = ctx.createOscillator()
    body.type = 'triangle'
    body.frequency.value = f
    const shimmer = ctx.createOscillator()
    shimmer.type = 'sine'
    shimmer.frequency.value = f * 2
    const shimmerGain = ctx.createGain()
    shimmerGain.gain.value = 0.22
    body.connect(filter)
    shimmer.connect(shimmerGain).connect(filter)
    filter.connect(env).connect(this.bus)
    body.start(t)
    shimmer.start(t)
    body.stop(t + 3)
    shimmer.stop(t + 3)
  }

  schedule = () => {
    const { ctx } = this
    while (this.next < ctx.currentTime + 0.8) {
      this.idx = Math.min(SCALE.length - 1, Math.max(0, this.idx + pick([-2, -1, -1, 1, 1, 2])))
      if (Math.random() > 0.15) {
        this.pluck(this.next, hz(SCALE[this.idx]), 0.55 + Math.random() * 0.45)
        if (Math.random() < 0.16) this.pluck(this.next + 0.03, hz(SCALE[this.idx] - 12), 0.35)
      }
      this.next += pick([0.65, 0.9, 0.9, 1.2, 1.2, 1.9])
    }
  }

  async start(volume) {
    if (!this.ctx && !this.init()) return false
    clearTimeout(this.suspendTimer)
    await this.ctx.resume()
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setValueAtTime(this.master.gain.value, t)
    this.master.gain.linearRampToValueAtTime(volume, t + 2.5)
    this.next = Math.max(this.next, t + 0.25)
    clearInterval(this.timer)
    this.timer = setInterval(this.schedule, 200)
    this.schedule()
    return true
  }

  stop() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setValueAtTime(this.master.gain.value, t)
    this.master.gain.linearRampToValueAtTime(0, t + 1)
    clearInterval(this.timer)
    this.timer = null
    this.suspendTimer = setTimeout(() => this.ctx.state === 'running' && this.ctx.suspend(), 1300)
  }
}

class FilePlayer {
  el = null
  async start(volume) {
    this.el ??= Object.assign(new Audio(wedding.music.src), { loop: true, volume: 0, preload: 'auto' })
    await this.el.play()
    fade(this.el, volume)
    return true
  }
  stop() {
    if (this.el) fade(this.el, 0, () => this.el.pause())
  }
}

function fade(el, to, done) {
  const from = el.volume
  const t0 = performance.now()
  const step = (now) => {
    const p = Math.min(1, (now - t0) / 1400)
    el.volume = Math.max(0, Math.min(1, from + (to - from) * p))
    if (p < 1) requestAnimationFrame(step)
    else done?.()
  }
  requestAnimationFrame(step)
}

/* ---------- Tiny shared store so every music control stays in sync ---------- */
let engine = null
let playing = false
const listeners = new Set()
const emit = () => listeners.forEach((l) => l())

export const music = {
  get playing() {
    return playing
  },
  async play() {
    try {
      engine ??= wedding.music.src ? new FilePlayer() : new GenerativeScore()
      playing = await engine.start(wedding.music.volume)
    } catch {
      playing = false // blocked or unsupported — the toggle lets guests retry
    }
    emit()
    return playing
  },
  pause() {
    engine?.stop()
    playing = false
    emit()
  },
  toggle() {
    return playing ? music.pause() : music.play()
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}

// Be a good guest: go quiet when the tab is hidden, resume when it returns.
if (typeof document !== 'undefined') {
  let resumeOnReturn = false
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) {
      resumeOnReturn = true
      music.pause()
    } else if (!document.hidden && resumeOnReturn) {
      resumeOnReturn = false
      music.play()
    }
  })
}

export const useMusic = () => useSyncExternalStore(music.subscribe, () => playing, () => false)

/** Splits the remaining time until `target` into whole units (never negative). */
export function timeLeft(target, now = Date.now()) {
  const diff = Math.max(0, new Date(target).getTime() - now)
  return {
    done: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export const pad = (n) => String(n).padStart(2, '0')

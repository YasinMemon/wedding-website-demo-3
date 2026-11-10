# Demo 03 — Ayaan & Zara · The Nikah Collection

A luxury digital Nikah invitation (React 19 + Vite + Tailwind 4 + framer-motion). Fully isolated from Demo 01 (`../invitation`) and Demo 02 (`../invitation demo 2`).

```bash
npm install
npm run dev       # http://localhost:5175 (Vite picks the next free port if busy)
npm run build     # production build → dist/
npm run preview
```

## Re-brand for a new couple
Every word, date, image and link lives in **`src/config/wedding.js`** — components never hard-code wedding details.

| Setting | Where |
| --- | --- |
| Names, parents, monogram | `couple` |
| Main date (countdown, calendar, hero) | `date`, `countdown.target` |
| Events (date, time, dress code, swatches, image) | `events.list` |
| Venue name, address, Google Maps & directions links | `venue` (set `isPlaceholder: false` once confirmed) |
| RSVP backend | `rsvp.endpoint` — any URL accepting a JSON `POST`. Empty = demo mode (nothing stored, clearly labelled) |
| Background music | `music.src` — path to an mp3. Empty = built-in generative instrumental score |
| WhatsApp message | `share.whatsappMessage` |
| SEO / social preview | `index.html` (title, description, Open Graph, JSON-LD) — update the `example.com` URLs to the live domain |

## Structure
```
src/config/wedding.js      single source of truth
src/components/            Loader, Opening, Navbar, Hero, Invitation, Story, Events,
                           Countdown, Gallery + Lightbox, Venue, Rsvp, Closing, MusicToggle,
                           ornaments (geometric pattern, arches, dividers), motion helpers
src/utils/                 calendar (Google + .ics), rsvp (validation + submit), music, share, time
public/images/             optimised WebP photography (+ og.jpg for link previews)
```

Demo photography is from Unsplash; replace with the couple's own photos in `public/images/` (same file names) for a live invitation.

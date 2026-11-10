/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  AYAAN & ZARA — THE NIKAH COLLECTION
 *  Single source of truth for every word, date, image and link on the site.
 *  Components never hard-code wedding details: edit this file to re-brand the
 *  invitation for a new couple.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const img = (name) => `${import.meta.env.BASE_URL}images/${name}.webp`

export const wedding = {
  siteUrl: 'https://ayaan-zara.example.com',
  title: 'A Beautiful Beginning',
  collection: 'The Nikah Collection',
  timezone: 'Asia/Kolkata',
  timezoneLabel: 'IST',

  couple: {
    groom: { first: 'Ayaan', full: 'Ayaan Mirza', parents: 'Mr. Imran & Mrs. Nazia Mirza' },
    bride: { first: 'Zara', full: 'Zara Siddiqui', parents: 'Mr. Farhan & Mrs. Rukhsar Siddiqui' },
    monogram: ['A', 'Z'],
  },

  /** Main ceremony — drives the countdown, hero date, calendar & SEO. */
  date: {
    iso: '2028-02-14T11:00:00+05:30',
    display: '14 February 2028',
    long: 'Monday, 14 February 2028',
  },
  city: 'Ahmedabad',
  region: 'Gujarat, India',

  loader: { minDuration: 1700, maxDuration: 4200 },

  opening: {
    basmala: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    basmalaLabel: 'Bismillah',
    kicker: 'Together with our families',
    invite: 'Request the pleasure of your company',
    button: 'Open Invitation',
  },

  hero: {
    imageLg: img('hero-lg'),
    imageSm: img('hero-sm'),
    alt: 'Ayaan and Zara standing hand in hand beneath white scalloped Mughal arches',
    kicker: 'The Nikah of',
    tagline: 'A beautiful beginning, a lifetime of love.',
  },

  invitation: {
    kicker: 'The Invitation',
    opening: 'With immense gratitude to the Almighty and the blessings of our elders',
    groomLine: 'request the honour of your presence at the Nikah of their son',
    joiner: 'with',
    brideLine: 'daughter of',
    closing: 'as they begin their journey of love, faith and forever.',
  },

  story: {
    kicker: 'Our Story',
    title: 'Two paths,',
    titleAccent: 'one beautiful beginning',
    chapters: [
      {
        title: 'The First Meeting',
        when: 'Autumn 2021',
        image: img('story-1'),
        alt: 'Warm sunlight falling through a carved stone arch onto an old city',
        text: 'A rain-soaked evening at a friend’s iftar in old Ahmedabad. Zara was rescuing a plate of dates from the downpour; Ayaan was holding the umbrella. Neither remembers the food — only that the conversation outlasted the rain.',
      },
      {
        title: 'A Beautiful Connection',
        when: '2022 — 2024',
        image: img('story-2'),
        alt: 'Two hands gently reaching for one another in soft afternoon light',
        text: 'Long walks along the Sabarmati riverfront, cutting chai at Manek Chowk long after midnight and an endless exchange of favourite books. Somewhere between the pages, friendship quietly became something more.',
      },
      {
        title: 'The Promise',
        when: 'Eid, 2025',
        image: img('story-3'),
        alt: 'A henna-adorned hand wearing a delicate gold ring',
        text: 'On the morning of Eid, with both families gathered in one sunlit courtyard, Ayaan asked the question his heart had long since answered. Zara said yes — and two families became one.',
      },
      {
        title: 'Forever Begins',
        when: '14 February 2028',
        image: img('story-4'),
        alt: 'A bride and groom holding hands, her hands adorned with intricate mehndi',
        text: 'With faith as our foundation and our families beside us, we now begin our forever. Nothing would make this day more complete than having you there to share it.',
      },
    ],
  },

  events: {
    kicker: 'The Celebrations',
    title: 'Four days of',
    titleAccent: 'love & togetherness',
    list: [
      {
        id: 'mehndi',
        name: 'Mehndi Celebration',
        short: 'Mehndi',
        tagline: 'Henna, jasmine & folk songs',
        description:
          'An afternoon of henna artistry, fragrant jasmine and dholak songs — where stories are painted onto hands and laughter fills the garden courtyard.',
        date: '12 February 2028',
        weekday: 'Saturday',
        time: '4:00 PM',
        start: '2028-02-12T16:00:00+05:30',
        end: '2028-02-12T21:00:00+05:30',
        dressCode: 'Shades of Green',
        swatches: ['#1D5143', '#5E8C61', '#A9C3A0', '#DCE5CF'],
        space: 'The Garden Courtyard',
        image: img('event-mehndi'),
        alt: 'A woman in a green sari smiling behind her henna-painted hands',
        theme: 'mehndi',
      },
      {
        id: 'haldi',
        name: 'Haldi Celebration',
        short: 'Haldi',
        tagline: 'Turmeric, marigolds & sunshine',
        description:
          'A sun-washed morning of turmeric, marigold garlands and joyful mischief, as our loved ones shower us with blessings, colour and warmth.',
        date: '13 February 2028',
        weekday: 'Sunday',
        time: '11:00 AM',
        start: '2028-02-13T11:00:00+05:30',
        end: '2028-02-13T14:00:00+05:30',
        dressCode: 'Yellow & Pastels',
        swatches: ['#E3B341', '#F2D58A', '#F4E3C1', '#E9D3D0'],
        space: 'The Sunlit Terrace',
        image: img('event-haldi'),
        alt: 'A smiling bride in yellow framed by strands of marigold flowers',
        theme: 'haldi',
      },
      {
        id: 'nikah',
        name: 'Nikah Ceremony',
        short: 'Nikah',
        tagline: 'The sacred heart of our celebration',
        description:
          'Surrounded by family, friends and prayers, we will sign our Nikah and say Qubool Hai — beginning our life together with gratitude and faith.',
        date: '14 February 2028',
        weekday: 'Monday',
        time: '11:00 AM',
        start: '2028-02-14T11:00:00+05:30',
        end: '2028-02-14T14:00:00+05:30',
        dressCode: 'Traditional Elegance',
        swatches: ['#FAF8F0', '#D9C9A5', '#1D5143', '#123C32'],
        space: 'The Grand Courtyard',
        image: img('event-nikah'),
        alt: 'A henna-adorned hand signing the Nikah register',
        theme: 'nikah',
        featured: true,
      },
      {
        id: 'walima',
        name: 'Walima Reception',
        short: 'Walima',
        tagline: 'An evening of gratitude & celebration',
        description:
          'Dinner, music and heartfelt toasts beneath chandeliers and cascading florals, as we celebrate our new beginning with everyone we love.',
        date: '14 February 2028',
        weekday: 'Monday',
        time: '7:30 PM',
        start: '2028-02-14T19:30:00+05:30',
        end: '2028-02-14T23:30:00+05:30',
        dressCode: 'Formal Evening Wear',
        swatches: ['#0E2A23', '#292923', '#D9C9A5', '#FAF8F0'],
        space: 'The Emerald Ballroom',
        image: img('event-walima'),
        alt: 'An evening reception stage dressed in white florals, greenery and crystal chandeliers',
        theme: 'walima',
      },
    ],
  },

  countdown: {
    kicker: 'Until we say Qubool Hai',
    title: 'Counting every',
    titleAccent: 'blessed moment',
    target: '2028-02-14T11:00:00+05:30',
    afterMessage: 'Alhamdulillah — the Nikah has begun.',
  },

  gallery: {
    kicker: 'The Gallery',
    title: 'Moments &',
    titleAccent: 'inspirations',
    filters: ['All', 'Portraits', 'Nikah', 'Florals', 'Stationery', 'Mehndi', 'Walima', 'Architecture'],
    // w/h = intrinsic ratio (prevents layout shift). `full` loads only in the lightbox.
    images: [
      { id: 'g-01', category: 'Portraits', w: 2, h: 3, caption: 'Ayaan & Zara in the golden light of late afternoon' },
      { id: 'g-04', category: 'Stationery', w: 3, h: 2, caption: 'An emerald envelope suite, sealed with a sprig of greenery' },
      { id: 'g-12', category: 'Architecture', w: 2, h: 3, caption: 'A backlit geometric lattice arch at dusk' },
      { id: 'g-08', category: 'Mehndi', w: 2, h: 3, caption: 'The bridal mehndi — a story written in henna' },
      { id: 'g-06', category: 'Florals', w: 3, h: 2, caption: 'White blooms and soft greenery in hand-blown glass' },
      { id: 'g-03', category: 'Nikah', w: 4545, h: 3132, caption: 'Nikah inspiration — newlyweds with their marriage certificates' },
      { id: 'g-10', category: 'Walima', w: 3, h: 2, caption: 'Crystal chandeliers suspended among cascading foliage' },
      { id: 'g-02', category: 'Portraits', w: 2, h: 3, caption: 'A quiet bridal moment, lit by a thousand tiny lights' },
      { id: 'g-13', category: 'Architecture', w: 3, h: 2, caption: 'A domed ceiling crowned with carved calligraphy' },
      { id: 'g-07', category: 'Florals', w: 2, h: 3, caption: 'An ivory floral column framing the aisle' },
      { id: 'g-05', category: 'Stationery', w: 2, h: 3, caption: 'The invitation suite on a gilded, hand-painted tray' },
      { id: 'g-09', category: 'Mehndi', w: 3, h: 4, caption: 'Henna and a single jasmine bloom' },
      { id: 'g-11', category: 'Walima', w: 2, h: 3, caption: 'A reception tablescape beneath a canopy of greenery' },
      { id: 'g-14', category: 'Architecture', w: 2, h: 3, caption: 'Scalloped arches and ivory stone in a palace pavilion' },
    ].map((g) => ({ ...g, src: img(g.id), full: img(`${g.id}-full`), alt: g.caption })),
  },

  venue: {
    kicker: 'Venue & Location',
    title: 'Where our',
    titleAccent: 'forever begins',
    /**
     * Placeholder venue — replace with the couple’s confirmed booking.
     * While `isPlaceholder` is true the site shows a subtle “sample venue” note.
     */
    isPlaceholder: true,
    name: 'The Emerald Courtyard',
    descriptor: 'A heritage palace venue',
    address: 'Venue address to be confirmed · S.G. Highway, Ahmedabad, Gujarat 380054',
    description:
      'Sandstone colonnades, carved jharokhas and courtyards that glow at golden hour — an Ahmedabad heritage setting chosen to hold every chapter of our celebration, from the first henna to the final dance.',
    image: img('venue'),
    alt: 'A sandstone heritage palace glowing at dusk, framed by a dark carved arch',
    // Configure both links for the real venue. Any Google Maps URL works.
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=S.G.+Highway%2C+Ahmedabad%2C+Gujarat',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=S.G.+Highway%2C+Ahmedabad%2C+Gujarat',
    details: [
      {
        icon: 'bed',
        title: 'Accommodation',
        text: 'A block of guest suites is reserved for out-of-town family and friends. Mention “Ayaan & Zara Nikah” when booking before 10 January 2028.',
      },
      {
        icon: 'plane',
        title: 'By Air',
        text: 'Sardar Vallabhbhai Patel International Airport (AMD) connects Ahmedabad to major Indian and Gulf cities. Airport transfers will be arranged for our guests.',
      },
      {
        icon: 'train',
        title: 'By Rail',
        text: 'Ahmedabad Junction (ADI) is well connected across India. Let us know your arrival time and our family will help with pick-ups.',
      },
      {
        icon: 'sun',
        title: 'February Weather',
        text: 'Pleasant, dry winter days with cooler evenings. A light shawl or jacket is recommended for the Walima reception.',
      },
    ],
  },

  rsvp: {
    kicker: 'RSVP',
    title: 'Kindly',
    titleAccent: 'respond',
    deadline: '10 January 2028',
    intro: 'Your presence would make our celebration complete. Please let us know by the date below so we can prepare a place for you.',
    maxGuests: 6,
    dietary: ['No preference', 'Vegetarian', 'Vegan', 'Jain', 'Gluten-free', 'Nut allergy', 'Other — noted in my message'],
    /**
     * Backend integration: set `endpoint` to any URL that accepts a JSON POST
     * (Formspree, Google Apps Script, your own API…). Leave empty for demo mode,
     * where nothing is stored and the form clearly says so.
     */
    endpoint: '',
    contact: { label: 'Questions? Message the family', phone: '+91 00000 00000' },
  },

  closing: {
    imageLg: img('closing-lg'),
    imageSm: img('closing-sm'),
    alt: 'Ayaan and Zara holding hands beside the water at golden hour',
    blessing: 'May this beautiful beginning become a lifetime of blessings.',
    signoff: 'With love, Ayaan & Zara',
  },

  share: {
    whatsappMessage:
      'Assalamu Alaikum! You are warmly invited to the Nikah of Ayaan & Zara on 14 February 2028 in Ahmedabad. View the invitation:',
  },

  /**
   * Background music. Set `src` to an audio file (e.g. '/audio/nasheed.mp3') to
   * use a real track. When empty, a gentle generative instrumental score
   * (Web Audio, no files) is played. Audio only ever starts after a tap.
   */
  music: { src: '', volume: 0.42 },

  footer: {
    credit: 'Crafted with love for Ayaan & Zara',
    photoCredit: 'Demo photography via Unsplash',
  },

  nav: [
    { id: 'story', label: 'Our Story' },
    { id: 'celebrations', label: 'Celebrations' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'venue', label: 'Venue' },
    { id: 'rsvp', label: 'RSVP' },
  ],
}

export const coupleNames = `${wedding.couple.groom.first} & ${wedding.couple.bride.first}`

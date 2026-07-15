# Coach Hatem — Premium Fitness Coaching Website

A single-page, fully static website for **Coach Hatem Anwar** (@tomy_physique) built with plain **HTML, CSS and JavaScript** — no frameworks, no build step, no backend.

## Running the site

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Structure

```
├── index.html          # The entire one-page site
├── css/
│   └── style.css       # Design system + all section styles
├── js/
│   └── main.js         # Interactions (reveals, counters, slider, modal, WhatsApp flow)
└── assets/
    └── images/         # Coach photos and posters
```

## Sections

Hero · Marquee · About · Achievements (animated counters) · Certifications (with lightbox zoom) · Services · Pricing · Promo band · Testimonials slider · Instagram gallery · Podcast · FAQ accordion · Contact · Footer

## Online coaching purchase flow

Clicking **Choose Plan** on a pricing card opens a confirmation modal showing the selected package and price, with two ways to buy:

1. **Pay with InstaPay** — opens the coach's InstaPay payment link (`https://ipn.eg/S/coachhatem/instapay/4AwgA8`, payee `coachhatem@instapay`). The client sends the amount shown in the modal.
2. **Confirm via WhatsApp** — opens WhatsApp (`wa.me/201026160872`) with a pre-filled, URL-encoded message containing the selected package and price.

The contact form works the same way — it opens WhatsApp with the visitor's name, goal and message pre-filled. Nothing is stored anywhere; this is a frontend-only site.

## Key contact details (already wired in)

- **InstaPay:** `https://ipn.eg/S/coachhatem/instapay/4AwgA8` (`coachhatem@instapay`)
- **WhatsApp:** +20 102 616 0872 — defined once in `js/main.js` as `COACH_WHATSAPP` (`201026160872`) and reused in the promo band, contact channel and footer.
- **Email:** `c.hatem.smartgym@gmail.com`
- **Location:** Smart Gym — Park Mall Branch, Egypt
- **Instagram:** [@tomy_physique](https://www.instagram.com/tomy_physique)

## Things still to update

- **Podcast episodes** — the three episode cards currently link to the coach's Instagram. Replace each `Listen Now` href with the real YouTube / Spotify / Apple Podcasts links.
- **Testimonials** — the four client stories are realistic placeholders; swap in real client feedback when available.
- **Hero photo** — see `assets/images/hero-poster.jpg`; drop in the professional portrait when the file is available.

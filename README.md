# Green Cycle Environmental — Homepage

A modern, responsive homepage for **Green Cycle Environmental**, built with HTML5, CSS3, and vanilla JavaScript. The visual direction is closely modeled on [The Vessels Group](https://thevesselsgroup.com/) — split hero layout, diagonal banner, circular service diagram, alternating image/text sections, and a dark forest-green palette.

## Features

- **TVG-inspired split hero** with rotating diagonal banner and dual CTA
- **Circular "Green Cycle" service diagram** with animated SVG ring
- **Alternating image/text sections** for mission, process, and technology
- **Dark forest-green palette** with light contrast sections
- **Smooth scroll animations** powered by GSAP + ScrollTrigger, including image clip-path reveals, parallax, SVG stroke draws, and staggered list items
- **Responsive layout** for desktop, tablet, and mobile
- **Sticky navigation** with scroll-aware color transition and scrollspy
- **Animated counters** for impact statistics
- **Accessible** keyboard navigation and `prefers-reduced-motion` support
- **Graceful fallback** when JS/GSAP is unavailable
- **No build step required** — open `index.html` in any modern browser

## File Structure

```
.
├── index.html              # Homepage markup
├── css/
│   └── styles.css          # All styles and responsive rules
├── js/
│   └── main.js             # GSAP animations and interactions
├── assets/
│   ├── images/             # Local images
│   └── screenshots/        # Preview screenshots
├── screenshot.py           # Playwright script to regenerate screenshots
└── README.md
```

## How to View

### Option 1: Open directly
Double-click `index.html` or open it in your browser.

### Option 2: Use a local server
From the project folder, run:

```bash
python3 -m http.server 8080
```

Then visit: `http://localhost:8080`

## Sections

1. **Navigation** — sticky header with mobile menu and active-section highlighting
2. **Hero** — split-screen intro with animated headline and rotating diagonal banner
3. **Mission** — company introduction with image reveal
4. **The Green Cycle** — circular diagram of 4 core services
5. **Why Green Cycle** — icon-driven feature grid
6. **Process & Technology** — alternating image/text blocks
7. **Impact Stats** — animated counters
8. **Call-to-Action** — consultation prompt
9. **Footer** — links and contact info

## Technologies Used

- HTML5
- CSS3 (custom properties, flexbox, grid, clip-path, SVG)
- Vanilla JavaScript
- [GSAP 3](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)

## Browser Support

Tested in modern browsers including Chrome, Safari, Firefox, and Edge.

## Notes

- This is the **homepage** (Phase 1). Additional inner pages can be added in a future phase.
- Placeholder contact information is used. Replace it with real details before launch.
- Hero and mission images are included locally for reliable offline viewing.

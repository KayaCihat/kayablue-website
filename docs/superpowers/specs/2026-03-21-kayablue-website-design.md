# Kayablue Website — Design Spec

**Date:** 2026-03-21
**Project:** Kayablue web agency website
**Domain:** kayablue.nl (Cloudflare DNS)

---

## Overview

A 7-page marketing and portfolio website for Kayablue, a web design agency. Built with Astro (`output: "hybrid"`), deployed to Cloudflare Pages, with an Astro API route handling contact form submissions. Design is derived from the Stitch project "Web Agency Portfolio Site" (projects/4753305574908518777).

---

## Design System

Sourced from the Stitch project design theme:

- **Color mode:** Dark
- **Primary color:** `#0a182e` (dark navy)
- **Font:** Inter
- **Border radius:** 8px
- **Saturation:** 3
- **Device target:** Desktop (1280px), responsive down to mobile

All design tokens (colors, typography, spacing, radius) are defined in `src/styles/global.css` and referenced across all components and pages.

---

## Pages

### 1. Homepage
- Stitch screen: `2bcc5292a793438387962da6a1af61e7` — "Glodinas Web Homepage - Final Footer Sync"
- Hero section, agency intro, services summary, CTA to Book a Call

### 2. Services
- Stitch screen: `37469524680f4b4384b9a7944b9876e8` — "Services - Redesigned Brand Sync"
- Full breakdown of services offered by Kayablue

### 3. Our Work (Portfolio)
- Stitch screen: `0d3a640b49d9471dae5671250f78ab74` — "Our Work - Branded Consistency"
- Grid of `PortfolioCard` components, one per client project
- Portfolio data sourced from `src/data/portfolio.ts`

### 4. About
- Stitch screen: `2a5fedbf3f044b3daecca95f4abca22b` — "About - Nav & Footer Sync"
- Agency story, values, team

### 5. Industries We Serve
- Stitch screen: `8fc65c979b0a47b480c8865253cb67ae` — "Industries We Serve - Synchronized Branding"
- Target market and niche breakdown

### 6. Book a Call
- Stitch screen: `edfbd223729248bd9042e2b5bb8ee4f6` — "Book a Call - Final Brand Sync"
- Contact form: Name, Email, Phone (optional), Message, Preferred date (`<input type="date">`, value sent as ISO date string)
- Honeypot field (`<input name="website" style="display:none">`) for basic spam protection — submissions with this field filled are silently rejected
- Form POSTs JSON to `/api/contact` (Astro API route, `Content-Type: application/json`)
- Inline success/error feedback via `fetch()` — no page reload

### 7. Careers
- Stitch screen: `37208444c4424354998f6b4f0ae8954b` — "Careers - Branded Navigation & Footer Sync"
- Open positions or general application CTA

### 404
- `src/pages/404.astro` — custom branded not-found page matching site design

---

## Portfolio Data

File: `src/data/portfolio.ts`

Each entry:
```ts
interface PortfolioItem {
  title: string;
  description: string;   // one-line summary
  image: string;         // path to local image, e.g. /images/portfolio/boekhoud-buddies.jpg
  tags: string[];        // e.g. ["Dashboard", "Redesign"]
  url?: string;          // optional external link
}
```

Portfolio images are **downloaded from Stitch and committed to `public/images/portfolio/`** — Stitch URLs are not guaranteed stable and should not be used directly in production.

**Client projects to include:**
- Boekhoud Buddies (Redesign, Homepage, Balans, Scan en Herken)
- QuickResume Landing Page
- Xcelerate Landing Page
- Boekingen Page
- Glodinas Finance (Home, Admin Dashboard)
- Freelancer Dashboard Overview
- Ignition Dashboard Redesign

---

## Project Structure

```
kayablue/
├── src/
│   ├── components/
│   │   ├── Nav.astro              # shared navigation, active link state
│   │   ├── Footer.astro           # shared footer
│   │   └── PortfolioCard.astro    # client project card
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell: <head>, <Nav>, <slot>, <Footer>
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── services.astro         # Services
│   │   ├── our-work.astro         # Portfolio
│   │   ├── about.astro            # About
│   │   ├── industries.astro       # Industries We Serve
│   │   ├── book-a-call.astro      # Book a Call (form)
│   │   ├── careers.astro          # Careers
│   │   ├── 404.astro              # Custom 404
│   │   └── api/
│   │       └── contact.ts         # API route — form handler (server endpoint)
│   ├── data/
│   │   └── portfolio.ts           # static list of client projects
│   └── styles/
│       └── global.css             # design tokens, resets, base styles
├── public/
│   ├── images/
│   │   └── portfolio/             # downloaded portfolio screenshots
│   └── favicon.svg
├── astro.config.mjs               # output: "hybrid", Cloudflare adapter
└── package.json
```

---

## Astro Configuration

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',        // static pages + server API route
  adapter: cloudflare(),
});
```

`output: "hybrid"` — all pages render as static HTML at build time except the API route, which runs as a Cloudflare Pages Function.

---

## Backend — Contact Form

**File:** `src/pages/api/contact.ts`
**Route:** `POST /api/contact`
**Content-Type:** `application/json`

**Request body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "message": "string",
  "preferredDate": "string — ISO date, e.g. 2026-04-15 (optional)",
  "website": "string — honeypot, must be empty"
}
```

**Logic:**
1. Reject if `website` (honeypot) is non-empty → return `400`
2. Validate: `name`, `email`, `message` required; email must match basic regex
3. Send email via **Resend** (`npm i resend`) to `TO_EMAIL` env variable
4. Return `200 { success: true }` or `400 { success: false, error: "..." }`

**Email delivery: Resend**
- MailChannels free tier was discontinued in 2024 and is no longer available on Cloudflare Workers
- Resend has a free tier (3,000 emails/month), simple API, works natively in Cloudflare Workers
- Requires a verified sending domain (e.g. `noreply@kayablue.nl`)

**Environment variables (set in Cloudflare Pages dashboard):**
- `TO_EMAIL` — destination email for form submissions
- `RESEND_API_KEY` — Resend API key

---

## Deployment

### Cloudflare Pages setup (one-time)
1. Push repo to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Output directory: `dist/`
5. Enable **`nodejs_compat`** compatibility flag in Cloudflare Pages settings (required for Resend and Node built-ins at runtime)
6. Set environment variables: `TO_EMAIL`, `RESEND_API_KEY`
7. Connect `kayablue.nl` custom domain (already on Cloudflare DNS — one click)

### Ongoing deployments
- Every `git push` to `main` triggers an automatic build and deploy
- No manual steps required after initial setup

### Local development
- Run `npx wrangler pages dev` to test Pages Functions locally
- A `wrangler.toml` is not required for Pages projects but can be added for local dev bindings if needed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro (`output: "hybrid"`) |
| Styling | CSS (global.css with design tokens) |
| Hosting | Cloudflare Pages |
| Form handler | Astro API route → Cloudflare Pages Function |
| Email delivery | Resend (free tier, 3k emails/month) |
| Domain | kayablue.nl (Cloudflare DNS) |
| Source design | Stitch — "Web Agency Portfolio Site" |

---

## Out of Scope

- CMS or admin panel
- Authentication
- Blog
- Rate limiting / CAPTCHA (honeypot only for now)
- Analytics (can be added later via Cloudflare Web Analytics — free)
- Multilingual support

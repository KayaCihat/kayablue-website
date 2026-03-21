# Kayablue Website — Design Spec

**Date:** 2026-03-21
**Project:** Kayablue web agency website
**Domain:** kayablue.nl (Cloudflare DNS)

---

## Overview

A 7-page marketing and portfolio website for Kayablue, a web design agency. Built with Astro, deployed to Cloudflare Pages, with a Cloudflare Pages Function handling contact form submissions. Design is derived from the Stitch project "Web Agency Portfolio Site" (projects/4753305574908518777).

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
- Contact form (Name, Email, Phone optional, Message, Preferred date)
- Form POSTs to `/api/contact` (Cloudflare Pages Function)
- Inline success/error feedback (no page reload)

### 7. Careers
- Stitch screen: `37208444c4424354998f6b4f0ae8954b` — "Careers - Branded Navigation & Footer Sync"
- Open positions or general application CTA

---

## Portfolio Data

File: `src/data/portfolio.ts`

Each entry includes:
- `title: string` — project name
- `description: string` — one-line summary
- `image: string` — screenshot URL (from Stitch)
- `tags: string[]` — e.g. `["Dashboard", "Redesign"]`
- `url?: string` — optional external link

**Client projects to include (from Stitch):**
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
│   │   └── careers.astro          # Careers
│   ├── data/
│   │   └── portfolio.ts           # static list of client projects
│   └── styles/
│       └── global.css             # design tokens, resets, base styles
├── functions/
│   └── api/
│       └── contact.ts             # Cloudflare Pages Function — form handler
├── public/
│   └── favicon.svg
├── astro.config.mjs               # Astro config with Cloudflare adapter
└── package.json
```

---

## Backend — Contact Form

**Endpoint:** `POST /api/contact`
**File:** `functions/api/contact.ts`

**Request body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "message": "string",
  "preferredDate": "string (optional)"
}
```

**Validation:**
- `name` — required, non-empty
- `email` — required, valid email format
- `message` — required, non-empty

**On success:**
- Sends email to `TO_EMAIL` env variable via Mailchannels (free, built into Cloudflare Workers)
- Returns `200 { success: true }`

**On validation failure:**
- Returns `400 { success: false, error: "..." }`

**Environment variables (set in Cloudflare Pages dashboard):**
- `TO_EMAIL` — destination email for form submissions

---

## Deployment

### Cloudflare Pages setup (one-time)
1. Push repo to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Output directory: `dist/`
5. Set `TO_EMAIL` environment variable
6. Connect `kayablue.nl` custom domain (already on Cloudflare DNS — one click)

### Ongoing deployments
- Every `git push` to `main` triggers an automatic build and deploy
- No manual steps required after initial setup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro |
| Styling | CSS (global.css with design tokens) |
| Hosting | Cloudflare Pages |
| Form handler | Cloudflare Pages Function (TypeScript) |
| Email delivery | Mailchannels (free, via Cloudflare Workers) |
| Domain | kayablue.nl (Cloudflare DNS) |
| Source design | Stitch — "Web Agency Portfolio Site" |

---

## Out of Scope

- CMS or admin panel
- Authentication
- Blog
- Analytics (can be added later via Cloudflare Web Analytics — free)
- Multilingual support

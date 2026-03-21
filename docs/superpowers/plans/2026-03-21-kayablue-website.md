# Kayablue Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a 7-page Astro website for Kayablue web agency at kayablue.nl on Cloudflare Pages, with a contact form powered by a Cloudflare Pages Function using Resend for email delivery.

**Architecture:** Astro in `output: "hybrid"` mode — all 7 pages are statically rendered at build time, with a single server-side API route (`/api/contact`) that runs as a Cloudflare Pages Function. Shared Nav and Footer components live in one place; all pages use BaseLayout. Portfolio items are static TypeScript data with locally committed images.

**Tech Stack:** Astro, `@astrojs/cloudflare`, Resend SDK (`resend`), Vitest (unit tests for API route), Cloudflare Pages, GitHub (CI/CD trigger)

---

## File Map

| File | Responsibility |
|------|---------------|
| `astro.config.mjs` | Astro config: hybrid output, Cloudflare adapter |
| `src/styles/global.css` | Design tokens: colors, fonts, spacing, radius |
| `src/layouts/BaseLayout.astro` | HTML shell: `<head>`, Nav, slot, Footer |
| `src/components/Nav.astro` | Shared navigation with active link state |
| `src/components/Footer.astro` | Shared footer |
| `src/components/PortfolioCard.astro` | Single client project card |
| `src/data/portfolio.ts` | Static array of all portfolio items |
| `src/pages/index.astro` | Homepage |
| `src/pages/services.astro` | Services page |
| `src/pages/our-work.astro` | Portfolio grid page |
| `src/pages/about.astro` | About page |
| `src/pages/industries.astro` | Industries We Serve page |
| `src/pages/book-a-call.astro` | Book a Call page with form |
| `src/pages/careers.astro` | Careers page |
| `src/pages/404.astro` | Custom 404 page |
| `src/lib/contact.ts` | Pure functions: form validation, email HTML builder |
| `src/pages/api/contact.ts` | API route: validates form, sends email via Resend |
| `public/images/portfolio/` | Downloaded portfolio screenshots |
| `tests/api/contact.test.ts` | Unit tests for the contact API handler |

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialise Astro with the Cloudflare adapter**

```bash
cd /home/ubuntu/web-agency
npm create astro@latest . -- --template minimal --typescript strict --no-git --install
npm install @astrojs/cloudflare
```

- [ ] **Step 2: Replace `astro.config.mjs` with Cloudflare hybrid config**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare(),
});
```

- [ ] **Step 3: Install Resend and Vitest**

```bash
npm install resend
npm install -D vitest
```

- [ ] **Step 4: Add test script to `package.json`**

In `package.json`, ensure scripts include:
```json
"test": "vitest run"
```

- [ ] **Step 5: Add `.gitignore` entries**

Ensure `.gitignore` includes:
```
dist/
.wrangler/
node_modules/
.env
.env.*
!.env.example
.superpowers/
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```
Expected: Astro dev server running at `http://localhost:4321`

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs package.json package-lock.json tsconfig.json .gitignore
git commit -m "chore: scaffold Astro project with Cloudflare adapter"
```

---

## Task 2: Design System

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/global.css` with design tokens**

```css
/* src/styles/global.css */
:root {
  --color-bg: #0a182e;
  --color-bg-secondary: #0f2240;
  --color-text: #ffffff;
  --color-text-muted: rgba(255, 255, 255, 0.6);
  --color-accent: #2563eb;
  --color-border: rgba(255, 255, 255, 0.1);
  --radius: 8px;
  --font-family: 'Inter', sans-serif;
  --max-width: 1280px;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-family);
  background-color: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global design system tokens"
```

---

## Task 3: Shared Layout and Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
// src/components/Nav.astro
const currentPath = Astro.url.pathname;
const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/our-work', label: 'Our Work' },
  { href: '/about', label: 'About' },
  { href: '/industries', label: 'Industries' },
  { href: '/careers', label: 'Careers' },
  { href: '/book-a-call', label: 'Book a Call' },
];
---
<nav class="nav">
  <div class="container nav__inner">
    <a href="/" class="nav__logo">Kayablue</a>
    <ul class="nav__links">
      {links.map(link => (
        <li>
          <a
            href={link.href}
            class:list={['nav__link', { 'nav__link--active': currentPath === link.href }]}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }
  .nav__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
  }
  .nav__logo {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .nav__links {
    display: flex;
    list-style: none;
    gap: var(--spacing-lg);
  }
  .nav__link {
    font-size: 0.9rem;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .nav__link:hover,
  .nav__link--active {
    opacity: 1;
  }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
---
<footer class="footer">
  <div class="container footer__inner">
    <span class="footer__brand">Kayablue</span>
    <p class="footer__copy">&copy; {new Date().getFullYear()} Kayablue. All rights reserved.</p>
    <a href="/book-a-call" class="footer__cta">Book a Call</a>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--color-border);
    padding: var(--spacing-lg) 0;
    margin-top: var(--spacing-xl);
  }
  .footer__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
  .footer__brand {
    font-weight: 700;
  }
  .footer__copy {
    font-size: 0.85rem;
    opacity: 0.6;
  }
  .footer__cta {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-accent);
  }
</style>
```

- [ ] **Step 3: Create `src/layouts/BaseLayout.astro`**

```astro
---
// src/layouts/BaseLayout.astro
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Kayablue — Web design agency' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title} | Kayablue</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Verify Nav renders on a placeholder index page**

Replace `src/pages/index.astro` temporarily:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <h1 style="padding: 4rem;">Kayablue</h1>
</BaseLayout>
```

Run `npm run dev` and open `http://localhost:4321`. Verify nav and footer appear.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/ src/components/Nav.astro src/components/Footer.astro
git commit -m "feat: add BaseLayout, Nav, and Footer components"
```

---

## Task 4: Portfolio Data and Card Component

**Files:**
- Create: `src/data/portfolio.ts`
- Create: `src/components/PortfolioCard.astro`
- Create: `public/images/portfolio/` (directory with downloaded images)

- [ ] **Step 1: Download portfolio images from Stitch**

Create the directory and download each thumbnail using the URLs below (sourced from Stitch project listings):

```bash
mkdir -p public/images/portfolio

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uiUWw9Bjq1XuHPESub_4TSa4-e8BYmECPsepxBO2QATeL4BCI3pGTCTHjSHcC7iu7hQpbxMAK37CkYDqkCHl6zbLLoaNoGm-prsIA_MuXNCFLIfPUbVPqRX0h8ILGQhNat4jk-hjzzugFKdL6RBdx7dc2g1TpKE4e9EnWkhm6nzhyQK8Yb3HBmb06itlby0QpQ5_S69DY2bEwPsyj7Rv4F3QtGTYKubiqRS365HquyM4Jqjf2ZilkWuKA" -o public/images/portfolio/praatbox-dashboard.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0ui5S9U-oIo1f4LzT1ovklRHidF6zQncS6Ekrzri2dE8fFpJ1ZyAkIiPD-Gg-jg_P5X_VXKgKBeUWa_KkF5FqSDOpmF8lajfA0HFaXcwYG2WgOJiotfVKey9oJvAboLMVLPI07NhluivXcONt9L9zxMdZcFCzRG7fDP90qFk9X7MgsTQk22tguv8Ap7Y56botSrXbAJXxbW9a5E7BBvtprIkzFDcXbqBDZWIe8WVlc4grgO1Yhw7sK6kw_rl" -o public/images/portfolio/quickresume.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uidi61xjHWyxlD3rKpAnzgXv12oMtmBX_oRoWd9jIVcRtZQX-lfEPP6l_0gK3kI0zTNq69ztHjOl_3LBveVOw9i6BehGqTwF87mWizmTliOXnsqzkw8uVOSKP-Cr_CnnqKLDX1rKIAFlVyh47kehhr71X4Tk_KL6XYe--NVEbVwBlkUqnqVskwJwe1nmxpBa7wDk2-L0Ctzl-5D3vECNeLW3OL3x2v0XUW5fcvleFhdHsiHHtYuKUF-JSkC" -o public/images/portfolio/xcelerate.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0ugsfIjQvm4qvE6QB9tzoYXCLY3mL28Z4Ri1sOgzCtY-TlB8NMN-J2Yw29U6VeRnndCsNLx2wfRrZYQmjBTXXxgSdgEVnXmruCLrVqlGj4Qib6wHb1qX43KEQKIsNn_w8qPB3JxZ6WJaVUFkDMECGvK0wmPfGolrRGw-RDGd_couIjFK_js2VJugyBGkAgfNYNqm29InovALB14ypQdRb79gAE5ZPYTpIgMoTaLakwkwpqqa0tHSflH-IQ" -o public/images/portfolio/boekingen.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uiHBg26dRHdqu9Ase7OD_G1Y7OPQNSAEvHfn_De5CgcoSOfCKpJLrPQ3Xf5fn9a8M8Myo2Bw74ziOGDRtZU2Kwj5W2WCZad5x04hOy5wMUV5Ip-njYQJzsWZGy5SskGS6M9zStVfnPtW92Ad5gBnwP3erkARzMNGtJQhYVAUVT2PO7GYHcOm2Iq8jo5MHsTSpPbvcZOC6zO2pMFgHMPdxlkhJOhBhe_pOFwr4iH453US8BbLQVpRREtb45" -o public/images/portfolio/boekhoud-buddies-balans.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uhXt-eEYyDfPndVT9TLqU2qPiqU2xqJvoA7jlICgsZRYcCYoUI1jFfR7XsQPUFHPZD39WfTX9XStDe0a4YQrHrIXjCkeuXfl7fN19jTTurK3ODs9WMYRXz5fJzkOtiuE1xH1E7dbYG2A6opaRda5AJahJxEOJRit5Rsk1TrJD3VFw-fDUmllChaVWFW2JQOpa-Fdz_dtyhLnJo2G8omKBfU9ilSp0m6xmVjnt3bk3udJvq--tlU-8c6iw" -o public/images/portfolio/boekhoud-buddies-scan.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0ug4ys7KANi7J8heQuoWYxeRsAQWTiOUK8UMlbeQK6cBaEJ7vWteMoPiZRVWrrI5Wf42ulgakp8hUXHCA0sVxAq_pexsdiHqyQA76yKCIZ1qaFiUaTfe5j-t2wftg-uFffFQm9O-S9L9egD5ttdHU2nKemjxWEwf70jiOljFgoTgOgt-U8khegcRPBpgGflStohtta6UJAtys1aMxlXlT7cNbmA_WO_fvOq7_ks-Oj1IKhpQglfay3hIEZiV" -o public/images/portfolio/boekhoud-buddies-redesign.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uh4ok9WyPQA-8jx1VvkRdgWeDYmpuv-qFAehJSN1f0vSYy7GtCjeIEXa_taCKJaIvyw2xR_SVphoIjjPhYVY9bVRP7Bp-Rt_d01vmJ_SliGjGaZLwZxj4vEqKKXmb1K400ZujV9LnYnXlOkQdjiMfc5jHOJNwEMA75WsEWHavn5HL6wlgKv3yrbtTUMHAUQLWAtzCzulM9e7O-ZFWuHi3C7H21dFvKDgimEJPkdYp2QB0HtyAZAlGjVEynQ" -o public/images/portfolio/boekhoud-buddies-homepage.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uiv7xa3SxtZzTVPsnay1lcNVaTkFaL8VRiePav648vX_zhJq4LSgh9jI1memOcR54Racadf7I2dVKymZAHI1LRap4uGna6-SCejH7og9elm-Ry3o0Jh89KWQkoBms2T8M16EBZmaKZj7JaDcnFnaNPNdQZ8eZzTSSxUR1W_7fYDPUIQ3-oc6T0huKWj1vjUb6JoRHuVf2VxvuYQwT-mjBJc3QrK-5nZlsQZnzHd4EOUohokqrbi153mOzmm" -o public/images/portfolio/freelancer-dashboard.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uiY6JsM1NZSvekoVKuVqhiw6Lk5xTbn7LyLVIBycHHUzQK3RMVO5ixVivok4b1GLjXDCmPSzfLRoHaZKRhOHaFiUaTfe5j-t2wftg-ADBb0uiY6JsM1NZSvekoVKuVqhiw6Lk5xTbn7LyLVIBycHHUzQK3RMVO5ixVivok4b1GLjXDCmPSzfLRoHaZKRhOHaYrFiUaTfe5j-t2wftg" -o public/images/portfolio/glodinas-finance.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uj1NlxRJUw0rPRrdTixQG_gdc9-gq_VeYfkDf0Agbm0cyYbuKQlR8eNaXV9_eYGPdCMLk85ABjQqZf7ndbLV8szncbICSTJJ2t6r9oYIHaO9dDNhY7GmeXvw4LnEgWHSIMjRbpPESeiTvPK0CnoSDtUsJ7DfiZGKoR-rSJK_XBzNhG4HEhNsKFoHrD-SRugYvvQeT3evXi7qTFfP1PPleq-_7HGPwjfE-PEu3w5HdmmvloXeM01mV8-SVPP" -o public/images/portfolio/glodinas-finance-home.jpg

curl -L "https://lh3.googleusercontent.com/aida/ADBb0uhmKVmMDCAtDiVvmEs_ewdHURdCuowsMpu2TN1f0UMlbeQK6cBaEJ7vWteMoPiZRVWrrI5Wf42ulgakp8hUXHCA0sVxAq_pexsdiHqyQA76yKCIZ1qaFiUaTfe5j-t2wftg-uFffFQm9O-S9L9egD5ttdHU2nKemjxWEwf70jiOljFgoTgOgt-U8khegcRPBpgGflStohtta6UJAtys1aMxlXlT7cNbmA_WO_fvOq7_ks-Oj1IKhpQglfay3hIEZiV" -o public/images/portfolio/ignition-dashboard.jpg
```

If any download returns an error or empty file, call `mcp__stitch__get_project` for that project ID and use the `thumbnailScreenshot.downloadUrl` from the response instead.

- [ ] **Step 2: Create `src/data/portfolio.ts`**

```ts
// src/data/portfolio.ts
export interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  url?: string;
}

export const portfolio: PortfolioItem[] = [
  {
    title: 'Praatbox Dashboard',
    description: 'AI chat widget SaaS — dashboard redesign',
    image: '/images/portfolio/praatbox-dashboard.jpg',
    tags: ['Dashboard', 'SaaS', 'Redesign'],
  },
  {
    title: 'QuickResume',
    description: 'Resume builder landing page redesign',
    image: '/images/portfolio/quickresume.jpg',
    tags: ['Landing Page', 'Redesign'],
  },
  {
    title: 'Xcelerate',
    description: 'Landing page redesign',
    image: '/images/portfolio/xcelerate.jpg',
    tags: ['Landing Page', 'Redesign'],
  },
  {
    title: 'Boekingen',
    description: 'Booking page redesign',
    image: '/images/portfolio/boekingen.jpg',
    tags: ['Booking', 'Redesign'],
  },
  {
    title: 'Boekhoud Buddies — Balans',
    description: 'Accounting app balance screen',
    image: '/images/portfolio/boekhoud-buddies-balans.jpg',
    tags: ['Finance', 'App Design'],
  },
  {
    title: 'Boekhoud Buddies — Scan & Herken',
    description: 'Receipt scanning and recognition feature',
    image: '/images/portfolio/boekhoud-buddies-scan.jpg',
    tags: ['Finance', 'App Design'],
  },
  {
    title: 'Boekhoud Buddies — Homepage',
    description: 'Accounting SaaS homepage',
    image: '/images/portfolio/boekhoud-buddies-homepage.jpg',
    tags: ['Finance', 'Homepage'],
  },
  {
    title: 'Boekhoud Buddies — Redesign',
    description: 'Full app redesign',
    image: '/images/portfolio/boekhoud-buddies-redesign.jpg',
    tags: ['Finance', 'App Design', 'Redesign'],
  },
  {
    title: 'Freelancer Dashboard',
    description: 'Freelancer management dashboard overview',
    image: '/images/portfolio/freelancer-dashboard.jpg',
    tags: ['Dashboard', 'Freelance'],
  },
  {
    title: 'Glodinas Finance — Home',
    description: 'Financial SaaS homepage',
    image: '/images/portfolio/glodinas-finance-home.jpg',
    tags: ['Finance', 'Homepage'],
  },
  {
    title: 'Glodinas Finance — Dashboard',
    description: 'Financial admin dashboard — dark and light modes',
    image: '/images/portfolio/glodinas-finance.jpg',
    tags: ['Finance', 'Dashboard'],
  },
  {
    title: 'Ignition Dashboard',
    description: 'Dashboard redesign with variant exploration',
    image: '/images/portfolio/ignition-dashboard.jpg',
    tags: ['Dashboard', 'Redesign'],
  },
];
```

- [ ] **Step 3: Create `src/components/PortfolioCard.astro`**

```astro
---
// src/components/PortfolioCard.astro
import type { PortfolioItem } from '../data/portfolio';
interface Props {
  item: PortfolioItem;
}
const { item } = Astro.props;
---
<article class="card">
  <div class="card__image">
    <img src={item.image} alt={item.title} loading="lazy" />
  </div>
  <div class="card__body">
    <h3 class="card__title">{item.title}</h3>
    <p class="card__desc">{item.description}</p>
    <div class="card__tags">
      {item.tags.map(tag => <span class="card__tag">{tag}</span>)}
    </div>
  </div>
</article>

<style>
  .card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--color-bg-secondary);
    transition: transform 0.2s, border-color 0.2s;
  }
  .card:hover {
    transform: translateY(-2px);
    border-color: var(--color-accent);
  }
  .card__image {
    aspect-ratio: 16/9;
    overflow: hidden;
  }
  .card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
  .card__body {
    padding: var(--spacing-md);
  }
  .card__title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }
  .card__desc {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: var(--spacing-sm);
  }
  .card__tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .card__tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: var(--color-border);
    opacity: 0.8;
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/data/portfolio.ts src/components/PortfolioCard.astro public/images/portfolio/
git commit -m "feat: add portfolio data and PortfolioCard component"
```

---

## Task 5: Contact Form API Route (TDD)

**Files:**
- Create: `src/pages/api/contact.ts`
- Create: `tests/api/contact.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/api/contact.test.ts`:

```ts
// tests/api/contact.test.ts
import { describe, it, expect, vi } from 'vitest';
import { validateContactForm, buildEmailHtml } from '../../src/lib/contact';

describe('validateContactForm', () => {
  it('returns error when name is missing', () => {
    const result = validateContactForm({ name: '', email: 'a@b.com', message: 'hi' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/name/i);
  });

  it('returns error when email is invalid', () => {
    const result = validateContactForm({ name: 'Jan', email: 'notanemail', message: 'hi' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/email/i);
  });

  it('returns error when message is missing', () => {
    const result = validateContactForm({ name: 'Jan', email: 'a@b.com', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/message/i);
  });

  it('returns valid for correct input', () => {
    const result = validateContactForm({ name: 'Jan', email: 'jan@kayablue.nl', message: 'Hello!' });
    expect(result.valid).toBe(true);
  });
});

describe('buildEmailHtml', () => {
  it('includes name, email, and message in output', () => {
    const html = buildEmailHtml({ name: 'Jan', email: 'jan@kayablue.nl', message: 'Hello!', phone: '0612345678', preferredDate: '2026-04-15' });
    expect(html).toContain('Jan');
    expect(html).toContain('jan@kayablue.nl');
    expect(html).toContain('Hello!');
    expect(html).toContain('0612345678');
    expect(html).toContain('2026-04-15');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL — `cannot find module '../../src/lib/contact'`

- [ ] **Step 3: Create `src/lib/contact.ts` with validation and email builder**

```ts
// src/lib/contact.ts
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  preferredDate?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  if (!data.name?.trim()) return { valid: false, error: 'Name is required' };
  if (!data.email?.trim() || !EMAIL_REGEX.test(data.email)) return { valid: false, error: 'A valid email is required' };
  if (!data.message?.trim()) return { valid: false, error: 'Message is required' };
  return { valid: true };
}

export function buildEmailHtml(data: ContactFormData): string {
  return `
    <h2>New booking request from Kayablue.nl</h2>
    <table>
      <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
      ${data.phone ? `<tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>` : ''}
      ${data.preferredDate ? `<tr><td><strong>Preferred date</strong></td><td>${data.preferredDate}</td></tr>` : ''}
      <tr><td><strong>Message</strong></td><td>${data.message}</td></tr>
    </table>
  `;
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```
Expected: All tests PASS

- [ ] **Step 5: Create `src/pages/api/contact.ts` API route**

```ts
// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { validateContactForm, buildEmailHtml } from '../../lib/contact';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), { status: 400, headers });
  }

  // Honeypot check
  if (body.website) {
    return new Response(JSON.stringify({ success: false, error: 'Bot detected' }), { status: 400, headers });
  }

  const validation = validateContactForm(body);
  if (!validation.valid) {
    return new Response(JSON.stringify({ success: false, error: validation.error }), { status: 400, headers });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const toEmail = import.meta.env.TO_EMAIL;

  try {
    await resend.emails.send({
      from: 'Kayablue Website <noreply@kayablue.nl>',
      to: [toEmail],
      subject: `New booking request from ${body.name}`,
      html: buildEmailHtml({
        name: body.name,
        email: body.email,
        message: body.message,
        phone: body.phone,
        preferredDate: body.preferredDate,
      }),
    });
  } catch (err) {
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};
```

- [ ] **Step 6: Create `.env.example`**

```
# .env.example
RESEND_API_KEY=re_your_key_here
TO_EMAIL=you@kayablue.nl
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/contact.ts src/pages/api/contact.ts tests/ .env.example
git commit -m "feat: add contact form validation, email builder, and API route"
```

---

## Task 6: All 7 Pages + 404

**Files:**
- Create/Replace: `src/pages/index.astro`
- Create: `src/pages/services.astro`
- Create: `src/pages/our-work.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/industries.astro`
- Create: `src/pages/book-a-call.astro`
- Create: `src/pages/careers.astro`
- Create: `src/pages/404.astro`

Each page is built faithfully to its Stitch design. Reference the Stitch HTML export URLs below to inspect the original markup and layout — fetch each URL, read the structure, and implement it in Astro.

**Stitch HTML export URLs:**
| Page | Screen ID | Title |
|------|-----------|-------|
| Homepage | `2bcc5292a793438387962da6a1af61e7` | Glodinas Web Homepage - Final Footer Sync |
| Services | `37469524680f4b4384b9a7944b9876e8` | Services - Redesigned Brand Sync |
| Our Work | `0d3a640b49d9471dae5671250f78ab74` | Our Work - Branded Consistency |
| About | `2a5fedbf3f044b3daecca95f4abca22b` | About - Nav & Footer Sync |
| Industries | `8fc65c979b0a47b480c8865253cb67ae` | Industries We Serve - Synchronized Branding |
| Book a Call | `edfbd223729248bd9042e2b5bb8ee4f6` | Book a Call - Final Brand Sync |
| Careers | `37208444c4424354998f6b4f0ae8954b` | Careers - Branded Navigation & Footer Sync |

To retrieve Stitch HTML for any screen, call:
```
mcp__stitch__get_screen with name: "projects/4753305574908518777/screens/<screenId>"
```
Then fetch the `htmlCode.downloadUrl` to get the full HTML markup.

- [ ] **Step 1: Build Homepage (`src/pages/index.astro`)**

Fetch Stitch HTML for `2bcc5292a793438387962da6a1af61e7`, extract content sections (hero, intro, services summary, CTA), and implement in Astro using BaseLayout. Strip Stitch wrapper elements; keep visual structure.

- [ ] **Step 2: Build Services page (`src/pages/services.astro`)**

Fetch Stitch HTML for `37469524680f4b4384b9a7944b9876e8`, implement content sections in Astro.

- [ ] **Step 3: Build Our Work page (`src/pages/our-work.astro`)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PortfolioCard from '../components/PortfolioCard.astro';
import { portfolio } from '../data/portfolio';
---
<BaseLayout title="Our Work" description="Client projects designed by Kayablue">
  <section class="container" style="padding-top: 4rem;">
    <h1>Our Work</h1>
    <p>A selection of projects we've designed for our clients.</p>
    <div class="grid">
      {portfolio.map(item => <PortfolioCard item={item} />)}
    </div>
  </section>
</BaseLayout>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-xl);
  }
</style>
```

Then style the header section to match the Stitch design for `0d3a640b49d9471dae5671250f78ab74`.

- [ ] **Step 4: Build About page (`src/pages/about.astro`)**

Fetch Stitch HTML for `2a5fedbf3f044b3daecca95f4abca22b`, implement in Astro.

- [ ] **Step 5: Build Industries page (`src/pages/industries.astro`)**

Fetch Stitch HTML for `8fc65c979b0a47b480c8865253cb67ae`, implement in Astro.

- [ ] **Step 6: Build Book a Call page (`src/pages/book-a-call.astro`)**

Fetch Stitch HTML for `edfbd223729248bd9042e2b5bb8ee4f6`, implement the form:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Book a Call" description="Book a discovery call with Kayablue">
  <!-- page content matching Stitch design -->
  <form id="contact-form">
    <!-- Honeypot — hidden from users, filled by bots -->
    <input type="text" name="website" tabindex="-1" autocomplete="off" style="display:none;" />

    <input type="text" name="name" placeholder="Your name" required />
    <input type="email" name="email" placeholder="Email address" required />
    <input type="tel" name="phone" placeholder="Phone (optional)" />
    <input type="date" name="preferredDate" />
    <textarea name="message" placeholder="Tell us about your project" required></textarea>
    <button type="submit">Send Message</button>
    <p id="form-status" aria-live="polite"></p>
  </form>
</BaseLayout>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const status = document.getElementById('form-status')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    status.textContent = 'Sending...';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        status.textContent = "Thanks! We'll be in touch shortly.";
        form.reset();
      } else {
        status.textContent = json.error || 'Something went wrong. Please try again.';
      }
    } catch {
      status.textContent = 'Network error. Please try again.';
    }
  });
</script>
```

- [ ] **Step 7: Build Careers page (`src/pages/careers.astro`)**

Fetch Stitch HTML for `37208444c4424354998f6b4f0ae8954b`, implement in Astro.

- [ ] **Step 8: Build 404 page (`src/pages/404.astro`)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Not Found">
  <section class="container" style="padding-top: 6rem; text-align: center;">
    <h1 style="font-size: 6rem; opacity: 0.2;">404</h1>
    <p style="font-size: 1.25rem; margin-bottom: 2rem;">Page not found.</p>
    <a href="/" style="color: var(--color-accent); font-weight: 600;">Back to home →</a>
  </section>
</BaseLayout>
```

- [ ] **Step 9: Build the project and verify no errors**

```bash
npm run build
```
Expected: Build completes with no errors. Check `dist/` contains all 7 HTML files.

- [ ] **Step 10: Commit**

```bash
git add src/pages/
git commit -m "feat: implement all 7 pages and 404 from Stitch designs"
```

---

## Task 7: Cloudflare Pages Deployment

- [ ] **Step 1: Push repo to GitHub**

Create a new repo on GitHub named `kayablue-website`, then:
```bash
# Replace <your-github-username> with your actual GitHub username
git remote add origin https://github.com/<your-github-username>/kayablue-website.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Connect repo in Cloudflare Pages dashboard**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create a project
2. Connect GitHub → select `kayablue-website`
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Environment variables (Production):
   - `RESEND_API_KEY` = your Resend API key
   - `TO_EMAIL` = your email address
5. Settings → Functions → **Compatibility flags** → add `nodejs_compat`
6. Click **Save and Deploy**

- [ ] **Step 3: Connect custom domain**

In Cloudflare Pages → your project → Custom domains:
1. Add `kayablue.nl`
2. Cloudflare detects it's already on Cloudflare DNS → auto-configures (one click)
3. Also add `www.kayablue.nl` and set up redirect to apex if desired

- [ ] **Step 4: Verify live deployment**

Open `https://kayablue.nl` in browser. Check:
- [ ] All 7 pages load
- [ ] Nav active states work
- [ ] Portfolio grid shows images
- [ ] Book a Call form submits and shows success message
- [ ] Email arrives in `TO_EMAIL` inbox
- [ ] 404 page shows for unknown URLs

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: verify deployment — kayablue.nl live"
git push
```

---

## Environment Variables Reference

| Variable | Where | Value |
|----------|-------|-------|
| `RESEND_API_KEY` | Cloudflare Pages dashboard | From resend.com account |
| `TO_EMAIL` | Cloudflare Pages dashboard | Your email address |

**Before deploying:** Create a Resend account at resend.com, verify `kayablue.nl` as a sending domain, and generate an API key.

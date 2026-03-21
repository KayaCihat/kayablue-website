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
    title: 'Kayablue Finance — Home',
    description: 'Financial SaaS homepage',
    image: '/images/portfolio/glodinas-finance-home.jpg',
    tags: ['Finance', 'Homepage'],
  },
  {
    title: 'Kayablue Finance — Dashboard',
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

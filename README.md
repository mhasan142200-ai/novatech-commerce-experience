# E-Commerce Web Application

**NovaTech** is a responsive, multi-page e-commerce storefront built with **HTML, CSS, and vanilla JavaScript**. It demonstrates client-side product discovery, cart state management, accessible UI patterns, and privacy-conscious design without requiring a framework or backend.

[**Live demo ↗**](https://mhasan142200-ai.github.io/novatech-commerce-experience/) · [**Browse the source ↗**](.) 

> **Project scope:** A collaborative academic project, not a production store. Checkout runs in **PayPal sandbox (test) mode**: test accounts and test cards only, no real money. The newsletter form is a simulation.

## Features

- **Interactive catalog:** Six products, instant keyword search, and category filtering.
- **Persistent cart:** Add or remove products, adjust quantities, and retain the cart across page visits using browser `localStorage`.
- **Order calculation:** Line totals, subtotal, $9.99 shipping below $50 (free at $50+), and 13% HST, calculated in cents.
- **PayPal sandbox checkout (Assignment 2):** Cart → checkout review → PayPal sandbox payment → order confirmation page with PayPal order and transaction IDs.
- **On-page SEO (Assignment 2):** Keyword-focused titles and descriptions, product images with alt text, canonical and Open Graph tags, JSON-LD structured data, `sitemap.xml`, and `robots.txt`.
- **Content marketing (Assignment 2):** Content plan plus three 150–200 word buying guides on the blog.
- **Social media (Assignment 2):** Share links for X, Facebook, Reddit, and WhatsApp in every footer, and a promotion strategy on the Marketing page.
- **Responsive interface:** Mobile navigation and layouts adapted for smaller screens.
- **Accessibility:** Semantic HTML, skip-to-content links, visible keyboard focus, form labels, ARIA status messages, and reduced-motion support.
- **Privacy-first:** No analytics or tracking cookies. Card details are entered only on PayPal. A privacy control clears locally saved cart and order data.
- **Supporting content:** About, team blog, marketing, privacy, and business/technology strategy pages.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3 (responsive layout) |
| Interaction | Vanilla JavaScript (ES6+) |
| Persistence | Browser `localStorage` (cart) and `sessionStorage` (last order) |
| Payments | PayPal JavaScript SDK, sandbox mode |
| Hosting | GitHub Pages |
| Validation | Node.js, dependency-free site validation script, GitHub Actions |

**Architecture:** This is a static, client-rendered website. The product catalog is defined in `js/main.js`; event handlers manage search, filtering, cart updates, mobile navigation, sharing, and demo flows. Cart items are stored in the browser rather than a remote database.

## PayPal Sandbox Setup

Set `PAYPAL_CLIENT_ID` at the top of `js/main.js` to the **sandbox** client ID from developer.paypal.com (Apps & Credentials → Sandbox). The client ID is public; never put the app secret in front-end code. Pay with a sandbox personal account or a PayPal test card.

## Explore the Demo

1. Open the [live storefront](https://mhasan142200-ai.github.io/novatech-commerce-experience/).
2. Visit **Products** and filter by category or search for a product.
3. Add items to the cart, adjust their quantities, and review totals and shipping.
4. Reload the page to see that the cart persists in your browser.
5. Visit **Privacy** to clear stored cart data.

## Run Locally

No dependency installation or build step is needed. Clone the repository and run a local web server:

```bash
git clone https://github.com/mhasan142200-ai/novatech-commerce-experience.git
cd novatech-commerce-experience
python3 -m http.server 8000
```

Then visit **http://localhost:8000**.

If you rename this repository, update the clone URL and folder name above.

## Validation

Requires Node.js:

```bash
node scripts/validate-site.mjs
```

This script performs **static checks** for required pages and links, duplicate element IDs, JavaScript syntax, product count, accessibility hooks, and project-specific content. GitHub Actions runs it on pushes and pull requests to `main`.

These checks do **not** replace browser-based functional testing, performance auditing, or end-to-end tests.

## Project Structure

```text
.
├── index.html             # Landing page
├── products.html          # Searchable product catalog
├── cart.html              # Persistent cart and totals
├── checkout.html          # Order review and PayPal sandbox payment
├── order-confirmation.html # Payment confirmation
├── marketing.html         # Content plan, social strategy, SEO checklist
├── images/                # Product images, favicon, social share image
├── sitemap.xml, robots.txt
├── about.html             # Team and project background
├── blog.html              # Team-authored articles
├── strategy.html          # Business and technology analysis
├── privacy.html           # Data-handling details and controls
├── css/style.css          # Styling and responsive layouts
├── js/main.js             # Catalog and client-side interactions
├── scripts/validate-site.mjs
└── .github/workflows/validate.yml
```

## Design Decisions

- **Vanilla JavaScript:** Keeps the app lightweight, dependency-free, and easy to deploy on static hosting.
- **Browser-local cart:** Makes state persistence demonstrable without a server or storing personal details.
- **Delegated click handlers:** Supports product and cart buttons inserted dynamically into the DOM.
- **Explicit demo boundaries:** Checkout and newsletter interactions tell visitors that submissions are not processed.
- **Accessible navigation:** Keyboard and assistive-technology cues are incorporated into the interface rather than treated as optional extras.

## Limitations & Next Steps

This prototype does not have a backend API, authentication, database, or real inventory. PayPal orders are created and captured from the browser, so a production store would move order creation to a server to verify prices. The product catalog is hard-coded, and the validation script checks structure and source content rather than real user journeys.

Potential extensions include automated browser tests, a separate API and database, server-side stock checks, user accounts, and a payment-provider sandbox. These are **future ideas**, not existing features.

## Contributors & Project Context

Assignment 2 team: **Elias Zubaidi** (payments and security), **Awale Hussein** (SEO and catalog), **Hasan Muhammad** (cart, QA and report), and **Omeed Attayi** (content and social media). Assignment 1 was built with **Nadeem Hassan**, who has since left the group. Team-written articles and project background remain available in the website.

This repository showcases the implemented storefront and technical choices. Individual contribution boundaries are not documented in the source history, so this README does not claim sole authorship.

## Deployment

The site is hosted on GitHub Pages from `main`.

**Current live URL:** https://mhasan142200-ai.github.io/novatech-commerce-experience/

If the repository is renamed, check the GitHub Pages settings and update the live URL in this README; GitHub Pages addresses are tied to repository names.

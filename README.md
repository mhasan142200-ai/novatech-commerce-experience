# E-Commerce Web Application

**NovaTech** is a responsive, multi-page e-commerce storefront built with **HTML, CSS, and vanilla JavaScript**. It demonstrates client-side product discovery, cart state management, accessible UI patterns, and privacy-conscious design without requiring a framework or backend.

[**Live demo ↗**](https://nadeemhshehata.github.io/novatech-commerce-experience/) · [**Browse the source ↗**](.) 

> **Project scope:** A collaborative academic frontend project, not a production store. Checkout and newsletter submission are simulations; no payments, orders, accounts, or emails are processed.

## Features

- **Interactive catalog:** Six products, instant keyword search, and category filtering.
- **Persistent cart:** Add or remove products, adjust quantities, and retain the cart across page visits using browser `localStorage`.
- **Order calculation:** Dynamic subtotal, $9.99 shipping below $50, and free shipping at $50 or more.
- **Responsive interface:** Mobile navigation and layouts adapted for smaller screens.
- **Accessibility:** Semantic HTML, skip-to-content links, visible keyboard focus, form labels, ARIA status messages, and reduced-motion support.
- **Privacy-first demo:** No analytics, remote assets, checkout processing, or customer-data collection. A privacy control clears locally saved cart data.
- **Supporting content:** About, team blog, privacy, and business/technology strategy pages.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3 (responsive layout) |
| Interaction | Vanilla JavaScript (ES6+) |
| Persistence | Browser `localStorage` |
| Hosting | GitHub Pages |
| Validation | Node.js, dependency-free site validation script, GitHub Actions |

**Architecture:** This is a static, client-rendered website. The product catalog is defined in `js/main.js`; event handlers manage search, filtering, cart updates, mobile navigation, sharing, and demo flows. Cart items are stored in the browser rather than a remote database.

## Explore the Demo

1. Open the [live storefront](https://nadeemhshehata.github.io/novatech-commerce-experience/).
2. Visit **Products** and filter by category or search for a product.
3. Add items to the cart, adjust their quantities, and review totals and shipping.
4. Reload the page to see that the cart persists in your browser.
5. Visit **Privacy** to clear stored cart data.

## Run Locally

No dependency installation or build step is needed. Clone the repository and run a local web server:

```bash
git clone https://github.com/nadeemhshehata/novatech-commerce-experience.git
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

This prototype does not have a backend API, authentication, database, real inventory, or payment integration. The product catalog is hard-coded, and the validation script checks structure and source content rather than real user journeys.

Potential extensions include automated browser tests, a separate API and database, server-side stock checks, user accounts, and a payment-provider sandbox. These are **future ideas**, not existing features.

## Contributors & Project Context

Created as a collaborative academic project by **Nadeem Hassan, Elias Zubaidi, Awale Hussein, Hasan Muhammad, and Omeed Attayi**. Team-written articles and project background remain available in the website.

This repository showcases the implemented storefront and technical choices. Individual contribution boundaries are not documented in the source history, so this README does not claim sole authorship.

## Deployment

The site is hosted on GitHub Pages from `main`.

**Current live URL:** https://nadeemhshehata.github.io/novatech-commerce-experience/

If the repository is renamed, check the GitHub Pages settings and update the live URL in this README; GitHub Pages addresses are tied to repository names.

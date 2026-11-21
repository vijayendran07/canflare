# Design audit & direction

Screenshots of every page at 390 px and 1440 px (before the redesign) are in [`design-review/before/`](design-review/before). Lighthouse JSON for each page is in `design-review/lh-before-*.json`.

## 1. Baseline measurements (mobile Lighthouse, production build, simulated 4G)

| Page | Perf | A11y | Best-pr. | SEO | LCP | CLS | TBT | JS (transfer) |
|---|---|---|---|---|---|---|---|---|
| Home | 100 | 96 | 100 | 100 | 1.2 s | 0 | 50 ms | 157 KB |
| Category | 100 | 95 | 100 | 100 | 1.1 s | 0 | 60 ms | 157 KB |
| Product | 90 | 96 | 100 | 100 | **3.6 s** | 0 | 70 ms | 160 KB |
| Checkout (empty-cart state) | 93 | 96 | 100 | 69¹ | **3.2 s** | **0.047** | 60 ms | 162 KB |

¹ Checkout is deliberately `noindex`, which is what lowers the SEO score.

Key point for the redesign: **Home already uses 157 KB of the 170 KB first-load JS budget.** Every new feature (3D, concierge, voice, search) must be code-split and load on demand.

## 2. What is weak – ranked by impact on sales

1. **No emotional hook / no hero moment.** The first screen is a dark gradient with three small illustrations. Nothing says "light" – the single idea the brand is built on – and nothing makes a visitor want to scroll. *(Impact: bounce rate, brand recall.)*
2. **Every product looks identical.** All 14 cards use the same jar illustration, so the catalogue reads as a wall of repeated tiles; shoppers cannot tell products apart and nothing invites a tap. Real photos are the fix; until then, product cards need a distinct treatment per type and better hierarchy. *(Impact: browse → product-page click-through.)*
3. **Home is a very long, flat stack.** 8 category cards + 8 product cards + 3 explainer sections at 390 px is ≈ 6 300 px with no rhythm, no pinned or scrolling interactions, and no bento/kinetic variety. *(Impact: scroll depth, reaching products.)*
4. **Product page is thin on the buy decision.** No delivery estimate by pincode, no sticky mobile buy bar (the Add-to-cart button scrolls out of view), no share, no recently viewed, no gallery zoom/swipe. *(Impact: add-to-cart rate on mobile – the biggest lever.)*
5. **Checkout is one long form.** 8+ fields shown at once on a phone, state is not auto-filled from the pincode, address is not remembered for repeat buyers, no step progress. *(Impact: checkout abandonment.)*
6. **Navigation is not thumb-friendly.** Primary navigation lives in the top bar / hamburger; no bottom navigation, no instant search, no filter bottom-sheet on the shop page. *(Impact: discoverability on mobile, 90 %+ of traffic.)*
7. **Search is a plain text filter on /shop only** – no instant results with images/prices, no typo tolerance, no voice. *(Impact: findability for gifting/return-gift shoppers.)*
8. **No feedback on actions.** Adding to cart only opens a drawer; there is no flying image, no cart bounce, no count tick, no toast, no skeletons, no designed offline/empty/error states. *(Impact: perceived quality and confidence.)*
9. **Typography/colour are good but flat.** Playfair + Plus Jakarta is a sound pairing, but there is no fluid type scale (headings jump at breakpoints), no elevation system, no glass/glow layer, so the page lacks depth. *(Impact: perceived premium.)*
10. **Performance edges:** Product LCP 3.6 s and Checkout LCP 3.2 s / CLS 0.047 are above the 2.0 s / 0.05 targets (LCP element is text rendered after the web-font swap; CLS comes from the free-delivery bar and sticky bars mounting after hydration). *(Impact: SEO, bounce on cheap phones.)*
11. **Accessibility:** one colour-contrast failure (muted text on cream, `text-taupe` on oat); no skip link; focus ring only default.
12. **Missing "trust" structure** (delivery, payment method, policies) as a scannable block on home and product pages – today it's three tiny tiles. Real reviews do not exist yet, so this must be done with *real* facts only.

## 3. Directions explored

Static mockups (hero + product card) in [`design-review/directions/`](design-review/directions): 

| | Direction | Idea | Strength | Risk |
|---|---|---|---|---|
| A | **Cinematic Luxe** | Dark stage, a glowing flame as the hero, gold light spill, glass cards | Directly expresses *"Let there be Light"* and the black-and-gold logo; cheap to render (CSS gradients, no heavy images) | Dark pages can feel heavy if used everywhere |
| B | **Soft Futurism** | Cream mesh gradients, frosted glass nav, big rounded surfaces | Fresh, friendly, very readable | Looks like any wellness/skincare brand; flame loses its drama |
| C | **Editorial Craft** | Hairline grid, huge serif, hard black/cream blocks | Distinctive, confident | Austere; less "gift-able"; hairline grids are fiddly on small phones |

### Chosen: **Cinematic Luxe**, with Soft-Futurism glass for UI layers

**Why.** The brand *is* light: the tagline, the logo flame, and the product itself. Direction A is the only one where the hero is the thing the customer is buying – a lit candle – and it does it with CSS light and one lazy 3D scene rather than megabytes of imagery, which matters on cheap Android phones. Buyers of candles shop for atmosphere and gifts; a dark, glowing first screen sells atmosphere in 3 seconds, while the cream body of the site (borrowed from B's soft surfaces, from C's editorial type) keeps browsing, price reading and checkout calm and legible.

**Rules of the language**
- *Dark stage → cream stage.* Hero and "story" are dark and luminous; shopping, product and checkout are warm cream with glass/soft-shadow surfaces.
- *Light is the accent.* Gold glow is used sparingly: the flame, the primary CTA, focus rings, success moments. No neon, no gradients on text except the single gold word in headlines.
- *Depth through layers:* 5-step elevation scale, blur only on the sticky header and bottom sheets.
- *Motion language:* things appear like a flame – a soft rise and fade (transform/opacity only), 120/220/400/700 ms, one standard and one emphasised easing, every animation has a reduced-motion alternative.

## 4. Constraints taken into account

- No new payment methods: the store's contract is "Confirm on WhatsApp & pay" – no gateway, no UPI button. Checkout is redesigned as 3 steps (Contact → Delivery → Confirm on WhatsApp), not 3 payment options.
- No coupon system exists, so no coupon field is shown (a field that does nothing would be a fake feature).
- No real reviews, order history or "frequently bought together" data exist yet: those sections are built but **hidden until real data exists**.
- No translations / hreflang exist (single-language site); nothing to break there.
- Only illustrations (drawn) are used where photos are missing – never stock photos presented as products.

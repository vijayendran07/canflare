# Canflare design system – "Cinematic Luxe"

Light is the hero. A dark, glowing **stage** (hero, story, success moments) leads into a warm cream **surface** where people browse, read prices and pay. Gold is the only accent and is used like a flame: sparingly.

Live style guide: `/design-system` in development, `/admin/design-system` in production (login required, `noindex`).
Source of truth: [`app/globals.css`](app/globals.css) (tokens + primitives) and [`components/ui/`](components/ui).

## Tokens

All tokens live in `@theme` in `globals.css`, so they are available both as Tailwind utilities (`bg-gold`, `shadow-e3`, `rounded-lg`, `text-display`, `ease-spring`) and as CSS variables (`var(--color-gold)`).

### Colour (all text pairs are WCAG AA or better)
| Token | Value | Use |
|---|---|---|
| `gold` / `gold-bright` / `gold-deep` | #fab507 / #ffd04a / #7b5800 | brand accent, CTA, glow / hover / text-on-cream accent |
| `ink`, `ink-soft`, `taupe` | #1b1c1a, #4a4731, #6b625a | text (taupe = muted, 5.6:1 on surface) |
| `surface`, `oat`, `card`, `line` | #fbf9f5, #f5f0e8, #fff, #e6dfd3 | page, sunken, raised, hairlines |
| `stage`, `stage-2`, `stage-3`, `on-stage`, `on-stage-soft` | #0c0a08 … #f3ead6, #c9bfa8 | the dark cinematic sections |
| `ok`, `warn`, `danger`, `info` | #2e7d32, #8a5200, #b3261e, #1d5fa6 | status |
| `--glow`, `--glass-*` | gold 45 %, white 66 % / dark 62 % | glow + glass layers |

### Typography
- **Display / headings:** Playfair Display (self-hosted via `next/font`), lining numerals forced so prices read cleanly, balanced wrapping.
- **Text:** Plus Jakarta Sans (self-hosted via `next/font`), body 16 px / 1.6–1.7, max ~65 ch.
- **₹ glyph:** a 740-byte font (`/rupee.woff2`, `unicode-range: U+20B9`) so ₹ is identical on every phone.
- Fluid scale (`clamp`, 360 → 1440 px): `text-xs … text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-display`.
- No regional-language font is used because the site is single-language.

### Spacing, radius, elevation, blur
- Spacing: Tailwind's 4 px grid (4/8/12/16/24/32…).
- Radius: `xs 6 · sm 10 · md 14 · lg 20 · xl 28 · 2xl 36 · full`.
- Elevation: `shadow-e1 … shadow-e5` (warm-tinted, two-layer) + `shadow-glow` for the primary CTA.
- Blur (glass only – sticky header, sheets, hero chips): `8 / 16 / 28 px`.

### Motion – one language
- Durations: `--dur-instant 120ms` (press), `--dur-fast 220ms` (hover, fade), `--dur-base 400ms` (rise, sheets), `--dur-slow 700ms` (scroll reveals).
- Easings: `--ease-standard` (UI), `--ease-emphasized` (things arriving, like a flame rising), `--ease-spring` (small, joyful pops).
- Only `transform` and `opacity` are animated. Every animation has a calm alternative: `prefers-reduced-motion` sets all durations to ~0 and disables flicker/parallax/fly-to-cart.

## Components (`components/ui`)

| Component | File | Notes |
|---|---|---|
| Button (gold, dark, line, ghost, wa, glass; md/lg; icon) | `Button.tsx` | `href` renders a link; 44 px min target |
| Badge, Price, Rating, Skeleton, EmptyState, Breadcrumb, Accordion | `primitives.tsx` | `Rating` renders nothing without real reviews; `Accordion` is native `<details>` |
| Field, SelectField, QtyStepper, ChipGroup, Tabs | `controls.tsx` | labelled, `aria-invalid`/`describedby`, roving-tabindex tabs |
| BottomSheet, Drawer, Modal, Toast | `overlays.tsx` | native `<dialog>` (focus trap, Esc, inert background) – no library |
| useInfinite, BackToTop | `LoadMore.tsx` | IntersectionObserver with a "Show more" button fallback |
| ProductCard | `components/ProductCard.tsx` | quick-add + size choice |

CSS primitives (`.btn`, `.input`, `.chip`, `.badge`, `.card`, `.glass`, `.glass-dark`, `.stage`, `.skeleton`, `dialog.sheet|drawer|modal`) live in `@layer components`, so Tailwind utilities can always override them.

## Rules
1. Dark **stage** for emotion (hero, story, order success); cream **surface** for everything transactional.
2. One gold primary action per screen area. Secondary actions are `line`/`ghost`.
3. Real content only – no placeholder reviews, ratings, counters or timers. Components that would need real data (`Rating`, upsell, reviews) render nothing without it.
4. Any new animation must use the motion tokens, animate only transform/opacity, and degrade under `prefers-reduced-motion`.
5. Dark-mode toggle: intentionally **not shipped** – the site already alternates dark stage and cream surface, and a second theme would double the contrast surface to test for little gain.

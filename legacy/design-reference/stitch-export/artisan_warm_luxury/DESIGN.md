---
name: Artisan Warm Luxury
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4a4731'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#7b785f'
  outline-variant: '#ccc7aa'
  surface-tint: '#676000'
  primary: '#676000'
  on-primary: '#ffffff'
  primary-container: '#ffef00'
  on-primary-container: '#736b00'
  inverse-primary: '#d7ca00'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#ffbb00'
  on-secondary-container: '#6c4d00'
  tertiary: '#665d55'
  on-tertiary: '#ffffff'
  tertiary-container: '#f6e9df'
  on-tertiary-container: '#716861'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f6e600'
  primary-fixed-dim: '#d7ca00'
  on-primary-fixed: '#1f1c00'
  on-primary-fixed-variant: '#4d4800'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#ffbb00'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#ede0d7'
  tertiary-fixed-dim: '#d0c4bb'
  on-tertiary-fixed: '#201a15'
  on-tertiary-fixed-variant: '#4d453f'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system embodies warm sensory minimalism and tactile luxury, crafted for an artisanal home fragrance and candle atelier. The visual language conveys quiet opulence, slow living, and artisanal intimacy.

The emotional response should evoke stepping into a sun-drenched, stone-walled Parisian apothecary or a secluded Nordic retreat: calm, restorative, fragrant, and grounded. The aesthetic blends tactile minimalism with editorial elegance—prioritizing expansive negative space, delicate warm metallic accents, deep botanical contrast, and editorial typography over decorative clutter.

## Colors

The palette draws directly from raw wax, botanical essences, and polished brass fixtures:

- **Primary (`#FFEF00` - Luminous Gold):** Anchors the brand with a radiant, high-visibility luminous yellow-gold. Used for dominant high-emphasis accents, striking CTA buttons, and key structural framing.
- **Secondary (`#FFBB00` - Radiant Gold):** An elevated, brilliant golden accent. Applied sparingly for active states, delicate divider rules, foil accents, and luxury rating highlights.
- **Tertiary (`#8C827A` - Muted Taupe):** Provides warmth for secondary metadata, subtle borders, inactive states, and scent note descriptors.
- **Neutral Surface (`#FBF9F5` - Alabaster Cream):** The foundational canvas. Replaces sterile digital white with natural candle-wax warmth. Paired with `#F5F0E8` (Oat Silk) for elevated container backgrounds and `#1A1A1A` (Rich Charcoal) for body reading text.

## Typography

The type system balances literary editorial grace with modern digital legibility.

- **Headlines (`Playfair Display`):** Unapologetically editorial and romantic. Use regular (400) or medium (500) weights to preserve delicate serifs. Headings must breathe with generous vertical leading.
- **Body & Captions (`Plus Jakarta Sans`):** Clean, rounded humanist geometric forms that offset the formality of the serif. Set with generous line heights to preserve editorial ease.
- **Labels & Microcopy:** Rendered with tracked-out uppercase styling (`letterSpacing: 0.08em` to `0.12em`) to introduce bespoke apothecary labeling cues across fragrance profiles and product meta.

## Layout & Spacing

The layout philosophy follows a restrained, airy 12-column grid on desktop, scaling to a 6-column grid on tablet and 4 columns on mobile. 

Layout rules:
- **Canvas Margins:** Desktop layouts embrace wide outer margins (`4rem`) to center focus and simulate editorial broadsheet pages. Mobile transitions to a comfortable `1.25rem`.
- **Vertical Rhythm:** Generous spacing between modules (`space-xl` and higher multiples) encourages deliberate, paced browsing. Dense groupings are strictly reserved for ingredient specifications and checkout breakdowns.
- **Content Alignment:** Hero displays and editorial narrative blocks feature asymmetric offsets, alternating product imagery with typography to evoke bespoke catalogs.

## Elevation & Depth

This design system avoids harsh drop shadows and neon glows in favor of soft, natural ambient depth reminiscent of diffused candlelit rooms:

- **Tonal Layering:** The primary mechanism for depth is warm surface nesting. Cards and panels sit on `#F5F0E8` or pure `#FFFFFF` against the `#FBF9F5` base canvas.
- **Ambient Candlelit Diffusion:** When physical elevation is required (modals, dropdown drawers, floating carts), use diffused, low-opacity umber shadows tinted with warm taupe rather than pure black: `0 12px 32px -8px rgba(45, 36, 26, 0.08)`.
- **Gilded Hairline Borders:** Secondary containers, product tiles, and input frames utilize subtle 1px borders tinted in `#EAE5DE` or muted brass `rgba(255, 187, 0, 0.25)` to delineate boundaries with jewelry-like delicacy.

## Shapes

The shape system adopts a soft, understated curvature (Level 1: `0.25rem` standard radius, `0.5rem` for cards and modals).

This creates an intentional balance: sharp enough to retain high-fashion architectural discipline and label-like structure, yet softened just enough to eliminate digital stiffness. Pill shapes are forbidden except for tactile scent-pill selectors and status tags.

## Components

### Buttons
- **Primary:** Luminous Gold (`#FFEF00`) fill with high-contrast dark typography, `label-md` uppercase tracked text, subtle `0.25rem` border radius. On hover, smoothly transitions to subtle warm burnished depth with a micro-lift.
- **Secondary:** Transparent base with a 1px border in `#FFBB00` (Radiant Gold) and primary text. On hover, fills with warm gold wash (`rgba(255, 187, 0, 0.08)`).
- **Tertiary / Text Link:** Understated text link underlined with an offset 1px golden rule that expands horizontally upon hover.

### Product & Editorial Cards
- Framed in warm ivory (`#F5F0E8`) or seamless transparent frames bordered by 1px `#EAE5DE`.
- Image aspect ratio standardized to 4:5 or 3:4 portrait ratios to emphasize artisanal vessel silhouettes.
- Floating tags (e.g., "Limited Harvest", "Hand-Poured") sit top-left in translucent cream (`rgba(251, 249, 245, 0.85)`) with tracked `label-sm` typography.

### Input Fields & Controls
- Form inputs feature warm cream backgrounds (`#FFFFFF` or `#F5F0E8`), 1px borders in `#8C827A` (at 40% opacity), and inset labels that float gracefully.
- Focus state shifts the border to Radiant Gold (`#FFBB00`) with an ambient gold glow ring (`0 0 0 3px rgba(255, 187, 0, 0.15)`).

### Scent Pyramid & Notes Chips
- Olfactory pyramid chips (Top, Heart, Base notes) utilize minimalist bordered pills with dark text against `#F5F0E8` backgrounds.
- Selected state turns solid Luminous Gold with crisp contrasting labeling.

### Checkboxes & Radio Buttons
- Custom square-rounded checkboxes (`0.125rem` radius) and circular radios with delicate 1.5px gold-taupe borders. Active states fill with Luminous Gold containing a dark checkmark.

### Toast & Drawer Notifications
- Slide-in sidecart and sensory announcement banners carry soft parchment surfaces, framed with delicate top and bottom gold rules and quiet charcoal copy.
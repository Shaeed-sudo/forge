# Design Brief

## Direction

Forge — AI-powered no-code website builder delivering production-ready sites from plain-language descriptions in minutes.

## Tone

Bold modern, tech-forward confidence. Dark editorial foundation with vibrant violet intelligence and warm amber speed — precision and clarity over ornamentation.

## Differentiation

Animated progress choreography on wizard steps + staggered site reveals with smooth entrance transitions convey real-time AI generation and instant gratification.

## Color Palette

| Token      | OKLCH              | Role                                   |
| ---------- | ------------------ | -------------------------------------- |
| background | 0.145 0.014 260    | Primary dark surface (charcoal)        |
| foreground | 0.95 0.01 260      | Text on dark (near-white)              |
| card       | 0.18 0.014 260     | Elevated card backgrounds              |
| primary    | 0.65 0.25 300      | Violet: intelligence, wizard progress  |
| accent     | 0.75 0.18 55       | Amber: CTAs, reveals, warmth           |
| muted      | 0.22 0.02 260      | Subtle greys for secondary UI          |
| destructive| 0.55 0.22 25       | Red: danger/delete states              |
| success    | 0.6 0.18 150       | Green: confirmations, validation       |

## Typography

- Display: Space Grotesk — geometric, forward, tech-credible headings and hero text
- Body: General Sans — clean, neutral, maximum readability for UI labels and content
- Mono: Geist Mono — technical references and code
- Scale: hero `text-6xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-4xl font-bold`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Refined shadow hierarchy: `.shadow-subtle` (cards on background), `.shadow-elevated` (modals, popovers). No color glow or bloom — pure geometry and shadow. Structural layering via background tones: background < card < popover.

## Structural Zones

| Zone                | Background             | Border           | Notes                                        |
| ------------------- | ---------------------- | ---------------- | -------------------------------------------- |
| Header/Nav          | `bg-card` elevated     | `border-b-border` | Fixed anchor, active ground                  |
| Content (sections)  | `bg-background`        | —                | Breathing room between major sections        |
| Content (cards)     | `bg-card/50` elevated  | —                | Focal depth, alternate light sections        |
| Footer              | `bg-card`              | `border-t-border` | Visual close, secondary links                |
| Wizard (step divs)  | `bg-muted/20`          | —                | Subtle grouping, no shadow                   |

## Spacing & Rhythm

Section gaps 8rem–10rem (vertical breathing), card padding 1.5rem–2rem, micro-spacing 0.5rem–0.75rem. Tighter inside cards (contained context), looser between sections (visual rhythm).

## Component Patterns

- Buttons: rounded 8px, primary violet with amber on hover for secondary, full-width on mobile; padding `px-6 py-2.5`
- Cards: 8px radius, 1px subtle border, `bg-card/50` with `.shadow-elevated` on hover
- Badges: 20px radius (pill), muted background with foreground text, uppercase label style
- Inputs: 8px radius, 1px border, dark background, focus ring in accent (amber)
- Progress: animated violet bar with smooth fade-in, step dots with stagger timing

## Motion

- Entrance: fade-in 0.4s ease-out for hero elements, staggered slide-up 0.5s for cards
- Wizard progression: step indicator pulse on active, smooth fade between steps
- Site reveals: staggered element entrance (header fade, content slide-up, footer fade) with 100–200ms delays
- Hover: button scale 1.02, card shadow-elevated transition 0.2s
- Decorative: none (speed principle — animation serves interaction, not eye candy)

## Constraints

- No full-page gradients or ambient orbs — preserve clarity and focus
- No rainbow palettes — violet + amber + neutrals only (3 colors)
- Minimum 4.5:1 contrast on all body text — dark backgrounds demand precision
- Mobile-first layout; desktop enhancements via `md:` and `lg:` breakpoints
- No arbitrary colors — all tokens via Tailwind theme (`text-foreground`, `bg-primary`, etc.)

## Signature Detail

Animated wizard progress bar with smooth step transitions and staggered site-reveal elements (entrance choreography) — conveys AI generating in real-time and delivers the speed promise through motion.

# devTimmy Portfolio — Design System MASTER

Generated via ui-ux-pro-max skill · Stack: Next.js 16 + React 19 + Tailwind 4

---

## 1. Design Pattern
- **Pattern:** Portfolio Grid
- **Section Order:** Hero (Name/Role) → Projects (Grid) → About/Philosophy → Contact
- **CTA Placement:** Hero CTAs + Project Card hover + Footer contact
- **Color Strategy:** Deep OLED dark, electric green accent, neutral foreground
- **Conversion Focus:** Visuals first. Work speaks. Fast load essential.

---

## 2. Style
- **Category:** AI-Native UI + Dark Mode (OLED)
- **Mode:** Dark only (primary)
- **Keywords:** terminal, AI tools, ambient, minimal chrome, streaming text, agentic
- **Effects:** fade-up reveal on scroll, streaming text pulse (3-dot), subtle glow on accent, frosted glass cards
- **Performance:** Excellent · **Accessibility:** WCAG AA

---

## 3. Color Tokens

| Token | Hex | CSS Variable |
|---|---|---|
| Background | `#020617` | `--color-background` |
| Primary Surface | `#0F172A` | `--color-primary` |
| Elevated Surface | `#1E293B` | `--color-secondary` |
| Muted Surface | `#1A1E2F` | `--color-muted` |
| Foreground | `#F8FAFC` | `--color-foreground` |
| Foreground Muted | `#94A3B8` | `--color-foreground-muted` |
| Accent (Green) | `#22C55E` | `--color-accent` |
| Accent Alt (Orange) | `#FF7043` | `--color-accent-2` |
| Border | `#334155` | `--color-border` |
| Border Subtle | `rgba(255,255,255,0.06)` | `--color-border-subtle` |
| Destructive | `#EF4444` | `--color-destructive` |
| Ring | `#22C55E` | `--color-ring` |
| Glow | `rgba(34,197,94,0.15)` | `--color-accent-glow` |

---

## 4. Typography

| Role | Font | Weight | Size | Tracking |
|---|---|---|---|---|
| Display / H1 | Inter | 700 | 56–64px | -0.04em |
| H2 | Inter | 600 | 32px | -0.02em |
| H3 | Inter | 600 | 20px | -0.01em |
| Body | Inter | 400 | 16px | 0 |
| Body Small | Inter | 400 | 14px | 0 |
| Label / Badge | Inter | 500 | 11–12px | +0.08em uppercase |
| Code / Terminal | JetBrains Mono | 400 | 13px | 0 |

**Google Fonts:**
```
Inter: 300;400;500;600;700
JetBrains Mono: 400;500
```

---

## 5. Spacing Scale (8dp rhythm)

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-24` | 96px |

---

## 6. Border Radius
- Cards: `12px`
- Buttons: `9999px` (pill)
- Badges/Tags: `6px`
- Inputs: `8px`

---

## 7. Elevation / Shadows
- Card: `0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)`
- Glow Card: `0 0 24px rgba(34,197,94,0.08)`
- Modal: `0 24px 64px rgba(0,0,0,0.8)`

---

## 8. Motion

| Type | Duration | Easing |
|---|---|---|
| Micro (hover, press) | 150ms | ease |
| Reveal (fade-up) | 420ms | cubic-bezier(0.16,1,0.3,1) |
| Page enter | 600ms | cubic-bezier(0.16,1,0.3,1) |
| Exit | 200ms | ease-in |

- `scroll-behavior: smooth` on `html`
- Respect `prefers-reduced-motion`

---

## 9. Icons
- **Library:** Phosphor (`@phosphor-icons/react`)
- **Style:** Regular (outline) for UI; Bold for CTAs and emphasis
- **Size tokens:** `icon-sm=16` `icon-md=20` `icon-base=24` `icon-lg=32`
- **NO emoji as structural icons**

---

## 10. Component Rules
- All interactive elements: `cursor-pointer`, min 44×44px touch area
- Focus ring: `outline: 2px solid var(--color-ring); outline-offset: 2px`
- Disabled: 40% opacity, `pointer-events: none`
- Cards: `border: 1px solid var(--color-border-subtle)` + subtle glass bg
- Inputs: border on focus changes to `--color-accent`

---

## 11. Anti-Patterns (AVOID)
- Heavy chrome or decoration
- Emoji icons in nav/cards
- Hardcoded hex values (use tokens)
- Pure `#000000` backgrounds (use `#020617`)
- No hover/focus states
- Layout shift on load

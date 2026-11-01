# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Closet  
**Generated:** 2026-11-01 (ui-ux-pro-max, adapted)  
**Category:** AI personal stylist · digital wardrobe · mobile-first PWA

> **Brand override:** Closet keeps the established **MD3 green** seed and **Fraunces / Manrope / Vazirmatn** pairing from the product foundation. The ui-ux-pro-max rose/handwritten suggestion was treated as a style _direction_ (bold minimal fashion editorial), not a palette swap.

---

## Global Rules

### Color Palette (source of truth: `apps/web/src/app/styles/tokens.css`)

| Role                 | Hex       | Token                                   |
| -------------------- | --------- | --------------------------------------- |
| Primary              | `#2f6a3a` | `--md-sys-color-primary`                |
| On Primary           | `#ffffff` | `--md-sys-color-on-primary`             |
| Primary container    | `#b6f2b8` | `--md-sys-color-primary-container`      |
| Secondary            | `#516351` | `--md-sys-color-secondary`              |
| Background / Surface | `#f7fbf2` | `--md-sys-color-background` / `surface` |
| On surface           | `#181d18` | `--md-sys-color-on-surface`             |
| On surface variant   | `#414941` | `--md-sys-color-on-surface-variant`     |
| Error                | `#ba1a1a` | `--md-sys-color-error`                  |
| Inverse surface      | `#2d322c` | `--md-sys-color-inverse-surface`        |

**Notes:** High-contrast on-surface text for WCAG AA. Prefer semantic Tailwind tokens (`bg-primary`, `text-on-surface`) — never raw hex in components.

### Typography

- **Display:** Fraunces (opsz optical sizing)
- **Body (LTR):** Manrope
- **Body (RTL / fa-IR):** Vazirmatn
- **Mood:** editorial fashion, calm, confident — exaggerated minimalism via scale & whitespace, not decoration

### Style direction

- **Exaggerated minimalism:** oversized display type, generous negative space, one clear CTA group
- **Mobile-first PWA:** bottom nav ≤3–5, 44×44px targets, safe-area insets, `dvh`/`svh`
- **Motion:** press feedback on pointer-down (`whileTap` / `:active`), 100–160ms; respect `prefers-reduced-motion`

### Spacing / elevation

Use MD3 shape + elevation tokens already mapped in `app.css` (`rounded-md`, `shadow-elevation-*`). Prefer 8px grid (`gap-2`, `p-4`, `pb-28` for bottom nav clearance).

---

## UX checklist (must ship)

- [x] No emoji-as-icons (SVG icons in `shared/ui/icons`)
- [x] Hover gated to `(hover: hover) and (pointer: fine)`
- [x] Focus-visible rings on interactive elements
- [x] `prefers-reduced-motion` respected
- [x] Viewport `viewport-fit=cover` + safe areas
- [x] Cursor pointer on clickable controls
- [x] Min 44×44 touch targets on chips / nav items
- [x] Skip link to main content
- [x] Active nav via React Router `NavLink` (`aria-current="page"`)

---

## Anti-patterns

- Mixing a second palette (rose/gold) into product UI
- Cards in the hero / marketing first viewport unless interaction needs a container
- Hover-only affordances on touch
- `user-scalable=no` / `maximum-scale=1`
- Lazy route discovery for offline PWA (`routeDiscovery` must stay `initial`)

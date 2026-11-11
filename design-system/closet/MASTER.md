# Closet — Material Design 3

The user explicitly requested a complete Material 3 visual and interaction system, implemented without MUI or a Material component kit.

## Foundations

- Source of truth: `apps/web/src/app/styles/tokens.css`.
- Baseline violet light scheme: primary #6750a4, primary container #eaddff, surface #fef7ff, on-surface #1d1b20. Use semantic paired roles throughout.
- Typography: Roboto for English, Vazirmatn for Persian, using Material display, headline, title, body and label roles.
- Shapes: 4/8/12/16/28px plus full rounding. Cards 12px, sheets 28px, chips 8px, buttons full.
- Interactive targets: 48px minimum; navigation 80px with a 64×32 active indicator; FAB 56px.
- Motion: Material standard easing, short press feedback, transform/opacity animations, reduced-motion support.
- State layers: hover 8%, focus/press 10%, ink ripple originating at pointer or keyboard centre. Disabled controls do not ripple. Hover only on fine pointers.

## Product composition

Keep controls close to their content, prioritize Save on outfits, use compact garment grids, searchable closet cards, progressive detail disclosure, clear loading states, sticky sheet titles, and scrollable form bodies. English and Persian remain equal supported experiences. Do not introduce another design system.

## References

- https://m3.material.io/styles/color/the-color-system
- https://m3.material.io/styles/typography/applying-type

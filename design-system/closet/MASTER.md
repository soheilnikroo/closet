# Closet — Material Design 3

The user explicitly requested a complete Material 3 visual and interaction system, implemented without MUI or a Material component kit.

## Foundations

- Source of truth: `apps/web/src/app/styles/tokens.css`.
- Botanical green scheme: primary #20543b, primary container #dcebd6, surface #fafbf7, on-surface #172d22. Use semantic paired roles throughout.
- Typography: Manrope for English display/title, Roboto for English body, Vazirmatn for Persian, using Material display, headline, title, body and label roles.
- Shapes: 4/8/12/16/28px plus full rounding. Cards 24px, sheets 28px, chips fully rounded, buttons full.
- Interactive targets: 48px minimum; navigation 80px with a 64×32 active indicator; FAB 56px.
- Motion: Material standard easing, short press feedback, transform/opacity animations, reduced-motion support.
- State layers: hover 8%, focus/press 10%, ink ripple originating at pointer or keyboard centre. Disabled controls do not ripple. Hover only on fine pointers.

## Product composition

Keep controls close to their content, prioritize collection saving on outfits, use compact garment grids, searchable closet cards, progressive detail disclosure, clear loading states, sticky sheet titles, and scrollable form bodies. English and Persian remain equal supported experiences. Do not introduce another design system.

## References

- https://m3.material.io/styles/color/the-color-system
- https://m3.material.io/styles/typography/applying-type

## Collections and navigation

Like or Save opens a shared collection picker. Only a name is required to create a collection; description, occasion, season and colour stay optional. Creation and outfit saving are atomic and user-scoped. Saved looks retain a server-created snapshot. Collections are available from the Saved navigation destination. React ViewTransition drives native View Transitions for route content and shared collection surfaces, with instant reduced-motion fallbacks. Swipes apply to the garment area, leaving action controls free of drag capture.

## Simplified editorial layout

Use one clear page introduction and generous space around real garment previews. Today shows compact weather and two primary outfit actions; swapping, explanations and previews live under Details. Closet uses unboxed garment tiles and an inline Add action rather than an overlapping FAB. Manual addition has two steps (type, details); season and advanced fields are optional. Discover has one introduction and a secondary disclosure for less common actions. Saved collections show actual outfit garments. Settings groups start collapsed. Keep all existing offline caches, skeletons, touch targets, ripple feedback and reduced-motion support. View-transition layers must not intercept taps.

## Closet brand and continuous surfaces

Use the open-wardrobe/hanger mark next to the wordmark, and the matching generated install assets. App-controlled startup displays the actual web package version with a single door-opening animation; never add a mandatory delay. Garments settle as if placed on a rail; hover and focus subtly lift the garment. All added motion respects reduced motion. Keep page surfaces continuous: avoid wrapping every section in its own bordered card. Search labels stay visible. Shared FAB positioning includes navigation height, a 20px gap and safe-area insets. See `docs/closet-brand/README.md` for implementation and validation limits.

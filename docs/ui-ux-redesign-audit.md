# Closet UI/UX redesign audit — 11 November 2026

Reviewed the running local app using mock authentication and the existing sample wardrobe. This is an implementation review, not a user study or a complete accessibility certification.

## Journey and findings

1. **Today — improved.** Weather and repeated actions competed with the outfit. Replaced the large weather card with an expandable summary, enlarged the garment canvas, and kept Save / Not for me visible. Explanation, swap, preview and regeneration remain under Details. [Before](ui-ux-redesign/01-today-before.png) · [After](ui-ux-redesign/01-today-after.png)
2. **Closet — improved.** Boxed metadata and the floating Add button crowded the garments. Simplified tiles, compact search, consistent filters, and an inline Add action now keep content unobstructed. [Before](ui-ux-redesign/02-closet-before.png) · [After](ui-ux-redesign/02-closet-after.png)
3. **Add clothing — improved.** Four steps made optional season information feel mandatory. The manual flow now has two steps: type, then colour/name. Season and advanced fields are optional disclosures. Save becomes available after the required details. [Before](ui-ux-redesign/03-add-before.png) · [After](ui-ux-redesign/03-add-after.png)
4. **Discover — improved.** Repeated introductions and equal-weight card actions obscured the next step. One introduction, larger previews and one main card action create a clearer hierarchy. [Before](ui-ux-redesign/04-discover-before.png) · [After](ui-ux-redesign/04-discover-after.png)
5. **Saved — improved.** Initial-only covers gave little visual recognition. Collections now preview garments from their actual first saved outfit, with an empty fallback. The existing collection picker and optional creation fields remain. [Before](ui-ux-redesign/05-saved-before.png) · [After](ui-ux-redesign/05-saved-after.png) · [Picker](ui-ux-redesign/07-save-after.png)
6. **You/settings — improved.** Expanded forms made the page feel overwhelming. Everyday preferences, style/fit, body-preview options and demo tools are separate collapsed groups. [Before](ui-ux-redesign/06-settings-before.png) · [After](ui-ux-redesign/06-settings-after.png)

## Shared system

Custom Material 3 foundations retained without MUI: botanical primary, warm pale surfaces, rounded white controls, Manrope display hierarchy, Roboto body and Vazirmatn Persian. Existing ripples, 48px targets, keyboard controls, skeleton loading and offline data mechanisms remain. Removed duplicate header controls and reduced entrance animation blank states. View-transition overlays no longer intercept pointer input.

## Verification

- `pnpm check`: passed formatting, lint, type checks, tests and dependency checks. Existing non-failing lint/Knip advisory warnings remain.
- 147 tests passed: 20 shared, 74 API, 53 web.
- `pnpm build`: passed; generated service worker includes 53 precached files, about 1131 KiB uncompressed.
- `pnpm --filter @closet/web pwa:audit`: passed; JavaScript gzip total 309.2 KiB.
- Browser review: core destinations, manual add steps, collection picker, optional settings, mock welcome, English and Persian RTL. 320px viewport had equal document and viewport widths (no page overflow); desktop composition also inspected.
- [Narrow mobile](ui-ux-redesign/10-narrow-after.png) · [Desktop](ui-ux-redesign/11-desktop-after.png) · [Welcome](ui-ux-redesign/08-welcome-after.png) · [Persian](ui-ux-redesign/09-persian-after.png)

## Limits

Real Clerk sign-in was not exercised because this preview uses mock authentication. Weather/city/provider text and existing sample garment names can remain English in Persian; user-authored content is not automatically translated. The Persian screenshot predates the final style-label translation fallback. No new field Web Vitals measurements were taken in this visual redesign pass; asset audit results are not a claim of performance under every device/network condition. Existing offline regression tests passed; see the separate PWA performance report for earlier runtime measurements. Live device gesture and assistive-technology testing remain useful follow-up validation.

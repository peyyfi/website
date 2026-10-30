# Option 2: Right at home

final result: passed

## Evidence and normalization

- Source visual truth: `/Users/earhin/.codex/generated_images/01a1695a-128d-78a2-8ef0-13ac6b3a35a0/exec-fc944c92-b8cd-468e-8455-fdc49ebaf5d6.png` (the second displayed option).
- Implementation URL: `http://localhost:3100/#right-at-home`.
- Evidence folder: `/Users/earhin/.codex/visualizations/2026/10/23/01a1695a-128d-78a2-8ef0-13ac6b3a35a0/option-2/`.
- Desktop implementation screenshot: `desktop.png`, 1440 × 960 pixels. A 1440 × 960 CSS iframe displays the real page at the section anchor; the screenshot excludes browser chrome. Output density is 1 pixel per CSS pixel.
- Mobile implementation screenshot: `mobile.png`, 390 × 900 pixels from a 390 × 900 CSS iframe, clipped to its viewport without surrounding browser canvas. Narrow native browser viewport (319 CSS px) also inspected.
- Source: 1536 × 1024 pixels; proportionally downsampled to 1440 × 960 for comparison, without stretching or cropping.
- State: light theme, loaded phone image, splash dismissed, waitlist empty, section at top of viewport.
- Full-view comparison: `comparison.png` (2880 × 960), source left and implementation right in the same image; opened and visually reviewed.
- Focused phone comparison: `phone-comparison.png` (740 × 600), matching 370 × 600 regions from both normalized artifacts; opened and visually reviewed for device edges, blank tiles, branding and image quality.

## Findings

No actionable P0/P1/P2 visual findings remain. The centered section, complete frontal phone, four-column blank app grid, sole colored Peyyfi icon, divider, waitlist link and availability copy follow the selected composition. The section is integrated between the existing hero and product details.

### Required fidelity surfaces

- **Fonts and typography:** The existing Space Grotesk family, black semibold display heading, tracking, muted description and small uppercase eyebrow preserve the reference hierarchy. Desktop heading stays on one line; narrow mobile copy wraps cleanly. The implemented heading is slightly smaller than the generated reference (P3).
- **Spacing and layout rhythm:** Center alignment and phone scale closely follow the normalized reference. Desktop footer divider sits roughly 10 px lower; acceptable P3 variation from the regenerated raster's proportions. Mobile uses the same hierarchy with a smaller phone and full-width content spacing. No horizontal page overflow at the tested narrow width.
- **Colors and tokens:** Existing cool gray canvas, black heading and muted copy are retained. Small orange text uses the site's darker brand-text token for readable contrast. This intentional accessibility adaptation is accepted. The raster's peach halo is subtler than the source (P3); no CSS drawing was substituted for the image.
- **Image quality and asset fidelity:** A real transparent PNG supplies the entire phone composition. The current supplied app logo guided generation. The focused comparison confirms a recognizable orange Peyyfi icon and label, blank surrounding tiles, complete device edges and no other app branding. The regenerated device has small bezel, tile and wallpaper variations; accepted within the selected art direction. Intrinsic dimensions and responsive image sizing preserve aspect ratio and reserve layout space.
- **Copy and content:** Eyebrow, heading, description, CTA and “iOS & Android · Coming soon” match the selected design. Text outside the phone remains semantic HTML. Image alt text describes the phone and Peyyfi icon.

## Interaction iteration and validation

1. Initial native fragment navigation scrolled correctly but reset focus away from the email input. This was a P2 keyboard/conversion affordance finding.
2. Updated the link to prevent native fragment navigation for ordinary activation, scroll to the stable form wrapper, then focus the email input. Modified-link navigation retains ordinary browser behavior; the href remains a usable no-JavaScript fallback.
3. Rebuilt, restarted and reloaded the production preview. Browser activation now reports `document.activeElement.id === "waitlist-email"`, with the input visible near the top. The final screenshots reflect this build. No visual layout changes followed the full-view comparison.
4. Checked browser warning/error logs: empty. `pnpm lint` and `pnpm build` passed, including TypeScript.

Existing form submission was not exercised with a real signup; this change adds no submission API behavior. Mobile CTA layout was visually checked, and the link interaction was tested in the narrow native browser viewport.

## Implementation checklist

- [x] Approved option resolved by displayed order.
- [x] Current logo and generated transparent phone asset placed in the page.
- [x] Responsive section with accessible HTML copy and descriptive image alt text.
- [x] Waitlist link scrolls and focuses the email field.
- [x] Desktop, mobile and focused source/implementation comparisons reviewed.
- [x] Lint, production build and browser console checks passed.
- [x] Local preview remains running for review.

## Follow-up polish

Optional P3 refinements: increase peach-halo visibility and tune the heading size by a few pixels if closer raster-level matching is desired. No open implementation questions or blocking findings.


# Orange dotted waitlist hero — 2026-10-30

The final user direction removes all right-side artwork. The hero now centers the existing headline, description and waitlist form over orange with fine static dots and a soft fade into the page. The header uses the existing original white/peach logo asset. The earlier wallet/card illustration is removed, including its unused component and styles.

Evidence directory: /Users/earhin/.codex/visualizations/2026/10/30/01a18b6e-de5a-76d1-8cf9-151a4a334a91/space-qa/card-variants-waitlist

- `waitlist-clean-desktop.jpg`: actual production build at 1440 × 1000 CSS/pixels, DPR 1, top of page, empty form, entrance complete.
- `waitlist-clean-mobile.jpg`: 390 × 900 CSS/pixels, DPR 1, same state. Both widths have matching document/viewport widths and no horizontal overflow; the hero contains zero figures.
- Baseline `waitlist-before-desktop.jpg` and final screenshot were inspected for the deliberate orange treatment, graphic removal and retained copy/form. Typography remains the existing Space Grotesk. Form controls, logo geometry, small labels, feature row, dot density and fade were checked at desktop/mobile widths.
- Invalid empty submission shows the expected message and focuses the contact input without an API request. This was checked against the production build. The form implementation/API were not edited.
- `npm run lint`, `npm run build`, `git diff --check`: passed. Existing offline test suite: 25 passed. The dots are three static SVG paths; no background image, animation loop or dependency was added.
- The browser harness recorded a MutationObserver error without a source URL. An app-source scan found no MutationObserver usage; its origin remains unverified. Form validation and visible page navigation completed successfully. Physical mobile devices were not checked.
- Preview is local at http://127.0.0.1:3001/; no deployment was performed.

final result: passed (visual/layout and existing form validation)

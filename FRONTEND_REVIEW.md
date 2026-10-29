# Frontend review

## Completed checks

- TypeScript and Vite production build.
- ESLint: zero errors and zero warnings after fixes.
- Browser visual inspection of the desktop homepage at 1440px and mobile homepage at 360px.
- 360px checkout: no horizontal page overflow.
- 768px catalogue: no horizontal page overflow.
- 1440px public-route smoke review: catalogue, product, empty cart, artisan directory/profile, village, contact, all policy pages, account, and 404 rendered headings without horizontal overflow.
- Browser shopping flow: one-of-a-kind product → cart → sign-in redirect → preserved cart → sample address → COD checkout → confirmation; cart cleared and stock deducted.
- Browser catalogue search narrowed the collection to one matching product.
- Browser admin product editor: focus moved inside dialog, edited name saved, dialog closed, and persisted product data reflected the edit.
- Browser order operation: Placed → Confirmed saved with status history; payment remained separate.
- All homepage images loaded in browser. Editorial photos have linked attribution. No console errors/warnings were found in the reviewed browser session.

## Refinements made

- Replaced editorial placeholders with licensed Raghurajpur photographs.
- Adjusted the narrow-screen hero so shopping and editorial actions do not overlap.
- Added Radix modal focus trapping and Escape dismissal.
- Enforced shared stock across variant cart lines and validation at demo checkout.
- Retained gallery metadata and cover selection on product edits.
- Separated saved addresses by demo account.
- Added an immediate submission lock and UUID order references.
- Removed a conditional form hook and used useWatch for PIN eligibility.
- Lazy-loaded administration and commerce code.
- Formatted source for review and maintenance.

## Scope of verification

This is manual browser QA, not exhaustive automated coverage or an accessibility certification. Focus visibility, semantic labels, modal focus management, responsive layout, and reduced-motion support are implemented. Full keyboard-only traversal, assistive-technology testing, every admin action, every simulated failure path, and all dark-theme combinations have not been exhaustively tested.

The demo remains subject to frontend approval. Production data security, integrations, concurrency, durable jobs, server authorization, and real inventory transactions have intentionally not been built.

## Video and photography revision

- Replaced the split hero with a full-width owner-supplied film and readable overlay actions.
- Added staggered photographic craft cards, a making banner, a two-panel devotional feature, and a photo journal.
- Served the new craft media locally and replaced unrelated demo product image placeholders.
- Created a mobile encode (~2.4 MB) and a still poster; desktop uses a full-HD encode.
- Browser verified: desktop playback with readyState 4; pause control changes both media state and accessible label; scrolling the hero out of view pauses playback.
- Browser verified: 360px selects the mobile MP4 source and renders without page overflow. Tablet 768px and desktop 1440px also render without overflow.
- Browser visual inspection: desktop hero and craft-card layout, mobile hero. All 14 homepage image elements loaded successfully in the reviewed session.
- Reduced-motion preference disables automatic playback in implementation; manual play remains available. No audio track is present in the supplied video.
- Production build and lint pass. Existing Zod dependency annotation warnings are non-blocking build output.

## Full-width and fixed-background banners

Making and editorial image banners now span the complete viewport width, including ultrawide screens. Desktop photographic backgrounds use fixed attachment for a parallax scroll effect. Touch/mobile and reduced-motion settings retain static images. Browser checks confirmed the making banner is 1440px wide at a 1440px viewport with fixed attachment, and 360px wide at a 360px viewport with scroll attachment. Neither check showed horizontal page overflow. Build and lint pass.

Alternating editorial revision: checked desktop image/text alternation and visually inspected the new high-resolution Jagannath artwork with upright orientation and complete framing. At 360px the devotional panels stack and no horizontal overflow is present. Source image loaded at its original 2228px width. Build and lint pass.

## Artisan image cards and mandala background

Added reusable craft-reference image panels to homepage artisan cards and the artisan directory. Images remain explicitly illustrative and are not attributed as portraits of fictional profiles. Added a locally generated decorative SVG mandala as a faint site backdrop and oversized section-corner impressions. The decoration is noninteractive and does not enter the accessibility tree. Visually checked desktop cards and verified all three images load; 360px check shows no horizontal overflow. Build and lint pass.

## Ornate rotating mandalas

Replaced the sparse mandala vector with original concentric floral, scalloped, dotted, and curled ornament inspired by the supplied reference. Every homepage section now has two large gold corner mandalas, including video and photographic banners. Rotation is slow (150/180 seconds in opposite directions); reduced-motion disables it. Decorative layers ignore pointer events and are clipped to their sections. Browser inspection confirmed all nine homepage sections have the mandala animation, with no desktop or 360px page overflow. Build and lint pass.

Added two reusable full-width editorial banners: a Pattachitra collection feature after featured products, and a village-story feature after the photo journal. Both retain rotating corner mandalas, desktop fixed-background parallax, static mobile/reduced-motion backgrounds, linked calls to action, and photo credits. Browser width checks: both banners span 1440px desktop and 360px mobile with no page overflow. Build and lint pass.

Handmade note refinement: lotus ornaments now flank the text on the left and right, with a subtle woven diamond and dot background pattern using semantic gold/paper tokens. Checked desktop and 360px grid layouts; no horizontal page overflow.

## Cosmic heritage entry and rendering optimization

Added a dedicated star-field welcome screen with gold rotating mandala, brand introduction, and keyboard-accessible Enter the site button. Storefront components and media do not mount until entry; the reveal crossfades without an artificial loading delay. Welcome appears on a fresh page load; normal SPA navigation does not replay it, and direct admin URLs bypass it.

Lazy-loaded Home, Shop, and editorial route modules in addition to existing commerce/admin chunks. Initial production JavaScript decreased from approximately 381 KB / 122 KB gzip to 306 KB / 98 KB gzip (about 20% less initial JS). Route chunks load on demand; this is a bundle measurement, not a real-device frame-rate benchmark.

Added IntersectionObserver-based pausing of offscreen section mandalas, removed permanent will-change promotion, and set lazy photo decoding to async. No per-scroll React state or animation-frame rendering loop is used. Existing video offscreen/hidden-tab pausing remains in place.

Browser verified welcome display, no mounted video before entry, working reveal, restored page scrolling, mobile entry button visibility, and no 360px page overflow. Confirmed offscreen mandalas report paused animation state. Reduced-motion uses a still ornament and immediate reveal. Build and lint pass.

Welcome palette refinement: switched the entry screen to the store's semantic ivory, maroon, terracotta, and muted gold tokens; added fine heritage borders and a stationary Jagannath-inspired brand motif, separate from rotating mandalas. Mobile visual inspection confirms entry action remains visible and no horizontal overflow. Motif itself has no animation. Build and lint pass.

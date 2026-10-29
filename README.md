# Raghurajpur Heritage

A React + TypeScript storefront and administration frontend. **Frontend review stage only. No backend or live business integrations are implemented.**

## Run

Use Node 22.12+ (or a supported newer LTS release).

```sh
npm ci
npm run dev
```

Open the URL Vite prints (normally http://localhost:5173).

```sh
npm run build
npm run lint
```

The lockfile records the installed dependency versions. Vite builds a static SPA into `dist/`; a future static host must rewrite application routes to `index.html`.

## Review the demo

- `/`: editorial storefront, craft categories, featured collection, village, cultural context, artisan spotlight.
- `/shop`: search, category/artisan/price/stock filters, sorting, pagination, mobile filter panel. Open **Demo state preview** in the filter panel to inspect loading/error/empty states.
- `/product/1`: variant selection, quantity, shared inventory, gallery, zoom, related products.
- `/product/3`: one-of-a-kind stock example. `/product/8`: out-of-stock example.
- `/cart` → `/checkout`: signed-out customers are redirected to demo sign-in with the cart preserved. Use any sample email and made-up password of at least eight characters.
- Checkout accepts a 10-digit mobile starting with 6–9 and a six-digit PIN starting with 1–9. The test address helper and failure simulation are inside **Demo testing options**. Shipping and COD eligibility follow admin settings.
- Orders are saved locally, deduct demo stock, and preserve purchase prices and delivery snapshots. Confirmation, account history, tracking, status history, and cancellation requests are interactive.
- `/admin`: click **Enter demo administrator workspace**. This is a session-only frontend gate, not secure authentication. Product create/edit/archive/publish, media preview and cover ordering, order status transitions, tracking, notes, COD state, simulated Sheets retry, customer suspension, editorial drafts, artisan profiles, categories, shipping, and COD settings are available.
- `/artisans`, `/village`, `/crafts`, `/about`, `/contact`, policy routes, and an unknown route demonstrate supporting experiences.
- Admin **Content & settings → Reset demo** clears locally saved state.

## Design and structure

- Change `BRAND` in `src/lib/domain.ts` to rename the store.
- Semantic light/dark tokens, typography, breakpoints, reduced-motion rules, and component styles are in `src/styles.css`. Tailwind v4 is configured with Vite.
- `src/components/ui/button.tsx` follows the customized shadcn/ui Slot + CVA button pattern. Dialogs use Radix for focus management and Escape dismissal.
- `src/lib/domain.ts`: typed domain records, integer-paise prices, demo seeds.
- `src/lib/store.tsx`: browser-local mock state; addresses are separated by demo email.
- `src/services/`: catalogue mock adapter and service contracts for the approval-gated backend stage.
- `src/pages/`: storefront, commerce, editorial, and lazy-loaded administration modules.
- TanStack Query supplies catalogue loading/refetch state. React Hook Form + Zod validate checkout.

## Media and editorial sources

Editorial photography is licensed, with visible footer attribution and crop notices:

- [Raghurajpur 10.jpg — Rangan Datta Wiki](https://commons.wikimedia.org/wiki/File:Raghurajpur_10.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Cropped and darkened for the hero. No endorsement implied.
- [Raghurajpur – Decorated Village House — Sumit Surai](https://commons.wikimedia.org/wiki/File:Raghurajpur_-_Decorated_Village_House.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Cropped for layout. No endorsement implied.
- [Incredible India village context](https://www.incredibleindia.gov.in/en/rural-tourism/raghurajpur): reference for location and craft-family context. Longer editorial copy awaits research and owner review.
- Product/category imagery is explicitly illustrative craft reference photography, not photographs of inventory. All product and artisan records are fictional. Artisan monograms stand in for consented portraits.

External fonts require internet access; new homepage media is served locally. Replace placeholders with owner-approved product photography before production.

## Remaining frontend/demo boundaries

- Auth, account suspension, admin access, stock updates, and orders are browser-local simulations; no security guarantees or real orders.
- No Supabase, Drive, Sheets, email, courier API, payment, or synchronization worker is connected. Retry states never imply a real sync succeeded.
- Cancellation requests await admin review. Cancellation/returns do not automatically restock demo inventory. Backend transactional inventory and idempotent restocking await approval.
- Local image previews use data URLs. Browser local-storage quotas limit media volume; this is not a production media system. Upload progress/failure messages represent local preview processing.
- Optional size variants share price and stock in this demo; that behavior is explicit on the product page.
- Category additions and artisan text edits work; portrait uploads, category renaming/reassignment, and full editorial scheduling are not implemented.
- Business contact details, approved policies, delivery timeframes, actual artisan stories and product specifications require owner confirmation.

See `FRONTEND_REVIEW.md` for checks and observations. Stop here for explicit frontend approval before backend work.

## Media-rich homepage revision

The homepage uses the owner-supplied `hero_art.mp4` as a full-width muted, looping film. Local web copies are `public/media/hero-art.mp4` (1080p) and `hero-art-mobile.mp4` (960px, selected below 768px), with a JPEG poster extracted from the supplied film. Autoplay is disabled for reduced-motion preference; a visible playback control is always available. Video pauses when offscreen or the tab is hidden. Media failure leaves the poster visible.

Craft categories, demo products, the making banner, devotion section, and photo journal now use locally served craft reference photographs. These are illustrations of the craft families, not the actual fictional inventory or fictional artisan portraits. New source credits (also visible in the homepage Photography & film credits panel):

- [Artist at work — Sumit Surai](https://commons.wikimedia.org/wiki/File:Raghurajpur_Artist.JPG), CC BY-SA 4.0.
- [Pattachitra studio — Rangan Datta Wiki](https://commons.wikimedia.org/wiki/File:Raghurajpur_7.jpg), CC BY-SA 4.0.
- [Palm leaf craft — Manoj Choudhury](https://commons.wikimedia.org/wiki/File:Odia_Palm_leaf_manuscipt.JPG), CC BY-SA 3.0.
- [Wooden toys — Swetapadma07](https://commons.wikimedia.org/wiki/File:Wooden_toys_of_Raghurajpur.jpg), CC BY-SA 3.0.

Photos are cropped using CSS to fit each composition. Author attribution and source/license links remain visible. Source photography is not licensed as application source code; its respective CC BY-SA licenses continue to apply. Video rights remain with its provider.

The alternating devotional panel now uses [Pattachitra of Jagannath by Patrick.zip](https://commons.wikimedia.org/wiki/File:Pattachitra_of_Jagannath.jpg), 2228 × 3772 source pixels, under [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Display orientation is corrected with CSS; the full artwork is preserved without cropping the deities. Village panel: image left/text right. Devotional panel: text left/image right. Mobile stacks the devotional text before the artwork.

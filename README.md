# Dicky — Personal Portfolio

React 18 + TypeScript + Vite + Tailwind CSS 3 + Framer Motion + Lucide React.

## Run locally

Node.js 22 recommended.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

```sh
npm run build
npm run preview
```

The static production files are in `dist/`. Relative asset paths support subfolder hosting. Deployment is not configured or performed.

## Content and design

- All biography, contact details and four projects come from the supplied CV.
- Project descriptions are cross-checked against the supplied repositories and public demos.
- PancoKuy is in development: the current progress document and source supersede the stale README. Auth uses Supabase; basecamp, events and athlete profile have implementations, while WP matching remains planned. No production-ready claim is made.
- Nabungin and ZliritDO use screenshots captured from the public demos. Desa Bendung uses the public portal screenshot from its repository. PancoKuy uses a clearly labeled development summary, not a fabricated screenshot.
- Each card links to its repository. Live demo buttons are included only for the two URLs provided by the owner.
- The latest user-provided avatar is used directly, unchanged, in `public/portrait-original.jpg`. Telegram delivered a JPEG; no conversion or background removal is applied to the active image.
- CV download: `public/M-Dicky-Andrean-CV.pdf`.
- Edit copy/projects in `src/App.tsx`; visual styles in `src/styles.css`.
- Animations: scroll-reactive marquee, hero parallax, magnetic pointer effect, character reveal, section fade-ins, sticky project scaling, scroll progress. Reduced-motion preferences disable movement and sticky stacking.
- Google Fonts loads Kanit; sans-serif is the offline fallback. All other visual assets are local.

## Browser checks

```sh
npx playwright install chromium
# With the dev server running:
node scripts/browser-check.mjs
# Or test the production preview:
TEST_URL=http://127.0.0.1:4173 node scripts/browser-check.mjs
```

Checks cover desktop (1440x900), tablet (768x1024), mobile (390x844), small mobile (320x640), JavaScript errors, horizontal overflow, local portrait, section navigation, four project cards, CV download and reduced-motion mode. Screenshots and results are generated in ignored `.browser-tests/`.

## Dependency audit

At implementation time, `npm audit --omit=dev` reported no production vulnerabilities. The complete audit reported 7 findings (5 high, 2 moderate) in the Tailwind 3 development dependency chain (braces / selector parsing and dependants). The suggested upgrade is Tailwind 4, which differs from the requested Tailwind 3 stack. These are not shipped in the static client bundle. Do not expose the dev server publicly or process untrusted build inputs; review/migrate before any public development-server use.

Vite may report ignored `use client` directives from Framer Motion; this is a client-only SPA and the production build succeeds.

## Optional portrait preparation

Existing public assets are ready; Python is not required to build the website. To regenerate the transparent avatar, use Python with Pillow and run `scripts/prepare-assets.py <path-to-original-photo>`.

# Landing Pages Master Blueprint (30 Pages)

This document explains exactly how the 30 landing pages are built in this project so you can recreate the same structure and design on another website.

## 1) Total pages and grouping

There are **30 landing pages** in total:

- **23 extended keyword pages** (data-driven, shared renderer)
- **7 legacy-style pages** (each has a dedicated style component)

### 23 extended keyword routes

These routes are driven by `extendedLandings` in `app/data/extendedKeywordLandings.ts`:

`/123movies`, `/gostream`, `/putlocker`, `/bflix`, `/netfree`, `/filmyhit`, `/5movierulz`, `/7starhd`, `/hdmovie2`, `/ssrmovies`, `/9xmovies`, `/kuttymovies`, `/sflix`, `/9xflix`, `/prmovies`, `/filmy4web`, `/goojara`, `/bolly4u`, `/moviesda`, `/filmy4wap`, `/mp4moviez`, `/ibomma`, `/fzmovies`

### 7 legacy routes

These are separate page/style implementations:

`/fmovies`, `/gomovies`, `/hurawatch`, `/lookmovie`, `/popcornflix`, `/soap2day`, `/solarmovie`, `/yesmovies`

> Note: sitemap route includes 8 legacy slugs as configured in `app/api/sitemap-landingpages/route.ts`.

## 2) Core architecture pattern

## a) Route file pattern (each page)

Each landing route page follows this structure:

1. `generateMetadata()` for title, description, keywords, canonical, OG
2. Load config (either from `extendedLandings[slug]` or local constants)
3. Render landing component with:
   - `keyword`
   - `description`
   - `colorTheme`
   - `content`

Example files:

- `app/123movies/page.tsx` (extended route pattern)
- `app/hurawatch/page.tsx` (legacy dedicated style pattern)

## b) Shared data model (extended pages)

In `app/data/extendedKeywordLandings.ts`, each route has:

- `keyword`
- `description`
- `metaTitle`
- `metaDescription`
- `keywords`
- `preset` (visual style family)
- `colorTheme`
- `content`:
  - `heading`
  - `intro[]`
  - `sections[]` with `title` + `paragraphs[]`

Types are defined in `app/components/keyword-landings/types.ts`.

## c) Shared renderer for 23 extended pages

`app/components/keyword-landings/OfficialBrandStyleLanding.tsx` is the central renderer.

It switches on `preset` and outputs the matching visual family:

- dark/light background
- hero composition
- CTA styles
- search pill variant
- article card styles
- footer style

This gives unique brand feel per route while preserving one data model.

## 3) Component system used by landing pages

## a) Main extended renderer

- `OfficialBrandStyleLanding.tsx`
  - defines `OfficialStylePreset` union
  - has reusable inner blocks:
    - `ArticleBody` for long-form content
    - `ShareRow` for social chips
  - handles all 23 presets in one file

## b) Reusable utilities inside keyword landing system

- `SearchLinkPill.tsx`
  - search UI chip, variants (`default`, `light`, `soft`)
  - usually links users into site search/navigation flow
- `LandingMovieThumbnails.tsx`
  - optional poster grid strip (used in some presets like GoStream)

## c) Legacy-specific style components (separate files)

- `FmoviesStyleLanding.tsx`
- `GomoviesStyleLanding.tsx`
- `HurawatchStyleLanding.tsx`
- `LookmovieStyleLanding.tsx`
- `PopcornflixStyleLanding.tsx`
- `Soap2dayStyleLanding.tsx`
- `SolarmovieStyleLanding.tsx`
- `YesmoviesStyleLanding.tsx`

These are custom layouts to mimic each legacy reference style more closely.

## 4) Design structure used across pages

Even with different visuals, most pages follow the same section order:

1. **Hero block**
   - keyword as main H1
   - short description/tagline
   - search input area
   - CTA button(s)

2. **Social/share or quick-link strip** (on styles that use it)

3. **Long-form content article**
   - heading
   - intro paragraphs
   - 4 topic sections
   - optional FAQ/summary/table blocks (legacy styles)

4. **Footer**
   - brand label
   - quick links or legal info

This consistent structure is why all pages feel related while still looking visually different.

## 5) Style/preset mapping for extended pages

From `extendedLandings.ts`, each slug maps to a preset (which decides visual style in `OfficialBrandStyleLanding.tsx`):

- `123movies` -> `m123`
- `gostream` -> `gostream`
- `putlocker` -> `putlocker`
- `bflix` -> `bflix`
- `netfree` -> `netfree`
- `filmyhit` -> `filmyhit`
- `5movierulz` -> `movierulz5`
- `7starhd` -> `sevenstarhd`
- `hdmovie2` -> `hdmovie2`
- `ssrmovies` -> `ssrmovies`
- `9xmovies` -> `nine-x-movies`
- `kuttymovies` -> `kuttymovies`
- `sflix` -> `sflix`
- `9xflix` -> `nine-x-flix`
- `prmovies` -> `prmovies`
- `filmy4web` -> `filmy4web`
- `goojara` -> `goojara`
- `bolly4u` -> `bolly4u`
- `moviesda` -> `moviesda`
- `filmy4wap` -> `filmy4wap`
- `mp4moviez` -> `mp4moviez`
- `ibomma` -> `ibomma`
- `fzmovies` -> `fzmovies`

## 6) SEO and metadata structure (all landing pages)

Each route should expose:

- `title`
- `description`
- `keywords`
- `alternates.canonical`
- `openGraph` (`title`, `description`, `type`, `url`)

In extended routes this is generated from `extendedLandings[slug]` plus canonical base from `getCanonicalBase()`.

Sitemap for landing pages is generated in:

- `app/api/sitemap-landingpages/route.ts`

It merges:

- all keys from `extendedLandings`
- all legacy slug constants

## 7) Branding integration in Navbar/logo

File: `app/lib/keywordNavBranding.ts`

Purpose:

- detect if current path is one of extended landing routes
- derive logo split (first/second part)
- apply keyword-specific color as brand accent
- expose tagline and icon styles to navbar layer

So each landing can show route-specific branding without hardcoding every header manually.

## 8) Header, logo, navbar, hero, footer (full UI anatomy)

This section explains exactly `header/logo` behavior you asked.

## a) Global header / navbar behavior

- Landing pages use the **site-level global Navbar** (App layout header).
- In most landing components, top duplicate header is intentionally avoided (comments in components also indicate this).
- So clone rule: keep one global navbar only, do not add second sticky header inside every landing.

## b) Logo system (dynamic per route)

Source: `app/lib/keywordNavBranding.ts`

How it works:

- Pathname slug is detected (`/123movies`, `/gostream`, etc.).
- Matching config is fetched from `extendedLandings`.
- Route-specific logo split is generated by `SLUG_SPLITS` map.
  - Example:
    - `123movies` -> `123` + `MOVIES`
    - `9xflix` -> `9X` + `FLIX`
    - `ibomma` -> `I` + `BOMMA`
- `firstStyle` and `secondStyle` are assigned:
  - first part often accent color (`primary`)
  - second part usually white
- icon background and tagline color also come from this branding object.

So logo is not a static image; it is route-aware wordmark styling.

## c) Hero block anatomy (shared pattern)

Most landing pages follow this hero stack:

1. keyword/logo heading (`h1`)
2. 1-line description/tagline
3. search bar/pill
4. primary CTA (`/movies` or `/home`)
5. optional secondary CTA (`/series`)
6. optional social/share row

Design details vary by preset (dark/light, rounded/square, chip/button shape), but hierarchy is consistent.

## d) Search bar placement and style

- Always near top hero (above fold).
- Reusable search atom: `SearchLinkPill`.
- Variants used:
  - `default` (dark style pages)
  - `light` (light backgrounds)
  - `soft` (pastel/soft themes)
- In some legacy pages, custom search bar is manually drawn to match screenshot style.

## e) CTA buttons style behavior

Common CTA destinations:

- `/home`
- `/movies`
- `/series`
- `/search`

Style logic:

- Primary CTA uses route `primary`/accent color.
- Secondary CTA is usually border/ghost.
- On darker themes, primary is bright (amber/cyan/green/pink) for contrast.

## f) Footer structure

Two footer patterns are used:

1. **Simple informational footer**
   - brand label + copyright
2. **Expanded footer**
   - quick links, browse links, legal text

Legacy pages (e.g. fmovies/lookmovie/hurawatch) include heavier footer/link blocks to match references.

## g) Preset-wise header/logo/hero style summary (23 extended)

- `m123`: black background, green accent, rounded CTA, compact logo feel (`123MOVIES`)
- `gostream`: light layout, centered heading, thumbnail strip, light search pill
- `putlocker`: dark navy, minimal uppercase micro-label, single strong CTA
- `bflix`: dark + magenta highlight, share chips, neon-ish emphasis
- `netfree`: deep purple gradient, soft rounded controls
- `filmyhit`: warm cream background, orange accent, regional-style vibe
- `movierulz5`: dark with gold/teal strip, strong contrast labels
- `sevenstarhd`: black + teal HD badge style
- `hdmovie2`: slate/cyan technical look
- `ssrmovies`: red-dark Bollywood style
- `nine-x-movies`: black/amber dual-audio style language
- `kuttymovies`: purple Tamil-centric feel
- `sflix`: dark magenta tone for series focus
- `nine-x-flix`: slate + teal genre-hopping style
- `prmovies`: clean orange-cream bilingual style
- `filmy4web`: rose light web-streaming look
- `goojara`: green-dark long-catalog style
- `bolly4u`: red-dark Bollywood theme
- `moviesda`: cyan-dark mobile-first Tamil style
- `filmy4wap`: pink light mobile web style
- `mp4moviez`: neutral-dark lime accents, format-focused
- `ibomma`: green Telugu identity + Tollywood label
- `fzmovies`: blue gradient international/global style

## h) Legacy header/logo differences (exact-match styled pages)

Legacy pages are separate components because they need screenshot-like custom top sections:

- `HurawatchStyleLanding`:
  - black/gold/cyan palette
  - “official” heading line
  - custom search bar with gold action button
  - TOC + tables + numbered sections
- `FmoviesStyleLanding`:
  - dark magenta vibe
  - floating social rail
  - heavy hero with share chips + CTA
- `LookmovieStyleLanding`:
  - dark compact header style
  - keyword badge treatment
  - year chips + quick toggles

Other legacy styles (`gomovies`, `popcornflix`, `soap2day`, `solarmovie`, `yesmovies`) follow same principle: custom hero/footer treatment to match their target visual identity.

## i) Same-to-same cloning checklist for header/logo specifically

If you recreate on another site, keep these exact rules:

1. One global navbar only.
2. Route-based dynamic logo split (not one static logo).
3. Hero order fixed: H1 -> description -> search -> CTA -> optional social.
4. CTA links same destination pattern.
5. Footer style chosen per preset/legacy family.
6. Use the same color token per slug (`primary`, `accent`) for logo + CTA + focus states.

## 9) Search and navigation behavior used by landing templates

Landing templates generally do one of these:

- Use `SearchLinkPill` and route into global search/home flow
- Or (older variants/components) run local movie search and push to movie detail URLs

Primary navigational CTAs used:

- `/home`
- `/movies`
- `/series`
- `/search`
- sometimes genre/year pages

## 10) Content writing format used (for clone parity)

Every page content is intentionally long-form SEO text with this format:

- **Intro (2 paragraphs)**: keyword context + user intent
- **4 sections**:
  - section heading
  - 2 descriptive paragraphs each

Tone style:

- informative + discovery-focused
- non-technical language
- streaming-navigation guidance

If you want exact parity on another site, keep:

- same section count
- same heading hierarchy (`h1`, `h2`, `h3`)
- similar paragraph length and density

## 11) Visual design language (how they were made)

The 30 pages were not random one-off copies. They follow a system:

- **Base layout skeleton same** (hero -> content -> footer)
- **Brand identity changes per route** through:
  - color palette (`colorTheme`)
  - preset-specific component branches
  - typography and accent treatment
- **Reusable building blocks** reduce code duplication
- **Route-level metadata + content** makes each page unique for SEO

That is the key reason they are scalable: one data source + one style engine for 23 pages, and dedicated legacy shells for exact style-matching pages.

## 12) How to recreate same-to-same on another website

Do this in order:

1. Create a data file like `extendedKeywordLandings.ts` with all 23 configs.
2. Create one master renderer like `OfficialBrandStyleLanding.tsx` with preset switch cases.
3. Create reusable atoms:
   - `SearchLinkPill`
   - optional thumbnails strip
   - article body block
4. Create route pages per slug that:
   - load config by slug
   - generate metadata from config
   - render master renderer with props
5. Create separate legacy style components for exact-match pages (fmovies/hurawatch/etc).
6. Add sitemap route that aggregates both extended + legacy slugs.
7. Add navbar branding helper similar to `keywordNavBranding.ts`.

## 13) Important files reference map

Main files to copy/rebuild logic from:

- `app/data/extendedKeywordLandings.ts`
- `app/components/keyword-landings/OfficialBrandStyleLanding.tsx`
- `app/components/keyword-landings/types.ts`
- `app/components/keyword-landings/SearchLinkPill.tsx`
- `app/components/keyword-landings/LandingMovieThumbnails.tsx`
- `app/lib/keywordNavBranding.ts`
- `app/api/sitemap-landingpages/route.ts`
- Any route like `app/123movies/page.tsx` for page wiring pattern
- Legacy examples: `app/fmovies/page.tsx`, `app/hurawatch/page.tsx`, `app/lookmovie/page.tsx`

---

If you want, I can also generate a second file with **copy-paste ready starter code** (data schema + renderer + one sample route) so your other website team can implement faster with minimal back-and-forth.

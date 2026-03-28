# REFERENCE_EXPORT.md

Single-file export of this repo’s **keyword / SEO landing** system for merging into another Next.js project.

**No secrets included** (no `.env` values, API keys, or DB credentials). Remove or replace site verification meta tokens in `layout.tsx` when merging.

## Checklist (what this file contains)

- [x] Stack + shallow folder tree
- [x] All keyword slugs + URL pattern
- [x] Full copy dataset: `extendedKeywordLandings.ts` (23 pages)
- [x] Shared templates: `OfficialBrandStyleLanding.tsx`, `SearchLinkPill.tsx`, `types.ts`, `LandingMovieThumbnails.tsx`
- [x] Legacy-style landing components + their `page.tsx` content (8 routes; sitemap lists these slugs)
- [x] Example route wiring (`app/123movies/page.tsx`)
- [x] Global CSS tokens (`app/globals.css`)
- [x] Favicon SVG inline
- [x] Sample SEO metadata (3 extended + 1 legacy)
- [x] “NOT FOUND” notes where applicable

---

## 1) PROJECT SUMMARY

### Stack

- **Framework:** Next.js **15.5.9** (App Router)
- **UI:** React **19.1.0**, **Tailwind CSS v4** (`@import "tailwindcss"` in `globals.css`)
- **Language:** TypeScript **5**
- **Other deps (not landing-specific):** mongodb, mongoose, dotenv, react-icons — **omit in merge if unused**

### Root folder (1 level; directories shown with /)

```text
Dockerfile
Dockerfile.fixed
EPISODES_SETUP_COMPLETE.md
EPISODE_DATA_TEMPLATE.md
FINAL_INSTRUCTIONS.md
GENERATING_ALL_MOVIES.md
HOW_TO_CHECK_SITEMAPS.md
LANDING_PAGES_MASTER_BLUEPRINT.md
MONGODB_SETUP.md
MOVIE_IDS_TEMPLATE.md
QUICK_START.md
README.md
README_SITEMAP_URDU.md
README_STATIC_SYSTEM.md
README_TV_SERIES.md
REFERENCE_EXPORT.md
RUN_FULL_GENERATION.bat
SEASON_SETUP_COMPLETE.md
SITEMAP_COMPLETE.md
SITEMAP_STRUCTURE.md
SITEMAP_STRUCTURE_SUMMARY.md
TEST_LOCALHOST.md
TEST_RESULTS.md
TV_SERIES_COMPLETE_SETUP.md
VIDSRC_SETUP.md
app/
data/
env.example
episodes_raw.txt
eslint.config.mjs
fix_any_types_prompt.md
fix_nix_npm.sh
fix_nix_npm_windows.bat
next-env.d.ts
next.config.js
next.config.ts
package-lock.json
package.json
postcss.config.mjs
public/
screenshots/
scripts/
sitemap-index-sample.xml
sitemap-landingpages-sample.xml
temp_movie_sitemap.txt
test-mongodb.js
tsconfig.json
tsconfig.tsbuildinfo
vercel.json
```

### App folder (2 levels — landing-related)

```text
[slug]/
  page.tsx
  [seasonSlug]/
123movies/
  page.tsx
5movierulz/
  page.tsx
7starhd/
  page.tsx
9xflix/
  page.tsx
9xmovies/
  page.tsx
action/
  layout.tsx
  page.tsx
admin/
  layout.tsx
  page.tsx
adventure/
  layout.tsx
  page.tsx
api/
  episodes/
  image-proxy/
  movie-ids/
  movies/
  reference/
  series/
  sitemap-countries/
  sitemap-genres/
  sitemap-index.xml/
  sitemap-landingpages/
  sitemap-movies/
  sitemap-movies-index.xml/
  sitemap-n123movie/
  sitemap-pages/
  sitemap-series/
  sitemap-series-index.xml/
  sitemap-years/
  tmdb-episode/
  tmdb-search-movies/
  tmdb-tv/
  tmdb-tv.ts
  tmdb.ts
  tv-genres/
  tv-series/
  tv-series-db/
  … (3 more)
bflix/
  page.tsx
bolly4u/
  page.tsx
bulk-movies/
  layout.tsx
components/
  Breadcrumb.tsx
  CanonicalLink.tsx
  DynamicNavbar.tsx
  EmbedPlayer.tsx
  EpisodePageContent.tsx
  GoogleAnalytics.tsx
  keyword-landings/
  KeywordLandingPage.tsx
  LandingVariant1.tsx
  LandingVariant10.tsx
  LandingVariant2.tsx
  LandingVariant3.tsx
  LandingVariant4.tsx
  LandingVariant5.tsx
  LandingVariant6.tsx
  LandingVariant7.tsx
  LandingVariant8.tsx
  LandingVariant9.tsx
  LoadingSpinner.tsx
  MovieCard.tsx
  MovieImage.tsx
  Navbar.tsx
  PreloadResources.tsx
  RelatedContent.tsx
  SearchModal.tsx
  … (4 more)
country/
  layout.tsx
  page.tsx
  [slug]/
data/
  bulkMovieIds.ts
  episodeIds.ts
  episodeMapping.ts
  extendedKeywordLandings.ts
  homeReferenceDisplayTitles.ts
  movieCategories.ts
  movieIds.ts
  movieYearMapping.ts
  movieYearsData.ts
  referenceHomeMapped.json
  referenceHomeSnapshot.json
  seriesEpisodeMapping.ts
  tvGenres.ts
  tvSeriesIds.ts
  tvYearsData.ts
  vidsrcLatestMovies.ts
episode/
  layout.tsx
  page.tsx
  [slug]/
episode-static/
  layout.tsx
favicon.ico
filmy4wap/
  page.tsx
filmy4web/
  page.tsx
filmyhit/
  page.tsx
fmovies/
  page.tsx
fzmovies/
  page.tsx
genre/
  [slug]/
genres/
  layout.tsx
  page.tsx
globals.css
gomovies/
  page.tsx
goojara/
  page.tsx
gostream/
  page.tsx
hdmovie2/
  page.tsx
home/
  layout.tsx
  page.tsx
hurawatch/
  page.tsx
ibomma/
  page.tsx
kuttymovies/
  page.tsx
layout.tsx
lib/
  domain.ts
  embed-config.ts
  episode-slug.ts
  keywordNavBranding.ts
  mongodb-client.ts
  mongodb.ts
  moviesDataServer.ts
  poster.ts
  referenceHomeSnapshot.ts
  searchLocalMovies.ts
  seo.ts
  serverSeriesCache.ts
  slug.ts
  tvSeriesStore.ts
lookmovie/
  page.tsx
models/
  Episode.ts
  Movie.ts
  MovieIds.ts
  TVSeries.ts
movies/
  layout.tsx
  page.tsx
moviesda/
  page.tsx
mp4moviez/
  page.tsx
netfree/
  page.tsx
page.tsx
popcornflix/
  page.tsx
prmovies/
  page.tsx
putlocker/
  page.tsx
robots.ts
search/
  layout.tsx
  page.tsx
series/
  layout.tsx
  page.tsx
series-static/
  layout.tsx
sflix/
  page.tsx
sitemap.ts
soap2day/
  page.tsx
solarmovie/
  page.tsx
ssrmovies/
  page.tsx
tv-genre/
  all/
  [slug]/
tv-year/
  [slug]/
united-states/
  layout.tsx
  page.tsx
utils/
  mongodb.ts
  movieIds.ts
year/
  [slug]/
years/
  layout.tsx
  page.tsx
yesmovies/
  page.tsx
```

---

## 2) LANDING / KEYWORD PAGES

### URL path pattern

- **Extended:** `/{slug}` where `slug` is a key of `extendedLandings` (see file below).
- **Legacy:** `/fmovies`, `/gomovies`, `/hurawatch`, `/lookmovie`, `/popcornflix`, `/soap2day`, `/solarmovie`, `/yesmovies`.

### Slug index (all keyword landings in this export)

| Path | Source |
|------|--------|
| `/123movies` | `extendedLandings` |
| `/gostream` | `extendedLandings` |
| `/putlocker` | `extendedLandings` |
| `/bflix` | `extendedLandings` |
| `/netfree` | `extendedLandings` |
| `/filmyhit` | `extendedLandings` |
| `/5movierulz` | `extendedLandings` |
| `/7starhd` | `extendedLandings` |
| `/hdmovie2` | `extendedLandings` |
| `/ssrmovies` | `extendedLandings` |
| `/9xmovies` | `extendedLandings` |
| `/kuttymovies` | `extendedLandings` |
| `/sflix` | `extendedLandings` |
| `/9xflix` | `extendedLandings` |
| `/prmovies` | `extendedLandings` |
| `/filmy4web` | `extendedLandings` |
| `/goojara` | `extendedLandings` |
| `/bolly4u` | `extendedLandings` |
| `/moviesda` | `extendedLandings` |
| `/filmy4wap` | `extendedLandings` |
| `/mp4moviez` | `extendedLandings` |
| `/ibomma` | `extendedLandings` |
| `/fzmovies` | `extendedLandings` |
| `/fmovies` | dedicated `page.tsx` + style component |
| `/gomovies` | dedicated `page.tsx` + style component |
| `/hurawatch` | dedicated `page.tsx` + style component |
| `/lookmovie` | dedicated `page.tsx` + style component |
| `/popcornflix` | dedicated `page.tsx` + style component |
| `/soap2day` | dedicated `page.tsx` + style component |
| `/solarmovie` | dedicated `page.tsx` + style component |
| `/yesmovies` | dedicated `page.tsx` + style component |

### Visible copy + templates

**23 extended pages:** All hero titles, subtitles, article headings, and paragraphs live in `extendedLandings`. Preset-specific hero UI (e.g. split “123”/“MOVIES”, search placeholder text, CTA labels) is in `OfficialBrandStyleLanding.tsx`.

**8 legacy pages:** Long-form `content` objects live in each `app/<slug>/page.tsx`. Hero/footer/CTA strings are in the corresponding `*StyleLanding.tsx` files below.

### FULL: app/data/extendedKeywordLandings.ts (all copy + meta + colors + presets)

```typescript
import type { OfficialStylePreset } from "@/components/keyword-landings/OfficialBrandStyleLanding";
import type { KeywordColorTheme, KeywordLandingContent } from "@/components/keyword-landings/types";

export type ExtendedLandingDefinition = {
  keyword: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  preset: OfficialStylePreset;
  colorTheme: KeywordColorTheme;
  content: KeywordLandingContent;
};

function theme(primary: string): KeywordColorTheme {
  return {
    primary,
    secondary: primary,
    accent: primary,
    buttonBg: primary,
    buttonHover: primary,
    searchBorder: primary,
    searchFocus: primary,
    cardHover: primary,
    playButton: primary,
    textAccent: primary,
  };
}

/** Slug → config for extended keyword landing pages (unique copy per route). */
export const extendedLandings: Record<string, ExtendedLandingDefinition> = {
  "123movies": {
    keyword: "123Movies",
    description: "A practical overview of how viewers search for free movies and shows online.",
    metaTitle: "123Movies – Watch Movies Online Free | Streaming Guide",
    metaDescription:
      "Learn how 123Movies-style browsing works, what to expect from free streaming hubs, and how to explore our catalog safely.",
    keywords: "123movies, watch movies online, free streaming guide, HD movies, TV shows online",
    preset: "m123",
    colorTheme: theme("#22c55e"),
    content: {
      heading: "123Movies – Your Guide to Free Streaming Discovery",
      intro: [
        "This page explains what people usually mean when they search for 123Movies and how you can get a similar experience on a modern, organized catalog. We focus on how titles are grouped, how search works, and why a single hub beats random browser tabs.",
        "Use the search bar above to jump straight into our library, or browse movies and series pages to filter by mood, year, or genre. Everything here is framed as a discovery guide — not a promise of third-party services.",
      ],
      sections: [
        {
          title: "Why “123Movies” became a household search term",
          paragraphs: [
            "For years, viewers typed 123Movies when they wanted a fast grid of posters without a paywall. The name became shorthand for “one place to scan many titles.” Today, legitimate sites still compete for that same clarity: instant rows, trailers, and a player that loads in one click.",
            "Our goal is to mirror that simplicity while keeping navigation predictable. You get structured categories, honest metadata, and links that stay inside the site ecosystem instead of bouncing through unknown domains.",
          ],
        },
        {
          title: "How to explore new releases without overwhelm",
          paragraphs: [
            "Start with the newest rows, then narrow down by genre or language. If you already know a title, search first — it saves time and avoids duplicate pages for remakes or sequels.",
            "Bookmark a few favorite genres so you can return weekly. Rotating collections keep the experience fresh without forcing you to re-learn the interface every visit.",
          ],
        },
        {
          title: "Devices, quality, and playback expectations",
          paragraphs: [
            "Modern browsers handle HD streams on laptops, tablets, and phones. For the best experience, use a stable connection and close heavy background tabs before starting a long film.",
            "If playback stutters, lower the step in the player or pause for a few seconds — the buffer usually catches up faster than restarting the whole session.",
          ],
        },
        {
          title: "Staying informed and respectful of creators",
          paragraphs: [
            "Free streaming guides work best when they respect copyright and regional rules. We present information to help you navigate our catalog and understand how titles are labeled.",
            "When in doubt, prefer official releases or licensed platforms. This page remains an informational overview tied to our on-site search and movie pages.",
          ],
        },
      ],
    },
  },

  gostream: {
    keyword: "GoStream",
    description: "Streamlined tips for finding movies fast when you miss the “GoStream” style layout.",
    metaTitle: "GoStream – Free Movie Streaming Guide & Alternatives",
    metaDescription:
      "Discover how GoStream-like browsing maps to our catalog: quick rows, simple search, and TV series in one flow.",
    keywords: "gostream, stream movies free, watch online, TV series streaming, free movies",
    preset: "gostream",
    colorTheme: theme("#6366f1"),
    content: {
      heading: "GoStream – Fast Rows, Simple Search, Modern Catalog",
      intro: [
        "GoStream earned attention for minimal chrome and a straight path from search to play. We rebuilt that idea into a cleaner interface with stronger metadata and a unified search that covers both films and episodic shows.",
        "If you landed here from an old bookmark, use the search bar to reconnect with the titles you care about. You can also browse by genre to rediscover hidden gems.",
      ],
      sections: [
        {
          title: "What people liked about the GoStream-style flow",
          paragraphs: [
            "The appeal was speed: fewer pop-ups, fewer steps between landing and watching. We prioritize the same rhythm — short paths, readable posters, and predictable buttons.",
            "Thumbnails load quickly, and titles are labeled with year and type so you do not mistake a remake for a classic.",
          ],
        },
        {
          title: "Series vs movies — one search bar",
          paragraphs: [
            "Episodes stay grouped by season. When you search a show name, you should land in the series entry instead of a random episode page.",
            "If you only remember an actor, search their name and filter by the top results to find the right franchise.",
          ],
        },
        {
          title: "Building a weekly watchlist habit",
          paragraphs: [
            "Pick three titles you want to finish this week. Mix genres so you do not burn out on the same tone every night.",
            "Use the series page for longer commitments and the movie page for quick one-off nights.",
          ],
        },
        {
          title: "Playback etiquette and privacy basics",
          paragraphs: [
            "Keep your browser updated and avoid installing unknown extensions that promise “faster streams.” They rarely help and often create security risk.",
            "If you share a network, close extra tabs so bandwidth stays focused on the player.",
          ],
        },
      ],
    },
  },

  putlocker: {
    keyword: "Putlocker",
    description: "A calm walkthrough for viewers who remember the Putlocker era of simple browsing.",
    metaTitle: "Putlocker – Watch Free Movies & TV Shows Online Guide",
    metaDescription:
      "Putlocker-style discovery explained: how to search, filter, and stream responsibly with our modern movie hub.",
    keywords: "putlocker, free movies, watch online, TV shows, streaming guide",
    preset: "putlocker",
    colorTheme: theme("#22d3ee"),
    content: {
      heading: "Putlocker – From Nostalgia to a Structured Streaming Guide",
      intro: [
        "Putlocker became famous for a no-frills homepage that put posters first. This guide explains how to recreate that browsing mindset on a safer, more transparent catalog.",
        "You can jump into movies or series with a single search, then explore related titles once you find what you like.",
      ],
      sections: [
        {
          title: "Why “just show me posters” still matters",
          paragraphs: [
            "Visual browsing is faster than reading lists when you are undecided. Our layout mirrors that instinct with large cards and clear labels.",
            "Hovering or tapping a title should reveal just enough detail — runtime, genre, year — without dumping spoilers.",
          ],
        },
        {
          title: "How to avoid dead ends when searching",
          paragraphs: [
            "Try alternate spellings for international titles. If a film shares a name with a TV show, include the year in your search.",
            "When nothing matches, browse genre collections to find similar pacing and tone.",
          ],
        },
        {
          title: "TV shows: follow the seasons in order",
          paragraphs: [
            "Serialized stories reward patience. Start from season one unless you know the show is episodic.",
            "If a series is long, set short goals — one episode per sitting — to avoid fatigue.",
          ],
        },
        {
          title: "Responsible streaming habits",
          paragraphs: [
            "Stick to trusted sources and avoid downloading unknown players. A modern browser is enough for most streams.",
            "If something asks for payment unexpectedly, stop — it is not part of our flow.",
          ],
        },
      ],
    },
  },

  bflix: {
    keyword: "Bflix",
    description: "A modern take on Bflix-style discovery with search-first navigation.",
    metaTitle: "Bflix – Free HD Movies & Series Streaming Overview",
    metaDescription:
      "Explore how Bflix-like browsing maps to our catalog: HD-focused rows, quick search, and series grouped cleanly.",
    keywords: "bflix, HD movies, free streaming, watch series online, movie catalog",
    preset: "bflix",
    colorTheme: theme("#db2777"),
    content: {
      heading: "Bflix – HD-First Browsing Without the Clutter",
      intro: [
        "Bflix-style sites often emphasize crisp posters and a “cinema night” vibe. We channel that energy into a layout that highlights quality metadata and fast load times.",
        "Use search to find a title, then explore related picks at the bottom of each page to keep the night moving.",
      ],
      sections: [
        {
          title: "Why HD labels matter more than buzzwords",
          paragraphs: [
            "Resolution is only one part of the experience — audio clarity and subtitle support matter too. Our pages show what is available so you can pick what fits your screen.",
            "If you are on mobile data, consider slightly lower quality to avoid buffering mid-scene.",
          ],
        },
        {
          title: "Romance, thriller, or doc night?",
          paragraphs: [
            "Plan the mood before you search. Mixing genres randomly can work, but themed nights make the choice easier.",
            "If you want background viewing, pick lighter comedies; for active watching, choose thrillers or mysteries.",
          ],
        },
        {
          title: "Series pacing for busy schedules",
          paragraphs: [
            "Twenty-minute episodes fit lunch breaks; hour-long dramas suit evenings. Use episode length as a filter when you start something new.",
            "If a show is heavy, alternate with a short comedy to reset your attention.",
          ],
        },
        {
          title: "Keeping accounts and devices simple",
          paragraphs: [
            "You do not need extra plugins for basic playback. Keep your OS and browser current for the best security baseline.",
            "Log out on shared devices after you finish a session.",
          ],
        },
      ],
    },
  },

  netfree: {
    keyword: "Netfree",
    description: "Ideas for budget-friendly streaming nights inspired by Netfree searches.",
    metaTitle: "Netfree – Watch Movies Free Online | Budget Streaming Tips",
    metaDescription:
      "Netfree-style viewing tips: how to explore free catalogs, plan nights, and search efficiently on our site.",
    keywords: "netfree, watch free movies, streaming tips, online TV, free catalog",
    preset: "netfree",
    colorTheme: theme("#a855f7"),
    content: {
      heading: "Netfree – Smart Streaming Without Subscription Fatigue",
      intro: [
        "People search Netfree when they want entertainment without another monthly bill. This guide focuses on how to explore a catalog efficiently and keep nights affordable.",
        "Search for titles you missed in theaters, then use related suggestions to build a double-feature.",
      ],
      sections: [
        {
          title: "Why free catalogs still need organization",
          paragraphs: [
            "Without structure, “free” browsing becomes random clicking. We group titles so you can scan by genre, popularity, or recency.",
            "That saves time and keeps you from scrolling past the same poster twice.",
          ],
        },
        {
          title: "Double-features that actually pair well",
          paragraphs: [
            "Match tone: comedy + comedy, or thriller + slow drama — not two dense tragedies back to back unless you want that mood.",
            "Add a short break between films to stretch and reset your eyes.",
          ],
        },
        {
          title: "Family nights vs solo nights",
          paragraphs: [
            "Family viewing needs safer picks and shorter runtimes. Solo nights can go longer and explore niche genres.",
            "Use the search bar to pre-check runtimes before you commit.",
          ],
        },
        {
          title: "Bandwidth and data mindfulness",
          paragraphs: [
            "If you are on a capped connection, download policy-friendly offline options only where allowed, or stream at lower quality.",
            "Close unused devices on the same Wi-Fi to reduce contention.",
          ],
        },
      ],
    },
  },

  filmyhit: {
    keyword: "Filmyhit",
    description: "Regional cinema discovery with Filmyhit-style search habits in mind.",
    metaTitle: "Filmyhit – Punjabi & Hindi Movies Online Discovery Guide",
    metaDescription:
      "Learn how Filmyhit-style regional searches translate into our catalog: languages, genres, and smart search.",
    keywords: "filmyhit, punjabi movies, hindi movies, watch online, regional cinema",
    preset: "filmyhit",
    colorTheme: theme("#ea580c"),
    content: {
      heading: "Filmyhit – Regional Hits, Clear Language Labels",
      intro: [
        "Regional cinema fans often search Filmyhit when they want new Punjabi or Hindi releases with familiar names. Here we focus on how language filters and spelling variants help you find the right print faster.",
        "Try searching both the English title and the native transliteration if the first query returns nothing.",
      ],
      sections: [
        {
          title: "Why transliteration matters in search",
          paragraphs: [
            "Titles can be spelled multiple ways. If you add the year or a lead actor, you disambiguate remakes.",
            "Our catalog favors consistent naming, but you can still reach the page by searching partial words.",
          ],
        },
        {
          title: "Genre blends in regional storytelling",
          paragraphs: [
            "Romance and family drama often mix with music-driven scenes. If you like one hit, look for similar composers or directors.",
            "Action films may include regional humor — read the short synopsis before you pick for a mixed-age group.",
          ],
        },
        {
          title: "Watching with subtitles",
          paragraphs: [
            "Subtitles help bridge dialects and idioms. Enable them if you are learning the language or watching with friends who speak different mother tongues.",
            "If subtitles are out of sync, reload once before troubleshooting your device.",
          ],
        },
        {
          title: "Supporting creators legally",
          paragraphs: [
            "Whenever possible, prefer official theatrical releases or licensed platforms for new films.",
            "This guide is informational and helps you navigate our catalog structure.",
          ],
        },
      ],
    },
  },

  "5movierulz": {
    keyword: "5Movierulz",
    description: "A structured overview for viewers who want Telugu, Tamil, and Hindi films in one place.",
    metaTitle: "5Movierulz – South Indian Movies Online Guide",
    metaDescription:
      "5Movierulz-style searches explained: how to find Telugu, Tamil, Hindi, and Malayalam titles with better filters.",
    keywords: "5movierulz, telugu movies, tamil movies, hindi movies, watch online",
    preset: "movierulz5",
    colorTheme: theme("#f59e0b"),
    content: {
      heading: "5Movierulz – South Indian Cinema at a Glance",
      intro: [
        "Fans often search 5Movierulz when they want a quick list of new South Indian releases. This page explains how to search by language, star cast, and year to avoid confusion between similarly named films.",
        "Start with the title plus the release year; if there is a clash, add the director or lead actor.",
      ],
      sections: [
        {
          title: "Language clusters and crossover hits",
          paragraphs: [
            "Many films are dubbed or released in multiple languages. Check the language label before you start playback.",
            "Crossover hits often get remakes — search carefully so you open the version you want.",
          ],
        },
        {
          title: "Song-heavy films vs plot-driven films",
          paragraphs: [
            "Musicals reward patience; if you prefer tight plotting, read the synopsis first.",
            "For action franchises, watch trailers to gauge pacing.",
          ],
        },
        {
          title: "Regional holidays and release spikes",
          paragraphs: [
            "Festivals spike new releases. If servers feel slow, try off-peak hours.",
            "Smaller titles sometimes hide better stories — browse genre pages, not only the top row.",
          ],
        },
        {
          title: "Respectful viewing",
          paragraphs: [
            "Piracy harms crews and studios. Use this guide to understand catalog structure and discover titles legally when available.",
            "We provide informational context only.",
          ],
        },
      ],
    },
  },

  "7starhd": {
    keyword: "7StarHD",
    description: "High-definition viewing tips for people who search 7StarHD-style keywords.",
    metaTitle: "7StarHD – HD Movies Download & Streaming Guide",
    metaDescription:
      "Understand what HD labels mean, how to choose quality settings, and how to search our catalog efficiently.",
    keywords: "7starhd, HD movies, watch online, streaming quality, free movies",
    preset: "sevenstarhd",
    colorTheme: theme("#14b8a6"),
    content: {
      heading: "7StarHD – Clear Picture, Clear Choices",
      intro: [
        "HD searches often mean viewers want sharp detail and stable audio. This guide explains how to pick the right quality tier for your device and network without chasing misleading file labels.",
        "Search for titles directly, then adjust playback settings if the player allows quality steps.",
      ],
      sections: [
        {
          title: "What “HD” actually signals",
          paragraphs: [
            "True HD depends on the source, not just the label. A good stream balances bitrate with smooth playback.",
            "If motion looks blocky, reduce quality one step — it often improves consistency more than maxing resolution.",
          ],
        },
        {
          title: "Soundbars, headphones, and phone speakers",
          paragraphs: [
            "Great video with weak audio ruins immersion. Use headphones for quiet environments or a soundbar for living rooms.",
            "Keep volume moderate to protect hearing during long marathons.",
          ],
        },
        {
          title: "Storage vs streaming",
          paragraphs: [
            "Downloading only makes sense when offline viewing is allowed. Otherwise streaming saves disk space.",
            "Clear cache occasionally if your browser feels sluggish after long sessions.",
          ],
        },
        {
          title: "Honest labeling",
          paragraphs: [
            "Avoid sites that rename cam prints as HD. Stick to trusted catalogs and official releases when possible.",
            "This page is informational and does not host uploads.",
          ],
        },
      ],
    },
  },

  hdmovie2: {
    keyword: "HDMovie2",
    description: "Sequel-friendly search tips for viewers who remember HDMovie2-style naming.",
    metaTitle: "HDMovie2 – Watch HD Movies & Series Online Overview",
    metaDescription:
      "HDMovie2-style browsing explained: sequels, remakes, and how to find the correct title in one search.",
    keywords: "hdmovie2, HD movies, watch series online, movie catalog, streaming",
    preset: "hdmovie2",
    colorTheme: theme("#38bdf8"),
    content: {
      heading: "HDMovie2 – Sequels, Remakes, and Smart Search",
      intro: [
        "When a name sounds like a sequel, it is easy to open the wrong movie. Add year or franchise keywords to your search.",
        "Our catalog groups franchises when possible so you can jump between related entries without guessing URLs.",
      ],
      sections: [
        {
          title: "Franchise fatigue vs genuine excitement",
          paragraphs: [
            "Long franchises reward viewers who know the order. If you are new, check release years to avoid spoilers from later chapters.",
            "If you only want a standalone story, pick films marketed as reboots.",
          ],
        },
        {
          title: "Remakes and international versions",
          paragraphs: [
            "A remake can differ sharply from the original. Read the synopsis before watching with friends who know the first film.",
            "International cuts may differ in runtime — that is normal.",
          ],
        },
        {
          title: "Binge spacing",
          paragraphs: [
            "Watching two sequels in one day can blur plots. Space them out to appreciate character arcs.",
            "Take notes on cliffhangers if you pause mid-franchise.",
          ],
        },
        {
          title: "Trust and verification",
          paragraphs: [
            "Prefer official metadata and posters from reliable pages. If details look off, cross-check the year and studio.",
            "We provide informational context only.",
          ],
        },
      ],
    },
  },

  ssrmovies: {
    keyword: "SSRMovies",
    description: "SSR-style searches for Bollywood and Hindi-dubbed action fans.",
    metaTitle: "SSRMovies – Bollywood & Hindi Dubbed Movies Guide",
    metaDescription:
      "SSRMovies keyword overview: how to browse Hindi cinema, dubbed action, and new releases with fewer dead ends.",
    keywords: "ssrmovies, bollywood movies, hindi dubbed, watch online, hindi cinema",
    preset: "ssrmovies",
    colorTheme: theme("#dc2626"),
    content: {
      heading: "SSRMovies – Bollywood Energy, Smarter Search",
      intro: [
        "Bollywood and Hindi-dubbed fans often search SSRMovies when they want mass entertainers with song breaks and big set pieces. This guide explains how to find similar titles without confusing remakes.",
        "Search by year when two films share the same star within a short window.",
      ],
      sections: [
        {
          title: "Mass entertainers vs indie dramas",
          paragraphs: [
            "Mass films lean on spectacle; indie dramas lean on dialogue. Pick based on your energy level, not just the poster.",
            "If you want songs, check runtime — longer films usually carry more musical numbers.",
          ],
        },
        {
          title: "Dubbed action and lip-sync",
          paragraphs: [
            "Dubs vary in quality. If dialogue feels off, try subtitles with the original audio when available.",
            "Action scenes still read well even if the dub is imperfect.",
          ],
        },
        {
          title: "Watching with family",
          paragraphs: [
            "Some thrillers include intense violence. Skim parental guidance notes before you press play with kids.",
            "Comedies are safer for mixed groups, but check humor style first.",
          ],
        },
        {
          title: "Supporting the industry",
          paragraphs: [
            "Theaters and licensed streamers fund future productions. Choose official options when you can.",
            "This guide is informational.",
          ],
        },
      ],
    },
  },

  "9xmovies": {
    keyword: "9xMovies",
    description: "A practical guide for viewers who search 9xMovies for multi-language releases.",
    metaTitle: "9xMovies – Multi-language Movies Online Discovery",
    metaDescription:
      "9xMovies-style searches: how to find Hindi, English, and dual-audio titles with clearer labels and filters.",
    keywords: "9xmovies, dual audio movies, hindi english, watch online, free movies",
    preset: "nine-x-movies",
    colorTheme: theme("#eab308"),
    content: {
      heading: "9xMovies – Multi-language Labels Without Confusion",
      intro: [
        "Multi-language releases often list multiple audio tracks. This guide helps you search precisely and avoid opening the wrong dub.",
        "Include the word “dual” or the language name if the catalog supports it.",
      ],
      sections: [
        {
          title: "Dual audio vs subtitles",
          paragraphs: [
            "Dual audio means two full tracks. Subtitles translate while keeping the original performance.",
            "Pick based on your comfort — some viewers prefer original audio even when dubs exist.",
          ],
        },
        {
          title: "Hollywood vs local dubbing styles",
          paragraphs: [
            "Dubbing styles differ by region. If jokes feel flat, try subtitles to catch wordplay.",
            "Action films dub more easily than fast-talking comedies.",
          ],
        },
        {
          title: "Kids and language learning",
          paragraphs: [
            "Family films can be a fun way to hear new languages. Pair subtitles with audio for learning.",
            "Pause to explain idioms if you watch with children.",
          ],
        },
        {
          title: "Legal and ethical viewing",
          paragraphs: [
            "Licensed platforms fund translations and dubs. Prefer them when available.",
            "This page is informational only.",
          ],
        },
      ],
    },
  },

  kuttymovies: {
    keyword: "Kutty Movies",
    description: "Tamil cinema fans: clearer paths for Kutty Movies-style searches.",
    metaTitle: "Kutty Movies – Tamil Movies Online Streaming Guide",
    metaDescription:
      "Kutty Movies keyword guide: Tamil new releases, classic picks, and smarter search tricks.",
    keywords: "kutty movies, tamil movies, watch online, kollywood, tamil cinema",
    preset: "kuttymovies",
    colorTheme: theme("#7c3aed"),
    content: {
      heading: "Kutty Movies – Tamil Stories, Smarter Discovery",
      intro: [
        "Tamil cinema ranges from rural dramas to sci-fi thrillers. If you search Kutty Movies, you likely want fresh Kollywood hits with strong dialogue.",
        "Use director names when titles repeat across decades.",
      ],
      sections: [
        {
          title: "New wave vs golden-age classics",
          paragraphs: [
            "Modern pacing is faster; older films may feel longer but reward patience with performances.",
            "Alternate if you are new — one classic, one modern each week.",
          ],
        },
        {
          title: "Rural settings, urban settings",
          paragraphs: [
            "Settings change tone and humor. Read one-line synopses to match your mood.",
            "If subtitles move fast, pause briefly — some lines are word-dense.",
          ],
        },
        {
          title: "Music and composers",
          paragraphs: [
            "Tamil films often lean on soundtrack albums. If you like a score, follow the composer to similar films.",
            "Song placement can be emotional — expect interludes in longer narratives.",
          ],
        },
        {
          title: "Respectful access",
          paragraphs: [
            "Support creators via theaters and licensed services when available.",
            "We provide informational context only.",
          ],
        },
      ],
    },
  },

  sflix: {
    keyword: "SFlix",
    description: "Series-friendly browsing inspired by SFlix-style searches.",
    metaTitle: "SFlix – Streaming Movies & TV Series Online Guide",
    metaDescription:
      "SFlix-style browsing: how to marathon series safely, track seasons, and search efficiently.",
    keywords: "sflix, streaming series, watch movies online, TV shows free, binge watch",
    preset: "sflix",
    colorTheme: theme("#ec4899"),
    content: {
      heading: "SFlix – Marathons, Miniseries, and Momentum",
      intro: [
        "SFlix-style searches often mean viewers want series-first layouts. Start from the series page, not random episodes, to keep story order intact.",
        "If you only have ninety minutes, pick a movie instead of starting a new show.",
      ],
      sections: [
        {
          title: "Why episode order matters",
          paragraphs: [
            "Skipping around works for sitcoms, not for mysteries. Follow the intended sequence unless the show is clearly episodic.",
            "If you return after months, recap the previous episode in your head.",
          ],
        },
        {
          title: "Miniseries vs endless shows",
          paragraphs: [
            "Miniseries give closure in one season. Long shows require commitment — check episode counts first.",
            "If you dislike cliffhangers, prefer closed-end miniseries.",
          ],
        },
        {
          title: "Healthy binge habits",
          paragraphs: [
            "Stand up between episodes, hydrate, and avoid back-to-back nights without sleep.",
            "Set a timer if you tend to lose track of time.",
          ],
        },
        {
          title: "Account safety",
          paragraphs: [
            "Never share passwords with unknown sites. Keep your login to trusted services.",
            "This page is informational.",
          ],
        },
      ],
    },
  },

  "9xflix": {
    keyword: "9xFlix",
    description: "Genre-hopping ideas for viewers who search 9xFlix-style catalogs.",
    metaTitle: "9xFlix – Genre Movies & Series Discovery Guide",
    metaDescription:
      "9xFlix keyword overview: how to hop genres without losing track, and how to search niche titles.",
    keywords: "9xflix, genre movies, watch series online, streaming catalog, free movies",
    preset: "nine-x-flix",
    colorTheme: theme("#0d9488"),
    content: {
      heading: "9xFlix – Genre Hopping Without Whiplash",
      intro: [
        "Jumping from horror to comedy can feel jarring. Plan transitions: follow a thriller with a light comedy, not a grim drama.",
        "Use search to anchor the night around one title, then pick related suggestions.",
      ],
      sections: [
        {
          title: "Pairing mood with genre",
          paragraphs: [
            "Match genre to your energy: documentaries for calm focus, action for adrenaline, romance for cozy nights.",
            "If you feel numb after a heavy film, reset with a short sketch or comedy.",
          ],
        },
        {
          title: "Niche subgenres",
          paragraphs: [
            "Sci-fi alone spans space opera, cyberpunk, and near-future drama. Narrow your search terms.",
            "Western horror differs from Asian horror — tone and pacing vary widely.",
          ],
        },
        {
          title: "Rotating watch partners",
          paragraphs: [
            "Take turns picking titles so everyone gets a voice.",
            "Agree on a veto rule for genres someone dislikes.",
          ],
        },
        {
          title: "Staying informed",
          paragraphs: [
            "Read reviews after watching if you want to avoid spoilers beforehand.",
            "This guide is informational and helps you navigate our catalog.",
          ],
        },
      ],
    },
  },

  prmovies: {
    keyword: "PRMovies",
    description: "A concise overview for PRMovies-style searches across Hindi and English titles.",
    metaTitle: "PRMovies – Hindi & English Movies Online Guide",
    metaDescription:
      "PRMovies keyword guide: bilingual search, release windows, and how to avoid wrong-year matches.",
    keywords: "prmovies, hindi movies, english movies, watch online, streaming",
    preset: "prmovies",
    colorTheme: theme("#f97316"),
    content: {
      heading: "PRMovies – Bilingual Search, Clear Results",
      intro: [
        "English and Hindi catalogs overlap when films are dubbed or cross-promoted. Add language or year hints to your search.",
        "If you want a specific regional cut, verify runtime against official listings.",
      ],
      sections: [
        {
          title: "Release windows and streaming",
          paragraphs: [
            "Some films arrive online weeks after theaters. If you cannot find a title, it may not be listed yet.",
            "Check similar titles from the same studio for release patterns.",
          ],
        },
        {
          title: "Switching languages mid-week",
          paragraphs: [
            "Alternate languages to keep your watchlist fresh — Hindi drama on Monday, English thriller on Wednesday.",
            "Subtitles help if you switch often.",
          ],
        },
        {
          title: "Kids and bilingual households",
          paragraphs: [
            "Animated films dub well across languages. Live-action comedy may not.",
            "Let kids pick occasionally to keep engagement high.",
          ],
        },
        {
          title: "Ethical viewing",
          paragraphs: [
            "Choose licensed options when available to support localization teams.",
            "This page is informational.",
          ],
        },
      ],
    },
  },

  filmy4web: {
    keyword: "Filmy4Web",
    description: "Web-first viewing habits for Filmy4Web-style keyword searches.",
    metaTitle: "Filmy4Web – Web Streaming Movies & Shows Guide",
    metaDescription:
      "Filmy4Web overview: browser-friendly streaming, tab hygiene, and search tips for busy viewers.",
    keywords: "filmy4web, watch movies online, web streaming, hindi movies, tv shows",
    preset: "filmy4web",
    colorTheme: theme("#be185d"),
    content: {
      heading: "Filmy4Web – Browser-Friendly Streaming",
      intro: [
        "Web streaming wins when tabs stay tidy. Keep one player tab and avoid dozens of background trackers.",
        "Search for titles directly instead of opening multiple search results blindly.",
      ],
      sections: [
        {
          title: "Tab discipline",
          paragraphs: [
            "Close unused tabs to free RAM and keep audio from overlapping.",
            "Pin the player tab if your browser supports it.",
          ],
        },
        {
          title: "Keyboard shortcuts",
          paragraphs: [
            "Learn spacebar for pause, arrows for seek, and F for fullscreen — it reduces friction.",
            "If shortcuts fail, click the player once to focus it.",
          ],
        },
        {
          title: "Extensions and safety",
          paragraphs: [
            "Avoid unknown “HD unlocker” extensions. They rarely improve quality.",
            "Use an ad blocker from reputable sources only.",
          ],
        },
        {
          title: "Transparency",
          paragraphs: [
            "We do not ask for unrelated permissions. If something does, leave the page.",
            "Informational guide only.",
          ],
        },
      ],
    },
  },

  goojara: {
    keyword: "Goojara",
    description: "Calm navigation tips for Goojara-style searches and long catalogs.",
    metaTitle: "Goojara – Movies & Anime Style Catalog Guide",
    metaDescription:
      "Goojara-style browsing tips: long catalogs, patience, and how to search niche animation titles.",
    keywords: "goojara, watch anime, movies online, long series, streaming guide",
    preset: "goojara",
    colorTheme: theme("#22c55e"),
    content: {
      heading: "Goojara – Long Catalogs, Patient Clicks",
      intro: [
        "Huge catalogs reward explorers who know what they want. Start with a genre anchor, then search within that mood.",
        "If you chase anime-style titles, verify whether you want sub or dub before you start.",
      ],
      sections: [
        {
          title: "Exploration vs decision fatigue",
          paragraphs: [
            "Too many choices stall the night. Set a ten-minute decision timer, then commit.",
            "If nothing fits, pick a short film instead of a three-hour epic.",
          ],
        },
        {
          title: "Long-running shows",
          paragraphs: [
            "Hundreds of episodes need milestones — watch arcs, not everything at once.",
            "Take breaks between seasons to avoid burnout.",
          ],
        },
        {
          title: "Niche animation keywords",
          paragraphs: [
            "Search studio names or directors when titles are unfamiliar romanizations.",
            "Alternate spellings matter — try Japanese and English names.",
          ],
        },
        {
          title: "Community respect",
          paragraphs: [
            "Discuss shows without spoiling newcomers. Use spoiler tags in chats.",
            "Informational guide only.",
          ],
        },
      ],
    },
  },

  bolly4u: {
    keyword: "Bolly4u",
    description: "Bollywood-focused discovery for Bolly4u-style Bollywood + Hindi cinema fans.",
    metaTitle: "Bolly4u – Bollywood Movies Online Watch Guide",
    metaDescription:
      "Bolly4u keyword overview: Bollywood new releases, classics, and star-driven search.",
    keywords: "bolly4u, bollywood movies, hindi movies, watch online, indian cinema",
    preset: "bolly4u",
    colorTheme: theme("#e11d48"),
    content: {
      heading: "Bolly4u – Bollywood Nights, Clear Picks",
      intro: [
        "Bollywood fans often search Bolly4u when they want masala films, romances, or family sagas. Use actor + year to disambiguate.",
        "Mix eras — one classic weekly, one new release — to understand how storytelling evolved.",
      ],
      sections: [
        {
          title: "Star vehicles vs scripts-first",
          paragraphs: [
            "Star vehicles highlight charisma; scripts-first films highlight writing. Both are valid nights.",
            "Read the director line if you care about craft over fame.",
          ],
        },
        {
          title: "Song-heavy films",
          paragraphs: [
            "Musicals need time — plan bathroom breaks before songs if you dislike pausing mid-track.",
            "If you prefer tight plots, pick thrillers or sports dramas.",
          ],
        },
        {
          title: "Festivals and box office",
          paragraphs: [
            "Holiday weekends drop bigger films. Smaller titles may shine on quieter days.",
            "Use search to find underrated gems.",
          ],
        },
        {
          title: "Supporting cinema",
          paragraphs: [
            "Tickets and licensed streams fund the next production cycle.",
            "This is an informational guide.",
          ],
        },
      ],
    },
  },

  moviesda: {
    keyword: "Moviesda",
    description: "Tamil mobile-first viewing tips for Moviesda-style searches.",
    metaTitle: "Moviesda – Tamil Movies Mobile Streaming Guide",
    metaDescription:
      "Moviesda-style keyword guide: Tamil films on phones, data-saving tips, and better search.",
    keywords: "moviesda, tamil movies, mobile streaming, watch online, kollywood",
    preset: "moviesda",
    colorTheme: theme("#06b6d4"),
    content: {
      heading: "Moviesda – Tamil Films on Mobile Screens",
      intro: [
        "Mobile viewing means smaller text and more glare. Pick subtitles sized for phones and avoid ultra-dark scenes in bright daylight.",
        "Search with short keywords — long titles are harder to type on small keyboards.",
      ],
      sections: [
        {
          title: "Data-saving moves",
          paragraphs: [
            "Lower resolution saves data. Download only when allowed and on trusted networks.",
            "Use Wi-Fi for long films to avoid buffering mid-climax.",
          ],
        },
        {
          title: "Brightness and night mode",
          paragraphs: [
            "Warm screens reduce eye strain at night. Dim brightness in dark rooms.",
            "Avoid max brightness — it drains battery faster than playback itself.",
          ],
        },
        {
          title: "Headphones and public spaces",
          paragraphs: [
            "Use headphones in public; respect people around you.",
            "Noise-cancelling headphones help on commutes.",
          ],
        },
        {
          title: "Legal access",
          paragraphs: [
            "Support Tamil cinema when official releases exist.",
            "Informational guide only.",
          ],
        },
      ],
    },
  },

  filmy4wap: {
    keyword: "Filmy4Wap",
    description: "Mobile web browsing tips for Filmy4Wap-style keyword searches.",
    metaTitle: "Filmy4Wap – Hindi Movies Mobile Web Guide",
    metaDescription:
      "Filmy4Wap overview: mobile-friendly search, portrait layout tips, and safer browsing.",
    keywords: "filmy4wap, hindi movies, mobile movies, watch online, streaming",
    preset: "filmy4wap",
    colorTheme: theme("#db2777"),
    content: {
      heading: "Filmy4Wap – Portrait Mode, Landscape Drama",
      intro: [
        "Phones rotate, but not every scene needs landscape. Trailers work in portrait; action scenes shine in landscape.",
        "Lock rotation once playback starts to avoid accidental flips.",
      ],
      sections: [
        {
          title: "Gestures and accidental taps",
          paragraphs: [
            "Swipe zones vary by player. Tap once to reveal controls, then pause.",
            "If ads appear, close them carefully — avoid fake “X” buttons.",
          ],
        },
        {
          title: "Battery and heat",
          paragraphs: [
            "Long films heat phones. Remove thick cases if the device overheats.",
            "Plug in during long sessions but avoid cheap cables.",
          ],
        },
        {
          title: "Text size for subtitles",
          paragraphs: [
            "Increase system font size if subtitles feel tiny.",
            "High-contrast subtitle themes help on OLED screens.",
          ],
        },
        {
          title: "Trust and safety",
          paragraphs: [
            "Never share OTPs or passwords on streaming pages.",
            "Informational guide only.",
          ],
        },
      ],
    },
  },

  mp4moviez: {
    keyword: "Mp4Moviez",
    description: "Format-agnostic viewing advice for Mp4Moviez-style searches.",
    metaTitle: "Mp4Moviez – Watch Movies Online Format Guide",
    metaDescription:
      "Mp4Moviez keyword guide: containers, codecs, and why the file extension matters less than the source.",
    keywords: "mp4moviez, watch movies online, streaming formats, HD movies",
    preset: "mp4moviez",
    colorTheme: theme("#84cc16"),
    content: {
      heading: "Mp4Moviez – Formats Matter Less Than the Source",
      intro: [
        "MP4 is a container, not a quality guarantee. A well-encoded stream beats a bloated file with a fancy extension.",
        "Focus on official sources and stable playback instead of chasing acronyms.",
      ],
      sections: [
        {
          title: "Why containers confuse people",
          paragraphs: [
            "Containers can hold different codecs. Two MP4s can look different if the bitrate differs.",
            "Trust your eyes and ears, not only the filename.",
          ],
        },
        {
          title: "Bandwidth vs sharpness",
          paragraphs: [
            "Higher bitrate needs more bandwidth. Match settings to your network.",
            "If motion smears, lower quality or reduce motion enhancement on TVs.",
          ],
        },
        {
          title: "Audio channels",
          paragraphs: [
            "Stereo is fine for phones; surround matters in living rooms.",
            "Check audio sync if dialogue feels off.",
          ],
        },
        {
          title: "Legitimate distribution",
          paragraphs: [
            "Licensed platforms encode carefully. Random uploads may mislabel quality.",
            "Informational guide only.",
          ],
        },
      ],
    },
  },

  ibomma: {
    keyword: "iBomma",
    description: "Telugu-focused streaming tips for iBomma-style keyword searches.",
    metaTitle: "iBomma – Telugu Movies Online Streaming Guide",
    metaDescription:
      "iBomma overview: Telugu new releases, family-friendly picks, and how to search titles faster.",
    keywords: "ibomma, telugu movies, watch online, tollywood, telugu cinema",
    preset: "ibomma",
    colorTheme: theme("#16a34a"),
    content: {
      heading: "iBomma – Telugu Stories for Every Household",
      intro: [
        "Telugu cinema balances mass appeal with emotional storytelling. Search by actor + director if you want a consistent tone across films.",
        "Family viewers often want comedies with heart — skim synopses for generational conflicts.",
      ],
      sections: [
        {
          title: "Mass entertainers vs family dramas",
          paragraphs: [
            "Mass films lean on hero elevation; family dramas focus on relationships. Pick based on mood.",
            "If kids are watching, avoid late-night thrillers unless you pre-screen.",
          ],
        },
        {
          title: "Festivals and box-office noise",
          paragraphs: [
            "Big releases dominate search results. Smaller films may need director names to surface.",
            "Try curated lists if search feels repetitive.",
          ],
        },
        {
          title: "Music and dance numbers",
          paragraphs: [
            "Telugu films often integrate songs into plot — expect tonal shifts.",
            "If you prefer tight plots, pick thrillers or sports stories.",
          ],
        },
        {
          title: "Support Tollywood",
          paragraphs: [
            "Official releases and theaters sustain crews and theaters.",
            "Informational guide only.",
          ],
        },
      ],
    },
  },

  fzmovies: {
    keyword: "FZMovies",
    description: "Closing the loop: global cinema search tips for FZMovies-style lookups.",
    metaTitle: "FZMovies – Global Movies & Series Discovery Guide",
    metaDescription:
      "FZMovies keyword overview: worldwide titles, subtitles, and how to search across regions.",
    keywords: "fzmovies, global movies, international films, watch online, streaming",
    preset: "fzmovies",
    colorTheme: theme("#3b82f6"),
    content: {
      heading: "FZMovies – Global Cinema, Local Comfort",
      intro: [
        "International films expand your taste, but subtitles need attention. Choose accurate tracks and read a one-line synopsis for culture-specific humor.",
        "Search by country or language if you want a themed week — French noir, Korean thrillers, or Japanese slice-of-life.",
      ],
      sections: [
        {
          title: "Cultural context and comedy",
          paragraphs: [
            "Jokes do not always translate literally. Subtitles paraphrase for timing.",
            "If you feel lost, read a short cultural primer before watching.",
          ],
        },
        {
          title: "Different pacing around the world",
          paragraphs: [
            "Some films breathe slowly; slow scenes are intentional.",
            "Give them fifteen minutes before you decide to bail.",
          ],
        },
        {
          title: "Rotating regions",
          paragraphs: [
            "Each month, pick a new region to explore. It keeps discovery fresh.",
            "Pair food with the region for fun watch parties.",
          ],
        },
        {
          title: "Rights and availability",
          paragraphs: [
            "Licensing varies by country. If a title is missing, it may be geo-restricted.",
            "This guide is informational and helps you navigate our catalog.",
          ],
        },
      ],
    },
  },
};
```

### FULL: OfficialBrandStyleLanding.tsx (all preset heroes + ArticleBody + ShareRow)

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { SearchLinkPill } from "./SearchLinkPill";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import type { KeywordLandingProps } from "./types";

/** Visual family per keyword — matches common “official” landing patterns; global Navbar only (no second site header). */
export type OfficialStylePreset =
  | "m123"
  | "gostream"
  | "putlocker"
  | "bflix"
  | "netfree"
  | "filmyhit"
  | "movierulz5"
  | "sevenstarhd"
  | "hdmovie2"
  | "ssrmovies"
  | "nine-x-movies"
  | "kuttymovies"
  | "sflix"
  | "nine-x-flix"
  | "prmovies"
  | "filmy4web"
  | "goojara"
  | "bolly4u"
  | "moviesda"
  | "filmy4wap"
  | "mp4moviez"
  | "ibomma"
  | "fzmovies";

type Props = KeywordLandingProps & {
  preset: OfficialStylePreset;
};

function ArticleBody({
  content,
  headingClass,
  bodyClass,
  cardClass,
}: {
  content: KeywordLandingProps["content"];
  headingClass: string;
  bodyClass: string;
  cardClass: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 className={`mb-8 text-center text-xl font-bold md:text-2xl ${headingClass}`}>{content.heading}</h2>
      <div className={`space-y-5 text-[15px] leading-relaxed ${bodyClass}`}>
        {content.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-12 space-y-8">
        {content.sections.map((section) => (
          <section key={section.title} className={cardClass}>
            <h2 className={`text-lg font-bold md:text-xl ${headingClass}`}>{section.title}</h2>
            <div className={`mt-4 space-y-3 text-[15px] leading-relaxed ${bodyClass}`}>
              {section.paragraphs.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className={`mt-14 text-center text-xs ${bodyClass}`}>
        © {new Date().getFullYear()} · Informational guide ·{" "}
        <Link href="/home" className="underline-offset-2 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}

/** Social / share row — labels (not repeated “Share” only). */
function ShareRow({ dark }: { dark?: boolean }) {
  const items = [
    { bg: "#1877f2", label: "Facebook" },
    { bg: "#1da1f2", label: "Twitter" },
    { bg: "#ff4500", label: "Reddit" },
    { bg: "#333", label: "Email" },
  ];
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {items.map((s) => (
        <span
          key={s.label}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white shadow ${dark ? "" : "opacity-95"}`}
          style={{ backgroundColor: s.bg }}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

export default function OfficialBrandStyleLanding({ keyword, description, content, colorTheme, preset }: Props) {
  const a = colorTheme.primary;

  /* ---------- 123Movies: green + dark (123moviesfree-style) ---------- */
  if (preset === "m123") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0d0d0d] font-sans text-[#b8bcc4]">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl text-white shadow-lg sm:h-20 sm:w-20 sm:text-3xl"
              style={{ backgroundColor: a }}
            >
              ▶
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              <span style={{ color: a }}>123</span>
              <span className="text-white">MOVIES</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/75">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search movies & TV…" />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/movies"
                className="rounded-full px-8 py-2.5 text-sm font-bold text-black"
                style={{ backgroundColor: a }}
              >
                Browse movies
              </Link>
              <Link href="/series" className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/90 hover:bg-white/10">
                TV series
              </Link>
            </div>
            <ShareRow dark />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-white/80"
            cardClass="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- GoStream: light + poster grid strip ---------- */
  if (preset === "gostream") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#f5f6f8] font-sans text-gray-800">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{keyword}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">{description}</p>
            <LandingMovieThumbnails
              count={8}
              className="mx-auto mt-8 max-w-4xl"
              gridClassName="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-3"
            />
            <SearchLinkPill variant="light" className="mx-auto mt-10 max-w-xl" placeholder="Search titles…" />
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/movies" className="rounded-lg px-6 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: a }}>
                Movies
              </Link>
              <Link href="/series" className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700">
                Series
              </Link>
            </div>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-gray-900"
            bodyClass="text-gray-600"
            cardClass="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  /* ---------- Putlocker: dark teal-green minimal ---------- */
  if (preset === "putlocker") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-300">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400/90">Stream</p>
            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">{keyword}</h1>
            <p className="mt-4 text-sm text-slate-400">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-lg" placeholder="Search library…" />
            <Link href="/movies" className="mt-8 inline-block rounded-md px-10 py-3 text-sm font-bold text-slate-900" style={{ backgroundColor: a }}>
              Watch now
            </Link>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-slate-300"
            cardClass="rounded-xl border border-slate-700/80 bg-slate-900/50 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- Bflix: near-black + magenta accents ---------- */
  if (preset === "bflix") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-gray-400">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
              {keyword}
            </h1>
            <p className="mt-4 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Find HD movies & shows…" />
            <div className="mt-8 flex justify-center gap-2">
              <Link href="/movies" className="rounded-full px-8 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: a }}>
                HD Movies
              </Link>
            </div>
            <ShareRow dark />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-gray-400"
            cardClass="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- Netfree: deep purple ---------- */
  if (preset === "netfree") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-gradient-to-b from-[#1e1b4b] to-[#0f0a1a] font-sans text-purple-100/90">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-white md:text-5xl">{keyword}</h1>
            <p className="mt-4 text-sm text-purple-200/80">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search free catalog…" />
            <Link href="/movies" className="mt-8 inline-block rounded-full px-10 py-3 text-sm font-bold text-white shadow-lg" style={{ backgroundColor: a }}>
              Explore
            </Link>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-purple-100/85"
            cardClass="rounded-2xl border border-purple-500/20 bg-purple-950/40 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- Filmyhit: warm Indian cream ---------- */
  if (preset === "filmyhit") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#fff7ed] font-sans text-gray-800">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-orange-700 md:text-4xl">🎬 {keyword}</h1>
            <p className="mt-3 text-sm text-gray-600">{description}</p>
            <SearchLinkPill variant="light" className="mx-auto mt-10 max-w-xl" placeholder="Search Punjabi / Hindi…" />
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] font-bold tracking-wide text-gray-600">
              <Link href="/movies" className="hover:text-orange-700">
                MOVIES
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/series" className="hover:text-orange-700">
                SHOWS
              </Link>
            </div>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-gray-900"
            bodyClass="text-gray-600"
            cardClass="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  /* ---------- 5Movierulz: dark + gold + teal strip ---------- */
  if (preset === "movierulz5") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0c0c0c] font-sans text-gray-300">
          <div className="border-b border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-teal-900/20 py-3 text-center text-[11px] font-bold tracking-widest text-amber-200/90">
            SOUTH INDIAN · HINDI · TAMIL · TELUGU
          </div>
          <div className="mx-auto max-w-2xl px-4 py-12 text-center">
            <h1 className="text-3xl font-black text-amber-400 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-gray-400">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search regional movies…" />
            <Link href="/movies" className="mt-8 inline-block rounded-sm px-8 py-2.5 text-sm font-bold text-black" style={{ backgroundColor: "#fbbf24" }}>
              Browse
            </Link>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-amber-100"
            bodyClass="text-gray-400"
            cardClass="rounded-lg border border-amber-900/40 bg-black/40 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- 7StarHD: black + teal HD badge ---------- */
  if (preset === "sevenstarhd") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-black font-sans text-gray-400">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <span className="inline-block rounded border-2 border-teal-400 px-3 py-1 text-xs font-black text-teal-400">HD</span>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search HD titles…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-white"
            bodyClass="text-gray-400"
            cardClass="rounded-xl border border-teal-900/50 bg-teal-950/20 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- HDMovie2: slate + cyan ---------- */
  if (preset === "hdmovie2") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-cyan-400 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-slate-400">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search sequels & remakes…" />
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/movies" className="rounded-lg px-6 py-2 text-sm font-bold text-slate-950" style={{ backgroundColor: a }}>
                Movies
              </Link>
              <Link href="/series" className="rounded-lg border border-cyan-700 px-6 py-2 text-sm text-cyan-200">
                Series
              </Link>
            </div>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-cyan-100"
            bodyClass="text-slate-400"
            cardClass="rounded-xl border border-cyan-900/40 bg-slate-900/60 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- SSRMovies: red Bollywood ---------- */
  if (preset === "ssrmovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#1a0505] font-sans text-red-100/80">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-red-500 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search Hindi / dubbed…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-red-100"
            bodyClass="text-red-100/70"
            cardClass="rounded-xl border border-red-900/50 bg-red-950/30 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- 9xMovies: black + amber ---------- */
  if (preset === "nine-x-movies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-black font-sans text-amber-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-amber-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm text-amber-100/60">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Dual audio search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-amber-200"
            bodyClass="text-amber-100/70"
            cardClass="rounded-xl border border-amber-900/40 bg-amber-950/20 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- KuttyMovies: purple Tamil ---------- */
  if (preset === "kuttymovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#1a0a2e] font-sans text-purple-100/80">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-purple-300 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-purple-200/60">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search Tamil cinema…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-purple-100"
            bodyClass="text-purple-100/70"
            cardClass="rounded-xl border border-purple-800/50 bg-purple-950/40 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- SFlix: magenta dark ---------- */
  if (preset === "sflix") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-zinc-950 font-sans text-pink-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-pink-500 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Search series…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-pink-100"
            bodyClass="text-pink-100/70"
            cardClass="rounded-xl border border-pink-900/40 bg-pink-950/20 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- 9xFlix: teal slate ---------- */
  if (preset === "nine-x-flix") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-slate-950 font-sans text-teal-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-teal-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Genre search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-teal-100"
            bodyClass="text-teal-100/70"
            cardClass="rounded-xl border border-teal-900/40 bg-slate-900/60 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- PRMovies: orange cream ---------- */
  if (preset === "prmovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-orange-700 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-gray-600">{description}</p>
            <SearchLinkPill variant="soft" className="mx-auto mt-10 max-w-xl" placeholder="Hindi · English…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-gray-900"
            bodyClass="text-gray-600"
            cardClass="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  /* ---------- Filmy4Web: rose ---------- */
  if (preset === "filmy4web") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-rose-50 font-sans text-rose-950">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-rose-700 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-rose-900/70">{description}</p>
            <SearchLinkPill variant="soft" className="mx-auto mt-10 max-w-xl" placeholder="Web streaming search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-rose-900"
            bodyClass="text-rose-900/80"
            cardClass="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  /* ---------- Goojara: green dark ---------- */
  if (preset === "goojara") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#0a1f14] font-sans text-green-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-green-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Anime · movies…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-green-100"
            bodyClass="text-green-100/70"
            cardClass="rounded-xl border border-green-900/40 bg-green-950/30 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- Bolly4u: red ---------- */
  if (preset === "bolly4u") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-[#1f0606] font-sans text-red-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-red-500 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Bollywood search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-red-100"
            bodyClass="text-red-100/70"
            cardClass="rounded-xl border border-red-900/50 bg-red-950/30 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- Moviesda: cyan Tamil mobile ---------- */
  if (preset === "moviesda") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-cyan-950 font-sans text-cyan-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-cyan-300 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Tamil mobile search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-cyan-100"
            bodyClass="text-cyan-100/70"
            cardClass="rounded-xl border border-cyan-800/40 bg-cyan-950/50 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- Filmy4Wap: pink ---------- */
  if (preset === "filmy4wap") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-pink-50 font-sans text-pink-950">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-pink-600 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm text-pink-900/70">{description}</p>
            <SearchLinkPill variant="soft" className="mx-auto mt-10 max-w-xl" placeholder="Hindi mobile…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-pink-900"
            bodyClass="text-pink-900/80"
            cardClass="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm"
          />
        </div>
      </>
    );
  }

  /* ---------- Mp4Moviez: lime dark ---------- */
  if (preset === "mp4moviez") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-neutral-950 font-sans text-lime-100/70">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-lime-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Format-smart search…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-lime-100"
            bodyClass="text-lime-100/70"
            cardClass="rounded-xl border border-lime-900/40 bg-lime-950/10 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- iBomma: Telugu green ---------- */
  if (preset === "ibomma") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-green-950 font-sans text-green-100/80">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-3xl font-black text-green-400 md:text-4xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="Telugu search…" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-green-500/90">Tollywood</p>
          </div>
          <ArticleBody
            content={content}
            headingClass="text-green-100"
            bodyClass="text-green-100/75"
            cardClass="rounded-xl border border-green-800/40 bg-green-950/50 p-6"
          />
        </div>
      </>
    );
  }

  /* ---------- FZMovies: blue global ---------- */
  if (preset === "fzmovies") {
    return (
      <>
        <StructuredData type="website" />
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-blue-950 font-sans text-blue-100/75">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center">
            <h1 className="text-4xl font-black text-blue-400 md:text-5xl">{keyword}</h1>
            <p className="mt-3 text-sm">{description}</p>
            <SearchLinkPill className="mx-auto mt-10 max-w-xl" placeholder="International cinema…" />
          </div>
          <ArticleBody
            content={content}
            headingClass="text-blue-100"
            bodyClass="text-blue-100/70"
            cardClass="rounded-xl border border-blue-900/40 bg-slate-900/50 p-6"
          />
        </div>
      </>
    );
  }

  return null;
}
```

### EXAMPLE: app/123movies/page.tsx (metadata + wiring pattern for any extended slug)

```tsx
import OfficialBrandStyleLanding from "@/components/keyword-landings/OfficialBrandStyleLanding";
import { extendedLandings } from "@/data/extendedKeywordLandings";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

const slug = "123movies" as const;

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const cfg = extendedLandings[slug];
  const url = `${base}/${slug}`;
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    keywords: cfg.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      type: "website",
      url,
    },
  };
}

export default function Movies123Page() {
  const cfg = extendedLandings[slug];
  return (
    <OfficialBrandStyleLanding
      preset={cfg.preset}
      keyword={cfg.keyword}
      description={cfg.description}
      colorTheme={cfg.colorTheme}
      content={cfg.content}
    />
  );
}
```

### SearchLinkPill.tsx

```tsx
import Link from "next/link";

type Props = {
  href?: string;
  placeholder: string;
  className?: string;
  iconClassName?: string;
  /** `dark` = on dark hero; `light` / `soft` for pale backgrounds */
  variant?: "dark" | "light" | "soft";
};

const variantClass: Record<NonNullable<Props["variant"]>, string> = {
  dark: "border-white/10 bg-[#1a1a24] text-gray-500 hover:border-white/20 hover:bg-[#22222e]",
  light: "border-gray-200 bg-white text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50",
  soft: "border-slate-200/80 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white",
};

/** Clickable search-shaped control → opens site search (global Navbar stays the only header). */
export function SearchLinkPill({
  href = "/search",
  placeholder,
  className = "",
  iconClassName = "text-gray-400",
  variant = "dark",
}: Props) {
  return (
    <Link
      href={href}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-full px-5 py-3.5 pl-6 text-left text-sm transition-colors ${variantClass[variant]} ${className}`}
    >
      <span className="flex-1">{placeholder}</span>
      <span className={`shrink-0 ${iconClassName}`} aria-hidden>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </Link>
  );
}
```

### keyword-landings/types.ts

```typescript
export type KeywordColorTheme = {
  primary: string;
  secondary: string;
  accent: string;
  buttonBg?: string;
  buttonHover?: string;
  searchBorder?: string;
  searchFocus?: string;
  cardHover?: string;
  playButton?: string;
  textAccent?: string;
};

export type KeywordLandingContent = {
  heading: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
};

export type KeywordLandingProps = {
  keyword: string;
  description: string;
  colorTheme: KeywordColorTheme;
  content: KeywordLandingContent;
};
```

### LandingMovieThumbnails.tsx (depends on @/lib/moviesDataServer, @/lib/slug, @/lib/poster — stub those in target project or simplify)

```tsx
import Link from "next/link";
import Image from "next/image";
import { getAllProcessedMovies } from "@/lib/moviesDataServer";
import { generateMovieUrl } from "@/lib/slug";
import { resolvePosterUrl } from "@/lib/poster";

type Props = {
  count?: number;
  /** Outer wrapper (default: centered + top margin + max width) */
  className?: string;
  /** e.g. "grid grid-cols-2 gap-3 sm:grid-cols-4" */
  gridClassName?: string;
};

const defaultWrap = "mx-auto mt-10 max-w-3xl";

/**
 * Real movie posters from local catalog — replaces empty gradient placeholders on landings.
 */
export default async function LandingMovieThumbnails({
  count = 8,
  className,
  gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-4",
}: Props) {
  const wrapClass = className ?? defaultWrap;
  const all = getAllProcessedMovies();
  const picks = all.filter((m) => m.poster_path && m.imdb_id).slice(0, count);

  if (picks.length === 0) {
    return (
      <div className={wrapClass}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <Link
            href="/movies"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            Latest movies
          </Link>
          <Link
            href="/series"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            TV series
          </Link>
          <Link
            href="/search"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            Search
          </Link>
          <Link
            href="/genres"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm font-semibold text-neutral-700 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            Genres
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-neutral-500">Browse the catalog — posters load when movie data is available.</p>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <div className={gridClassName}>
        {picks.map((m) => (
          <Link
            key={m.imdb_id}
            href={generateMovieUrl(m.title, m.imdb_id)}
            className="group block overflow-hidden rounded-lg bg-neutral-100 shadow-sm ring-1 ring-black/5 transition hover:ring-violet-400/60"
          >
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={resolvePosterUrl(m.poster_path, "w300")}
                alt={m.title}
                fill
                className="object-cover transition group-hover:opacity-95"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <p className="line-clamp-2 px-1.5 py-1.5 text-center text-[11px] font-medium leading-tight text-neutral-800 group-hover:text-violet-700">
              {m.title}
              {m.year ? <span className="text-neutral-500"> ({m.year})</span> : null}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### LEGACY: app/fmovies/page.tsx

```tsx
import FmoviesStyleLanding from "../components/keyword-landings/FmoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/fmovies`;
  return {
    title: "Fmovies - Stream Movies and TV Shows Online Free",
    description: "Fmovies offers unlimited streaming of movies and TV series in HD quality. Watch the latest releases and classic films without any subscription fees.",
    keywords: "fmovies, free movies online, stream movies, HD streaming, watch TV shows, online streaming",
    alternates: { canonical: url },
    openGraph: {
      title: "Fmovies - Stream Movies and TV Shows Online Free",
      description: "Fmovies offers unlimited streaming of movies and TV series in HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Fmovies - Watch Free Movies and TV Series Online",
  intro: [
    "Welcome to Fmovies, where streaming entertainment is completely free and accessible to everyone. Dive into our massive collection of movies and TV shows without paying a single penny. From the latest Hollywood releases to timeless classics, we've gathered everything you need for unlimited entertainment.",
    "No registration required, no credit card needed – just click and watch. Our platform is designed for movie lovers who want instant access to quality content without barriers. Start streaming your favorite movies and discover new ones every day."
  ],
  sections: [
    {
      title: "Why Fmovies is the Best Choice for Free Streaming",
      paragraphs: [
        "Fmovies has become one of the most popular destinations for free movie streaming worldwide. With thousands of movies and TV series available at your fingertips, you'll never run out of entertainment options. We update our library daily with the latest releases, ensuring you're always up to date with trending content.",
        "Our platform works on all devices - watch on your smartphone, tablet, laptop, or desktop computer. The responsive design ensures perfect viewing experience regardless of screen size. Switch between devices seamlessly and continue watching where you left off."
      ]
    },
    {
      title: "Massive Library of Movies and TV Shows",
      paragraphs: [
        "Browse through an incredible selection of content spanning all genres and decades. Action, comedy, drama, horror, romance, sci-fi, thriller - we have it all. From brand new releases to golden oldies, from Hollywood blockbusters to independent films, Fmovies covers every taste and preference.",
        "TV show enthusiasts will find complete seasons of popular series, including the latest episodes. Binge-watch entire series or catch up on missed episodes. Our collection includes both ongoing shows and completed series, giving you endless hours of entertainment."
      ]
    },
    {
      title: "Fast Streaming with HD Quality",
      paragraphs: [
        "Experience smooth, buffer-free streaming with our optimized servers. Watch movies in high definition quality with clear audio and sharp video. Our advanced streaming technology ensures minimal loading time and maximum viewing pleasure.",
        "Multiple server options provide backup if one is slow or unavailable. The player automatically adjusts quality based on your internet connection speed, preventing annoying buffering interruptions while maintaining the best possible picture quality."
      ]
    },
    {
      title: "100% Free - No Hidden Costs",
      paragraphs: [
        "Fmovies is completely free to use. No subscription fees, no registration required, no credit card information needed. Simply visit the site, search for your favorite content, and start watching immediately. It's that simple and straightforward.",
        "We believe everyone deserves access to quality entertainment without financial barriers. That's why Fmovies will always remain free. Enjoy unlimited streaming without worrying about bills, trials that expire, or surprise charges."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#3b82f6',      // Blue
  secondary: '#8b5cf6',    // Purple
  accent: '#6366f1',       // Indigo
  buttonBg: '#3b82f6',
  buttonHover: '#2563eb',
  searchBorder: '#3b82f6',
  searchFocus: '#2563eb',
  cardHover: '#3b82f6',
  playButton: '#3b82f6',
  textAccent: '#3b82f6'
};

export default function FmoviesPage() {
  return (
    <FmoviesStyleLanding
      keyword="Fmovies"
      description="Unlimited Streaming of Movies and TV Series"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: FmoviesStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { SearchLinkPill } from "./SearchLinkPill";
import type { KeywordLandingProps } from "./types";

/** Fmovies hero + body (no top header — site Navbar is used). Search bar + social row + CTA match reference layout. */
const MAGENTA = "#e91e63";
const BG = "#0d0d12";

export default function FmoviesStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  const faq = content.sections.slice(0, 4).map((s, i) => ({
    q: s.title,
    a: s.paragraphs.join(" "),
    key: i,
  }));

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen font-sans text-[#b0b0b0] lg:pr-14" style={{ backgroundColor: BG }}>
        {/* Floating social rail (right) — SS: fixed vertical strip */}
        <div className="fixed right-2 top-1/3 z-40 hidden flex-col gap-2 lg:flex">
          {["#1877f2", "#1da1f2", "#0088cc", "#25d366"].map((c, i) => (
            <span
              key={i}
              className="h-9 w-9 cursor-pointer rounded shadow-md"
              style={{ backgroundColor: c }}
              aria-hidden
            />
          ))}
        </div>

        {/* Centered hero (starts below global Navbar) */}
        <div className="mx-auto max-w-[1200px] px-5 py-12 text-center sm:px-6 md:py-16">
          <div
            className="mx-auto mb-8 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl text-3xl text-white shadow-lg md:h-24 md:w-24 md:text-4xl"
            style={{ backgroundColor: MAGENTA }}
          >
            ▶
          </div>
          <h1 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl">{keyword}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base">{description}</p>

          <SearchLinkPill
            className="mx-auto mt-10 max-w-2xl"
            placeholder="Search your favorite content"
          />

          <div className="mx-auto mt-6 flex w-full max-w-2xl flex-wrap justify-center gap-2">
            {(
              [
                { bg: "#4267B2", label: "Facebook", abbr: "f" },
                { bg: "#1DA1F2", label: "Twitter", abbr: "X" },
                { bg: "#FF4500", label: "Reddit", abbr: "r" },
                { bg: "#444444", label: "Email", abbr: "@" },
                { bg: "#25D366", label: "WhatsApp", abbr: "W" },
                { bg: "#0088cc", label: "Telegram", abbr: "T" },
              ] as const
            ).map((s) => (
              <span
                key={s.label}
                title={s.label}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: s.bg }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[11px] font-bold">
                  {s.abbr}
                </span>
                {s.label}
              </span>
            ))}
          </div>

          <Link
            href="/movies"
            className="mt-8 inline-block rounded-full px-10 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: MAGENTA, borderRadius: 30 }}
          >
            Go to {keyword}
          </Link>
        </div>

        <main className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-left">
          <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">{content.heading}</h2>
          <div className="space-y-6 text-sm leading-[1.8] md:text-base">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-20 space-y-20 md:space-y-24">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h3 className="text-xl font-bold text-white md:text-2xl">{section.title}</h3>
                <ul className="mt-5 list-none space-y-4">
                  {section.paragraphs.map((para, j) => (
                    <li key={j} className="flex gap-2 text-sm md:text-base">
                      <span className="text-white">•</span>
                      <span>
                        <strong className="text-white">Point {j + 1}: </strong>
                        {para}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-20 border-t border-white/10 pt-12">
            <h3 className="text-center text-xl font-bold text-white">Frequently Asked Questions</h3>
            <div className="mx-auto mt-8 max-w-3xl space-y-2">
              {faq.map((item) => (
                <details
                  key={item.key}
                  className="group border border-white/10 bg-[#14141c] px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-white">
                    {item.q}
                    <span className="text-lg" style={{ color: MAGENTA }}>
                      ▼
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/movies"
              className="inline-block rounded-full px-10 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: MAGENTA, borderRadius: 30 }}
            >
              Go to {keyword}
            </Link>
          </div>
          </div>
        </main>

        <footer className="border-t border-white/10 bg-black/50 py-12">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="rounded bg-[#e91e63] px-1 py-0.5 text-xs">▶</span>
                {keyword}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">{description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Quick</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/home" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/movies" className="hover:text-white">
                    Movies
                  </Link>
                </li>
                <li>
                  <Link href="/series" className="hover:text-white">
                    Series
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Browse</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/genres" className="hover:text-white">
                    Genres
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-white">
                    Search
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Legal</h4>
              <p className="mt-3 text-xs text-gray-500">Informational page. Links to our catalog only.</p>
            </div>
          </div>
          <p className="mt-10 border-t border-white/5 py-4 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} {keyword}. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
```

### LEGACY: app/gomovies/page.tsx

```tsx
import GomoviesStyleLanding from "../components/keyword-landings/GomoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/gomovies`;
  return {
    title: "Gomovies - Stream Latest Movies and Series Free Online",
    description: "Gomovies brings you the latest movies and TV series in crystal clear HD. No ads interruptions, no sign-up required. Just pure entertainment.",
    keywords: "gomovies, stream movies free, latest movies, HD series, free tv shows, online cinema",
    alternates: { canonical: url },
    openGraph: {
      title: "Gomovies - Stream Latest Movies and Series Free Online",
      description: "Gomovies brings you the latest movies and TV series in crystal clear HD.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Gomovies - Free Movie and TV Series Streaming",
  intro: [
    "Welcome to Gomovies, your go-to destination for streaming the latest movies and TV shows online. Our extensive collection features everything from new releases to all-time favorites, all available to watch instantly without any cost. No registration barriers, no premium memberships – just click and enjoy.",
    "Experience seamless streaming with our user-friendly platform. Whether you're in the mood for action, comedy, drama, or anything in between, Gomovies has thousands of titles ready to watch. Updated regularly with fresh content, you'll always find something new and exciting to stream."
  ],
  sections: [
    {
      title: "Free Streaming for Everyone",
      paragraphs: [
        "Gomovies is built on the principle that great entertainment should be accessible to all. That's why everything on our platform is completely free. No hidden charges, no subscription plans, no payment details required. Simply visit, search, and start watching your chosen movie or series instantly.",
        "Unlike other platforms that bombard you with ads or force you to create accounts, Gomovies keeps things simple and straightforward. We respect your time and privacy, providing direct access to content without unnecessary obstacles or registration forms to fill out."
      ]
    },
    {
      title: "Huge Selection of Movies and Shows",
      paragraphs: [
        "Dive into our massive library containing thousands of movies across all genres. Action enthusiasts will find explosive blockbusters, horror fans can enjoy spine-chilling thrillers, and rom-com lovers have endless options for feel-good entertainment. From Hollywood hits to international cinema, Gomovies covers it all.",
        "TV series fans are equally well-served with complete seasons of popular shows. Binge-watch entire series over the weekend or catch up on episodes you missed. Our collection includes everything from classic sitcoms to the latest trending drama series, ensuring there's always something perfect for your mood."
      ]
    },
    {
      title: "HD Quality Streaming",
      paragraphs: [
        "Quality matters when it comes to enjoying movies and shows. Gomovies delivers high-definition streaming that brings out the best in every scene. Watch with crystal-clear picture quality and excellent sound, making you feel like you're right in the action.",
        "Our adaptive streaming technology ensures smooth playback regardless of your internet speed. The platform automatically optimizes video quality for your connection, preventing annoying buffering while maintaining the best possible viewing experience. Multiple server options provide alternatives if needed."
      ]
    },
    {
      title: "Watch on Any Device",
      paragraphs: [
        "Gomovies works flawlessly across all your devices. Stream on your smartphone while traveling, watch on your tablet from the comfort of your bed, or enjoy the big-screen experience on your laptop or desktop. Our responsive design adapts perfectly to any screen size.",
        "No special apps or software required – Gomovies runs directly in your web browser. This means you can start watching within seconds on any device with internet access. The same great experience is available whether you're on Windows, Mac, Android, or iOS."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#ef4444',      // Red
  secondary: '#f97316',    // Orange
  accent: '#dc2626',       // Red-600
  buttonBg: '#ef4444',
  buttonHover: '#dc2626',
  searchBorder: '#ef4444',
  searchFocus: '#dc2626',
  cardHover: '#ef4444',
  playButton: '#ef4444',
  textAccent: '#ef4444'
};

export default function GomoviesPage() {
  return (
    <GomoviesStyleLanding
      keyword="Gomovies"
      description="Watch Free Movies and TV Shows in HD"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: GomoviesStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import type { KeywordLandingProps } from "./types";

/** White doc-style body (no duplicate header — site Navbar only). */
const ACCENT = "#6366f1";

export default function GomoviesStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  const linesFromSections = content.sections.flatMap((s) => [
    `— ${s.title}`,
    ...s.paragraphs.map((p) => `  ${p}`),
  ]);

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
        {/* Narrow documentation column ~800px */}
        <main className="mx-auto max-w-[820px] px-6 py-14 md:py-20">
          <h1 className="text-center text-3xl font-bold leading-tight md:text-[2.25rem]">{content.heading}</h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-[#555]">{description}</p>

          <LandingMovieThumbnails
            count={8}
            className="mx-auto mt-12 max-w-2xl"
            gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-4"
          />

          <hr className="my-16 border-neutral-200" />

          <div className="space-y-7 text-[15px] leading-[1.75] text-[#333]">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <hr className="my-16 border-neutral-200" />

          <h2 className="text-xl font-bold">Complete overview</h2>
          <p className="mt-2 text-sm text-[#666]">Structured reference — one block per topic.</p>

          <div className="mt-10 font-mono text-[13px] leading-8 text-[#1a1a1a]">
            {linesFromSections.map((line, i) => (
              <div key={i} className="border-b border-neutral-100 py-2 last:border-0">
                {line}
              </div>
            ))}
          </div>

          <hr className="my-16 border-neutral-200" />

          <div className="flex flex-wrap gap-3">
            <Link href="/movies" className="rounded-md px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: ACCENT }}>
              Open movies
            </Link>
            <Link href="/series" className="text-sm font-medium text-[#444] underline-offset-4 hover:underline">
              TV series catalog →
            </Link>
          </div>
        </main>

        <footer className="border-t border-neutral-200 py-8 text-center text-xs text-[#666]">
          <p>© {new Date().getFullYear()} {keyword}</p>
          <div className="mt-2 flex justify-center gap-4">
            <span className="cursor-pointer hover:text-black">Terms</span>
            <span className="cursor-pointer hover:text-black">Privacy</span>
          </div>
        </footer>
      </div>
    </>
  );
}
```

### LEGACY: app/hurawatch/page.tsx

```tsx
import HurawatchStyleLanding from "../components/keyword-landings/HurawatchStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/hurawatch`;
  return {
    title: "Hurawatch - Watch Movies Online Free in HD 1080p",
    description: "Hurawatch offers premium movie streaming with HD quality. Access thousands of movies and TV shows instantly without any subscription or registration.",
    keywords: "hurawatch, HD movies, 1080p streaming, free movies, watch online, premium streaming",
    alternates: { canonical: url },
    openGraph: {
      title: "Hurawatch - Watch Movies Online Free in HD 1080p",
      description: "Hurawatch offers premium movie streaming with HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Hurawatch - Stream HD Movies and Series Online Free",
  intro: [
    "Hurawatch brings you premium streaming quality without the premium price tag. Watch thousands of movies and TV shows in stunning HD resolution, all completely free. Our platform is designed for viewers who demand quality and convenience without compromises.",
    "No account creation needed, no subscription fees to worry about. Hurawatch provides instant access to a vast entertainment library that's updated daily. From the latest blockbusters to beloved classics, find everything you want to watch in one convenient place."
  ],
  sections: [
    {
      title: "Premium HD Streaming Experience",
      paragraphs: [
        "Hurawatch specializes in delivering high-definition content that showcases movies and shows exactly as directors intended. Watch in crisp 1080p resolution with excellent audio quality that immerses you in every scene. Our commitment to quality means you never have to settle for poor picture or sound.",
        "Advanced streaming infrastructure ensures fast loading and smooth playback. Our servers are optimized to deliver consistent HD quality even during peak viewing times. Experience cinema-level quality from the comfort of your home, without the expensive theater tickets."
      ]
    },
    {
      title: "Massive Entertainment Library",
      paragraphs: [
        "Explore thousands of titles across every genre imaginable. Hurawatch's extensive catalog includes the latest theatrical releases, trending TV series, timeless classics, and hidden gems waiting to be discovered. Whether you're a casual viewer or a dedicated cinephile, our library has something special for you.",
        "Regular updates mean fresh content arrives daily. New movie releases, latest TV episodes, and recently added classics keep the selection exciting and current. Use our intuitive search and filter tools to quickly find exactly what you're in the mood to watch."
      ]
    },
    {
      title: "Simple, Fast, and Free",
      paragraphs: [
        "Hurawatch eliminates all the barriers between you and great entertainment. No registration forms, no email verification, no payment information required. Simply visit the site, find your content, and start streaming within seconds. It's entertainment made easy.",
        "Our clean, intuitive interface makes navigation effortless. Browse by genre, search for specific titles, or explore what's trending. The streamlined design puts focus on content discovery and watching, removing all unnecessary clutter and complications."
      ]
    },
    {
      title: "Watch Anytime, Anywhere",
      paragraphs: [
        "Hurawatch works perfectly on all your devices. Stream on smartphones, tablets, laptops, or desktop computers without any limitations. Our responsive platform adapts seamlessly to different screen sizes, ensuring optimal viewing experience regardless of your device.",
        "No downloads or installations needed – Hurawatch runs directly in your browser. This means you can start watching immediately on any device with internet access. Enjoy your favorite movies and shows at home, on the go, or anywhere in between."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#06b6d4',      // Cyan
  secondary: '#0891b2',    // Cyan-600
  accent: '#0e7490',       // Cyan-700
  buttonBg: '#06b6d4',
  buttonHover: '#0891b2',
  searchBorder: '#06b6d4',
  searchFocus: '#0891b2',
  cardHover: '#06b6d4',
  playButton: '#06b6d4',
  textAccent: '#06b6d4'
};

export default function HurawatchPage() {
  return (
    <HurawatchStyleLanding
      keyword="Hurawatch"
      description="Free HD Streaming Without Limits"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: HurawatchStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import type { KeywordLandingProps } from "./types";

/** Matches `hurawatch.png`: black, gold UI, cyan links, TOC, bordered tables, numbered gold sections. */
const GOLD = "#d4af37";
const CYAN = "#22d3ee";

export default function HurawatchStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-black font-sans text-white">
        {/* Hero (global Navbar only — no duplicate top bar) */}
        <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
          <h1 className="text-lg font-normal leading-snug text-white sm:text-xl md:text-2xl">
            {keyword} | {description} - Official
          </h1>
          <Link
            href="/search"
            className="mx-auto mt-6 flex w-full max-w-xl overflow-hidden rounded-lg border border-neutral-600 bg-white shadow-sm transition-opacity hover:opacity-95"
          >
            <span className="flex-1 px-4 py-3 text-left text-sm text-gray-500">Search movies and TV shows...</span>
            <span className="flex items-center px-5 py-3 text-sm font-bold text-black" style={{ backgroundColor: GOLD }}>
              Search
            </span>
          </Link>
          <Link
            href="/home"
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-black"
            style={{ backgroundColor: GOLD }}
          >
            🏠 Go To Homepage
          </Link>
          <p className="mx-auto mt-8 max-w-xl text-left text-sm leading-relaxed text-white/90">
            Watch free movies and series in HD.{" "}
            <Link href="/movies" className="underline" style={{ color: CYAN }}>
              {keyword}
            </Link>{" "}
            helps you browse our catalog quickly — no signup wall on this info page.
          </p>
        </div>

        {/* Hero banner strip (cinematic placeholder) */}
        <div className="relative mx-auto max-w-[960px] overflow-hidden px-4 sm:px-6">
          <div className="relative h-52 w-full rounded-lg bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 md:h-72">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-black tracking-tighter md:text-5xl" style={{ color: GOLD, textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
                {keyword.toUpperCase()}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-white/80 md:text-sm">WATCH FREE MOVIES ONLINE</p>
            </div>
          </div>
        </div>

        {/* SS: long-form single column ~680px */}
        <main className="mx-auto max-w-[680px] px-4 py-14 sm:px-6 md:py-16">
          <nav className="mb-14 rounded border border-neutral-700 p-5 sm:p-6">
            <p className="mb-4 text-sm font-bold" style={{ color: GOLD }}>
              Contents
            </p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {content.sections.map((s, i) => (
                <a key={s.title} href={`#hw-${i}`} className="text-left text-sm underline" style={{ color: CYAN }}>
                  {i + 1}) {s.title}
                </a>
              ))}
            </div>
          </nav>

          <h2 className="text-center text-xl font-bold md:text-2xl">{content.heading}</h2>
          <div className="mt-8 space-y-5 text-sm leading-[1.75] text-white/85">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse border border-white text-left text-sm">
              <thead>
                <tr>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Feature
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    What you get
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.sections.slice(0, 3).map((s, i) => (
                  <tr key={s.title}>
                    <td className="border border-white p-2 text-white/90">{s.title}</td>
                    <td className="border border-white p-2 text-white/70">{s.paragraphs[0]?.slice(0, 70)}…</td>
                    <td className="border border-white p-2 text-white/60">Updated</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse border border-white text-left text-sm">
              <thead>
                <tr>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    vs
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Our catalog
                  </th>
                  <th className="border border-white p-2 font-bold" style={{ color: GOLD }}>
                    Typical paid apps
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-white p-2">Library</td>
                  <td className="border border-white p-2 text-white/80">Large browse index</td>
                  <td className="border border-white p-2 text-white/80">Subscription gated</td>
                </tr>
                <tr>
                  <td className="border border-white p-2">Cost</td>
                  <td className="border border-white p-2 text-white/80">Free browsing</td>
                  <td className="border border-white p-2 text-white/80">Monthly fee</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-16 space-y-14 md:space-y-16">
            {content.sections.map((section, idx) => (
              <article key={section.title} id={`hw-${idx}`} className="scroll-mt-28">
                <h3 className="text-lg font-bold md:text-xl" style={{ color: GOLD }}>
                  {idx + 1}) {section.title}
                </h3>
                <ul className="mt-5 list-disc space-y-4 pl-6 text-sm leading-[1.75] text-white/90 marker:text-cyan-400">
                  {section.paragraphs.map((para, j) => (
                    <li key={j}>{para}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <section className="mt-16 border-t border-neutral-800 pt-12">
            <h3 className="text-lg font-bold" style={{ color: GOLD }}>
              14) FAQs
            </h3>
            {content.sections.slice(0, 2).map((s) => (
              <div key={s.title} className="mt-6">
                <p className="font-bold" style={{ color: CYAN }}>
                  {s.title}?
                </p>
                <p className="mt-2 text-sm text-white/85">{s.paragraphs[0]}</p>
              </div>
            ))}
          </section>
        </main>

        <footer className="bg-neutral-900 py-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} {keyword} All Rights Reserved
        </footer>
      </div>
    </>
  );
}
```

### LEGACY: app/lookmovie/page.tsx

```tsx
import LookmovieStyleLanding from "../components/keyword-landings/LookmovieStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/lookmovie`;
  return {
    title: "Lookmovie - Stream HD Movies and Shows Instantly",
    description: "Lookmovie offers instant streaming of movies and TV series in superb quality. Browse thousands of titles and watch immediately without any fees.",
    keywords: "lookmovie, instant streaming, HD movies, watch shows, free platform, online entertainment",
    alternates: { canonical: url },
    openGraph: {
      title: "Lookmovie - Stream HD Movies and Shows Instantly",
      description: "Lookmovie offers instant streaming of movies and TV series in superb quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Lookmovie - Watch Free Movies and TV Series Online",
  intro: [
    "Look no further than Lookmovie for all your streaming entertainment needs! Our platform provides instant access to thousands of movies and TV shows, all available to watch completely free. No registration barriers, no subscription fees – just pure entertainment ready to stream whenever you want it.",
    "Lookmovie combines a massive content library with user-friendly design to create the perfect streaming experience. Whether you're searching for the latest releases or classic favorites, our organized platform makes finding and watching content effortless. Start streaming now and see why viewers choose Lookmovie."
  ],
  sections: [
    {
      title: "Instant Streaming Access",
      paragraphs: [
        "Lookmovie delivers on its promise of instant entertainment. Click on any movie or show and start watching within seconds. No waiting for downloads, no buffering delays, no complicated setup. Our fast servers and optimized streaming technology ensure you spend more time watching and less time waiting.",
        "The streamlined platform eliminates all unnecessary steps between you and your entertainment. No account creation forms to fill out, no email verification to complete, no payment information to provide. Lookmovie respects your time by offering direct access to content immediately."
      ]
    },
    {
      title: "Comprehensive Entertainment Library",
      paragraphs: [
        "Browse through thousands of carefully selected titles covering every genre and style. Lookmovie's extensive library includes latest releases, timeless classics, popular TV series, and hidden gems waiting to be discovered. From Hollywood blockbusters to international films, from mainstream shows to cult favorites, we have something for everyone.",
        "Our collection is constantly updated with fresh content. New movies and TV episodes are added regularly, ensuring there's always something new to watch. Use our advanced search and filter options to quickly find exactly what you're in the mood for, whether that's a specific title or just something in a particular genre."
      ]
    },
    {
      title: "High-Quality Viewing Experience",
      paragraphs: [
        "Lookmovie prioritizes streaming quality to ensure you enjoy every movie and show at its best. Watch in high definition with clear picture and excellent sound quality. Our platform is optimized to deliver smooth playback that does justice to the content creators' vision.",
        "Smart adaptive streaming adjusts video quality based on your internet connection, maintaining smooth playback while maximizing picture clarity. Multiple server options ensure you always have alternatives if one is experiencing issues, guaranteeing reliable access to your chosen entertainment."
      ]
    },
    {
      title: "Free and Always Accessible",
      paragraphs: [
        "Lookmovie is completely free now and will remain free forever. No premium memberships, no subscription tiers, no hidden costs. Every movie and show you see is available to watch immediately without spending anything. We believe in making entertainment accessible to all, regardless of financial circumstances.",
        "Access Lookmovie from any device – smartphone, tablet, laptop, or desktop. The responsive design works flawlessly across all screen sizes and operating systems. No apps to install means you can start streaming immediately from any device with a web browser and internet connection."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#a855f7',      // Purple-500
  secondary: '#c084fc',    // Purple-400
  accent: '#9333ea',       // Purple-600
  buttonBg: '#a855f7',
  buttonHover: '#9333ea',
  searchBorder: '#a855f7',
  searchFocus: '#9333ea',
  cardHover: '#a855f7',
  playButton: '#a855f7',
  textAccent: '#a855f7'
};

export default function LookmoviePage() {
  return (
    <LookmovieStyleLanding
      keyword="Lookmovie"
      description="Look and Stream - Entertainment Made Easy"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: LookmovieStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { SearchLinkPill } from "./SearchLinkPill";
import type { KeywordLandingProps } from "./types";

/** Lookmovie-style hero (no duplicate top nav — site Navbar only). */
export default function LookmovieStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const socials = [
    { bg: "#1877f2", label: "Facebook", abbr: "f" },
    { bg: "#555555", label: "Email", abbr: "@" },
    { bg: "#e60023", label: "Pinterest", abbr: "P" },
    { bg: "#ff4500", label: "Reddit", abbr: "r" },
    { bg: "#25d366", label: "WhatsApp", abbr: "W" },
  ];

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-[#1a1a1a] font-sans text-white">
        <div className="mx-auto max-w-[720px] px-4 py-10 text-center sm:px-6 md:py-14">
          <div className="mb-4 flex justify-center gap-1 text-xl font-black tracking-tight">
            <span>LOOK</span>
            <span className="rounded bg-red-600 px-2 py-0.5 text-sm text-white">MOVIE</span>
          </div>
          <h1 className="text-lg font-semibold leading-snug text-white md:text-2xl">
            {keyword} Official Website — stream and browse movies &amp; series in multiple qualities.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400">{description}</p>

          <div className="mx-auto mt-8 max-w-xl">
            <SearchLinkPill placeholder="Search Movies" />
          </div>

          <p className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
            <Link href="/movies" className="hover:text-green-400">
              Browse Movies
            </Link>
            <span>·</span>
            <Link href="/series" className="hover:text-green-400">
              Browse Series
            </Link>
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {socials.map((s) => (
              <span
                key={s.label}
                title={s.label}
                className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold text-white"
                style={{ backgroundColor: s.bg }}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[11px] font-bold">{s.abbr}</span>
                {s.label}
              </span>
            ))}
          </div>

          <Link
            href="/movies"
            className="mt-10 flex w-full max-w-xl mx-auto items-center justify-center gap-2 border border-white/20 bg-black py-3.5 text-sm font-bold text-white hover:bg-neutral-900"
          >
            Go To {keyword} →
          </Link>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {["Browse All", "Latest Movies", "Latest Series", "Trending", "Hindi"].map((t) => (
              <span key={t} className="cursor-pointer rounded border border-white/20 bg-black px-3 py-1.5 text-xs hover:bg-neutral-900">
                {t}
              </span>
            ))}
          </div>

          <p className="mt-10 text-center text-xs font-semibold text-gray-400 md:text-left">Browse by year</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {years.map((y) => (
              <Link
                key={y}
                href={`/year/${y}`}
                className="min-w-[3rem] border border-white/15 bg-[#2a2a2a] px-2 py-1.5 text-center text-xs hover:bg-neutral-800"
              >
                {y}
              </Link>
            ))}
            <span className="border border-white/15 bg-[#2a2a2a] px-2 py-1.5 text-xs">&gt;&gt;</span>
          </div>

          <div className="mx-auto mt-12 w-full max-w-xl rounded border border-green-600/40 bg-green-950/30 p-4 text-left text-sm">
            <p className="text-green-400">★ Popular downloads &amp; official domain notice</p>
            <p className="mt-2 text-gray-300">
              Use our built-in catalog: <Link href="/movies" className="text-green-400 underline">Movies</Link> and{" "}
              <Link href="/series" className="text-green-400 underline">Series</Link>. This page explains features only.
            </p>
          </div>
        </div>

        <main className="mx-auto max-w-[720px] space-y-10 px-4 py-10 text-left text-sm leading-[1.75] text-gray-300 sm:px-6">
          <h2 className="text-xl font-bold text-white">{content.heading}</h2>
          {content.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {content.sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-lg font-bold text-white">{section.title}</h3>
              {section.paragraphs.map((para, j) => (
                <p key={j} className="mt-3">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </main>

        <footer className="border-t border-neutral-800 bg-black py-10 text-center text-[11px] leading-relaxed text-gray-500">
          <p>
            {keyword} © 2011 - {new Date().getFullYear()}
          </p>
          <div className="mx-auto mt-4 flex max-w-[720px] flex-wrap justify-center gap-x-3 gap-y-1 px-4">
            {["Browse Movies", "Browse Series", "Trending", "About", "Contact", "Disclaimer", "Privacy", "Terms"].map((t) => (
              <span key={t} className="cursor-pointer hover:text-gray-300">
                {t}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-[10px] text-gray-600">
            {keyword} {keyword.toLowerCase()} watch movies online free streaming HD official guide information
          </p>
        </footer>
      </div>
    </>
  );
}
```

### LEGACY: app/popcornflix/page.tsx

```tsx
import PopcornflixStyleLanding from "../components/keyword-landings/PopcornflixStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/popcornflix`;
  return {
    title: "Popcornflix - Free Movie Streaming Platform Online",
    description: "Popcornflix delivers free streaming of popular movies and series. No subscription required. Enjoy unlimited entertainment in excellent quality anytime.",
    keywords: "popcornflix, free movie platform, stream online, watch movies, TV series free, entertainment hub",
    alternates: { canonical: url },
    openGraph: {
      title: "Popcornflix - Free Movie Streaming Platform Online",
      description: "Popcornflix delivers free streaming of popular movies and series.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Popcornflix - Stream Free Movies and Shows Online",
  intro: [
    "Grab your popcorn and settle in for unlimited entertainment with Popcornflix! Our platform brings you a fantastic selection of movies and TV shows, all available to stream for free. No subscriptions, no sign-ups, no payment required – just instant access to thousands of hours of entertainment.",
    "Popcornflix makes movie night every night with our easy-to-use streaming platform. Whether you're in the mood for action, comedy, drama, or anything in between, our diverse library has something perfect for every viewer. Start watching immediately and discover your next favorite film or series."
  ],
  sections: [
    {
      title: "Free Entertainment for All",
      paragraphs: [
        "Popcornflix believes great movies and shows should be available to everyone, which is why we offer completely free streaming. No subscription plans to choose from, no trial periods that expire, no credit card information needed. Simply visit Popcornflix, find what you want to watch, and start streaming instantly.",
        "Our commitment to free entertainment means you can enjoy unlimited viewing without worrying about costs. Watch as many movies and shows as you want, whenever you want. Popcornflix is here to provide quality entertainment without financial barriers, making cinema accessible to all."
      ]
    },
    {
      title: "Diverse Content Library",
      paragraphs: [
        "Dive into our carefully curated collection of movies spanning all genres and styles. Action-packed blockbusters, hilarious comedies, gripping dramas, scary horror films, heartwarming romances – Popcornflix offers variety that keeps every viewing session fresh and exciting. From mainstream hits to hidden gems, there's always something new to discover.",
        "TV series enthusiasts will find plenty to love with our selection of complete seasons and popular shows. Binge-watch entire series over a weekend or savor them episode by episode. Our library includes both classic series that defined television and newer shows that are currently trending."
      ]
    },
    {
      title: "Simple, Fast Streaming",
      paragraphs: [
        "Popcornflix is designed for hassle-free streaming. The intuitive interface makes finding content quick and easy. Browse by genre, search for specific titles, or explore featured collections. Everything is organized logically to help you find exactly what you're looking for without frustration.",
        "Our optimized streaming technology ensures smooth playback with minimal buffering. Videos load quickly and play reliably, letting you focus on enjoying the content rather than dealing with technical issues. Multiple quality options allow you to balance picture clarity with your internet speed."
      ]
    },
    {
      title: "Watch Anywhere, Anytime",
      paragraphs: [
        "Popcornflix works perfectly across all your devices. Stream on your phone during your daily commute, watch on your tablet while relaxing, or enjoy the big-screen experience on your computer. The responsive platform adapts seamlessly to any screen size for optimal viewing.",
        "No apps or downloads required – Popcornflix runs directly in your web browser. This means instant access from any device with internet connectivity. Whether you're at home, at work, or traveling, your entertainment is always just a click away with Popcornflix."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#dc2626',      // Red-600
  secondary: '#fbbf24',    // Amber-400  
  accent: '#b91c1c',       // Red-700
  buttonBg: '#dc2626',
  buttonHover: '#b91c1c',
  searchBorder: '#dc2626',
  searchFocus: '#b91c1c',
  cardHover: '#dc2626',
  playButton: '#dc2626',
  textAccent: '#dc2626'
};

export default function PopcornflixPage() {
  return (
    <PopcornflixStyleLanding
      keyword="Popcornflix"
      description="Pop Some Corn and Start Streaming"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: PopcornflixStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import type { KeywordLandingProps } from "./types";

/** Matches `popcornflix.png`: near-black page + bottom-right cookie consent card (Accept / Decline). */
const BG = "#0a0a14";

export default function PopcornflixStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  return (
    <>
      <StructuredData type="website" />
      <div className="relative flex min-h-screen flex-col font-sans text-gray-300" style={{ backgroundColor: BG }}>
        {/* No duplicate header — site Navbar only. Cookie bottom-right. */}
        <main className="mx-auto w-full max-w-[640px] flex-1 px-4 py-12 pb-56 sm:px-6 md:py-16">
          <h1 className="text-2xl font-bold text-white md:text-3xl">{content.heading}</h1>
          <p className="mt-3 text-sm text-gray-400">{description}</p>
          <div className="mt-8 space-y-4 text-sm leading-relaxed">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-12 space-y-10">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="mt-3">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </main>

        {/* Cookie consent — position & style per screenshot */}
        <div
          className="fixed bottom-4 right-4 z-50 w-[min(calc(100vw-2rem),360px)] rounded-xl border border-neutral-200 bg-white p-4 pr-5 pt-6 shadow-xl sm:bottom-5 sm:right-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <button
            type="button"
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white"
            aria-label="Close"
          >
            ×
          </button>
          <p className="text-xs leading-relaxed text-gray-600">
            This site uses cookies to improve performance and your experience. Read our{" "}
            <span className="cursor-pointer font-medium text-red-600">privacy policy</span>. By clicking Accept you
            consent to cookies as described.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-lg bg-gradient-to-b from-red-600 to-red-800 py-2.5 text-sm font-bold text-white"
            >
              Accept
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-gradient-to-b from-neutral-700 to-neutral-900 py-2.5 text-sm font-bold text-white"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
```

### LEGACY: app/soap2day/page.tsx

```tsx
import Soap2dayStyleLanding from "../components/keyword-landings/Soap2dayStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/soap2day`;
  return {
    title: "Soap2Day - Watch Free Movies Online in HD Quality",
    description: "Soap2Day provides instant access to thousands of movies and shows in stunning HD quality. Stream your favorite content without registration or fees.",
    keywords: "soap2day, free streaming, HD movies, watch online, tv series streaming, no registration",
    alternates: { canonical: url },
    openGraph: {
      title: "Soap2Day - Watch Free Movies Online in HD Quality",
      description: "Soap2Day provides instant access to thousands of movies and shows in stunning HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Soap2Day - Watch Movies and TV Shows Free Online",
  intro: [
    "Soap2Day brings you an incredible selection of movies and TV series, all available to stream for free. No sign-up hassles, no payment required – just pure entertainment at your fingertips. Our easy-to-use platform makes finding and watching your favorite content effortless.",
    "Join millions of viewers who choose Soap2Day for their daily entertainment fix. Whether you're looking for the newest movie releases or want to catch up on trending TV series, we've got you covered with high-quality streams and a constantly updated library."
  ],
  sections: [
    {
      title: "What Makes Soap2Day Special",
      paragraphs: [
        "Soap2Day has earned its reputation as a trusted streaming destination through consistent quality and reliability. Our platform offers instant access to thousands of movies and shows without requiring account creation. Simply browse, click, and enjoy – it's that straightforward.",
        "We pride ourselves on maintaining an extensive, well-organized library that caters to all tastes. From action-packed blockbusters to heartwarming dramas, from comedy series to documentary specials, Soap2Day delivers variety that keeps viewers coming back daily."
      ]
    },
    {
      title: "Watch Anywhere, Anytime",
      paragraphs: [
        "Soap2Day works perfectly across all your devices. Whether you're on your phone during a commute, relaxing with a tablet, or enjoying the big screen experience on your laptop, our responsive platform adapts seamlessly. No apps to download, no complicated setup required.",
        "The intuitive interface makes navigation a breeze even for first-time users. Search for specific titles, browse by category, or explore what's trending. Our clean design puts content front and center, eliminating distractions and making your viewing experience smooth and enjoyable."
      ]
    },
    {
      title: "High-Quality Streaming",
      paragraphs: [
        "Enjoy your favorite movies and shows in crisp, clear quality. Soap2Day optimizes streaming to deliver the best possible viewing experience based on your internet connection. Our servers are designed to minimize buffering and provide consistent playback quality.",
        "Multiple streaming links ensure you always have options if one server is busy or slow. The smart player technology adjusts video quality automatically, balancing picture clarity with smooth playback to prevent interruptions during your favorite scenes."
      ]
    },
    {
      title: "Always Free, Always Updated",
      paragraphs: [
        "Soap2Day remains committed to providing free entertainment for everyone. No subscriptions, no trials, no hidden fees – ever. Our mission is to make quality content accessible to all viewers regardless of their financial situation.",
        "Fresh content arrives regularly as we continuously expand our library. New movie releases, latest TV episodes, and classic titles are added frequently. Check back often to discover new additions and never miss out on trending entertainment."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#10b981',      // Green
  secondary: '#14b8a6',    // Teal
  accent: '#059669',       // Emerald
  buttonBg: '#10b981',
  buttonHover: '#059669',
  searchBorder: '#10b981',
  searchFocus: '#059669',
  cardHover: '#10b981',
  playButton: '#10b981',
  textAccent: '#10b981'
};

export default function Soap2DayPage() {
  return (
    <Soap2dayStyleLanding
      keyword="Soap2Day"
      description="Instant Access to Premium Entertainment"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: Soap2dayStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import type { KeywordLandingProps } from "./types";

/** Matches `soap2day.png`: light grey-blue bg, teal accent, nav text links, big bordered search → /search, CTA, social row, dark footer. */
const TEAL = "#5fd4cf";
const PAGE = "#f0f4f8";

export default function Soap2dayStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen font-sans" style={{ backgroundColor: PAGE }}>
        <div className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6 md:py-16">
          <div className="text-3xl font-black md:text-4xl" style={{ color: TEAL }}>
            🎬 {keyword}
          </div>
          <p className="mt-3 text-sm text-gray-600">{description}</p>

          <p className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] font-bold tracking-wide text-gray-600">
            <Link href="/home" className="hover:text-black">
              HOME
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/movies" className="hover:text-black">
              MOVIES
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/series" className="hover:text-black">
              TV SHOWS
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/genres" className="hover:text-black">
              GENRES
            </Link>
          </p>

          <Link
            href="/search"
            className="mx-auto mt-8 flex w-full min-h-[52px] items-stretch overflow-hidden rounded-xl border-[5px] bg-white text-left shadow-md transition-opacity hover:opacity-95"
            style={{ borderColor: TEAL }}
          >
            <span className="flex flex-1 items-center px-5 text-sm text-gray-500">Search movies and TV shows...</span>
            <span className="flex items-center px-4 text-gray-500" aria-hidden>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </Link>

          <Link
            href="/movies"
            className="mt-6 inline-block rounded-full px-10 py-3 text-sm font-bold text-white shadow-md"
            style={{ backgroundColor: TEAL }}
          >
            Enter to {keyword} &gt;&gt;
          </Link>

          <div className="mt-6 flex justify-center gap-2">
            {["#1da1f2", "#1877f2", "#ff4500", "#333"].map((c, i) => (
              <span key={i} className="h-9 w-9 rounded-full shadow" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <main className="mx-auto max-w-[800px] px-4 pb-20 sm:px-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold text-gray-500">Preview — filters (UI sample)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Sort by", "Genre", "Year", "IMDb"].map((x) => (
                <span
                  key={x}
                  className="rounded border px-3 py-1 text-xs font-semibold text-gray-700"
                  style={{ borderColor: TEAL, color: "#334155" }}
                >
                  {x} ▾
                </span>
              ))}
            </div>
            <div className="mt-4">
              <LandingMovieThumbnails
                count={8}
                className="mx-auto mt-0 w-full max-w-none"
                gridClassName="grid grid-cols-4 gap-2"
              />
            </div>
          </div>

          <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-gray-700">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span>🔍</span> Advanced search on {keyword}
              </h2>
              {content.intro.map((p, i) => (
                <p key={i} className="mt-3">
                  {p}
                </p>
              ))}
            </section>

            {content.sections.map((section, idx) => (
              <section key={section.title}>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span>{idx === 0 ? "🤖" : idx === 1 ? "📣" : "📌"}</span>
                  {section.title}
                </h2>
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="mt-3">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </main>

        <footer className="bg-[#1a1a1a] py-12 text-gray-400">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
            <div>
              <h3 className="font-bold text-white">Info</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>About</li>
                <li>Privacy</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white">Genres</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Horror</li>
                <li>Drama</li>
                <li>Animation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white">{keyword}</h3>
              <p className="mt-3 text-sm">Follow updates — browse our movie &amp; series index.</p>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-5xl px-4 text-center text-2xl font-black" style={{ color: TEAL }}>
            🎬 {keyword}
          </div>
          <p className="mt-6 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} · {keyword} · watch movies online
          </p>
        </footer>
      </div>
    </>
  );
}
```

### LEGACY: app/solarmovie/page.tsx

```tsx
import SolarmovieStyleLanding from "../components/keyword-landings/SolarmovieStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/solarmovie`;
  return {
    title: "Solarmovie - Watch Free Movies and TV Shows Online",
    description: "Solarmovie brings you unlimited streaming of movies and TV series. High-quality playback with no subscription fees. Your entertainment hub.",
    keywords: "solarmovie, free movies, online streaming, TV shows free, HD streaming, watch series",
    alternates: { canonical: url },
    openGraph: {
      title: "Solarmovie - Watch Free Movies and TV Shows Online",
      description: "Solarmovie brings you unlimited streaming of movies and TV series in HD.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Solarmovie - Free Movie and TV Series Streaming Platform",
  intro: [
    "Solarmovie shines as one of the premier destinations for free online streaming. Watch an incredible selection of movies and TV shows without spending a dime. Our platform offers instant access to thousands of titles across all genres, ready to stream in excellent quality whenever you want.",
    "No registration hassles, no subscription fees, no payment information required. Solarmovie keeps streaming simple and straightforward. Just browse our extensive library, pick what you want to watch, and start streaming immediately. It's entertainment made easy and accessible for everyone."
  ],
  sections: [
    {
      title: "Your Free Streaming Destination",
      paragraphs: [
        "Solarmovie has built a reputation as a trusted platform for free entertainment. We provide unrestricted access to a vast collection of movies and TV series without any cost barriers. Whether you're a casual viewer or a dedicated binge-watcher, Solarmovie welcomes you with open arms and endless content.",
        "Our mission is simple: make quality entertainment accessible to everyone, everywhere. No paywalls, no premium tiers, no hidden charges. Everything you see on Solarmovie is completely free to stream. This commitment to accessibility has made us a favorite among millions of viewers worldwide."
      ]
    },
    {
      title: "Extensive Movie and TV Library",
      paragraphs: [
        "Explore thousands of movies spanning every genre and decade. From latest releases to golden-age classics, from Hollywood blockbusters to international cinema, Solarmovie's library is designed to satisfy all tastes. Action, comedy, drama, horror, romance, sci-fi, thriller – we have comprehensive coverage of every category.",
        "TV series fans will appreciate our complete collection of popular shows. Watch full seasons of your favorite series, discover new shows to love, or revisit classic episodes. Both current ongoing series and completed shows are available, giving you total freedom in how you consume content."
      ]
    },
    {
      title: "Quality Streaming Experience",
      paragraphs: [
        "Solarmovie prioritizes delivering smooth, high-quality streams. Watch movies and shows with clear picture quality and excellent sound. Our servers are optimized for reliable performance, ensuring minimal interruptions and maximum enjoyment during your viewing sessions.",
        "Smart streaming technology adapts to your internet connection, automatically adjusting quality to prevent buffering while maintaining the best possible picture. Multiple server options provide backup choices if one is experiencing issues, ensuring you can always find a working stream."
      ]
    },
    {
      title: "Easy Access Across All Devices",
      paragraphs: [
        "Solarmovie works seamlessly on any device with a web browser. Stream on your smartphone while commuting, watch on your tablet from bed, or enjoy the full experience on your laptop or desktop computer. No apps to download, no installations required – just open your browser and start watching.",
        "The responsive design ensures optimal viewing experience regardless of screen size. Whether you're on a small phone screen or a large desktop monitor, Solarmovie adapts perfectly to provide comfortable navigation and excellent playback quality. Entertainment is truly portable with Solarmovie."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#f97316',      // Orange
  secondary: '#fb923c',    // Orange-400
  accent: '#ea580c',       // Orange-600
  buttonBg: '#f97316',
  buttonHover: '#ea580c',
  searchBorder: '#f97316',
  searchFocus: '#ea580c',
  cardHover: '#f97316',
  playButton: '#f97316',
  textAccent: '#f97316'
};

export default function SolarmoviesPage() {
  return (
    <SolarmovieStyleLanding
      keyword="Solarmovie"
      description="Streaming Sunshine for Movie Lovers"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: SolarmovieStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import LandingMovieThumbnails from "./LandingMovieThumbnails";
import type { KeywordLandingProps } from "./types";

/** Matches `solarmovie.png`: keyword + search pill (→ /search), white body, hero banner + quick picks sidebar, poster grids, footer links. */
const NAVY = "#0d253f";
const BLUE = "#3b82f6";

export default function SolarmovieStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  const picks = [
    { rank: 1, title: "Featured pick", type: "Movie", rating: "8.1" },
    { rank: 2, title: "Trending drama", type: "TV Series", rating: "7.6" },
    { rank: 3, title: "Action night", type: "Movie", rating: "7.9" },
    { rank: 4, title: "Binge bundle", type: "TV Series", rating: "8.0" },
    { rank: 5, title: "Family watch", type: "Movie", rating: "7.2" },
    { rank: 6, title: "Sci‑fi hub", type: "TV Series", rating: "7.8" },
  ];

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-white font-sans text-[#111]">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-bold text-[#0d253f]">{keyword}</p>
            <Link
              href="/search"
              className="flex w-full max-w-md items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-500 shadow-sm transition-colors hover:border-gray-300 sm:ml-auto sm:w-auto"
            >
              <span className="shrink-0 text-gray-400" aria-hidden>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <span className="truncate">Search for Movies and Series...</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="relative overflow-hidden rounded-xl bg-neutral-900">
              <div className="relative aspect-[21/9] w-full bg-gradient-to-br from-slate-700 via-slate-900 to-slate-950">
                <div className="absolute bottom-4 left-4 max-w-md rounded-lg bg-black/70 p-4 text-white backdrop-blur-sm">
                  <p className="text-xl font-bold">Spotlight title</p>
                  <p className="mt-2 text-sm text-white/85">{description}</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="rounded bg-white/20 px-2 py-0.5">Movie</span>
                    <span className="text-white/70">2025</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-xl p-4 text-white lg:sticky lg:top-4" style={{ backgroundColor: NAVY }}>
              <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
                <span style={{ color: BLUE }}>📈</span> QUICK PICKS
              </div>
              <ul className="mt-4 space-y-3">
                {picks.map((p) => (
                  <li key={p.rank} className="flex gap-3 text-sm">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: BLUE }}
                    >
                      {p.rank}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="text-xs text-white/60">
                        {p.type} · <span className="text-amber-300">★</span> {p.rating}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <section className="mt-12">
            <h2 className="text-lg font-bold text-black">Popular movies &amp; series</h2>
            <LandingMovieThumbnails
              count={16}
              className="mx-auto mt-4 w-full max-w-none"
              gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
            />
          </section>

          <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-black">
              <span className="text-green-600">☰</span> What to watch
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {content.heading}.{" "}
              <Link href="/movies" className="font-medium" style={{ color: BLUE }}>
                Browse movies
              </Link>{" "}
              or{" "}
              <Link href="/series" className="font-medium" style={{ color: BLUE }}>
                TV series
              </Link>
              . {content.intro[0]?.slice(0, 180)}…
            </p>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h3 className="font-bold text-black">{section.title}</h3>
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="mt-2">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 border-t border-gray-200 pt-8 text-sm text-gray-500">
            {["About Us", "Disclaimer", "Privacy", "Terms", "DMCA", "Contact"].map((t) => (
              <span key={t} className="cursor-pointer hover:text-black">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} {keyword} · Informational landing
          </p>
        </div>
      </div>
    </>
  );
}
```

### LEGACY: app/yesmovies/page.tsx

```tsx
import YesmoviesStyleLanding from "../components/keyword-landings/YesmoviesStyleLanding";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getCanonicalBase();
  const url = `${base}/yesmovies`;
  return {
    title: "Yesmovies - Free Online Movie Streaming in High Quality",
    description: "Yesmovies provides free access to movies and TV series. Stream in HD with no buffering, no registration needed. Your ultimate movie streaming destination.",
    keywords: "yesmovies, free streaming platform, HD movies, online series, movie streaming, watch free",
    alternates: { canonical: url },
    openGraph: {
      title: "Yesmovies - Free Online Movie Streaming in High Quality",
      description: "Yesmovies provides free access to movies and TV series in HD quality.",
      type: "website",
      url,
    },
  };
}

const content = {
  heading: "Yesmovies - Watch Free Movies and TV Shows Online",
  intro: [
    "Say yes to unlimited entertainment with Yesmovies! Our platform delivers an extensive collection of movies and TV series, all available to stream instantly and completely free. No registration required, no hidden fees – just straightforward access to thousands of hours of quality content.",
    "Yesmovies makes streaming simple and enjoyable. Whether you're looking for the latest releases or want to revisit classic favorites, our well-organized library has you covered. Start watching within seconds and discover why millions choose Yesmovies for their entertainment needs."
  ],
  sections: [
    {
      title: "Why Choose Yesmovies",
      paragraphs: [
        "Yesmovies stands out as a reliable, user-friendly streaming platform that puts viewers first. We've eliminated all the frustrating barriers that plague other streaming sites. No forced sign-ups, no payment walls, no complicated navigation – just pure, uninterrupted entertainment available at your fingertips.",
        "Our platform is built around you and your viewing preferences. The clean interface makes finding content effortless, while our powerful search functionality helps you locate specific titles in seconds. Yesmovies respects your time by providing direct access to what you want to watch."
      ]
    },
    {
      title: "Endless Entertainment Options",
      paragraphs: [
        "Dive into a massive library featuring movies from every genre and era. Action-packed adventures, heartwarming romances, spine-tingling horrors, laugh-out-loud comedies – Yesmovies has it all. From Hollywood blockbusters to independent films, from mainstream hits to cult classics, our diverse collection ensures you'll never run out of options.",
        "TV series enthusiasts will love our comprehensive collection of complete seasons. Binge-watch your favorite shows, discover new series to follow, or catch up on episodes you missed. Both ongoing series and completed shows are available, giving you the freedom to watch at your own pace."
      ]
    },
    {
      title: "High-Quality Streaming",
      paragraphs: [
        "Enjoy movies and shows in excellent quality with Yesmovies. Our streams are optimized to deliver clear picture and crisp audio, ensuring an immersive viewing experience. We understand that quality matters, which is why we prioritize delivering the best possible streams for every title.",
        "Smart adaptive streaming technology adjusts to your internet connection speed, preventing buffering while maintaining optimal quality. Whether you're on high-speed broadband or mobile data, Yesmovies provides smooth, consistent playback that keeps you engaged in the story."
      ]
    },
    {
      title: "Always Free, Always Accessible",
      paragraphs: [
        "Yesmovies is committed to keeping entertainment free and accessible for everyone. No subscription fees today, tomorrow, or ever. No premium tiers or hidden costs. Everything you see on Yesmovies is available to watch immediately without spending a penny.",
        "Access Yesmovies from any device with a web browser. Watch on your phone, tablet, laptop, or desktop – the platform works seamlessly across all devices. No apps to install, no compatibility issues to worry about. Just open your browser and start streaming instantly."
      ]
    }
  ]
};

const colorTheme = {
  primary: '#f59e0b',      // Darker Amber - Better contrast
  secondary: '#d97706',    // Amber-600
  accent: '#b45309',       // Amber-700 - Much more readable
  buttonBg: '#f59e0b',
  buttonHover: '#d97706',
  searchBorder: '#f59e0b',
  searchFocus: '#d97706',
  cardHover: '#f59e0b',
  playButton: '#f59e0b',
  textAccent: '#d97706'
};

export default function YesmoviesPage() {
  return (
    <YesmoviesStyleLanding
      keyword="Yesmovies"
      description="Say Yes to Free Entertainment"
      colorTheme={colorTheme}
      content={content}
    />
  );
}
```

### LEGACY: YesmoviesStyleLanding.tsx

```tsx
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import type { KeywordLandingProps } from "./types";

/** Matches `yesmovies.png`: black bg, red/yellow headings, cyan brand highlights, blue CTA, orange-bordered table, FAQ. */
const RED = "#ff0000";
const YELLOW = "#ffff00";
const CYAN = "#00ffff";
const BLUE = "#2563eb";
const ORANGE_BORDER = "#ffa500";

function highlightBrand(text: string, brand: string) {
  const re = new RegExp(`(${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) =>
    part.toLowerCase() === brand.toLowerCase() ? (
      <span key={i} style={{ color: CYAN }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function YesmoviesStyleLanding({
  keyword,
  description,
  content,
}: KeywordLandingProps) {
  const brand = keyword;
  const tableRows = [
    { rank: "1", title: "Spotlight A", genre: "Action", director: "TBA", note: "Fan favorite pick" },
    { rank: "2", title: "Spotlight B", genre: "Drama", director: "TBA", note: "Strong story" },
    { rank: "3", title: "Spotlight C", genre: "Sci‑Fi", director: "TBA", note: "Visual heavy" },
    { rank: "4", title: "Spotlight D", genre: "Thriller", director: "TBA", note: "Fast pace" },
    { rank: "5", title: "Spotlight E", genre: "Comedy", director: "TBA", note: "Light watch" },
  ];

  return (
    <>
      <StructuredData type="website" />
      <div className="min-h-screen bg-[#121212] font-sans text-white">
        {/* SS: centered narrow hero column */}
        <div className="mx-auto max-w-[640px] px-4 py-10 text-center sm:px-6 md:py-14">
          <div className="text-4xl font-black md:text-5xl">
            <span style={{ color: RED }}>YES</span>
            <span className="text-white drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]">MOVIES</span>
          </div>
          <h1 className="mt-6 text-xl font-bold md:text-2xl" style={{ color: YELLOW }}>
            {keyword} Official – Watch Latest Movies &amp; TV Shows Online
          </h1>
          <p className="mt-2 text-sm text-white/70">{description}</p>

          <Link
            href="/search"
            className="mx-auto mt-6 flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-[#2a2a2a] px-5 py-3 text-left text-sm text-gray-500 transition-colors hover:border-white/20 hover:bg-[#333]"
          >
            <span className="flex-1">Search titles…</span>
            <svg className="h-5 w-5 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          <Link
            href="/movies"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: BLUE }}
          >
            Watch Movies NOW ▶
          </Link>

          <div className="mt-10 space-y-4 text-left text-sm leading-[1.75]">
            {content.intro.map((p, i) => (
              <p key={i}>{highlightBrand(p, brand)}</p>
            ))}
          </div>
        </div>

        {/* SS: wide cinematic strip */}
        <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-gradient-to-br from-orange-900 via-red-900 to-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gradient-to-b from-white to-yellow-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl">
                {keyword.toUpperCase().replace(/\s/g, "")}.SITE
              </span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-[680px] space-y-14 px-4 py-12 sm:px-6 md:space-y-16 md:py-16">
          {content.sections.map((section) => (
            <section key={section.title} className="text-left">
              <h2 className="text-center text-lg font-bold md:text-left md:text-xl" style={{ color: RED }}>
                {section.title}
              </h2>
              {section.paragraphs.map((para, j) => (
                <p key={j} className="mt-4 text-sm leading-[1.75] md:text-base">
                  {highlightBrand(para, brand)}
                </p>
              ))}
            </section>
          ))}

          <section className="text-left">
            <h2 className="text-center text-lg font-bold md:text-left" style={{ color: RED }}>
              Top 5 Best Movies of {new Date().getFullYear()}
            </h2>
            <div className="mt-6 -mx-1 overflow-x-auto sm:mx-0">
              <table
                className="min-w-[520px] w-full border-collapse text-center text-sm md:min-w-0"
                style={{ border: `1px solid ${ORANGE_BORDER}` }}
              >
                <thead>
                  <tr className="bg-black">
                    {["Rank", "Movie Title", "Genre", "Director", "Why It Stands Out"].map((h) => (
                      <th
                        key={h}
                        className="p-2 font-bold"
                        style={{ border: `1px solid ${ORANGE_BORDER}`, color: YELLOW }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={row.rank} className={i % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#0d0d0d]"}>
                      <td className="p-2 text-white" style={{ border: `1px solid ${ORANGE_BORDER}` }}>
                        {row.rank}
                      </td>
                      <td className="p-2 font-medium" style={{ border: `1px solid ${ORANGE_BORDER}`, color: YELLOW }}>
                        {row.title}
                      </td>
                      <td className="p-2" style={{ border: `1px solid ${ORANGE_BORDER}`, color: YELLOW }}>
                        {row.genre}
                      </td>
                      <td className="p-2 text-white" style={{ border: `1px solid ${ORANGE_BORDER}` }}>
                        {row.director}
                      </td>
                      <td className="p-2 text-white" style={{ border: `1px solid ${ORANGE_BORDER}` }}>
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold" style={{ color: RED }}>
              Frequently Asked Questions About {keyword}
            </h2>
            {content.sections.slice(0, 3).map((s) => (
              <div key={s.title} className="mt-6 text-left">
                <p className="font-bold" style={{ color: YELLOW }}>
                  {s.title}?
                </p>
                <p className="mt-2 text-sm">{highlightBrand(s.paragraphs[0] || "", brand)}</p>
              </div>
            ))}
          </section>

          <div className="pb-8 text-center">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: BLUE }}
            >
              Watch Movies NOW ▶
            </Link>
            <p className="mt-8 text-sm" style={{ color: RED }}>
              Copyright © {new Date().getFullYear()} {keyword}
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
```

### Template + filled output (conceptual)

1. **Data:** Pick `extendedLandings["putlocker"]` → supplies `keyword`, `description`, `content`, `colorTheme`, `preset`.
2. **Render:** `<OfficialBrandStyleLanding preset={...} keyword={...} description={...} colorTheme={...} content={...} />`
3. **Resulting hero (Putlocker preset):** micro-label “Stream”, H1 = keyword, subtitle = description, search placeholder “Search library…”, CTA “Watch now” → `/movies`.

---

## 3) SHARED LAYOUT / COMPONENTS (summary)

- **Global header:** `DynamicNavbar` in `app/layout.tsx` — **NOT inlined here** (file is site-wide; copy separately if needed).
- **Landing hero/search/footer:** Covered by `OfficialBrandStyleLanding` + legacy `*StyleLanding.tsx` blocks in section 2.
- **StructuredData:** `@/components/StructuredData` — **NOT FOUND IN THIS EXPORT** (import path only; copy from repo if required).

---

## 4) STYLES (global tokens)

### app/globals.css

```css
@import "tailwindcss";

/* 123moviesfree.net style - same colors/theme across site */
:root {
  --background: #111111;
  --foreground: #f3f3f3;
  --header-bg: #181818;
  --header-border: #2b2b2b;
  --brand-green: #3fae2a;
  --brand-green-hover: #35a024;
  --card-bg: #1a1a1a;
  --surface: #1f1f1f;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

### postcss.config.mjs

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

**Tailwind config file:** `tailwind.config.*` — **NOT FOUND IN REPO** (Tailwind v4 via PostCSS + `@import "tailwindcss"`).

---

## 5) ASSETS

### public/favicon.svg (inline)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Play button -->
  <circle cx="16" cy="16" r="10" fill="#ff0000" stroke="#fff" stroke-width="3"/>
  
  <!-- Play triangle -->
  <polygon points="10,8 10,24 24,16" fill="#fff" stroke="#000" stroke-width="1"/>
</svg>
```

---

## 6) SEO / META (examples)

### Extended: /123movies (from `extendedLandings`)

- **title:** `123Movies – Watch Movies Online Free | Streaming Guide`
- **description:** `Learn how 123Movies-style browsing works, what to expect from free streaming hubs, and how to explore our catalog safely.`
- **keywords:** `123movies, watch movies online, free streaming guide, HD movies, TV shows online`

### Extended: /putlocker

- **title:** `Putlocker – Watch Free Movies & TV Shows Online Guide`
- **description:** `Putlocker-style discovery explained: how to search, filter, and stream responsibly with our modern movie hub.`

### Extended: /ibomma

- **title:** `iBomma – Telugu Movies Online Streaming Guide`
- **description:** `iBomma overview: Telugu new releases, family-friendly picks, and how to search titles faster.`

### Legacy: /fmovies (from `app/fmovies/page.tsx`)

- **title:** `Fmovies - Stream Movies and TV Shows Online Free`
- **description:** `Fmovies offers unlimited streaming of movies and TV series in HD quality. Watch the latest releases and classic films without any subscription fees.`

**Note:** Canonical URLs use `getCanonicalBase()` from `@/lib/domain` — **that helper is NOT inlined**; implement your own base URL for the target project.

---

## 7) NOT FOUND IN THIS EXPORT (copy separately if needed)

- `app/layout.tsx` (root layout, fonts, DynamicNavbar, analytics, verification meta)
- `app/components/DynamicNavbar.tsx` and related nav/logo components
- `app/components/StructuredData.tsx`
- `lib/domain.ts` (`getCanonicalBase`, `getBaseUrlForBuild`)
- `lib/moviesDataServer.ts`, `lib/slug.ts`, `lib/poster.ts` (required by `LandingMovieThumbnails`)
- (PostCSS is embedded above in section 4.)


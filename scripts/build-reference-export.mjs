/**
 * Generates REFERENCE_EXPORT.md at repo root (consolidated merge kit).
 * Run: node scripts/build-reference-export.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function fence(lang, title, code) {
  return `### ${title}\n\n\`\`\`${lang}\n${code.trimEnd()}\n\`\`\`\n\n`;
}

const topLevel = fs.readdirSync(root, { withFileTypes: true });
const tree = topLevel
  .filter((d) => !d.name.startsWith(".") && d.name !== "node_modules")
  .map((d) => (d.isDirectory() ? `${d.name}/` : d.name))
  .sort()
  .join("\n");

let out = "";

out += `# REFERENCE_EXPORT.md\n\n`;
out += `Single-file export of this repo’s **keyword / SEO landing** system for merging into another Next.js project.\n\n`;
out += `**No secrets included** (no \`.env\` values, API keys, or DB credentials). Remove or replace site verification meta tokens in \`layout.tsx\` when merging.\n\n`;

out += `## Checklist (what this file contains)\n\n`;
out += `- [x] Stack + shallow folder tree\n`;
out += `- [x] All keyword slugs + URL pattern\n`;
out += `- [x] Full copy dataset: \`extendedKeywordLandings.ts\` (23 pages)\n`;
out += `- [x] Shared templates: \`OfficialBrandStyleLanding.tsx\`, \`SearchLinkPill.tsx\`, \`types.ts\`, \`LandingMovieThumbnails.tsx\`\n`;
out += `- [x] Legacy-style landing components + their \`page.tsx\` content (8 routes; sitemap lists these slugs)\n`;
out += `- [x] Example route wiring (\`app/123movies/page.tsx\`)\n`;
out += `- [x] Global CSS tokens (\`app/globals.css\`)\n`;
out += `- [x] Favicon SVG inline\n`;
out += `- [x] Sample SEO metadata (3 extended + 1 legacy)\n`;
out += `- [x] “NOT FOUND” notes where applicable\n\n`;

out += `---\n\n`;

out += `## 1) PROJECT SUMMARY\n\n`;
out += `### Stack\n\n`;
out += `- **Framework:** Next.js **15.5.9** (App Router)\n`;
out += `- **UI:** React **19.1.0**, **Tailwind CSS v4** (\`@import "tailwindcss"\` in \`globals.css\`)\n`;
out += `- **Language:** TypeScript **5**\n`;
out += `- **Other deps (not landing-specific):** mongodb, mongoose, dotenv, react-icons — **omit in merge if unused**\n\n`;

out += `### Root folder (1 level; directories shown with /)\n\n`;
out += `\`\`\`text\n${tree}\n\`\`\`\n\n`;

out += `### App folder (2 levels — landing-related)\n\n`;
out += `\`\`\`text\n`;
const appDir = path.join(root, "app");
if (fs.existsSync(appDir)) {
  const subs = fs.readdirSync(appDir, { withFileTypes: true });
  for (const s of subs.sort((a, b) => a.name.localeCompare(b.name))) {
    if (s.name === "node_modules") continue;
    if (s.isDirectory()) {
      out += `${s.name}/\n`;
      try {
        const inner = fs.readdirSync(path.join(appDir, s.name), { withFileTypes: true });
        for (const t of inner.slice(0, 25)) {
          out += `  ${t.isDirectory() ? t.name + "/" : t.name}\n`;
        }
        if (inner.length > 25) out += `  … (${inner.length - 25} more)\n`;
      } catch {
        out += `  (unreadable)\n`;
      }
    } else {
      out += `${s.name}\n`;
    }
  }
} else {
  out += `NOT FOUND IN REPO\n`;
}
out += `\`\`\`\n\n`;

out += `---\n\n`;

out += `## 2) LANDING / KEYWORD PAGES\n\n`;

out += `### URL path pattern\n\n`;
out += `- **Extended:** \`/{slug}\` where \`slug\` is a key of \`extendedLandings\` (see file below).\n`;
out += `- **Legacy:** \`/fmovies\`, \`/gomovies\`, \`/hurawatch\`, \`/lookmovie\`, \`/popcornflix\`, \`/soap2day\`, \`/solarmovie\`, \`/yesmovies\`.\n\n`;

out += `### Slug index (all keyword landings in this export)\n\n`;
out += `| Path | Source |\n|------|--------|\n`;
const ext = read("app/data/extendedKeywordLandings.ts");
/** Must match keys of extendedLandings (quoted + unquoted identifiers in source). */
const EXTENDED_SLUGS = [
  "123movies",
  "gostream",
  "putlocker",
  "bflix",
  "netfree",
  "filmyhit",
  "5movierulz",
  "7starhd",
  "hdmovie2",
  "ssrmovies",
  "9xmovies",
  "kuttymovies",
  "sflix",
  "9xflix",
  "prmovies",
  "filmy4web",
  "goojara",
  "bolly4u",
  "moviesda",
  "filmy4wap",
  "mp4moviez",
  "ibomma",
  "fzmovies",
];
if (!ext) {
  console.warn("extendedKeywordLandings.ts missing — slug list unchecked");
}
for (const s of EXTENDED_SLUGS) {
  out += `| \`/${s}\` | \`extendedLandings\` |\n`;
}
for (const s of ["fmovies", "gomovies", "hurawatch", "lookmovie", "popcornflix", "soap2day", "solarmovie", "yesmovies"]) {
  out += `| \`/${s}\` | dedicated \`page.tsx\` + style component |\n`;
}
out += `\n`;

out += `### Visible copy + templates\n\n`;
out += `**23 extended pages:** All hero titles, subtitles, article headings, and paragraphs live in \`extendedLandings\`. Preset-specific hero UI (e.g. split “123”/“MOVIES”, search placeholder text, CTA labels) is in \`OfficialBrandStyleLanding.tsx\`.\n\n`;
out += `**8 legacy pages:** Long-form \`content\` objects live in each \`app/<slug>/page.tsx\`. Hero/footer/CTA strings are in the corresponding \`*StyleLanding.tsx\` files below.\n\n`;

const embeds = [
  ["app/data/extendedKeywordLandings.ts", "typescript", "FULL: app/data/extendedKeywordLandings.ts (all copy + meta + colors + presets)"],
  ["app/components/keyword-landings/OfficialBrandStyleLanding.tsx", "tsx", "FULL: OfficialBrandStyleLanding.tsx (all preset heroes + ArticleBody + ShareRow)"],
  ["app/123movies/page.tsx", "tsx", "EXAMPLE: app/123movies/page.tsx (metadata + wiring pattern for any extended slug)"],
  ["app/components/keyword-landings/SearchLinkPill.tsx", "tsx", "SearchLinkPill.tsx"],
  ["app/components/keyword-landings/types.ts", "typescript", "keyword-landings/types.ts"],
  ["app/components/keyword-landings/LandingMovieThumbnails.tsx", "tsx", "LandingMovieThumbnails.tsx (depends on @/lib/moviesDataServer, @/lib/slug, @/lib/poster — stub those in target project or simplify)"],
  ["app/fmovies/page.tsx", "tsx", "LEGACY: app/fmovies/page.tsx"],
  ["app/components/keyword-landings/FmoviesStyleLanding.tsx", "tsx", "LEGACY: FmoviesStyleLanding.tsx"],
  ["app/gomovies/page.tsx", "tsx", "LEGACY: app/gomovies/page.tsx"],
  ["app/components/keyword-landings/GomoviesStyleLanding.tsx", "tsx", "LEGACY: GomoviesStyleLanding.tsx"],
  ["app/hurawatch/page.tsx", "tsx", "LEGACY: app/hurawatch/page.tsx"],
  ["app/components/keyword-landings/HurawatchStyleLanding.tsx", "tsx", "LEGACY: HurawatchStyleLanding.tsx"],
  ["app/lookmovie/page.tsx", "tsx", "LEGACY: app/lookmovie/page.tsx"],
  ["app/components/keyword-landings/LookmovieStyleLanding.tsx", "tsx", "LEGACY: LookmovieStyleLanding.tsx"],
  ["app/popcornflix/page.tsx", "tsx", "LEGACY: app/popcornflix/page.tsx"],
  ["app/components/keyword-landings/PopcornflixStyleLanding.tsx", "tsx", "LEGACY: PopcornflixStyleLanding.tsx"],
  ["app/soap2day/page.tsx", "tsx", "LEGACY: app/soap2day/page.tsx"],
  ["app/components/keyword-landings/Soap2dayStyleLanding.tsx", "tsx", "LEGACY: Soap2dayStyleLanding.tsx"],
  ["app/solarmovie/page.tsx", "tsx", "LEGACY: app/solarmovie/page.tsx"],
  ["app/components/keyword-landings/SolarmovieStyleLanding.tsx", "tsx", "LEGACY: SolarmovieStyleLanding.tsx"],
  ["app/yesmovies/page.tsx", "tsx", "LEGACY: app/yesmovies/page.tsx"],
  ["app/components/keyword-landings/YesmoviesStyleLanding.tsx", "tsx", "LEGACY: YesmoviesStyleLanding.tsx"],
];

for (const [rel, lang, title] of embeds) {
  const body = read(rel);
  if (body == null) out += `### ${title}\n\n**NOT FOUND IN REPO:** \`${rel}\`\n\n`;
  else out += fence(lang, title, body);
}

out += `### Template + filled output (conceptual)\n\n`;
out += `1. **Data:** Pick \`extendedLandings["putlocker"]\` → supplies \`keyword\`, \`description\`, \`content\`, \`colorTheme\`, \`preset\`.\n`;
out += `2. **Render:** \`<OfficialBrandStyleLanding preset={...} keyword={...} description={...} colorTheme={...} content={...} />\`\n`;
out += `3. **Resulting hero (Putlocker preset):** micro-label “Stream”, H1 = keyword, subtitle = description, search placeholder “Search library…”, CTA “Watch now” → \`/movies\`.\n\n`;

out += `---\n\n`;

out += `## 3) SHARED LAYOUT / COMPONENTS (summary)\n\n`;
out += `- **Global header:** \`DynamicNavbar\` in \`app/layout.tsx\` — **NOT inlined here** (file is site-wide; copy separately if needed).\n`;
out += `- **Landing hero/search/footer:** Covered by \`OfficialBrandStyleLanding\` + legacy \`*StyleLanding.tsx\` blocks in section 2.\n`;
out += `- **StructuredData:** \`@/components/StructuredData\` — **NOT FOUND IN THIS EXPORT** (import path only; copy from repo if required).\n\n`;

out += `---\n\n`;

out += `## 4) STYLES (global tokens)\n\n`;
const gcss = read("app/globals.css");
if (gcss) out += fence("css", "app/globals.css", gcss);
else out += `**NOT FOUND IN REPO:** app/globals.css\n\n`;

const postcss = read("postcss.config.mjs");
if (postcss) out += fence("javascript", "postcss.config.mjs", postcss);
else out += `**NOT FOUND IN REPO:** postcss.config.mjs\n\n`;

out += `**Tailwind config file:** \`tailwind.config.*\` — **NOT FOUND IN REPO** (Tailwind v4 via PostCSS + \`@import "tailwindcss"\`).\n\n`;

out += `---\n\n`;

out += `## 5) ASSETS\n\n`;
const fav = read("public/favicon.svg");
if (fav) out += fence("svg", "public/favicon.svg (inline)", fav);
else out += `**NOT FOUND IN REPO:** public/favicon.svg\n\n`;

out += `---\n\n`;

out += `## 6) SEO / META (examples)\n\n`;
out += `### Extended: /123movies (from \`extendedLandings\`)\n\n`;
out += `- **title:** \`123Movies – Watch Movies Online Free | Streaming Guide\`\n`;
out += `- **description:** \`Learn how 123Movies-style browsing works, what to expect from free streaming hubs, and how to explore our catalog safely.\`\n`;
out += `- **keywords:** \`123movies, watch movies online, free streaming guide, HD movies, TV shows online\`\n\n`;

out += `### Extended: /putlocker\n\n`;
out += `- **title:** \`Putlocker – Watch Free Movies & TV Shows Online Guide\`\n`;
out += `- **description:** \`Putlocker-style discovery explained: how to search, filter, and stream responsibly with our modern movie hub.\`\n\n`;

out += `### Extended: /ibomma\n\n`;
out += `- **title:** \`iBomma – Telugu Movies Online Streaming Guide\`\n`;
out += `- **description:** \`iBomma overview: Telugu new releases, family-friendly picks, and how to search titles faster.\`\n\n`;

out += `### Legacy: /fmovies (from \`app/fmovies/page.tsx\`)\n\n`;
out += `- **title:** \`Fmovies - Stream Movies and TV Shows Online Free\`\n`;
out += `- **description:** \`Fmovies offers unlimited streaming of movies and TV series in HD quality. Watch the latest releases and classic films without any subscription fees.\`\n\n`;

out += `**Note:** Canonical URLs use \`getCanonicalBase()\` from \`@/lib/domain\` — **that helper is NOT inlined**; implement your own base URL for the target project.\n\n`;

out += `---\n\n`;

out += `## 7) NOT FOUND IN THIS EXPORT (copy separately if needed)\n\n`;
out += `- \`app/layout.tsx\` (root layout, fonts, DynamicNavbar, analytics, verification meta)\n`;
out += `- \`app/components/DynamicNavbar.tsx\` and related nav/logo components\n`;
out += `- \`app/components/StructuredData.tsx\`\n`;
out += `- \`lib/domain.ts\` (\`getCanonicalBase\`, \`getBaseUrlForBuild\`)\n`;
out += `- \`lib/moviesDataServer.ts\`, \`lib/slug.ts\`, \`lib/poster.ts\` (required by \`LandingMovieThumbnails\`)\n`;
out += `- (PostCSS is embedded above in section 4.)\n\n`;

const outPath = path.join(root, "REFERENCE_EXPORT.md");
fs.writeFileSync(outPath, out, "utf8");
console.log("Wrote", outPath, `(${Math.round(out.length / 1024)} KB)`);

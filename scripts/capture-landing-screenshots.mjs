/**
 * Full-page screenshots of keyword landing routes (your site) or optional external URLs.
 *
 * Setup:
 *   npm i -D playwright
 *   npx playwright install chromium
 *
 * Local (dev server running):
 *   set BASE_URL=http://localhost:3000
 *   node scripts/capture-landing-screenshots.mjs
 *
 * External references (add URLs you are allowed to capture):
 *   Copy official-refs.example.json → official-refs.json and fill "url" fields, then:
 *   set MODE=official
 *   node scripts/capture-landing-screenshots.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const LOCAL_SLUGS = [
  "fmovies",
  "gomovies",
  "hurawatch",
  "soap2day",
  "lookmovie",
  "popcornflix",
  "solarmovie",
  "yesmovies",
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

async function main() {
  let chromium;
  try {
    const pw = await import("playwright");
    chromium = pw.chromium;
  } catch {
    console.error(
      "Playwright not installed. Run:\n  npm i -D playwright\n  npx playwright install chromium",
    );
    process.exit(1);
  }

  const mode = process.env.MODE || "local";
  const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

  const outOfficial = path.join(root, "screenshots", "official-landings");
  const outLocal = path.join(root, "screenshots", "captured-local");
  fs.mkdirSync(mode === "official" ? outOfficial : outLocal, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  if (mode === "official") {
    const refsPath = path.join(__dirname, "official-refs.json");
    if (!fs.existsSync(refsPath)) {
      console.error(
        `Missing ${refsPath}\nCopy official-refs.example.json → official-refs.json and add URLs you may legally capture.`,
      );
      await browser.close();
      process.exit(1);
    }
    const refs = JSON.parse(fs.readFileSync(refsPath, "utf8"));
    for (const [name, entry] of Object.entries(refs)) {
      const url = typeof entry === "string" ? entry : entry?.url;
      if (!url) continue;
      const safe = String(name).replace(/[^a-z0-9-_]/gi, "_");
      console.log("→", safe, url);
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
        await page.screenshot({
          path: path.join(outOfficial, `${safe}.png`),
          fullPage: true,
        });
      } catch (e) {
        console.warn("  skip:", e.message);
      }
    }
  } else {
    for (const slug of LOCAL_SLUGS) {
      const url = `${baseUrl}/${slug}`;
      console.log("→", url);
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        await new Promise((r) => setTimeout(r, 800));
        await page.screenshot({
          path: path.join(outLocal, `${slug}.png`),
          fullPage: true,
        });
      } catch (e) {
        console.warn("  skip:", e.message);
      }
    }
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

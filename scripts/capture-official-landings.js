const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const targets = [
  { key: "fmovies", url: "https://ww4.fmovies.movie/" },
  { key: "gomovies", url: "https://ww4.gomovies.film/" },
  { key: "hurawatch", url: "https://hurawatch.ru.com/" },
  { key: "lookmovie", url: "https://www.lookmovie.com/" },
  { key: "popcornflix", url: "https://www.popcornflix.com/" },
  { key: "soap2day", url: "https://soap2day.day/" },
  { key: "solarmovie", url: "https://ww6.solarmovie.to/" },
  { key: "yesmovies", url: "https://yesmovie.homes/" },
];

async function run() {
  const outDir = path.join(process.cwd(), "screenshots", "official-landings");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 2200 },
  });

  const results = [];

  for (const target of targets) {
    const page = await context.newPage();
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${target.key}-${ts}.png`;
    const filePath = path.join(outDir, fileName);

    try {
      await page.goto(target.url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      await page.waitForTimeout(3500);
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(600);
      await page.screenshot({ path: filePath, fullPage: true });
      results.push({ ...target, ok: true, screenshot: filePath });
      console.log(`OK  ${target.key} -> ${filePath}`);
    } catch (error) {
      results.push({ ...target, ok: false, error: String(error) });
      console.log(`ERR ${target.key} -> ${String(error)}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const jsonPath = path.join(outDir, "results.json");
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`Saved results: ${jsonPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

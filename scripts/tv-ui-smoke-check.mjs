import { chromium } from "playwright";

const base = "http://localhost:3300";
const checks = [
  { path: "/series", expectTitle: /TV Series/i, expectText: /Showing|Browse/i },
  { path: "/tv-genre/drama", expectTitle: /Drama TV Shows/i, expectText: /Showing/i },
  { path: "/tv-year/2024", expectTitle: /2024 TV Shows/i, expectText: /Latest first|No TV Shows Available/i },
  { path: "/tv-genre/all", expectTitle: /All TV Series/i, expectText: /Showing|Load More|Loading TV Series/i },
  { path: "/home", expectTitle: /Watch Movies/i, expectText: /TV Series|Latest TV-Series|Popular TV-Series/i },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const c of checks) {
  const url = `${base}${c.path}`;
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1000);
    const title = await page.title();
    const body = await page.textContent("body");
    const titleOk = c.expectTitle.test(title);
    const textOk = c.expectText.test(body || "");
    const cardCount = await page.locator("a.group").count();
    const loadMoreBtn = await page.locator("button", { hasText: /Load More/i }).count();
    console.log(
      `${titleOk && textOk ? "PASS" : "FAIL"} ${c.path} status=${res?.status()} titleOk=${titleOk} textOk=${textOk} cards=${cardCount} loadMoreBtns=${loadMoreBtn}`
    );
  } catch (e) {
    console.log(`FAIL ${c.path} :: ${e.message}`);
  }
}

await browser.close();


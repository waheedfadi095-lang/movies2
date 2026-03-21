# Landing screenshots

- **`captured-local/`** — run the script below while `npm run dev` is up; saves PNGs of **your** routes (`/fmovies`, `/123movies`, …).
- **`official-landings/`** — optional reference captures from external URLs (only if you have permission). Configure `scripts/official-refs.json` (copy from `official-refs.example.json`).

## Capture your pages

```bash
npm i -D playwright
npx playwright install chromium
set BASE_URL=http://localhost:3000
node scripts/capture-landing-screenshots.mjs
```

Output: `screenshots/captured-local/*.png`

## Capture external “official” references

1. Copy `scripts/official-refs.example.json` → `scripts/official-refs.json`
2. Fill each `"url"` (must be URLs you may use).
3. `set MODE=official` then run the same script. Output: `screenshots/official-landings/*.png`

import fs from "fs";
import path from "path";

function getArg(prefix) {
  const a = process.argv.find((x) => x.startsWith(prefix));
  return a ? a.slice(prefix.length) : null;
}

const base = getArg("--base=") || "http://127.0.0.1:3000";
const limit = Number.parseInt(getArg("--limit=") || "16", 10) || 16;

const url = `${base.replace(/\/+$/, "")}/api/home/snapshot?force=1&limit=${limit}`;
const outFile = path.join(process.cwd(), "app", "data", "homeSnapshot.json");

const res = await fetch(url, { cache: "no-store" });
if (!res.ok) {
  const t = await res.text().catch(() => "");
  console.error(`Snapshot build failed: ${res.status}\n${t}`);
  process.exit(1);
}
const json = await res.json();

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(json, null, 2), "utf8");

console.log(`✅ Updated ${outFile}`);
console.log(`- generatedAt: ${json?.generatedAt}`);
console.log(`- suggestions: ${json?.suggestions?.length ?? 0}`);
console.log(`- latestMovies: ${json?.latestMovies?.length ?? 0}`);
console.log(`- homeLatestTvSeries: ${json?.homeLatestTvSeries?.length ?? 0}`);


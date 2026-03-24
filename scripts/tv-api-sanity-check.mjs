const tests = [
  ["/api/tv-series-db?limit=7&skip=0&sortBy=first_air_date&sortOrder=desc&enrich=1", "list-latest"],
  ["/api/tv-series-db?limit=7&skip=7&sortBy=first_air_date&sortOrder=desc&genre=Drama&enrich=1", "list-genre"],
  ["/api/tv-series-db?limit=7&skip=0&year=2024&sortBy=first_air_date&sortOrder=desc&enrich=1", "list-year"],
  ["/api/tv-series-search?q=breaking&page=1&limit=5&enrich=1", "search"],
  ["/api/tv-series-db/tt0903747?enrich=1", "single"],
];

const base = "http://localhost:3300";

for (const [u, name] of tests) {
  try {
    const r = await fetch(base + u);
    const j = await r.json();
    let ok = r.ok;
    let note = "";

    if (name === "single") {
      ok = ok && j.success && !!j.data && j.data.imdb_id === "tt0903747";
      note = `name=${j?.data?.name || "n/a"}`;
    } else if (name === "search") {
      ok =
        ok &&
        j.success &&
        Array.isArray(j.data) &&
        j.pagination &&
        typeof j.pagination.total === "number" &&
        typeof j.pagination.pages === "number";
      note = `items=${j.data?.length || 0},total=${j.pagination?.total},pages=${j.pagination?.pages},hasMore=${j.pagination?.hasMore}`;
    } else {
      ok =
        ok &&
        j.success &&
        Array.isArray(j.data) &&
        typeof j.total === "number" &&
        j.pagination &&
        typeof j.pagination.total === "number";
      note = `items=${j.data?.length || 0},total=${j.total},pages=${j.pagination?.pages},hasMore=${j.pagination?.hasMore}`;
    }

    console.log(`${ok ? "PASS" : "FAIL"} ${name} ${u} :: ${note}`);
  } catch (e) {
    console.log(`FAIL ${name} ${u} :: ${e.message}`);
  }
}


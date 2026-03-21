const http = require('http');

function extractAround(haystack, needle, radius = 160) {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return null;
  const start = Math.max(0, idx - radius);
  const end = Math.min(haystack.length, idx + radius);
  return haystack.slice(start, end);
}

const url = process.argv[2] || 'http://localhost:3200/la-revuelta-270462/season-1';

http
  .get(url, (res) => {
    let d = '';
    res.on('data', (c) => (d += c));
    res.on('end', () => {
      const tmdbAround = extractAround(d, 'image.tmdb.org') || extractAround(d, 'tmdb.org');
      console.log('status:', res.statusCode);
      console.log('len:', d.length);
      console.log('has tmdb:', d.includes('image.tmdb.org') || d.includes('tmdb.org'));
      if (tmdbAround) console.log('around:', tmdbAround.replace(/\s+/g, ' ').slice(0, 500));

      const directTmdb = [...d.matchAll(/https:\/\/image\.tmdb\.org\/t\/p\/[^\"\'\\s>]+/g)].map((m) => m[0]);
      console.log('direct tmdb image urls:', directTmdb.length);
      if (directTmdb.length) console.log(directTmdb.slice(0, 5).join('\n'));

      const nextImgCount = (d.match(/_next\/image\?url=/g) || []).length;
      console.log('next/image occurrences:', nextImgCount);

      // Print first few _next/image segments (avoid tricky regex parsing)
      const needle = '/_next/image?url=';
      let pos = 0;
      console.log('first _next/image url= segments:');
      for (let i = 0; i < 5; i++) {
        pos = d.indexOf(needle, pos);
        if (pos === -1) break;
        const seg = d.slice(pos, Math.min(d.length, pos + 260));
        console.log('-', seg.replace(/\\s+/g, ' ').slice(0, 260));
        pos = pos + needle.length;
      }
    });
  })
  .on('error', (e) => {
    console.error('request error:', e);
    process.exit(1);
  });


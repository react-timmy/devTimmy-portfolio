import { NextResponse } from "next/server";

export const revalidate = 0;

function extractMeta(html: string) {
  const result: Record<string, string> = {};

  // title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  // meta tags: property or name
  const metaRegex = /<meta\s+(?:property|name)=["']([^"']+)["']\s+content=["']([^"']*)["'][^>]*>/gi;
  let m;
  while ((m = metaRegex.exec(html)) !== null) {
    const key = m[1].toLowerCase();
    const val = m[2];
    result[key] = val;
  }

  // common fields
  const title = result['og:title'] || result['twitter:title'] || result['title'] || result['description'] || result['og:description'] || result['twitter:description'] || '';
  const description = result['og:description'] || result['twitter:description'] || result['description'] || '';
  const image = result['og:image'] || result['twitter:image'] || result['image'] || '';

  // try to extract like counts from embedded JSON or inline fragments
  let likes = 0;
  const likeMatch = html.match(/"like_count"\s*:\s*(\d+)/i) || html.match(/"favorite_count"\s*:\s*(\d+)/i) || html.match(/"likeCount"\s*:\s*(\d+)/i);
  if (likeMatch) {
    likes = parseInt(likeMatch[1].replace(/,/g, ''), 10) || 0;
  } else {
    // try to find visible counts like >1,234< near a like label
    const visibleMatch = html.match(/>([0-9][0-9,\.]{0,6})<[^>]*>\s*(?:Likes|likes|Like)/i) || html.match(/Likes?\W*([0-9][0-9,\.]{0,6})/i);
    if (visibleMatch) likes = parseInt((visibleMatch[1] || '').replace(/[,\.]/g, ''), 10) || 0;
  }

  return { title: title.trim(), description: description.trim(), image: image.trim(), likes };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const urls: string[] = Array.isArray(body.urls) ? body.urls : [];
    if (!urls.length) return NextResponse.json({ ok: false, error: 'no urls' }, { status: 400 });

    const results: Array<{ url: string; title: string; description: string; image: string; likes: number }> = [];

    await Promise.all(urls.map(async (u) => {
      try {
        // Normalize URL
        const url = new URL(u, 'https://example.com').toString();
        const res = await fetch(url, {
          headers: {
            // polite, common UA to encourage servers to return proper OG tags
            'User-Agent': 'Mozilla/5.0 (compatible; FetchMeta/1.0; +https://example.com)'
          },
        });
        if (!res.ok) {
          results.push({ url: u, title: '', description: '', image: '' });
          return;
        }
        const html = await res.text();
        const meta = extractMeta(html);
        results.push({ url: u, title: meta.title || '', description: meta.description || '', image: meta.image || '', likes: (meta as any).likes || 0 });
      } catch (err) {
        results.push({ url: u, title: '', description: '', image: '' });
      }
    }));

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error('/api/fetch-meta error', err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}

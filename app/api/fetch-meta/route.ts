import { NextResponse } from "next/server";

export const revalidate = 0;

function decodeHtmlEntities(text: string): string {
  const decoder = new TextDecoder();
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

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
  // Prefer descriptive fields (og:description/twitter:description/description) for the title when available
  let description = result['og:description'] || result['twitter:description'] || result['description'] || '';
  let title = description || result['og:title'] || result['twitter:title'] || result['title'] || '';
  const image = result['og:image'] || result['twitter:image'] || result['image'] || '';

  // Decode and clean up title first (handle HTML entities and leading/trailing quotes)
  title = decodeHtmlEntities(title || '');
  // Remove leading/trailing quote characters (normal + curly + guillemets) and whitespace
  title = title.replace(/^[\u0022\u0027\u2018\u2019\u201C\u201D\u00AB\u00BB\u201E\u201F\s]+/, '').replace(/[\u0022\u0027\u2018\u2019\u201C\u201D\u00AB\u00BB\u201E\u201F\s]+$/, '');

  // Clean up title - remove "on X:", "(@_devTimmy)", etc from the title
  if (title && title.includes(' on X')) {
    title = title.split(' on X')[0].trim();
  }
  if (title && title.includes('(@_devTimmy)')) {
    title = title.replace('𝗧𝗜𝗠𝗠¥ (@_devTimmy)', '').replace('TIMM¥ (@_devTimmy)', '').trim();
  }

  // For X/Twitter posts, extract the full post text
  if (!description || description.length < 100) {
    // Look for text in JSON-LD structured data
    const scriptMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi) || [];
    for (const script of scriptMatches) {
      const jsonMatch = script.match(/>([^<]+)<\/script>/);
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[1]);
          if (jsonData.description && jsonData.description.length > description.length) {
            description = jsonData.description;
          } else if (jsonData.text && jsonData.text.length > description.length) {
            description = jsonData.text;
          } else if (jsonData.articleBody && jsonData.articleBody.length > description.length) {
            description = jsonData.articleBody;
          }
        } catch (e) {
          // ignore parsing errors
        }
      }
    }

    // For X posts, try to extract from data attributes or specific containers
    if (!description || description.length < 100) {
      // Look for X post content in data-testid="tweet" or similar containers
      const tweetMatch = html.match(/data-testid=["']tweet["'][^>]*>[\s\S]*?<div[^>]*lang=["'][^"']*["'][^>]*>([^<]+)<\/div>/i) ||
                        html.match(/class=["'][^"]*tweet[^"]*["'][^>]*>[\s\S]*?<span>([^<]{50,}?)<\/span>/i);
      if (tweetMatch && tweetMatch[1]) {
        description = tweetMatch[1].trim();
      }
    }

    // Final fallback: extract clean text content, but be smarter about it
    if (!description || description.length < 100) {
      // Remove script, style, and navigation elements
      let cleanHtml = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
      
      // Extract text and clean up
      let text = cleanHtml
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Remove common UI/nav text patterns
      text = text
        .replace(/Log in|Sign up|Post|Share|Like|Reply|Repost/gi, '')
        .replace(/𝗧𝗜𝗠𝗠¥|TIMM¥|@_devTimmy|\(@_devTimmy\)/g, '')
        .replace(/on X:|on Twitter:/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Find the longest continuous chunk of meaningful text
      if (text.length > 100) {
        // Skip early navigation/UI text and get actual content
        description = text.substring(0, 400).trim();
      }
    }
  }

  // Clean description too - remove page UI elements but preserve newlines
  if (description) {
    description = description
      .replace(/Log in|Sign up|Post|Share|Like|Reply|Repost/gi, '')
      .replace(/on X:|on Twitter:/gi, '')
      .replace(/\/ X Post/gi, '')
      .replace(/["']?\s*\/\s*X\s*["']?/gi, '')
      .replace(/https:\/\/t\.co\/[A-Za-z0-9]+/g, '')
      .replace(/[ \t]+/g, ' ') // only collapse horizontal whitespace, preserve newlines
      .trim()
      .replace(/^["'"'""„‟\s]+/, ''); // Remove leading quotes (all variations) and spaces at the very end
  }

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

  return { title: decodeHtmlEntities(title).trim(), description: decodeHtmlEntities(description).trim().substring(0, 500), image: image.trim(), likes };
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
          results.push({ url: u, title: '', description: '', image: '', likes: 0 });
          return;
        }
        const html = await res.text();
        const meta = extractMeta(html);
        results.push({ url: u, title: meta.title || '', description: meta.description || '', image: meta.image || '', likes: (meta as any).likes || 0 });
      } catch (err) {
        results.push({ url: u, title: '', description: '', image: '', likes: 0 });
      }
    }));

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error('/api/fetch-meta error', err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}

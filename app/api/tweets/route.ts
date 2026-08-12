import { NextResponse } from "next/server";

// Cache for 30 minutes — X API has strict rate limits
export const revalidate = 1800;

const STATIC_TWEETS = [
  {
    id: "1",
    content:
      "The best builders I know aren't the ones waiting for the perfect idea. They're shipping, learning, and adjusting in public. Start small. Stay consistent. The compound effect hits different.",
    date: "Jul 2025",
    likes: 84,
    reposts: 22,
    views: "4.1K",
  },
  {
    id: "2",
    content:
      "InfoFi is the quiet layer of crypto most people sleep on. You contribute signal — analysis, content, attention — and the protocol rewards you for it. We're early. Like, very early.",
    date: "Jun 2025",
    likes: 61,
    reposts: 14,
    views: "2.8K",
  },
  {
    id: "3",
    content:
      "Bless Network just dropped leaderboard season results. Being in the top % as a solo content contributor with zero bots, zero engagement farms — that's the kind of win that feels real.",
    date: "Jun 2025",
    likes: 47,
    reposts: 9,
    views: "1.9K",
  },
  {
    id: "4",
    content:
      "ZK proofs for identity aren't just a tech problem — they're a trust problem. Billions Network is building the infrastructure to prove you're human without revealing who you are. That's the future.",
    date: "May 2025",
    likes: 73,
    reposts: 18,
    views: "3.3K",
  },
  {
    id: "5",
    content:
      "Built my first React Native screen in 2023. Shipped a full Android app with TMDB integration, Gemini AI fallback, and offline-first architecture in 2024. The gap between idea and ability collapses fast when you're consistent.",
    date: "May 2025",
    likes: 112,
    reposts: 31,
    views: "6.2K",
  },
  {
    id: "6",
    content:
      "Open AGI shouldn't be controlled by three companies. Sentient AGI is betting on a different future — open, verifiable, decentralized research. Following closely and building in that direction.",
    date: "Apr 2025",
    likes: 55,
    reposts: 11,
    views: "2.1K",
  },
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export async function GET() {
  const bearerToken = process.env.X_BEARER_TOKEN;

  // No token configured — return static fallback immediately
  if (!bearerToken) {
    return NextResponse.json({ tweets: STATIC_TWEETS, source: "static" });
  }

  try {
    // 1. Look up the user ID for @_devTimmy
    const userRes = await fetch(
      "https://api.twitter.com/2/users/by/username/_devTimmy",
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
        next: { revalidate: 86400 }, // cache user ID for 24h
      }
    );

    if (!userRes.ok) throw new Error(`User lookup failed: ${userRes.status}`);
    const userData = await userRes.json();
    const userId: string = userData.data?.id;
    if (!userId) throw new Error("User ID not found");

    // 2. Fetch recent tweets (exclude replies and retweets)
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets` +
        `?max_results=10` +
        `&exclude=retweets,replies` +
        `&tweet.fields=created_at,public_metrics` +
        `&expansions=author_id`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
        next: { revalidate: 1800 },
      }
    );

    if (!tweetsRes.ok) throw new Error(`Tweets fetch failed: ${tweetsRes.status}`);
    const tweetsData = await tweetsRes.json();

    if (!tweetsData.data?.length) {
      return NextResponse.json({ tweets: STATIC_TWEETS, source: "static" });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tweets = tweetsData.data.map((t: any) => ({
      id: t.id,
      content: t.text,
      date: formatDate(t.created_at),
      likes: t.public_metrics?.like_count ?? 0,
      reposts: t.public_metrics?.retweet_count ?? 0,
      views: formatCount(t.public_metrics?.impression_count ?? 0),
    }));

    return NextResponse.json({ tweets, source: "live" });
  } catch (err) {
    console.error("[/api/tweets] X API error, using static fallback:", err);
    return NextResponse.json({ tweets: STATIC_TWEETS, source: "static" });
  }
}

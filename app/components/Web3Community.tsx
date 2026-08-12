"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const AVATAR = "https://pbs.twimg.com/profile_images/1990929564474773504/HkT4wInV_400x400.jpg";

type Tweet = {
  id: string;
  content: string;
  date: string;
  likes: number;
  reposts: number;
  views: string;
};

const POSTS = [
  "https://x.com/_devTimmy/status/1951708823850303686?s=20",
  "https://x.com/_devTimmy/status/1949135467951120753?s=20",
  "https://x.com/_devTimmy/status/1947250782933602507?s=20",
  "https://x.com/_devTimmy/status/2064580149081788625?s=20",
  "https://x.com/_devTimmy/status/2059912628101681607?s=20",
  "https://x.com/_devTimmy/status/2060262522616262763?s=20",
  "https://x.com/_devTimmy/status/2021130066076323986?s=20",
];

type Post = { id: string; url: string };


function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type Meta = { url: string; title: string; description: string; image: string; likes?: number };

function TweetCard({ meta, onHover }: { meta: Meta; onHover: (hovered: boolean) => void; }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const enter = () => { setHovered(true); onHover(true); };
  const leave = () => { setHovered(false); onHover(false); };

  const text = meta.description || meta.title || '';

  return (
    <a
      href={meta.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        position: 'relative',
        width: 320,
        flexShrink: 0,
        borderRadius: 16,
        padding: '18px 18px 16px',
        background: hovered
          ? 'rgba(22, 22, 26, 0.98)'
          : 'rgba(16, 16, 20, 0.95)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.7)'
          : '0 4px 20px rgba(0,0,0,0.5)',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'background 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
        cursor: 'pointer',
      }}
    >
      {/* X logo — top right */}
      <div style={{ position: 'absolute', top: 16, right: 16, color: '#ffffff' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      {/* Header — avatar + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 28 }}>
        {/* Avatar */}
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '1.5px solid rgba(255,255,255,0.1)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AVATAR}
            alt="TIMM¥"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Name + handle + follow */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap' }}>
            <span style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: -0.2,
              whiteSpace: 'nowrap',
            }}>
              TIMM¥
            </span>
            {/* Verified-style checkmark */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#1d9bf0" style={{ flexShrink: 0 }}>
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
            <span style={{ fontSize: 12, color: '#71717a', whiteSpace: 'nowrap' }}>@_devTimmy</span>
            <span style={{ fontSize: 12, color: '#3f3f46' }}>·</span>
            <span
              onClick={e => { e.preventDefault(); e.stopPropagation(); window.open('https://x.com/_devTimmy', '_blank', 'noreferrer'); }}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#1d9bf0',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Follow
            </span>
          </div>
        </div>
      </div>

      {/* Post text body */}
      {text ? (
        <div style={{ fontSize: 14, lineHeight: 1.65, color: '#e4e4e7' }}>
          <div style={
            expanded
              ? {}
              : { display: '-webkit-box', WebkitLineClamp: 6 as never, WebkitBoxOrient: 'vertical' as never, overflow: 'hidden' }
          }>
            {text}
          </div>
          {text.length > 240 && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); setExpanded(v => !v); }}
              style={{
                marginTop: 6,
                background: 'none',
                border: 'none',
                color: '#1d9bf0',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      ) : null}

      {/* Attached image — below text, rounded border */}
      {meta.image ? (
        <div style={{
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.image}
            alt={meta.title || ''}
            style={{ width: '100%', height: 168, objectFit: 'cover', display: 'block' }}
          />
        </div>
      ) : null}

      {/* Footer — engagement row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 2,
        color: '#71717a',
        fontSize: 13,
      }}>
        {/* Reply */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        {/* Repost */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </span>
        {/* Like */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {meta.likes ? meta.likes : ''}
        </span>
        {/* Bookmark */}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
      </div>
    </a>
  );
}

export default function Web3Community() {
  const [posts, setPosts] = useState<Post[]>(() => POSTS.map((u, i) => ({ id: String(i), url: u })));
  const [paused, setPaused] = useState(false);

  const [metaList, setMetaList] = useState<Meta[] | null>(null);

  useEffect(() => {
    // Fetch scraped metadata for provided post URLs
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/fetch-meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: POSTS }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data?.ok && Array.isArray(data.results)) {
          setMetaList(data.results.map((r: any) => ({ url: r.url, title: r.title || '', description: r.description || '', image: r.image || '', likes: r.likes || 0 })));
        } else {
          setMetaList(POSTS.map(u => ({ url: u, title: '', description: '', image: '', likes: 0 })));
        }
      } catch (err) {
        setMetaList(POSTS.map(u => ({ url: u, title: '', description: '', image: '' })));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleCardHover = useCallback((h: boolean) => setPaused(h), []);

  /* Duplicate for seamless loop — need at least enough cards to fill viewport */
  const looped = (metaList ?? POSTS.map(u => ({ url: u, title: '', description: '', image: '' }))).concat(metaList ?? POSTS.map(u => ({ url: u, title: '', description: '', image: '' })));

  return (
    <section
      id="community"
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "96px 0 80px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", top: 0, right: "-5%",
        width: "40%", height: "50%",
        background: "radial-gradient(ellipse at top right, rgba(139,92,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: 20, marginBottom: 40,
        }}>
          <div>
            <h2 style={{
              color: "#ffffff",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1,
              marginBottom: 10,
            }}>
              What I'm Into
            </h2>
            <p style={{ color: "#71717a", fontSize: 15, margin: 0, maxWidth: 420 }}>
              Building user solutions, exploring AI and crypto, making ideas come alive and sharing what I learn
            </p>
          </div>

          <a
            href="https://x.com/_devTimmy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "9px 18px", borderRadius: 9999,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#a1a1aa", fontSize: 13, fontWeight: 700,
              textDecoration: "none",
              transition: "background 150ms ease, color 150ms ease, border-color 150ms ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(255,255,255,0.1)";
              el.style.color = "#fff";
              el.style.borderColor = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(255,255,255,0.06)";
              el.style.color = "#a1a1aa";
              el.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <XLogo size={14} />
            Follow @_devTimmy
          </a>
        </div>
      </div>

      {/* ── Marquee ───────────────────────────────────────────────────── */}
      {/* Full-bleed so cards can scroll past both edges */}
      <div
        className="tweets-marquee-outer"
        aria-label="X posts auto-scroll"
        style={{ paddingLeft: 24 }}
      >
        <div
          className="tweets-marquee-track"
          style={{
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {metaList === null ? (
            // Show skeletons while loading
            Array.from({ length: POSTS.length * 2 }).map((_, i) => (
              <div key={`s-${i}`} style={{ width: 320, flexShrink: 0, borderRadius: 12, padding: 12 }}>
                <div style={{ width: '100%', height: 160, borderRadius: 8, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
                <div style={{ height: 12 }} />
                <div style={{ width: '70%', height: 12, borderRadius: 6, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
                <div style={{ height: 8 }} />
                <div style={{ width: '100%', height: 44, borderRadius: 6, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
              </div>
            ))
          ) : (
            looped.map((meta, i) => (
              <TweetCard
                key={`${meta.url}-${i}`}
                meta={meta as any}
                onHover={handleCardHover}
              />
            ))
          )}
        </div>
      </div>

      {/* ── See all CTA ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "32px auto 0", padding: "0 24px" }}>
        <a
          href="https://x.com/_devTimmy"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 700, color: "#8b5cf6",
            textDecoration: "none",
            transition: "color 150ms ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#a78bfa"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#8b5cf6"; }}
        >
          See all posts on X
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>

      <style>{`
        .tweets-marquee-outer {
          overflow: hidden;
          position: relative;
          /* Fade edges */
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0px,
            black 60px,
            black calc(100% - 60px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0px,
            black 60px,
            black calc(100% - 60px),
            transparent 100%
          );
        }

        @keyframes tweetScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .tweets-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: tweetScroll 40s linear infinite;
          padding-bottom: 6px;
        }
        @media (prefers-reduced-motion: reduce) {
          .tweets-marquee-track { animation: none; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}

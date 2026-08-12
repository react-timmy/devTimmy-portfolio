"use client";

const AVATAR = "https://pbs.twimg.com/profile_images/1990929564474773504/HkT4wInV_400x400.jpg";


function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function About() {
  return (
    <section
      id="about"
      style={{
        background: "#000000",
        padding: "96px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>

        {/* Avatar + name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={AVATAR}
              alt="Timmy"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid transparent",
                display: "block",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#4ade80",
                border: "2px solid #000",
              }}
            />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", letterSpacing: -0.3 }}>
              Timmy
            </p>
            <p style={{ fontSize: 12, color: "#52525b", marginTop: 0, fontWeight: 600 }}>
              always works {"->"} build in private, ship in public.
            </p>
          </div>
        </div>

        {/* Bio */}
        <h2
          style={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: -0.5,
            lineHeight: 1.3,
            marginBottom: 20,
          }}
        >
          Builder. Shipper.
        </h2>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa", marginBottom: 16 }}>
          I build <span style={{ color: "#ffffff", fontWeight: 600 }}> web</span> and{" "}
          <span style={{ color: "#ffffff", fontWeight: 600 }}>mobile</span> apps, write my thoughts on  {" "}
          <span style={{ color: "#ffffff", fontWeight: 600 }}>dev and web3</span> related topics on <XLogo size={14} />, and write contexts for AI Images. Full-stack by day, curious about everything else by night.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa", marginBottom: 16 }}>
          I take your idea from concept to a <span style={{ color: "#ffffff", fontWeight: 700 }}>live, working product</span> – web, mobile, or AI-powered. Fast.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa", marginBottom: 16 }}>
          My stack is React, React Native, Node.js, TypeScript, and whatever AI API gets the job
          done. I work end-to-end – design unique UI's – and I move fast because my workflow is
          terminal-first / IDE and AI-assisted.
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#a1a1aa" }}>
        It's not work if i have fun building it.
        </p>

      </div>
    </section>
  );
}

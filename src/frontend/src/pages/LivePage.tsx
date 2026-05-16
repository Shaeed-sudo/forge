import { useNavigate, useSearch } from "@tanstack/react-router";
import { Check, ExternalLink, LayoutDashboard, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Confetti canvas ──────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  opacity: number;
}

const CONFETTI_COLORS = [
  "#0051ff",
  "#3374ff",
  "#e8eeff",
  "#16a34a",
  "#dcfce7",
  "#fbbf24",
  "#ffffff",
];

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 180,
      w: 5 + Math.random() * 8,
      h: 9 + Math.random() * 6,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 4,
      opacity: 1,
    }));

    let frame = 0;
    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        if (p.y > canvas.height * 0.65) p.opacity -= 0.016;
      }
      frame++;
      if (frame < 200) {
        rafId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    />
  );
}

// ─── LivePage ─────────────────────────────────────────────────────────────────
export default function LivePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { siteUrl } = useSearch({ from: "/live" });
  const liveUrl = siteUrl ?? "https://my-site.forge.app";

  function copyUrl() {
    navigator.clipboard?.writeText(liveUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      data-ocid="live.page"
      className="min-h-screen bg-card flex items-center justify-center relative overflow-hidden"
    >
      <ConfettiCanvas />

      {/* Card */}
      <div className="relative z-10 text-center max-w-[500px] w-full px-6 animate-slide-up">
        {/* Green check circle */}
        <div
          className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: "oklch(0.590 0.160 142.5 / 0.15)",
            animation: "pop-in 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both",
          }}
          data-ocid="live.success_state"
        >
          <Check className="w-8 h-8 text-accent" strokeWidth={3} />
        </div>

        {/* Headline */}
        <h1
          className="font-display font-black text-foreground mb-3 leading-none"
          style={{ fontSize: 36, letterSpacing: "-1px" }}
        >
          You're <span className="text-primary">live.</span>
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
          Your site is published and open to the world. Share it, add it to your
          bio, and watch visitors arrive.
        </p>

        {/* URL box */}
        <div
          data-ocid="live.url_box"
          className="flex items-stretch border-2 border-primary rounded-xl overflow-hidden mb-6"
        >
          <div className="flex-1 bg-primary/5 px-4 py-3 font-mono text-[13px] text-primary overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {liveUrl}
          </div>
          <button
            type="button"
            data-ocid="live.copy_button"
            onClick={copyUrl}
            className="bg-primary text-primary-foreground px-4 flex items-center gap-2 font-display font-bold text-[12px] hover:opacity-90 transition-forge whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 14 14"
                  role="img"
                  aria-label="Copy icon"
                >
                  <rect
                    x="4"
                    y="4"
                    width="8"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v6a1 1 0 001 1h1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Copy link
              </>
            )}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            type="button"
            data-ocid="live.view_site_button"
            className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-[13px] font-display font-semibold text-foreground bg-card hover:bg-muted transition-forge"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View live site
          </button>
          <button
            type="button"
            data-ocid="live.share_button"
            className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-[13px] font-display font-semibold text-foreground bg-card hover:bg-muted transition-forge"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            type="button"
            data-ocid="live.dashboard_button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-display font-bold hover:opacity-90 transition-forge"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-7 pt-6 border-t border-border">
          {[
            { value: "8.3s", label: "Build time" },
            { value: "97", label: "Lighthouse score" },
            { value: "7", label: "Sections built" },
            { value: "100%", label: "Mobile ready" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-extrabold text-[22px] text-foreground leading-none mb-0.5">
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

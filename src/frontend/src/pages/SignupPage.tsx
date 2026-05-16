import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

// ─── Google SVG logo ──────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Google logo"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── GitHub SVG logo ──────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0 text-foreground"
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label="GitHub logo"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// ─── Shimmer block ────────────────────────────────────────────────────────────
function Skel({ w, h, delay = 0 }: { w: string; h: string; delay?: number }) {
  return (
    <div
      className="rounded bg-primary/10 animate-pulse"
      style={{ width: w, height: h, animationDelay: `${delay}ms` }}
    />
  );
}

// ─── SignupPage ───────────────────────────────────────────────────────────────
export default function SignupPage() {
  const navigate = useNavigate();
  const { siteId } = useSearch({ from: "/signup" });

  function handleAuth() {
    if (siteId) {
      navigate({ to: "/editor/$siteId", params: { siteId } });
    } else {
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <div data-ocid="signup.page" className="min-h-screen bg-background flex">
      {/* Left: preview col */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary/5 border-r border-border relative overflow-hidden flex-1 p-12">
        {/* Orb */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.54 0.247 265.6 / 0.07) 0%, transparent 70%)",
          }}
        />

        {/* Live badge */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-full px-3.5 py-2 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[13px] font-display font-bold text-foreground">
            Your site is ready
          </span>
        </div>

        {/* Browser mockup */}
        <div
          data-ocid="signup.site_preview"
          className="w-full max-w-[400px] bg-card border border-border rounded-xl overflow-hidden shadow-browser"
        >
          <div className="bg-card border-b border-border px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 bg-background border border-border rounded px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              forge.app/preview/my-site
            </div>
          </div>
          <div className="p-5 bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <Skel w="70px" h="9px" />
              <div className="flex gap-2">
                <Skel w="30px" h="7px" delay={100} />
                <Skel w="30px" h="7px" delay={200} />
                <Skel w="44px" h="18px" delay={300} />
              </div>
            </div>
            <Skel w="60%" h="20px" />
            <div className="mt-2 mb-1">
              <Skel w="48%" h="10px" delay={100} />
            </div>
            <Skel w="40%" h="10px" delay={200} />
            <div className="flex gap-2 mt-4">
              <Skel w="80px" h="24px" delay={300} />
              <Skel w="72px" h="24px" delay={400} />
            </div>
          </div>
          <div className="px-5 py-3 grid grid-cols-3 gap-2">
            <div className="bg-card border border-border rounded p-2">
              <Skel w="100%" h="7px" />
              <div className="mt-1">
                <Skel w="70%" h="7px" delay={200} />
              </div>
            </div>
            <div className="bg-card border border-border rounded p-2">
              <Skel w="100%" h="7px" delay={100} />
              <div className="mt-1">
                <Skel w="70%" h="7px" delay={300} />
              </div>
            </div>
            <div className="bg-card border border-border rounded p-2">
              <Skel w="100%" h="7px" delay={200} />
              <div className="mt-1">
                <Skel w="70%" h="7px" delay={400} />
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-5 text-center">
          <p className="font-display font-bold text-foreground text-[17px] mb-1">
            Generated in 8.3 seconds ⚡
          </p>
          <p className="text-[13px] text-muted-foreground">
            A live URL and editor are one step away.
          </p>
        </div>
      </div>

      {/* Right: auth form */}
      <div className="w-full lg:w-[440px] flex-shrink-0 bg-card flex flex-col justify-center px-10 py-12 overflow-y-auto">
        {/* Logo */}
        <p className="font-display font-extrabold text-[21px] text-foreground mb-7">
          Forge<span className="text-primary">.</span>
        </p>

        <h1 className="font-display font-extrabold text-[25px] text-foreground leading-tight tracking-tight mb-2">
          Save your site.
        </h1>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-7">
          Create a free account to get a{" "}
          <span className="text-primary font-semibold">live link</span>, edit
          anything, and publish — in under 2 minutes. No credit card needed.
        </p>

        {/* OAuth buttons */}
        <button
          type="button"
          data-ocid="signup.google_button"
          onClick={handleAuth}
          className="w-full flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-[14px] font-display font-semibold text-foreground bg-card hover:bg-muted hover:border-primary transition-forge mb-3"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          data-ocid="signup.github_button"
          onClick={handleAuth}
          className="w-full flex items-center gap-3 border border-border rounded-lg px-4 py-3 text-[14px] font-display font-semibold text-foreground bg-card hover:bg-muted hover:border-primary transition-forge mb-3"
        >
          <GitHubIcon />
          Continue with GitHub
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[12px] text-muted-foreground font-medium">
            or use email
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email form */}
        <input
          data-ocid="signup.email_input"
          type="email"
          placeholder="you@example.com"
          className="w-full border border-input rounded-lg px-3.5 py-3 text-[14px] text-foreground bg-background placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-forge mb-3"
        />
        <button
          type="button"
          data-ocid="signup.magic_link_button"
          onClick={handleAuth}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-bold text-[14px] rounded-lg py-3 hover:opacity-90 transition-forge"
        >
          <ArrowRight className="w-4 h-4" />
          Send magic link
        </button>

        <p className="text-[11px] text-muted-foreground text-center mt-5 leading-relaxed">
          By continuing you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .<br />
          Free forever on the Starter plan.
        </p>
      </div>
    </div>
  );
}

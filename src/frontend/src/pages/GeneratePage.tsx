import { useGetSite } from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Cpu,
  Image,
  LayoutTemplate,
  Palette,
  PencilLine,
  Rocket,
  Search,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Log steps config ─────────────────────────────────────────────────────────
const LOG_STEPS = [
  {
    icon: Cpu,
    label: "Analysing your brief",
    sub: "Reading project type, niche, and desired features",
  },
  {
    icon: LayoutTemplate,
    label: "Designing page layout",
    sub: "Selecting sections and visual hierarchy",
  },
  {
    icon: Palette,
    label: "Applying visual style",
    sub: "Typography, colours, and spacing",
  },
  {
    icon: PencilLine,
    label: "Writing copy",
    sub: "Headlines, descriptions, and CTAs",
  },
  {
    icon: Image,
    label: "Building sections",
    sub: "Adding requested features and components",
  },
  {
    icon: Search,
    label: "Configuring SEO",
    sub: "Meta title, description, Open Graph tags",
  },
  {
    icon: Smartphone,
    label: "Optimising for mobile",
    sub: "Responsive breakpoints and touch interactions",
  },
  {
    icon: Rocket,
    label: "Preparing preview",
    sub: "Compiling and rendering your site",
  },
] as const;

type StepState = "pending" | "running" | "done";

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────
function SkeletonBlock({
  w,
  h,
  delay = 0,
}: { w: string; h: string; delay?: number }) {
  return (
    <div
      className="rounded bg-primary/10 animate-pulse"
      style={{ width: w, height: h, animationDelay: `${delay}ms` }}
    />
  );
}

// ─── Mini site preview ────────────────────────────────────────────────────────
function MiniSitePreview({ siteTitle }: { siteTitle: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      data-ocid="generate.preview_panel"
    >
      <div className="bg-primary/5 border-b border-border p-3 flex items-center justify-between">
        <span className="font-display font-extrabold text-xs text-primary">
          {siteTitle}
        </span>
        <div className="flex gap-3">
          <span className="text-[9px] text-muted-foreground font-display font-medium">
            Work
          </span>
          <span className="text-[9px] text-muted-foreground font-display font-medium">
            About
          </span>
          <span className="bg-primary text-primary-foreground text-[8px] font-bold font-display px-2 py-0.5 rounded">
            Contact
          </span>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-br from-primary/5 to-background">
        <p className="font-display font-black text-foreground leading-tight text-lg mb-2">
          {siteTitle}
        </p>
        <p className="text-[10px] text-muted-foreground leading-relaxed mb-3 max-w-[200px]">
          Crafted with care — ready to impress your visitors.
        </p>
        <div className="flex gap-2">
          <span className="bg-primary text-primary-foreground text-[9px] font-bold font-display px-2.5 py-1 rounded">
            View work
          </span>
          <span className="border border-primary text-primary text-[9px] font-semibold font-display px-2.5 py-1 rounded">
            Download CV
          </span>
        </div>
      </div>
      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
        {["Case Studies", "Recognition", "Available"].map((label) => (
          <div key={label} className="bg-card border border-border rounded p-2">
            <div className="w-4 h-4 rounded bg-primary/20 mb-1.5" />
            <p className="text-[9px] font-bold font-display text-foreground">
              {label}
            </p>
            <p className="text-[8px] text-muted-foreground mt-0.5">
              Details here
            </p>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-full px-2 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[8px] font-bold font-display text-primary">
          Generated in 8.3s
        </span>
      </div>
    </div>
  );
}

// ─── GeneratePage ─────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const { siteId } = useParams({ from: "/generate/$siteId" });
  const navigate = useNavigate();
  const parsedId = BigInt(siteId);
  const { data: site } = useGetSite(parsedId);

  const [stepStates, setStepStates] = useState<StepState[]>(
    Array(8).fill("pending"),
  );
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const animationDone = useRef(false);

  const siteTitle = site?.name ?? "My Site";

  useEffect(() => {
    if (animationDone.current) return;
    animationDone.current = true;

    const runStep = (index: number) => {
      if (index >= LOG_STEPS.length) {
        // All done
        setTimeout(() => {
          setShowPreview(true);
          setTimeout(() => setShowCta(true), 1500);
        }, 700);
        return;
      }

      // Mark running
      setStepStates((prev) => {
        const next = [...prev];
        next[index] = "running";
        return next;
      });

      const stepDuration = 380 + Math.random() * 280;

      setTimeout(() => {
        // Mark done
        setStepStates((prev) => {
          const next = [...prev];
          next[index] = "done";
          return next;
        });
        setProgress(Math.round(((index + 1) / LOG_STEPS.length) * 100));
        runStep(index + 1);
      }, stepDuration);
    };

    setTimeout(() => runStep(0), 500);
  }, []);

  return (
    <div
      data-ocid="generate.page"
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Nav */}
      <nav className="bg-card border-b border-border px-6 h-14 flex items-center justify-between">
        <span className="font-display font-extrabold text-lg text-foreground">
          Forge<span className="text-primary">.</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-display">
            Building your site…
          </span>
        </div>
      </nav>

      {/* 2-panel body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: log panel */}
        <div className="w-[360px] flex-shrink-0 bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <h2 className="font-display font-bold text-[17px] text-foreground mb-1">
              Building your site…
            </h2>
            <p className="text-[13px] text-muted-foreground">
              Under 10 seconds. Watch it come together.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/5 border border-primary/30 rounded-full px-3 py-1.5">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[12px] font-display font-semibold text-primary">
                {siteTitle}
              </span>
            </div>
          </div>

          {/* Log items */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {LOG_STEPS.map((step, i) => {
              const state = stepStates[i];
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  data-ocid={`generate.log_item.${i + 1}`}
                  className={`flex items-start gap-3 transition-all duration-300 ${
                    state === "pending" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {/* Step icon circle */}
                  <div
                    className={`w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-300 mt-0.5 ${
                      state === "done"
                        ? "bg-accent border-accent"
                        : state === "running"
                          ? "bg-primary/10 border-primary"
                          : "bg-card border-border"
                    }`}
                  >
                    {state === "done" ? (
                      <svg
                        role="img"
                        aria-label="Done"
                        className="w-3 h-3 text-accent-foreground"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          state === "running"
                            ? "text-primary animate-spin"
                            : "text-muted-foreground"
                        }`}
                        style={
                          state === "running" ? { animationDuration: "1s" } : {}
                        }
                      />
                    )}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p
                      className={`font-display text-[12px] leading-tight ${
                        state === "running"
                          ? "font-bold text-foreground"
                          : "font-semibold text-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {step.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-display font-semibold text-muted-foreground">
                Progress
              </span>
              <span
                className="text-[12px] font-display font-bold text-primary"
                data-ocid="generate.progress_pct"
              >
                {progress}%
              </span>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                data-ocid="generate.progress_bar"
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: browser preview */}
        <div className="flex-1 bg-card/50 flex items-center justify-center p-8">
          <div className="w-full max-w-[640px]">
            <p className="text-[11px] font-display font-bold tracking-widest text-muted-foreground uppercase text-center mb-4">
              Live preview
            </p>
            <div
              data-ocid="generate.browser_window"
              className="bg-card border border-border rounded-xl overflow-hidden shadow-browser"
            >
              {/* Browser bar */}
              <div className="bg-card border-b border-border px-3 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-background border border-border rounded px-3 py-1 font-mono text-[11px] text-muted-foreground">
                  forge.app/preview/{siteId.slice(0, 8)}
                </div>
              </div>
              {/* Browser content */}
              <div className="relative" style={{ minHeight: 320 }}>
                {/* Skeleton */}
                {!showPreview && (
                  <div
                    className="absolute inset-0 p-5 flex flex-col gap-3"
                    data-ocid="generate.skeleton"
                  >
                    <div className="flex items-center justify-between">
                      <SkeletonBlock w="80px" h="10px" />
                      <div className="flex gap-2">
                        <SkeletonBlock w="36px" h="8px" delay={200} />
                        <SkeletonBlock w="36px" h="8px" delay={400} />
                        <SkeletonBlock w="52px" h="20px" delay={600} />
                      </div>
                    </div>
                    <SkeletonBlock w="65%" h="22px" delay={100} />
                    <SkeletonBlock w="50%" h="13px" delay={200} />
                    <SkeletonBlock w="42%" h="13px" delay={300} />
                    <div className="flex gap-2 mt-1">
                      <SkeletonBlock w="90px" h="26px" delay={400} />
                      <SkeletonBlock w="80px" h="26px" delay={500} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <SkeletonBlock w="100%" h="58px" delay={300} />
                      <SkeletonBlock w="100%" h="58px" delay={450} />
                      <SkeletonBlock w="100%" h="58px" delay={600} />
                    </div>
                  </div>
                )}
                {/* Real preview */}
                {showPreview && (
                  <div className="animate-fade-in">
                    <MiniSitePreview siteTitle={siteTitle} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA bar — slides up */}
      <div
        data-ocid="generate.cta_bar"
        className={`bg-card border-t border-border px-6 py-4 flex items-center justify-between transition-all duration-500 ${
          showCta
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-display font-bold text-foreground">
            Your site is ready.
          </span>{" "}
          Create a free account to save it and get a live link.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="generate.view_preview_button"
            onClick={() => navigate({ to: "/signup", search: { siteId } })}
            className="px-4 py-2 text-[13px] font-display font-semibold border border-border rounded-lg text-foreground hover:bg-muted transition-forge"
          >
            View full preview
          </button>
          <button
            type="button"
            data-ocid="generate.save_site_button"
            onClick={() => navigate({ to: "/signup", search: { siteId } })}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-display font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-forge"
          >
            Save my site — it's free
          </button>
        </div>
      </div>
    </div>
  );
}

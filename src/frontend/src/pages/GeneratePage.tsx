import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useGetSite } from "@/hooks/useQueries";
import type { GeneratedSite } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Code2,
  FileText,
  LayoutDashboard,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Loading steps ────────────────────────────────────────────────────────────
const LOADING_STEPS = [
  { message: "Analyzing your business...", icon: Zap },
  { message: "Designing your layout...", icon: Palette },
  { message: "Writing your content...", icon: FileText },
  { message: "Building your pages...", icon: Code2 },
  { message: "Almost there...", icon: Sparkles },
];

// ─── Orbiting particle ────────────────────────────────────────────────────────
function OrbitRing({
  radius,
  duration,
  color,
}: { radius: number; duration: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full border opacity-20"
      style={{
        width: radius * 2,
        height: radius * 2,
        borderColor: color,
        top: "50%",
        left: "50%",
        marginTop: -radius,
        marginLeft: -radius,
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      <div
        className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: color, top: 0, left: "50%" }}
      />
    </motion.div>
  );
}

// ─── GeneratePage ─────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const { siteId } = useParams({ from: "/generate/$siteId" });
  const navigate = useNavigate();
  const parsedId = BigInt(siteId);

  const { data: site, isLoading } = useGetSite(parsedId);

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generatedData = site?.generatedData as GeneratedSite | undefined;
  const isReady = !isLoading && !!generatedData;

  // Cycle through loading steps every 1.5s
  useEffect(() => {
    if (revealed) return;
    intervalRef.current = setInterval(() => {
      setStepIndex((i) => (i + 1) % LOADING_STEPS.length);
    }, 1500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [revealed]);

  // Animate the progress bar
  useEffect(() => {
    if (revealed) return;
    const target = isReady ? 100 : Math.min(progress + 2, 92);
    const timer = setTimeout(() => setProgress(target), isReady ? 0 : 80);
    return () => clearTimeout(timer);
  });

  // Trigger reveal when data is ready
  useEffect(() => {
    if (!isReady || revealed) return;
    setProgress(100);
    const timer = setTimeout(() => {
      setRevealed(true);
      setTimeout(() => setShowSuccess(true), 200);
    }, 600);
    return () => clearTimeout(timer);
  }, [isReady, revealed]);

  const StepIcon = LOADING_STEPS[stepIndex].icon;

  return (
    <ProtectedRoute>
      <div
        data-ocid="generate.page"
        className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden"
      >
        {/* Background ambient glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.65 0.25 300 / 0.12) 0%, transparent 70%)",
            }}
            animate={
              showSuccess
                ? { scale: [1, 1.3, 1], opacity: [0.12, 0.28, 0.18] }
                : { scale: [1, 1.08, 1] }
            }
            transition={
              showSuccess
                ? { duration: 1.2, ease: "easeOut" }
                : {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
            }
          />
        </div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            /* ─── Loading State ─────────────────────────────────────── */
            <motion.div
              key="loading"
              data-ocid="generate.loading_state"
              className="flex flex-col items-center gap-8 px-6 text-center max-w-md w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Orbital animation */}
              <div className="relative flex items-center justify-center w-32 h-32">
                <OrbitRing
                  radius={64}
                  duration={8}
                  color="oklch(0.65 0.25 300)"
                />
                <OrbitRing
                  radius={48}
                  duration={5}
                  color="oklch(0.75 0.18 55)"
                />
                <OrbitRing
                  radius={32}
                  duration={3}
                  color="oklch(0.65 0.25 300)"
                />

                {/* Center icon — cycles with step */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIndex}
                    className="relative z-10 w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <StepIcon className="w-6 h-6 text-primary" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                  Forge is building your site
                </h1>
                <p className="text-muted-foreground text-sm">
                  AI is designing every detail — won't take long
                </p>
              </div>

              {/* Step message */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={LOADING_STEPS[stepIndex].message}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-foreground">
                    {LOADING_STEPS[stepIndex].message}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="w-full">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.65 0.25 300), oklch(0.75 0.18 55))",
                    }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground text-right">
                  {Math.round(progress)}%
                </p>
              </div>

              {/* Step dots */}
              <div className="flex gap-2">
                {LOADING_STEPS.map((step, i) => (
                  <motion.div
                    key={step.message}
                    className="rounded-full"
                    animate={{
                      width: i === stepIndex ? 20 : 6,
                      backgroundColor:
                        i === stepIndex
                          ? "oklch(0.65 0.25 300)"
                          : "oklch(0.28 0.02 260)",
                    }}
                    style={{ height: 6 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            /* ─── Success State ─────────────────────────────────────── */
            <motion.div
              key="success"
              data-ocid="generate.success_state"
              className="flex flex-col items-center gap-8 px-6 text-center max-w-lg w-full"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Checkmark with glow */}
              <motion.div
                className="relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: "0 0 60px 20px oklch(0.65 0.25 300 / 0.35)",
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/60 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
                  Your site is ready!
                </h1>
                <p className="text-muted-foreground text-base">
                  Forge has built your site from scratch — review and publish
                  when you're ready.
                </p>
              </motion.div>

              {/* Site card */}
              {generatedData && (
                <motion.div
                  data-ocid="generate.card"
                  className="w-full rounded-2xl bg-card border border-border p-6 text-left relative overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {/* Violet shimmer stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.65 0.25 300), oklch(0.75 0.18 55), transparent)",
                    }}
                  />
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                        Site Generated
                      </p>
                      <h2 className="font-display text-xl font-bold text-foreground truncate">
                        {generatedData.siteTitle}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {generatedData.tagline}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-muted-foreground">
                          {generatedData.sections.length} sections
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {generatedData.layout.contentWidth} layout
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Ready to edit
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <Button
                  data-ocid="generate.open_editor_button"
                  size="lg"
                  className="flex-1 font-semibold gap-2 transition-smooth"
                  onClick={() =>
                    navigate({ to: "/editor/$siteId", params: { siteId } })
                  }
                >
                  Open Editor
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  data-ocid="generate.dashboard_button"
                  size="lg"
                  variant="outline"
                  className="flex-1 font-semibold gap-2 transition-smooth"
                  onClick={() => navigate({ to: "/dashboard" })}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </motion.div>

              <motion.p
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                You can preview and publish from the editor at any time.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}

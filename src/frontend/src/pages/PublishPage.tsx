import ProtectedRoute from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPreLaunchChecks,
  useGetSite,
  usePublishSite,
} from "@/hooks/useQueries";
import type { PreLaunchChecks } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Monitor,
  Search,
  Smartphone,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CheckItem {
  key: keyof PreLaunchChecks;
  label: string;
  passHint: string;
  failHint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CHECK_ITEMS: CheckItem[] = [
  {
    key: "seoTitle",
    label: "SEO Title & Meta",
    passHint: "Title and meta description are set correctly.",
    failHint: "Add a page title and meta description in Settings.",
    icon: Search,
  },
  {
    key: "mobileLayout",
    label: "Mobile Layout",
    passHint: "Your site renders perfectly on mobile devices.",
    failHint: "Preview on mobile and adjust any overflowing sections.",
    icon: Smartphone,
  },
  {
    key: "performance",
    label: "Performance",
    passHint: "Assets are optimised for fast load times.",
    failHint: "Compress images and remove unused sections to improve speed.",
    icon: Zap,
  },
  {
    key: "formsWorking",
    label: "Forms & Actions",
    passHint: "Contact forms and CTAs are configured and functional.",
    failHint: "Set a destination email for your contact form.",
    icon: Monitor,
  },
];

const PUBLISH_MESSAGES = [
  "Bundling your site assets…",
  "Optimising images for the web…",
  "Configuring your subdomain…",
  "Running final validation checks…",
  "Deploying to the global edge network…",
  "Your site is going live!",
];

// ─── Confetti ────────────────────────────────────────────────────────────────
function Confetti() {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      color: [
        "hsl(300 60% 65%)",
        "hsl(55 80% 65%)",
        "hsl(200 70% 65%)",
        "hsl(140 60% 55%)",
        "hsl(25 80% 65%)",
      ][Math.floor(Math.random() * 5)],
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            rotate: p.rotate,
          }}
          animate={{
            y: [0, window.innerHeight + 40],
            rotate: [p.rotate, p.rotate + 360 + Math.random() * 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// ─── Check Row ───────────────────────────────────────────────────────────────
function CheckRow({
  item,
  passing,
  index,
}: {
  item: CheckItem;
  passing: boolean;
  index: number;
}) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className={`flex items-start gap-4 rounded-xl border p-4 transition-smooth ${
        passing
          ? "border-green-500/20 bg-green-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}
      data-ocid={`publish.check.item.${index + 1}`}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          passing ? "bg-green-500/15" : "bg-amber-500/15"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${passing ? "text-green-400" : "text-amber-400"}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold text-foreground">
            {item.label}
          </span>
          {passing ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: index * 0.1 + 0.2,
                type: "spring",
                stiffness: 400,
              }}
            >
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: index * 0.1 + 0.2,
                type: "spring",
                stiffness: 400,
              }}
            >
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </motion.div>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {passing ? item.passHint : item.failHint}
        </p>
      </div>
    </motion.div>
  );
}

function CheckRowSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl border border-border p-4"
      data-ocid={`publish.check.loading.${index + 1}`}
    >
      <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
    </div>
  );
}

// ─── Publishing State ─────────────────────────────────────────────────────────
function PublishingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, PUBLISH_MESSAGES.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="publishing"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col items-center gap-6 py-12 text-center"
      data-ocid="publish.loading_state"
    >
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Publishing Your Site
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            {PUBLISH_MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5">
        {PUBLISH_MESSAGES.map((msg, i) => (
          <motion.div
            key={msg}
            className="h-1.5 rounded-full bg-primary/30"
            animate={{
              width: i <= msgIndex ? 24 : 8,
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────
function SuccessState({
  liveUrl,
  onDashboard,
}: {
  liveUrl: string;
  onDashboard: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-8 py-8 text-center"
      data-ocid="publish.success_state"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500/15 text-green-400"
      >
        <CheckCircle2 className="h-12 w-12" strokeWidth={1.5} />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-400/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2.5,
            delay: 0.5,
          }}
        />
      </motion.div>

      <div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-display text-3xl font-bold text-foreground"
        >
          You're Live! 🚀
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-muted-foreground"
        >
          Your site is now deployed and accessible to the world.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-md rounded-xl border border-green-500/25 bg-green-500/5 p-1"
      >
        <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-2">
          <Globe className="h-4 w-4 shrink-0 text-green-400" />
          <span
            className="min-w-0 flex-1 truncate text-sm font-medium text-foreground"
            data-ocid="publish.live_url"
          >
            {liveUrl}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleCopy}
            data-ocid="publish.copy_url_button"
            aria-label="Copy URL"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      >
        <Button
          type="button"
          className="flex-1 gap-2"
          onClick={() => window.open(liveUrl, "_blank")}
          data-ocid="publish.view_live_button"
        >
          <ExternalLink className="h-4 w-4" />
          View Live Site
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          onClick={onDashboard}
          data-ocid="publish.back_to_dashboard_button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PublishPage() {
  const { siteId } = useParams({ from: "/publish/$siteId" });
  const siteIdBigInt = useMemo(() => BigInt(siteId), [siteId]);
  const navigate = useNavigate();

  const { data: checks, isLoading: checksLoading } =
    useGetPreLaunchChecks(siteIdBigInt);
  const { data: site } = useGetSite(siteIdBigInt);
  const publishMutation = usePublishSite();

  const [customDomain, setCustomDomain] = useState("");
  const [publishPhase, setPublishPhase] = useState<
    "idle" | "publishing" | "success"
  >("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subdomain = site?.subdomain ?? `my-site-${siteId}.forge.app`;
  const liveUrl = site?.publishedUrl ?? `https://${subdomain}`;

  const allPassing = checks ? Object.values(checks).every(Boolean) : false;
  const anyFailing = checks ? !allPassing : false;
  const checksReady = !checksLoading && checks !== null && checks !== undefined;

  useEffect(() => {
    return () => {
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
    };
  }, []);

  async function handlePublish() {
    setPublishPhase("publishing");
    try {
      await publishMutation.mutateAsync(siteIdBigInt);
      setTimeout(() => {
        setPublishPhase("success");
        setShowConfetti(true);
        confettiTimerRef.current = setTimeout(
          () => setShowConfetti(false),
          5000,
        );
      }, PUBLISH_MESSAGES.length * 900);
    } catch {
      setPublishPhase("idle");
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background" data-ocid="publish.page">
        {showConfetti && <Confetti />}

        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-card shadow-subtle">
          <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => navigate({ to: "/dashboard" })}
              data-ocid="publish.back_button"
              aria-label="Back to editor"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="font-display text-lg font-bold text-foreground">
                Pre-Launch Checklist
              </h1>
              <p className="text-xs text-muted-foreground">
                {site?.title ?? "Your site"} — review before going live
              </p>
            </div>
            {/* Step progress dots */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-2 rounded-full ${
                    step < 4 ? "bg-primary" : "bg-primary/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-3xl px-6 py-10">
          <AnimatePresence mode="wait">
            {publishPhase === "publishing" ? (
              <PublishingState key="publishing" />
            ) : publishPhase === "success" ? (
              <SuccessState
                key="success"
                liveUrl={liveUrl}
                onDashboard={() => navigate({ to: "/dashboard" })}
              />
            ) : (
              <motion.div
                key="checklist"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Checklist Section */}
                <section data-ocid="publish.checks.section">
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-bold text-foreground">
                        Site Health Checks
                      </h2>
                      {checksReady && (
                        <Badge
                          variant="secondary"
                          className={`gap-1.5 text-xs ${
                            allPassing
                              ? "border-green-500/30 bg-green-500/15 text-green-400"
                              : "border-amber-500/30 bg-amber-500/15 text-amber-400"
                          }`}
                          data-ocid="publish.checks.status_badge"
                        >
                          {allPassing ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          {allPassing ? "All checks passed" : "Issues found"}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Automated checks run against your site to ensure it's
                      production-ready.
                    </p>
                  </motion.div>

                  <div className="space-y-3" data-ocid="publish.checks.list">
                    {checksLoading
                      ? CHECK_ITEMS.map((item, i) => (
                          <CheckRowSkeleton key={item.key} index={i} />
                        ))
                      : CHECK_ITEMS.map((item, i) => (
                          <CheckRow
                            key={item.key}
                            item={item}
                            passing={checks ? Boolean(checks[item.key]) : false}
                            index={i}
                          />
                        ))}
                  </div>
                </section>

                {/* Domain Setup Section */}
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border bg-card p-6"
                  data-ocid="publish.domain.section"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-foreground">
                        Domain Setup
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Your site will be live at the address below
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Free subdomain */}
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Free subdomain
                      </p>
                      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
                        <Globe className="h-4 w-4 shrink-0 text-primary" />
                        <span
                          className="min-w-0 flex-1 truncate font-mono text-sm text-foreground"
                          data-ocid="publish.domain.subdomain"
                        >
                          {subdomain}
                        </span>
                        <Badge
                          variant="secondary"
                          className="shrink-0 border-green-500/30 bg-green-500/10 text-xs text-green-400"
                        >
                          Free
                        </Badge>
                      </div>
                    </div>

                    {/* Custom domain */}
                    <div>
                      <label
                        htmlFor="custom-domain"
                        className="mb-1.5 block text-xs font-medium text-muted-foreground"
                      >
                        Custom domain{" "}
                        <span className="text-primary">(optional)</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="custom-domain"
                          type="text"
                          placeholder="yourdomain.com"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          className="flex-1 font-mono text-sm"
                          data-ocid="publish.domain.custom_input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="shrink-0"
                          disabled
                          data-ocid="publish.domain.connect_button"
                        >
                          Connect
                        </Button>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Custom domain configuration coming soon. Your free
                        subdomain is always available.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Publish CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="rounded-2xl border border-border bg-muted/30 p-6"
                >
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <h3 className="font-display text-base font-bold text-foreground">
                        Ready to go live?
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {checksReady && anyFailing
                          ? "Some checks failed — you can still publish, but we recommend fixing them first."
                          : checksReady
                            ? "All checks passed. Your site is ready for the world!"
                            : "Running checks… please wait before publishing."}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {checksReady && anyFailing && (
                        <Badge
                          variant="secondary"
                          className="border-amber-500/30 bg-amber-500/10 text-xs text-amber-400"
                          data-ocid="publish.warning_badge"
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Issues found
                        </Badge>
                      )}
                      <Button
                        type="button"
                        disabled={!checksReady || publishMutation.isPending}
                        onClick={handlePublish}
                        className={`gap-2 px-6 font-semibold transition-smooth ${
                          checksReady && allPassing
                            ? "border-0 bg-green-600 text-white hover:bg-green-500"
                            : ""
                        }`}
                        data-ocid="publish.publish_button"
                      >
                        {publishMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : checksReady && allPassing ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Publish Live
                          </>
                        ) : checksReady && anyFailing ? (
                          <>
                            <AlertTriangle className="h-4 w-4" />
                            Publish Anyway
                          </>
                        ) : (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Checking…
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {publishMutation.isError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground"
                      data-ocid="publish.error_state"
                    >
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span>Publish failed. Please try again.</span>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ProtectedRoute>
  );
}

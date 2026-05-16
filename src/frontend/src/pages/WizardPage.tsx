import { SelectedFeature, SiteType, VisualStyle } from "@/backend";
import { useGenerateSite } from "@/hooks/useQueries";
import type { WizardInput } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  Mail,
  Monitor,
  ShoppingBag,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  siteType: SiteType | "";
  niche: string;
  vibe: VisualStyle | "";
  features: SelectedFeature[];
}

const TOTAL_STEPS = 4;

// ─── Step 1 data ─────────────────────────────────────────────────────────────

const SITE_TYPES: {
  value: SiteType;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    value: SiteType.agency,
    label: "Agency",
    icon: <Monitor size={28} />,
    desc: "Professional company site",
  },
  {
    value: SiteType.portfolio,
    label: "Portfolio",
    icon: <User size={28} />,
    desc: "Showcase your work",
  },
  {
    value: SiteType.blog,
    label: "Blog",
    icon: <BookOpen size={28} />,
    desc: "Share your story",
  },
  {
    value: SiteType.ecommerce,
    label: "E-commerce",
    icon: <ShoppingBag size={28} />,
    desc: "Sell products online",
  },
  {
    value: SiteType.landingPage,
    label: "Landing Page",
    icon: <Zap size={28} />,
    desc: "High-conversion single page",
  },
];

// ─── Step 3 data ─────────────────────────────────────────────────────────────

const VIBES: { value: VisualStyle; label: string; desc: string }[] = [
  { value: VisualStyle.minimal, label: "Minimal", desc: "Clean and simple" },
  { value: VisualStyle.bold, label: "Bold", desc: "High-impact and striking" },
  { value: VisualStyle.warm, label: "Warm", desc: "Friendly and approachable" },
  { value: VisualStyle.luxury, label: "Luxury", desc: "Premium and refined" },
  { value: VisualStyle.playful, label: "Playful", desc: "Fun and colourful" },
];

// ─── Step 4 data ─────────────────────────────────────────────────────────────

const FEATURE_LIST: {
  value: SelectedFeature;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: SelectedFeature.contactForm,
    label: "Contact Form",
    desc: "Let visitors reach you easily",
    icon: <Mail size={22} />,
  },
  {
    value: SelectedFeature.bookingCalendar,
    label: "Bookings",
    desc: "Accept appointments or reservations",
    icon: <Calendar size={22} />,
  },
  {
    value: SelectedFeature.userAccounts,
    label: "User Accounts",
    desc: "User accounts and protected areas",
    icon: <Lock size={22} />,
  },
  {
    value: SelectedFeature.newsletter,
    label: "Newsletter",
    desc: "Email signup and notifications",
    icon: <Mail size={22} />,
  },
  {
    value: SelectedFeature.blog,
    label: "Blog",
    desc: "Articles and content publishing",
    icon: <BookOpen size={22} />,
  },
  {
    value: SelectedFeature.payments,
    label: "Payments",
    desc: "Accept payments online",
    icon: <ShoppingBag size={22} />,
  },
];

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const labels = ["Site Type", "Describe", "Visual Style", "Features"];
  return (
    <div className="mb-10" data-ocid="wizard.progress">
      <div className="flex items-center justify-between mb-3">
        {labels.map((label, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div
              key={`step-${num}`}
              className="flex flex-col items-center gap-1.5 flex-1"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ease-out ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary/20 border-2 border-primary text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check size={14} /> : num}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          animate={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Step {step} of {TOTAL_STEPS}
      </p>
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function StepSiteType({
  value,
  onChange,
}: {
  value: SiteType | "";
  onChange: (v: SiteType) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-1">
        What kind of site do you need?
      </h2>
      <p className="text-muted-foreground mb-8">
        Choose the type that best describes your goal.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {SITE_TYPES.map((t) => {
          const selected = value === t.value;
          return (
            <button
              key={t.value}
              type="button"
              data-ocid={`wizard.site_type.${t.value}`}
              onClick={() => onChange(t.value)}
              className={`relative flex flex-col items-start gap-3 p-5 rounded-xl border-2 text-left transition-all duration-300 ease-out group ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/60"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg transition-all duration-300 ease-out ${
                  selected
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground group-hover:text-primary"
                }`}
              >
                {t.icon}
              </div>
              <div>
                <p className="font-semibold text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </div>
              {selected && (
                <motion.div
                  layoutId="site-type-check"
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Check size={10} className="text-primary-foreground" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function StepDescribeBusiness({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const maxLength = 600;
  const count = value.length;
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-1">
        Tell us about your business
      </h2>
      <p className="text-muted-foreground mb-8">
        Describe what you do, who you serve, and what makes you unique.
      </p>
      <div className="relative">
        <textarea
          data-ocid="wizard.description.textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          rows={7}
          placeholder="e.g. We're a boutique coffee roastery in Portland crafting single-origin beans for home enthusiasts. Our monthly subscription delivers freshly roasted bags right to your door."
          className="w-full resize-none rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground/60 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ease-out"
        />
        <span
          className={`absolute bottom-3 right-4 text-xs transition-colors ${
            count > maxLength * 0.9 ? "text-accent" : "text-muted-foreground"
          }`}
        >
          {count}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function StepVisualStyle({
  vibe,
  onChange,
}: {
  vibe: VisualStyle | "";
  onChange: (v: VisualStyle) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-1">
        Pick your visual style
      </h2>
      <p className="text-muted-foreground mb-8">
        Choose the vibe that feels right for your brand.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {VIBES.map((v) => {
          const selected = vibe === v.value;
          return (
            <button
              key={v.value}
              type="button"
              data-ocid={`wizard.vibe.${v.value}`}
              onClick={() => onChange(v.value)}
              className={`flex flex-col p-4 rounded-xl border-2 text-left transition-all duration-300 ease-out ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span
                className={`text-sm font-semibold mb-1 ${selected ? "text-primary" : "text-foreground"}`}
              >
                {v.label}
              </span>
              <span className="text-xs text-muted-foreground">{v.desc}</span>
              {selected && <Check size={14} className="mt-2 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function StepFeatures({
  features,
  onChange,
}: {
  features: SelectedFeature[];
  onChange: (feature: SelectedFeature) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-1">
        What features do you need?
      </h2>
      <p className="text-muted-foreground mb-8">
        Enable the functionality you want built into your site.
      </p>
      <div className="flex flex-col gap-4">
        {FEATURE_LIST.map((feat) => {
          const enabled = features.includes(feat.value);
          return (
            <button
              key={feat.value}
              type="button"
              data-ocid={`wizard.feature.${feat.value}`}
              onClick={() => onChange(feat.value)}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-300 ease-out ${
                enabled
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg transition-all duration-300 ease-out flex-shrink-0 ${
                  enabled
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {feat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{feat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {feat.desc}
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-out ${
                  enabled ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {enabled && (
                  <Check size={12} className="text-primary-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function WizardPage() {
  const navigate = useNavigate();
  const generateSite = useGenerateSite();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const { control, watch, setValue, handleSubmit } = useForm<FormData>({
    defaultValues: {
      siteType: "",
      niche: "",
      vibe: "",
      features: [],
    },
  });

  const values = watch();

  function canAdvance() {
    if (step === 1) return values.siteType !== "";
    if (step === 2) return values.niche.trim().length > 20;
    if (step === 3) return values.vibe !== "";
    return true;
  }

  function goNext() {
    if (!canAdvance()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function onSubmit() {
    const data = values;
    if (!data.siteType || !data.vibe) return;

    const input: WizardInput = {
      siteType: data.siteType as SiteType,
      niche: data.niche,
      vibe: data.vibe as VisualStyle,
      features: data.features,
    };

    generateSite.mutate(input, {
      onSuccess: ([siteId]: [bigint, string]) => {
        navigate({
          to: "/generate/$siteId",
          params: { siteId: siteId.toString() },
        });
      },
      onError: () => {
        toast.error("Failed to generate site. Please try again.");
      },
    });
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40, y: 8 }),
    center: { opacity: 1, x: 0, y: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40, y: -8 }),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-subtle px-6 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles size={14} className="text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Forge
          </span>
        </div>
        <span className="text-muted-foreground text-sm ml-2">
          Create New Site
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <ProgressBar step={step} />

          {/* Step panel */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated overflow-hidden relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                {step === 1 && (
                  <Controller
                    name="siteType"
                    control={control}
                    render={({ field }) => (
                      <StepSiteType
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                      />
                    )}
                  />
                )}
                {step === 2 && (
                  <Controller
                    name="niche"
                    control={control}
                    render={({ field }) => (
                      <StepDescribeBusiness
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
                {step === 3 && (
                  <Controller
                    name="vibe"
                    control={control}
                    render={({ field }) => (
                      <StepVisualStyle
                        vibe={field.value}
                        onChange={(v) => field.onChange(v)}
                      />
                    )}
                  />
                )}
                {step === 4 && (
                  <StepFeatures
                    features={values.features}
                    onChange={(feature) => {
                      const current = values.features;
                      const next = current.includes(feature)
                        ? current.filter((f) => f !== feature)
                        : [...current, feature];
                      setValue("features", next);
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              data-ocid="wizard.back_button"
              onClick={goBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium transition-all duration-300 ease-out hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                data-ocid="wizard.next_button"
                onClick={goNext}
                disabled={!canAdvance()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all duration-300 ease-out hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-subtle"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                data-ocid="wizard.generate_button"
                onClick={handleSubmit(onSubmit)}
                disabled={generateSite.isPending}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all duration-300 ease-out hover:bg-primary/90 disabled:opacity-60 shadow-elevated"
              >
                {generateSite.isPending ? (
                  <>
                    <span
                      className="w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin"
                      data-ocid="wizard.generate_button.loading_state"
                    />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate My Site
                  </>
                )}
              </button>
            )}
          </div>

          {step === 2 &&
            values.niche.trim().length < 20 &&
            values.niche.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground mt-3 text-center"
                data-ocid="wizard.description.field_error"
              >
                Add a few more details to continue (at least 20 characters)
              </motion.p>
            )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

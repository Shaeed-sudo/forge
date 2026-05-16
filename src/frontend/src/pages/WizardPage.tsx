import { useGenerateSite } from "@/hooks/useQueries";
import type {
  SelectedFeatures,
  SitePublic,
  SiteType,
  VisualStyle,
  WizardInput,
} from "@/types";
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
  businessDescription: string;
  palette: string;
  fontFamily: string;
  features: SelectedFeatures;
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
    value: "business",
    label: "Business",
    icon: <Monitor size={28} />,
    desc: "Professional company site",
  },
  {
    value: "portfolio",
    label: "Portfolio",
    icon: <User size={28} />,
    desc: "Showcase your work",
  },
  {
    value: "blog",
    label: "Blog",
    icon: <BookOpen size={28} />,
    desc: "Share your story",
  },
  {
    value: "ecommerce",
    label: "E-commerce",
    icon: <ShoppingBag size={28} />,
    desc: "Sell products online",
  },
  {
    value: "landing",
    label: "Landing Page",
    icon: <Zap size={28} />,
    desc: "High-conversion single page",
  },
];

// ─── Step 3 data ─────────────────────────────────────────────────────────────

const PALETTES: { value: string; label: string; colors: string[] }[] = [
  {
    value: "modern-dark",
    label: "Modern Dark",
    colors: ["#7c3aed", "#4f46e5", "#1e1b4b"],
  },
  {
    value: "clean-light",
    label: "Clean Light",
    colors: ["#0ea5e9", "#38bdf8", "#f0f9ff"],
  },
  {
    value: "warm-earthy",
    label: "Warm Earthy",
    colors: ["#d97706", "#92400e", "#fffbeb"],
  },
  {
    value: "bold-vibrant",
    label: "Bold Vibrant",
    colors: ["#db2777", "#7c3aed", "#fff"],
  },
];

const FONTS: { value: string; label: string; preview: string }[] = [
  { value: "Inter", label: "Inter", preview: "Clean & Modern" },
  {
    value: "Playfair Display",
    label: "Playfair + Inter",
    preview: "Elegant Editorial",
  },
  { value: "Space Grotesk", label: "Space Grotesk", preview: "Techy & Bold" },
  { value: "Roboto", label: "Roboto + Georgia", preview: "Reliable Classic" },
];

// ─── Step 4 data ─────────────────────────────────────────────────────────────

const FEATURE_LIST: {
  key: keyof SelectedFeatures;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "contactForm",
    label: "Contact Form",
    desc: "Let visitors reach you easily",
    icon: <Mail size={22} />,
  },
  {
    key: "bookings",
    label: "Bookings",
    desc: "Accept appointments or reservations",
    icon: <Calendar size={22} />,
  },
  {
    key: "auth",
    label: "Authentication",
    desc: "User accounts and protected areas",
    icon: <Lock size={22} />,
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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-smooth ${
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
              className={`relative flex flex-col items-start gap-3 p-5 rounded-xl border-2 text-left transition-smooth group ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/60"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg transition-smooth ${
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
          className="w-full resize-none rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground/60 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
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
  palette,
  fontFamily,
  onPaletteChange,
  onFontChange,
}: {
  palette: string;
  fontFamily: string;
  onPaletteChange: (v: string) => void;
  onFontChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-1">
        Pick your visual style
      </h2>
      <p className="text-muted-foreground mb-8">
        Choose a color palette and typography that feel right for your brand.
      </p>

      <div className="mb-8">
        <p className="text-sm font-semibold text-foreground mb-3">
          Color Palette
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PALETTES.map((p) => {
            const selected = palette === p.value;
            return (
              <button
                key={p.value}
                type="button"
                data-ocid={`wizard.palette.${p.value}`}
                onClick={() => onPaletteChange(p.value)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-smooth ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex gap-1">
                  {p.colors.map((c, ci) => (
                    <span
                      key={`${p.value}-color-${ci}`}
                      className="w-5 h-5 rounded-full border border-border/40"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span
                  className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}
                >
                  {p.label}
                </span>
                {selected && (
                  <Check size={14} className="ml-auto text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Typography</p>
        <div className="grid grid-cols-2 gap-3">
          {FONTS.map((f) => {
            const selected = fontFamily === f.value;
            return (
              <button
                key={f.value}
                type="button"
                data-ocid={`wizard.font.${f.value.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => onFontChange(f.value)}
                className={`flex flex-col p-3.5 rounded-xl border-2 text-left transition-smooth ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}
                >
                  {f.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {f.preview}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function StepFeatures({
  features,
  onChange,
}: {
  features: SelectedFeatures;
  onChange: (key: keyof SelectedFeatures, val: boolean) => void;
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
          const enabled = features[feat.key];
          return (
            <button
              key={feat.key}
              type="button"
              data-ocid={`wizard.feature.${feat.key}`}
              onClick={() => onChange(feat.key, !enabled)}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-smooth ${
                enabled
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg transition-smooth flex-shrink-0 ${
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
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-smooth ${
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
      businessDescription: "",
      palette: "modern-dark",
      fontFamily: "Space Grotesk",
      features: {
        contactForm: false,
        bookings: false,
        auth: false,
        blog: false,
        ecommerce: false,
        analytics: false,
      },
    },
  });

  const values = watch();

  function canAdvance() {
    if (step === 1) return values.siteType !== "";
    if (step === 2) return values.businessDescription.trim().length > 20;
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
    if (!data.siteType) return;

    const paletteMap: Record<string, string> = {
      "modern-dark": "modern",
      "clean-light": "minimal",
      "warm-earthy": "elegant",
      "bold-vibrant": "bold",
    };

    const input: WizardInput = {
      siteType: data.siteType as SiteType,
      businessDescription: data.businessDescription,
      visualStyle: (paletteMap[data.palette] ?? "modern") as VisualStyle,
      selectedFeatures: data.features,
    };

    generateSite.mutate(input, {
      onSuccess: (site: SitePublic) => {
        navigate({
          to: "/generate/$siteId",
          params: { siteId: site.id.toString() },
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
                    name="businessDescription"
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
                  <StepVisualStyle
                    palette={values.palette}
                    fontFamily={values.fontFamily}
                    onPaletteChange={(v) => setValue("palette", v)}
                    onFontChange={(v) => setValue("fontFamily", v)}
                  />
                )}
                {step === 4 && (
                  <StepFeatures
                    features={values.features}
                    onChange={(key, val) =>
                      setValue("features", { ...values.features, [key]: val })
                    }
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium transition-smooth hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-subtle"
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
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-smooth hover:bg-primary/90 disabled:opacity-60 shadow-elevated"
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
            values.businessDescription.trim().length < 20 &&
            values.businessDescription.length > 0 && (
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

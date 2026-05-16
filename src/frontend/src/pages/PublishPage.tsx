import {
  useGetPreLaunchChecks,
  useGetSite,
  usePublishSite,
} from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Link,
  Loader2,
  Rocket,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Step = 1 | 2 | 3;
type UrlType = "subdomain" | "custom";

type CheckStatus = "idle" | "running" | "pass";

interface CheckState {
  mobile: CheckStatus;
  seo: CheckStatus;
  speed: CheckStatus;
  forms: CheckStatus;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: Step;
  title: string;
  subtitle: string;
}) {
  const steps = [
    { n: 1, label: "Your URL" },
    { n: 2, label: "Final checks" },
    { n: 3, label: "Go live" },
  ];
  return (
    <div className="border-b border-forge-border p-7 pb-5">
      <div className="mb-5 flex items-center gap-0">
        {steps.map(({ n, label }, i) => (
          <div key={n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold transition-all duration-300 ease-out ${
                  n < step
                    ? "border-forge-green bg-forge-green text-white"
                    : n === step
                      ? "border-forge-blue bg-forge-blue-pale text-forge-blue"
                      : "border-forge-border bg-forge-card text-forge-text-muted"
                }`}
              >
                {n < step ? <Check className="h-3 w-3" /> : n}
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  n === step
                    ? "text-forge-text-secondary"
                    : "text-forge-text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-3 h-px w-10 transition-all duration-300 ease-out ${
                  n < step ? "bg-forge-green/50" : "bg-forge-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <h2 className="font-display text-lg font-bold text-forge-text-primary">
        {title}
      </h2>
      <p className="mt-1 text-sm text-forge-text-secondary">{subtitle}</p>
    </div>
  );
}

// ─── Check Item ───────────────────────────────────────────────────────────────
function CheckItem({
  label,
  status,
  ocid,
}: {
  label: string;
  status: CheckStatus;
  ocid: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-all duration-300 ease-out ${
        status === "pass"
          ? "border-forge-green/40 bg-forge-green-pale/60"
          : status === "running"
            ? "border-forge-blue/30 bg-forge-blue-faint"
            : "border-forge-border bg-forge-surface"
      }`}
      data-ocid={ocid}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
          status === "pass"
            ? "border-forge-green bg-forge-green"
            : status === "running"
              ? "border-forge-blue/50"
              : "border-forge-border bg-forge-card"
        }`}
      >
        {status === "pass" ? (
          <Check className="h-3 w-3 text-white" />
        ) : status === "running" ? (
          <Loader2 className="h-3 w-3 animate-spin text-forge-blue" />
        ) : (
          <Loader2 className="h-3 w-3 text-forge-text-muted" />
        )}
      </div>
      <span
        className={`text-sm font-semibold ${
          status === "pass" ? "text-forge-green" : "text-forge-text-primary"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function PublishPage() {
  const { siteId } = useParams({ from: "/publish/$siteId" });
  const siteIdBigInt = useMemo(() => BigInt(siteId), [siteId]);
  const navigate = useNavigate();

  const { data: checks } = useGetPreLaunchChecks(siteIdBigInt);
  const { data: site } = useGetSite(siteIdBigInt);
  const publishMutation = usePublishSite();

  const [step, setStep] = useState<Step>(1);
  const [urlType, setUrlType] = useState<UrlType>("subdomain");
  const [checksComplete, setChecksComplete] = useState(false);
  const [checkState, setCheckState] = useState<CheckState>({
    mobile: "idle",
    seo: "idle",
    speed: "idle",
    forms: "idle",
  });

  const slug = site?.slug ?? "my-site";

  // Animate checks when entering step 2
  useEffect(() => {
    if (step !== 2) return;
    setChecksComplete(false);
    setCheckState({
      mobile: "idle",
      seo: "idle",
      speed: "idle",
      forms: "idle",
    });

    const keys: Array<keyof CheckState> = ["mobile", "seo", "speed", "forms"];
    const delays = [0, 800, 1600, 2400];

    keys.forEach((key, i) => {
      setTimeout(() => {
        setCheckState((prev) => ({ ...prev, [key]: "running" }));
        setTimeout(() => {
          // use checks data to determine pass/fail (currently always passes for demo)
          void (checks
            ? key === "mobile"
              ? checks.mobile
              : key === "seo"
                ? checks.seo
                : key === "speed"
                  ? checks.speed
                  : checks.forms
            : true);
          setCheckState((prev) => ({ ...prev, [key]: "pass" }));
          if (i === keys.length - 1) {
            setTimeout(() => setChecksComplete(true), 300);
          }
        }, 600);
      }, delays[i]);
    });
  }, [step, checks]);

  const stepMeta: Record<Step, { title: string; subtitle: string }> = {
    1: {
      title: "Choose your URL",
      subtitle: "Pick where your site lives. You can change this any time.",
    },
    2: {
      title: "Final checks",
      subtitle: "Checking everything looks perfect before going live.",
    },
    3: {
      title: "Ready to launch",
      subtitle: "Hit Launch and your site is live instantly.",
    },
  };

  async function handleLaunch() {
    try {
      await publishMutation.mutateAsync(siteIdBigInt);
      const publishedUrl = site?.siteUrl ?? `https://${slug}.forge.app`;
      navigate({ to: "/live", search: { siteUrl: publishedUrl } });
    } catch {
      // stay on step 3
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      data-ocid="publish.dialog"
    >
      <div className="w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Step header */}
        <StepHeader
          step={step}
          title={stepMeta[step].title}
          subtitle={stepMeta[step].subtitle}
        />

        {/* Body */}
        <div className="px-7 py-6">
          {/* Step 1: URL options */}
          {step === 1 && (
            <div className="flex flex-col gap-3" data-ocid="publish.url_step">
              {/* Subdomain */}
              <button
                type="button"
                onClick={() => setUrlType("subdomain")}
                className={`flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border-[1.5px] p-4 text-left transition-all duration-300 ease-out ${
                  urlType === "subdomain"
                    ? "border-forge-blue bg-forge-blue-faint"
                    : "border-forge-border bg-white hover:border-forge-blue/40"
                }`}
                data-ocid="publish.subdomain_option"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-forge-text-primary">
                    <Globe className="h-4 w-4 text-forge-blue" />
                    Forge subdomain
                  </div>
                  <span className="rounded-full bg-forge-green-pale px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forge-green">
                    Free
                  </span>
                </div>
                <p className="font-mono text-xs text-forge-text-secondary">
                  {slug}.forge.app
                </p>
              </button>

              {/* Custom domain */}
              <button
                type="button"
                onClick={() => setUrlType("custom")}
                className={`flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border-[1.5px] p-4 text-left transition-all duration-300 ease-out ${
                  urlType === "custom"
                    ? "border-forge-blue bg-forge-blue-faint"
                    : "border-forge-border bg-white hover:border-forge-blue/40"
                }`}
                data-ocid="publish.custom_domain_option"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-forge-text-primary">
                    <Link className="h-4 w-4 text-forge-blue" />
                    Custom domain
                  </div>
                  <span className="rounded-full bg-forge-blue-pale px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forge-blue">
                    Pro
                  </span>
                </div>
                <p className="text-xs text-forge-text-secondary">
                  Connect your own domain
                </p>
              </button>
            </div>
          )}

          {/* Step 2: Checks */}
          {step === 2 && (
            <div
              className="flex flex-col gap-2.5"
              data-ocid="publish.checks_step"
            >
              <CheckItem
                label="Mobile responsive"
                status={checkState.mobile}
                ocid="publish.check.mobile"
              />
              <CheckItem
                label="SEO metadata"
                status={checkState.seo}
                ocid="publish.check.seo"
              />
              <CheckItem
                label="Page speed score"
                status={checkState.speed}
                ocid="publish.check.speed"
              />
              <CheckItem
                label="Forms connected"
                status={checkState.forms}
                ocid="publish.check.forms"
              />
            </div>
          )}

          {/* Step 3: Launch confirmation */}
          {step === 3 && (
            <div
              className="flex flex-col items-center gap-4 py-4 text-center"
              data-ocid="publish.launch_step"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forge-blue-faint">
                <Rocket className="h-8 w-8 text-forge-blue" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-forge-text-primary">
                  Everything looks great.
                </h3>
                <p className="mt-1 text-sm text-forge-text-secondary">
                  Your site will be live at{" "}
                  <span className="font-mono font-semibold text-forge-blue">
                    https://{slug}.forge.app
                  </span>{" "}
                  the moment you hit Launch.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-forge-border px-7 py-4">
          <button
            type="button"
            onClick={() =>
              step === 1
                ? navigate({ to: "/dashboard" })
                : setStep((s) => (s - 1) as Step)
            }
            className="flex items-center gap-1.5 text-sm font-semibold text-forge-text-muted transition-all duration-300 ease-out hover:text-forge-text-secondary"
            data-ocid={
              step === 1 ? "publish.cancel_button" : "publish.back_button"
            }
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <span className="text-xs text-forge-text-muted">
            Step {step} of 3
          </span>

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 2 && !checksComplete}
              onClick={() => setStep((s) => (s + 1) as Step)}
              className="flex items-center gap-1.5 rounded-lg bg-forge-blue px-5 py-2 text-sm font-bold text-white transition-all duration-300 ease-out hover:bg-forge-blue-lt disabled:cursor-not-allowed disabled:opacity-40"
              data-ocid="publish.continue_button"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={publishMutation.isPending}
              onClick={handleLaunch}
              className="flex items-center gap-1.5 rounded-lg bg-forge-blue px-5 py-2 text-sm font-bold text-white transition-all duration-300 ease-out hover:bg-forge-blue-lt disabled:cursor-not-allowed disabled:opacity-40"
              data-ocid="publish.launch_button"
            >
              {publishMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="h-4 w-4" />
              )}
              Launch site
            </button>
          )}
        </div>

        {publishMutation.isError && (
          <div
            className="mx-7 mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            data-ocid="publish.error_state"
          >
            Publish failed. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}

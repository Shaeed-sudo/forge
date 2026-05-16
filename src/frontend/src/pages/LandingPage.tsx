import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Globe,
  Layers,
  MousePointerClick,
  Pencil,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useInternetIdentity();

  const scrollToDemo = () => {
    document
      .getElementById("demo")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center min-h-[90vh] overflow-hidden"
        data-ocid="landing.hero_section"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/forge-hero.dim_1400x788.jpg')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered. No code. No agency.
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight mb-6 animate-slide-up">
            From idea to live site
            <br />
            <span className="text-primary">in minutes.</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            No code. No agency. Just describe what you want and Forge builds it.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {isAuthenticated ? (
              <Link to="/wizard">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
                  data-ocid="landing.start_building_button"
                >
                  <Zap className="w-5 h-5" fill="currentColor" />
                  Start Building Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
                  data-ocid="landing.get_started_button"
                >
                  <Zap className="w-5 h-5" fill="currentColor" />
                  Start Building Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              onClick={scrollToDemo}
              data-ocid="landing.see_example_button"
            >
              <MousePointerClick className="w-4 h-4" />
              See an example
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="bg-muted/30 border-y border-border py-20"
        data-ocid="landing.features_section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-3">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Forge handles every step — from design to deployment — so you can
              focus on your business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3 hover:border-primary/40 transition-smooth animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                data-ocid={`landing.feature_card.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <f.Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────── */}
      <section
        id="demo"
        className="bg-background py-24"
        data-ocid="landing.how_it_works_section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-3">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Four steps from blank page to live site. No waiting, no guessing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.title}
                className="flex items-start gap-5 mb-10 last:mb-0 animate-slide-up"
                style={{ animationDelay: `${i * 0.12}s` }}
                data-ocid={`landing.how_it_works_step.${i + 1}`}
              >
                {/* Step number + connector */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <step.Icon className="w-5 h-5 text-primary" />
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="w-px flex-1 mt-2 bg-gradient-to-b from-primary/20 to-transparent min-h-[2.5rem]" />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1.5">
                  <div className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section
        className="bg-muted/30 border-t border-border py-24"
        data-ocid="landing.cta_section"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Zap
                className="w-7 h-7 text-primary"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Ready to build?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of businesses that launched with Forge — no code,
              no agency, no waiting.
            </p>
            <Link to={isAuthenticated ? "/wizard" : "/login"}>
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10"
                data-ocid="landing.cta_primary_button"
              >
                <Zap className="w-5 h-5" fill="currentColor" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const FEATURES = [
  {
    Icon: Sparkles,
    title: "AI Generation",
    description:
      "Describe your business in plain language and watch Forge design, write, and structure your entire site automatically.",
  },
  {
    Icon: Layers,
    title: "Visual Editor",
    description:
      "Preview your site across desktop, tablet, and mobile. Tweak layouts and content with a pixel-perfect canvas editor.",
  },
  {
    Icon: Globe,
    title: "One-Click Publish",
    description:
      "Pre-launch checks verify SEO, performance, and mobile layout — then deploy to a live URL in seconds.",
  },
];

const HOW_IT_WORKS = [
  {
    Icon: Pencil,
    title: "Describe your site",
    description:
      "Tell Forge what kind of site you need — your business, your audience, your goals. A few sentences is all it takes.",
  },
  {
    Icon: Sparkles,
    title: "Generate everything",
    description:
      "Forge's AI generates your full site in seconds: layout, copy, color palette, sections, and features — all tailored to you.",
  },
  {
    Icon: Layers,
    title: "Edit in the visual editor",
    description:
      "Preview across desktop, tablet, and mobile. Tweak sections, headlines, and styles — no code required.",
  },
  {
    Icon: Rocket,
    title: "Publish live",
    description:
      "Run automated pre-launch checks, then deploy to a free Forge subdomain or your own custom domain with one click.",
  },
];

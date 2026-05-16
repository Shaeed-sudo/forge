import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  CalendarCheck,
  Check,
  Cpu,
  CreditCard,
  Download,
  Edit3,
  Globe,
  History,
  Image,
  Layers,
  LayoutTemplate,
  Leaf,
  Mail,
  MailOpen,
  MessageCircle,
  Minus,
  PencilLine,
  Quote,
  Rocket,
  ShoppingCart,
  Sparkles,
  Square,
  Star,
  User,
  Utensils,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ onStart }: { onStart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          padding: "0 48px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.4s ease, border-color 0.4s ease",
          borderBottom: scrolled
            ? "1px solid #dde2ef"
            : "1px solid transparent",
          background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
        }}
        data-ocid="landing.nav"
      >
        <a
          href="/"
          style={{
            fontFamily: "Montserrat,sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: "#0d1117",
            letterSpacing: "-0.5px",
            textDecoration: "none",
          }}
          data-ocid="landing.nav_logo"
        >
          Forge<span style={{ color: "#0051ff" }}>.</span>
        </a>
        <ul
          className="hidden md:flex"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <button
                type="button"
                onClick={() => scrollTo(l.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#4a5568",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#0d1117";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.color = "#0d1117";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.color = "#4a5568";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#4a5568";
                }}
                data-ocid={`landing.nav_link.${l.label.toLowerCase()}`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <div
          className="hidden md:flex"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#4a5568",
              fontWeight: 500,
              fontSize: 15,
              border: "1px solid #dde2ef",
              borderRadius: 8,
              padding: "13px 24px",
              background: "transparent",
              cursor: "pointer",
              transition: "color 0.25s, border-color 0.25s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#0d1117";
              e.currentTarget.style.borderColor = "#9aa0b4";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#4a5568";
              e.currentTarget.style.borderColor = "#dde2ef";
            }}
            onFocus={(e) => {
              e.currentTarget.style.color = "#0d1117";
              e.currentTarget.style.borderColor = "#9aa0b4";
            }}
            onBlur={(e) => {
              e.currentTarget.style.color = "#4a5568";
              e.currentTarget.style.borderColor = "#dde2ef";
            }}
            data-ocid="landing.nav_signin_button"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={onStart}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg,#0051ff,#3374ff)",
              color: "#fff",
              fontFamily: "Roboto,sans-serif",
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 8,
              padding: "14px 28px",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.3s, transform 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "none";
            }}
            onFocus={(e) => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "none";
            }}
            data-ocid="landing.nav_start_button"
          >
            Start for Free
          </button>
        </div>
        <button
          type="button"
          className="flex md:hidden flex-col"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          data-ocid="landing.hamburger_button"
          style={{
            gap: 5,
            padding: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "#4a5568",
              borderRadius: 2,
              transition: "all 0.3s",
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "#4a5568",
              borderRadius: 2,
              transition: "all 0.3s",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "#4a5568",
              borderRadius: 2,
              transition: "all 0.3s",
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fff",
          zIndex: 800,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transition: "opacity 0.35s",
        }}
        data-ocid="landing.mobile_menu"
      >
        {NAV_LINKS.map((l) => (
          <button
            type="button"
            key={l.label}
            onClick={() => scrollTo(l.id)}
            style={{
              fontFamily: "Montserrat,sans-serif",
              fontSize: 36,
              color: "#0d1117",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {l.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            navigate({ to: "/dashboard" });
          }}
          style={{
            fontFamily: "Montserrat,sans-serif",
            fontSize: 36,
            color: "#0d1117",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            onStart();
          }}
          style={{
            background: "linear-gradient(135deg,#0051ff,#3374ff)",
            color: "#fff",
            fontFamily: "Roboto,sans-serif",
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 8,
            padding: "14px 28px",
            border: "none",
            cursor: "pointer",
            marginTop: 8,
          }}
          data-ocid="landing.mobile_start_button"
        >
          Start for Free
        </button>
      </div>
    </>
  );
}

// ─── Hero Wizard ───────────────────────────────────────────────────────────────
type WizardAnswers = {
  siteType: string;
  niche: string;
  vibe: string;
  features: string[];
};

function HeroWizard({
  onGenerate,
}: { onGenerate: (a: WizardAnswers) => void }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<WizardAnswers>({
    siteType: "",
    niche: "",
    vibe: "",
    features: [],
  });
  const nicheRef = useRef<HTMLInputElement>(null);
  const TOTAL = 4;

  const canProceed = () => {
    if (step === 1) return answers.siteType !== "";
    if (step === 2)
      return (nicheRef.current?.value.trim() ?? answers.niche) !== "";
    if (step === 3) return answers.vibe !== "";
    return true;
  };

  const handleNext = () => {
    if (step <= TOTAL && !canProceed()) return;
    const niche = nicheRef.current?.value.trim() ?? answers.niche;
    const updated = { ...answers, niche };
    if (step === TOTAL) {
      setAnswers(updated);
      setStep(5);
      return;
    }
    if (step === 5) {
      onGenerate(updated);
      return;
    }
    if (step === 2) setAnswers((a) => ({ ...a, niche }));
    setStep((s) => s + 1);
  };

  const summary = `Build me a ${answers.siteType || "website"} for ${answers.niche || "my project"}. The design should feel ${answers.vibe || "minimal"}. Include: ${answers.features.length ? answers.features.join(", ") : "no extra features"}.`;

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        border: "2px solid #dde2ef",
        borderRadius: 16,
        overflow: "hidden",
      }}
      data-ocid="landing.wizard"
    >
      {/* Progress */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "18px 28px",
          borderBottom: "1px solid #dde2ef",
        }}
      >
        {[1, 2, 3, 4].map((n, idx) => (
          <>
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                flex: idx < 3 ? 1 : "none",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "Montserrat,sans-serif",
                  flexShrink: 0,
                  border:
                    n < step
                      ? "1.5px solid #0051ff"
                      : n === step
                        ? "1.5px solid #0051ff"
                        : "1.5px solid #dde2ef",
                  background:
                    n < step
                      ? "#0051ff"
                      : n === step
                        ? "rgba(0,81,255,0.06)"
                        : "#eef1f8",
                  color: n < step ? "#fff" : n === step ? "#0051ff" : "#9aa0b4",
                  transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {n < step ? "✓" : n}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "Montserrat,sans-serif",
                  marginLeft: 8,
                  whiteSpace: "nowrap",
                  color: n === step ? "#4a5568" : "#9aa0b4",
                  letterSpacing: "0.3px",
                }}
              >
                {["Site type", "Your niche", "Look & feel", "Features"][n - 1]}
              </span>
            </div>
            {idx < 3 && (
              <div
                key={`c${n}`}
                style={{
                  flex: 1,
                  height: 1,
                  background: n < step ? "rgba(0,81,255,0.35)" : "#dde2ef",
                  margin: "0 12px",
                  transition: "background 0.35s",
                }}
              />
            )}
          </>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: "28px 28px 24px" }}>
        {step === 1 && (
          <WizStep1
            answers={answers}
            setAnswers={setAnswers}
            onAutoAdvance={() => setTimeout(() => setStep(2), 280)}
          />
        )}
        {step === 2 && <WizStep2 nicheRef={nicheRef} answers={answers} />}
        {step === 3 && (
          <WizStep3
            answers={answers}
            setAnswers={setAnswers}
            onAutoAdvance={() => setTimeout(() => setStep(4), 280)}
          />
        )}
        {step === 4 && <WizStep4 answers={answers} setAnswers={setAnswers} />}
        {step === 5 && (
          <div>
            <p
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#0d1117",
                marginBottom: 6,
              }}
            >
              Here's your brief — ready to build?
            </p>
            <p style={{ fontSize: 13, color: "#9aa0b4", marginBottom: 20 }}>
              Forge has everything it needs. Hit generate and watch it come
              alive.
            </p>
            <div
              style={{
                background: "#eef1f8",
                border: "1px solid rgba(0,81,255,0.2)",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase" as const,
                  color: "#0051ff",
                  marginBottom: 10,
                  fontFamily: "Montserrat,sans-serif",
                }}
              >
                Your prompt
              </div>
              <div
                style={{
                  fontFamily: "Fira Code,monospace",
                  fontSize: 13,
                  color: "#4a5568",
                  lineHeight: 1.7,
                }}
              >
                {summary}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 28px 24px",
          borderTop: "1px solid #dde2ef",
        }}
      >
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#9aa0b4",
            fontFamily: "Montserrat,sans-serif",
            padding: "8px 0",
            background: "none",
            border: "none",
            cursor: step === 1 ? "default" : "pointer",
            opacity: step === 1 ? 0 : 1,
            transition: "opacity 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          data-ocid="landing.wizard_back_button"
        >
          ← Back
        </button>
        <span style={{ fontSize: 12, color: "#9aa0b4" }}>
          {step > TOTAL ? "Ready to launch" : `Step ${step} of ${TOTAL}`}
        </span>
        <button
          type="button"
          onClick={handleNext}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg,#0051ff,#3374ff)",
            color: "#fff",
            fontFamily: "Montserrat,sans-serif",
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 10,
            padding: "12px 28px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "none";
          }}
          onFocus={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "none";
          }}
          data-ocid="landing.wizard_next_button"
        >
          {step > TOTAL
            ? "⚡ Generate My Site"
            : step === TOTAL
              ? "Review brief →"
              : "Continue →"}
        </button>
      </div>
    </div>
  );
}

function WizOptBtn({
  selected,
  onClick,
  Icon,
  label,
  dataOcid,
}: {
  selected: boolean;
  onClick: () => void;
  Icon: LucideIcon;
  label: string;
  dataOcid?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: selected ? "1.5px solid #0051ff" : "1.5px solid #dde2ef",
        borderRadius: 12,
        padding: "14px 10px",
        textAlign: "center" as const,
        cursor: "pointer",
        background: selected ? "rgba(0,81,255,0.07)" : "rgba(0,81,255,0.025)",
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
      aria-pressed={selected}
      data-ocid={dataOcid}
    >
      <Icon
        style={{
          width: 24,
          height: 24,
          display: "block",
          margin: "0 auto 10px",
          color: selected ? "#0051ff" : "#4a5568",
          strokeWidth: 1.75,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: selected ? "#0051ff" : "#4a5568",
          fontFamily: "Montserrat,sans-serif",
        }}
      >
        {label}
      </span>
    </button>
  );
}

function WizStep1({
  answers,
  setAnswers,
  onAutoAdvance,
}: {
  answers: WizardAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<WizardAnswers>>;
  onAutoAdvance: () => void;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "Montserrat,sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: "#0d1117",
          marginBottom: 6,
        }}
      >
        What kind of site do you need?
      </p>
      <p style={{ fontSize: 13, color: "#9aa0b4", marginBottom: 20 }}>
        Pick one — we'll tailor everything around it.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
        }}
        role="radiogroup"
      >
        {SITE_TYPES.map((t) => (
          <WizOptBtn
            key={t.value}
            selected={answers.siteType === t.value}
            onClick={() => {
              setAnswers((a) => ({ ...a, siteType: t.value }));
              onAutoAdvance();
            }}
            Icon={t.Icon}
            label={t.label}
            dataOcid={`landing.wizard_site_type.${t.value.replace(/ /g, "_")}`}
          />
        ))}
      </div>
    </div>
  );
}

function WizStep2({
  nicheRef,
  answers,
}: {
  nicheRef: React.RefObject<HTMLInputElement | null>;
  answers: WizardAnswers;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "Montserrat,sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: "#0d1117",
          marginBottom: 6,
        }}
      >
        Tell us a little about your project.
      </p>
      <p style={{ fontSize: 13, color: "#9aa0b4", marginBottom: 20 }}>
        What's it called, and what does it do? A sentence is plenty.
      </p>
      <input
        ref={nicheRef}
        defaultValue={answers.niche}
        type="text"
        placeholder="e.g. Maya Chen — UX designer specialising in fintech apps"
        maxLength={120}
        style={{
          width: "100%",
          background: "#eef1f8",
          border: "1.5px solid #dde2ef",
          borderRadius: 10,
          padding: "14px 16px",
          fontFamily: "Roboto,sans-serif",
          fontSize: 15,
          color: "#0d1117",
          outline: "none",
          marginBottom: 16,
          caretColor: "#0051ff",
          display: "block",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#0051ff";
          e.target.style.background = "#fff";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#dde2ef";
          e.target.style.background = "#eef1f8";
        }}
        data-ocid="landing.wizard_niche_input"
      />
      <div
        style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}
        aria-label="Quick suggestions"
      >
        {CHIPS.map((c) => (
          <button
            type="button"
            key={c.label}
            onClick={() => {
              if (nicheRef.current) nicheRef.current.value = c.fill;
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,81,255,0.4)";
              e.currentTarget.style.color = "#0d1117";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#dde2ef";
              e.currentTarget.style.color = "#4a5568";
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              border: "1px solid #dde2ef",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 500,
              color: "#4a5568",
              background: "rgba(0,81,255,0.02)",
              cursor: "pointer",
              transition: "all 0.22s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,81,255,0.4)";
              e.currentTarget.style.color = "#0d1117";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#dde2ef";
              e.currentTarget.style.color = "#4a5568";
            }}
            data-ocid={`landing.wizard_chip.${c.label.toLowerCase()}`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function WizStep3({
  answers,
  setAnswers,
  onAutoAdvance,
}: {
  answers: WizardAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<WizardAnswers>>;
  onAutoAdvance: () => void;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "Montserrat,sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: "#0d1117",
          marginBottom: 6,
        }}
      >
        What vibe should your site have?
      </p>
      <p style={{ fontSize: 13, color: "#9aa0b4", marginBottom: 20 }}>
        This shapes the colour palette, layout, and tone of the copy.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 10,
        }}
        role="radiogroup"
      >
        {VIBES.map((v) => (
          <WizOptBtn
            key={v.value}
            selected={answers.vibe === v.value}
            onClick={() => {
              setAnswers((a) => ({ ...a, vibe: v.value }));
              onAutoAdvance();
            }}
            Icon={v.Icon}
            label={v.label}
            dataOcid={`landing.wizard_vibe.${v.value.replace(/ /g, "_")}`}
          />
        ))}
      </div>
    </div>
  );
}

function WizStep4({
  answers,
  setAnswers,
}: {
  answers: WizardAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<WizardAnswers>>;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "Montserrat,sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: "#0d1117",
          marginBottom: 6,
        }}
      >
        Which features do you need?
      </p>
      <p style={{ fontSize: 13, color: "#9aa0b4", marginBottom: 20 }}>
        Pick as many as you like — we'll wire them all up.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        {FEATURES_LIST.map((f) => {
          const sel = answers.features.includes(f.value);
          return (
            <button
              type="button"
              key={f.value}
              onClick={() => {
                setAnswers((a) => ({
                  ...a,
                  features: sel
                    ? a.features.filter((x) => x !== f.value)
                    : [...a.features, f.value],
                }));
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: sel ? "1.5px solid #0051ff" : "1.5px solid #dde2ef",
                borderRadius: 10,
                padding: "12px 14px",
                cursor: "pointer",
                background: sel
                  ? "rgba(0,81,255,0.07)"
                  : "rgba(0,81,255,0.025)",
                transition: "all 0.22s",
              }}
              aria-pressed={sel}
              data-ocid={`landing.wizard_feature.${f.value.replace(/ /g, "_")}`}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: sel ? "1.5px solid #0051ff" : "1.5px solid #dde2ef",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: sel ? "#0051ff" : "transparent",
                  fontSize: 11,
                  color: "#fff",
                  transition: "all 0.2s",
                }}
              >
                {sel && "✓"}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: sel ? "#0d1117" : "#4a5568",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <f.Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                {f.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bento Card ───────────────────────────────────────────────────────────────
function BentoCard({
  children,
  cols,
  delay = 0,
}: { children: React.ReactNode; cols: number; delay?: number }) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: `span ${cols}`,
        background: "#eef1f8",
        border: hovered ? "1px solid rgba(0,81,255,0.35)" : "1px solid #dde2ef",
        borderRadius: 16,
        padding: 32,
        position: "relative",
        overflow: "hidden",
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        boxShadow: hovered ? "0 20px 60px rgba(0,81,255,0.12)" : "none",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, box-shadow 0.35s`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top right,rgba(0,81,255,0.05) 0%,transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─── Price Card ───────────────────────────────────────────────────────────────
function PriceCard({
  name,
  price,
  period,
  features,
  missing = [],
  featured = false,
  badge,
  cta,
  onCta,
  delay = 0,
}: {
  name: string;
  price: number;
  period: string;
  features: string[];
  missing?: string[];
  featured?: boolean;
  badge?: string;
  cta: string;
  onCta: () => void;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        background: featured
          ? "linear-gradient(160deg,rgba(0,81,255,0.06) 0%,#eef1f8 40%)"
          : "#eef1f8",
        border: featured ? "1px solid rgba(0,81,255,0.4)" : "1px solid #dde2ef",
        borderRadius: 20,
        padding: 36,
        boxShadow: featured
          ? "0 0 60px rgba(0,81,255,0.08),0 30px 80px rgba(0,0,0,0.06)"
          : "none",
        transform: visible
          ? featured
            ? "scale(1.04)"
            : "none"
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.35s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {badge && (
        <div
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#0051ff,#3374ff)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase" as const,
            borderRadius: 999,
            padding: "4px 12px",
            marginBottom: 20,
          }}
        >
          {badge}
        </div>
      )}
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase" as const,
          color: "#9aa0b4",
          marginBottom: 12,
        }}
      >
        {name}
      </p>
      <div
        style={{
          fontFamily: "Montserrat,sans-serif",
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 20,
            verticalAlign: "super",
            fontFamily: "Roboto,sans-serif",
          }}
        >
          $
        </span>
        {price}
      </div>
      <p style={{ fontSize: 14, color: "#9aa0b4", marginBottom: 28 }}>
        {period}
      </p>
      <div style={{ height: 1, background: "#dde2ef", marginBottom: 24 }} />
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 32,
          listStyle: "none",
          padding: 0,
        }}
      >
        {features.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 15,
              color: "#4a5568",
            }}
          >
            <span
              style={{
                color: "#0051ff",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                marginTop: 1,
              }}
            >
              <Check size={15} strokeWidth={2.5} />
            </span>
            {f}
          </li>
        ))}
        {missing.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 15,
              color: "#9aa0b4",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                marginTop: 1,
              }}
            >
              <Minus size={14} strokeWidth={2} />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onCta}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...(featured
            ? {
                background: "linear-gradient(135deg,#0051ff,#3374ff)",
                color: "#fff",
                border: "none",
                padding: "14px 28px",
              }
            : {
                background: "transparent",
                color: "#4a5568",
                border: "1px solid #dde2ef",
                padding: "13px 24px",
              }),
          fontFamily: "Roboto,sans-serif",
          fontWeight: 700,
          fontSize: 15,
          borderRadius: 8,
          cursor: "pointer",
          transition: "all 0.25s",
        }}
        data-ocid={`landing.pricing_cta.${name.toLowerCase()}`}
      >
        {cta}
      </button>
    </div>
  );
}

// ─── Testi Card ───────────────────────────────────────────────────────────────
function TestiCard({
  quote,
  name,
  role,
  initials,
  offset = 0,
  delay = 0,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  offset?: number;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#eef1f8",
        border: hovered ? "1px solid rgba(0,81,255,0.2)" : "1px solid #dde2ef",
        borderRadius: 16,
        padding: 28,
        marginTop: offset,
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "none"
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s`,
      }}
    >
      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={13}
            style={{ fill: "#0051ff", color: "#0051ff" }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: 15,
          color: "#4a5568",
          lineHeight: 1.7,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "Montserrat,sans-serif",
            fontSize: 36,
            color: "rgba(0,81,255,0.3)",
            lineHeight: 0,
            verticalAlign: -12,
            marginRight: 4,
          }}
        >
          “
        </span>
        {quote}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#f4f6fb,#eef1f8)",
            border: "1px solid #dde2ef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#0051ff",
            flexShrink: 0,
            fontFamily: "Montserrat,sans-serif",
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0d1117" }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: "#9aa0b4", marginTop: 2 }}>
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  function heroEl(i: number): React.CSSProperties {
    return {
      opacity: heroVisible ? 1 : 0,
      transform: heroVisible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${100 + i * 140}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${100 + i * 140}ms`,
    };
  }

  const handleStart = () => navigate({ to: "/wizard" });

  return (
    <div
      style={{
        background: "#ffffff",
        color: "#0d1117",
        fontFamily: "Roboto,sans-serif",
        overflowX: "hidden",
      }}
    >
      <div className="grain-overlay" aria-hidden="true" />
      <Nav onStart={handleStart} />

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
        aria-labelledby="hero-headline"
        data-ocid="landing.hero_section"
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(0,81,255,0.06) 0%,transparent 70%)",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(0,81,255,0.04) 0%,transparent 70%)",
            bottom: 0,
            right: -100,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            ...heroEl(0),
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid rgba(0,81,255,0.3)",
            borderRadius: 999,
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 500,
            color: "#4a5568",
            marginBottom: 32,
            background: "rgba(0,81,255,0.04)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#0051ff",
              boxShadow: "0 0 8px rgba(0,81,255,0.5)",
              flexShrink: 0,
              display: "inline-block",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
          <Sparkles size={13} style={{ color: "#0051ff" }} />
          Now in public beta
        </div>

        <h1
          id="hero-headline"
          style={{
            ...heroEl(1),
            fontFamily: "Montserrat,sans-serif",
            fontSize: "clamp(52px,7vw,86px)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-2.5px",
            marginBottom: 24,
            maxWidth: 760,
          }}
        >
          Describe it.
          <br />
          We build it.
          <br />
          <span style={{ color: "#0051ff" }}>You launch it.</span>
        </h1>

        <p
          style={{
            ...heroEl(2),
            fontSize: "clamp(17px,2.2vw,21px)",
            color: "#4a5568",
            maxWidth: 540,
            lineHeight: 1.65,
            marginBottom: 48,
            fontWeight: 400,
          }}
        >
          From prompt to production-ready website or app — in seconds. No code.
          No templates. No agency.
        </p>

        <div
          style={{
            ...heroEl(3),
            width: "100%",
            maxWidth: 760,
            marginBottom: 20,
          }}
        >
          <HeroWizard onGenerate={handleStart} />
        </div>

        <div
          style={{
            ...heroEl(4),
            fontSize: 13,
            color: "#9aa0b4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap" as const,
          }}
          data-ocid="landing.trust_line"
        >
          Trusted by 12,400+ builders
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#9aa0b4",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
          No credit card required
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#9aa0b4",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
          Deploy in 60 seconds
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <section
        style={{
          padding: "72px 0",
          borderTop: "1px solid #dde2ef",
          overflow: "hidden",
        }}
        aria-label="Companies whose employees use Forge"
      >
        <Reveal>
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "#9aa0b4",
              fontWeight: 600,
              marginBottom: 36,
            }}
          >
            Built by people at companies like
          </p>
        </Reveal>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: 120,
              background: "linear-gradient(to right,#fff,transparent)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              width: 120,
              background: "linear-gradient(to left,#fff,transparent)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          <div
            className="marquee-track"
            style={{ display: "flex", gap: 60, width: "max-content" }}
            aria-hidden="true"
          >
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span
                key={`logo-${l}-${i % LOGOS.length}`}
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#9aa0b4",
                  whiteSpace: "nowrap",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}
        aria-labelledby="hiw-headline"
        data-ocid="landing.how_it_works_section"
      >
        <Reveal>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#0051ff",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            How it works
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            id="hiw-headline"
            style={{
              fontFamily: "Montserrat,sans-serif",
              fontSize: "clamp(36px,4.5vw,56px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              marginBottom: 20,
            }}
          >
            Three steps.
            <br />
            One result.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p
            style={{
              fontSize: 18,
              color: "#4a5568",
              maxWidth: 520,
              lineHeight: 1.65,
              marginBottom: 64,
            }}
          >
            No learning curve. No setup. Just describe what you want and watch
            it come alive.
          </p>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 42,
              left: "calc(16.66% + 24px)",
              right: "calc(16.66% + 24px)",
              height: 1,
              background:
                "linear-gradient(to right,transparent,#dde2ef 20%,#dde2ef 80%,transparent)",
            }}
          />
          {HOW_IT_WORKS_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <div
                style={{
                  padding: 32,
                  position: "relative",
                  borderRadius: 16,
                  border: "1px solid transparent",
                  transition:
                    "border-color 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseOver={(e) => {
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.borderColor = "rgba(0,81,255,0.2)";
                  d.style.transform = "translateY(-4px)";
                }}
                onFocus={(e) => {
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.borderColor = "rgba(0,81,255,0.2)";
                  d.style.transform = "translateY(-4px)";
                }}
                onMouseOut={(e) => {
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.borderColor = "transparent";
                  d.style.transform = "none";
                }}
                onBlur={(e) => {
                  const d = e.currentTarget as HTMLDivElement;
                  d.style.borderColor = "transparent";
                  d.style.transform = "none";
                }}
                data-ocid={`landing.how_it_works_step.${i + 1}`}
              >
                <div
                  style={{
                    fontFamily: "Montserrat,sans-serif",
                    fontSize: 80,
                    fontWeight: 700,
                    color: "#dde2ef",
                    lineHeight: 1,
                    marginBottom: 24,
                  }}
                >
                  {s.num}
                </div>
                <div style={{ marginBottom: 16, color: "#0051ff" }}>
                  <s.Icon size={28} strokeWidth={1.75} />
                </div>
                <h3
                  style={{
                    fontFamily: "Montserrat,sans-serif",
                    fontSize: 26,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#0d1117",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.65 }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section
        id="features"
        style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}
        aria-labelledby="feat-headline"
        data-ocid="landing.features_section"
      >
        <Reveal>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#0051ff",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            What you get
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            id="feat-headline"
            style={{
              fontFamily: "Montserrat,sans-serif",
              fontSize: "clamp(36px,4.5vw,56px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              marginBottom: 20,
            }}
          >
            Everything, included.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p
            style={{
              fontSize: 18,
              color: "#4a5568",
              maxWidth: 520,
              lineHeight: 1.65,
              marginBottom: 64,
            }}
          >
            No plugins. No add-ons. No spreadsheet of monthly fees. One tool
            that does the whole job.
          </p>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            gridAutoRows: "auto",
            gap: 16,
          }}
        >
          <BentoCard cols={7}>
            <span
              style={{
                display: "inline-flex",
                color: "#0051ff",
                marginBottom: 20,
              }}
            >
              <Brain size={32} strokeWidth={1.5} />
            </span>
            <h3
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 12,
                color: "#0d1117",
              }}
            >
              AI Understands Context
            </h3>
            <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.65 }}>
              It reads between the lines. Industry, tone, target audience, and
              brand voice — all inferred automatically. Your bakery site won't
              look like a SaaS dashboard.
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 20,
                flexWrap: "wrap" as const,
              }}
            >
              {["Context-aware", "Brand-fit", "Industry-tuned"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase" as const,
                    color: "#0051ff",
                    background: "rgba(0,81,255,0.08)",
                    border: "1px solid rgba(0,81,255,0.2)",
                    borderRadius: 4,
                    padding: "3px 8px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </BentoCard>
          <BentoCard cols={5} delay={80}>
            <span
              style={{
                display: "inline-flex",
                color: "#0051ff",
                marginBottom: 20,
              }}
            >
              <Download size={32} strokeWidth={1.5} />
            </span>
            <h3
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 12,
                color: "#0d1117",
              }}
            >
              Full Code Ownership
            </h3>
            <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.65 }}>
              Export clean, commented code any time. No lock-in, ever. It's
              yours.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase" as const,
                  color: "#0051ff",
                  background: "rgba(0,81,255,0.08)",
                  border: "1px solid rgba(0,81,255,0.2)",
                  borderRadius: 4,
                  padding: "3px 8px",
                }}
              >
                Export anytime
              </span>
            </div>
          </BentoCard>
          <BentoCard cols={4} delay={40}>
            <span
              style={{
                display: "inline-flex",
                color: "#0051ff",
                marginBottom: 20,
              }}
            >
              <Edit3 size={32} strokeWidth={1.5} />
            </span>
            <h3
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 12,
                color: "#0d1117",
              }}
            >
              Live Editing After Generation
            </h3>
            <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.65 }}>
              Prompt again to refine. Or click directly on any element to edit
              inline.
            </p>
          </BentoCard>
          <BentoCard cols={4} delay={120}>
            <span
              style={{
                display: "inline-flex",
                color: "#0051ff",
                marginBottom: 20,
              }}
            >
              <Globe size={32} strokeWidth={1.5} />
            </span>
            <h3
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 12,
                color: "#0d1117",
              }}
            >
              One-Click Deployment
            </h3>
            <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.65 }}>
              Deploy to our global CDN or connect your own custom domain in
              seconds.
            </p>
          </BentoCard>
          <BentoCard cols={8} delay={160}>
            <span
              style={{
                display: "inline-flex",
                color: "#0051ff",
                marginBottom: 20,
              }}
            >
              <Cpu size={32} strokeWidth={1.5} />
            </span>
            <h3
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 12,
                color: "#0d1117",
              }}
            >
              App Logic Included
            </h3>
            <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.65 }}>
              Forms, databases, user authentication, and payments — all
              prompt-driven. No backend setup, no DevOps, no headaches. "Add a
              Stripe checkout" is a complete instruction.
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 20,
                flexWrap: "wrap" as const,
              }}
            >
              {["Auth", "Stripe", "Database", "Forms"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase" as const,
                    color: "#0051ff",
                    background: "rgba(0,81,255,0.08)",
                    border: "1px solid rgba(0,81,255,0.2)",
                    borderRadius: 4,
                    padding: "3px 8px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </BentoCard>
          <BentoCard cols={4} delay={200}>
            <span
              style={{
                display: "inline-flex",
                color: "#0051ff",
                marginBottom: 20,
              }}
            >
              <History size={32} strokeWidth={1.5} />
            </span>
            <h3
              style={{
                fontFamily: "Montserrat,sans-serif",
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 12,
                color: "#0d1117",
              }}
            >
              Version History
            </h3>
            <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.65 }}>
              Every generation is automatically saved. Roll back to any version
              at any time.
            </p>
          </BentoCard>
        </div>
      </section>

      {/* ── DEMO SECTION ── */}
      <section
        id="examples"
        style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}
        aria-labelledby="demo-headline"
        data-ocid="landing.demo_section"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: 72,
            alignItems: "center",
          }}
        >
          <div>
            <Reveal>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#0051ff",
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                See it in action
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="demo-headline"
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontSize: "clamp(36px,4.5vw,56px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                  marginBottom: 20,
                }}
              >
                From prompt to pixel-perfect — in under 10 seconds.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p style={{ fontSize: 18, color: "#4a5568", lineHeight: 1.65 }}>
                Tell Forge what you need. It handles the design, the copy, the
                structure, and the code. You just approve and launch.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginTop: 32,
                }}
              >
                {DEMO_CHECKLIST.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      fontSize: 16,
                      color: "#4a5568",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: "#0051ff",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <Check size={15} strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div
              style={{
                border: "1px solid #dde2ef",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 40px 100px rgba(0,0,0,0.08)",
              }}
              role="img"
              aria-label="Preview of a Forge-generated website"
            >
              <div
                style={{
                  background: "#f4f6fb",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: "1px solid #dde2ef",
                }}
              >
                <div style={{ display: "flex", gap: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#ff5f57",
                      display: "block",
                    }}
                  />
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#ffbd2e",
                      display: "block",
                    }}
                  />
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#28c840",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#eef1f8",
                    border: "1px solid #dde2ef",
                    borderRadius: 4,
                    padding: "5px 14px",
                    fontFamily: "Fira Code,monospace",
                    fontSize: 12,
                    color: "#9aa0b4",
                  }}
                >
                  forge.app/sites/maya-portfolio
                </div>
              </div>
              <div
                style={{
                  background: "#eef1f8",
                  minHeight: 320,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "rgba(244,246,251,0.96)",
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #dde2ef",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 10,
                      background: "rgba(0,81,255,0.08)",
                      borderRadius: 3,
                    }}
                  />
                  <div style={{ display: "flex", gap: 12 }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 35,
                          height: 8,
                          background: "rgba(0,81,255,0.05)",
                          borderRadius: 3,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    padding: "28px 20px",
                    background:
                      "linear-gradient(135deg,rgba(0,81,255,0.06) 0%,transparent 60%)",
                  }}
                >
                  <div
                    style={{
                      height: 20,
                      background: "rgba(0,81,255,0.15)",
                      borderRadius: 4,
                      width: "55%",
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      background: "rgba(0,81,255,0.06)",
                      borderRadius: 3,
                      width: "40%",
                      marginBottom: 20,
                    }}
                  />
                  <div
                    style={{
                      height: 30,
                      width: 100,
                      background: "linear-gradient(135deg,#0051ff,#3374ff)",
                      borderRadius: 4,
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: "16px 20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 10,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        background: "rgba(0,81,255,0.03)",
                        border: "1px solid #dde2ef",
                        borderRadius: 8,
                        padding: 14,
                      }}
                    >
                      <div
                        style={{
                          height: 8,
                          background: "rgba(0,81,255,0.07)",
                          borderRadius: 3,
                          marginBottom: 6,
                        }}
                      />
                      <div
                        style={{
                          height: 8,
                          background: "rgba(0,81,255,0.07)",
                          borderRadius: 3,
                          width: "65%",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    background: "rgba(0,81,255,0.12)",
                    border: "1px solid rgba(0,81,255,0.4)",
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0051ff",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#0051ff",
                      animation: "pulse-dot 2s infinite",
                      display: "inline-block",
                    }}
                  />
                  Generated in 8.3s
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
        style={{ padding: "100px 48px" }}
        data-ocid="landing.pricing_section"
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Reveal>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#0051ff",
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Pricing
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontSize: "clamp(36px,4.5vw,56px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                  marginBottom: 20,
                }}
              >
                Start free. Scale when ready.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p
                style={{
                  fontSize: 18,
                  color: "#4a5568",
                  lineHeight: 1.65,
                  maxWidth: 400,
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                No contracts. No surprise bills. Cancel anytime.
              </p>
            </Reveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
              alignItems: "start",
            }}
          >
            <PriceCard
              name="Free"
              price={0}
              period="forever free"
              features={[
                "3 active projects",
                "Forge subdomain hosting",
                "Basic AI generation",
                "Community support",
              ]}
              missing={["Custom domain", "App logic & payments"]}
              cta="Get Started"
              onCta={handleStart}
            />
            <PriceCard
              name="Pro"
              price={29}
              period="per month"
              features={[
                "Unlimited projects",
                "Custom domain included",
                "Full app logic & payments",
                "Code export",
                "Version history (30 days)",
                "Priority generation queue",
              ]}
              featured
              badge="Most Popular"
              cta="Start Pro Trial"
              onCta={handleStart}
              delay={80}
            />
            <PriceCard
              name="Team"
              price={79}
              period="per month"
              features={[
                "Everything in Pro",
                "Up to 10 team members",
                "Real-time collaboration",
                "White-label options",
                "Unlimited version history",
                "Dedicated account manager",
              ]}
              cta="Talk to Sales"
              onCta={handleStart}
              delay={160}
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        style={{ padding: "100px 48px" }}
        data-ocid="landing.testimonials_section"
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Reveal>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#0051ff",
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                What people are saying
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontSize: "clamp(36px,4.5vw,56px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-1.5px",
                }}
              >
                Built by real people.
                <br />
                Loved by real builders.
              </h2>
            </Reveal>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <TestiCard
                key={t.name}
                quote={t.quote}
                name={t.name}
                role={t.role}
                initials={t.initials}
                offset={i === 1 ? 24 : i === 4 ? -24 : 0}
                delay={i * 80}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        style={{
          margin: "0 48px 80px",
          borderRadius: 24,
          padding: "96px 48px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%,rgba(0,81,255,0.12) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 50% 0%,rgba(0,81,255,0.06) 0%,transparent 70%),#f0f4ff",
          border: "1px solid rgba(0,81,255,0.15)",
          position: "relative",
          overflow: "hidden",
        }}
        data-ocid="landing.cta_section"
      >
        <Reveal>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#0051ff",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Ready when you are
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2
            style={{
              fontFamily: "Montserrat,sans-serif",
              fontSize: "clamp(40px,5.5vw,68px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              marginBottom: 16,
            }}
          >
            Your idea is already
            <br />
            <span style={{ color: "#0051ff" }}>good enough.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p
            style={{
              fontSize: 18,
              color: "#4a5568",
              maxWidth: 400,
              margin: "0 auto 48px",
              lineHeight: 1.65,
            }}
          >
            Stop waiting. Stop second-guessing. Start building.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap" as const,
            }}
          >
            <button
              type="button"
              onClick={handleStart}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg,#0051ff,#3374ff)",
                color: "#fff",
                fontFamily: "Roboto,sans-serif",
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 8,
                padding: "16px 36px",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.3s,transform 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "none";
              }}
              onBlur={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "none";
              }}
              data-ocid="landing.cta_start_button"
            >
              Start for Free
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("examples")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                fontSize: 15,
                color: "#4a5568",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#0d1117";
              }}
              onFocus={(e) => {
                e.currentTarget.style.color = "#0d1117";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#4a5568";
              }}
              onBlur={(e) => {
                e.currentTarget.style.color = "#4a5568";
              }}
              data-ocid="landing.cta_examples_link"
            >
              See Example Projects →
            </button>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{ borderTop: "1px solid #dde2ef", padding: "64px 48px 40px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr repeat(4,1fr)",
              gap: 48,
              marginBottom: 56,
            }}
          >
            <div>
              <a
                href="/"
                style={{
                  fontFamily: "Montserrat,sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#0d1117",
                  letterSpacing: "-0.5px",
                  textDecoration: "none",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                Forge<span style={{ color: "#0051ff" }}>.</span>
              </a>
              <p
                style={{
                  fontSize: 14,
                  color: "#9aa0b4",
                  lineHeight: 1.65,
                  maxWidth: 220,
                }}
              >
                The AI that turns plain language into production-ready websites
                and apps.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#4a5568",
                    marginBottom: 16,
                  }}
                >
                  {col.title}
                </h4>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                        style={{
                          fontSize: 14,
                          color: "#9aa0b4",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = "#4a5568";
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.color = "#4a5568";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = "#9aa0b4";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.color = "#9aa0b4";
                        }}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 28,
              borderTop: "1px solid #dde2ef",
              flexWrap: "wrap" as const,
              gap: 12,
            }}
          >
            <p style={{ fontSize: 13, color: "#9aa0b4" }}>
              © {new Date().getFullYear()} Forge, Inc. All rights reserved.
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#9aa0b4", textDecoration: "none" }}
              >
                caffeine.ai
              </a>
            </p>
            <div
              style={{ display: "flex", gap: 16 }}
              aria-label="Social media links"
            >
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href="https://twitter.com"
                  aria-label={s.label}
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#9aa0b4",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#4a5568";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.color = "#4a5568";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#9aa0b4";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.color = "#9aa0b4";
                  }}
                >
                  <svg
                    role="img"
                    aria-label={s.label}
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>
        {
          "@keyframes pulse-dot{0%,100%{opacity:1;box-shadow:0 0 8px rgba(0,81,255,0.5)}50%{opacity:0.6;box-shadow:0 0 14px rgba(0,81,255,0.7)}}"
        }
      </style>
    </div>
  );
}

// ─── Static data ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "Examples", id: "examples" },
  { label: "Changelog", id: "changelog" },
];
const LOGOS = [
  "Notion",
  "Figma",
  "Stripe",
  "Linear",
  "Vercel",
  "Arc",
  "Raycast",
  "Loom",
];
const SITE_TYPES: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "portfolio", label: "Portfolio", Icon: LayoutTemplate },
  { value: "landing page", label: "Landing Page", Icon: Rocket },
  { value: "eCommerce store", label: "eCommerce", Icon: ShoppingCart },
  { value: "SaaS dashboard", label: "SaaS / App", Icon: BarChart2 },
  { value: "blog or content site", label: "Blog", Icon: PencilLine },
  { value: "booking and appointment site", label: "Booking", Icon: Calendar },
  { value: "restaurant or menu site", label: "Restaurant", Icon: Utensils },
  { value: "agency or studio site", label: "Agency", Icon: Building2 },
];
const VIBES: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "minimal and clean", label: "Minimal", Icon: Square },
  { value: "bold and high-impact", label: "Bold", Icon: Zap },
  { value: "warm and friendly", label: "Warm", Icon: Leaf },
  { value: "luxury and premium", label: "Luxury", Icon: Star },
  { value: "playful and colourful", label: "Playful", Icon: Sparkles },
];
const FEATURES_LIST: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "contact form", label: "Contact Form", Icon: Mail },
  { value: "blog section", label: "Blog / Articles", Icon: BookOpen },
  { value: "Stripe payment integration", label: "Payments", Icon: CreditCard },
  {
    value: "user login and authentication",
    label: "User Accounts",
    Icon: User,
  },
  {
    value: "image gallery or portfolio section",
    label: "Image Gallery",
    Icon: Image,
  },
  {
    value: "booking calendar and appointment system",
    label: "Booking Calendar",
    Icon: CalendarCheck,
  },
  { value: "newsletter signup", label: "Newsletter", Icon: MailOpen },
  { value: "live chat widget", label: "Live Chat", Icon: MessageCircle },
  { value: "testimonials section", label: "Testimonials", Icon: Quote },
];
const CHIPS = [
  { fill: "a freelance photographer based in New York", label: "Photographer" },
  { fill: "an online bakery selling custom cakes", label: "Bakery" },
  { fill: "a life coach helping busy professionals", label: "Life Coach" },
  { fill: "a B2B SaaS tool for project management", label: "SaaS Tool" },
  { fill: "a creative agency specialising in branding", label: "Agency" },
  { fill: "an indie developer building side projects", label: "Developer" },
];
const HOW_IT_WORKS_STEPS: {
  num: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
}[] = [
  {
    num: "01",
    title: "Describe",
    desc: "Type your idea in plain English. Be as specific or as vague as you want — Forge figures out the rest.",
    Icon: PencilLine,
  },
  {
    num: "02",
    title: "Generate",
    desc: "Our AI architects your site structure, writes copy tailored to your audience, designs layouts, and wires up all the logic.",
    Icon: Zap,
  },
  {
    num: "03",
    title: "Launch",
    desc: "One click. Your site is live — with a custom domain, global CDN hosting, and analytics included from day one.",
    Icon: Rocket,
  },
];
const DEMO_CHECKLIST = [
  "Custom layout & visual design, unique to your brand",
  "Written copy, tailored to your niche and audience",
  "Mobile-optimized and fully responsive out of the box",
  "SEO metadata & Open Graph tags, pre-configured",
  "Integrated contact forms, CTA flows, and analytics",
];
const TESTIMONIALS = [
  {
    initials: "PM",
    name: "Priya M.",
    role: "Strategy Consultant, independent",
    quote:
      "I described my consulting site in one paragraph and had a live URL in my Slack DMs 40 seconds later. Legitimately wild. I've been recommending this to every founder I know.",
  },
  {
    initials: "TA",
    name: "Tom A.",
    role: "Founder, Launchly",
    quote:
      "We replaced a $12,000 agency project with Forge. Same quality, zero back-and-forth, zero revision rounds. We launched in a week instead of three months.",
  },
  {
    initials: "DR",
    name: "Dev R.",
    role: "Indie Hacker & Maker",
    quote:
      "The app logic feature is criminally underrated. Full auth and Stripe in one prompt. I stopped spinning up backends manually. This is what every indie hacker has been waiting for.",
  },
  {
    initials: "SK",
    name: "Sarah K.",
    role: "Executive Coach, SKCoaching",
    quote:
      "As a coach with no technical background, I always thought building a proper site was out of reach. Forge changed that completely. My site looks better than most agencies I've seen.",
  },
  {
    initials: "ML",
    name: "Marcus L.",
    role: "Serial Maker & Builder",
    quote:
      "I ship new micro-projects every week. Forge is the only tool that keeps up. It doesn't just make templates — it understands what I'm building and makes actual decisions.",
  },
  {
    initials: "AW",
    name: "Anita W.",
    role: "Creative Director, Studiohaus",
    quote:
      "Our design team uses Forge for rapid client prototyping. We show clients a live, working site in the first meeting now. Close rates are up 40% since we started.",
  },
];
const FOOTER_COLS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Examples", "Changelog", "Roadmap"],
  },
  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
  {
    title: "Resources",
    links: [
      "Documentation",
      "API Reference",
      "Templates",
      "Community",
      "Status",
    ],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
  },
];
const SOCIAL_ICONS = [
  {
    label: "Forge on X (Twitter)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.213 5.567L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Forge on GitHub",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.495.997.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
  },
  {
    label: "Forge on LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

import DevicePreview, { type DeviceMode } from "@/components/DevicePreview";
import ProtectedRoute from "@/components/ProtectedRoute";
import SitePreview, { type EditingField } from "@/components/SitePreview";
import { useGetSite, useUpdateSite } from "@/hooks/useQueries";
import type { GeneratedSite } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Eye,
  Globe,
  GripVertical,
  Image,
  LayoutTemplate,
  Link,
  Loader2,
  Mail,
  Monitor,
  Quote,
  Rocket,
  Send,
  Share2,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  User,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ─── Default site for preview when no generatedData yet ──────────────────────
const DEFAULT_SITE: GeneratedSite = {
  siteTitle: "My Business",
  tagline: "Excellence in every detail",
  colorPalette: {
    primary: "#0051ff",
    secondary: "#3374ff",
    accent: "#e8eeff",
    background: "#ffffff",
    text: "#0d1117",
  },
  layout: {
    borderRadius: "8px",
    layoutStyle: "standard",
    fontFamily: "Montserrat",
  },
  sections: [
    {
      sectionType: "hero" as const,
      heading: "Build Something Remarkable",
      subheading:
        "We help ambitious businesses craft digital experiences that captivate, convert, and grow.",
      content: "Get Started",
    },
    {
      sectionType: "about" as const,
      heading: "Who We Are",
      subheading:
        "A passionate team of designers and developers committed to delivering exceptional results.",
      content: "",
    },
    {
      sectionType: "services" as const,
      heading: "What We Offer",
      subheading:
        "Everything you need to launch and grow your business online.",
      content: "Strategy, Design, Development",
    },
    {
      sectionType: "contact" as const,
      heading: "Get In Touch",
      subheading: "Ready to start your project? We'd love to hear from you.",
      content: "",
    },
  ],
};

// ─── Section definitions for left panel ─────────────────────────────────────
interface SectionDef {
  key: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const SECTION_DEFS: SectionDef[] = [
  { key: "nav", label: "Navigation", Icon: LayoutTemplate },
  { key: "hero", label: "Hero", Icon: Star },
  { key: "features", label: "Features", Icon: Image },
  { key: "about", label: "About", Icon: User },
  { key: "testimonials", label: "Testimonials", Icon: Quote },
  { key: "contact", label: "Contact", Icon: Mail },
  { key: "footer", label: "Footer", Icon: Link },
];

// ─── Color swatches for right panel ─────────────────────────────────────────
const SWATCHES = [
  "#0051ff",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0d1117",
];

// ─── Toggle component ────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative flex-shrink-0 w-[34px] h-[18px] rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        on ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`absolute top-[3px] w-3 h-3 rounded-full bg-card shadow-sm transition-all duration-200 ${
          on ? "right-[3px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}

// ─── Section list item (left panel) ─────────────────────────────────────────
function SectionListItem({
  def,
  isActive,
  index,
  onClick,
}: {
  def: SectionDef;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  const { Icon, label } = def;
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`editor.section_item.${index + 1}`}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 border-[1.5px] ${
        isActive
          ? "bg-[var(--blue-faint,#f0f4ff)] border-primary text-primary"
          : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      <GripVertical className="w-3 h-3 flex-shrink-0 text-muted-foreground/40" />
      <div
        className={`w-[26px] h-[26px] rounded-md flex items-center justify-center flex-shrink-0 ${
          isActive ? "bg-primary/10" : "bg-secondary"
        }`}
      >
        <Icon
          className={`w-[13px] h-[13px] ${isActive ? "text-primary" : "text-muted-foreground"}`}
        />
      </div>
      <span
        className={`text-xs font-medium flex-1 min-w-0 truncate ${
          isActive ? "text-primary font-semibold" : ""
        }`}
      >
        {label}
      </span>
      <Eye className="w-3 h-3 flex-shrink-0 text-muted-foreground/50" />
    </button>
  );
}

// ─── Device toggle button ────────────────────────────────────────────────────
function DeviceBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-7 h-6 flex items-center justify-center rounded transition-all duration-150 ${
        active
          ? "bg-card text-primary shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );
}

// ─── Main EditorPage ──────────────────────────────────────────────────────────
function EditorContent() {
  const { siteId } = useParams({ from: "/editor/$siteId" });
  const navigate = useNavigate();
  const id = BigInt(siteId);

  const { data: site, isLoading } = useGetSite(id);
  const updateSite = useUpdateSite();

  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [activeSection, setActiveSection] = useState<string>("nav");
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [activeColor, setActiveColor] = useState<string>(SWATCHES[0]);
  const [features, setFeatures] = useState({
    contactForm: true,
    analytics: true,
    cookieBanner: false,
    liveChat: false,
  });
  const [aiInput, setAiInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // SitePublic does not have generatedData — use DEFAULT_SITE for editor canvas
  const generatedData: GeneratedSite = DEFAULT_SITE;
  const siteTitle = site?.name ?? generatedData.siteTitle;
  const siteSlug =
    siteTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 28) || "my-site";
  const displaySeoTitle = seoTitle || siteTitle;
  const displaySeoDesc = seoDesc || generatedData.tagline || "";

  const handleSaveEdit = useCallback(
    (newValue: string) => {
      if (!editingField) return;
      const { sectionIndex, field } = editingField;
      const updated = generatedData.sections.map((s, i) =>
        i === sectionIndex ? { ...s, [field]: newValue } : s,
      );
      const updatedData: GeneratedSite = {
        ...generatedData,
        sections: updated,
      };
      setEditingField(null);
      // Update name only — generatedData lives frontend-side for now
      void updatedData;
      updateSite.mutate({ id });
    },
    [editingField, generatedData, id, updateSite],
  );

  const scrollToSection = useCallback((key: string) => {
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-background overflow-hidden"
      data-ocid="editor.page"
    >
      {/* ─── App Nav ─────────────────────────────────────────────────────── */}
      <header
        className="h-14 flex items-center gap-3 px-6 bg-card border-b border-border z-20 flex-shrink-0"
        style={{ minHeight: 56 }}
      >
        {/* Logo + separator + breadcrumb */}
        <span className="font-display font-bold text-lg text-foreground flex-shrink-0">
          Forge<span className="text-primary">.</span>
        </span>
        <div className="w-px h-5 bg-border flex-shrink-0" />
        <span className="text-sm text-muted-foreground min-w-0 truncate flex-1">
          <span className="font-semibold text-foreground">{siteTitle}</span>
          {" · Editing"}
        </span>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Preview pill */}
          <span
            className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/30 text-xs font-semibold rounded-full px-3 py-1 cursor-pointer hover:bg-primary/15 transition-colors"
            data-ocid="editor.preview_tag"
          >
            <Eye className="w-3 h-3" />
            Preview
          </span>
          {/* Share */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:text-foreground hover:border-muted-foreground/60 transition-all"
            data-ocid="editor.share_button"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          {/* Publish */}
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/publish/$siteId", params: { siteId } })
            }
            data-ocid="editor.publish_button"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            <Rocket className="w-3.5 h-3.5" />
            Publish
          </button>
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-primary/10 text-primary font-display font-bold text-xs flex items-center justify-center flex-shrink-0"
            data-ocid="editor.avatar"
          >
            {siteTitle.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ─── 3-panel body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <aside
          className="w-[252px] flex-shrink-0 bg-card border-r border-border flex flex-col overflow-hidden"
          data-ocid="editor.left_panel"
          style={{ minWidth: 252 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Sections
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-primary"
              data-ocid="editor.add_section_button"
            >
              <span className="text-base leading-none">+</span> Add
            </button>
          </div>

          {/* Section list */}
          <div
            className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5"
            data-ocid="editor.section_list"
          >
            {isLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-9 rounded-lg bg-muted/50 animate-pulse"
                  />
                ))
              : SECTION_DEFS.map((def, index) => (
                  <SectionListItem
                    key={def.key}
                    def={def}
                    isActive={activeSection === def.key}
                    index={index}
                    onClick={() => scrollToSection(def.key)}
                  />
                ))}
          </div>

          {/* AI Refine bar */}
          <div className="border-t border-border p-2.5 flex-shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Refine with AI
              </span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder='"Make the hero bolder"'
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 min-w-0 border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground bg-card placeholder:text-muted-foreground outline-none focus:border-primary caret-primary transition-colors"
                data-ocid="editor.ai_input"
              />
              <button
                type="button"
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 hover:opacity-85 transition-opacity"
                aria-label="Send AI prompt"
                data-ocid="editor.ai_send_button"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER CANVAS */}
        <main
          className="flex-1 flex flex-col overflow-hidden"
          data-ocid="editor.canvas"
        >
          {/* Canvas toolbar */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-card border-b border-border flex-shrink-0">
            {/* Device toggle */}
            <div className="flex items-center bg-secondary border border-border rounded-lg p-0.5">
              <DeviceBtn
                active={deviceMode === "desktop"}
                onClick={() => setDeviceMode("desktop")}
                icon={<Monitor className="w-3.5 h-3.5" />}
                label="Desktop"
              />
              <DeviceBtn
                active={deviceMode === "tablet"}
                onClick={() => setDeviceMode("tablet")}
                icon={<Tablet className="w-3.5 h-3.5" />}
                label="Tablet"
              />
              <DeviceBtn
                active={deviceMode === "mobile"}
                onClick={() => setDeviceMode("mobile")}
                icon={<Smartphone className="w-3.5 h-3.5" />}
                label="Mobile"
              />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-auto">
              100%
            </span>
          </div>

          {/* Scrollable canvas area */}
          <div
            className="flex-1 overflow-auto bg-[#dde1eb]"
            style={{ background: "#dde1eb" }}
          >
            {isLoading ? (
              <div
                className="flex items-center justify-center h-full"
                data-ocid="editor.loading_state"
              >
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm">Loading your site…</span>
                </div>
              </div>
            ) : (
              <DevicePreview mode={deviceMode}>
                <SitePreview
                  generatedData={generatedData}
                  editingField={editingField}
                  onStartEdit={setEditingField}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingField(null)}
                  highlightedSection={activeSection}
                  sectionRefs={sectionRefs}
                />
              </DevicePreview>
            )}
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside
          className="w-[272px] flex-shrink-0 bg-card border-l border-border flex flex-col overflow-y-auto"
          data-ocid="editor.right_panel"
          style={{ minWidth: 272 }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Page settings
            </span>
          </div>

          {/* SEO */}
          <div className="px-4 py-4 border-b border-border">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              SEO
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium text-foreground"
                  htmlFor="seo-title"
                >
                  Page title
                </label>
                <input
                  id="seo-title"
                  type="text"
                  value={displaySeoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="border border-border rounded-lg px-2.5 py-2 text-sm text-foreground bg-card outline-none focus:border-primary transition-colors"
                  data-ocid="editor.seo_title_input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs font-medium text-foreground"
                  htmlFor="seo-desc"
                >
                  Meta description
                </label>
                <textarea
                  id="seo-desc"
                  rows={3}
                  value={displaySeoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="border border-border rounded-lg px-2.5 py-2 text-xs text-foreground bg-card outline-none focus:border-primary transition-colors resize-none leading-relaxed"
                  data-ocid="editor.seo_desc_textarea"
                />
              </div>
            </div>
          </div>

          {/* Accent color */}
          <div className="px-4 py-4 border-b border-border">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Accent colour
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Set accent color ${color}`}
                  onClick={() => setActiveColor(color)}
                  data-ocid={"editor.color_swatch"}
                  className={`w-[26px] h-[26px] rounded transition-all ${
                    activeColor === color
                      ? "border-2 border-primary"
                      : "border-2 border-transparent"
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="px-4 py-4 border-b border-border">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Features
            </div>
            <div className="flex flex-col gap-2">
              {(
                [
                  { key: "contactForm", label: "Contact form" },
                  { key: "analytics", label: "Analytics" },
                  { key: "cookieBanner", label: "Cookie banner" },
                  { key: "liveChat", label: "Live chat" },
                ] as { key: keyof typeof features; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{label}</span>
                  <Toggle
                    on={features[key]}
                    onToggle={() =>
                      setFeatures((f) => ({ ...f, [key]: !f[key] }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Domain */}
          <div className="px-4 py-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Domain
            </div>
            <p className="text-xs text-foreground mb-3 leading-relaxed">
              Publishing to{" "}
              <strong className="font-mono text-primary text-[10px]">
                {siteSlug}.forge.app
              </strong>
            </p>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-1.5 border border-border rounded-lg py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 transition-all"
              data-ocid="editor.connect_domain_button"
            >
              <Globe className="w-3.5 h-3.5" />
              Connect custom domain
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <EditorContent />
    </ProtectedRoute>
  );
}

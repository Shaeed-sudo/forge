import DevicePreview, { type DeviceMode } from "@/components/DevicePreview";
import ProtectedRoute from "@/components/ProtectedRoute";
import SitePreview, { type EditingField } from "@/components/SitePreview";
import { useGetSite, useUpdateSite } from "@/hooks/useQueries";
import type { GeneratedSite, SiteSection } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  GripVertical,
  Laptop,
  Loader2,
  Rocket,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ─── Default site for preview when no generatedData yet ──────────────────────
const DEFAULT_SITE: GeneratedSite = {
  siteTitle: "My Business",
  tagline: "Excellence in every detail",
  colorPalette: {
    primary: "#6366f1",
    secondary: "#a78bfa",
    accent: "#fcd34d",
    background: "#ffffff",
    text: "#1e1b4b",
  },
  layout: {
    headerStyle: "split",
    footerStyle: "full",
    contentWidth: "standard",
    sectionSpacing: "standard",
  },
  sections: [
    {
      type: "hero",
      heading: "Build Something Remarkable",
      body: "We help ambitious businesses craft digital experiences that captivate, convert, and grow.",
      ctaText: "Get Started",
      ctaUrl: "#contact",
    },
    {
      type: "about",
      heading: "Who We Are",
      body: "A passionate team of designers and developers committed to delivering exceptional results for our clients across every industry.",
    },
    {
      type: "features",
      heading: "What We Offer",
      body: "Everything you need to launch and grow your business online.",
      items: [
        {
          title: "Strategy",
          description: "Data-driven approaches to accelerate your growth",
        },
        {
          title: "Design",
          description: "Beautiful interfaces that delight your users",
        },
        {
          title: "Development",
          description: "Robust, scalable solutions built to last",
        },
      ],
    },
    {
      type: "contact",
      heading: "Get In Touch",
      body: "Ready to start your project? We'd love to hear from you.",
    },
  ],
};

// ─── Device switcher button ───────────────────────────────────────────────────
interface DeviceBtnProps {
  mode: DeviceMode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function DeviceBtn({ mode, active, onClick, icon, label }: DeviceBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`editor.device_${mode}`}
      title={label}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] tracking-wide">{label}</span>
    </button>
  );
}

// ─── Section list item in right sidebar ──────────────────────────────────────
function SectionListItem({
  label,
  isActive,
  index,
  onClick,
}: {
  label: string;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`editor.section_item.${index + 1}`}
      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-smooth group ${
        isActive
          ? "bg-primary/15 text-primary border border-primary/25"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent"
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 flex-shrink-0 opacity-30 group-hover:opacity-60" />
      <span className="capitalize truncate flex-1">{label}</span>
      {isActive && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
    </button>
  );
}

// ─── Inline title editor ──────────────────────────────────────────────────────
function InlineTitleEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = useCallback(() => {
    setEditing(false);
    if (draft.trim()) onChange(draft.trim());
    else setDraft(value);
  }, [draft, onChange, value]);

  if (editing) {
    return (
      <input
        type="text"
        value={draft}
        className="bg-secondary border border-input rounded-md px-2 py-1 text-sm font-display font-semibold text-foreground outline-none w-48 focus:border-primary"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        data-ocid="editor.title_input"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className="flex items-center gap-1.5 group"
      data-ocid="editor.title_button"
      title="Click to rename"
    >
      <span className="font-display font-semibold text-sm text-foreground truncate max-w-48">
        {value}
      </span>
      <span className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-60 transition-smooth">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-label="Edit icon"
          role="img"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </span>
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
  const [highlightedSection, setHighlightedSection] = useState<string | null>(
    null,
  );
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Derive the display data — use generatedData from backend or DEFAULT_SITE
  const generatedData: GeneratedSite =
    (site?.generatedData as GeneratedSite | undefined) ?? DEFAULT_SITE;
  const siteTitle = site?.title ?? generatedData.siteTitle;

  // ─── Section label helpers
  const sectionLabel = (s: SiteSection, i: number) =>
    s.heading?.slice(0, 24) || s.type || `Section ${i + 1}`;
  const sectionKey = (s: SiteSection, i: number) => `${s.type}-${i}`;

  // ─── Scroll to section in preview
  const scrollToSection = useCallback((key: string) => {
    setHighlightedSection(key);
    const el = sectionRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ─── Handle inline edits from SitePreview
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
      updateSite.mutate(
        { id, generatedData: updatedData },
        {
          onSuccess: () => {
            setSavedIndicator(true);
            setTimeout(() => setSavedIndicator(false), 2000);
          },
        },
      );
    },
    [editingField, generatedData, id, updateSite],
  );

  // ─── Handle title rename
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      updateSite.mutate(
        { id, title: newTitle },
        {
          onSuccess: () => {
            setSavedIndicator(true);
            setTimeout(() => setSavedIndicator(false), 2000);
          },
        },
      );
    },
    [id, updateSite],
  );

  // ─── Manual save
  const handleSave = useCallback(() => {
    updateSite.mutate(
      { id, title: siteTitle, generatedData },
      {
        onSuccess: () => {
          setSavedIndicator(true);
          setTimeout(() => setSavedIndicator(false), 2200);
        },
      },
    );
  }, [id, siteTitle, generatedData, updateSite]);

  return (
    <div
      className="flex flex-col h-screen bg-background overflow-hidden"
      data-ocid="editor.page"
    >
      {/* ─── Top Toolbar ─────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 py-2.5 bg-card border-b border-border shadow-subtle z-20 flex-shrink-0">
        {/* Left: back + logo + title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-smooth p-1.5 rounded-lg hover:bg-secondary"
            data-ocid="editor.back_button"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold font-display">
                F
              </span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Forge
            </span>
          </div>
          <div className="w-px h-5 bg-border" />
          <InlineTitleEditor value={siteTitle} onChange={handleTitleChange} />
        </div>

        {/* Center: device switcher */}
        <div className="flex items-center gap-1 bg-background border border-border rounded-xl p-1">
          <DeviceBtn
            mode="desktop"
            active={deviceMode === "desktop"}
            onClick={() => setDeviceMode("desktop")}
            icon={<Laptop className="w-4 h-4" />}
            label="Desktop"
          />
          <DeviceBtn
            mode="tablet"
            active={deviceMode === "tablet"}
            onClick={() => setDeviceMode("tablet")}
            icon={<Tablet className="w-4 h-4" />}
            label="Tablet"
          />
          <DeviceBtn
            mode="mobile"
            active={deviceMode === "mobile"}
            onClick={() => setDeviceMode("mobile")}
            icon={<Smartphone className="w-4 h-4" />}
            label="Mobile"
          />
        </div>

        {/* Right: save + publish */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={updateSite.isPending}
            data-ocid="editor.save_button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-secondary transition-smooth disabled:opacity-50"
          >
            {updateSite.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : savedIndicator ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : null}
            {savedIndicator ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/publish/$siteId", params: { siteId } })
            }
            data-ocid="editor.publish_button"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
          >
            <Rocket className="w-3.5 h-3.5" />
            Publish
          </button>
        </div>
      </header>

      {/* ─── Main area: canvas + sidebar ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <main
          className="flex-1 overflow-auto bg-muted/30 px-4"
          data-ocid="editor.canvas"
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
                highlightedSection={highlightedSection}
                sectionRefs={sectionRefs}
              />
            </DevicePreview>
          )}
        </main>

        {/* Right sidebar */}
        <aside
          className="w-[200px] flex-shrink-0 bg-card border-l border-border flex flex-col overflow-hidden"
          data-ocid="editor.sidebar"
        >
          <div className="px-3 py-3 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sections
            </h3>
          </div>
          <div
            className="flex-1 overflow-y-auto p-2 flex flex-col gap-1"
            data-ocid="editor.section_list"
          >
            {isLoading ? (
              <div className="flex flex-col gap-1.5 p-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 rounded-lg bg-muted/60 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              generatedData.sections.map((section, index) => {
                const key = sectionKey(section, index);
                return (
                  <SectionListItem
                    key={key}
                    label={sectionLabel(section, index)}
                    isActive={highlightedSection === key}
                    index={index}
                    onClick={() => scrollToSection(key)}
                  />
                );
              })
            )}
          </div>
          {/* Tip */}
          <div className="px-3 py-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Click any heading or paragraph in the preview to edit inline.
            </p>
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

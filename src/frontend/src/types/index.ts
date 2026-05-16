// ─── Re-exports from backend ─────────────────────────────────────────────────
export type {
  SiteId,
  UserId,
  Timestamp,
  SiteSummary,
  SitePublic,
  PreLaunchChecks,
  UserProfile,
  WizardInput,
  SiteUpdate,
} from "@/backend";

export {
  SiteType,
  PublishStatus,
  SelectedFeature,
  VisualStyle,
} from "@/backend";

// ─── Frontend-only: GeneratedSite types (not in backend) ─────────────────────

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface LayoutMetadata {
  borderRadius: string;
  layoutStyle: string;
  fontFamily: string;
}

export type SectionType = "hero" | "about" | "services" | "contact" | "footer";

export interface SiteSection {
  sectionType: SectionType;
  heading: string;
  subheading: string;
  content: string;
}

export interface GeneratedSite {
  siteTitle: string;
  tagline: string;
  colorPalette: ColorPalette;
  layout: LayoutMetadata;
  sections: SiteSection[];
}

// ─── Frontend wizard form state ───────────────────────────────────────────────
export interface WizardFormData {
  siteType: import("@/backend").SiteType | "";
  niche: string;
  vibe: import("@/backend").VisualStyle | "";
}

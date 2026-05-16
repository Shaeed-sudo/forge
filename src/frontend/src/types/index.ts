// ─── Shared Types mirroring backend contracts ───────────────────────────────

export type SiteType =
  | "business"
  | "portfolio"
  | "ecommerce"
  | "blog"
  | "landing"
  | "saas";

export type VisualStyle =
  | "modern"
  | "minimal"
  | "bold"
  | "elegant"
  | "playful"
  | "corporate";

export interface SelectedFeatures {
  contactForm: boolean;
  bookings: boolean;
  auth: boolean;
  blog: boolean;
  ecommerce: boolean;
  analytics: boolean;
}

export interface WizardInput {
  siteType: SiteType;
  businessDescription: string;
  visualStyle: VisualStyle;
  selectedFeatures: SelectedFeatures;
}

export type SectionType =
  | "hero"
  | "about"
  | "features"
  | "pricing"
  | "testimonials"
  | "contact"
  | "gallery"
  | "team"
  | "faq"
  | "cta";

export interface SiteSection {
  type: SectionType;
  heading: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  items?: SectionItem[];
}

export interface SectionItem {
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface LayoutMetadata {
  headerStyle: "centered" | "split" | "minimal";
  footerStyle: "full" | "minimal" | "none";
  contentWidth: "wide" | "standard" | "narrow";
  sectionSpacing: "compact" | "standard" | "spacious";
}

export interface PreLaunchChecks {
  seoTitle: boolean;
  seoDescription: boolean;
  mobileLayout: boolean;
  performance: boolean;
  formsWorking: boolean;
  customDomain: boolean;
}

export type PublishStatus =
  | "unpublished"
  | "publishing"
  | "published"
  | "failed";

export interface GeneratedSite {
  siteTitle: string;
  tagline: string;
  sections: SiteSection[];
  colorPalette: ColorPalette;
  layout: LayoutMetadata;
}

export interface SiteSummary {
  id: bigint;
  title: string;
  status: PublishStatus;
  subdomain?: string;
  createdAt: bigint;
}

export interface SitePublic {
  id: bigint;
  owner: unknown; // Principal
  title: string;
  generatedData?: GeneratedSite;
  status: PublishStatus;
  subdomain?: string;
  publishedUrl?: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface UserProfile {
  name: string;
  email: string;
}

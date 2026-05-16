import type { backendInterface, SiteSummary, SitePublic, UserProfile, PreLaunchChecks, GeneratedSite } from "../backend";
import { PublishStatus, SiteType, SectionType, UserRole } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const mockGeneratedSite: GeneratedSite = {
  siteTitle: "Horizon Design Studio",
  tagline: "Where creativity meets precision",
  layout: {
    borderRadius: "8px",
    layoutStyle: "modern",
    fontFamily: "Space Grotesk",
  },
  colorPalette: {
    primary: "#7C3AED",
    secondary: "#4F46E5",
    accent: "#F59E0B",
    background: "#0F0F1A",
    text: "#F8F8FC",
  },
  sections: [
    {
      sectionType: SectionType.hero,
      heading: "Build Your Dream Website",
      subheading: "AI-powered design, zero code required",
      content: "Transform your ideas into stunning websites in minutes. No templates, no agencies, just pure creative freedom powered by AI.",
    },
    {
      sectionType: SectionType.about,
      heading: "About Us",
      subheading: "Crafting digital experiences since 2020",
      content: "We are a passionate team of designers and developers dedicated to pushing the boundaries of what's possible on the web.",
    },
    {
      sectionType: SectionType.services,
      heading: "Our Services",
      subheading: "Everything you need to succeed online",
      content: "From branding to full-stack development, we offer comprehensive digital solutions tailored to your unique needs.",
    },
    {
      sectionType: SectionType.contact,
      heading: "Get In Touch",
      subheading: "Let's build something great together",
      content: "Ready to start your project? Contact us today and let's discuss how we can help you achieve your goals.",
    },
  ],
};

const mockSites: SiteSummary[] = [
  {
    id: BigInt(1),
    title: "Horizon Design Studio",
    status: PublishStatus.published,
    createdAt: BigInt(Date.now() - 86400000 * 5),
    subdomain: "horizon-design",
  },
  {
    id: BigInt(2),
    title: "Bloom Wellness Clinic",
    status: PublishStatus.unpublished,
    createdAt: BigInt(Date.now() - 86400000 * 2),
  },
  {
    id: BigInt(3),
    title: "Apex Tech Solutions",
    status: PublishStatus.publishing,
    createdAt: BigInt(Date.now() - 3600000),
  },
];

const mockSitePublic: SitePublic = {
  id: BigInt(1),
  title: "Horizon Design Studio",
  status: PublishStatus.published,
  owner: {} as Principal,
  createdAt: BigInt(Date.now() - 86400000 * 5),
  updatedAt: BigInt(Date.now() - 86400000),
  publishedUrl: "https://horizon-design.forge.app",
  subdomain: "horizon-design",
  generatedData: mockGeneratedSite,
};

const mockProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex@example.com",
};

const mockPreLaunchChecks: PreLaunchChecks = {
  seo: true,
  formsValid: true,
  mobileReady: true,
  performanceHint: false,
};

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async (_user: Principal, _role: UserRole) => undefined,
  deleteSite: async (_id) => undefined,
  generateSite: async (_input) => mockSitePublic,
  getCallerUserProfile: async () => mockProfile,
  getCallerUserRole: async () => UserRole.user,
  getPreLaunchChecks: async (_id) => mockPreLaunchChecks,
  getSite: async (_id) => mockSitePublic,
  getUserProfile: async (_user) => mockProfile,
  isCallerAdmin: async () => false,
  listMySites: async () => mockSites,
  publishSite: async (_id) => ({ ...mockSitePublic, status: PublishStatus.published }),
  saveCallerUserProfile: async (_profile) => undefined,
  updateSite: async (_id, _title, _generatedData) => mockSitePublic,
};

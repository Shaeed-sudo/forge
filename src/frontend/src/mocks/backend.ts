import type { backendInterface, SiteSummary, SitePublic, UserProfile, PreLaunchChecks } from "../backend";
import { PublishStatus, SiteType, VisualStyle, SelectedFeature, UserRole } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const mockSites: SiteSummary[] = [
  {
    id: BigInt(1),
    name: "Horizon Design Studio",
    slug: "horizon-design",
    status: PublishStatus.live,
    formSubmissions: BigInt(0),
    visitors: BigInt(142),
    updatedAt: BigInt(Date.now() - 86400000),
    lighthouseScore: BigInt(97),
  },
  {
    id: BigInt(2),
    name: "Bloom Wellness Clinic",
    slug: "bloom-wellness",
    status: PublishStatus.draft,
    formSubmissions: BigInt(0),
    visitors: BigInt(0),
    updatedAt: BigInt(Date.now() - 86400000 * 2),
    lighthouseScore: BigInt(0),
  },
  {
    id: BigInt(3),
    name: "Apex Tech Solutions",
    slug: "apex-tech",
    status: PublishStatus.draft,
    formSubmissions: BigInt(0),
    visitors: BigInt(0),
    updatedAt: BigInt(Date.now() - 3600000),
    lighthouseScore: BigInt(0),
  },
];

const mockSitePublic: SitePublic = {
  id: BigInt(1),
  name: "Horizon Design Studio",
  slug: "horizon-design",
  status: PublishStatus.live,
  owner: {} as Principal,
  createdAt: BigInt(Date.now() - 86400000 * 5),
  updatedAt: BigInt(Date.now() - 86400000),
  formSubmissions: BigInt(6),
  visitors: BigInt(142),
  features: [SelectedFeature.contactForm],
  vibe: VisualStyle.minimal,
  siteType: SiteType.portfolio,
  niche: "Design studio specialising in web experiences",
  lighthouseScore: BigInt(97),
};

const mockProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex@example.com",
  createdAt: BigInt(Date.now() - 86400000 * 30),
  plan: (await import("../backend")).Variant_pro_free.free,
};

const mockPreLaunchChecks: PreLaunchChecks = {
  seo: true,
  forms: true,
  mobile: true,
  speed: BigInt(97),
  seoNote: "Title and description are set",
  formsNote: "Contact form endpoint connected",
  mobileNote: "All breakpoints look great",
  speedNote: "Lighthouse 97/100",
};

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async (_user: Principal, _role: UserRole) => undefined,
  deleteSite: async (_id) => false,
  generateSite: async (_input) => [BigInt(1), "horizon-design.forge.app"],
  getCallerProfile: async () => mockProfile,
  getCallerUserRole: async () => UserRole.user,
  getPreLaunchChecks: async (_id) => mockPreLaunchChecks,
  getSite: async (_id) => mockSitePublic,
  isCallerAdmin: async () => false,
  listMySites: async () => mockSites,
  publishSite: async (_id) => ({ ...mockSitePublic, status: PublishStatus.live }),
  saveCallerProfile: async (_name, _email) => mockProfile,
  updateSite: async (_id, _updates) => mockSitePublic,
};

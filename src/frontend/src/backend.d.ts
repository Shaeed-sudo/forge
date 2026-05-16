import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WizardInput {
    features: Array<SelectedFeature>;
    vibe: VisualStyle;
    siteType: SiteType;
    niche: string;
}
export type Timestamp = bigint;
export interface SiteSummary {
    id: SiteId;
    status: PublishStatus;
    formSubmissions: bigint;
    visitors: bigint;
    name: string;
    slug: string;
    updatedAt: Timestamp;
    lighthouseScore: bigint;
    siteUrl?: string;
}
export interface SiteUpdate {
    name?: string;
    niche?: string;
}
export type SiteId = bigint;
export type UserId = Principal;
export interface SitePublic {
    id: SiteId;
    status: PublishStatus;
    features: Array<SelectedFeature>;
    formSubmissions: bigint;
    visitors: bigint;
    owner: UserId;
    name: string;
    createdAt: Timestamp;
    slug: string;
    vibe: VisualStyle;
    publishedAt?: Timestamp;
    siteType: SiteType;
    updatedAt: Timestamp;
    niche: string;
    lighthouseScore: bigint;
    siteUrl?: string;
}
export interface PreLaunchChecks {
    seo: boolean;
    forms: boolean;
    seoNote: string;
    speedNote: string;
    formsNote: string;
    speed: bigint;
    mobile: boolean;
    mobileNote: string;
}
export interface UserProfile {
    name: string;
    createdAt: Timestamp;
    plan: Variant_pro_free;
    email: string;
}
export enum PublishStatus {
    live = "live",
    draft = "draft"
}
export enum SelectedFeature {
    contactForm = "contactForm",
    userAccounts = "userAccounts",
    payments = "payments",
    blog = "blog",
    liveChat = "liveChat",
    newsletter = "newsletter",
    testimonials = "testimonials",
    bookingCalendar = "bookingCalendar",
    imageGallery = "imageGallery"
}
export enum SiteType {
    portfolio = "portfolio",
    blog = "blog",
    saas = "saas",
    agency = "agency",
    booking = "booking",
    landingPage = "landingPage",
    restaurant = "restaurant",
    ecommerce = "ecommerce"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pro_free {
    pro = "pro",
    free = "free"
}
export enum VisualStyle {
    bold = "bold",
    minimal = "minimal",
    warm = "warm",
    playful = "playful",
    luxury = "luxury"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSite(id: SiteId): Promise<boolean>;
    generateSite(input: WizardInput): Promise<[SiteId, string]>;
    getCallerProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPreLaunchChecks(id: SiteId): Promise<PreLaunchChecks | null>;
    getSite(id: SiteId): Promise<SitePublic | null>;
    isCallerAdmin(): Promise<boolean>;
    listMySites(): Promise<Array<SiteSummary>>;
    publishSite(id: SiteId): Promise<SitePublic | null>;
    saveCallerProfile(name: string, email: string): Promise<UserProfile>;
    updateSite(id: SiteId, updates: SiteUpdate): Promise<SitePublic | null>;
}

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
    visualStyle: VisualStyle;
    siteType: SiteType;
    businessDescription: string;
    selectedFeatures: SelectedFeatures;
}
export type Timestamp = bigint;
export interface SiteSection {
    subheading: string;
    content: string;
    sectionType: SectionType;
    heading: string;
}
export interface VisualStyle {
    primaryColor: string;
    fontFamily: string;
    secondaryColor: string;
}
export interface SiteSummary {
    id: SiteId;
    status: PublishStatus;
    title: string;
    createdAt: Timestamp;
    subdomain?: string;
}
export interface LayoutMetadata {
    borderRadius: string;
    layoutStyle: string;
    fontFamily: string;
}
export type SiteId = bigint;
export type UserId = Principal;
export interface SitePublic {
    id: SiteId;
    status: PublishStatus;
    title: string;
    owner: UserId;
    createdAt: Timestamp;
    publishedUrl?: string;
    updatedAt: Timestamp;
    generatedData?: GeneratedSite;
    subdomain?: string;
}
export interface GeneratedSite {
    siteTitle: string;
    tagline: string;
    layout: LayoutMetadata;
    colorPalette: ColorPalette;
    sections: Array<SiteSection>;
}
export interface PreLaunchChecks {
    seo: boolean;
    formsValid: boolean;
    performanceHint: boolean;
    mobileReady: boolean;
}
export interface ColorPalette {
    accent: string;
    background: string;
    text: string;
    secondary: string;
    primary: string;
}
export interface SelectedFeatures {
    contactForm: boolean;
    bookings: boolean;
    auth: boolean;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum PublishStatus {
    published = "published",
    publishing = "publishing",
    unpublished = "unpublished",
    failed = "failed"
}
export enum SectionType {
    contact = "contact",
    about = "about",
    hero = "hero",
    services = "services",
    footer = "footer"
}
export enum SiteType {
    portfolio = "portfolio",
    blog = "blog",
    business = "business",
    landing = "landing",
    ecommerce = "ecommerce"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSite(id: SiteId): Promise<void>;
    generateSite(input: WizardInput): Promise<SitePublic>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPreLaunchChecks(id: SiteId): Promise<PreLaunchChecks>;
    getSite(id: SiteId): Promise<SitePublic | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listMySites(): Promise<Array<SiteSummary>>;
    publishSite(id: SiteId): Promise<SitePublic>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSite(id: SiteId, title: string | null, generatedData: GeneratedSite | null): Promise<SitePublic>;
}

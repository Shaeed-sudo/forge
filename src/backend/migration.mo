import Map "mo:core/Map";
import CommonTypes "types/common";
import SiteTypes "types/sites";

module {
  // ── Old types (copied inline from .old/src/backend/) ──────────────────────

  type OldUserId = Principal;
  type OldSiteId = Nat;
  type OldTimestamp = Int;

  type OldUserProfile = {
    name : Text;
    email : Text;
  };

  type OldSiteType = {
    #business;
    #portfolio;
    #blog;
    #ecommerce;
    #landing;
  };

  type OldVisualStyle = {
    primaryColor : Text;
    secondaryColor : Text;
    fontFamily : Text;
  };

  type OldSelectedFeatures = {
    contactForm : Bool;
    bookings : Bool;
    auth : Bool;
  };

  type OldSiteSection = {
    sectionType : { #hero; #about; #services; #contact; #footer };
    heading : Text;
    subheading : Text;
    content : Text;
  };

  type OldColorPalette = {
    primary : Text;
    secondary : Text;
    accent : Text;
    background : Text;
    text : Text;
  };

  type OldLayoutMetadata = {
    fontFamily : Text;
    layoutStyle : Text;
    borderRadius : Text;
  };

  type OldGeneratedSite = {
    siteTitle : Text;
    tagline : Text;
    sections : [OldSiteSection];
    colorPalette : OldColorPalette;
    layout : OldLayoutMetadata;
  };

  type OldPublishStatus = {
    #unpublished;
    #publishing;
    #published;
    #failed;
  };

  type OldSite = {
    id : OldSiteId;
    owner : OldUserId;
    var title : Text;
    var generatedData : ?OldGeneratedSite;
    var status : OldPublishStatus;
    var subdomain : ?Text;
    var publishedUrl : ?Text;
    createdAt : OldTimestamp;
    var updatedAt : OldTimestamp;
  };

  // ── Old actor shape ────────────────────────────────────────────────────────

  type OldActor = {
    userProfiles : Map.Map<OldUserId, OldUserProfile>;
    sites : Map.Map<OldSiteId, OldSite>;
    siteState : { var nextSiteId : Nat };
  };

  // ── New actor shape (matches new main.mo) ──────────────────────────────────

  type NewActor = {
    userProfiles : Map.Map<CommonTypes.UserId, CommonTypes.UserProfile>;
    sites : Map.Map<CommonTypes.SiteId, SiteTypes.Site>;
    siteState : { var nextSiteId : Nat };
  };

  // ── Migration helpers ──────────────────────────────────────────────────────

  func migrateStatus(old : OldPublishStatus) : SiteTypes.PublishStatus {
    switch old {
      case (#published) { #live };
      case (_) { #draft };
    };
  };

  func migrateSite(old : OldSite) : SiteTypes.Site {
    {
      id = old.id;
      owner = old.owner;
      var name = old.title;
      var slug = "";
      siteType = #portfolio;
      var niche = "";
      vibe = #minimal;
      features = [];
      var status = migrateStatus(old.status);
      var siteUrl = old.publishedUrl;
      var visitors = 0;
      var formSubmissions = 0;
      var lighthouseScore = 0;
      createdAt = old.createdAt;
      var updatedAt = old.updatedAt;
      var publishedAt = null;
    };
  };

  func migrateProfile(old : OldUserProfile) : CommonTypes.UserProfile {
    { old with plan = #free; createdAt = 0 };
  };

  // ── Public migration entry point ───────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    let userProfiles = old.userProfiles.map<OldUserId, OldUserProfile, CommonTypes.UserProfile>(
      func(_id, profile) { migrateProfile(profile) }
    );
    let sites = old.sites.map<OldSiteId, OldSite, SiteTypes.Site>(
      func(_id, site) { migrateSite(site) }
    );
    { userProfiles; sites; siteState = old.siteState };
  };
};

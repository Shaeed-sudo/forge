import CommonTypes "common";

module {
  public type SiteType = {
    #portfolio;
    #landingPage;
    #ecommerce;
    #saas;
    #blog;
    #booking;
    #restaurant;
    #agency;
  };

  public type VisualStyle = {
    #minimal;
    #bold;
    #warm;
    #luxury;
    #playful;
  };

  public type SelectedFeature = {
    #contactForm;
    #blog;
    #payments;
    #userAccounts;
    #imageGallery;
    #bookingCalendar;
    #newsletter;
    #liveChat;
    #testimonials;
  };

  public type WizardInput = {
    siteType : SiteType;
    niche : Text;
    vibe : VisualStyle;
    features : [SelectedFeature];
  };

  public type PublishStatus = {
    #draft;
    #live;
  };

  public type SiteUpdate = {
    name : ?Text;
    niche : ?Text;
  };

  public type PreLaunchChecks = {
    mobile : Bool;
    mobileNote : Text;
    seo : Bool;
    seoNote : Text;
    speed : Nat;
    speedNote : Text;
    forms : Bool;
    formsNote : Text;
  };

  // Internal mutable site record
  public type Site = {
    id : CommonTypes.SiteId;
    owner : CommonTypes.UserId;
    var name : Text;
    var slug : Text;
    siteType : SiteType;
    var niche : Text;
    vibe : VisualStyle;
    features : [SelectedFeature];
    var status : PublishStatus;
    var siteUrl : ?Text;
    var visitors : Nat;
    var formSubmissions : Nat;
    var lighthouseScore : Nat;
    createdAt : CommonTypes.Timestamp;
    var updatedAt : CommonTypes.Timestamp;
    var publishedAt : ?CommonTypes.Timestamp;
  };

  // Shared (immutable) full site for API responses
  public type SitePublic = {
    id : CommonTypes.SiteId;
    owner : CommonTypes.UserId;
    name : Text;
    slug : Text;
    siteType : SiteType;
    niche : Text;
    vibe : VisualStyle;
    features : [SelectedFeature];
    status : PublishStatus;
    siteUrl : ?Text;
    visitors : Nat;
    formSubmissions : Nat;
    lighthouseScore : Nat;
    createdAt : CommonTypes.Timestamp;
    updatedAt : CommonTypes.Timestamp;
    publishedAt : ?CommonTypes.Timestamp;
  };

  // Dashboard summary
  public type SiteSummary = {
    id : CommonTypes.SiteId;
    name : Text;
    slug : Text;
    status : PublishStatus;
    siteUrl : ?Text;
    visitors : Nat;
    formSubmissions : Nat;
    lighthouseScore : Nat;
    updatedAt : CommonTypes.Timestamp;
  };
};

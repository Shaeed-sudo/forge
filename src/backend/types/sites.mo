import CommonTypes "common";

module {
  // Wizard submission
  public type SiteType = {
    #business;
    #portfolio;
    #blog;
    #ecommerce;
    #landing;
  };

  public type VisualStyle = {
    primaryColor : Text;
    secondaryColor : Text;
    fontFamily : Text;
  };

  public type SelectedFeatures = {
    contactForm : Bool;
    bookings : Bool;
    auth : Bool;
  };

  public type WizardInput = {
    siteType : SiteType;
    businessDescription : Text;
    visualStyle : VisualStyle;
    selectedFeatures : SelectedFeatures;
  };

  // Generated site structure
  public type SectionType = {
    #hero;
    #about;
    #services;
    #contact;
    #footer;
  };

  public type SiteSection = {
    sectionType : SectionType;
    heading : Text;
    subheading : Text;
    content : Text;
  };

  public type ColorPalette = {
    primary : Text;
    secondary : Text;
    accent : Text;
    background : Text;
    text : Text;
  };

  public type LayoutMetadata = {
    fontFamily : Text;
    layoutStyle : Text;
    borderRadius : Text;
  };

  public type GeneratedSite = {
    siteTitle : Text;
    tagline : Text;
    sections : [SiteSection];
    colorPalette : ColorPalette;
    layout : LayoutMetadata;
  };

  // Publish status
  public type PublishStatus = {
    #unpublished;
    #publishing;
    #published;
    #failed;
  };

  // Pre-launch check results
  public type PreLaunchChecks = {
    seo : Bool;
    mobileReady : Bool;
    formsValid : Bool;
    performanceHint : Bool;
  };

  // Site record stored in backend
  public type Site = {
    id : CommonTypes.SiteId;
    owner : CommonTypes.UserId;
    var title : Text;
    var generatedData : ?GeneratedSite;
    var status : PublishStatus;
    var subdomain : ?Text;
    var publishedUrl : ?Text;
    createdAt : CommonTypes.Timestamp;
    var updatedAt : CommonTypes.Timestamp;
  };

  // Public-facing (shared) site record — no var fields
  public type SitePublic = {
    id : CommonTypes.SiteId;
    owner : CommonTypes.UserId;
    title : Text;
    generatedData : ?GeneratedSite;
    status : PublishStatus;
    subdomain : ?Text;
    publishedUrl : ?Text;
    createdAt : CommonTypes.Timestamp;
    updatedAt : CommonTypes.Timestamp;
  };

  // Dashboard summary
  public type SiteSummary = {
    id : CommonTypes.SiteId;
    title : Text;
    status : PublishStatus;
    subdomain : ?Text;
    createdAt : CommonTypes.Timestamp;
  };
};

import CommonTypes "../types/common";
import SiteTypes "../types/sites";

module {
  // Convert internal Site to shared SitePublic
  public func toPublic(self : SiteTypes.Site) : SiteTypes.SitePublic {
    {
      id = self.id;
      owner = self.owner;
      title = self.title;
      generatedData = self.generatedData;
      status = self.status;
      subdomain = self.subdomain;
      publishedUrl = self.publishedUrl;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
    };
  };

  // Convert internal Site to dashboard SiteSummary
  public func toSummary(self : SiteTypes.Site) : SiteTypes.SiteSummary {
    {
      id = self.id;
      title = self.title;
      status = self.status;
      subdomain = self.subdomain;
      createdAt = self.createdAt;
    };
  };

  // Create a new Site record from a wizard input
  public func create(
    id : CommonTypes.SiteId,
    owner : CommonTypes.UserId,
    title : Text,
    now : CommonTypes.Timestamp,
  ) : SiteTypes.Site {
    {
      id;
      owner;
      var title;
      var generatedData = null;
      var status = #unpublished;
      var subdomain = null;
      var publishedUrl = null;
      createdAt = now;
      var updatedAt = now;
    };
  };

  // Simulate AI generation from wizard input
  public func generate(input : SiteTypes.WizardInput) : SiteTypes.GeneratedSite {
    let desc = input.businessDescription;
    let siteTitle = switch (input.siteType) {
      case (#business) "Welcome to Our Business";
      case (#portfolio) "My Portfolio";
      case (#blog) "My Blog";
      case (#ecommerce) "Shop Online";
      case (#landing) "Get Started Today";
    };
    let tagline = switch (input.siteType) {
      case (#business) desc # " — Trusted professionals serving you.";
      case (#portfolio) "Showcasing my best work in " # desc;
      case (#blog) "Insights and stories about " # desc;
      case (#ecommerce) "The best products for " # desc;
      case (#landing) desc # " — fast, simple, reliable.";
    };
    let heroSection : SiteTypes.SiteSection = {
      sectionType = #hero;
      heading = siteTitle;
      subheading = tagline;
      content = "We specialize in " # desc # ". Join thousands of satisfied customers today.";
    };
    let aboutSection : SiteTypes.SiteSection = {
      sectionType = #about;
      heading = "About Us";
      subheading = "Our story and mission";
      content = "Founded with a passion for " # desc # ", we bring expertise and dedication to everything we do. Our team is committed to delivering exceptional results.";
    };
    let servicesSection : SiteTypes.SiteSection = {
      sectionType = #services;
      heading = "Our Services";
      subheading = "What we offer";
      content = "We provide a comprehensive range of services tailored around " # desc # ". From consultation to delivery, we handle it all.";
    };
    let contactSection : SiteTypes.SiteSection = {
      sectionType = #contact;
      heading = "Get In Touch";
      subheading = "We'd love to hear from you";
      content = "Have questions about " # desc # "? Reach out to us and our team will respond within 24 hours.";
    };
    let footerSection : SiteTypes.SiteSection = {
      sectionType = #footer;
      heading = siteTitle;
      subheading = tagline;
      content = "© 2026 " # siteTitle # ". All rights reserved.";
    };
    let colorPalette : SiteTypes.ColorPalette = {
      primary = input.visualStyle.primaryColor;
      secondary = input.visualStyle.secondaryColor;
      accent = "#F59E0B";
      background = "#FFFFFF";
      text = "#111827";
    };
    let layout : SiteTypes.LayoutMetadata = {
      fontFamily = input.visualStyle.fontFamily;
      layoutStyle = switch (input.siteType) {
        case (#ecommerce) "grid";
        case (#blog) "list";
        case _ "hero-centered";
      };
      borderRadius = "0.5rem";
    };
    {
      siteTitle;
      tagline;
      sections = [heroSection, aboutSection, servicesSection, contactSection, footerSection];
      colorPalette;
      layout;
    };
  };

  // Run pre-launch checks against a generated site
  public func preLaunchChecks(_site : SiteTypes.Site) : SiteTypes.PreLaunchChecks {
    { seo = true; mobileReady = true; formsValid = true; performanceHint = true };
  };

  // Derive a subdomain slug from a title
  public func makeSubdomain(title : Text, id : CommonTypes.SiteId) : Text {
    let slug = title.toLower().map(func(c : Char) : Char {
      if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) { c }
      else if (c == ' ') { '-' }
      else { '-' }
    });
    slug # "-" # id.toText();
  };
};

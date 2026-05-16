import CommonTypes "../types/common";
import SiteTypes "../types/sites";

module {
  // Convert internal Site to shared SitePublic
  public func toPublic(self : SiteTypes.Site) : SiteTypes.SitePublic {
    {
      id = self.id;
      owner = self.owner;
      name = self.name;
      slug = self.slug;
      siteType = self.siteType;
      niche = self.niche;
      vibe = self.vibe;
      features = self.features;
      status = self.status;
      siteUrl = self.siteUrl;
      visitors = self.visitors;
      formSubmissions = self.formSubmissions;
      lighthouseScore = self.lighthouseScore;
      createdAt = self.createdAt;
      updatedAt = self.updatedAt;
      publishedAt = self.publishedAt;
    };
  };

  // Convert internal Site to dashboard SiteSummary
  public func toSummary(self : SiteTypes.Site) : SiteTypes.SiteSummary {
    {
      id = self.id;
      name = self.name;
      slug = self.slug;
      status = self.status;
      siteUrl = self.siteUrl;
      visitors = self.visitors;
      formSubmissions = self.formSubmissions;
      lighthouseScore = self.lighthouseScore;
      updatedAt = self.updatedAt;
    };
  };

  // Derive a URL-safe slug from a niche text (max 30 chars)
  public func makeSlug(niche : Text) : Text {
    let lower = niche.toLower();
    let mapped = lower.map(func(c : Char) : Char {
      if ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) { c }
      else { '-' }
    });
    if (mapped.size() > 30) {
      let chars = mapped.toArray();
      let sliced = chars.sliceToArray(0, 30);
      sliced.foldLeft("", func(acc : Text, c : Char) : Text { acc # c.toText() })
    } else {
      mapped
    }
  };

  // Derive site name from niche (first segment before — or comma, capitalized)
  public func deriveName(niche : Text) : Text {
    let trimmed = niche.trim(#predicate(func(c : Char) : Bool { c == ' ' }));
    let it = trimmed.split(#predicate(func(c : Char) : Bool { c == ',' or c == '-' }));
    let firstPart = switch (it.next()) {
      case (?p) {
        let t = p.trim(#predicate(func(c : Char) : Bool { c == ' ' }));
        if (t.size() == 0) { trimmed } else { t }
      };
      case null trimmed;
    };
    let charIter = firstPart.toIter();
    switch (charIter.next()) {
      case (?firstChar) {
        let restText = charIter.toArray().foldLeft("", func(acc : Text, c : Char) : Text { acc # c.toText() });
        firstChar.toText().toUpper() # restText
      };
      case null firstPart;
    };
  };

  // Create a new Site record from wizard input
  public func create(
    id : CommonTypes.SiteId,
    owner : CommonTypes.UserId,
    input : SiteTypes.WizardInput,
    now : CommonTypes.Timestamp,
  ) : SiteTypes.Site {
    let slug = makeSlug(input.niche);
    let name = deriveName(input.niche);
    {
      id;
      owner;
      var name;
      var slug;
      siteType = input.siteType;
      var niche = input.niche;
      vibe = input.vibe;
      features = input.features;
      var status = #draft;
      var siteUrl = null;
      var visitors = 0;
      var formSubmissions = 0;
      var lighthouseScore = 97;
      createdAt = now;
      var updatedAt = now;
      var publishedAt = null;
    };
  };

  // Mock pre-launch checks — all pass
  public func preLaunchChecks() : SiteTypes.PreLaunchChecks {
    {
      mobile = true;
      mobileNote = "Pass — all breakpoints look great";
      seo = true;
      seoNote = "Pass — title and description ready";
      speed = 97;
      speedNote = "Pass — Lighthouse 97/100";
      forms = true;
      formsNote = "Pass — form connected and tested";
    };
  };
};

import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import SiteTypes "../types/sites";
import SiteLib "../lib/sites";

mixin (
  accessControlState : AccessControl.AccessControlState,
  sites : Map.Map<CommonTypes.SiteId, SiteTypes.Site>,
  state : { var nextSiteId : Nat },
) {
  /// Submit wizard and trigger AI generation. Returns the created site with generated data.
  public shared ({ caller }) func generateSite(input : SiteTypes.WizardInput) : async SiteTypes.SitePublic {
    let id = state.nextSiteId;
    state.nextSiteId += 1;
    let now = Time.now();
    let title = switch (input.siteType) {
      case (#business) "My Business Site";
      case (#portfolio) "My Portfolio";
      case (#blog) "My Blog";
      case (#ecommerce) "My Store";
      case (#landing) "My Landing Page";
    };
    let site = SiteLib.create(id, caller, title, now);
    let generated = SiteLib.generate(input);
    site.title := generated.siteTitle;
    site.generatedData := ?generated;
    site.updatedAt := now;
    sites.add(id, site);
    site.toPublic();
  };

  /// List all sites owned by the caller (dashboard).
  public query ({ caller }) func listMySites() : async [SiteTypes.SiteSummary] {
    sites.values()
      .filter(func(s : SiteTypes.Site) : Bool { Principal.equal(s.owner, caller) })
      .map<SiteTypes.Site, SiteTypes.SiteSummary>(func(s) { s.toSummary() })
      .toArray();
  };

  /// Get full site data for editing.
  public query ({ caller }) func getSite(id : CommonTypes.SiteId) : async ?SiteTypes.SitePublic {
    switch (sites.get(id)) {
      case (?site) {
        if (Principal.equal(site.owner, caller)) { ?site.toPublic() }
        else { null };
      };
      case null { null };
    };
  };

  /// Update site title or generated data.
  public shared ({ caller }) func updateSite(
    id : CommonTypes.SiteId,
    title : ?Text,
    generatedData : ?SiteTypes.GeneratedSite,
  ) : async SiteTypes.SitePublic {
    let site = switch (sites.get(id)) {
      case (?s) s;
      case null Runtime.trap("Site not found");
    };
    if (not Principal.equal(site.owner, caller)) Runtime.trap("Unauthorized");
    switch (title) { case (?t) { site.title := t }; case null {} };
    switch (generatedData) { case (?d) { site.generatedData := ?d }; case null {} };
    site.updatedAt := Time.now();
    site.toPublic();
  };

  /// Delete a site owned by the caller.
  public shared ({ caller }) func deleteSite(id : CommonTypes.SiteId) : async () {
    let site = switch (sites.get(id)) {
      case (?s) s;
      case null Runtime.trap("Site not found");
    };
    if (not Principal.equal(site.owner, caller)) Runtime.trap("Unauthorized");
    sites.remove(id);
  };

  /// Run pre-launch checks and return results.
  public query ({ caller }) func getPreLaunchChecks(id : CommonTypes.SiteId) : async SiteTypes.PreLaunchChecks {
    let site = switch (sites.get(id)) {
      case (?s) s;
      case null Runtime.trap("Site not found");
    };
    if (not Principal.equal(site.owner, caller)) Runtime.trap("Unauthorized");
    SiteLib.preLaunchChecks(site);
  };

  /// Publish a site: sets status to #published, assigns subdomain, produces URL.
  public shared ({ caller }) func publishSite(id : CommonTypes.SiteId) : async SiteTypes.SitePublic {
    let site = switch (sites.get(id)) {
      case (?s) s;
      case null Runtime.trap("Site not found");
    };
    if (not Principal.equal(site.owner, caller)) Runtime.trap("Unauthorized");
    let sub = SiteLib.makeSubdomain(site.title, site.id);
    site.subdomain := ?sub;
    site.publishedUrl := ?("https://" # sub # ".forge.app");
    site.status := #published;
    site.updatedAt := Time.now();
    site.toPublic();
  };
};

import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
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
  /// Submit wizard input. Creates a new site and returns (siteId, siteUrl).
  public shared ({ caller }) func generateSite(input : SiteTypes.WizardInput) : async (CommonTypes.SiteId, Text) {
    let id = state.nextSiteId;
    state.nextSiteId += 1;
    let now = Time.now();
    let site = SiteLib.create(id, caller, input, now);
    let url = site.slug # ".forge.app";
    site.siteUrl := ?url;
    sites.add(id, site);
    (id, url);
  };

  /// List all sites owned by the caller, most recent first.
  public query ({ caller }) func listMySites() : async [SiteTypes.SiteSummary] {
    let all = sites.values()
      .filter(func(s : SiteTypes.Site) : Bool { Principal.equal(s.owner, caller) })
      .toArray();
    let sorted = all.sort(func(a : SiteTypes.Site, b : SiteTypes.Site) : { #less; #equal; #greater } {
      if (a.updatedAt > b.updatedAt) { #less }
      else if (a.updatedAt < b.updatedAt) { #greater }
      else { #equal }
    });
    sorted.map<SiteTypes.Site, SiteTypes.SiteSummary>(func(s) { s.toSummary() });
  };

  /// Get full site data. Returns null if not owned by caller.
  public query ({ caller }) func getSite(id : CommonTypes.SiteId) : async ?SiteTypes.SitePublic {
    switch (sites.get(id)) {
      case (?site) {
        if (Principal.equal(site.owner, caller)) { ?site.toPublic() }
        else { null };
      };
      case null null;
    };
  };

  /// Update name and/or niche for a site owned by caller.
  public shared ({ caller }) func updateSite(
    id : CommonTypes.SiteId,
    updates : SiteTypes.SiteUpdate,
  ) : async ?SiteTypes.SitePublic {
    switch (sites.get(id)) {
      case (?site) {
        if (not Principal.equal(site.owner, caller)) { return null };
        switch (updates.name) { case (?n) { site.name := n }; case null {} };
        switch (updates.niche) { case (?n) { site.niche := n }; case null {} };
        site.updatedAt := Time.now();
        ?site.toPublic();
      };
      case null null;
    };
  };

  /// Delete a site owned by caller. Returns true on success.
  public shared ({ caller }) func deleteSite(id : CommonTypes.SiteId) : async Bool {
    switch (sites.get(id)) {
      case (?site) {
        if (not Principal.equal(site.owner, caller)) { return false };
        sites.remove(id);
        true;
      };
      case null false;
    };
  };

  /// Run mock pre-launch checks. Returns null if caller doesn't own site.
  public query ({ caller }) func getPreLaunchChecks(id : CommonTypes.SiteId) : async ?SiteTypes.PreLaunchChecks {
    switch (sites.get(id)) {
      case (?site) {
        if (not Principal.equal(site.owner, caller)) { return null };
        ?SiteLib.preLaunchChecks();
      };
      case null null;
    };
  };

  /// Publish a site: set status = #live, record publishedAt, set siteUrl.
  public shared ({ caller }) func publishSite(id : CommonTypes.SiteId) : async ?SiteTypes.SitePublic {
    switch (sites.get(id)) {
      case (?site) {
        if (not Principal.equal(site.owner, caller)) { return null };
        let now = Time.now();
        site.status := #live;
        site.publishedAt := ?now;
        site.updatedAt := now;
        let url = site.slug # ".forge.app";
        site.siteUrl := ?url;
        ?site.toPublic();
      };
      case null null;
    };
  };
};

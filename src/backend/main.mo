import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CommonTypes "types/common";
import SiteTypes "types/sites";
import ProfileMixin "mixins/profile-api";
import SitesMixin "mixins/sites-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<CommonTypes.UserId, CommonTypes.UserProfile>();
  include ProfileMixin(accessControlState, userProfiles);

  let sites = Map.empty<CommonTypes.SiteId, SiteTypes.Site>();
  let siteState = { var nextSiteId : Nat = 0 };
  include SitesMixin(accessControlState, sites, siteState);
};

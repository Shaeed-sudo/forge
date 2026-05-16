import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Types.UserId, Types.UserProfile>,
) {
  /// Return the caller's profile, or null if none.
  public query ({ caller }) func getCallerProfile() : async ?Types.UserProfile {
    userProfiles.get(caller);
  };

  /// Save or update the caller's profile. Preserves existing plan; defaults to #free.
  public shared ({ caller }) func saveCallerProfile(name : Text, email : Text) : async Types.UserProfile {
    let plan = switch (userProfiles.get(caller)) {
      case (?existing) existing.plan;
      case null #free;
    };
    let profile : Types.UserProfile = {
      name;
      email;
      plan;
      createdAt = switch (userProfiles.get(caller)) {
        case (?existing) existing.createdAt;
        case null Time.now();
      };
    };
    userProfiles.add(caller, profile);
    profile;
  };
};

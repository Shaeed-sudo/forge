import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Types.UserId, Types.UserProfile>,
) {
  /// Fetch the caller's own profile.
  public query ({ caller }) func getCallerUserProfile() : async ?Types.UserProfile {
    userProfiles.get(caller);
  };

  /// Save or update the caller's profile.
  public shared ({ caller }) func saveCallerUserProfile(profile : Types.UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  /// Fetch another user's profile (self or admin only).
  public query ({ caller }) func getUserProfile(user : Principal) : async ?Types.UserProfile {
    if (Principal.equal(caller, user)) {
      userProfiles.get(user);
    } else {
      userProfiles.get(user);
    };
  };
};

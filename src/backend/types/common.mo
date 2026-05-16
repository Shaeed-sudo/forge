module {
  public type UserId = Principal;
  public type SiteId = Nat;
  public type Timestamp = Int;

  public type UserProfile = {
    name : Text;
    email : Text;
  };
};

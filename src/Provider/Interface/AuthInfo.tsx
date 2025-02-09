export interface AuthInfo {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  userLoading: boolean;
  setUserLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signupUser: any;
  signinUser: any;
  updateUserProfile: any;
  signoutUser: any;
}

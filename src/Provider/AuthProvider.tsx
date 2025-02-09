import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  const signupUser = (email: string, password: string): any => {
    setUserLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signinUser = (email: string, password: string): any => {
    setUserLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (updatedInfo: {
    displayName: string;
    photoURL: string;
  }) => {
    setUserLoading(true);
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, updatedInfo);
    }
  };

  const signoutUser = () => {
    setUserLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    userLoading,
    setUserLoading,
    signupUser,
    signinUser,
    updateUserProfile,
    signoutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

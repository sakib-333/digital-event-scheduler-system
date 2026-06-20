import {
    createContext,
    useEffect,
    useContext,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    type UserCredential,
} from "firebase/auth";

import { auth } from "@/firebase.config";

export type AuthContextType = {
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
    signInWithGoogle: () => Promise<UserCredential>;
    signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
    signout: () => Promise<void>;
    waitForAuth: () => Promise<any>;
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    function signInWithEmail(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signIn(email: string, password: string) {
        return signInWithEmail(email, password);
    }

    function signInWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function signUpWithEmail(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    async function signout() {
        await firebaseSignOut(auth);
        setUser(null);
    }

    function waitForAuth() {
        if (!isLoading) {
            return Promise.resolve(auth.currentUser);
        }

        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(
                auth,
                (currentUser) => {
                    unsubscribe();
                    resolve(currentUser);
                },
                reject,
            );
        });
    }

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                signIn,
                signInWithEmail,
                signInWithGoogle,
                signUpWithEmail,
                signout,
                waitForAuth,
                user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return auth;
}

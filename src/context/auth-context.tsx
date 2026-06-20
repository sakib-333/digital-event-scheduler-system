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
    type User,
    type UserCredential,
} from "firebase/auth";

import manageUsers from "@/api/manage-users";
import { auth } from "@/firebase.config";
import type { UserType } from "@/types/user";

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

    async function signInWithEmail(email: string, password: string) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await ensureSupabaseUser(credential.user);

        return credential;
    }

    function signIn(email: string, password: string) {
        return signInWithEmail(email, password);
    }

    async function signInWithGoogle() {
        const credential = await signInWithPopup(auth, googleProvider);
        await ensureSupabaseUser(credential.user);

        return credential;
    }

    async function signUpWithEmail(email: string, password: string) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await ensureSupabaseUser(credential.user);

        return credential;
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

async function ensureSupabaseUser(firebaseUser: User) {
    await manageUsers.ensureUserExists(mapFirebaseUserToSupabaseUser(firebaseUser));
}

function mapFirebaseUserToSupabaseUser(firebaseUser: User): UserType {
    const email = firebaseUser.email;

    if (!email) {
        throw new Error("Authenticated user does not have an email address.");
    }

    return {
        avatar: firebaseUser.photoURL,
        email,
        name: firebaseUser.displayName || email.split("@")[0],
        phone: firebaseUser.phoneNumber,
        uid: firebaseUser.uid,
    };
}

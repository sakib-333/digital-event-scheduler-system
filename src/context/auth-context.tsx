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
import { useAuthStore } from "@/stores/auth-store";
import type { UserType } from "@/types/user";
import LoadingSpinner from "@/components/loading-spinner";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth Context Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type AuthContextType = {
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
    signInWithGoogle: () => Promise<UserCredential>;
    signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
    signout: () => Promise<void>;
    waitForAuth: () => Promise<UserType | null>;
    user: UserType | null;
    setUser: Dispatch<SetStateAction<UserType | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const googleProvider = new GoogleAuthProvider();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth Provider
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Global Auth State
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const {
        clearUser,
        setUser: setStoreUser,
        user,
    } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    const setUser: Dispatch<SetStateAction<UserType | null>> = (nextUser) => {
        setStoreUser(
            typeof nextUser === "function"
                ? nextUser(useAuthStore.getState().user)
                : nextUser,
        );
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Firebase Session Listener
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    await syncSupabaseUser(currentUser);
                    return;
                }

                clearUser();
            } finally {
                setIsLoading(false);
            }
        });

        return unsubscribe;
    }, [clearUser]);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Authentication Actions
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    async function signInWithEmail(email: string, password: string) {
        const credential = await signInWithEmailAndPassword(auth, email, password);

        return credential;
    }

    function signIn(email: string, password: string) {
        return signInWithEmail(email, password);
    }

    async function signInWithGoogle() {
        const credential = await signInWithPopup(auth, googleProvider);

        return credential;
    }

    async function signUpWithEmail(email: string, password: string) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        return credential;
    }

    async function signout() {
        await firebaseSignOut(auth);
        clearUser();
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Route Guard Auth Resolver
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function waitForAuth() {
        if (!isLoading) {
            return Promise.resolve(useAuthStore.getState().user);
        }

        return new Promise<UserType | null>((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(
                auth,
                async (currentUser) => {
                    try {
                        unsubscribe();

                        if (!currentUser) {
                            clearUser();
                            resolve(null);
                            return;
                        }

                        const supabaseUser = await syncSupabaseUser(currentUser);
                        resolve(supabaseUser);
                    } catch (error) {
                        reject(error);
                    }
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
            {isLoading ?
                <LoadingSpinner />
                :
                children
            }
        </AuthContext.Provider>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth Hook
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function useAuth() {
    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return auth;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Supabase User Sync
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const pendingSupabaseUserSyncs = new Map<string, Promise<UserType>>();

async function syncSupabaseUser(firebaseUser: User) {
    const pendingSync = pendingSupabaseUserSyncs.get(firebaseUser.uid);

    if (pendingSync) {
        return pendingSync;
    }

    const syncPromise = (async () => {
        const supabaseUser = await manageUsers.ensureUserExists(
            mapFirebaseUserToSupabaseUser(firebaseUser),
        );

        useAuthStore.getState().setUser(supabaseUser);

        return supabaseUser;
    })();

    pendingSupabaseUserSyncs.set(firebaseUser.uid, syncPromise);

    try {
        return await syncPromise;
    } finally {
        pendingSupabaseUserSyncs.delete(firebaseUser.uid);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Firebase To Supabase User Mapper
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

import {
    createContext,
    useContext,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";

export type AuthContextType = {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
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

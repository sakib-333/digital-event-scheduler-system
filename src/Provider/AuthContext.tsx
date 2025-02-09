import { createContext } from "react";
import { AuthInfo } from "./Interface/AuthInfo";

export const AuthContext = createContext<AuthInfo | null>(null);

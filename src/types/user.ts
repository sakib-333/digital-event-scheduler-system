export interface UserType {
    uid: string;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
    user_role?: "admin" | "morderator" | "general";
}
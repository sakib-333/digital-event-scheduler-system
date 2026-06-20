export const userTypeMap = {
    admin: "Admin",
    morderator: "morderator",
    general: "General"
} as const

export function getNameInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}
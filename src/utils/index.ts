import moment from "moment";

/*━━ User role label map ━━━━━━ */
export const userTypeMap = {
    admin: "Admin",
    morderator: "Moderator",
    moderator: "Moderator",
    general: "General"
} as const

/*━━ Get name initials method ━━━━━━ */
export function getNameInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}

/*━━ Upload image method ━━━━━━ */
export const uploadImage = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error("Image upload failed");
    }

    const data = await res.json();

    return data.secure_url ?? "";
};

/*━━ Validate BD phone number method ━━━━━━ */
export const isValidBDPhoneNumber = (phone: string): boolean => {

    const cleaned = phone.replace(/[\s\-()]/g, "");

    if (!cleaned) {
        return !!cleaned
    }

    const bdRegex = /^(?:\+?8801|01)[3-9]\d{8}$/;

    return bdRegex.test(cleaned);
};

/*━━ Format date ━━━━━━ */
export const formatJoinedDate = (createdAt: string | undefined) => {
    if (!createdAt) {
        return "Unknown";
    }

    return moment(createdAt).format("YYYY-MM-DD");
}

/*━━ Check new in this week ━━━━━━ */
export const isNewThisWeek = (createdAt: string | undefined) => {
    if (!createdAt) {
        return false;
    }

    const createdDate = new Date(createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return createdDate >= sevenDaysAgo;
}

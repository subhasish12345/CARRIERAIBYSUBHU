
import type { User } from "firebase/auth";
import type { UserProfile } from "@/types/user-profile";

export function getNewUserProfile(user?: User | null): UserProfile {
    const baseProfile: Omit<UserProfile, 'id' | 'email'> = {
        fullName: "",
        photoURL: null,
        phone: "",
        location: "",
        bio: "",
        github: "",
        linkedin: "",
        portfolio: "",
        instagram: "",
        twitter: "",
        aicteId: "",
        tenthMarks: { value: undefined, type: 'percentage' },
        twelfthMarks: { value: undefined, type: 'percentage' },
        diplomaMarks: { value: undefined, type: 'percentage' },
        graduationMarks: { value: undefined, type: 'percentage' },
        internships: [],
        certifications: [],
        courses: [],
        communicationSkills: "",
        languages: [],
        programmingLanguages: [],
        projects: [],
        tools: [],
    };

    if (user) {
        return {
            ...baseProfile,
            id: user.uid,
            email: user.email || '',
            fullName: user.displayName || '',
            photoURL: user.photoURL,
        };
    }

    return {
        ...baseProfile,
        id: '',
        email: '',
    };
}

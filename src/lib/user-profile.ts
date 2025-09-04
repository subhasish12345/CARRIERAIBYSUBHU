
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
        tenthMarks: { value: null, type: 'percentage' },
        twelfthMarks: { value: null, type: 'percentage' },
        diplomaMarks: { value: null, type: 'percentage' },
        graduationMarks: { value: null, type: 'percentage' },
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

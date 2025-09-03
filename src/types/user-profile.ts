
export interface UserProfile {
    id: string;
    email?: string;
    photoURL?: string | null;
    fullName?: string;
    phone?: string;
    location?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
    instagram?: string;
    twitter?: string;
    aicteId?: string;
    tenthMarks?: { value?: number; type: 'percentage' | 'cgpa' };
    twelfthMarks?: { value?: number; type: 'percentage' | 'cgpa' };
    diplomaMarks?: { value?: number; type: 'percentage' | 'cgpa' };
    graduationMarks?: { value?: number; type: 'percentage' | 'cgpa' };
    internships?: string[];
    certifications?: string[];
    courses?: string[];
    communicationSkills?: string;
    languages?: string[];
    programmingLanguages?: string[];
    projects?: string[];
    tools?: string[];
  }


import { z } from "zod";

export const UserProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    photoURL: z.string().url().nullish(),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    aicteId: z.string().optional(),
    tenthMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']) }).optional(),
    twelfthMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']) }).optional(),
    diplomaMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']) }).optional(),
    graduationMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']) }).optional(),
    internships: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    courses: z.array(z.string()).optional(),
    communicationSkills: z.string().optional(),
    languages: z.array(z.string()).optional(),
    programmingLanguages: z.array(z.string()).optional(),
    projects: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

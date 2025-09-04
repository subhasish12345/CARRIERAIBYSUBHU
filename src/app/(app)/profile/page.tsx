
'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/types/user-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getNewUserProfile } from "@/lib/user-profile";

const profileSchema = z.object({
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
  tenthMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']).default('percentage') }).optional(),
  twelfthMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']).default('percentage') }).optional(),
  diplomaMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']).default('percentage') }).optional(),
  graduationMarks: z.object({ value: z.coerce.number().optional(), type: z.enum(['percentage', 'cgpa']).default('percentage') }).optional(),
  internships: z.array(z.object({ value: z.string() })).optional(),
  certifications: z.array(z.object({ value: z.string() })).optional(),
  courses: z.array(z.object({ value: z.string() })).optional(),
  communicationSkills: z.string().optional(),
  languages: z.array(z.object({ value: z.string() })).optional(),
  programmingLanguages: z.array(z.object({ value: z.string() })).optional(),
  projects: z.array(z.object({ value: z.string() })).optional(),
  tools: z.array(z.object({ value: z.string() })).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: getNewUserProfile(),
  });
  
  const { fields: internshipFields, append: internshipAppend, remove: internshipRemove } = useFieldArray({ control: form.control, name: "internships" });
  const { fields: certificationFields, append: certificationAppend, remove: certificationRemove } = useFieldArray({ control: form.control, name: "certifications" });
  const { fields: courseFields, append: courseAppend, remove: courseRemove } = useFieldArray({ control: form.control, name: "courses" });
  const { fields: languageFields, append: languageAppend, remove: languageRemove } = useFieldArray({ control: form.control, name: "languages" });
  const { fields: plFields, append: plAppend, remove: plRemove } = useFieldArray({ control: form.control, name: "programmingLanguages" });
  const { fields: projFields, append: projAppend, remove: projRemove } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: toolFields, append: toolAppend, remove: toolRemove } = useFieldArray({ control: form.control, name: "tools" });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [router]);
  
  useEffect(() => {
    if (!user || initialDataLoaded) return;
    
    const docRef = doc(db, 'users', user.uid);
    const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;

            form.reset({
                ...getNewUserProfile(),
                ...profileData,
                internships: profileData.internships?.map((value) => ({ value })) || [],
                certifications: profileData.certifications?.map((value) => ({ value })) || [],
                courses: profileData.courses?.map((value) => ({ value })) || [],
                languages: profileData.languages?.map((value) => ({ value })) || [],
                programmingLanguages: profileData.programmingLanguages?.map((value) => ({ value })) || [],
                projects: profileData.projects?.map((value) => ({ value })) || [],
                tools: profileData.tools?.map((value) => ({ value })) || [],
            });
        }
        setInitialDataLoaded(true);
    }, (error) => {
        console.error("Error listening to profile changes:", error);
        setInitialDataLoaded(true);
    });

    return () => unsubscribeSnapshot();
  }, [user, initialDataLoaded, form]);



  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to update your profile." });
      return;
    }

    setIsSaving(true);
    try {
      // Helper function to sanitize marks data
      const sanitizeMarks = (marks: { value?: number, type: 'percentage' | 'cgpa' } | undefined) => {
        if (!marks || marks.value === undefined || isNaN(marks.value)) {
            return { value: null, type: marks?.type || 'percentage' };
        }
        return marks;
      };

      const profileToSave: UserProfile = {
          ...getNewUserProfile(),
          ...data,
          id: user.uid,
          email: user.email || '',
          photoURL: user.photoURL || null,
          tenthMarks: sanitizeMarks(data.tenthMarks),
          twelfthMarks: sanitizeMarks(data.twelfthMarks),
          diplomaMarks: sanitizeMarks(data.diplomaMarks),
          graduationMarks: sanitizeMarks(data.graduationMarks),
          internships: data.internships?.map(item => item.value).filter(Boolean) || [],
          certifications: data.certifications?.map(item => item.value).filter(Boolean) || [],
          courses: data.courses?.map(item => item.value).filter(Boolean) || [],
          languages: data.languages?.map(item => item.value).filter(Boolean) || [],
          programmingLanguages: data.programmingLanguages?.map(item => item.value).filter(Boolean) || [],
          projects: data.projects?.map(item => item.value).filter(Boolean) || [],
          tools: data.tools?.map(item => item.value).filter(Boolean) || [],
      };
     
      await setDoc(doc(db, "users", user.uid), profileToSave, { merge: true });

      toast({ title: "Update successfully", description: "Your profile has been updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile. Please try again." });
    } finally {
        setIsSaving(false);
    }
  };

  const renderArrayFields = (
    label: string,
    fields: any[],
    append: (val: { value: string }) => void,
    remove: (index: number) => void,
    name: "internships" | "certifications" | "courses" | "languages" | "programmingLanguages" | "projects" | "tools"
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input {...form.register(`${name}.${index}.value` as const)} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add
      </Button>
    </div>
  );
  
  const renderMarksField = (
    label: string,
    name: "tenthMarks" | "twelfthMarks" | "diplomaMarks" | "graduationMarks"
  ) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
            <Controller
              control={form.control}
              name={`${name}.value`}
              render={({ field }) => (
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Marks"
                  {...field}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                  value={field.value ?? ""}
                />
              )}
            />
            <Controller
                control={form.control}
                name={`${name}.type`}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} defaultValue="percentage">
                        <SelectTrigger>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="cgpa">CGPA</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    </div>
  );

  if (loading) {
      return (
          <div className="flex items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Keep your information up to date to get the best recommendations.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...form.register("fullName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea id="bio" {...form.register("bio")} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Professional & Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" {...form.register("github")} placeholder="https://github.com/username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" {...form.register("linkedin")} placeholder="https://linkedin.com/in/username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input id="portfolio" {...form.register("portfolio")} placeholder="https://your-portfolio.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter (X)</Label>
              <Input id="twitter" {...form.register("twitter")} placeholder="https://twitter.com/username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" {...form.register("instagram")} placeholder="https://instagram.com/username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aicteId">AICTE ID</Label>
              <Input id="aicteId" {...form.register("aicteId")} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderMarksField("10th Marks", "tenthMarks")}
                {renderMarksField("12th Marks", "twelfthMarks")}
                {renderMarksField("Diploma Marks", "diplomaMarks")}
                {renderMarksField("Graduation Marks", "graduationMarks")}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Experience & Learning</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderArrayFields("Internships", internshipFields, internshipAppend, internshipRemove, "internships")}
                {renderArrayFields("Certifications", certificationFields, certificationAppend, certificationRemove, "certifications")}
                {renderArrayFields("Courses", courseFields, courseAppend, courseRemove, "courses")}
            </a-card-content>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {renderArrayFields("Programming Languages", plFields, plAppend, plRemove, "programmingLanguages")}
                 {renderArrayFields("Languages", languageFields, languageAppend, languageRemove, "languages")}
                 {renderArrayFields("Projects", projFields, projAppend, projRemove, "projects")}
                 {renderArrayFields("Tools", toolFields, toolAppend, toolRemove, "tools")}
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="communicationSkills">Communication Skills</Label>
                    <Textarea id="communicationSkills" {...form.register("communicationSkills")} />
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-center py-8">
          <Button type="submit" disabled={isSaving || !initialDataLoaded} size="lg">
             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}

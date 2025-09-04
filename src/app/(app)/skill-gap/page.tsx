
"use client";

import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, GraduationCap, Sparkles } from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/types/user-profile";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  skillGapAnalysis,
  type SkillGapAnalysisInput,
  type SkillGapAnalysisOutput,
} from "@/ai/flows/skill-gap-analysis";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  userSkills: z.string().min(1, "Please enter your current skills."),
  desiredCareerPath: z.string().min(1, "Please enter your desired career."),
});

export default function SkillGapAnalysisPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SkillGapAnalysisOutput | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSkills: "",
      desiredCareerPath: "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userProfile = docSnap.data() as UserProfile;
          const skills = [
            ...(userProfile.programmingLanguages || []),
            ...(userProfile.tools || []),
            ...(userProfile.languages || []),
            ...(userProfile.courses || []),
            ...(userProfile.certifications || []),
          ].filter(Boolean);
          form.setValue('userSkills', skills.join(', '));
        }
      }
      setLoadingProfile(false);
    });
    return () => unsubscribe();
  }, [form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const analysisResult = await skillGapAnalysis(values as SkillGapAnalysisInput);
        setResult(analysisResult);
      } catch (error) {
        console.error("Error during skill gap analysis:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to analyze skill gaps. Please try again.",
        });
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
          <CardDescription>
            Your current skills are pre-filled from your profile. Enter your desired career to find out what skills you need to land your dream job.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Current Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JavaScript, React, Node.js" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredCareerPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Career Path</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending || loadingProfile}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : loadingProfile ? (
                   <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Profile...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Analyze Skill Gaps
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center">
        {(isPending || loadingProfile) && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="font-semibold">{loadingProfile ? "Loading your profile..." : "Finding skill gaps..."}</h3>
                <p className="text-sm text-muted-foreground">
                  {loadingProfile ? "Please wait while we fetch your skills." : "Our AI is comparing your skills to your career goal."}
                </p>
            </div>
        )}
        {result && !isPending && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Your Learning Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Identified Skill Gaps</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.skillGaps}</p>
              </div>
              <div>
                <h3 className="font-semibold">Recommended Learning Resources</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {result.recommendedResources}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

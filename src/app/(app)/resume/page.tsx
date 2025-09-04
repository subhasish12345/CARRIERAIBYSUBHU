
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Loader2, FileUp, Sparkles } from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  optimizeResume,
  type OptimizeResumeOutput,
} from "@/ai/flows/resume-optimization";
import type { UserProfile } from "@/types/user-profile";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function ResumeOptimizerPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<OptimizeResumeOutput | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [desiredCareerPath, setDesiredCareerPath] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      }
      setLoadingProfile(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload your resume to optimize.",
      });
      return;
    }
    if (!desiredCareerPath) {
      toast({
        variant: "destructive",
        title: "No career path",
        description: "Please enter your desired career path.",
      });
      return;
    }
    if (!userProfile) {
       toast({
        variant: "destructive",
        title: "Profile not loaded",
        description: "Your user profile could not be loaded. Please try again.",
      });
      return;
    }

    setResult(null);
    startTransition(async () => {
      try {
        const resumeDataUri = await toBase64(selectedFile);
        const optimizationResult = await optimizeResume({ resumeDataUri, userProfile, desiredCareerPath });
        setResult(optimizationResult);
      } catch (error) {
        console.error("Error optimizing resume:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to optimize resume. Please try again.",
        });
      }
    });
  };

  const isSubmitDisabled = isPending || loadingProfile || !selectedFile || !desiredCareerPath;

  return (
    <div className="grid gap-6 lg:grid-cols-2 animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle>Strategic Resume Optimizer</CardTitle>
          <CardDescription>
            Upload your resume, specify your dream job, and our AI will enhance it using your full profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="career-path">Desired Career Path</Label>
              <Input
                id="career-path"
                placeholder="e.g., Senior Frontend Developer"
                value={desiredCareerPath}
                onChange={(e) => setDesiredCareerPath(e.target.value)}
                disabled={isPending || loadingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-upload">Upload Resume</Label>
              <div
                className="flex items-center justify-center w-full"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload your resume"
              >
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileUp className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (MAX. 5MB)</p>
                  </div>
                  <Input
                    id="resume-upload"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </div>
              </div>
              {fileName && (
                <p className="text-sm text-muted-foreground">
                  Selected file: <span className="font-medium text-foreground">{fileName}</span>
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...</>
              ) : loadingProfile ? (
                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Profile...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Optimize Resume</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center">
        {isPending && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="font-semibold">Optimizing your resume...</h3>
                <p className="text-sm text-muted-foreground">Our AI is polishing your resume to perfection.</p>
            </div>
        )}
        {result && (
          <Card className="w-full h-full max-h-[80vh]">
            <CardHeader>
              <CardTitle>Your Enhanced Resume</CardTitle>
              <CardDescription>
                This AI-enhanced resume is tailored to your desired career path.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <pre className="p-4 h-[calc(80vh-120px)] overflow-auto rounded-md bg-muted text-sm whitespace-pre-wrap font-sans">
                {result.optimizedResume}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  assessCareerPaths,
  type CareerAssessmentOutput,
} from "@/ai/flows/ai-career-assessment";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/user-profile";
import { useEffect } from "react";
import Link from "next/link";

export default function CareerAssessmentPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CareerAssessmentOutput | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      }
      setLoadingProfile(false);
    });
    return () => unsubscribe();
  }, []);

  function handleAssess() {
    if (!userProfile) {
      toast({
        variant: "destructive",
        title: "Profile not found",
        description: "Please complete your profile first.",
      });
      return;
    }

    setResult(null);
    startTransition(async () => {
      try {
        const assessmentResult = await assessCareerPaths(userProfile);
        setResult(assessmentResult);
      } catch (error) {
        console.error("Error during career assessment:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to get career assessment. Please try again.",
        });
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Career Assessment</CardTitle>
          <CardDescription>
            Get career recommendations based on your profile data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <p>
            Our AI will analyze the information in your profile—skills, experience, projects, and more—to suggest potential career paths for you.
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure your <Link href="/profile" className="underline text-primary">profile</Link> is up-to-date for the best recommendations.
          </p>
          <Button onClick={handleAssess} disabled={isPending || loadingProfile} size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assessing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      <div className="flex items-start justify-center">
        {(isPending || loadingProfile) && (
            <div className="flex flex-col items-center gap-4 text-center mt-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="font-semibold">{loadingProfile ? "Loading your profile..." : "Analyzing your profile..."}</h3>
                <p className="text-sm text-muted-foreground">
                  {loadingProfile ? "Please wait while we fetch your data." : "Our AI strategist is crafting your personalized career roadmap."}
                </p>
            </div>
        )}
        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Your Career Recommendations
              </CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent>
               <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {result.careerPaths.map((path, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold">{path.title}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-base">Why it's a good fit:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{path.reasoning}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base">Your Next Steps:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{path.nextSteps}</p>
                      </div>
                       <div>
                        <h4 className="font-semibold text-base">Growth Potential:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{path.growthPotential}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

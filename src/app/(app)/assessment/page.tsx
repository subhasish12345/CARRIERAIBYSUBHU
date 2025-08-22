"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  assessCareerPaths,
  type CareerAssessmentInput,
  type CareerAssessmentOutput,
} from "@/ai/flows/ai-career-assessment";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  skills: z.string().min(1, "Please enter at least one skill."),
  interests: z.string().min(1, "Please enter at least one interest."),
  experience: z.string().min(1, "Please summarize your experience."),
  personalityTraits: z.string().min(1, "Please list some personality traits."),
});

export default function CareerAssessmentPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CareerAssessmentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: "",
      interests: "",
      experience: "",
      personalityTraits: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const assessmentResult = await assessCareerPaths(values as CareerAssessmentInput);
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
            Tell us about yourself, and our AI will suggest potential career paths for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Python, Graphic Design, Project Management" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your skills, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology, Art, Helping Others" {...field} />
                    </FormControl>
                    <FormDescription>
                      What are you passionate about? Separate by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="personalityTraits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personality Traits</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Creative, Analytical, Team-player" {...field} />
                    </FormControl>
                    <FormDescription>
                      Describe your personality. Separate by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Briefly describe your professional background..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
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
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center">
        {isPending && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="font-semibold">Analyzing your profile...</h3>
                <p className="text-sm text-muted-foreground">Our AI is finding the best career paths for you.</p>
            </div>
        )}
        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Your Career Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Suggested Career Paths</h3>
                <p className="text-sm">{result.careerPaths}</p>
              </div>
              <div>
                <h3 className="font-semibold">Reasoning</h3>
                <p className="text-sm text-muted-foreground">
                  {result.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

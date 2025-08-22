"use client";

import { useState, useTransition, useRef } from "react";
import { Loader2, FileUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  optimizeResume,
  type OptimizeResumeOutput,
} from "@/ai/flows/resume-optimization";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    setResult(null);
    startTransition(async () => {
      try {
        const resumeDataUri = await toBase64(selectedFile);
        const optimizationResult = await optimizeResume({ resumeDataUri });
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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Resume Optimizer</CardTitle>
          <CardDescription>
            Upload your resume and our AI will help you improve it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="resume-upload" className="font-medium text-sm">Upload Resume</label>
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
            <Button type="submit" disabled={isPending || !selectedFile}>
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...</>
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
          <Card className="w-full h-full max-h-[70vh]">
            <CardHeader>
              <CardTitle>Optimized Resume</CardTitle>
              <CardDescription>
                Your AI-enhanced resume is ready. Copy the text below.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <pre className="p-4 h-[calc(70vh-120px)] overflow-auto rounded-md bg-muted text-sm whitespace-pre-wrap font-sans">
                {result.optimizedResume}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

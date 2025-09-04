'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { parseJobDescription, ParseJobOutput } from '@/ai/flows/job-parser';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldCheck, Sparkles, FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [jobText, setJobText] = useState('');
  const [isParsing, startParsing] = useTransition();
  const [isPosting, startPosting] = useTransition();
  const [parsedJob, setParsedJob] = useState<ParseJobOutput | null>(null);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.email !== 'sadmisn@gmail.com') {
    router.replace('/dashboard');
    return (
      <div className="flex items-center justify-center h-full">
        <p>Access Denied. Redirecting...</p>
      </div>
    );
  }

  const handleParse = () => {
    if (!jobText.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Job description cannot be empty.' });
      return;
    }

    setParsedJob(null);
    startParsing(async () => {
      try {
        const result = await parseJobDescription({ jobText });
        setParsedJob(result);
        toast({ title: 'Parsing Complete', description: 'Review the extracted details below.' });
      } catch (error) {
        console.error('Error parsing job:', error);
        toast({ variant: 'destructive', title: 'Parsing Failed', description: 'Could not extract job details. Please check the text.' });
      }
    });
  };

  const handlePost = () => {
    if (!parsedJob) {
      toast({ variant: 'destructive', title: 'Error', description: 'No parsed job to post.' });
      return;
    }

    startPosting(async () => {
      try {
        await addDoc(collection(db, 'jobs'), parsedJob);
        toast({ title: 'Job Posted!', description: 'The new job listing is now live.' });
        setJobText('');
        setParsedJob(null);
      } catch (error) {
        console.error('Error posting job:', error);
        toast({ variant: 'destructive', title: 'Posting Failed', description: 'Could not save the job to the database.' });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">Manage job opportunities.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Paste Job Description</CardTitle>
            <CardDescription>
              Copy and paste the entire job posting text into the box below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste job details here..."
              className="min-h-[250px] font-mono text-xs"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              disabled={isParsing || isPosting}
            />
            <Button onClick={handleParse} disabled={isParsing || isPosting || !jobText}>
              {isParsing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Parse Job Details
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className={!parsedJob && !isParsing ? 'opacity-50' : ''}>
          <CardHeader>
            <CardTitle>2. Review & Post</CardTitle>
            <CardDescription>
              Verify the extracted information, then post the job.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isParsing && (
              <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is extracting details...</p>
              </div>
            )}
            {parsedJob && (
              <div className="space-y-4">
                <div>
                  <Label>Job Title</Label>
                  <Input value={parsedJob.title} disabled />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input value={parsedJob.company} disabled />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={parsedJob.location} disabled />
                </div>
                <div>
                  <Label>Apply Link</Label>
                  <Input value={parsedJob.applyLink} disabled />
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 rounded-md border p-2 min-h-[40px]">
                    {parsedJob.tags?.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
                <Button onClick={handlePost} disabled={isPosting}>
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <FileUp className="mr-2 h-4 w-4" />
                      Post Job
                    </>
                  )}
                </Button>
              </div>
            )}
            {!parsedJob && !isParsing && (
               <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4 text-center text-muted-foreground">
                  <p>Parsed job details will appear here for review.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { parseJobDescription, ParseJobOutput } from '@/ai/flows/job-parser';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldCheck, Sparkles, FileUp, Database } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { JobListing } from '@/types/job-listing';


const initialJobPostings: Omit<JobListing, 'id'>[] = [
  {
    title: "Multiple Roles",
    company: "HCLTech",
    location: "Across India",
    tags: ["Graduate", "Post Graduate", "4.5-18 LPA"],
    applyLink: "https://tinyurl.com/bdd45379",
  },
  {
    title: "National Qualifier Test (NQT) 2025",
    company: "TCS",
    location: "Across India",
    tags: ["2021-2027 Batch", "Any Degree", "Up to 19 LPA"],
    applyLink: "https://yt.openinapp.co/0m6rt",
  },
  {
    title: "Software Application Development Apprentice",
    company: "Google",
    location: "Bengaluru, Hyderabad, Gurugram",
    tags: ["Apprentice", "Freshers", "Bachelor's Degree"],
    applyLink: "https://freshershunt.in/google-software-application-development-apprenticeship/",
  },
  {
    title: "Data Analytics Apprentice",
    company: "Google",
    location: "Bengaluru, Hyderabad, Gurugram",
    tags: ["Apprentice", "Data Analytics", "Freshers"],
    applyLink: "https://freshershunt.in/google-data-analytics-apprenticeship/",
  },
  {
    title: "Web Solutions Engineer Intern",
    company: "Google",
    location: "Hyderabad",
    tags: ["Internship", "Web Solutions", "Freshers"],
    applyLink: "https://freshershunt.in/google-internship-web-solutions-engineer-intern/",
  },
  {
    title: "Multiple Roles",
    company: "Mphasis",
    location: "Across India",
    tags: ["Graduate", "Post Graduate", "4.5-22 LPA"],
    applyLink: "https://pdlink.in/4omWEqn",
  },
  {
    title: "New Grad Software Engineer",
    company: "Stripe",
    location: "Bengaluru",
    tags: ["2026 Batch", "New Grad", "₹61.3 LPA"],
    applyLink: "https://freshershunt.in/stripe-careers-2026-software-engineering-new-grad/",
  },
  {
    title: "Software Engineering AMTS",
    company: "Salesforce",
    location: "Bangalore & Hyderabad",
    tags: ["2026 Batch", "Freshers", "₹15-36 LPA"],
    applyLink: "https://freshershunt.in/salesforce-off-campus-drive-2025/",
  },
  {
    title: "Software Engineer Intern",
    company: "Stripe",
    location: "Bengaluru",
    tags: ["Internship", "Recent Batches", "Freshers"],
    applyLink: "https://freshershunt.in/stripe-internship-software-engineer-intern/",
  },
  {
    title: "Software Engineer - Summer Internship",
    company: "CISCO",
    location: "Bangalore",
    tags: ["2027 Pass out", "Internship", "₹41K/month"],
    applyLink: "https://freshershunt.in/cisco-internship-2025/",
  },
  {
    title: "Apprenticeship 2025",
    company: "ISRO",
    location: "Hyderabad",
    tags: ["Diploma", "BE/B.Tech", "Any Graduate"],
    applyLink: "https://freshershunt.in/isro-apprentices-2025/",
  },
  {
    title: "Software Engineer",
    company: "HCL Tech",
    location: "Hyderabad",
    tags: ["0-2 Years Exp", "4-8 LPA", "Software"],
    applyLink: "https://tinyurl.com/42c457hc",
  },
  {
    title: "Software Development Engineer I",
    company: "Airtel",
    location: "Gurugram",
    tags: ["0-1 Year Exp", "10-15 LPA", "SDE"],
    applyLink: "https://tinyurl.com/45fjjjpd",
  },
  {
    title: "Graduate Engineer Trainee",
    company: "HCLTech",
    location: "PAN India",
    tags: ["2025 Batch", "Freshers", "₹5 LPA"],
    applyLink: "https://freshershunt.in/hcltech-hiring-graduate-engineer-trainee/",
  },
  {
    title: "Analyst - Data Science",
    company: "American Express",
    location: "Bengaluru & Gurgaon",
    tags: ["Bachelors/Masters", "Freshers", "₹4-7 LPA"],
    applyLink: "https://tinyurl.com/bdd45379",
  },
];


export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [jobText, setJobText] = useState('');
  const [isParsing, startParsing] = useTransition();
  const [isPosting, startPosting] = useTransition();
  const [isSeeding, startSeeding] = useTransition();
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

  const handleSeed = () => {
    startSeeding(async () => {
        const jobsCollection = collection(db, 'jobs');
        const existingJobsSnapshot = await getDocs(jobsCollection);
        if (!existingJobsSnapshot.empty) {
            toast({
                variant: 'destructive',
                title: 'Seeding Aborted',
                description: 'Database already contains job listings. Seeding is a one-time operation.',
            });
            return;
        }

        toast({
            title: 'Seeding Started',
            description: `Adding ${initialJobPostings.length} initial jobs. This may take a moment...`,
        });

        const batch = writeBatch(db);
        
        for (const job of initialJobPostings) {
            const docRef = doc(collection(db, 'jobs')); 
            batch.set(docRef, job);
        }
        
        try {
            await batch.commit();
            toast({
                title: 'Seeding Complete!',
                description: `${initialJobPostings.length} jobs added successfully.`,
            });
        } catch (error) {
            console.error('Error committing job seed batch:', error);
            toast({
                variant: 'destructive',
                title: 'Seeding Failed',
                description: 'An error occurred while saving the jobs to the database.',
            });
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
      
      <Card>
        <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>
                Populate the database with the initial set of 15 job listings. This is a one-time operation and should only be run if the job board is empty.
            </CardDescription>
        </CardHeader>
        <CardFooter>
            <Button onClick={handleSeed} disabled={isSeeding}>
                {isSeeding ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...</>
                ) : (
                    <><Database className="mr-2 h-4 w-4" /> Seed Initial Jobs</>
                )}
            </Button>
        </CardFooter>
      </Card>


      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Paste Job Description</CardTitle>
            <CardDescription>
              Copy and paste the entire job posting text into the box below to add a new job.
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

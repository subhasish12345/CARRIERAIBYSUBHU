
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialJobPostings = [
    `𝗛𝗖𝗟𝗧𝗲𝗰𝗵 𝗠𝗲𝗴𝗮 𝗥𝗲𝗰𝗿𝘂𝗶𝘁𝗺𝗲𝗻𝘁 | 𝗔𝗽𝗽𝗹𝘆 𝗡𝗼𝘄 😍 \n\nRole :- Hiring For Multiple Roles \n\nQualification:- Graduate/Post Graduate \n\nJob Location:- Across India \n\nSalary Range :- 4.5 To 18LPA\n\n𝗔𝗽𝗽𝗹𝘆 𝗡𝗼𝘄👇 :- \n\n https://tinyurl.com/bdd45379`,
    `TCS National Qualifier Test (NQT) 2025\n\n🎯 3000+ Corporates like TCS, TVS Motor, Jio Platform, Asian Paints and more\n\n🎓 Qualification: B.E/B.Tech/Diploma/Any Degree\n\n🔸 Batch: 2021, 2022, 2023, 2024, 2025, 2026, 2027\n\n🟡 Total Posts: 100K+ Offers (till now)\n\n💰 Highest CTC: Rs. 19 LPA (till now)\n\n📍Job Location: Across India\n\n ⏳ Last Date: 18th September, 2025\n\n 🖊 Test Date: 1st October, 2025\n\n✅ Apply At: https://yt.openinapp.co/0m6rt`,
    `🚨 𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝗽𝗽𝗿𝗲𝗻𝘁𝗶𝗰𝗲𝘀𝗵𝗶𝗽 & 𝗜𝗻𝘁𝗲𝗿𝗻𝘀𝗵𝗶𝗽 𝟮𝟬𝟮𝟱 – 𝗔𝗽𝗽𝗹𝘆 𝗡𝗼𝘄! 🚨\n\n𝗦𝗼𝗳𝘁𝘄𝗮𝗿𝗲 𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗺𝗲𝗻𝘁 𝗔𝗽𝗽𝗿𝗲𝗻𝘁𝗶𝗰𝗲\n• 👨🏻‍💻 Job Role: Software Application Development Apprentice\n• 🎓 Qualification: Bachelor’s Degree / Equivalent Experience\n• 🔹 Batch: Recent Graduates / Freshers\n• 📍 Location: Bengaluru, Hyderabad, Gurugram\n• 🔺 Last Date: Apply ASAP\n🔗 𝗔𝗽𝗽𝗹𝘆 @: https://freshershunt.in/google-software-application-development-apprenticeship/`,
    `𝗗𝗮𝘁𝗮 𝗔𝗻𝗮𝗹𝘆𝘁𝗶𝗰𝘀 𝗔𝗽𝗽𝗿𝗲𝗻𝘁𝗶𝗰𝗲\n• 👨🏻‍💻 Job Role: Data Analytics Apprentice\n• 🎓 Qualification: Bachelor’s Degree / Equivalent Experience\n• 🔹 Batch: Recent Graduates / Freshers\n• 📍 Location: Bengaluru, Hyderabad, Gurugram\n• 🔺 Last Date: Apply ASAP\n🔗  𝗔𝗽𝗽𝗹𝘆 @: https://freshershunt.in/google-data-analytics-apprenticeship/`,
    `𝗪𝗲𝗯 𝗦𝗼𝗹𝘂𝘁𝗶𝗼𝗻𝘀 𝗘𝗻𝗴𝗶𝗻𝗲𝗲𝗿 𝗜𝗻𝘁𝗲𝗿𝗻\n• 👨🏻‍💻 Job Role: Web Solutions Engineer Intern\n• 🎓 Qualification: Bachelor’s Degree / Equivalent Experience\n• 🔹 Batch: Recent Graduates / Freshers\n• 📍 Location: Hyderabad\n• 🔺 Last Date: Apply ASAP\n🔗  𝗔𝗽𝗽𝗹𝘆 @: https://freshershunt.in/google-internship-web-solutions-engineer-intern/`,
    `𝗠𝗽𝗵𝗮𝘀𝗶𝘀 𝗠𝗲𝗴𝗮 𝗥𝗲𝗰𝗿𝘂𝗶𝘁𝗺𝗲𝗻𝘁 – 𝗔𝗽𝗽𝗹𝘆 𝗡𝗼𝘄! 😍 \n\nRole :- Multiple Roles \n\nQualification:- Graduate/Post Graduate\n\nSalary Range:- 4.5 To 22 LPA\n\nJob Location:- Across India\n\n𝗔𝗽𝗽𝗹𝘆 𝗡𝗼𝘄👇 :- \n\nhttps://pdlink.in/4omWEqn`,
    `Stripe hiring for New Grad Software Engineer\n\nLocation : Bengaluru\n\nQualification: Bachelor’s, Master’s, or PhD degree\n\nExperience:  Freshers\n\nBatch: 2026\n\nSalary: ₹61.3 LPA (Via AmbitionBox)\n\n✅ 𝗔𝗽𝗽𝗹𝘆 𝗟𝗶𝗻𝗸: https://freshershunt.in/stripe-careers-2026-software-engineering-new-grad/`,
    `🚨 Salesforce is hiring for Software Engineering AMTS 💻\n\n📍 Location: Bangalore & Hyderabad \n\n🎓 Qualification: B.E/ B.Tech graduating in 2026 in Computer Science, Electrical, Electronics, or equivalent fields with specialization in computer science. \n\n👨‍💻 Experience: Fresher\n\n🏫 Batch: 2026\n\n⏰ End Date: September 4, 2025 (7 hours left to apply)\n\n💰 Salary: ₹15 to 36 LPA (Expected)\n\n✅ Apply Link:  https://freshershunt.in/salesforce-off-campus-drive-2025/`,
    `Stripe hiring for Software Engineer Intern\n\nLocation : Bengaluru\n\nQualification: Bachelor’s, Master’s, or PhD degree\n\nExperience:  Freshers\n\nBatch: Recent Batches\n\n✅ 𝗔𝗽𝗽𝗹𝘆 𝗟𝗶𝗻𝗸: https://freshershunt.in/stripe-internship-software-engineer-intern/`,
    `🚀 𝗖𝗜𝗦𝗖𝗢 𝗜𝗡𝗧𝗘𝗥𝗡𝗦𝗛𝗜𝗣 𝟮𝟬𝟮𝟱 – 𝗦𝗢𝗙𝗧𝗪𝗔𝗥𝗘 𝗘𝗡𝗚𝗜𝗡𝗘𝗘𝗥 🚀\n\n💼 𝗥𝗼𝗹𝗲: Software Engineer - (Summer Internship) - India Engineering\n\n🎯 𝗘𝗹𝗶𝗴𝗶𝗯𝗶𝗹𝗶𝘁𝘆:\n• 2027 pass out ONLY\n• All degree/branches welcome\n• No active backlog/arrears\n• Bachelor’s or Master’s degree\n\n💰 𝗦𝗮𝗹𝗮𝗿𝘆: ₹41K per month\n📍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: Bangalore\n⏰ 𝗔𝗽𝗽𝗹𝘆: ASAP\n\n🔗 𝗔𝗽𝗽𝗹𝘆 𝗛𝗲𝗿𝗲: https://freshershunt.in/cisco-internship-2025/`,
    `🚀 𝗜𝗦𝗥𝗢 𝗔𝗽𝗽𝗿𝗲𝗻𝘁𝗶𝗰𝗲𝘀 𝟮𝟬𝟮𝟱 𝗛𝗶𝗿𝗶𝗻𝗴 🚀\n\n📍 Location: Hyderabad\n🎓 Qualification: Diploma, BE/B.Tech, Any Graduate degree\n💰 Stipend: ₹ 8000 – Rs. 9000\n🗓 Last Date: 11.09.2025\n\n👉 𝗔𝗽𝗽𝗹𝘆 𝗡𝗼𝘄: https://freshershunt.in/isro-apprentices-2025/`,
    `HCL Tech – Software Engineer\nLocation: Hyderabad\nSalary: 4 – 8 LPA\nExperience: 0 – 2 Years\nApply: https://tinyurl.com/42c457hc`,
    `Airtel – Software Development Engineer I\nLocation: Gurugram\nSalary: 10 – 15 LPA\nExperience: 0 – 1 Year\nApply: https://tinyurl.com/45fjjjpd`,
    `🚨 𝗛𝗖𝗟𝗧𝗲𝗰𝗵 𝗛𝗶𝗿𝗶𝗻𝗴 𝗚𝗿𝗮𝗱𝘂𝗮𝘁𝗲 𝗘𝗻𝗴𝗶𝗻𝗲𝗲𝗿 𝗧𝗿𝗮𝗶𝗻𝗲𝗲!🚨\n\nRole: Graduate Engineer Trainee\n\nQualification: BTech / BE (CSE-IT, EEE / ECE / EIE) Only\n\nExperience: Freshers\n\nBatch: 2025\n\nSalary: ₹5 LPA (Expected)\n\nGreat opportunity for 2025 batch engineering graduates!\n\n✅ 𝗔𝗽𝗽𝗹𝘆 𝗟𝗶𝗻𝗸:  https://freshershunt.in/hcltech-hiring-graduate-engineer-trainee/`,
    `American Express is hiring Analyst-Data Science\n\nLocation: Bengaluru & Gurgaon\n\nQualification: Bachelors / Masters\n\nBatch: Recent Batches\n\nExperience: Freshers & Experienced\n\nSalary: ₹ 4 to 7 LPA (Expected)\n\n✅ 𝗔𝗽𝗽𝗹𝘆 𝗟𝗶𝗻𝗸:  https://tinyurl.com/bdd45379`,
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
            description: `Parsing and adding ${initialJobPostings.length} initial jobs. This may take a moment...`,
        });

        const batch = writeBatch(db);
        let successCount = 0;
        let failCount = 0;

        for (const jobText of initialJobPostings) {
            try {
                const parsedJob = await parseJobDescription({ jobText });
                const docRef = doc(collection(db, 'jobs')); 
                batch.set(docRef, parsedJob);
                successCount++;
            } catch (error) {
                console.error('Failed to parse one of the initial jobs:', jobText, error);
                failCount++;
            }
        }
        
        try {
            await batch.commit();
            toast({
                title: 'Seeding Complete!',
                description: `${successCount} jobs added successfully. ${failCount} jobs failed to parse.`,
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

    
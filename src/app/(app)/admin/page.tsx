
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs, writeBatch, doc, onSnapshot, deleteDoc, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { parseJobDescription, ParseJobOutput } from '@/ai/flows/job-parser';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldCheck, Sparkles, FileUp, Database, BookOpen, Trash2, Building2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { JobListing } from '@/types/job-listing';
import type { Course } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';


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

const initialCourseState: Omit<Course, 'id'> = {
  title: '',
  category: '',
  description: '',
  link: '',
  imageUrl: ''
};

const getCompanyInitials = (name: string) => {
    if (!name) return "";
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return initials;
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [jobText, setJobText] = useState('');
  const [isParsing, startParsing] = useTransition();
  const [isPostingJob, startPostingJob] = useTransition();
  const [isSeeding, startSeeding] = useTransition();
  const [parsedJob, setParsedJob] = useState<ParseJobOutput | null>(null);

  const [course, setCourse] = useState(initialCourseState);
  const [isPostingCourse, startPostingCourse] = useTransition();

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return; 
    }
    if (!user || user.email !== 'sadmisn@gmail.com') {
      router.replace('/dashboard');
    } else {
      setIsAuthorized(true);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!isAuthorized) return;
    
    const jobsQuery = query(collection(db, "jobs"));
    const jobsUnsubscribe = onSnapshot(jobsQuery, (snapshot) => {
        const jobsData: JobListing[] = [];
        snapshot.forEach((doc) => {
            jobsData.push({ id: doc.id, ...doc.data() } as JobListing);
        });
        setJobs(jobsData);
        setLoadingJobs(false);
    }, (error) => {
        console.error("Error fetching jobs:", error);
        setLoadingJobs(false);
    });

    const coursesQuery = query(collection(db, "courses"));
    const coursesUnsubscribe = onSnapshot(coursesQuery, (snapshot) => {
        const coursesData: Course[] = [];
        snapshot.forEach((doc) => {
            coursesData.push({ id: doc.id, ...doc.data() } as Course);
        });
        setCourses(coursesData);
        setLoadingCourses(false);
    }, (error) => {
        console.error("Error fetching courses:", error);
        setLoadingCourses(false);
    });

    return () => {
        jobsUnsubscribe();
        coursesUnsubscribe();
    };
  }, [isAuthorized]);

  if (authLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4">Verifying access...</p>
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

  const handlePostJob = () => {
    if (!parsedJob) {
      toast({ variant: 'destructive', title: 'Error', description: 'No parsed job to post.' });
      return;
    }

    startPostingJob(async () => {
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

        try {
            const batch = writeBatch(db);
            initialJobPostings.forEach(job => {
                const newJobRef = doc(jobsCollection);
                batch.set(newJobRef, job);
            });
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
  
  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCourse(prev => ({...prev, [id]: value}));
  };

  const handlePostCourse = () => {
    if(!course.title || !course.category || !course.description || !course.link || !course.imageUrl) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all course fields.' });
        return;
    }
     startPostingCourse(async () => {
      try {
        await addDoc(collection(db, 'courses'), course);
        toast({ title: 'Course Posted!', description: 'The new course is now live.' });
        setCourse(initialCourseState);
      } catch (error) {
        console.error('Error posting course:', error);
        toast({ variant: 'destructive', title: 'Posting Failed', description: 'Could not save the course to the database.' });
      }
    });
  };

  const handleDelete = async (collectionName: string, id: string) => {
    setIsDeleting(id);
    try {
        await deleteDoc(doc(db, collectionName, id));
        toast({
            title: 'Success',
            description: `${collectionName === 'jobs' ? 'Job' : 'Course'} deleted successfully.`,
        });
    } catch (error) {
        console.error(`Error deleting ${collectionName}:`, error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to delete ${collectionName === 'jobs' ? 'job' : 'course'}.`,
        });
    } finally {
        setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">Manage job opportunities and learning resources.</p>
        </div>
      </div>
      
      <Tabs defaultValue="jobs">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">Job Management</TabsTrigger>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs" className="space-y-8 mt-8">
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

            <Card>
              <CardHeader>
                <CardTitle>Add New Job</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <Label>1. Paste Job Description</Label>
                  <Textarea
                    placeholder="Paste job details here..."
                    className="min-h-[250px] font-mono text-xs"
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    disabled={isParsing || isPostingJob}
                  />
                  <Button onClick={handleParse} disabled={isParsing || isPostingJob || !jobText}>
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
                </div>
                <div className={`space-y-4 ${!parsedJob && !isParsing ? 'opacity-50' : ''}`}>
                  <Label>2. Review & Post Job</Label>
                   {isParsing && (
                    <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4 rounded-md border border-dashed">
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
                      <Button onClick={handlePostJob} disabled={isPostingJob}>
                        {isPostingJob ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting Job...
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
                      <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4 text-center text-muted-foreground rounded-md border border-dashed">
                        <p>Parsed job details will appear here for review.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Manage Job Listings</CardTitle>
                    <CardDescription>View and remove existing job listings.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingJobs ? (
                         <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                         </div>
                    ) : jobs.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No jobs found.</p>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map(job => (
                                <div key={job.id} className="flex items-center gap-4 rounded-md border p-4">
                                     <Avatar className="h-12 w-12 rounded-lg border hidden sm:flex">
                                        <AvatarImage
                                          src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s/g, '')}.com?size=48`}
                                          alt={`${job.company} logo`}
                                        />
                                        <AvatarFallback className="rounded-lg bg-secondary">
                                          <span className="text-xs font-bold">{getCompanyInitials(job.company)}</span>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{job.title}</h3>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                           <div className="flex items-center gap-1"><Building2 className="h-3 w-3"/> {job.company}</div>
                                           <div className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {job.location}</div>
                                        </div>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="destructive" size="icon" disabled={isDeleting === job.id}>
                                                {isDeleting === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the job listing for "{job.title}". This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete('jobs', job.id!)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

        </TabsContent>
        <TabsContent value="courses" className="space-y-8 mt-8">
             <Card>
                <CardHeader>
                    <CardTitle>Add New Course</CardTitle>
                    <CardDescription>
                        Fill in the details below to add a new learning resource for users.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input id="title" value={course.title} onChange={handleCourseInputChange} placeholder="e.g., Ultimate Next.js Course" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={course.category} onChange={handleCourseInputChange} placeholder="e.g., Frontend, Backend, Full Stack" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={course.description} onChange={handleCourseInputChange} placeholder="A short summary of the course..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="link">Course Link</Label>
                        <Input id="link" type="url" value={course.link} onChange={handleCourseInputChange} placeholder="https://example.com/course" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" type="url" value={course.imageUrl} onChange={handleCourseInputChange} placeholder="https://example.com/image.png" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePostCourse} disabled={isPostingCourse}>
                        {isPostingCourse ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Posting Course...
                            </>
                          ) : (
                            <>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Post Course
                            </>
                          )}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Courses</CardTitle>
                    <CardDescription>View and remove existing learning resources.</CardDescription>
                </CardHeader>
                <CardContent>
                     {loadingCourses ? (
                         <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                         </div>
                    ) : courses.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No courses found.</p>
                    ) : (
                        <div className="space-y-4">
                            {courses.map(c => (
                                <div key={c.id} className="flex items-center gap-4 rounded-md border p-4">
                                     <Image
                                        src={c.imageUrl}
                                        alt={`${c.title} image`}
                                        width={96}
                                        height={54}
                                        className="rounded-md object-cover hidden sm:block"
                                        data-ai-hint="course cover image"
                                     />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{c.title}</h3>
                                        <p className="text-sm text-muted-foreground">{c.category}</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <Button variant="destructive" size="icon" disabled={isDeleting === c.id}>
                                                {isDeleting === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the course "{c.title}". This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete('courses', c.id!)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

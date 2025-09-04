
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, Building2 } from "lucide-react";
import type { JobListing } from "@/types/job-listing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getCompanyInitials = (name: string) => {
  if (!name) return "";
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return initials;
}

export default function JobListingPage() {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "jobs"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobs: JobListing[] = [];
      querySnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...(doc.data() as Omit<JobListing, 'id'>) });
      });
      setJobListings(jobs);

      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
        <p className="text-muted-foreground">
          Explore curated job listings tailored to your career path.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Job title, keywords, or company" className="pl-10" />
            </div>
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Location" className="pl-10" />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Find Jobs</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : jobListings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No job opportunities posted yet. Please check back later.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobListings.map((job) => (
            <Card key={job.id} className="flex flex-col">
              <CardHeader className="flex-row items-start gap-4">
                <Avatar className="h-14 w-14 rounded-lg border">
                    <AvatarImage
                      src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s/g, '')}.com?size=56`}
                      alt={`${job.company} logo`}
                      className="object-contain"
                      data-ai-hint="company logo"
                    />
                    <AvatarFallback className="rounded-lg">
                      <span className="text-xs font-bold">{getCompanyInitials(job.company)}</span>
                    </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3"/>
                    {job.location}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {job.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                  <Button asChild className="w-full">
                      <Link href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</Link>
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

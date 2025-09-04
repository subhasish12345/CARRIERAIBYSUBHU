
import Image from "next/image";
import Link from "next/link";
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
import { MapPin, Search } from "lucide-react";

const jobListings = [
  {
    title: "Multiple Roles",
    company: "HCLTech",
    location: "Across India",
    tags: ["Graduate", "Post Graduate", "4.5-18 LPA"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "tech company logo",
    applyLink: "https://tinyurl.com/bdd45379",
  },
  {
    title: "National Qualifier Test (NQT) 2025",
    company: "TCS",
    location: "Across India",
    tags: ["2021-2027 Batch", "Any Degree", "Up to 19 LPA"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "IT services company logo",
    applyLink: "https://yt.openinapp.co/0m6rt",
  },
  {
    title: "Software Application Development Apprentice",
    company: "Google",
    location: "Bengaluru, Hyderabad, Gurugram",
    tags: ["Apprentice", "Freshers", "Bachelor's Degree"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "google logo",
    applyLink: "https://freshershunt.in/google-software-application-development-apprenticeship/",
  },
  {
    title: "Data Analytics Apprentice",
    company: "Google",
    location: "Bengaluru, Hyderabad, Gurugram",
    tags: ["Apprentice", "Data Analytics", "Freshers"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "google logo",
    applyLink: "https://freshershunt.in/google-data-analytics-apprenticeship/",
  },
  {
    title: "Web Solutions Engineer Intern",
    company: "Google",
    location: "Hyderabad",
    tags: ["Internship", "Web Solutions", "Freshers"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "google logo",
    applyLink: "https://freshershunt.in/google-internship-web-solutions-engineer-intern/",
  },
  {
    title: "Multiple Roles",
    company: "Mphasis",
    location: "Across India",
    tags: ["Graduate", "Post Graduate", "4.5-22 LPA"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "tech company logo",
    applyLink: "https://pdlink.in/4omWEqn",
  },
  {
    title: "New Grad Software Engineer",
    company: "Stripe",
    location: "Bengaluru",
    tags: ["2026 Batch", "New Grad", "₹61.3 LPA"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "fintech company logo",
    applyLink: "https://freshershunt.in/stripe-careers-2026-software-engineering-new-grad/",
  },
  {
    title: "Software Engineering AMTS",
    company: "Salesforce",
    location: "Bangalore & Hyderabad",
    tags: ["2026 Batch", "Freshers", "₹15-36 LPA"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "crm company logo",
    applyLink: "https://freshershunt.in/salesforce-off-campus-drive-2025/",
  },
  {
    title: "Software Engineer Intern",
    company: "Stripe",
    location: "Bengaluru",
    tags: ["Internship", "Recent Batches", "Freshers"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "fintech company logo",
    applyLink: "https://freshershunt.in/stripe-internship-software-engineer-intern/",
  },
  {
    title: "Software Engineer - Summer Internship",
    company: "CISCO",
    location: "Bangalore",
    tags: ["2027 Pass out", "Internship", "₹41K/month"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "networking company logo",
    applyLink: "https://freshershunt.in/cisco-internship-2025/",
  },
  {
    title: "Apprenticeship 2025",
    company: "ISRO",
    location: "Hyderabad",
    tags: ["Diploma", "BE/B.Tech", "Any Graduate"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "space agency logo",
    applyLink: "https://freshershunt.in/isro-apprentices-2025/",
  },
  {
    title: "Software Engineer",
    company: "HCL Tech",
    location: "Hyderabad",
    tags: ["0-2 Years Exp", "4-8 LPA", "Software"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "tech company logo",
    applyLink: "https://tinyurl.com/42c457hc",
  },
  {
    title: "Software Development Engineer I",
    company: "Airtel",
    location: "Gurugram",
    tags: ["0-1 Year Exp", "10-15 LPA", "SDE"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "telecom company logo",
    applyLink: "https://tinyurl.com/45fjjjpd",
  },
  {
    title: "Graduate Engineer Trainee",
    company: "HCLTech",
    location: "PAN India",
    tags: ["2025 Batch", "Freshers", "₹5 LPA"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "tech company logo",
    applyLink: "https://freshershunt.in/hcltech-hiring-graduate-engineer-trainee/",
  },
  {
    title: "Analyst - Data Science",
    company: "American Express",
    location: "Bengaluru & Gurgaon",
    tags: ["Bachelors/Masters", "Freshers", "₹4-7 LPA"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "financial services logo",
    applyLink: "https://tinyurl.com/bdd45379",
  },
];

export default function JobListingPage() {
  return (
    <div className="space-y-8">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobListings.map((job, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4">
               <Image
                src={job.logo}
                alt={`${job.company} logo`}
                width={56}
                height={56}
                className="rounded-lg border"
                data-ai-hint={job.dataAiHint}
              />
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
                {job.tags.map((tag) => (
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
    </div>
  );
}

    
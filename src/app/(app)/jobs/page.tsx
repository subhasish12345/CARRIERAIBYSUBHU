import Image from "next/image";
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
    title: "Senior Frontend Developer",
    company: "Innovatech Solutions",
    location: "Remote",
    type: "Full-time",
    tags: ["React", "TypeScript", "Next.js"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "tech company logo"
  },
  {
    title: "UX/UI Designer",
    company: "Creative Minds Inc.",
    location: "New York, NY",
    type: "Contract",
    tags: ["Figma", "Adobe XD", "User Research"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "design agency logo"
  },
  {
    title: "Product Manager",
    company: "DataDriven Corp.",
    location: "San Francisco, CA",
    type: "Full-time",
    tags: ["Agile", "Roadmap", "Data Analysis"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "corporate logo"
  },
  {
    title: "Cloud Solutions Architect",
    company: "SkyHigh Cloud Services",
    location: "Remote",
    type: "Full-time",
    tags: ["AWS", "Azure", "GCP"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "cloud tech logo"
  },
  {
    title: "Junior Backend Engineer",
    company: "CodeCrafters",
    location: "Austin, TX",
    type: "Full-time",
    tags: ["Node.js", "Python", "PostgreSQL"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "startup logo"
  },
  {
    title: "Marketing Specialist",
    company: "Growth Gurus",
    location: "Boston, MA",
    type: "Part-time",
    tags: ["SEO", "Content Marketing", "Social Media"],
    logo: "https://placehold.co/100x100.png",
    dataAiHint: "marketing company logo"
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
                <Badge variant="secondary">{job.type}</Badge>
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

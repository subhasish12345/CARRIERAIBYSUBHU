import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCheck, Rocket, Target } from "lucide-react";

const roadmapMilestones = [
  {
    title: "Self-Assessment",
    description: "Understand your skills and interests.",
    status: "completed",
    icon: CheckCheck,
  },
  {
    title: "Explore Careers",
    description: "Discover paths that match your profile.",
    status: "active",
    icon: Rocket,
  },
  {
    title: "Skill Development",
    description: "Acquire necessary skills for your chosen path.",
    status: "upcoming",
    icon: Target,
  },
  {
    title: "Job Application",
    description: "Optimize your resume and apply for jobs.",
    status: "upcoming",
    icon: Target,
  },
];

const featureCards = [
    {
        title: "AI Career Assessment",
        description: "Discover your ideal career path based on your unique skills, interests, and personality.",
        link: "/assessment",
        linkText: "Start Assessment"
    },
    {
        title: "Skill Gap Analysis",
        description: "Identify the skills you need for your dream job and get personalized learning recommendations.",
        link: "/skill-gap",
        linkText: "Analyze Skills"
    },
    {
        title: "Resume Optimizer",
        description: "Enhance your resume with AI-powered suggestions to stand out to recruiters.",
        link: "/resume",
        linkText: "Optimize Resume"
    }
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to CareerCompass AI</h1>
        <p className="text-muted-foreground">Your personal guide to navigating your career journey.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Interactive Career Roadmap</CardTitle>
          <CardDescription>
            Visualize your journey and track your progress towards your career goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div
              className="absolute left-5 top-5 h-full w-0.5 bg-border -z-10"
              aria-hidden="true"
            />
            <div className="space-y-8">
              {roadmapMilestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      milestone.status === "completed"
                        ? "border-primary bg-primary/10"
                        : milestone.status === "active"
                        ? "border-primary bg-primary/20 animate-pulse"
                        : "border-border bg-card"
                    }`}
                  >
                    <milestone.icon
                      className={`h-5 w-5 ${
                        milestone.status === "completed"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature, index) => (
            <Card key={index} className="flex flex-col">
                <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                    <Button asChild className="w-full">
                        <Link href={feature.link}>{feature.linkText} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

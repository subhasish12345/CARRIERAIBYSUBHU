import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  
  export default function ProfilePage() {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Keep your information up to date to get the best recommendations.
          </p>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Alex" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="alex.doe@example.com" />
            </div>
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              This information helps us tailor career suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                placeholder="e.g., B.S. in Computer Science, University of Example (2018-2022)"
                defaultValue="B.S. in Computer Science, University of Example (2018-2022)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                placeholder="Enter your skills, separated by commas"
                defaultValue="Python, Graphic Design, Project Management, React, TypeScript"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Textarea
                id="interests"
                placeholder="Enter your interests, separated by commas"
                defaultValue="Technology, Art, Helping Others, Open Source"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Career Goals</Label>
              <Textarea
                id="goals"
                placeholder="Describe your short-term and long-term career goals"
                defaultValue="To become a senior software engineer in a tech-for-good company within 5 years."
              />
            </div>
          </CardContent>
        </Card>
  
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    );
  }
  
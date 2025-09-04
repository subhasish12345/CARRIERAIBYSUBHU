import { z } from "zod";

export const JobListingSchema = z.object({
  id: z.string().optional(),
  title: z.string().describe("The specific job title."),
  company: z.string().describe("The name of the company hiring."),
  location: z.string().describe("The job location(s)."),
  tags: z.array(z.string()).describe("A list of relevant tags like qualifications, salary, or experience level."),
  applyLink: z.string().url().describe("The direct URL to apply for the job."),
});

export type JobListing = z.infer<typeof JobListingSchema>;


import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string().optional(),
  title: z.string().describe("The title of the course."),
  category: z.string().describe("The primary category or skill for the course."),
  description: z.string().describe("A brief description of the course content."),
  link: z.string().url().describe("The direct URL to the course page."),
  imageUrl: z.string().url().describe("A URL for the course's representative image."),
});

export type Course = z.infer<typeof CourseSchema>;

    
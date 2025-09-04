'use server';

/**
 * @fileOverview AI flow to parse unstructured job descriptions into structured data.
 *
 * - parseJobDescription - A function that takes raw text and returns a structured job object.
 * - ParseJobInput - The input type for the parseJobDescription function.
 * - ParseJobOutput - The return type for the parseJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { JobListingSchema } from '@/types/job-listing';

const ParseJobInputSchema = z.object({
  jobText: z.string().describe("The raw, unstructured text of a job posting."),
});
export type ParseJobInput = z.infer<typeof ParseJobInputSchema>;

export type ParseJobOutput = z.infer<typeof JobListingSchema>;

export async function parseJobDescription(input: ParseJobInput): Promise<ParseJobOutput> {
  return parseJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseJobDescriptionPrompt',
  input: {schema: ParseJobInputSchema},
  output: {schema: JobListingSchema},
  prompt: `You are an expert data extraction agent. Your task is to parse an unstructured job posting and extract the key information into a structured JSON format.

**Instructions:**

1.  **Analyze the Text:** Carefully read the entire job posting provided below.
2.  **Extract Key Details:** Identify and extract the following pieces of information:
    *   **title:** The specific job title (e.g., "Software Engineer", "Data Analyst").
    *   **company:** The name of the company hiring for the role.
    *   **location:** The job location (e.g., "Bengaluru", "Across India", "Hyderabad").
    *   **tags:** A list of relevant keywords, qualifications, or salary details. This should be an array of strings (e.g., ["Freshers", "2025 Batch", "10-15 LPA", "Any Degree"]).
    *   **applyLink:** The direct URL to apply for the job. Find the primary application link.
3.  **Handle Missing Information:** If a piece of information is not present in the text, return an appropriate empty value (e.g., an empty string "" or an empty array []). Do not invent data.

**Job Posting Text:**
\`\`\`
{{{jobText}}}
\`\`\`
`,
});

const parseJobDescriptionFlow = ai.defineFlow(
  {
    name: 'parseJobDescriptionFlow',
    inputSchema: ParseJobInputSchema,
    outputSchema: JobListingSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

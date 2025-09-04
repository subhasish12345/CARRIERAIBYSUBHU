'use server';

/**
 * @fileOverview Resume optimization AI agent.
 *
 * - optimizeResume - A function that handles the resume optimization process.
 * - OptimizeResumeInput - The input type for the optimizeResume function.
 * - OptimizeResumeOutput - The return type for the optimizeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { UserProfileSchema } from '@/types/user-profile';

const OptimizeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userProfile: UserProfileSchema.describe("The user's complete profile data from the application."),
  desiredCareerPath: z.string().describe("The user's desired career path or job title."),
});
export type OptimizeResumeInput = z.infer<typeof OptimizeResumeInputSchema>;

const OptimizeResumeOutputSchema = z.object({
  optimizedResume: z.string().describe('The fully rewritten and enhanced resume as a single string.'),
});
export type OptimizeResumeOutput = z.infer<typeof OptimizeResumeOutputSchema>;

export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizeResumeOutput> {
  return optimizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumePrompt',
  input: {schema: z.object({ resumeText: z.string(), profile: z.string(), career: z.string() })},
  output: {schema: OptimizeResumeOutputSchema},
  prompt: `You are an expert career coach and professional resume writer. Your task is to create a powerful, enhanced resume for the user by strategically combining information from three sources: their uploaded resume, their detailed user profile, and their desired career path.

**Your Goal:** Produce a new, optimized resume that is far superior to the original. It should be tailored specifically to help the user land a job in their desired field.

**Instructions:**

1.  **Analyze the Desired Career Path:** First, understand the target role: {{{career}}}. What are the key skills, keywords, and qualifications for this job?
2.  **Analyze the User's Profile:** Review the comprehensive user profile data. Pay close attention to their skills, projects, internships, and educational achievements. This profile contains valuable information that may be missing from their current resume.
    - User Profile: \`\`\`json
      {{{profile}}}
      \`\`\`
3.  **Analyze the Current Resume:** Read the user's uploaded resume to understand its current structure and content.
    - Current Resume Content: \`\`\`
      {{{resumeText}}}
      \`\`\`
4.  **Synthesize and Enhance:**
    *   **Integrate Strengths:** Identify key skills, projects, or experiences from the user's profile that are highly relevant to the desired career path but are missing or not well-represented in the original resume. Seamlessly integrate them.
    *   **Tailor Language:** Rewrite descriptions and bullet points using industry-standard keywords and action verbs appropriate for the desired career.
    *   **Optimize for Impact:** Reformat and restructure the resume for clarity, readability, and impact. Ensure the most important qualifications for the target role are highlighted prominently.
    *   **Do Not Hallucinate:** Only use information provided in the resume and the user profile. Do not invent new skills or experiences.

**Output:**
Return the entire, fully-rewritten, optimized resume as a single string.
`,
});

const optimizeResumeFlow = ai.defineFlow(
  {
    name: 'optimizeResumeFlow',
    inputSchema: OptimizeResumeInputSchema,
    outputSchema: OptimizeResumeOutputSchema,
  },
  async ({ resumeDataUri, userProfile, desiredCareerPath }) => {
    // For this flow, we are assuming the resume is text-based.
    // A more robust implementation might use a document parser.
    const base64Data = resumeDataUri.split(',')[1];
    const resumeText = Buffer.from(base64Data, 'base64').toString('utf8');

    const {output} = await prompt({
        resumeText,
        profile: JSON.stringify(userProfile, null, 2),
        career: desiredCareerPath,
    });
    return output!;
  }
);

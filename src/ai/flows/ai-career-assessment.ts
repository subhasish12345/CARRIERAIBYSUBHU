'use server';

/**
 * @fileOverview AI-powered career assessment flow.
 *
 * - assessCareerPaths - A function that assesses user skills and recommends career paths.
 * - CareerAssessmentInput - The input type for the assessCareerPaths function.
 * - CareerAssessmentOutput - The return type for the assessCareerPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { UserProfileSchema } from '@/types/user-profile';

export type CareerAssessmentInput = z.infer<typeof UserProfileSchema>;

const CareerAssessmentOutputSchema = z.object({
  careerPaths: z
    .array(z.string())
    .describe("A list of the recommended career paths."),
  reasoning: z
    .string()
    .describe("The reasoning behind the career path recommendations."),
});
export type CareerAssessmentOutput = z.infer<typeof CareerAssessmentOutputSchema>;

export async function assessCareerPaths(input: CareerAssessmentInput): Promise<CareerAssessmentOutput> {
  return assessCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessCareerPathsPrompt',
  input: {schema: UserProfileSchema},
  output: {schema: CareerAssessmentOutputSchema},
  prompt: `You are a career counselor AI. Analyze the user's full profile to recommend suitable career paths.
Consider their skills (programming, languages, tools), their experience (bio, projects, internships), and their education.
Provide a list of 3-5 career paths and a detailed reasoning for your recommendations based on the provided profile data.

User Profile:
\`\`\`json
{{{JSON.stringify this}}}
\`\`\`
`,
});

const assessCareerPathsFlow = ai.defineFlow(
  {
    name: 'assessCareerPathsFlow',
    inputSchema: UserProfileSchema,
    outputSchema: CareerAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

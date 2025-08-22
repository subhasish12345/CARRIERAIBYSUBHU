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

const CareerAssessmentInputSchema = z.object({
  skills: z
    .string()
    .describe("A comma separated list of the user's skills."),
  interests: z
    .string()
    .describe("A comma separated list of the user's interests."),
  experience: z
    .string()
    .describe("A summary of the user's work experience."),
  personalityTraits: z
    .string()
    .describe("A comma separated list of the user's personality traits."),
});
export type CareerAssessmentInput = z.infer<typeof CareerAssessmentInputSchema>;

const CareerAssessmentOutputSchema = z.object({
  careerPaths: z
    .string()
    .describe("A comma separated list of the recommended career paths."),
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
  input: {schema: CareerAssessmentInputSchema},
  output: {schema: CareerAssessmentOutputSchema},
  prompt: `You are a career counselor AI. You will analyze the user's skills, interests, experience, and personality traits to recommend suitable career paths.

Skills: {{{skills}}}
Interests: {{{interests}}}
Experience: {{{experience}}}
Personality Traits: {{{personalityTraits}}}

Based on this information, recommend a list of career paths and explain your reasoning.

Career Paths: 
Reasoning: `,
});

const assessCareerPathsFlow = ai.defineFlow(
  {
    name: 'assessCareerPathsFlow',
    inputSchema: CareerAssessmentInputSchema,
    outputSchema: CareerAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

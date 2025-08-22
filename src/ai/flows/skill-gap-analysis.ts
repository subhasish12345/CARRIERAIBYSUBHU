'use server';

/**
 * @fileOverview Analyzes the skill gaps between a user's current skills and their desired career path,
 * providing tailored learning resource recommendations.
 *
 * - skillGapAnalysis - Function to perform skill gap analysis and recommend learning resources.
 * - SkillGapAnalysisInput - Input type for the skillGapAnalysis function.
 * - SkillGapAnalysisOutput - Return type for the skillGapAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillGapAnalysisInputSchema = z.object({
  userSkills: z
    .string()
    .describe('A comma-separated list of the user\'s current skills.'),
  desiredCareerPath: z
    .string()
    .describe('The user\'s desired career path or job title.'),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const SkillGapAnalysisOutputSchema = z.object({
  skillGaps: z
    .string()
    .describe(
      'A list of skill gaps between the user\'s current skills and the requirements for their desired career path.'
    ),
  recommendedResources: z
    .string()
    .describe(
      'A list of tailored learning resources (MOOCs, courses, etc.) to bridge the skill gaps.'
    ),
});
export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

export async function skillGapAnalysis(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const skillGapAnalysisPrompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {schema: SkillGapAnalysisInputSchema},
  output: {schema: SkillGapAnalysisOutputSchema},
  prompt: `You are a career advisor. Analyze the skill gaps between a user's current skills and the requirements for their desired career path. Provide tailored learning resource recommendations.

User's Current Skills: {{{userSkills}}}
Desired Career Path: {{{desiredCareerPath}}}

Skill Gaps:
{{skillGaps}}

Recommended Resources:
{{recommendedResources}}`,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await skillGapAnalysisPrompt(input);
    return output!;
  }
);

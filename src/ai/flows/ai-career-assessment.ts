
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

const CareerPathSchema = z.object({
    title: z.string().describe("The specific job title for the career path."),
    reasoning: z.string().describe("A detailed, point-by-point reasoning that connects the recommendation directly to the user's profile (skills, projects, experience)."),
    nextSteps: z.string().describe("Specific, actionable next steps the user can take to pursue this path (e.g., skills to learn, projects to build, certifications to get)."),
    growthPotential: z.string().describe("A brief overview of the long-term growth potential and opportunities in this career path."),
});

const CareerAssessmentOutputSchema = z.object({
  careerPaths: z
    .array(CareerPathSchema)
    .describe("A list of 2-3 highly detailed and well-reasoned career path recommendations."),
  summary: z
    .string()
    .describe("A summary of the recommendations, highlighting the key themes and strengths from the user's profile."),
});
export type CareerAssessmentOutput = z.infer<typeof CareerAssessmentOutputSchema>;

export async function assessCareerPaths(input: CareerAssessmentInput): Promise<CareerAssessmentOutput> {
  return assessCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessCareerPathsPrompt',
  input: {schema: z.object({ profile: z.string() })},
  output: {schema: CareerAssessmentOutputSchema},
  prompt: `You are a world-class career strategist AI. Your task is to conduct a deep and thorough analysis of the user's profile and provide highly personalized, detailed, and actionable career recommendations.

Analyze every part of the user's profile: their bio, education (including marks), skills, projects, internships, certifications, and languages. Synthesize this information to understand their strengths, weaknesses, interests, and potential.

For each recommended career path, you must provide:
1.  **Title:** A specific and relevant job title.
2.  **Reasoning:** A detailed, point-by-point explanation of WHY this path is a good fit. Directly reference specific items from their profile (e.g., "Your high marks in graduation suggest strong analytical skills, which are crucial for a Data Analyst role," or "The 'Project X' on your profile, where you used React and Node.js, directly maps to the skills needed for a Full-Stack Developer.").
3.  **Next Steps:** Concrete, actionable advice. What specific skills should they learn next? What kind of project should they build for their portfolio? Are there any specific certifications that would make a big impact?
4.  **Growth Potential:** A brief overview of the long-term career trajectory and opportunities in this field.

Provide 2-3 top-tier recommendations. The quality and depth of your analysis are paramount. Avoid generic advice. Be specific, be inspiring, and be strategic.

User Profile:
\`\`\`json
{{{profile}}}
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
    const {output} = await prompt({ profile: JSON.stringify(input, null, 2) });
    return output!;
  }
);

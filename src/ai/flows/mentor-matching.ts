
'use server';

/**
 * @fileOverview A mentor matching AI agent.
 *
 * - findPotentialMentors - A function that handles the mentor matching process.
 * - FindPotentialMentorsInput - The input type for the findPotentialMentors function.
 * - FindPotentialMentorsOutput - The return type for the findPotentialMentors function.
 */

import {ai} from '@/ai/genkit';
import {Alumni} from '@/lib/types';
import {z} from 'genkit';

const AlumniSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  graduationYear: z.number(),
  currentRole: z.string(),
  skills: z.array(z.string()),
  linkedinURL: z.string(),
  shortBio: z.string(),
  avatarUrl: z.string(),
  matchScore: z.number().optional(),
});

const FindPotentialMentorsInputSchema = z.object({
  studentSkillsAndInterests: z
    .string()
    .describe('A description of the student skills and interests.'),
  allAlumni: z.array(AlumniSchema).describe('The full list of alumni to search through.'),
});
export type FindPotentialMentorsInput = z.infer<typeof FindPotentialMentorsInputSchema>;

// The output is an array of Alumni objects, with the matchScore populated.
const FindPotentialMentorsOutputSchema = z.object({
  mentorMatches: z.array(AlumniSchema),
});
export type FindPotentialMentorsOutput = z.infer<typeof FindPotentialMentorsOutputSchema>;

export async function findPotentialMentors(
  input: FindPotentialMentorsInput
): Promise<FindPotentialMentorsOutput> {
  return findPotentialMentorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findPotentialMentorsPrompt',
  input: {schema: FindPotentialMentorsInputSchema},
  output: {schema: FindPotentialMentorsOutputSchema},
  prompt: `You are an expert at finding mentors for students.
You will be given a list of all available alumni and the student's skills and interests.
Your task is to analyze this list and return the top 5 alumni who are the most suitable mentors.

Your ranking MUST heavily prioritize direct matches between the student's interests and the mentor's listed 'skills'. While the 'currentRole' and 'shortBio' are useful for context, the 'skills' field is the most important factor.

For each of the 5 mentors you select, you MUST calculate a "matchScore" from 0-100. This score should represent how well the mentor's profile (especially their skills) aligns with the student's needs. A mentor with a direct skill match should have a significantly higher score.

The student's skills and interests are:
"{{{studentSkillsAndInterests}}}"

Here is the full list of available alumni:
{{json allAlumni}}

Select the best 5 matches from the provided list and return them.
IMPORTANT: Do NOT invent or create new alumni. You MUST only select from the list provided.
`,
});

const findPotentialMentorsFlow = ai.defineFlow(
  {
    name: 'findPotentialMentorsFlow',
    inputSchema: FindPotentialMentorsInputSchema,
    outputSchema: FindPotentialMentorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

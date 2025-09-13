
'use server';

/**
 * @fileOverview A mentor matching AI agent.
 *
 * - findPotentialMentors - A function that handles the mentor matching process.
 * - FindPotentialMentorsInput - The input type for the findPotentialMentors function.
 * - FindPotentialMentorsOutput - The return type for the findPotentialMentors function.
 */

import {ai} from '@/ai/genkit';
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
You will be given the student's skills and interests.
Your task is to generate a list of 5 suitable mentors based on these interests.

For each mentor, you MUST generate a realistic but FAKE name, email, role, bio, and set of skills.
You MUST also calculate a "matchScore" from 0-100 for each mentor, representing how well their generated profile aligns with the student's needs.
For the avatarUrl, you must use the DiceBear API: "https://api.dicebear.com/7.x/initials/json?seed=<NAME>" where <NAME> is the mentor's name.

The student's skills and interests are:
"{{{studentSkillsAndInterests}}}"

Generate 5 fake mentors now.
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
    // Sort the results from the AI by matchScore descending, as an extra guardrail
    const sortedMatches = output?.mentorMatches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    return { mentorMatches: sortedMatches || [] };
  }
);

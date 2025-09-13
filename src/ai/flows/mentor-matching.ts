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

const FindPotentialMentorsInputSchema = z.object({
  studentSkillsAndInterests: z
    .string()
    .describe('A description of the student skills and interests.'),
});
export type FindPotentialMentorsInput = z.infer<typeof FindPotentialMentorsInputSchema>;

const FindPotentialMentorsOutputSchema = z.object({
  mentorMatches: z.array(
    z.object({
      name: z.string().describe('The name of the mentor.'),
      email: z.string().describe('The email of the mentor.'),
      graduationYear: z.string().describe('The graduation year of the mentor.'),
      currentRole: z.string().describe('The current role of the mentor.'),
      skills: z.string().describe('The skills of the mentor.'),
      linkedinURL: z.string().describe('The LinkedIn URL of the mentor.'),
      matchScore: z
        .number()
        .describe('The score of how well the mentor matches the student, from 0 to 100.'),
      shortBio: z.string().describe('A short bio of the mentor.'),
    })
  ),
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
  prompt: `You are an expert at finding mentors for students. Based on the student's skills and interests, you will generate a list of 5 suitable mentors.

Student's Skills and Interests:
"{{{studentSkillsAndInterests}}}"

For each mentor, provide a name, email, graduation year, current role, a list of relevant skills, a LinkedIn URL, a match score (from 0-100), and a short bio. The graduation year should be a 4-digit number. The skills should be a comma-separated string. The match score should represent how well the mentor's profile aligns with the student's needs.`,
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

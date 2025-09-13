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
        .describe('The score of how well the mentor matches the student.'),
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
  prompt: `You are an expert mentor matching AI agent.

You will use this information about the student's skills and interests to find the best mentors.

Student Skills and Interests: {{{studentSkillsAndInterests}}}

Return the top 5 mentors whose skills and interests best match the student's.

Ensure the mentorMatches field is an array of the top 5 mentors.

Use the following format for each mentor:
{
  "name": "",
  "email": "",
  "graduationYear": "",
  "currentRole": "",
  "skills": "",
  "linkedinURL": "",
  "matchScore": 0,
  "shortBio": ""
}
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

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
import type { Alumni } from '@/lib/types';

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
});

const FindPotentialMentorsInputSchema = z.object({
  studentSkillsAndInterests: z
    .string()
    .describe('A description of the student skills and interests.'),
  allAlumni: z.array(AlumniSchema).describe('The full list of alumni to search through for potential mentors.')
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
  prompt: `You are an expert mentor matching AI agent. Your task is to find the most suitable mentors for a student from a provided list of alumni.

You will be given:
1. A description of the student's skills and interests.
2. A JSON list of all available alumni.

Your goal is to analyze the student's needs and compare them against the skills, current role, and bio of each alumnus in the list.

Student's Skills and Interests:
"{{{studentSkillsAndInterests}}}"

List of all available alumni:
"{{{json allAlumni}}}"

Instructions:
1.  Carefully review the list of all alumni.
2.  Select the top 5 alumni who are the best-matched mentors for the student.
3.  For each match, calculate a "matchScore" from 0 to 100 that represents how strong the connection is. A higher score means a better match. Consider skills, industry, and role alignment.
4.  Return ONLY the top 5 mentors as a JSON object that conforms to the output schema. Ensure the 'mentorMatches' field is an array of these 5 mentors.
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

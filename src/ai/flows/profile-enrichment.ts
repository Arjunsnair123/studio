'use server';

/**
 * @fileOverview Automatically extracts and populates profile data from a LinkedIn URL using the OpenAI API tool.
 *
 * - enrichProfile - A function that handles the profile enrichment process.
 * - EnrichProfileInput - The input type for the enrichProfile function.
 * - EnrichProfileOutput - The return type for the enrichProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnrichProfileInputSchema = z.object({
  linkedinUrl: z.string().describe('The LinkedIn profile URL to extract data from.'),
});
export type EnrichProfileInput = z.infer<typeof EnrichProfileInputSchema>;

const EnrichProfileOutputSchema = z.object({
  name: z.string().describe('The name of the alumni.'),
  education: z.string().describe('The education details of the alumni.'),
  skills: z.array(z.string()).describe('The skills of the alumni.'),
  bio: z.string().describe('A short bio of the alumni.'),
});
export type EnrichProfileOutput = z.infer<typeof EnrichProfileOutputSchema>;

export async function enrichProfile(input: EnrichProfileInput): Promise<EnrichProfileOutput> {
  return enrichProfileFlow(input);
}

const extractProfileData = ai.defineTool({
  name: 'extractProfileData',
  description: 'Extracts profile data (name, education, skills, bio) from a LinkedIn URL.',
  inputSchema: z.object({
    linkedinUrl: z.string().describe('The LinkedIn profile URL.'),
  }),
  outputSchema: EnrichProfileOutputSchema,
},
async (input) => {
    // Placeholder implementation:  Return dummy data.  In a real application, this would call an external API
    // or web scraping service to extract the data from the LinkedIn URL.
    console.log(`Calling external service to extract data from ${input.linkedinUrl}`);
    return {
      name: 'John Doe',
      education: 'University of Example',
      skills: ['JavaScript', 'React', 'Node.js'],
      bio: 'A software engineer with experience in full-stack development.',
    };
  }
);

const enrichProfilePrompt = ai.definePrompt({
  name: 'enrichProfilePrompt',
  tools: [extractProfileData],
  prompt: `Extract relevant information from the provided LinkedIn profile URL and pre-populate the alumni's profile fields.

LinkedIn URL: {{{linkedinUrl}}}

Use the extractProfileData tool to get the profile data.
`,  
  input: {schema: EnrichProfileInputSchema},
  output: {schema: EnrichProfileOutputSchema},
});

const enrichProfileFlow = ai.defineFlow(
  {
    name: 'enrichProfileFlow',
    inputSchema: EnrichProfileInputSchema,
    outputSchema: EnrichProfileOutputSchema,
  },
  async input => {
    const {output} = await enrichProfilePrompt(input);
    return output!;
  }
);

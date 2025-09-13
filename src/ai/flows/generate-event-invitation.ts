// src/ai/flows/generate-event-invitation.ts
'use server';

/**
 * @fileOverview AI flow to generate a polished event invitation email from a short note.
 *
 * - generateEventInvitation - A function that generates the email invitation.
 * - GenerateEventInvitationInput - The input type for the generateEventInvitation function.
 * - GenerateEventInvitationOutput - The return type for the generateEventInvitation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventInvitationInputSchema = z.object({
  eventDetails: z
    .string()
    .describe('A short note describing the event details.'),
});

export type GenerateEventInvitationInput = z.infer<
  typeof GenerateEventInvitationInputSchema
>;

const GenerateEventInvitationOutputSchema = z.object({
  emailInvitation: z
    .string()
    .describe('A polished email invitation generated from the event details.'),
});

export type GenerateEventInvitationOutput = z.infer<
  typeof GenerateEventInvitationOutputSchema
>;

export async function generateEventInvitation(
  input: GenerateEventInvitationInput
): Promise<GenerateEventInvitationOutput> {
  return generateEventInvitationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventInvitationPrompt',
  input: {schema: GenerateEventInvitationInputSchema},
  output: {schema: GenerateEventInvitationOutputSchema},
  prompt: `You are an expert email copywriter. Given the following event details, generate a polished and professional email invitation to send to alumni.\n\nEvent Details: {{{eventDetails}}}\n\nEmail Invitation:`,
});

const generateEventInvitationFlow = ai.defineFlow(
  {
    name: 'generateEventInvitationFlow',
    inputSchema: GenerateEventInvitationInputSchema,
    outputSchema: GenerateEventInvitationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

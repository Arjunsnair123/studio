'use server';

import { generateEventInvitation } from '@/ai/flows/generate-event-invitation';
import { findPotentialMentors } from '@/ai/flows/mentor-matching';
import { enrichProfile } from '@/ai/flows/profile-enrichment';
import { z } from 'zod';
import type { Alumni } from './types';

const enrichProfileSchema = z.object({
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn URL." }),
});

export async function enrichAlumniProfile(prevState: any, formData: FormData) {
  const validatedFields = enrichProfileSchema.safeParse({
    linkedinUrl: formData.get('linkedinUrl'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid LinkedIn URL.',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const enrichedData = await enrichProfile(validatedFields.data);
    return {
      message: 'Profile enriched successfully.',
      data: enrichedData,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred during profile enrichment.',
      error: 'AI service failed.',
    };
  }
}

const findMentorsSchema = z.object({
    skillsAndInterests: z.string().min(10, { message: "Please describe your skills and interests." }),
    allAlumni: z.string().min(1, "Alumni list is missing."),
});

export async function findMentorsAction(prevState: any, formData: FormData) {
    const validatedFields = findMentorsSchema.safeParse({
        skillsAndInterests: formData.get('skillsAndInterests'),
        allAlumni: formData.get('allAlumni'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid input.',
            error: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    try {
        const allAlumni: Alumni[] = JSON.parse(validatedFields.data.allAlumni);
        
        const result = await findPotentialMentors({ 
            studentSkillsAndInterests: validatedFields.data.skillsAndInterests,
            allAlumni: allAlumni,
        });

        // The AI now returns full alumni objects, but we need to ensure they have the right shape.
        // We'll map them to add a consistent ID and avatar, similar to before.
        const mentorsWithAvatars: Alumni[] = result.mentorMatches.map((mentor, index) => {
            const originalAlumnus = allAlumni.find(a => a.name === mentor.name && a.email === mentor.email);
            return {
                ...mentor,
                id: originalAlumnus?.id || `mentor-${index}`,
                graduationYear: parseInt(mentor.graduationYear),
                skills: typeof mentor.skills === 'string' ? mentor.skills.split(',').map(s => s.trim()) : [],
                avatarUrl: originalAlumnus?.avatarUrl || `https://picsum.photos/seed/${110 + index}/200/200`,
            }
        });

        return {
            message: 'Mentors found successfully.',
            data: mentorsWithAvatars,
        };
    } catch (error) {
        console.error(error);
        return {
            message: 'An error occurred while finding mentors.',
            error: 'AI service failed.',
        };
    }
}


const generateInvitationSchema = z.object({
    eventDetails: z.string().min(10, { message: "Please provide some event details." }),
});

export async function generateInvitationAction(prevState: any, formData: FormData) {
    const validatedFields = generateInvitationSchema.safeParse({
        eventDetails: formData.get('eventDetails'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid input.',
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await generateEventInvitation({ eventDetails: validatedFields.data.eventDetails });
        return {
            message: 'Invitation generated successfully.',
            data: result,
        };
    } catch (error) {
        console.error(error);
        return {
            message: 'An error occurred while generating the invitation.',
            error: 'AI service failed.',
        };
    }
}

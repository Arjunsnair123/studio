import { config } from 'dotenv';
config();

import '@/ai/flows/mentor-matching.ts';
import '@/ai/flows/profile-enrichment.ts';
import '@/ai/flows/generate-event-invitation.ts';
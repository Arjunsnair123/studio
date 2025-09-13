# **App Name**: AlumniLink

## Core Features:

- Google OAuth Authentication: Allow alumni and admins to authenticate using their Google accounts.
- Alumni Profile Management: Enable CRUD operations for alumni profiles, including name, email, graduation year, current role, skills, and LinkedIn URL.
- AI-Powered Profile Enrichment: Automatically extract and populate profile data (name, education, skills, short bio) from LinkedIn URLs or resumes using the OpenAI API tool.
- Mentor Matching: Match students with alumni mentors based on skills and interests, using vector embeddings and cosine similarity via the OpenAI API.
- Events and Opportunities Board: Allow admins to post events and mentorship opportunities, with RSVP functionality for alumni.
- AI Email Drafting: Generate polished event invitation emails from short notes using the OpenAI API tool.
- Dashboard: Provide separate dashboards for admins (alumni list, events, analytics) and alumni (profile, opportunities).

## Style Guidelines:

- Primary color: Deep blue (#304FFE) for a professional and trustworthy feel.
- Background color: Light blue-gray (#E8EAF6).
- Accent color: Vibrant purple (#9FA8DA) for highlighting key actions.
- Body text: 'PT Sans', a humanist sans-serif.
- Headline text: 'Space Grotesk', a proportional sans-serif.
- Use modern, minimalist icons from Phosphor Icons to maintain a clean interface.
- Implement a responsive layout using Tailwind CSS grid and flexbox for optimal viewing on all devices.
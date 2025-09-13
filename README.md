# AlumniLink

This is a Next.js application for managing alumni relations, built in Firebase Studio. It features AI-powered tools for profile enrichment and mentor matching.

## Getting Started

To get the application running locally, follow these steps:

### Prerequisites

- Node.js (version 18 or later)
- npm (or yarn/pnpm)

### 1. Set up Environment Variables

Before you start, you'll need to set up your environment variables for the Genkit AI services.

1.  Copy the `.env` file to a new file named `.env.local`:
    ```bash
    cp .env .env.local
    ```
2.  Open `.env.local` and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key
    ```
    You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Install Dependencies

Install the necessary packages using npm:

```bash
npm install
```

### 3. Run the Development Servers

You need to run two development servers in separate terminal windows.

**Terminal 1: Start the Next.js App**

This command starts the main web application on port 9002.

```bash
npm run dev
```

**Terminal 2: Start the Genkit AI Services**

This command starts the Genkit server, which powers the AI features of the app.

```bash
npm run genkit:dev
```

Once both servers are running, you can open your browser and navigate to `http://localhost:9002` to see the application in action.

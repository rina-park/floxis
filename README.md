# Floxis (Codename)

AI-assisted task management system that converts natural language into structured data.

This project is built as a learning-focused prototype.

## Overview

Floxis is a minimal task management system built as a PersonalOS prototype.

The goal is to build a system where:
- Users can input tasks in natural language
- AI parses input into structured data
- The application handles logic and persistence

## Tech Stack

- Next.js (App Router)
- Supabase (PostgreSQL)
- Vercel (planned)
- Gemini (planned)

## Setup

```bash
git clone https://github.com/rina-park/floxis
cd floxis
npm install
npm run dev
```

Then open http://localhost:3000

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
```

## Roadmap

- [x] Basic task creation
- [x] Task list display
- [x] Database integration
- [ ] AI parsing
- [ ] Task editing / deletion
- [ ] Workflow management
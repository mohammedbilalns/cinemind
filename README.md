
# CineMind 🎬

CineMind is an AI-powered movie recommendation system that helps users discover movies based on their mood, preferred genre, or a simple description of what they want to watch.

The application combines AI-powered recommendations with movie metadata to provide personalized suggestions, complete with posters, ratings, genres, runtime, and tailored recommendation reasons.

## Tech Stack

* Node.js
* Fastify
* TypeScript
* LangChain
* Zod
* TMDB API

## Project Structure

```text
backend/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   └── index.ts
├── .env
└── package.json

frontend/
├── app/
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── MovieCard.tsx
│   │   ├── ResultsShowcase.tsx
│   │   └── VibeCustomizer.tsx
│   ├── services/
│   │   └── recommendationService.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .env.local
├── next.config.ts
├── package.json
└── tsconfig.json
```


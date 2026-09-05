
# CineMind 🎬

CineMind is an AI-powered movie recommendation system that helps users discover movies based on their mood, preferred genre, or a simple description of what they want to watch.

The application combines AI-powered recommendations with movie metadata to provide personalized suggestions, complete with posters, ratings, genres, runtime, and tailored recommendation reasons.

## How Recommendations Work

Every recommendation is grounded in real TMDB data through a discover-then-rerank pipeline:

1. **Discover** — the requested genre and mood are used to query TMDB's `/discover/movie` endpoint (with rating and vote-count floors, and a randomized page) to build a pool of real, qualifying candidate movies.
2. **Rerank** — the candidate pool is handed to the LLM along with the user's request and mood. The LLM picks and ranks the best matches from that list *by TMDB id*, with a short reason for each, choosing only from the given candidates.
3. **Validate** — the backend checks the LLM's picks against the candidate pool and drops any invalid or duplicate ids before proceeding.
4. **Enrich** — full details (overview, poster, backdrop, genres, rating, runtime) are fetched from TMDB directly by id and combined with the LLM's reasoning to build the final response.

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


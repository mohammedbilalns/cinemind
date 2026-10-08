
# CineMind 🎬

CineMind is an AI-powered movie recommendation system that helps users discover movies based on their mood, preferred genre, or a simple description of what they want to watch.

The application combines AI-powered recommendations with movie metadata to provide personalized suggestions, complete with posters, ratings, genres, runtime, and tailored recommendation reasons.

## How Recommendations Work

Every recommendation relies on a hybrid generation and validation pipeline to ensure you get exactly the vibe and languages you request:

1. **LLM Generation** — Your request (e.g., prompt, mood) and any requested language constraints are passed to the LLM. The LLM acts as a cinephile, picking the best movie titles that match your unique criteria, along with a custom reason for each.
2. **Search & Strict Validation** — The backend searches the TMDB API (`/search/movie`) for each title suggested by the LLM. It verifies the movie exists and applies a **strict post-search filter**. Because LLMs can sometimes hallucinate languages, any movie whose actual `original_language` on TMDB does not match your requested multi-language selection is instantly rejected.
3. **Discover Fallback** — If the strict filter rejects too many of the LLM's suggestions (leaving us short of the requested movie count), the backend automatically falls back to TMDB's native `/discover/movie` endpoint. It uses TMDB's native OR filter parameter (`with_original_language`) to backfill guaranteed valid, highly-rated movies matching your languages.
4. **Enrichment & Localization** — Full details (overview, poster, backdrop, genres, rating, runtime) are fetched from TMDB directly by ID. To localize titles and overviews, the backend requests TMDB text in the *first* language you selected.

Optional request parameters:

* `language` — An array of language codes. Biases the LLM, acts as a strict validation filter against TMDB's `original_language`, filters the Discover fallback, and localizes the TMDB detail lookups.
* `sessionId` — A client-generated id (persisted in the browser's `localStorage`) used to track which movies a session has already been shown, so repeated requests don't resurface the same picks.

TMDB responses (both discover pages and movie details) are cached in-memory with a short TTL to cut down on repeat calls and latency.

## Tech Stack

* Node.js
* Fastify
* TypeScript
* LangChain
* Zod
* TMDB API

## Project Structure

This project uses a monorepo setup with a shared package for common types and constants:

```text
shared/
├── src/
│   ├── constants.ts
│   ├── index.ts
│   └── types.ts
├── package.json
└── tsconfig.json

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


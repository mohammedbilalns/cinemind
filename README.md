
# CineMind 🎬

CineMind is an AI-powered movie recommendation system that helps users discover movies based on their mood, preferred genre, or a simple description of what they want to watch.

The application combines AI-powered recommendations with movie metadata to provide personalized suggestions, complete with posters, ratings, genres, runtime, and tailored recommendation reasons.

## How Recommendations Work

Every recommendation is grounded in real TMDB data through a discover-then-rerank pipeline:

1. **Discover** — the requested genre and mood are used to query TMDB's `/discover/movie` endpoint (with rating and vote-count floors, a randomized page, and optional region/language) to build a pool of real, qualifying candidate movies. Movies already shown to the current session are excluded from the pool, paginating further into TMDB's results if needed to backfill the pool size.
2. **Rerank** — the candidate pool is handed to the LLM along with the user's request and mood. The LLM picks and ranks the best matches from that list *by TMDB id*, with a short reason for each, choosing only from the given candidates.
3. **Validate & backfill** — the backend drops any invalid or duplicate ids the LLM returned, then tops up with the highest-rated remaining candidates if that leaves fewer than the requested count.
4. **Enrich** — full details (overview, poster, backdrop, genres, rating, runtime) are fetched from TMDB directly by id, honoring the requested language, and combined with the LLM's reasoning to build the final response.

Optional request parameters:

* `region` / `language` — bias TMDB's discover and detail lookups toward a specific market and localize titles/overviews.
* `sessionId` — a client-generated id (persisted in the browser's `localStorage`) used to track which movies a session has already been shown, so repeated requests don't resurface the same picks.

TMDB responses (both discover pages and movie details) are cached in-memory with a short TTL to cut down on repeat calls and latency.

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


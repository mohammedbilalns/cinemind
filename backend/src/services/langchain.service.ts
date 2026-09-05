import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RecommendedMoviesSchema } from "../schemas/movie.schema.js";
import { createAgent, modelFallbackMiddleware } from "langchain";
import { TmdbCandidate } from "./tmdb.service.js";


const agent = createAgent({
  model: "groq:qwen/qwen3-32b",
  middleware: [
    modelFallbackMiddleware("google:gemini-2.5-flash"),
  ],
  responseFormat: RecommendedMoviesSchema
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a movie recommendation expert.

You will be given a list of candidate movies (with id, title, overview, release date, and rating).
Choose the best {count} movies from ONLY this candidate list based on:
- user's request
- mood
- how well the overview matches the intent

Never invent a movie or use a tmdbId that isn't in the candidate list.
Never pick the same tmdbId more than once.
Every choice should feel intentional. Do not always pick the most obvious or highest-rated title.`
  ],
  [
    "human",
    `User request: {userPrompt}

Preferences:
- Mood: {mood}
- Number of movies: {count}

Candidate movies:
{candidates}
`
  ]
])



export async function getStructuredRecommendations(input: {
  userPrompt: string;
  mood: string;
  count: number;
  candidates: TmdbCandidate[];
}) {
  const candidatesText = input.candidates
    .map((c) => `- id: ${c.id}, title: "${c.title}" (${c.releaseDate.slice(0, 4)}), rating: ${c.voteAverage}, overview: ${c.overview}`)
    .join("\n");

  const prompt = await promptTemplate.invoke({
    userPrompt: input.userPrompt,
    mood: input.mood,
    count: input.count,
    candidates: candidatesText,
  })

  const result = await agent.invoke({
    messages: prompt.messages
  })
  return result.structuredResponse
}

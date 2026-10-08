import { ChatPromptTemplate } from "@langchain/core/prompts"
import { LlmRecommendationsSchema, LlmMovieSuggestion } from "../schemas/movie.schema.js";
import { createAgent, modelFallbackMiddleware } from "langchain";

const agent = createAgent({
  model: "groq:qwen/qwen3-32b",
  middleware: [
    modelFallbackMiddleware("google:gemini-2.5-flash"),
  ],
  responseFormat: LlmRecommendationsSchema
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a world-class movie recommendation expert.

Based on the user's request and mood, suggest exactly {count} distinct movies.
Dig deep into your knowledge of cinema to provide excellent, highly relevant recommendations. 
Avoid always picking the most obvious blockbusters unless requested. Provide a compelling reason for each choice.

For each movie, provide the exact title and the release year.`
  ],
  [
    "human",
    `User request: {userPrompt}

Preferences:
- Mood: {mood}
- Number of movies: {count}
`
  ]
])

export async function getMovieSuggestions(input: {
  userPrompt: string;
  mood: string;
  count: number;
}): Promise<{ movies: LlmMovieSuggestion[] }> {
  const prompt = await promptTemplate.invoke({
    userPrompt: input.userPrompt,
    mood: input.mood,
    count: input.count,
  })

  const result = await agent.invoke({
    messages: prompt.messages
  })
  
  return result.structuredResponse as { movies: LlmMovieSuggestion[] }
}

import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RecommendedMoviesSchema } from "../schemas/movie.schema.js";
import { createAgent, modelFallbackMiddleware } from "langchain";


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

Return high-quality recommendation based on:
- user's request 
- genre,
- mood, 
- count

Every moview should feel intentional.
Do not recomend only the most obviour titles every time.`
  ],
  [
    "human",
    `User request: {userPrompt}

Prefernces:
- Genre: {genre}
- Mood: {mood}
- Number of moviews : {count},
`
  ]
])



export async function getStructuredRecommendations(input :{
  userPrompt: string; 
  genre: string;
  mood : string; 
  count: number 
} ){
  const prompt = await promptTemplate.invoke(input)

  const result = await agent.invoke({
    messages: prompt.messages
  })
  return result.structuredResponse
}

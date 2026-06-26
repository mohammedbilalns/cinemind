import { ChatGoogle } from "@langchain/google/node"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RecommendedMoviesSchema } from "../schemas/movie.schema.js";

const model = new ChatGoogle({
  model: "gemini-2.5-flash",
  temperature: 0.3,
})

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


const structuredModel = model.withStructuredOutput(RecommendedMoviesSchema)

export async function getStructuredRecommendations(input :{
  userPrompt: string; 
  genre: string;
  mood : string; 
  count: number 
} ){
  const chain = promptTemplate.pipe(structuredModel)

  const result = await chain.invoke(input)
  console.log(result)
  return result
}

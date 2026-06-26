import { ChatGoogle } from "@langchain/google/node"
import { ChatPromptTemplate } from "@langchain/core/prompts"

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

Every moview should feel intenstional.
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

export async function getRecommendations(input: {
  userPrompt: string; 
  genre: string;
  mood : string; 
  count: number 
}){

  const chain  = promptTemplate.pipe(model)

  const response = await chain.invoke({
    userPrompt: input.userPrompt,
    genre : input.genre,
    mood : input.mood,
    count : input.count
  })

  console.log(response.text)

  return response.text
}

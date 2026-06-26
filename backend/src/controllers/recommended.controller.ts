import { FastifyRequest, FastifyReply } from "fastify";
import { getStructuredRecommendations } from "../services/langchain.service.js";


export async function recommendedMovies(
  request : FastifyRequest,
  reply : FastifyReply 
){

  try {

    const body = request.body as {
      userPrompt?: string;
      genre?: string;
      mood?: string;
      count?: number;
    };

    const userPrompt =
      body.userPrompt?.trim() || "Suggest movie for a rainy night";

    const genre = body.genre?.trim() || "thriller";

    const mood = body.mood?.trim() || "relaxed";

    const count = body.count ?? 2;

    const result = await getStructuredRecommendations({
      userPrompt,
      genre,
      mood,
      count
    })

    return result

  }catch(err){
    console.log(err)
    return reply.status(500).send({
      error : "Something went wrong"
    })
  }

}

import Fastify from "fastify";
import { envSchema } from "./config/env.js";
import fastifyEnv from "@fastify/env";
import cors from "@fastify/cors"
import { recommendationBodySchema } from "./schemas/recommendation.schema.js";
import { recommendedMovies } from "./controllers/recommended.controller.js";

const fastify = Fastify({
  logger: true ,
})

await fastify.register(fastifyEnv, {
  schema: envSchema
})

await fastify.register(cors , {
  origin: fastify.config.CLIENT_URL,
})


fastify.get("/health", async function handler() {
  return { status: "ok" }
})

fastify.post(
  "/api/recommendations",
  {
    schema: recommendationBodySchema,
  },
  recommendedMovies
)


try {
  await fastify.listen({
    host: fastify.config.HOST,
    port: fastify.config.PORT
  })

}catch(err){
  fastify.log.error(err)
  process.exit(1)
}

import Fastify from "fastify";
import { envSchema } from "./config/env.js";
import fastifyEnv from "@fastify/env";
import cors from "@fastify/cors"
import { recommendationSchema } from "./schemas/recommendation.schema.js";
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


fastify.get("/health", async function hanlder() {
  return { status: "ok" }
})

fastify.post(
  "/api/recommendations",
  {
    schema: recommendationSchema,
  },
  recommendedMovies
)


try {
  await fastify.listen({
    port: fastify.config.PORT
  })

}catch(err){
  fastify.log.error(err)
  process.exit(1)
}


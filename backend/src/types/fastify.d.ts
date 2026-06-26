import "@fastify/env";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      CLIENT_URL: string;
      GOOGLE_API_KEY: string;
      TMDB_API_KEY?: string;
    };
  }
}

import { FastifyRequest, FastifyReply } from "fastify";
import { getMovieVideos } from "../services/tmdb.service.js";

export async function getTrailer(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const movieId = parseInt(request.params.id, 10);
    if (isNaN(movieId)) {
      return reply.status(400).send({ error: "Invalid movie ID" });
    }

    const videos = await getMovieVideos(movieId);
    
    // Find a trailer on YouTube
    const trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer");
    
    if (!trailer) {
      // Fallback to any YouTube video if no formal trailer
      const anyVideo = videos.find(v => v.site === "YouTube");
      if (anyVideo) {
         return reply.send({ key: anyVideo.key, name: anyVideo.name });
      }
      return reply.status(404).send({ error: "No trailer found" });
    }

    return reply.send({ key: trailer.key, name: trailer.name });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Failed to fetch trailer" });
  }
}

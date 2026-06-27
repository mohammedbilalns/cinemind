export const envSchema = {
  type: "object",
  required: ["PORT","GOOGLE_API_KEY","CLIENT_URL","TMDB_API_KEY","HOST"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    CLIENT_URL: {
      type: "string",
    },
    GOOGLE_API_KEY : {
      type: "string",
    },
    TMDB_API_KEY : {
      type: "string",
    },
    HOST:{
      type: "string",
      default: "0.0.0.0",
    }
  },
} as const 


export const envSchema = {
  type: "object",
  required: ["PORT","GOOGLE_API_KEY"],
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
    }
  },
} as const 

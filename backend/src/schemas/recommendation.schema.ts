import { GENRE_OPTIONS, MOOD_OPTIONS } from "../constants/userOptions.js";

export const recommendationBodySchema = {
  body : {
    type : "object",
    additionalProperties : false,
    properties : {
      userPrompt: {
        type: "string",
        maxLength : 100
      },
      genre : {
        type: "string",
        maxLength : 50,
        enum : GENRE_OPTIONS,
      },
      mood : {
        type: "string",
        maxLength : 50,
        enum : MOOD_OPTIONS
      },
      count: {
        type: "integer",
        minimum : 1 ,
        maximum : 30,
      },
      sessionId: {
        type: "string",
        maxLength : 100,
      },
      region: {
        type: "string",
        minLength : 2,
        maxLength : 2,
      },
      language: {
        type: "string",
        maxLength : 10,
      }
    }
  }
}

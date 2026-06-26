

export const recommendationSchema = {
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
        maxLength : 50
      },
      mood : {
        type: "string",
        maxLength : 50,
      },
      count: {
        type: "integer",
        minimum : 1 , 
        maximum : 30,
      }
    }
  }
}

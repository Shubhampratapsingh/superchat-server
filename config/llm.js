const { groq } = require("@ai-sdk/groq");
const { LLM_MODEL } = require("../constants/shared");

const groqModel = (modelName = LLM_MODEL) =>
  groq(modelName, {
    apiKey: process.env.GROQ_API_KEY,
  });

module.exports = {
  groqModel,
};

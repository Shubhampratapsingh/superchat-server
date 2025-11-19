const { Agent } = require("@mastra/core/agent");
const { groqModel } = require("../config/llm");
const { LLM_MODEL } = require("../constants/shared");

async function generateAIResponse({
  name = "AI Assistant",
  instructions = "",
  messages = [],
  model = LLM_MODEL,
}) {
  try {
    const chatAgent = new Agent({
      name,
      instructions,
      model: groqModel(model),
    });

    const formattedMessages = Array.isArray(messages)
      ? messages
      : [{ role: "user", content: messages }];

    const response = await chatAgent.generateVNext(formattedMessages);
    return response?.text || "";
  } catch (err) {
    console.error(`[generateAIResponse Error]:`, err);
    throw new Error(err.message || "AI generation failed");
  }
}

module.exports = { generateAIResponse };

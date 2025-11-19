const { Agent } = require("@mastra/core/agent");
const { Composio } = require("@composio/core");
const { MastraProvider } = require("@composio/mastra");
const { groqModel } = require("../config/llm");
const { LLM_MODEL } = require("../constants/shared");

const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;

const composio = new Composio({
  apiKey: COMPOSIO_API_KEY,
  provider: new MastraProvider(),
});

async function generateAIResponse({
  userId,
  name = "AI Assistant",
  instructions = "",
  messages = [],
  model = LLM_MODEL,
}) {
  try {
    const toolsResponse = await composio.tools.get(userId, {
      tools: ["GMAIL_SEND_EMAIL"],
    });

    function extractTool(obj) {
      if (!obj) return null;
      if (obj.id) return obj;
      const vals = Object.values(obj);
      if (vals.length === 1 && vals[0] && vals[0].id) return vals[0];
      return obj;
    }

    let toolsList = [];
    if (Array.isArray(toolsResponse)) {
      toolsList = toolsResponse.map(extractTool).filter(Boolean);
    } else {
      const t = extractTool(toolsResponse);
      if (t) toolsList = [t];
    }

    toolsList = toolsList.flatMap((tool) => {
      if (!tool || !tool.id) return [tool];

      const out = [tool];

      if (tool.id !== "send_email") {
        const alias = Object.assign(
          Object.create(Object.getPrototypeOf(tool)),
          tool
        );
        alias.id = "send_email";
        out.push(alias);
      }

      return out;
    });

    const chatAgent = new Agent({
      name,
      instructions,
      model: groqModel(model, { max_tokens: 500 }),
      tools: toolsList,
    });

    const formattedMessages = Array.isArray(messages)
      ? messages
      : [{ role: "user", content: messages }];

    const response = await chatAgent.generate(formattedMessages);
    return response?.text || "";
  } catch (err) {
    console.error(`[generateAIResponse Error]:`, err);
    throw new Error(err.message || "AI generation failed");
  }
}

module.exports = { generateAIResponse };

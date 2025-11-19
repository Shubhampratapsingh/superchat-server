const axios = require("axios");
const { Composio } = require("@composio/core");
const { MastraProvider } = require("@composio/mastra");
const { INTEGRATION_BASE_URL } = require("../constants/shared");
const { generateAIResponse } = require("../utils/shared");

const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;

const composio = new Composio({
  apiKey: COMPOSIO_API_KEY,
  provider: new MastraProvider(),
});

const connectAccount = async (req, res) => {
  try {
    const { providerId } = req.body;
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const connectionRequest = await composio.connectedAccounts.link(
      userId,
      providerId
    );

    const redirectUrl = connectionRequest.redirectUrl;
    console.log(
      `Please authorize the app by visiting this URL: ${redirectUrl}`
    );

    res.json({
      success: true,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error connecting account:", error);
    res.status(500).json({ error: "Error connecting account" });
  }
};

const getAllUserConnection = async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const response = await axios.get(
      `${INTEGRATION_BASE_URL}/connected_accounts?user_ids=${userId}`,
      {
        headers: {
          "x-api-key": COMPOSIO_API_KEY,
        },
      }
    );

    res.json({
      success: true,
      connections: response?.data?.items || [],
    });
  } catch (error) {
    console.error(
      "Error fetching connections:",
      error?.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to fetch connections",
      details: error?.response?.data || null,
    });
  }
};

const deleteConnection = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Missing connection ID" });
    }

    await axios.delete(`${INTEGRATION_BASE_URL}/connected_accounts/${id}`, {
      headers: {
        "x-api-key": COMPOSIO_API_KEY,
      },
    });

    res.json({
      success: true,
      message: `Connection ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(
      "Error deleting connection:",
      error?.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      error: "Failed to delete connection",
      details: error?.response?.data || null,
    });
  }
};

const superChat = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { chatId, query } = req.body;

    if (!chatId || !userId || !query) {
      return res
        .status(400)
        .json({ error: "chatId and userId and query are required" });
    }

    const answer = await generateAIResponse({
      userId,
      chatId,
      name: "Ask AI",
      instructions: `
  You are a helpful AI assistant.Answer concisely and naturally to user's question. `,
      messages: `${query}`,
    });

    return res.json({ query, answer });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res
      .status(500)
      .json({ error: "Failed to get AI answer", detail: error.message });
  }
};

const getProvidersListForHomepage = async (req, res) => {
  try {
    const response = await axios.get(`${INTEGRATION_BASE_URL}/auth_configs`, {
      headers: {
        "x-api-key": COMPOSIO_API_KEY,
      },
    });

    const simplifiedConnections = (response?.data?.items || []).map((item) => ({
      id: item.id,
      name: item.toolkit?.slug || item.name,
      logo: item.toolkit?.logo || null,
    }));

    res.json({
      success: true,
      connections: simplifiedConnections,
    });
  } catch (error) {
    console.error(
      "Error fetching connections:",
      error?.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error: "Failed to fetch connections",
      details: error?.response?.data || null,
    });
  }
};

module.exports = {
  connectAccount,
  getAllUserConnection,
  deleteConnection,
  superChat,
  getProvidersListForHomepage,
};

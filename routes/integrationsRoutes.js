const express = require("express");
const router = express.Router();
const {
  connectAccount,
  getAllUserConnection,
  deleteConnection,
  superChat,
  getProvidersListForHomepage,
} = require("../controllers/integrationsController");
const { requireAuth } = require("@clerk/express");

router.get("/integrations-list", getProvidersListForHomepage);
router.post("/connect", requireAuth(), connectAccount);
router.delete("/delete-connection/:id", requireAuth(), deleteConnection);
router.get("/connections", requireAuth(), getAllUserConnection);
router.post("/chat", requireAuth(), superChat);

module.exports = router;

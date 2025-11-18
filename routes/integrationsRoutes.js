const express = require("express");
const router = express.Router();
const {
  connectAccount,
  getAllUserConnection,
  deleteConnection,
  superChat,
  getAllProviders,
  getProvidersListForHomepage,
} = require("../controllers/integrationsController");
const { requireAuth } = require("@clerk/express");

router.get("/providers", requireAuth(), getAllProviders);
router.get("/integrations-list", getProvidersListForHomepage);
router.post("/connect", requireAuth(), connectAccount);
router.delete("/delete-connection/:id", requireAuth(), deleteConnection);
router.get("/connections", requireAuth(), getAllUserConnection);
router.post("/superchat", requireAuth(), superChat);

module.exports = router;

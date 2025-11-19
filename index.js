const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { requireAuth } = require("@clerk/express");
const connectDB = require("./config/db");

connectDB();
const app = express();
const PORT = process.env.PORT || 9002;

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: false, limit: "25mb" }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
      "https://smartai-chat.vercel.app",
    ],
  })
);

// Routes
app.use("/integrations", require("./routes/integrationsRoutes"));

app.get("/privateTest", requireAuth(), (req, res) => {
  const { userId } = req.auth();
  res.json({ message: "You are authenticated!", userId });
});
app.get("/publicTest", (req, res) => {
  res.json({ message: "You are not authenticated!" });
});

app.listen(PORT, () => console.log("SERVER IS RUNNING on port", PORT));

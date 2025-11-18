const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);

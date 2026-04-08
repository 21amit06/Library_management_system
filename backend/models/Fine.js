const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema({
  userId: String,
  amount: Number,
  paid: Boolean
});

module.exports = mongoose.model("Fine", fineSchema);
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  totalCopies: Number,
  availableCopies: Number,
  shelfId: String
});

module.exports = mongoose.model("Book", bookSchema);
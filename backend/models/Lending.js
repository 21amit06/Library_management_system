const mongoose = require("mongoose");

const lendingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: {
    type: String,
    enum: ["issued", "returned"]
  }
});

module.exports = mongoose.model("Lending", lendingSchema);
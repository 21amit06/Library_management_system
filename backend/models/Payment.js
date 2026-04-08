const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  fineId: String,
  method: String,
  status: String
});

module.exports = mongoose.model("Payment", paymentSchema);
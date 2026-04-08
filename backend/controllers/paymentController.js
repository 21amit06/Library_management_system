const Payment = require("../models/Payment");
const Fine = require("../models/Fine");

exports.payFine = async (req, res) => {
  const { fineId, method } = req.body;

  await Payment.create({
    fineId,
    method,
    status: "success"
  });

  await Fine.findByIdAndUpdate(fineId, { paid: true });

  res.json({ message: "Payment successful" });
};
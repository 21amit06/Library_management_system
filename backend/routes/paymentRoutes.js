const express = require("express");
const router = express.Router();
const { payFine } = require("../controllers/paymentController");

router.post("/pay", payFine);

module.exports = router;
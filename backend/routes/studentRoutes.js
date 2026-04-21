const express = require("express");
const router = express.Router();

const { getDashboard, getStudentByRoll } = require("../controllers/studentController");
const auth = require("../middleware/authMiddleware");

router.get("/dashboard", auth, getDashboard);

router.get("/by-roll/:roll", auth, getStudentByRoll);

module.exports = router;
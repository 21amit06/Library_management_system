const express = require("express");
const router = express.Router();
const { issueBook, returnBook } = require("../controllers/lendingController");
// 🔥 Add this line to debug
console.log(issueBook, returnBook)
router.post("/issue", issueBook);
router.post("/return", returnBook);

module.exports = router;
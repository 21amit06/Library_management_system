const express = require("express");
const router = express.Router();
const { addBook, getBooks } = require("../controllers/bookController");

router.post("/add", addBook);
router.get("/", getBooks);

module.exports = router;
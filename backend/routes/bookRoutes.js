const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", bookController.getBooks);

// librarian only
router.post("/", auth, role("librarian"), bookController.addBook);

module.exports = router;
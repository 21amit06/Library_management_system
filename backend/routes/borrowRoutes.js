const express = require("express");
const router = express.Router();

const borrowController = require("../controllers/borrowController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
// librarian assigns book
router.post("/assign", auth, role("librarian"), borrowController.assignBook);
// return book
router.post("/return/:id", auth, borrowController.returnBook);
// librarian view all
router.get("/all", auth, role("librarian"), borrowController.getAllBorrows);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getDashboard,
  addBook,
  deleteBook,
  assignBook,
  sendReminder,
  returnBook
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");

router.get("/dashboard", auth, getDashboard);
router.post("/add-book", auth, addBook);
router.delete("/delete-book/:id", auth, deleteBook);
router.post("/assign-book", auth, assignBook);
router.post("/return-book/:id", auth, returnBook);
router.post("/reminder/:id", auth, sendReminder);

module.exports = router;
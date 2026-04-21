const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const User = require("../models/User");

// ASSIGN BOOK (LIBRARIAN)
const assignBook = async (req, res) => {
  try {
    const { rollNumber, bookId } = req.body;

    // find student
    const user = await User.findOne({ rollNumber });

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // find book
    const book = await Book.findById(bookId);

    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // reduce available copies
    book.availableCopies -= 1;
    await book.save();

    // create borrow entry
    const borrow = await Borrow.create({
      studentId: user._id,
      bookId: book._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    res.json({ message: "Book assigned successfully", borrow });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Assign error" });
  }
};

// RETURN BOOK
const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({ message: "Record not found" });
    }

    borrow.status = "returned";
    borrow.returnDate = new Date();
    await borrow.save();

    // increase book count
    const book = await Book.findById(borrow.bookId);
    book.availableCopies += 1;
    await book.save();

    res.json({ message: "Book returned" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

// LIBRARIAN VIEW
const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("bookId")
      .populate("studentId");

    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

module.exports = {
  assignBook,
  returnBook,
  getAllBorrows
};
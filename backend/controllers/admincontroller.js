const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const User = require("../models/User");
const { sendEmail } = require("../services/notificationService");

// DASHBOARD 
exports.getDashboard = async (req, res) => {
  try {

    const books = await Book.find();

    // TOTAL BOOKS 
    const totalBooks = books.reduce((sum, b) => {
      return sum + (b.totalCopies || 0);
    }, 0);

    // CORRECT BORROW COUNT 
    const borrowedCount = await Borrow.countDocuments({
      status: "borrowed"
    });

    console.log("BORROWED COUNT 👉", borrowedCount); // DEBUG

    res.json({
      totalBooks,
      borrowedCount
    });

  } catch (err) {
    console.log("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Error" });
  }
};

//  ADD BOOK
exports.addBook = async (req, res) => {
  try {

    const { title, author, totalCopies } = req.body;

    const book = await Book.create({
      title,
      author,
      totalCopies,
      availableCopies: totalCopies
    });

    res.json(book);

  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// DELETE BOOK
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
};

// ASSIGN BOOK
exports.assignBook = async (req, res) => {
  try {

    const { rollNumber, bookId } = req.body;

    const user = await User.findOne({ rollNumber });
    const book = await Book.findById(bookId);

    if (!user) return res.status(404).json({ message: "Student not found" });
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    await Borrow.create({
      studentId: user._id,
      bookId: book._id,
      dueDate,
      status: "borrowed"
    });

    book.availableCopies -= 1;
    await book.save();

    await sendEmail(
      user.email,
      "Book Assigned",
      `You have been assigned "${book.title}". Return within 7 days.`
    );

    res.json({ message: "Book Assigned" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

// RETURN BOOK
exports.returnBook = async (req, res) => {
  try {

    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (borrow.status === "returned") {
      return res.status(400).json({ message: "Already returned" });
    }

    borrow.status = "returned";
    borrow.returnDate = new Date();

    await borrow.save();

    const book = await Book.findById(borrow.bookId);

    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ message: "Book Returned Successfully" });

  } catch (err) {
    console.log("RETURN ERROR:", err);
    res.status(500).json({ message: "Error returning book" });
  }
};

// REMINDER
exports.sendReminder = async (req, res) => {
  try {

    const borrow = await Borrow.findById(req.params.id)
      .populate("studentId")
      .populate("bookId");

    await sendEmail(
      borrow.studentId.email,
      "Reminder",
      `Return book ${borrow.bookId.title}`
    );

    res.json({ message: "Reminder Sent" });

  } catch {
    res.status(500).json({ message: "Error" });
  }
};
const Book = require("../models/Book");

// GET BOOKS
exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

// ADD BOOK
exports.addBook = async (req, res) => {
  const { title, author, totalCopies } = req.body;

  const book = await Book.create({
    title,
    author,
    totalCopies,
    availableCopies: totalCopies
  });

  res.json(book);
};
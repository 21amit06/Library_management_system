const Book = require("../models/Book");

exports.addBook = async (req, res) => {
    try{
  const book = await Book.create(req.body);
  res.json(book);}
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};
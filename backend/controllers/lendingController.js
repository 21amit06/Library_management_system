const Lending = require("../models/Lending");
const Book = require("../models/Book");
const Fine = require("../models/Fine");

// ✅ IMPORTANT: use exports.issueBook
exports.issueBook = async (req, res) => {
  try {
    res.json({ message: "Issue API working" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ IMPORTANT: use exports.returnBook
exports.returnBook = async (req, res) => {
  try {
    res.json({ message: "Return API working" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
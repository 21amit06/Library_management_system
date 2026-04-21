const Borrow = require("../models/Borrow");
const User = require("../models/User");

// DASHBOARD
const getDashboard = async (req, res) => {
  try {

    const borrows = await Borrow.find({
      studentId: req.user.id,
      status: "borrowed"
    }).populate("bookId");

    // total borrowed
    const totalBorrowed = borrows.length || 0;

    
    let totalFine = 0;

    // due soon (next 3 days)
    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + 3);

    let dueSoon = [];
    let overdue = [];

    borrows.forEach(b => {

      totalFine += b.fine || 0;

      if (b.dueDate >= today && b.dueDate <= next) {
        dueSoon.push(b);
      }

      if (b.dueDate < today) {
        overdue.push(b);
      }

    });

    // last borrowed
    const lastBorrowed = borrows.length > 0
      ? borrows.sort(
          (a, b) => new Date(b.borrowDate) - new Date(a.borrowDate)
        )[0]
      : null;

    res.json({
      totalBorrowed,
      totalFine,
      dueSoon,
      overdue,
      lastBorrowed,
      borrowedBooks: borrows || [],   
      user: {
        name: req.user.name,
        rollNumber: req.user.rollNumber
      }
    });

  } catch (err) {
    console.log("STUDENT DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Error" });
  }
};



// GET STUDENT BY ROLL
const getStudentByRoll = async (req, res) => {
  try {

    const roll = req.params.roll.trim();

    console.log("Searching roll:", roll); // DEBUG

    // FIND STUDENT
    const student = await User.findOne({
      rollNumber: { $regex: `^${roll}$`, $options: "i" }
    });

    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    // FIND BORROWED BOOKS
    const borrowed = await Borrow.find({
      studentId: student._id,   
      status: "borrowed"
    }).populate("bookId");

    res.json(borrowed || []);

  } catch (err) {
    console.log("GET STUDENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { 
  getDashboard,
  getStudentByRoll   
};
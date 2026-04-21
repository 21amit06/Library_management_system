const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const LIBRARIAN_CODE = "LIB123";

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, rollNumber, password, email, role, code } = req.body;

    //check required fields
    if (!name || !rollNumber || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user exists
    const exist = await User.findOne({ rollNumber });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    //librarian protection
    if (role === "librarian") {
      if (code !== LIBRARIAN_CODE) {
        return res.status(403).json({ message: "Invalid librarian code" });
      }
    }

    //hash password
    const hashed = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      name,
      rollNumber,
      email,
      password: hashed,
      role: role || "student"
    });

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.log("REGISTER ERROR:", err); 
    res.status(500).json({ message: err.message }); // send actual error
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { rollNumber, password, code } = req.body;

    let user;

    // Librarian login using code
    if (code) {
      user = await User.findOne({ role: "librarian" });
      if (!user) {
        return res.status(400).json({ message: "Librarian not found" });
      }
    } else {
      // Student login
      user = await User.findOne({ rollNumber });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
  token,
  role: user.role,
  rollNumber: user.rollNumber,
  name: user.name
});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error" });
  }
};
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    // GET FULL USER
    const user = await User.findById(decoded.id);
    req.user = user; // now has name, rollNumber
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
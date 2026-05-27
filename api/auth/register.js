const bcrypt = require("bcryptjs");
const connectDB = require("../lib/db");
const { createToken, formatUser, sendError } = require("../lib/auth");
const User = require("../models/User");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user"
    });

    return res.status(201).json({
      token: createToken(user._id),
      user: formatUser(user)
    });
  } catch (error) {
    return sendError(res, error, "Registration failed");
  }
};

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

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      token: createToken(user._id),
      user: formatUser(user)
    });
  } catch (error) {
    return sendError(res, error, "Login failed");
  }
};

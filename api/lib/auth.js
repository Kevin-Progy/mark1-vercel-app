const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("../models/User");

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

function formatUser(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileCompleted: user.profileCompleted
  };
}

async function getAuthUser(req) {
  await connectDB();

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    const error = new Error("Not authorized, token missing");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      const error = new Error("Not authorized, user not found");
      error.statusCode = 401;
      throw error;
    }

    return user;
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.message = error.message || "Not authorized, token invalid";
    throw error;
  }
}

function sendError(res, error, fallbackMessage = "Server error") {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || fallbackMessage
  });
}

module.exports = {
  createToken,
  formatUser,
  getAuthUser,
  sendError
};

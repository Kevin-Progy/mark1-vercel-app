const connectDB = require("../lib/db");
const { getAuthUser, sendError } = require("../lib/auth");
const Interest = require("../models/Interest");

const populateInterest = (query) =>
  query
    .populate("fromUserId", "name email role")
    .populate("toUserId", "name email role");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const user = await getAuthUser(req);
    const toUserId = req.body.toUserId || req.query.userId;

    if (!toUserId) {
      return res.status(400).json({ message: "Target user id is required" });
    }

    if (String(user._id) === String(toUserId)) {
      return res.status(400).json({ message: "You cannot send interest to yourself" });
    }

    const existing = await Interest.findOne({
      fromUserId: user._id,
      toUserId
    });

    if (existing) {
      return res.status(409).json({ message: "Interest already sent" });
    }

    const interest = await Interest.create({
      fromUserId: user._id,
      toUserId
    });

    const populated = await populateInterest(Interest.findById(interest._id));
    return res.status(201).json(populated);
  } catch (error) {
    return sendError(res, error, "Could not send interest");
  }
};
